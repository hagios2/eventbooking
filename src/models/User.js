import mongoose from "mongoose"

const { Schema } = mongoose

const userSchema = new Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password : {
        type: String,
        required: true,
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema )

export { User }
