import { NoteI } from "../models/notes.models";
import Resource, { ResourceType } from "./resources";

export class NoteResource extends Resource<NoteI> {
    public toArray(): ResourceType {
        const result: ResourceType = {}

        result['id'] = this.model.id
        result['text'] = this.model.text
        result['color'] = this.model.color
        result['coordinates'] = {
            x: this.model.coordinates.x,
            y: this.model.coordinates.y
        }

        return result
    }
}