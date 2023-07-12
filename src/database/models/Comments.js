const mongoose = require('../index');

const CommentsSchema = new mongoose.Schema({

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventParty'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    message: {
        type: String,
        require: true,
    },

    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Likes'
    }

}, {
    timestamps: true,
    versionKey: false
})

const Comments = mongoose.model('Comments', CommentsSchema)

module.exports = Comments