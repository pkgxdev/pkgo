#!/usr/bin/env -S pkgx --quiet +git python@3.10.6

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

def pretty_print():
  print("=" * 50)
  print("# Stable Diffusion WebUI")
  print("=" * 50)
  print("The app will download Stable Diffusion 1.5 automatically.")
  print("This is a relatively old model.")
  print("We recommend adding newer models to `models/Stable-diffusion`:")
  print()
  print("  * Juggernaut XL (popular SDXL model):")
  print("    https://civitai.com/models/133005/juggernaut-xl")
  print("  * Dreamshaper 8 (popular SD1.5 model):")
  print("    https://civitai.com/models/4384/dreamshaper")
  print("  * civitai.com in general is a great resource:")
  print("    https://civitai.com")
  print("=" * 50)

pretty_print()

import os
import platform
import subprocess
import sys

# Set arguments based on the operating system
args = []
if platform.system() == "Darwin":
  # Supposedly speeds things up on Apple Silicon
  args.extend(["--opt-sub-quad-attention", "--no-half-vae"])

# Set the MPLCONFIGDIR environment variable
src_root = os.getenv("SRCROOT", "")
os.environ["MPLCONFIGDIR"] = os.path.join(src_root, "matplotlib")

# Construct the command to execute
webui_script = os.path.join(src_root, "webui.sh")
command = [webui_script] + args + sys.argv[1:]

# Execute the command
subprocess.run(command)
