import cp from 'child_process';
import vlcCommand from 'vlc-command';
import path from "path";
import { WEBTORRENT_DOWNLOAD_PATH } from '../config.js';

let proc = null;

export function spawn(url, title = '') {

  const movieUrl = path.join(WEBTORRENT_DOWNLOAD_PATH, url);

  vlcCommand((err, vlcPath) => {
    if (err) {
      console.error('Error getting VLC path:', err);
      return;
    }

    const args = [
      '--play-and-exit',
      '--quiet',
      `--meta-title=${JSON.stringify(title)}`,
      movieUrl
    ];

    spawnExternal(vlcPath, args);
  });
}

export function kill() {
  if (!proc) return;
  console.log(`Killing external player, pid ${proc.pid}`);
  proc.kill('SIGKILL'); // kill -9
  proc = null;
}

export function spawnExternal(playerPath, args) {
  console.log('Running external media player:', `${playerPath} ${args.join(' ')}`);

  proc = cp.spawn(playerPath, args, { stdio: 'ignore' });

  proc.on('close', code => {
    if (!proc) return; // Killed
    console.log('External player exited with code ', code);
    proc = null;
  });

  proc.on('error', err => {
    console.log('External player error', err);
  });
}
