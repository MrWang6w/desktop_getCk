const { app, BrowserWindow, session, dialog, clipboard } = require('electron');

let win = null;
let cookieStr = [];
let isSuccess = false;
function createWindow() {

  // 创建一个新的 BrowserWindow 实例
  win = new BrowserWindow({
    // 窗口的宽度
    width: 800,
    // 窗口的高度
    height: 600,
    // webPreferences 用于配置网页的功能选项
    webPreferences: {
      // 设置为 false，禁止在渲染进程中使用 Node.js 的 API
      nodeIntegration: false,
      // 将渲染进程与主进程隔离开，提高安全性
      contextIsolation: true,
      // 禁止在渲染进程中使用 remote 模块
      enableRemoteModule: false,
      // 禁止打开开发者工具
      devTools: false
    },
  });


  win.loadURL('https://www.baidu.com');

  session.defaultSession.cookies.on(
    'changed',
    (event, cookie) => {
      const { name, value } = cookie;
      cookieStr.push(`${name}=${value}`);
      console.log('name:', name);
      if (!isSuccess) {
        isSuccess = true
        const msg = cookieStr.join(';')
        dialog
          .showMessageBox(win, {
            type: 'info',
            title: '这是你想要的Cookie信息,请点击按钮进行复制',
            // message: '这是你想要的Cookie信息,请点击按钮进行复制',
            detail: msg,
            buttons: ['复制'],
          })
          .then((result) => {
            if (result.response === 0) {
              clipboard.writeText(msg);
            }
          });
      }
    }
  );

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
