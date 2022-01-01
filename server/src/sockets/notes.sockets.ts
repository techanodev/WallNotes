import { Socket } from "socket.io";
import { NoteI } from "../models/notes.models";
import SocketService from "./sockets";

export default class NotesSockets extends SocketService {

    protected appName: string = 'Notes';

    connection(socket: Socket): void {
        super.connection(socket)
        socket.join('room')
        socket.on('notes', (notes) => this.onNotes(socket, notes))
    }

    onNotes(socket: Socket, notes: NoteI[]) {
        socket.in('room').emit('notes', notes)

    }
}