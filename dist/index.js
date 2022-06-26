"use strict";
const fs = require('fs');
const bencode = require('bencode');
const parseTorrent = require('parse-torrent');
let args = process.argv.slice(2);
let torrentFileName = args[0];
if (typeof (torrentFileName) !== 'undefined') {
    let torrentFile = fs.readFileSync(torrentFileName);
    let torrent = bencode.decode(torrentFile);
    let pt = parseTorrent(torrentFile);
    let remaining = pt.pieces.length;
    console.log(torrentFile);
}
