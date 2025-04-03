@echo off
pkgx --quiet +git deno^^2 run -A "%~dp0entrypoint.ts" %*
