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
        socket.on('change', (note: NoteI) => this.onChangeNote(socket, note))
        socket.on('move', (note: NoteI) => this.onMoveNote(socket, note))
        socket.emit('notes', this.notes)
    }

    onNotes(socket: Socket, notes: NoteI[]) {
        this.notes[socket.id] = notes
        socket.in('room').emit('notes', this.notes)
    }

    onChangeNote(socket: Socket, note: NoteI) {
        console.log(note)
        socket.in('room').emit('user-note', {
            ...note,
            text: note.text.removeBadWords()
        })
        console.log(note.id)
        Note.updateOne({ _id: note.id }, note, (err: any, docs: any) => {
            if (err)
                console.error(err)
            else
                console.log(docs)
        })
    }

    onMoveNote(socket: Socket, note: NoteI) {
        socket.in('room').emit('user-note', note)
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
                const noteData: NoteI = {
                    id: note.id,
                    coordinates: coordinates,
                    text: '',
                    userId: data.userId
                }
                socket.emit('note', noteData)
                socket.in('room').emit('user-note', note)
            })
        })
    }

    deleteNote(socket: Socket, id: string) {
        Note.deleteOne({ _id: id }).then(x => {
            socket.to('room').emit('delete', id)
            socket.emit('delete', id)
            console.info('a note has removed by id ' + x)
        }).catch(e => {
            console.error(e)
            socket.emit('error', e)
        })
    }
}