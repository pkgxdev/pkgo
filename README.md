# Package…GO!

Some Open Source is not designed to be packaged, but is still great.

`pkgo` (Package…GO!) is a “setup” tool for the ”unpackageable”. Contributors
provide build and run instructions for projects. Programs are run inside a
sandbox (restricting writes to the cloned directory, caches and temp
directories) for your sanity and security.

## Quick Start

```sh
curl -O https://raw.githubusercontent.com/pkgxdev/pkgo/refs/heads/main/entrypoint.ts
sudo install -m 755 entrypoint.ts /usr/local/bin/pkgo
```

> [!IMPORTANT]
>
> [`pkgx`] is a required dependency:
>
> ```sh
> brew install pkgx || curl https://pkgx.sh | sh
> ```

> [!NOTE]
> We support macOS & Linux, arm64 and x86-64. Not all platforms have been
> tested. Bug reports welcome!

## Usage

```sh
$ git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
# ^^ clone a supported project
$ pkgo
# ^^ `pkgo` does the setup and executes it
```

To list all supported projects type `pkgo` in a non project directory.

> [!NOTE]
>
> ### Why `pkgo` Works This Way
>
> The projects we support are designed to be cloned, managed and
> modified in-place by the user so packaging them in a more typical sense
> would make them simpler for getting started but more tedious to use.
>
> `pkgo` makes the getting started step simple removing the worst of the
> tedium.
>
> We still make you clone it because its not our job to manage where the
> project goes or how it gets there.

## Contributing

Fork this repo and add a new script to `manifests`. Use `pkgx` to ensure your
script and the program you will run has all the stuff it needs.

See the scripts we have already written for examples.

> [!IMPORTANT]
> You need to run the `entrypoint.ts` script from your clone rather than
> `pkgo` from your `PATH` to use your manifests!

- Beware the sandbox! If your program needs write access outside the sandbox
  or access to other resources you will need to add exceptions to the script’s
  YAML front matter.
- We pass all command line arguments to you, use them as you see fit and pass
  what you don’t consume through to the program you have packaged.

[`pkgx`]: https://pkgx.sh
