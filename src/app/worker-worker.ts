/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  debugger
  const imageData = data.data;
  const w = imageData.width;
  const h = imageData.height;
  const idata = imageData.data;

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let index = (x + (y * w)) * 4;
      idata[index] = idata[index] * 1.2;
    }
  }

  postMessage(imageData, [imageData.data.buffer])
});
