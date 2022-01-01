import { Socket } from "socket.io";
import { NoteI } from "../models/notes.models";
import SocketService from "./sockets";

export default class NotesSockets extends SocketService {

    protected appName: string = 'Notes';
    private notes: { [id: string]: NoteI[] } = {}

    connection(socket: Socket): void {
        super.connection(socket)
        socket.join('room')
        socket.on('notes', (notes) => this.onNotes(socket, notes))
        socket.emit('notes', this.notes)
    }

    onNotes(socket: Socket, notes: NoteI[]) {
        this.notes[socket.id] = notes
        socket.in('room').emit('notes', this.notes)
    }
}