const fs = require('fs');
const path = require('path');
const settingsArgs = process.argv.slice(2);

const base = settingsArgs[0];
const newBase = settingsArgs[1];

fs.mkdir(newBase, function (e) {
});

const readDir = (base, level) => {
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
        fs.mkdir(pathFileFilter, function (e) {
        });
      }
      fs.copyFile(localBase, path.join(pathFileFilter, item), (err) => {
        if (err) throw err;
      });
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

readDir(base, 0);

if (settingsArgs[2] === 'true') {
  removeDir(base);
}
