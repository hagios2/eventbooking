import mongoose from "mongoose"

const { Schema } = mongoose

const eventSchema = new Schema({
    title : {
        type: String,
        required: true,
        trim: true,
    },
    description : {
        type: String,
        required: true,
        trim: true,
    },
    price : {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Event = mongoose.model('Event', eventSchema )

export { Event }
