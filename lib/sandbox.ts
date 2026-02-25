export function applySandboxPathTemplates(
  input: string,
  home: string,
  xdgCacheHome: string,
) {
  return input
    .replace("$XDG_CACHE_HOME", xdgCacheHome)
    .replace("$HOME", home);
}

interface BuildSandboxProfileOptions {
  home: string;
  srcRoot: string;
  xdgCacheHome: string;
  extraPaths: string[];
}

export function buildSandboxProfile({
  home,
  srcRoot,
  xdgCacheHome,
  extraPaths,
}: BuildSandboxProfileOptions) {
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
(allow file-write* (subpath "${srcRoot}"))
`;

  for (const rawPath of extraPaths) {
    const resolvedPath = applySandboxPathTemplates(rawPath, home, xdgCacheHome);
    sandboxProfile += `(allow file-write* (subpath "${resolvedPath}"))\n`;
  }

  return sandboxProfile.trim();
}
