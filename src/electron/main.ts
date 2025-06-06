// src/electron/main.ts

import { app, BrowserWindow, Menu } from "electron";
import { join } from "path";
import path from 'path';

// 1. this import won't work yet, but we will fix that next
import "./api";

// 2. simple check if we are running in dev / preview / production
const isDev = process.env.DEV != undefined;
const isPreview = process.env.PREVIEW != undefined;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    // 開発時はローカルサーバーを利用
    // ここではViteのデフォルトポート5173を使用
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else if (isPreview) {
    // プレビュー時はローカルのdistフォルダを利用
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  } else {
    // 本番環境ではビルドされたファイルを利用
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


app.on('browser-window-created', (_, win) => {
  // コンテキストメニューの設定
  // 右クリックメニューにコピー機能を追加
  win.webContents.on('context-menu', (_event, params) => {
    const menu = Menu.buildFromTemplate([
      {
        label: 'コピー',
        role: 'copy',
        enabled: params.selectionText.length > 0
      }
    ]);
    menu.popup({ window: win });
  });
});