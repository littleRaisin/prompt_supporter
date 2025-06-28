// src/electron/main.ts

import { app, BrowserWindow, Menu, ipcMain } from "electron";
import { join } from "path";
import path from 'path';
import fs from 'fs'; // fsモジュールをインポート

// 1. this import won't work yet, but we will fix that next
import "./api";

// 2. simple check if we are running in dev / preview / production
const isDev = process.env.DEV != undefined;
const isPreview = process.env.PREVIEW != undefined;

// ウィンドウの状態を保存するファイルのパス
const windowStatePath = path.join(app.getPath('userData'), 'window-state.json');

function createWindow() {
  let x, y, width, height;

  try {
    // 保存されたウィンドウの状態を読み込む
    const windowState = JSON.parse(fs.readFileSync(windowStatePath, 'utf-8'));
    x = windowState.x;
    y = windowState.y;
    width = windowState.width;
    height = windowState.height;
  } catch (e) {
    // ファイルが存在しないか、読み込みに失敗した場合はデフォルト値を使用
    width = 800;
    height = 600;
  }

  const mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  // ウィンドウのリサイズと移動イベントを監視し、状態を保存
  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getBounds();
    saveWindowState({ width, height });
  });

  mainWindow.on('move', () => {
    const { x, y } = mainWindow.getBounds();
    saveWindowState({ x, y });
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

// ウィンドウの状態をファイルに保存する関数
function saveWindowState(state: { width?: number, height?: number, x?: number, y?: number }) {
  let currentState = { width: 800, height: 600 }; // デフォルト値

  try {
    if (fs.existsSync(windowStatePath)) {
      currentState = JSON.parse(fs.readFileSync(windowStatePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to read window state:', e);
  }

  const newState = { ...currentState, ...state };
  try {
    fs.writeFileSync(windowStatePath, JSON.stringify(newState));
  } catch (e) {
    console.error('Failed to save window state:', e);
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

// アプリケーションのバージョンを返すIPCハンドラ
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

app.on("window-all-closed", () => {
  // アプリケーション終了時にもウィンドウの状態を保存
  const mainWindow = BrowserWindow.getAllWindows()[0]; // 最初のウィンドウを取得
  if (mainWindow) {
    const { x, y, width, height } = mainWindow.getBounds();
    saveWindowState({ x, y, width, height });
  }
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
