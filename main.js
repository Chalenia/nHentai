const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch');
const request = require('request').defaults({ encoding: null });
const JSZip = require("jszip")
const Store = require('electron-store')
const settings = new Store({name: "config"})

const createWindow = async () => {
  const { screen } = require('electron')
  const {height,width} = screen.getPrimaryDisplay().workAreaSize

  const win = new BrowserWindow({
    icon: path.join(__dirname,'app','img', 'nH.ico'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname,'app','js', 'preload.js'),
      nodeIntegration: true,
      ontextIsolation: false,
      webSecurity: false
    }
  })
  
  const blocker = await ElectronBlocker.fromLists(fetch, [
    'https://easylist.to/easylist/easylist.txt'
  ]);
  if (settings.get("blockAds") == true) blocker.enableBlockingInSession(win.webContents.session);

  //win.webContents.openDevTools()
  win.loadURL("https://nhentai.net/")
  win.removeMenu()
  win.center()

  ipcMain.on("size", (event,appWidth,appHeight) => {
    win.setSize(Math.floor(width/appWidth),Math.floor(height/appHeight));
    win.center()
    win.show();
  })

  ipcMain.on("setSetting",(evet,name,value) => {
    settings.set(name,value);
  })

  ipcMain.handle("getSetting",async (event,name) => {
    return settings.get(name);
  })

  ipcMain.on("relaunch",(event) => {
    app.relaunch()
    app.exit()
  })

  ipcMain.on("changeIcon", (event,icon) => {
    win.setIcon(path.join(__dirname,'app','img', `${icon}.ico`));
  })

  ipcMain.on("zip", (event,array) => {
    var zip = new JSZip();
    var count = 0;
    array.forEach(page => {
      request.get(page, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = Buffer.from(body).toString('base64');
            zip.file(page.replace("https://cdn.dogehls.xyz/galleries/","").substring(page.replace("https://cdn.dogehls.xyz/galleries/","").indexOf("/"),page.length).replace(/\D/g, "")+".jpeg", data, {base64: true});
            count++
        }
        if (count == array.length) {
          var content = zip.generate();
          event.sender.send("zipLink","data:application/zip;base64,"+content);
        }
      });
    })         
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
