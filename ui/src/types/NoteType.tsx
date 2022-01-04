export type NoteType = {
    id: string
    coordinates: {
        x: number,
        y: number,
    }
    text: string
    color?: string
    userId: string
    own?: boolean
}