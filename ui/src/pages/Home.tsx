import React from 'react';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper } from '@fortawesome/free-solid-svg-icons';
import LoginModal from '../components/modals/LoginModal';
import Note from '../components/Note';
import { NoteType } from '../types/NoteType';
import Auth from '../utils/Auth';
import Request from '../utils/Request';

type State = {
  userNotes: NoteType[];
  notes: { [id: string]: NoteType };
  isWide: boolean;
  userId: string;
  page: number;
  y: number;
  x: number;
  cursors: { [key: string]: { x: number; y: number; username: string; isClick: boolean } };
};

export default class Home extends React.Component<{}, State> {
  readonly colorPicker: React.RefObject<HTMLInputElement>;
  private socket?: Socket;

  constructor(props: {}) {
    super(props);
    this.state = {
      userNotes: [],
      notes: {},
      isWide: false,
      userId: '',
      page: 1,
      x: 0,
      y: 0,
      cursors: {}
    };
    this.colorPicker = React.createRef<HTMLInputElement>();
  }

  componentDidMount() {
    $('body').on('mousemove', (e) => {
      const x = e.pageX;
      const y = e.pageY;
      if (Math.abs(x - this.state.x) > 5 && Math.abs(y - this.state.y) > 5) {
        this.setState({ x, y });
        this.socket?.emit('cursor', { x: e.pageX, y: e.pageY, isClick: e?.buttons });
      }
    });
  }

  addNoteToState(note: NoteType) {
    const notes = this.state.userNotes;
    notes.push(note);
    this.setState({ userNotes: notes });
  }

  removeNoteFromState(id: string) {
    let notes = this.state.userNotes;
    let allNotes = this.state.notes;
    notes = notes.filter((x) => x.id !== id);
    delete allNotes[id];
    this.setState({ userNotes: notes, notes: allNotes });
  }

  mobileCheck() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  addNewNote(e?: React.MouseEvent) {
    const audio = new Audio('/audios/new-paper.wav');
    audio.play().then(() => {
      let x = e?.screenX ?? 0;
      let y = e?.screenY ?? 0;

      if (x) x += $('.notes').scrollLeft() ?? 0;
      if (y) x += $('.notes').scrollTop() ?? 0;

      this.socket?.emit('create', { x, y });
    });
  }

  deleteNote(index: number) {
    this.socket?.emit('delete', this.state.userNotes[index].id);
  }

  onChange(index: number, note: NoteType) {
    const notes = this.state.userNotes;
    notes[index] = note;
    this.setState({ userNotes: notes });
    this.socket?.emit('change', note);
  }

  onMove(index: number, note: NoteType) {
    const notes = this.state.userNotes;
    notes[index] = note;
    this.setState({ userNotes: notes });
    this.socket?.emit('move', note);
  }

  onContextMenu(e: React.MouseEvent) {
    if (!this.mobileCheck()) return;
    this.addNewNote(e);
  }

  onAuth() {
    const token = process.env.REACT_APP_SERVER ?? '';
    this.socket = io(token, { auth: { token: Auth.getToken() } });
    this.setState({ isWide: true });
    this.socket.on('user-note', (note) => {
      const notes = this.state.notes;
      notes[note.id] = note;
      this.setState({ notes: notes });
    });

    this.socket.on('note', (note) => {
      this.addNoteToState(note);
    });

    this.getData();

    this.socket.on('delete', (id) => {
      this.removeNoteFromState(id);
    });

    this.socket.on('error', (error) => {
      if (error.message) {
        toast.error(error.message);
      }
    });

    this.socket.on('cursors', (cursor) => {
      const cursors = this.state.cursors;
      cursors[cursor.id] = cursor;
      this.setState({ cursors });
    });

    this.socket.on('disconnect-user', (id) => {
      const cursors = this.state.cursors;
      delete cursors[id];
      this.setState({ cursors });
    });
  }

  getData() {
    Request.send(`v1/notes?page=${this.state.page}`, {
      method: 'GET',
      headers: { token: Auth.getToken() as string }
    })
      .then((val) => {
        if (!val.data.status) return;
        const notes: NoteType[] = val.data.notes;

        this.setState({ page: this.state.page + 1 });

        if (notes.length) {
          this.getData();
        } else {
          return;
        }

        const myNotes = this.state.userNotes;
        const notesResult: { [id: string]: NoteType } = this.state.notes;
        for (const note of notes) {
          if (note.own) {
            myNotes.push(note);
            continue;
          }
          notesResult[note.id] = note;
        }
        this.setState({ notes: notesResult, userNotes: myNotes });
      })
      .catch((e) => {
        toast.error('خطا در دریافت اطلاعات نوت ها');
      });
  }

  render() {
    return (
      <div className="home" style={this.state.isWide ? {} : {}}>
        <LoginModal onAuth={() => this.onAuth()} />

        <div
          className="notes"
          onDoubleClick={(e) => this.addNewNote(e)}
          onContextMenu={(e) => this.onContextMenu(e)}
        >
          {Object.values(this.state.notes)
            .flat()
            .map((note: NoteType) => (
              <Note note={note} readonly={true} />
            ))}
          {this.state.userNotes.map((note: NoteType, index: number) => (
            <Note
              note={note}
              onDelete={() => this.deleteNote(index)}
              onChange={(note) => this.onChange(index, note)}
              onMove={(note) => this.onMove(index, note)}
              readonly={false}
            />
          ))}
          {Object.values(this.state.cursors).map((cursor) => (
            <div
              className="cursors"
              style={{
                transform: `translate(${cursor.x}px, ${cursor.y}px)`
              }}
            >
              <div>{cursor.username}</div>
              <FontAwesomeIcon className="icon" icon={cursor.isClick ? faHandRock : faHandPaper} />
            </div>
          ))}
        </div>

        <button className="btn btn-primary rounded-circle add" onClick={() => this.addNewNote()}>
          +
        </button>
      </div>
    );
  }
}
