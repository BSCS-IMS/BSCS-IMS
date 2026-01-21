const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  // Support multiple ports (Next.js might use 3001 if 3000 is busy)
  const PORT = process.env.PORT || 3000

  if (isDev) {
    // Development: Load from localhost
    console.log(`🚀 Loading from localhost:${PORT}...`)
    win.loadURL(`http://localhost:${PORT}`)

    // Open DevTools automatically in development
    win.webContents.openDevTools()

    // Handle loading errors - retry connection
    win.webContents.on('did-fail-load', () => {
      console.log('❌ Failed to load - retrying in 1 second...')
      console.log(`   Make sure Next.js dev server is running on port ${PORT}`)
      setTimeout(() => {
        win.loadURL(`http://localhost:${PORT}`)
      }, 1000)
    })

    // Log when page loads successfully
    win.webContents.on('did-finish-load', () => {
      console.log('✅ Page loaded successfully!')
    })
  } else {
    // Production: Load from built files
    const indexPath = path.join(__dirname, '../out/index.html')
    console.log('📦 Loading production build from:', indexPath)
    win.loadFile(indexPath)
  }

  // Optional: Prevent the window from being closed accidentally
  // win.on('close', (e) => {
  //   const choice = dialog.showMessageBoxSync(win, {
  //     type: 'question',
  //     buttons: ['Yes', 'No'],
  //     title: 'Confirm',
  //     message: 'Are you sure you want to quit?'
  //   })
  //   if (choice === 1) {
  //     e.preventDefault()
  //   }
  // })
}

// When Electron is ready, create the window
app.whenReady().then(() => {
  console.log('🔧 Environment:', process.env.NODE_ENV || 'development')
  console.log('📦 Is Packaged:', app.isPackaged)

  createWindow()

  // Keyboard shortcuts
  // Reload window (Ctrl+R or Cmd+R)
  globalShortcut.register('CmdOrCtrl+R', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      console.log('🔄 Reloading window...')
      focusedWindow.reload()
    }
  })

  // Toggle DevTools (Ctrl+Shift+I or Cmd+Shift+I)
  globalShortcut.register('CmdOrCtrl+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })

  // Optional: Force reload (Ctrl+Shift+R or Cmd+Shift+R)
  globalShortcut.register('CmdOrCtrl+Shift+R', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      console.log('🔄 Force reloading...')
      focusedWindow.webContents.reloadIgnoringCache()
    }
  })
})

// Cleanup shortcuts when app quits
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// On macOS, re-create window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Optional: Handle external links (open in default browser instead of Electron)
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Open external links in default browser
    if (url.startsWith('http://') || url.startsWith('https://')) {
      require('electron').shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })
})
