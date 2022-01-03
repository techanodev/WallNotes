import { Schema, model } from 'mongoose'

export interface UserI {
    id?: string
    name?: string
    password?: string
}

export const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: false
        },
        password: {
            type: {
                x: Number,
                y: Number
            },
            required: false
        }
    },
    {
        timestamps: true
    }
)

const User = model<UserI>('User', UserSchema)


export default User