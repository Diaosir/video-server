var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const slowly_1 = require("slowly");
const decorator_1 = require("slowly/decorator");
const ffmpeg = require('fluent-ffmpeg');
const utils_1 = require("../utils");
const fse = require('fs-extra');
function getVideoPicture(src) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _) => {
            const cwd = process.cwd().replace(/\\/g, '/');
            const filename = src.replace(cwd, '').replace(/\//g, '_');
            try {
                new ffmpeg({
                    source: src
                })
                    .screenshots({
                    count: 1,
                    timemarks: ['10%'],
                    filename: '%f',
                    folder: `screenshots_${filename}/`
                }, function (_, filenames) {
                    resolve(filenames);
                });
            }
            catch (err) {
                resolve([]);
            }
        });
    });
}
class ScreenshotController extends slowly_1.Controller {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const { force } = this.ctx.query;
            if (force) {
                yield this.del();
            }
            const fileList = yield utils_1.getVideoFileList();
            yield Promise.all(fileList.map((item) => __awaiter(this, void 0, void 0, function* () {
                if (force) {
                    yield getVideoPicture(item.name);
                    return;
                }
                try {
                    if (!fse.pathExistsSync(item.screenshotDir)) {
                        yield getVideoPicture(item.name);
                    }
                    else {
                    }
                }
                catch (error) {
                    yield getVideoPicture(item.name);
                }
            })));
        });
    }
    del() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileList = yield utils_1.getVideoFileList();
            for (let i = 0; i < fileList.length; i++) {
                fse.removeSync(fileList[i].screenshotDir);
            }
        });
    }
}
__decorate([
    decorator_1.Description('build screenshot'),
    decorator_1.Option('-f, --force [force]', 'is force')
], ScreenshotController.prototype, "index", null);
__decorate([
    decorator_1.Description('delete screenshot')
], ScreenshotController.prototype, "del", null);
exports.default = ScreenshotController;
