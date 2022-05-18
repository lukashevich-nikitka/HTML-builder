const fs = require('fs');
const path = require('path');

async function mergeStyles() {
  const writeStream = await fs.createWriteStream('./05-merge-styles/project-dist/bundle.css');
  fs.truncate('./05-merge-styles/project-dist/bundle.css', (err) => {
    if (err) throw err;
  });
  const files = await fs.promises.readdir('./05-merge-styles/styles', {withFileTypes: true});
  for (let file of files) {
    if (path.extname(file.name) === '.css') {
      const readableStream =  fs.createReadStream('./05-merge-styles/styles' + '/' + file.name);
      readableStream.on('data', function (chunk) {
        writeStream.write(chunk);
      });
    }
  }
}

mergeStyles();