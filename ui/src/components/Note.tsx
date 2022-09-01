import React from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { ColorResult, TwitterPicker } from 'react-color';
import { Box, Button, ButtonGroup, IconButton, Paper, Popper, Stack } from '@mui/material';
import { Delete as TrashIcon, ColorLens as ColorLensIcon } from '@mui/icons-material';
import { NoteType } from '../types/NoteType';

type State = {
  showColor: boolean;
  note: NoteType;
  isMove: boolean;
  mouseHover: boolean;
  anchorDeleteElement: null | HTMLElement;
};

type Props = {
  note: NoteType;
  onDelete?: () => void;
  onChange?: (note: NoteType) => void;
  onMove?: (note: NoteType) => void;
  readonly: boolean;
  onClick?: () => void;
};

export default class Note extends React.Component<Props, State> {
  readonly note: React.RefObject<HTMLDivElement>;
  readonly trash: React.RefObject<HTMLButtonElement>;
  readonly text: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      showColor: false,
      note: props.note,
      isMove: false,
      mouseHover: false,
      anchorDeleteElement: null
    };
    this.note = React.createRef<HTMLDivElement>();
    this.trash = React.createRef();
    this.text = React.createRef();
  }

  colorChange(e: ColorResult) {
    if (!this.note.current) return;
    const color = `rgb(${e.rgb.r},${e.rgb.g},${e.rgb.b})`;
    this.note.current.style.backgroundColor = color;
    const note = this.state.note;
    note.color = color;
    this.setState({ note: note });
    if (!this.props.onChange) return;
    this.props.onChange(this.state.note);
  }

  toggleColors() {
    this.setState({ showColor: !this.state.showColor });
  }

  toggleTrash(event: React.MouseEvent<HTMLElement>) {
    this.setState({
      anchorDeleteElement: this.state.anchorDeleteElement ? null : event.currentTarget
    });
  }

  onStartMoving() {
    this.setState({ isMove: true, showColor: false });
  }

  onEndMoving() {
    this.setState({ isMove: false });
    if (!this.props.onMove) return;
    this.props.onMove(this.state.note);
  }

  cancelTrash() {
    // this.setState({ showTrash: false });
  }

  onDelete() {
    const audio = new Audio('/audios/delete-paper.wav');
    audio.play().then(() => {
      this.onStartMoving();
      if (!this.props.onDelete) return;
      this.props.onDelete();
    });
  }

  onMove(e: DraggableData) {
    const note = this.state.note;
    note.coordinates.x = e.x;
    note.coordinates.y = e.y;
    this.setState({ note: note });
    if (!this.props.onChange) return;
    this.props.onChange(this.state.note);
  }

  onTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const note = this.state.note;
    note.text = e.target.value;
    this.setState({ note: note });
    if (!this.props.onChange) return;
    this.props.onChange(this.state.note);
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if ((prevProps.note && prevProps.note === this.props.note) || !this.props.note) return;
    this.setState({ note: this.props.note });
    if (
      this.state.note.coordinates.x !== prevState.note.coordinates.x ||
      this.state.note.coordinates.y !== prevState.note.coordinates.y
    ) {
      const audio = new Audio('/audios/move-paper.wav');
      audio.play().then(() => {});
    }
    if (this.state.note.color && this.note.current)
      this.note.current.style.backgroundColor = this.state.note?.color;
  }

  onClick() {
    if (!this.props.onClick) return;
    this.props.onClick();
  }

  render() {
    const deleteIsOpen = Boolean(this.state.anchorDeleteElement);
    const deletePopperId = deleteIsOpen ? 'delete-popper' : undefined;

    return (
      <>
        <Draggable
          handle=".handle"
          defaultPosition={{ x: this.state.note.coordinates.x, y: this.state.note.coordinates.y }}
          position={{ x: this.state.note.coordinates.x, y: this.state.note.coordinates.y }}
          grid={[25, 25]}
          scale={1}
          disabled={this.props.readonly}
          onStart={() => this.onStartMoving()}
          onStop={() => this.onEndMoving()}
          onDrag={(_e, data) => this.onMove(data)}
        >
          <Box
            className={'note' + (this.state.isMove ? ' move' : '')}
            ref={this.note}
            sx={{
              backgroundColor: this.state.note?.color,
              zIndex: this.state.mouseHover ? 1 : 0
            }}
            onClick={() => this.onClick()}
            onMouseEnter={() => this.setState({ mouseHover: true })}
            onMouseLeave={() => this.setState({ mouseHover: false })}
          >
            {!this.props.readonly ? (
              <div className="handle btn" onClick={() => this.onClick()}>
                ...
              </div>
            ) : (
              <></>
            )}
            <textarea
              dir="auto"
              ref={this.text}
              placeholder={!this.props.readonly ? 'می توانید اینجا متنی را وارد نمایید' : ''}
              onChange={(e) => this.onTextChanged(e)}
              value={this.state.note.text}
              readOnly={this.props.readonly}
            ></textarea>
            {!this.props.readonly ? (
              <>
                <Stack className="tools" direction="row-reverse">
                  <IconButton
                    aria-describedby={deletePopperId}
                    type="button"
                    ref={this.trash}
                    onClick={(e) => this.toggleTrash(e)}
                  >
                    <TrashIcon />
                  </IconButton>
                  <IconButton onClick={() => this.toggleColors()}>
                    <ColorLensIcon />
                  </IconButton>
                </Stack>

                {this.state.showColor && (
                  <TwitterPicker
                    onChange={(e) => this.colorChange(e)}
                    triangle="top-right"
                    className="color-picker"
                  />
                )}

                <Popper
                  id={deletePopperId}
                  open={deleteIsOpen}
                  anchorEl={this.state.anchorDeleteElement}
                  placement="bottom-end"
                >
                  <Paper sx={{ p: 2 }}>
                    <Stack>
                      <span className="d-block">آیا شما مطمئن هستید که این مورد را حذف کنید ؟</span>
                      <ButtonGroup dir="ltr">
                        <Button variant="outlined" onClick={() => this.cancelTrash()}>
                          خیر
                        </Button>
                        <Button variant="contained" onClick={() => this.onDelete()}>
                          بله
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </Paper>
                </Popper>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Draggable>
      </>
    );
  }
}
