#!/usr/bin/env -S pkgx --quiet +git +python~3.10 +gum bash -eo pipefail

# ---
# name:
#   Stable Diffusion WebUI
# brief:
#   The most popular app for Open Source image generation
# description: |
#   Stable Diffusion Web UI is a powerful, open-source image generation
#   platform that offers an incredibly extensive and flexible extension
#   system, allowing users to dramatically expand the core functionality
#   through a wide variety of community-developed plugins and add-ons. The
#   extension ecosystem enables users to integrate advanced features like
#   additional AI models, custom generation techniques, unique rendering
#   styles, and specialized image processing tools that can transform the basic
#   image generation experience into a highly personalized and sophisticated
#   workflow. These extensions range from artistic style transformers and
#   advanced upscaling algorithms to specialized controlnet implementations and
#   novel prompt engineering tools, making the Web UI a continuously evolving
#   platform that can be customized to meet almost any creative or technical
#   image generation requirement.
# repository:
#   https://github.com/AUTOMATIC1111/stable-diffusion-webui
# documentation:
#   https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki
# resources:
#   - https://www.youtube.com/playlist?list=PL_pbwdIyffsmclLl0O144nQRnezKlNdx3
# ---

gum format \
  "# Stable Diffusion WebUI" \
  "the app will download Stable Diffusion 1.5 automatically." \
  "this is a relatively old model." \
  "we recommend adding newer models to \`models/Stable-diffusion\`" \
  "* [Juggernaut XL](https://civitai.com/models/133005/juggernaut-xl) (popular SDXL model)" \
  "* [Dreamshaper 8](https://civitai.com/models/4384/dreamshaper) (popular SD1.5 model)" \
  "* [civitai.com](https://civitai.com) in general is a great resource"

if [ $(uname) = Darwin ]; then
  # supposedly speeds things up on Apple Silicon
  ARGS+=(--opt-sub-quad-attention --no-half-vae)
fi

export MPLCONFIGDIR="$SRCROOT/matplotlib"

exec "$SRCROOT/webui.sh" "${ARGS[@]}" "$@"
