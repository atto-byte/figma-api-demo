require('dotenv').config()
import fetch from 'node-fetch';
import { FileResponse } from '../types';
import * as fs from 'fs';

const devToken = process.env.DEV_TOKEN as string;
const fileKey = process.env.FILE_KEY
const headers = {'X-Figma-Token': devToken}

const baseUrl = 'https://api.figma.com';



async function fetchData(local = true) {
  const path = `${process.cwd()}/data.json` 
  if(local){
    const data: FileResponse = require(path)
    const doc = data.document;
    const canvas = doc.children && doc.children[0];
    return { canvas, data };
  } else {
    let resp = await fetch(`${baseUrl}/v1/files/${fileKey}`, { headers: headers });
    let data: FileResponse = await resp.json();
    fs.writeFile(path, JSON.stringify(data), function(err) {
      if (err) console.log(err);
      console.log(`Saved Data @ ${path}`);
    });
  }
}
export default fetchData