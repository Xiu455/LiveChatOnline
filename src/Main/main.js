// @charset "UTF-8";

// const fs = require('fs');
const { join, dirname, parse } = require('path');
const { app, BrowserWindow, dialog, ipcMain, globalShortcut } = require('electron');

let mainWindow;

const UIrouter = {
    main: './webUI/index.html'
}

/**
    視窗設定1
*/
const windowSetting1 = {
    width: 800,                                                // 視窗預設寬度
    height: 600,                                                // 視窗預設高度
    minWidth: 500,                                             // 最小寬度
    minHeight: 600,                                             // 最小高度
    // x: 100,                                                     // x預設位置
    // y: 100,                                                     // y預設位置
    webPreferences: {
        preload: join(__dirname, 'preload.js'),                 // 預先引入
        devTools: true,                                         // 是否啟用devTools
        nodeIntegration: true,                                  // 是否允許渲染進程中使用Node.js模組
        enableRemoteModule: true,                               // 是否允許渲染進程中可以使用主進程的模組
    },
    autoHideMenuBar: true,                                      // 是否隱藏選單
}

/**
    按鍵註冊
*/
const keyReg = () => {
    let openDevToolsflag = false;

    // F11註冊為 開啟/關閉 開發模式
    globalShortcut.register('F11', () => {
        openDevToolsflag = !openDevToolsflag;
        openDevToolsflag?
            mainWindow.webContents.openDevTools() :
            mainWindow.webContents.closeDevTools();
    });

    // F5註冊為 '畫面刷新'
    globalShortcut.register('F5', () => {
        mainWindow.webContents.reload();
    });
}

(async () => {
    app.on('ready', () => { app.locale = 'zh-TW'; });   // 設定語言
    await app.whenReady();  // 等待app準備好

    mainWindow = new BrowserWindow(windowSetting1);
    await mainWindow.loadFile(UIrouter.main);   // 開啟主視窗
    // mainWindow.webContents.openDevTools();      // 開啟開發模式

    keyReg();  // 按鍵註冊

    ipcMain.handle('test-reply', async (event, data) => {
        return {
            status: 'success',
            data: '這是 handle/invoke 的回應'
        };
    });

    ipcMain.on('test-click', (event, data) => {
        console.log('收到渲染進程的數據:', data);

        event.reply('test-response', {
            status: 'success',
            data: '這是 send/on 的回應',
            receivedData: data
        });
    });

    app.on('window-all-closed', () => {
        if(process.platform !== 'darwin') app.quit();
    });
})();

// mainWindow.webContents.openDevTools();  //開發模式