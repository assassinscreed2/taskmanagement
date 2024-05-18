const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(image, imageName) {
  try {
    if (image) {
      const response = await imagekit.upload({
        file: image,
        fileName: imageName,
      });
      return response.url;
    }
    return process.env.DEFAULT_PROFILE_IMAGE;
  } catch (err) {
    console.log("Error while uploading image", err);
    return process.env.DEFAULT_PROFILE_IMAGE;
  }
}

module.exports = {
  uploadImage,
};
