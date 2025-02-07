import * as sass from 'sass'
import path from 'node:path';
import fs from 'node:fs';
import chokidar from 'chokidar';
import { dirJoin } from "./index.js";

const sassSrcPath = dirJoin('src/sass');
const cssDestPath = dirJoin('public/css');

// 编译单个文件
function compileFile(filePath) {
  const fileName = path.basename(filePath);
  if (fileName.startsWith('theme')) {
    return
  }
  const cssPath = path.join(cssDestPath, fileName.replace('.scss', '.css'));

  try {
    const result = sass.compile(filePath, {
      style: 'expanded',
    });
    fs.writeFileSync(cssPath, result.css);
    console.log(`Compiled: ${filePath} -> ${cssPath}`);
  } catch (err) {
    console.error(`Error compiling ${filePath}:`, err);
  }
}

// 监听 SCSS 文件变化
chokidar.watch(sassSrcPath).on('change', (filePath) => {
  console.log(`File changed: ${filePath}`);
  const fileName = path.basename(filePath);
  // 主题文件发生变化，编译整个 sass 目录
  if (fileName.startsWith('theme')) {
    compileSass();
    return
  } else {
    compileFile(filePath);
  }
});

// 编译所有 SCSS 文件
export const compileSass = () => {
  fs.readdir(sassSrcPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) =>  {
      compileFile(path.join(sassSrcPath, file));
    })
  })
}