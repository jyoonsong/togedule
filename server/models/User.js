const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        name: String, // required
        username: String, // optional
        password: String, // optional
        attendingEvents: [
            {
                type: Schema.ObjectId,
                ref: "event",
            },
        ],
        organizingEvents: [
            {
                type: Schema.ObjectId,
                ref: "event",
            },
        ],
    },
    { timestamps: true }
);

// compile model from schema
const User = mongoose.model("user", UserSchema);
module.exports = User;
