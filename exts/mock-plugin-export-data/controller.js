const baseController = require('controllers/base.js');
const interfaceModel = require('models/interface.js');
const projectModel = require('models/project.js');

const interfaceCatModel = require('models/interfaceCat.js');
const mock = require('mock.js');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTableOfContents = require("markdown-it-table-of-contents");
const defaultTheme = require("./defaultTheme.js");
const md = require('../../common/markdown');

// const htmlToPdf = require("html-pdf");
class exportController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.catModel = mock.getInst(interfaceCatModel);
    this.interModel = mock.getInst(interfaceModel);
    this.projectModel = mock.getInst(projectModel);
  }

  async handleListClass(pid, status) {
   
    let result = await this.catModel.list(pid), newResult = [];
    for (let i = 0, item, list; i < result.length; i++) {
      item = result[i].toObject()
      list = await this.interModel.listByInterStatus(item._id, status)
      for (let j = 0; j < list.length; j++) {
        list[j] = list[j].toObject()
      }
      item.list = list;
      newResult[i] = item
    }
    return newResult;
  }

  async exportData(ctx) {

    let pid = ctx.request.query.pid;
    let type = ctx.request.query.type;
    let status = ctx.request.query.status;
    if (!pid) {
      ctx.body = mock.commons.resReturn(null, 200, "pid 不为空");
    }
    let curProject;
    let tp = "";
    try {
      curProject = await this.projectModel.get(pid);
      ctx.set("Content-Type", "application/octet-stream");
      const list = await this.handleListClass(pid, status);
      switch (type) {
        case "markdown": {
          tp = await createMarkdown.bind(this)(list, false);
          ctx.set("Content-Disposition", `attachment; filename=api.md`);
          return ctx.body = tp;
        }
        default: {//默认为html
          tp = await createHtml.bind(this)(list);
          ctx.set("Content-Disposition", `attachment; filename=api.html`);
          return ctx.body = tp;
        }

      }
    } catch (error) {
      mock.commons.log(error, 'error');
      ctx.body = mock.commons.resReturn(null, 502, "下载出错");
    }

    
    async function createHtml(list) {
      let md = await createMarkdown.bind(this)(list, true);
      let markdown = markdownIt({ html: true, breaks: true });
      markdown.use(markdownItAnchor); // Optional, but makes sense as you really want to link to something
      markdown.use(markdownItTableOfContents, {
        markerPattern: /^\[toc\]/im
      });
     
      require('fs').writeFileSync('./a.markdown', md)
      let tp = unescape(markdown.render(md));
     
      let left;
      // console.log('tp',tp);
      let content = tp.replace(/<div\s+?class="table-of-contents"\s*>[\s\S]*?<\/ul>\s*<\/div>/gi, function (match) {
        left = match;
        return '';
      });
      // console.log('left',left);
      return createHtml5(left, content);
    }


    function createHtml5(left, tp) {
      //html5模板
      let html = `<!DOCTYPE html>
      <html>
      <head>
      <title>${curProject.name}</title>
      <meta charset="utf-8" />
      ${defaultTheme}
      </head>
      <body>
        <div class="m-header">
          <a href="#" style="display: inherit;"><svg class="svg" width="32px" height="32px" viewBox="0 0 64 64" version="1.1"><title>Icon</title><desc>Created with Sketch.</desc><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1"><stop stop-color="#FFFFFF" offset="0%"></stop><stop stop-color="#F2F2F2" offset="100%"></stop></linearGradient><circle id="path-2" cx="31.9988602" cy="31.9988602" r="2.92886048"></circle><filter x="-85.4%" y="-68.3%" width="270.7%" height="270.7%" filterUnits="objectBoundingBox" id="filter-3"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.159703351 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="大屏幕"><g id="Icon"><circle id="Oval-1" fill="url(#linearGradient-1)" cx="32" cy="32" r="32"></circle><path d="M36.7078009,31.8054514 L36.7078009,51.7110548 C36.7078009,54.2844537 34.6258634,56.3695395 32.0579205,56.3695395 C29.4899777,56.3695395 27.4099998,54.0704461 27.4099998,51.7941246 L27.4099998,31.8061972 C27.4099998,29.528395 29.4909575,27.218453 32.0589004,27.230043 C34.6268432,27.241633 36.7078009,29.528395 36.7078009,31.8054514 Z" id="blue" fill="#2359F1" fill-rule="nonzero"></path><path d="M45.2586091,17.1026914 C45.2586091,17.1026914 45.5657231,34.0524383 45.2345291,37.01141 C44.9033351,39.9703817 43.1767091,41.6667796 40.6088126,41.6667796 C38.040916,41.6667796 35.9609757,39.3676862 35.9609757,37.0913646 L35.9609757,17.1034372 C35.9609757,14.825635 38.0418959,12.515693 40.6097924,12.527283 C43.177689,12.538873 45.2586091,14.825635 45.2586091,17.1026914 Z" id="green" fill="#57CF27" fill-rule="nonzero" transform="translate(40.674608, 27.097010) rotate(60.000000) translate(-40.674608, -27.097010) "></path><path d="M28.0410158,17.0465598 L28.0410158,36.9521632 C28.0410158,39.525562 25.9591158,41.6106479 23.3912193,41.6106479 C20.8233227,41.6106479 18.7433824,39.3115545 18.7433824,37.035233 L18.7433824,17.0473055 C18.7433824,14.7695034 20.8243026,12.4595614 23.3921991,12.4711513 C25.9600956,12.4827413 28.0410158,14.7695034 28.0410158,17.0465598 Z" id="red" fill="#FF561B" fill-rule="nonzero" transform="translate(23.392199, 27.040878) rotate(-60.000000) translate(-23.392199, -27.040878) "></path><g id="inner-round"><use fill="black" fill-opacity="1" filter="url(#filter-3)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use><use fill="#F7F7F7" fill-rule="evenodd" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use></g></g></g></g></svg></a>
          <a href="#"><h1 class="title">接口文档</h1></a>
          <div class="nav">
            <a href="http://139.129.235.147:3000/doc/">Lemonce Mock Server</a>
          </div>
        </div>
        <div class="g-doc">
          ${left}
          <div id="right" class="content-right">
          ${tp}
          </div>
        </div>
      </body>
      </html>
      `;
      return html;
    }

    function createMarkdown(list, isToc) {//拼接markdown
      //模板
      let mdTemplate = ``;
      try {
        // 项目名称信息
        mdTemplate += md.createProjectMarkdown(curProject);
        // 分类信息
        mdTemplate += md.createClassMarkdown(curProject, list, isToc);
        return mdTemplate;
      } catch (e) {
        mock.commons.log(e, 'error');
        ctx.body = mock.commons.resReturn(null, 502, "下载出错");
      }
    }

  }
}

module.exports = exportController;