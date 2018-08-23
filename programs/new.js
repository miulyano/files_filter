const fs = require('fs');
const util = require('util');
const path = require('path');
const settingsArgs = process.argv.slice(2);

const base = settingsArgs[0];
const newBase = settingsArgs[1];
const delDir = settingsArgs[2];

const addNewDir = util.promisify(fs.mkdir);
const delBaseDir = util.promisify(fs.rmdir);
const exsistDir = util.promisify(fs.access);
const readDir = util.promisify(fs.readdir);
const statDir = util.promisify(fs.stat);
const copyFile = util.promisify(fs.copyFile);
const delFile = util.promisify(fs.unlink);

const readNewBase = (path, pathBase) => {
  return new Promise(async (resolve, reject) => {
    if (path && path !== base && !fs.existsSync(path) && fs.existsSync(pathBase)) {
      await addNewDir(path);
      resolve();
    } else {
      if (!path) {
        reject(console.log('Вы не указали название папки для копирования! Пожалуйста, укажите название папки!'));
      } else {
        if (!fs.existsSync(pathBase)) {
          reject(console.log(`${pathBase} не существует! Уточните запрос на копирование.`));
        }
        if (fs.existsSync(path)) {
          reject(console.log(`${path} уже существует! Укажите другое название папки.`));
        }
      }
    }
  });
};




readNewBase(newBase, base).then(() => console.log(`${newBase} создана`))
  .catch((e) => { return e; });
