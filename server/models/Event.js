const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        // required inputs to create one
        startTime: Number,
        endTime: Number,
        dates: [Number],
        duration: Number, // 30 or 60

        selections: [
            {
                user_id: String, // if signed in, null if not signed in
                name: String,
                selection: [Number],
                note: String,
            },
        ],

        maybes: [
            {
                user_id: String, // if signed in, null if not signed in
                name: String,
                selection: [Number],
            },
        ],

        priority: [
            {
                user_id: String,
                name: String,
                words: String,
                calendar: String,
                togedule: String,
            },
        ],

        // participants
        attendees: [
            {
                type: Schema.ObjectId,
                ref: "user",
            },
        ],
        organizer: {
            type: Schema.ObjectId,
            ref: "user",
        },
        title: String,
        password: String,
        total: Number,
    },
    { timestamps: true, versionKey: false }
);

// compile model from schema
module.exports = mongoose.model("event", EventSchema);
