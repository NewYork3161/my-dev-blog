const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({

    postId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Post",

        required: true

    },

    username: {

        type: String,

        default: "Anonymous User"

    },

    content: {

        type: String,

        required: true

    },

    image: {

        type: String,

        default: ""

    },

    createdAt: {

        type: Date,

        default: Date.now

    }

});

module.exports = mongoose.model("Response", responseSchema);