#!/bin/sh
//usr/bin/true && _R="$PWD"
//bin/test $(uname) != Darwin && _W="${XDG_DATA_HOME:-$HOME/.local/share}/pkgo"
//bin/test $(uname) = Darwin && _W="$HOME/Library/Application Support/pkgo"
//bin/test $(basename $0) == entrypoint.ts && _R="$_R,$(dirname $0)"
//bin/test "$TMPDIR" && _W="$_W,$TMPDIR"
//bin/test "$TMP" && _W="$_W,$TMP"
//bin/test "$TEMP" && _W="$_W,$TEMP"
//usr/bin/true && exec pkgx --quiet +git deno^2 run --ext=ts --allow-run --allow-env=HOME,XDG_CACHE_HOME --allow-read="$_R,$_W" --allow-write="$_W" "$0" "$@"

import { parse } from "jsr:@std/yaml@^1.0.5";
import {
  basename as std_basename,
  dirname,
  fromFileUrl,
  join,
} from "jsr:@std/path@^1.0.8";
import { existsSync } from "jsr:@std/fs@1.0.10";

interface Manifest {
  repository: string
  homepage?: string
  name?: string
  shortname: string
  brief: string
  description?: string
  documentation?: string
  resources?:string
  sandbox?: string[]
}

class PackageNotFoundError extends Error {
  constructor(readonly _pkgs: [string, Manifest][]) {
    super("could not determine package");
    this.pkgs = _pkgs;
  }
  pkgs: [string, Manifest][];
}

////////////////////////////////////////////////////////////////////////////////

try {
  await go();
} catch (err) {
  console.error("%cerror", 'color:red', (err as Error).message);

  if (err instanceof PackageNotFoundError) {
    console.error("supported packages:");
    for (const [pkgname, {brief, repository, name}] of err.pkgs) {
      console.error();
      console.error(`%c${name ?? pkgname}:`, 'color:yellow', brief);
      console.error("  git clone", repository);
      console.error(`  cd ${std_basename(repository)} && pkgo`);
    }
  }

  Deno.exit(1);
}

////////////////////////////////////////////////////////////////////////////////

async function go() {
  const repo = await determine_repo();
  const manifests = await fetch_manifests();
  const [manifest, script] = await find_manifest(repo, manifests);
  await main(manifest, script);
}

async function determine_repo() {
  const proc = new Deno.Command("git", {
    args: ["config", "--get", "remote.origin.url"],
    stdout: "piped"
  }).spawn();

  const { success } = await proc.status;
  if (!success) return "<failed>";  // hack to cause find_manifest to fail and populate the right error
  const url = new TextDecoder().decode((await proc.output()).stdout).trim();
  return convert_url_to_https(url);
}

function convert_url_to_https(input: string) {
  if (input.startsWith("git@")) {
    return input.replace(":", "/").replace("git@", "https://").slice(0, -4);
  } else {
    return input;
  }
}

async function find_manifest(repo: string, manifests: string): Promise<[Manifest, string]> {
  const pkgs: [string, Manifest][] = [];

  for await (let { name, isFile } of Deno.readDir(manifests)) {
    if (!isFile) continue;
    const path = join(manifests, name);
    const yaml: any = await read_yaml_front_matter(path);
    if (yaml.repository == repo) {
      yaml.shortname = basename(name);
      return [yaml as Manifest, path];
    }
    pkgs.push([basename(name), yaml]);
  }

  throw new PackageNotFoundError(pkgs);
}

async function main(manifest: Manifest, script: string) {
  const SRCROOT = await (async () => {
    const output = await new Deno.Command("git", {args: ["rev-parse", "--show-toplevel"], stdout: "piped"}).spawn().output()
    return new TextDecoder().decode(output.stdout).trim();
  })();

  const [cmd, ...args] = (() => {
    switch (Deno.build.os) {
      case "darwin": {
        const sandbox_profile_file = make_sandbox(manifest, SRCROOT);

        return [
          "sandbox-exec",
          "-f",
          sandbox_profile_file,
          script,
          ...Deno.args,
        ];
      }
      case "linux":
        //TODO pkg firejail and implement sandbox
        //  ^^ https://github.com/netblue30/firejail
        return [script, ...Deno.args];
      default:
        throw new Error("Unsupported OS");
    }
  })();

  const env = { SRCROOT };

  const status = await new Deno.Command(cmd, { args, env }).spawn().status;

  Deno.exit(status.code);
}

