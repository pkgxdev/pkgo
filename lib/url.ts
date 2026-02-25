export function convertUrlToHttps(input: string) {
  if (input.startsWith("git@")) {
    return input.replace(":", "/").replace("git@", "https://").slice(0, -4);
  }
  return input;
}
