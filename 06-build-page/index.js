const fs = require('fs');
const path = require('path');

async function preLoad() {
  fs.mkdir('./06-build-page/project-dist', {recursive: true}, (err) => {
    if (err) throw err;
  });
  fs.mkdir('./06-build-page/project-dist/assets', {recursive: true}, (err) => {
    if (err) throw err;
  });
  const files = await fs.promises.readdir('./06-build-page/project-dist', (err) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join('./06-build-page/project-dist', file), err => {
        if (err) throw err;
      });
    }
  });
}

async function coppyAssets() {
  const folders = await fs.promises.readdir('./06-build-page/assets', {withFileTypes: true});
  for (let folder of folders) {
    fs.mkdir('./06-build-page/project-dist/assets' + '/' + folder.name, {recursive: true}, (err) => {
      if (err) throw err;
    });
    const files = await fs.promises.readdir('./06-build-page/assets' + '/' + folder.name, {withFileTypes: true});
    for (let file of files) {
      await fs.promises.copyFile('./06-build-page/assets' + '/' + folder.name + '/' 
      + file.name, './06-build-page/project-dist/assets' + '/' + folder.name + '/' + file.name);
    }
  }
}

async function coppyStyles() {
  const firstWriteStream = await fs.createWriteStream('./06-build-page/project-dist/style.css');
  fs.truncate('./06-build-page/project-dist/style.css', (err) => {
    if (err) throw err;
  });
  const files = await fs.promises.readdir('./06-build-page/styles', {withFileTypes: true});
  for (let file of files) {
    if (path.extname(file.name) === '.css') {
      const readableStream =  fs.createReadStream('./06-build-page/styles' + '/' + file.name);
      readableStream.on('data', function (chunk) {
        firstWriteStream.write(chunk);
      });
    }
  }
}

async function buildHtml() {
  let header;
  let articles;
  let footer;
  const writeStream = await fs.createWriteStream('./06-build-page/project-dist/index.html');
  fs.truncate('./06-build-page/project-dist/index.html', (err) => {
    if (err) throw err;
  });
  const headerReadStream = await fs.createReadStream('./06-build-page/components/header.html');
  headerReadStream.on('data', function(chunk) {
    header = chunk.toString().split('\n');
  });
  const articlesReadStream = await fs.createReadStream('./06-build-page/components/articles.html');
  articlesReadStream.on('data', function(chunk) {
    articles = chunk.toString().split('\n');
  });
  const footerReadStream = await fs.createReadStream('./06-build-page/components/footer.html');
  footerReadStream.on('data', function(chunk) {
    footer = chunk.toString().split('\n');
  });
  const readStream = fs.createReadStream('./06-build-page/template.html');
  readStream.on('data', function(chunk) {
    let buffArray = chunk.toString().split('\n');
    let headerIndex = buffArray.indexOf('    {{header}}\r');
    let articleIndex = buffArray.indexOf('      {{articles}}\r');
    let footerIndex = buffArray.indexOf('    {{footer}}\r');
    buffArray[headerIndex] = header;
    buffArray[articleIndex] = articles;
    buffArray[footerIndex] = footer;
    let build = buffArray.flat().join('\n');
    writeStream.write(build);
  });
}

preLoad();
buildHtml();
coppyStyles();
coppyAssets();