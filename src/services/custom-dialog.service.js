import { remote } from 'electron';
import * as path from 'path';

const { BrowserWindow } = remote;

export function showCustomError(title, message, link) {
  // so we can add hyperlinks
  let child = new BrowserWindow({
    titleBarStyle: 'hidden',
    parent: window.mainWindow,
    modal: true,
    show: false,
    alwayOnTop: true,
    icon: path.join(__dirname, 'assets/icons/png/256x256.png'),
  });
  const content = `data:text/html,
  <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial,Helvetica Neue,Helvetica,sans-serif; 
        }
        div {
          padding: 1em;
          margin: 10%;
          background: lightgray;
          border-radius: 10px;
        }
        .wrapper {
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="message">
          ${message}
          <br/><a href="${link.href}">${link.text}</a>
        </div>
        <button onclick="window.close()">OK</button>
      </div>
    <body>
  </html>`;

  child.setMenu(null); // remove menu bar
  child.loadURL(content.trim());

  // dialog.showErrorBox('Node missing', content); // not possible to add a hyperlink

  // todo: open link in default browser
  // function isSafeishURL(url) {
  //   return url.startsWith('http:') || url.startsWith('https:');
  // }

  // child.webContents.on('will-navigate', (event, url) => {
  //   event.preventDefault();
  //   if (isSafeishURL(url)) {
  //     shell.openExternal(url);
  //   }
  // });

  child.once('ready-to-show', () => {
    child.show();
  });
  // child.openDevTools();
}
