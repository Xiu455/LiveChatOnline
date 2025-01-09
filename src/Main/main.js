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
    width: 550,                                                 // 視窗預設寬度
    height: 600,                                                // 視窗預設高度
    minWidth: 500,                                              // 最小寬度
    minHeight: 600,                                             // 最小高度
    // x: 100,                                                     // x預設位置
    // y: 100,                                                     // y預設位置
    icon: join(__dirname, 'assets/icon/.ico'),                  // 視窗圖標
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

    mainWindow.webContents.on('before-input-event', (event, input) => {
        if(input.type !== 'keyDown'){ return; }
        switch(input.key){
            case 'F5':  // 刷新畫面
                event.preventDefault();
                mainWindow.webContents.reload();
                break;
            case 'F12': // 開啟/關閉 開發模式
                openDevToolsflag = !openDevToolsflag;
                openDevToolsflag?
                    mainWindow.webContents.openDevTools() :
                    mainWindow.webContents.closeDevTools();
                break;
        }
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
        globalShortcut.unregisterAll();
        if(process.platform !== 'darwin') app.quit();
    });
})();

// mainWindow.webContents.openDevTools();  //開發模式