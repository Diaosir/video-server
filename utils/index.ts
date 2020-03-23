const glob = require('glob')
const path = require('path');
const fs = require('fs')
export function scanFolder(folder) {
  let fileList = glob.sync(path.join(folder, '/**'));
  return fileList.filter((item => {
    try{
      return !fs.statSync(item).isDirectory() && !!item.match(/\.mp4$/)
    } catch(error) {
      return false;
    }
  })).sort((a, b) => {
      return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime()
  })
}

export async function getVideoFileList() {
  const fileList = scanFolder(process.cwd());
  const cwd = process.cwd().replace(/\\/g, '/');
  const list = await Promise.all(fileList.map(async item => {
  const filename = item.replace(cwd, '').replace(/\//g, '_')
  const basename = path.basename(item);
  return {
      name: item,
      cwd: cwd,
      basename: basename.split('.')[0],
      url: `http://192.168.31.78:3000${item.replace(cwd, '')}`,
      screenshot: `http://192.168.31.78:3000/screenshots_${filename}/${basename}.png`,
      screenshotDir: `screenshots_${filename}`
    }
  }));
  return list;
}