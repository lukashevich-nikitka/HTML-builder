const fs = require('fs');
const path = require('path');

fs.mkdir('./06-build-page/project-dist', {recursive: true}, (err) => {
  if (err) throw err;
});

fs.mkdir('./06-build-page/project-dist/assets', {recursive: true}, (err) => {
  if (err) throw err;
});

async function collector() {
  const firstWriteStream = await fs.createWriteStream('./06-build-page/project-dist/style.css');
  const secondWriteStream = await fs.createWriteStream('./06-build-page/project-dist/index.html');
  const folders = await fs.promises.readdir('./06-build-page/assets', {withFileTypes: true});
  for (let folder of folders) {
    fs.mkdir('./06-build-page/project-dist/assets' + '/' + folder.name, {recursive: true}, (err) => {
      if (err) throw err;
    });
    const files = await fs.promises.readdir('./06-build-page/assets' + '/' + folder.name, {withFileTypes: true});
    for (let file of files) {
      fs.promises.copyFile('./06-build-page/assets' + '/' + folder.name + '/' 
      + file.name, './06-build-page/project-dist/assets' + '/' + folder.name + '/' + file.name);
    }
  }
}

collector();