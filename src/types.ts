interface PeerStateManager {
    log(peerString: string, messageToBeLogged: string): void;
    updateStatus(peerString: string, status: string): void;
    isRequested(pieceNumber: number): boolean;
    markRequested(pieceNumber: number): void;
    markNotRequested(pieceNumber: number): void;
    getPeerQueue(peerString: string): any;
    setPeerQueue(pieceNumber: number, peerQueue: any): void;
    savePiece(pieceNumber: number, piece: Array<number>): void;
    isChokingMe(peerString: string): boolean;
    markUnchoked(peerString: string): void;
    markedChoked(peerString: string): void;
    enqueue(peerString: string, value: number): void;
    dequeue(peerString: string): void;
    isEmpty(peerString: string): void;
}

type PeerState = Array<any> & { [index: string]: any };

module.exports = {PeerStateManager, PeerState};