const mongoose = require('../index');

const LikesSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    reactionType: {
        type: String,
        require: false,
        enum: ['like', 'funy', 'fire', 'heart'],
    }

}, {
    timestamps: true,
    versionKey: false
})

const Likes = mongoose.model('Likes', LikesSchema)

module.exports = Likes