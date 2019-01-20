const { app, BrowserWindow, ipcMain } = require('electron');
let mainWindow;

ipcMain.on("get-config", evt => {
	evt.returnValue = {
		appDataDir: app.getPath("userData")
	}
});

app.on('ready', createWindow);
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});

function createWindow() {
	mainWindow = new BrowserWindow({ 
		width: 800, 
		height: 600, 
		icon: "assets/tabelidze.png"
	});
	mainWindow.loadFile('index.html');

	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	mainWindow.webContents.openDevTools();
}