# Figma to React (WIP; Help Wanted)
- [Initial Setup](#Env)
- [NPM](#NPM)
- [Yarn](#NPM)
- [Debug](#Debug)
## Env - Required
Create a `.env` file with you figma [access token](https://www.figma.com/developers/docs#access-tokens) and the key for the file you would like to access.
### Example 
`env`
```env
DEV_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
FILE_KEY="xxxxxxxxxxxxxxxxxxxxxxxx"
```
## NPM

### Setup

```bash
git clone https://github.com/atto-byte/figma-api-demo.git
cd figma-api-demo
npm install
```

### Generate Components

`npm run gen`

### Run Server

Edit `src\index.tsx` then run `npm run start` to Display the Generated Components

## Yarn

### Setup

```bash
git clone https://github.com/atto-byte/figma-api-demo.git
cd figma-api-demo
yarn
```

### Generate Components

```bash
yarn gen
```

### Run Server

Edit `src\index.tsx` then run `yarn start` to Display the Generated Components

## Debug - VsCode
Press F5 and Select Generate, you can then set breakpoints in `figma/*` to debug the generation