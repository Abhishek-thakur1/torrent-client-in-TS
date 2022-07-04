const fs = require('fs');
const bencode = require('bencode');
const parseTorrent = require('parse-torrent');
const {PeerStateManager, PeerState} = require('./types')

let args = process.argv.slice(2);
let torrentFileName: string = args[0];
let peerState: PeerState = [];
let requested: Array<boolean> = [];
let isChoking: Array<string> = [];

if (typeof (torrentFileName) !== 'undefined') {
    var torrentFile = fs.readFileSync(torrentFileName);
    var torrent = bencode.decode(torrentFile)
    var pt = parseTorrent(torrentFile)
    let remaining: number = pt.pieces.length

    // console.log(torrentFile)

    var peerStateManager: PeerStateManager = {
        log: function (peerString, messageToBeLogged) {
            peerState[peerString].messages.push(messageToBeLogged);
        },
        updateStatus: function (peerString, status) {
            peerState[peerString].status = status;
        },
        isRequested: function (pieceNumber) {
            return requested[pieceNumber] || false;
        },
        markRequested: function (pieceNumber) {
            requested[pieceNumber] = true;
        },
        markNotRequested: function (pieceNumber) {
            requested[pieceNumber] = false;
        },
        getPeerQueue: function (peerString) {
            return peerState[peerString].pieceQueue;
        },
        setPeerQueue: function (peerString, peerQueue) {
            peerState[peerString].pieceQueue = peerQueue;
        },
        savePiece: function (pieceNumber, piece) {
            // savePieceToFile(pieceNumber, piece);
            remaining--;
        },
        isChokingMe: function (peerString) {
            return isChoking.indexOf(peerString) > -1 ? true : false;
        },
        markUnchoked: function (peerString) {
            var index = isChoking.indexOf(peerString);
            if (index > -1) isChoking.splice(index, 1);
        },
        markedChoked: function (peerString) {
            var index = isChoking.indexOf(peerString);
            if (index === -1) {
                isChoking.push(peerString);
            }
        },
        enqueue: function (peerString, value) {
            peerState[peerString].pieceQueue.enqueue(value);
        },
        dequeue: function (peerString) {
            return peerState[peerString].pieceQueue.dequeue();
        },
        isEmpty: function (peerString) {
            return peerState[peerString].pieceQueue.isEmpty();
        }

    };
}

