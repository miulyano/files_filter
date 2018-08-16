const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const settingsArgs = process.argv.slice(2);

const base = settingsArgs[0];
const newBase = settingsArgs[1];
const delDir = settingsArgs[2];

let files = {
  newBase: newPath =>  new Promise((resolve, reject) => {
    if (newBase && newBase !== base && !fs.existsSync(newBase) && fs.existsSync(base)) {
      fs.mkdir(newPath, (err) => err ? reject(err) : resolve());
    } else {
      if (!newBase) {
        console.log('Вы не указали название папки для копирования! Пожалуйста, укажите название папки!');
        reject();
      } else {
        if (!fs.existsSync(base)) {
          console.log(`${base} не существует! Уточните запрос на копирование.`);
          reject();
        }
        console.log(`${newBase} уже существует! Укажите другое название папки.`);
        reject();
      }
    }
  }),
  copy: (pathFile, newPath) => new Promise((resolve, reject) => {
    fs.copyFile(pathFile, newPath, (err) => err ? reject(err) : resolve());
  }),
  newFileBase: fileBase => new Promise((resolve, reject) => {
    if (!fs.existsSync(fileBase)) {
      fse.mkdirp(fileBase, (err) => err ? reject(err) : resolve());
    }
  })
};

const readDir = function (dir) {
  fs.readdir(dir, (err, list) => {
    list.forEach(file => {
      let innerFile = path.resolve(dir, file);
      let firstChar = file.charAt(0).toUpperCase();
      let pathFileFilter = path.join(newBase, firstChar);
      fs.stat(innerFile, (err, stats) => {
        if (stats.isDirectory()) {
          readDir(innerFile);
        } else {
          files.newFileBase(pathFileFilter);
          files.copy(innerFile, path.join(pathFileFilter, file));
        }
      });
    });
  });
};

files
  .newBase(newBase)
  .then(() => {
    if (delDir && delDir === 'true') {
      readDir(base);
      fse.remove(base)
        .then(() => {
          console.log(`${newBase} успешно создана!\n${base} полностью удалена с вашего компьютера.`);
        });
    } else {
      if (delDir && delDir !== 'false') {
        console.log('Значение параметра удаления должно быть булевым: true/false');
        fs.rmdirSync(newBase);
      }
      if (!delDir) {
        readDir(base);
      }
    }
  })
  .catch(() => console.error('fatal'));