function make_sandbox({ sandbox }: { sandbox?: string[] }, SRCROOT: string) {
  //FIXME don’t want to add ~/.pkgx

  const home = Deno.env.get("HOME")!;

  let sandboxProfile = `
(version 1)
(allow default)
(deny file-write*)
(allow file-write* (subpath "/dev/null"))
(allow file-write* (subpath "/var"))
(allow file-write* (subpath "/private/var"))
(allow file-write* (subpath "/tmp"))
(allow file-write* (subpath "${home}/.pkgx"))
(allow file-write* (subpath "${home}/Library/Caches"))
(allow file-write* (subpath "${home}/.cache"))
(allow file-write* (subpath "${SRCROOT}"))
`;

  for (let ln of sandbox ?? []) {
    ln = ln.replace("$XDG_CACHE_HOME", get_xdg_cache_home());
    ln = ln.replace("$HOME", home);
    sandboxProfile += `(allow file-write* (subpath "${ln}"))\n`;
  }

  const fn = Deno.makeTempFileSync({ prefix: "pkgo", suffix: ".sb" });
  Deno.writeTextFileSync(fn, sandboxProfile.trim());
  return fn;
}

function basename(path: string) {
  const foo = std_basename(path);
  const i = foo.lastIndexOf(".");
  return foo.slice(0, i);
}

function get_data_home() {
  switch (Deno.build.os) {
    case "darwin":
      return join(Deno.env.get("HOME") || "/Users/Shared", "Library/Application Support");
    case "linux":
      return Deno.env.get("XDG_DATA_HOME") || join(Deno.env.get("HOME")!, ".local/share");
    default:
      throw new Error("Unsupported OS");
  }
}

function get_xdg_cache_home() {
  switch (Deno.build.os) {
    case "darwin":
      return join(Deno.env.get("HOME") || "/Users/Shared", "Library/Caches");
    case "linux":
      return Deno.env.get("XDG_CACHE_HOME") || join(Deno.env.get("HOME")!, ".cache");
    default:
      throw new Error("Unsupported OS");
  }
}

function read_yaml_front_matter(script: string) {
  const decoder = new TextDecoder();
  const data = Deno.readFileSync(script);
  const text = decoder.decode(data);
  const lines = text.split("\n");
  const front_matter = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/#\s*---/.test(line)) {
      for (i++; i < lines.length; i++) {
        const line = lines[i];
        if (/#\s*---/.test(line)) {
          break;
        }
        front_matter.push(line.slice(1));
      }
      break;
    }
  }
  if (front_matter.length == 0) {
    return {};
  } else {
    return parse(front_matter.join("\n"));
  }
}

async function fetch_manifests() {
  const self = fromFileUrl(import.meta.url)
  const dev_dir = join(dirname(fromFileUrl(import.meta.url)), 'manifests');
  if (self.endsWith('.ts') && existsSync(dev_dir)) {
    return dev_dir;
  }

  const live_dir = join(get_data_home(), 'pkgo', 'manifests');
  let cwd: string | undefined = live_dir
  let env: Record<string, string> = {
    GIT_CONFIG_NOSYSTEM: '1'
  }

  if (existsSync(join(live_dir, '.git'))) {
    await run("git", "fetch", "-pft", "origin");
    await run("git", "reset", "--hard", "origin/main");
  } else {
    cwd = undefined
    await run("git", "clone", "https://github.com/pkgxdev/pkgo", live_dir);
    cwd = live_dir
  }

  env['FILTER_BRANCH_SQUELCH_WARNING'] = '1';
  await run("git", "filter-branch", "-f", "--subdirectory-filter", 'manifests');

  return live_dir

  async function run(..._args: string[]) {
    const [cmd, ...args] = _args;
    const { success } = await new Deno.Command(cmd, {args, cwd, env, stdout: "null", stderr: "null"}).spawn().status
    if (!success) throw new Error(`${cmd} ${args.join(' ')} failed`);
  }
}
