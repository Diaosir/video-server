import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
const path = require('path');
const router = require('koa-router')();  //注意：引入的方式
const Koa = require('koa');
const app = new Koa();
const koaStatic = require('koa-static');
const views = require('koa-views');
const chilrenProccess = require('child_process')
import { getVideoFileList } from '../utils'
export default class InitController extends Controller {
  public fileList: Array<any> = [];
  public cwd: string = process.cwd();
  public ip: string = '192.168.31.78';
  @Description('start local video server')
  async index() {
    const fileList = await getVideoFileList();
    // chilrenProccess.execSync('video-server screenshot');
    router.get('/',async (ctx)=>{
      await ctx.render('index',{
          list: fileList
      });
    });
    router.get('/detail',async (ctx)=>{
      const { query } = ctx;
      await ctx.render('detail',{
          data: {
            name: query.name
          }
      });
    });
    app.use(views(path.resolve(__dirname, '../views'), {extension:'ejs'}));
    app.use(router.routes()); //作用：启动路由
    app.use(router.allowedMethods());  
    app.use(koaStatic(this.cwd));
    app.listen(5000);
  }
}