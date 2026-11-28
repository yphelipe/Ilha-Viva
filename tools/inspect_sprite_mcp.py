"""Read-only cross-check of a candidate PNG with an optional local pixel-art MCP."""
import argparse
import asyncio
import hashlib
import json
import shutil
import tempfile
from pathlib import Path

from PIL import Image
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def inspect(sprite, server):
    # The server only needs a disposable copy. Its in-place export is never called.
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "frame.png"
        shutil.copyfile(sprite, path)
        settings = StdioServerParameters(
            command="node", args=[str(server.resolve()), "--root", directory], cwd=directory
        )
        with Image.open(path) as image:
            size = image.size
            alpha = image.convert("RGBA").getchannel("A").histogram()
        async with stdio_client(settings) as streams, ClientSession(*streams) as client:
            info = await client.initialize()
            result = await client.call_tool("inspect_file", {"path": path.name})
            if result.isError:
                raise RuntimeError(result.content[0].text)
            details = json.loads(result.content[0].text)
        if (details["width"], details["height"]) != size or details["partialAlphaPixels"] != sum(alpha[1:255]):
            raise ValueError("MCP and Pillow disagree on dimensions or partial alpha")
        return {
            "server": info.serverInfo.model_dump(exclude_none=True),
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "width": size[0], "height": size[1],
            "partial_alpha_pixels_pillow": sum(alpha[1:255]),
            "inspect_file": details,
        }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sprite", type=Path)
    parser.add_argument("server", type=Path, help="Compiled pixel-art-mcp dist/index.js")
    args = parser.parse_args()
    print(json.dumps(asyncio.run(inspect(args.sprite, args.server)), ensure_ascii=False, indent=2))
