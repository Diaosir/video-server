var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require('glob');
const path = require('path');
const fs = require('fs');
function scanFolder(folder) {
    let fileList = glob.sync(path.join(folder, '/**'));
    return fileList.filter((item => {
        try {
            return !fs.statSync(item).isDirectory() && !!item.match(/\.mp4$/);
        }
        catch (error) {
            return false;
        }
    })).sort((a, b) => {
        return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime();
    });
}
exports.scanFolder = scanFolder;
function getVideoFileList() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileList = scanFolder(process.cwd());
        const cwd = process.cwd().replace(/\\/g, '/');
        const list = yield Promise.all(fileList.map((item) => __awaiter(this, void 0, void 0, function* () {
            const filename = item.replace(cwd, '').replace(/\//g, '_');
            const basename = path.basename(item);
            return {
                name: item,
                cwd: cwd,
                basename: basename.split('.')[0],
                url: `http://192.168.31.78:3000${item.replace(cwd, '')}`,
                screenshot: `http://192.168.31.78:3000/screenshots_${filename}/${basename}.png`,
                screenshotDir: `screenshots_${filename}`
            };
        })));
        return list;
    });
}
exports.getVideoFileList = getVideoFileList;
