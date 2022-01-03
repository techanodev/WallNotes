import { Socket } from "socket.io";
import Note, { NoteI } from "../models/notes.models";
import SocketService from "./sockets";

type Coordinates = { x: number, y: number }

export default class NotesSockets extends SocketService {

    protected appName: string = 'Notes';
    private notes: { [id: string]: NoteI[] } = {}

    connection(socket: Socket): void {
        super.connection(socket)
        socket.join('room')
        socket.on('notes', (notes) => this.onNotes(socket, notes))
        socket.on('create', (coordinates: Coordinates) => this.createNote(socket, coordinates))
        socket.on('delete', (id: string) => this.deleteNote(socket, id))
        socket.emit('notes', this.notes)
    }

    onNotes(socket: Socket, notes: NoteI[]) {
        this.notes[socket.id] = notes
        socket.in('room').emit('notes', this.notes)
    }

    createNote(socket: Socket, coordinates: Coordinates) {
        this.getUserId(socket).then(data => {
            console.log(data)
            const note = new Note({ coordinates: coordinates, text: '', userId: data.userId })
            note.save((error, note) => {
                if (error) {
                    console.error(error)
                    return socket.emit('error', error)
                }
                console.log(data)
                const noteData: NoteI = {
                    id: note.id,
                    coordinates: coordinates,
                    text: '',
                    userId: data.userId
                }
                socket.emit('note', noteData)
            })
        })
    }

    deleteNote(socket: Socket, id: string) {
        Note.deleteOne({ id: id }).then(x => {
            socket.emit('delete', id)
            console.info('a note has removed by id ' + x)
        }).catch(e => {
            console.error(e)
            socket.emit('error', e)
        })
    }
}