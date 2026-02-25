import { convertUrlToHttps } from "./url.ts";

Deno.test("convertUrlToHttps converts ssh github URLs", () => {
  const input = "git@github.com:pkgxdev/pkgo.git";
  const actual = convertUrlToHttps(input);
  const expected = "https://github.com/pkgxdev/pkgo";
  if (actual !== expected) {
    throw new Error(`expected ${expected}, got ${actual}`);
  }
});

Deno.test("convertUrlToHttps preserves https URLs", () => {
  const input = "https://github.com/pkgxdev/pkgo";
  const actual = convertUrlToHttps(input);
  if (actual !== input) {
    throw new Error(`expected ${input}, got ${actual}`);
  }
});
