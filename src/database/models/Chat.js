const mongoose = require('../index');

const ChatSchema = new mongoose.Schema({

    user_origin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    user_response: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    chatData: {
        type: Object,
        require: true,
        enum: [{
            sender: ['origin','response'], 
            message: String
        }]
    },   

    status: {
        type: String,
        require: false,
        enum: ['new', 'reported', 'expired', 'canceled'],
    },


    createdAt: {
        type: Date,
        default:Date.now,
    },

}, {
    timestamps: true,
    versionKey: false
})

const Chat = mongoose.model('Chat', ChatSchema)

module.exports = Chat