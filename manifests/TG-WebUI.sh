#!/usr/bin/env -S pkgx --quiet +git +conda.org +gum bash>=4 -eo pipefail

# ---
# name:
#   Text Generation WebUI
# brief:
#   Interface for LLMs with support for multiple inference backends
# repository:
#   https://github.com/oobabooga/text-generation-webui
# ---

# TODO make this work without conda
#   ^^ https://github.com/oobabooga/text-generation-webui/discussions/5967

if [ ! $(uname) = Darwin ]; then
  gum format \
    "# unsupported" \
    "fix this to work on Linux!" \
    "there’s not that much to do TBH" \
    "https://github.com/pkgxdev/pkgo/blob/main/manifests/TG-WebUI.sh"
  exit 1
fi

gum format \
  "# Text Generation WebUI" \
  "you will need to download some models" \
  "" \
  "> https://github.com/oobabooga/text-generation-webui?tab=readme-ov-file#downloading-models" \
  "" \
  "for some reason finding advice for a working model is like pulling blood from a stone" \
  "here’s one that works:" \
  "" \
  "> https://huggingface.co/TheBloke/phi-2-GGUF" \
  "" \
  "1. open the Model tab" \
  "2. put \`TheBloke/OpenHermes-2.5-Mistral-7B-GPTQ\` in the \`Download Model\` text field" \
  "3. download it" \
  "4. select one of the models (any is fine) and click “Load”"

export CONDA_ENVS_PATH="$SRCROOT/conda/envs"
export CONDA_PKGS_DIRS="$SRCROOT/conda/pkgs"
source <(conda shell.bash hook)
export HOME="$SRCROOT/conda/home"  # conda is absolute garbage

if [ ! -d "$SRCROOT/conda" ]; then
  echo "/conda" >> .git/info/exclude

  conda create --prefix="$SRCROOT/conda/prefix" python=3.11 --yes
  conda activate "$SRCROOT/conda/prefix"
  pip install torch==2.4.1 torchvision==0.19.1 torchaudio==2.4.1

  if [ $(uname -m) = arm64 ]; then
    pip install -r requirements_apple_silicon.txt
  else
    pip install -r requirements_apple_intel.txt
  fi
else
  conda activate "$SRCROOT/conda/prefix"
fi

exec python "$SRCROOT/server.py" "$@"
