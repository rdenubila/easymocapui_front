import Peer from 'peerjs';
import EventsService from './events';

const config = {
    host: window.location.hostname,
    port: 9000,
    path: 'myapp',
    secure: false
}

export default class VideoStream {

    peer;
    conn;
    call;
    mediaStream;
    addPeerFn = (peer) => { };
    removePeerFn = (peer) => { };
    peers = [];

    setMediaStream = (_mediaStream) => this.mediaStream = _mediaStream;

    replaceFns = (addPeerFn, removePeerFn, peers) => {
        this.addPeerFn = addPeerFn;
        this.removePeerFn = removePeerFn;
        this.peers = peers;
        return this;
    };

    connect(isServer, id) {
        if (this.peer) return;

        if (isServer) this.connectAsServer();
        else this.connectAsClient(id);

        this.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        this.peer.on('connection', (conn) => {
            this.addPeerFn(conn);

            conn.on('data', this.onData);
            conn.on('open', this.onOpen);
            conn.on('close', () => {
                this.removePeerFn(conn);
            });
        });

        this.peer.on('error', (err) => console.log(err));
        return this;
    }

    connectAsServer() {
        this.peer = new Peer('server', config);
    }

    connectAsClient(id) {
        this.peer = new Peer(id, config);
    }

    onData(data) {
        new EventsService('videoStream').dispatch(data);
    }

    onOpen() {
        console.log('hello!');
    }

    connectToServer(metadata) {
        this.conn = this.peer.connect('server', { metadata });
        this.conn.on('data', this.onData);
        this.conn.on('open', this.onOpen);
    }

    sendById(id, msg) {
        const conn = this.peers.find(p => p.peer === id);
        if (conn) this.send(msg, conn);
    }

    send(msg, conn) {
        if (conn)
            conn.send(msg);
        else
            this.conn.send(msg);
    }

    sendToAll(msg) {
        for (const p of this.peers)
            this.send(msg, p);
    }

    callToPeer(peerId) {
        var call = this.peer.call(peerId, new MediaStream());
        call.on('stream', function (stream) {
            // `stream` is the MediaStream of the remote peer.
            // Here you'd add it to an HTML video/canvas element.
            console.log("stream");
            console.log(stream);
        });
        console.log(call);
    }

}
