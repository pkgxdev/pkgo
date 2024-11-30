#!/usr/bin/env -S pkgx --quiet +git +python~3.12 +ffmpeg.org bash -eo pipefail

# ---
# brief:
#   Gobsmackingly good face swapping and manipulation
# repository:
#   https://github.com/facefusion/facefusion
# ---

if [ ! -d "$SRCROOT/.caches/venv" ]; then
	python -m venv "$SRCROOT/.caches/venv"
	source "$SRCROOT/.caches/venv/bin/activate"
	python "$SRCROOT/install.py" --onnxruntime default --skip-conda
else
	source "$SRCROOT/.caches/venv/bin/activate"
fi

exec python "$SRCROOT/facefusion.py" run --open-browser "$@"
