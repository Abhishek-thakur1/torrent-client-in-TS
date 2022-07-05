const net = require('net');
const bencodePeer = require('bencode')
const BufferPeer = require('buffer').Buffer
const parseTorrentPeer = require('parse-torrent')

const messageFactory = require('./messageFactory.ts')
const oEnvironment = require('./envionment.ts');

let keepAliveInterval: any = null;
let ptPeer: any = null;
let pieceCache: Array<number> = [];
let pieceCount: Array<number> = [];


// module.exports download = function(ip, port, torrent, peerStateManager){}
