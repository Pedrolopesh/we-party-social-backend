const mongoose = require('../index');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },

    profileImg:{
        type: String,
        require: false,
    },

    confirmCode:{
        type: String,
        require: false,
    },

    password: {
        type: String,
        require: true,
        select: false
    },

    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],

    createdEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventParty'
    }],

    confirmedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventParty'
    }],

    status: {
        type: String,
        require: false,
        enum: ['active', 'blocked', 'inative'],
    },

    webPushSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WebPush'
    },

    createdAt: {
        type: Date,
        default:Date.now,
    },

}, {
    timestamps: true,
    versionKey: false
})

const User = mongoose.model('User', UserSchema)

module.exports = User