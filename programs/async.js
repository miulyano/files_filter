const fs = require('fs');
const path = require('path');
const settingsArgs = process.argv.slice(2);

const base = settingsArgs[0];
const newBase = settingsArgs[1];
const delDir = settingsArgs[2];

const readDir = (base) => {
  const files = fs.readdirSync(base);

  files.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);
    const firstChar = item.charAt(0).toUpperCase();
    const pathFileFilter = path.join(newBase, firstChar);

    if (state.isDirectory()) {
      readDir(localBase);
    } else {
      if (!fs.existsSync(pathFileFilter)) {
        fs.mkdirSync(pathFileFilter);
      }
      fs.copyFileSync(localBase, path.join(pathFileFilter, item));
    }
  });
};
const removeDir = (base) => {
  const files = fs.readdirSync(base);

  if (fs.existsSync(base)) {
    files.forEach(function (item) {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);
      if (state.isDirectory()) {
        removeDir(localBase);
      } else {
        fs.unlinkSync(localBase);
      }
    });
    fs.rmdirSync(base);
  }
};

function fileFilter (from, to, del) {
  return new Promise((resolve, reject) => {
    if (newBase && newBase !== base && !fs.existsSync(newBase) && fs.existsSync(base)) {
      fs.mkdirSync(newBase);
      resolve();
    } else {
      if (!newBase) {
        console.log('Вы не указали название папки для копирования! Пожалуйста, укажите название папки!');
        reject();
      } else {
        if (!fs.existsSync(base)) {
          console.log(`${base} не существует! Уточните запрос на копирование.`);
          reject();
        }
        if (fs.existsSync(newBase)) {
          console.log(`${newBase} уже существует! Укажите другое название папки.`);
          reject();
        }
      }
    }
  });
}

fileFilter(base, newBase, delDir)
  .then(
    () => {
      if (settingsArgs[2] && settingsArgs[2] === 'true') {
        readDir(base);
        console.log(`${newBase} успешно создана!`);
        removeDir(base);
        console.log(`${base} полностью удалена с вашего компьютера.`);
      } else {
        if (settingsArgs[2] && settingsArgs[2] !== 'false') {
          console.log('Значение параметра удаления должно быть булевым: true/false');
          fs.rmdirSync(newBase);
          return false;
        }
        if (!settingsArgs[2]) {
          readDir(base);
          console.log(`Файлы отфильтрованы и успешно скопированы в ${newBase}`);
        }
      }
    },
    () => {
      return false;
    }
  );
