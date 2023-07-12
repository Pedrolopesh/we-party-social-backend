const mongoose = require('../index');

const EventPartySchema = new mongoose.Schema({

    title: {
        type: String,
        require: true
    },

    description: {
        type: String,
        require: true
    },

    location: {
        type: Object,
        require: true,
        enum: {
            lat: string,
            lng: string,
        }
    },

    eventDateTime: {
        type: Date,
        require: true,
    },

    eventImgs: {
        type: Array,
        require: false,
    },

    eventTags: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    },

    eventLikes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Likes'
    },

    eventComments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    },

    eventReports: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reports'
    },

    eventSubscribers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    eventCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    active:{
        type: String,
        require: false,
    },

}, {
    timestamps: true,
    versionKey: false
})

const EventParty = mongoose.model('EventParty', EventPartySchema)

module.exports = EventParty