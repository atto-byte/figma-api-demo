require('dotenv').config()
import fetch from 'node-fetch';
const fs = require('fs');
let devToken = process.env.DEV_TOKEN;
var https = require('https');
const download = require('image-downloader')

//Node.js Function to save image from External UR
const headers = {'X-Figma-Token': devToken};

const fileKey = process.env.FILE_KEY
const baseUrl = 'https://api.figma.com';
const imagesUrl = `${baseUrl}/v1/files/${fileKey}/images`
export const getImages = async () => {
  let data = await fetch(imagesUrl, {headers});
  const imageJSON: Response = await data.json();
  const images = imageJSON.meta.images;
  Object.keys(images).map(async (guid) => {
    const url = images[guid]
    const options = {
      url: url,
      dest: `${process.cwd()}/public/images/${guid}.png`                  // Save to /path/to/dest/image.jpg
    }
    const { filename, image } = await download.image(options).catch((err) => {
      console.error(err)
    })
    console.log('File saved to', filename)
  })
}
getImages()
interface Response {
  error: boolean;
  status: number;
  meta: Meta;
}

interface Meta {
  images: Images;
}

interface Images {
  [guid: string]: string;

}