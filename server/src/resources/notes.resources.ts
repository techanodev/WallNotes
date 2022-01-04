import { NoteI } from "../models/notes.models";
import Resource, { ResourceType } from "./resources";

export class NoteResource extends Resource<NoteI> {
    public toArray(userId?: string): ResourceType {
        const result: ResourceType = {}

        result['id'] = this.model.id
        result['text'] = this.model.text.removeBadWords()
        result['color'] = this.model.color
        result['userId'] = this.model.userId
        result['own'] = this.model.userId == userId
        result['coordinates'] = {
            x: this.model.coordinates.x,
            y: this.model.coordinates.y
        }

        return result
    }
}