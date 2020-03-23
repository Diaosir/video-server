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
const path = require('path');
const router = require('koa-router')(); //注意：引入的方式
const Koa = require('koa');
const app = new Koa();
const koaStatic = require('koa-static');
const views = require('koa-views');
const chilrenProccess = require('child_process');
const utils_1 = require("../utils");
class InitController extends slowly_1.Controller {
    constructor() {
        super(...arguments);
        this.fileList = [];
        this.cwd = process.cwd();
        this.ip = '192.168.31.78';
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileList = yield utils_1.getVideoFileList();
            // chilrenProccess.execSync('video-server screenshot');
            router.get('/', (ctx) => __awaiter(this, void 0, void 0, function* () {
                yield ctx.render('index', {
                    list: fileList
                });
            }));
            router.get('/detail', (ctx) => __awaiter(this, void 0, void 0, function* () {
                const { query } = ctx;
                yield ctx.render('detail', {
                    data: {
                        name: query.name
                    }
                });
            }));
            app.use(views(path.resolve(__dirname, '../views'), { extension: 'ejs' }));
            app.use(router.routes()); //作用：启动路由
            app.use(router.allowedMethods());
            app.use(koaStatic(this.cwd));
            app.listen(5000);
        });
    }
}
__decorate([
    decorator_1.Description('start local video server')
], InitController.prototype, "index", null);
exports.default = InitController;
