/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'
import fs from 'fs'

class AppUpdater {
    constructor() {
        log.transports.file.level = 'info'
        autoUpdater.logger = log
        autoUpdater.checkForUpdatesAndNotify()
    }
}
interface TradovateRecord {
  accountName: string
  date: string
  totalAmount: number
  dailyPnL: number
}

let mainWindow: BrowserWindow | null = null

ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`
    console.log(msgTemplate(arg))
    event.reply('ipc-example', msgTemplate('pong'))
})

ipcMain.handle('read-tradovate-csv', async () => {
    const filePath = path.join(app.getAppPath(), 'Account Balance History.csv');
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim() !== '');

        return lines.slice(1).map(line => {
            // Regex handles commas inside quotes for the "Total Amount" field
            const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            return {
                accountId: parts[0],
                accountName: parts[1],
                date: parts[2],
                // Removes quotes/commas to ensure numbers are usable
                totalAmount: parseFloat(parts[3].replace(/[",]/g, '')),
                dailyPnL: parseFloat(parts[4])
            };
        });
    } catch (error) {
        console.error('Error reading CSV:', error);
        return [];
    }
});

ipcMain.handle('add-new-trade', async (_event, newTrade) => {
    const tradesFilePath = path.join(app.getAppPath(), 'trades.json')
    try {
        const data = fs.readFileSync(tradesFilePath, 'utf-8')
        let trades = JSON.parse(data)
        trades = trades.reverse()

        trades.push(newTrade)
        trades = trades.reverse()
        fs.writeFileSync(
            tradesFilePath,
            JSON.stringify(trades, null, 2),
            'utf-8'
        )

        return { success: true, message: 'Trade added successfully' }
    } catch (err) {
        console.error('Error updating trades.json:', err)
        return { success: false, message: 'Failed to add new trade' }
    }
})

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support')
    sourceMapSupport.install()
}

const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

// if (isDebug) {
//     require('electron-debug')()
// }

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS']

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log)
}

const createWindow = async () => {
    if (isDebug) {
        await installExtensions()
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets')

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths)
    }

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, 'preload.js')
                : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
    })

    mainWindow.loadURL(resolveHtmlPath('index.html'))

    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined')
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize()
        } else {
            mainWindow.show()
        }
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    const menuBuilder = new MenuBuilder(mainWindow)
    menuBuilder.buildMenu()

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url)
        return { action: 'deny' }
    })

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater()
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.whenReady()
    .then(() => {
        createWindow()
        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) createWindow()
        })
    })
    .catch(console.log)
