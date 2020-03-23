import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
const ffmpeg = require('fluent-ffmpeg');
import { getVideoFileList } from '../utils'
const fse = require('fs-extra')
async function getVideoPicture(src) {
  return new Promise((resolve, _) => {
      const cwd = process.cwd().replace(/\\/g, '/');
      const filename = src.replace(cwd, '').replace(/\//g, '_')
      try{
          new ffmpeg({
              source: src
          })
          .screenshots({
              count: 1,
              timemarks: ['10%'],
              filename: '%f',
              folder: `screenshots_${filename}/`
          }, function(_, filenames) {
              resolve(filenames)
          })
      } catch(err) {
          resolve([])
      }
  });
}
export default class ScreenshotController extends Controller {
  @Description('build screenshot')
  @Option('-f, --force [force]', 'is force')
  async index() {
    const { force } = this.ctx.query;
    if(force) {
      await this.del()
    }
    const fileList: any = await getVideoFileList();
    await Promise.all(fileList.map(async (item) => {
      if(force) {
        await getVideoPicture(item.name)
        return;
      }
      try{
        if(!fse.pathExistsSync(item.screenshotDir)) {
          await getVideoPicture(item.name)
        } else {
        }
      }catch(error) {
        await getVideoPicture(item.name)
      }
   }))
  }
  @Description('delete screenshot')
  async del() {
    const fileList: any = await getVideoFileList();
    for(let i = 0; i < fileList.length; i++) {
      fse.removeSync(fileList[i].screenshotDir);
    }
  }
}