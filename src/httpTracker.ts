const fsync = require("fs");
const parseTorrentFile = require("parse-torrent");
const bencodeHttp = require("bencode");
const request = require("request");
const peer = require("./peer");
import { Peer } from './types'

let j: number = 0;

function getPeerList(torrent: any, callback: any): any {

    // creating and sending announce request...

    let pt = parseTorrentFile(bencodeHttp.encode(torrent))

    // make request if tracker list not exhausted

    if (j < pt.announce.length) {
        request({
            url: pt.announce[j] + getAnnounceQueryString(torrent),
            method: 'GET',
            encoding: null
        }, function (error: any, response: any, body: any) {
            if (error) {
                console.log("Error requesting from tracker:" + pt.announce[j]);
                console.log("Trying next tracker")
                //try next tracker
                j++;
                getPeerList(torrent, callback);
            }
            else {
                console.log("Tracker response:" + body);
                var decodedBody = bencodeHttp.decode(body);
                if (decodedBody['failure reason']) {
                    console.log(response.statusCode, "error: " + bencodeHttp.encode(decodedBody['failure reason']));
                }
                else if (!decodedBody.peers) {
                    console.log(response.statusCode, "error: Did not receive peer list from Tracker, response: " + body);
                }
                else {
                    var peerList = [];
                    var type = decodedBody.peers instanceof Array ? "Array" : "Object";
                    if (type == "Object") {
                        console.log("Compact Notation");
                        for (var i = 0; i < decodedBody.peers.length; i += 6) {
                            var peer = {
                                ip: num2dot(decodedBody.peers.readUInt32BE(i)),
                                port: decodedBody.peers.readUIntBE(i + 4, 2).toString()
                            };
                            peerList.push(peer);
                        }
                    }
                    else {
                        console.log("Normal Notation");
                        peerList = decodedBody.peers.map(function (peer: any) {
                            return {
                                ip: peer.ip.toString("utf8"),
                                port: peer.port
                            };
                        })
                    }
                    callback(peerList);
                }
            }
        });
    }
    else {
        // tracker lists exhausted, no peers to return...
        console.log("Tracker list exhausted: ")
        callback([]);
    }
};

function getAnnounceQueryString(torrent: any): string {
    var pTorrent = parseTorrentFile(bencodeHttp.encode(torrent));
    var announceRequest = "?info_hash=" + escapeInfoHash(pTorrent.infoHash) +
        "&peer_id=-VT0001-000000000000&port=6687&uploaded=0&downloaded=0&left=" +
        pTorrent.length + "&event=started";

    return announceRequest;
}

function escapeInfoHash(infoHash: any): any {
    var h = infoHash;
    h = h.replace(/.{2}/g, function(m: string) {
        var v = parseInt(m, 16);
        if (v <= 127) {
            m = encodeURIComponent(String.fromCharCode(v));
            if (m[0] === '%')
                m = m.toLowerCase();
        }
        else
            m = '%' + m;
        return m;
    });
    return h;
};

function num2dot(num: number) {
    var d: any = num % 256;
    for (var i = 3; i > 0; i--) {
        num = Math.floor(num / 256);
        d = num % 256 + '.' + d;
    }
    return d;
};

module.exports.getPeerList = getPeerList;