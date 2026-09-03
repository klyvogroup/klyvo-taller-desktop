const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

// =========================================
// URL DE PRODUCCIÓN DE KLYVO TALLER
// =========================================

const APP_URL = "http://localhost:3000"; // ← temporal, para probar en tu computador

let ventanaPrincipal = null;

function crearVentana() {
  ventanaPrincipal = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    icon: path.join(__dirname, "assets", "Logos", "KlyvoTaller.png"),
    autoHideMenuBar: true, // oculta la barra de menú por defecto, look más "app"
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  ventanaPrincipal.loadURL(APP_URL);

  // =========================================
  // ABRIR ENLACES EXTERNOS (WhatsApp, etc.)
  // EN EL NAVEGADOR DEL SISTEMA, NO DENTRO DE LA APP
  // =========================================

  ventanaPrincipal.webContents.setWindowOpenHandler(({ url }) => {
    // Los enlaces de wa.me, checkout de Wompi, etc. se abren afuera
    if (!url.startsWith(APP_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  ventanaPrincipal.on("closed", () => {
    ventanaPrincipal = null;
  });
}

// =========================================
// MENÚ MÍNIMO (Recargar, Salir)
// =========================================

function crearMenu() {
  const plantilla = [
    {
      label: "Klyvo Taller",
      submenu: [
        {
          label: "Recargar",
          accelerator: "CmdOrCtrl+R",
          click: () => ventanaPrincipal?.reload(),
        },
        { type: "separator" },
        { label: "Salir", role: "quit" },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(plantilla));
}

app.whenReady().then(() => {
  crearMenu();
  crearVentana();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentana();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
