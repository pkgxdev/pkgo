import { applySandboxPathTemplates, buildSandboxProfile } from "./sandbox.ts";

Deno.test("applySandboxPathTemplates expands HOME and XDG_CACHE_HOME", () => {
  const actual = applySandboxPathTemplates(
    "$HOME/tmp:$XDG_CACHE_HOME",
    "/Users/example",
    "/Users/example/.cache",
  );
  const expected = "/Users/example/tmp:/Users/example/.cache";
  if (actual !== expected) {
    throw new Error(`expected ${expected}, got ${actual}`);
  }
});

Deno.test("buildSandboxProfile includes source root and expanded extra path", () => {
  const profile = buildSandboxProfile({
    home: "/Users/example",
    srcRoot: "/Users/example/work/repo",
    xdgCacheHome: "/Users/example/.cache",
    extraPaths: ["$HOME/tmp", "$XDG_CACHE_HOME/foo"],
  });

  if (!profile.includes('(allow file-write* (subpath "/Users/example/work/repo"))')) {
    throw new Error("missing src root allow rule");
  }
  if (!profile.includes('(allow file-write* (subpath "/Users/example/tmp"))')) {
    throw new Error("missing expanded HOME allow rule");
  }
  if (!profile.includes('(allow file-write* (subpath "/Users/example/.cache/foo"))')) {
    throw new Error("missing expanded XDG_CACHE_HOME allow rule");
  }
});
