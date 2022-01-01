import { NoteI } from './../models/notes.models';
import { Server, Socket } from 'socket.io'
import http = require('http')

type SocketListener = ((socket: import('socket.io').Socket) => void)

/**
 * A parent socket helper class for extends to other sockets class
 */
export default class SocketService {

    protected activeIds: number[] = []
    protected appName: string = 'Not defined'
    protected app: http.Server
    protected io: Server | undefined = undefined
    protected listeners: SocketListener[] = []
    protected onMessages: (() => void)[] = []

    constructor(app: http.Server) {
        this.activeIds = [];
        this.appName = "no defined";
        this.app = app;
        this.listeners = [];
        this.onMessages = [];
    }

    init() {
        this.io = new Server(this.app, { cors: { origin: "*", methods: ['GET', 'POST'] } });
        return this.setIo(this.io)
    }

    setIo(io: Server) {
        this.io = io
        this.io.on("connection", (socket: Socket) => this.connection(socket))
        return this.io
    }

    /**
     * @param {import('socket.io').Socket} socket
     */
    connection(socket: Socket) {
        console.log(`a user connected to ${this.appName}`);
        socket.on('disconnect', () => this.disconnect(socket))
    }

    disconnect(_: Socket) {
        console.log(`a user disconnected from ${this.appName}`);
    }

    /**
     * @param {SocketListener} socket
     */
    addListener(socket: SocketListener) {
        this.listeners.push(socket);
    }

    /**
     * @param {Socket} socket
     */
    listen(socket: { id: any }) {
        console.log(socket.id);
    }
}