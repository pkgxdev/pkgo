#!/usr/bin/env -S pkgx --quiet +git +python~3.12 +gum bash -eo pipefail

# ---
# brief:
#   Powerful img-gen workbench for hackers
# repository:
#   https://github.com/comfyanonymous/ComfyUI
# ---

# Resources
# https://medium.com/@tchpnk/comfyui-on-apple-silicon-from-scratch-2024-58def01a3319

if [ ! -d "$SRCROOT/venv" ]; then
  python -m venv "$SRCROOT/venv"
  source "$SRCROOT/venv/bin/activate"
  if [ $(uname) = Darwin ]; then
    pip install --pre torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cpu
  else
    # nvidia only
    # see https://github.com/comfyanonymous/ComfyUI?tab=readme-ov-file#amd-gpus-linux-only
    pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu121
  fi
  pip install -r "$SRCROOT/requirements.txt"

  # fixes: AttributeError: module 'mpmath' has no attribute 'rational'
  pip install mpmath==1.3.0
else
  source "$SRCROOT/venv/bin/activate"
fi

ARGS=(--auto-launch)

if [ $(uname) = Darwin ]; then
  ARGS+=(--force-fp16)

  # https://medium.com/@tchpnk/comfyui-on-apple-silicon-from-scratch-2025-9facb41c842f
  ARGS+=(--force-upcast-attention)
fi

export MPLCONFIGDIR="$SRCROOT/temp/matplotlib"

exec python "$SRCROOT/main.py" "${ARGS[@]}" "$@"
