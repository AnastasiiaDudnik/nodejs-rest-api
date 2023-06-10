const jimp = require("jimp");

const imageResize = async (path, size) => {
  const image = await jimp.read(path);

  await image.resize(size, size);
  return await image.writeAsync(path);
};

module.exports = imageResize;
