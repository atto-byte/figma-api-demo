require('dotenv').config()
import fetch from 'node-fetch';
import { FileResponse } from 'figma/types';
const fs = require('fs');

const devToken = process.env.DEV_TOKEN as string;
const fileKey = process.env.FILE_KEY
const headers = {'X-Figma-Token': devToken}

const baseUrl = 'https://api.figma.com';



async function fetchData() {
  let resp = await fetch(`${baseUrl}/v1/files/${fileKey}`, { headers: headers });
  let data: FileResponse = await resp.json();
  console.log(JSON.stringify(data))
  const path = `${process.cwd()}/data.json` 
  fs.writeFile(path, JSON.stringify(data), function(err) {
    if (err) console.log(err);
    console.log(`wrote ${path}`);
  });
  const doc = data.document;
  const canvas = doc.children && doc.children[0];
  return { canvas, data };
}
export default fetchData