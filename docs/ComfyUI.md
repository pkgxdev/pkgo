# ComfyUI

## Getting Started

```sh
git clone
cd ComfyUI
pkgo
```

## Generating Your First Image

ComfyUI doesn’t come with any models—you will need to download one.

* [Juggernaut XL](https://civitai.com/models/133005/juggernaut-xl) is a popular Stable Diffusion XL model
* [Dreamshaper 8] is a popular Stable Diffusion 1.5
* [civitai.com](https://civitai.com) in general is a great resource

> [!NOTE]
> In general newer Stable Diffusion models will generate better images for
> more “human” prompts but require more resources. Stable Diffusion 1.5 still
> will generate amazing images however and it has much wider community
> support.
>
> You will find that people have “remixed” StabilityAI’s models, but here is
> the release order of the official base models:
>
> * Stable Diffusion v1
> * Stable Diffusion v2
> * Stable Diffusion XL
> * Stable Diffusion v3

When loaded ComfyUI has a default workflow. Clicking “Queue” would generate
the workflow’s image–if you have a model. It defaults to the StabilityAI’s
SD1.5 release. So either download that, or grab [Dreamshaper 8] and change
the model node’s checkpoint to that.

> [!TIP]
>
> * Download a model and put it in the `./models/Checkpoints` directory.
> * Open the Model Library (press `m`)
> * Reload the listing
> * You can now change the model node in the workflow to use your model

[DreamShaper 8]: https://civitai.com/models/4384/dreamshaper

## Going Further

Going further than this is a bit of a rabbit hole. You will need to read blogs
and watch YouTube videos. Here’s some we found useful:

* https://medium.com/@tchpnk/comfyui-on-apple-silicon-from-scratch-2025-9facb41c842f
* https://medium.com/@tchpnk/comfyui-on-apple-silicon-from-scratch-2024-58def01a3319

### FLUX

[FLUX] is very popular due to its high quality outputs. It has very
large resource requirements and is painful to set up. Good luck!

* https://education.civitai.com/quickstart-guide-to-flux-1/
* https://medium.com/@tchpnk/flux-comfyui-on-apple-silicon-with-hardware-acceleration-2024-4d44ed437179

[FLUX]: https://civitai.com/models/618692?modelVersionId=691639
