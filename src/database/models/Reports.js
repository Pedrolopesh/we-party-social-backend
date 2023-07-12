const mongoose = require('../index');

const ReportsSchema = new mongoose.Schema({

    eventParty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventParty'
    },

    impressions: {
        type: Number,
        require: false,
    },

    eventSubscribers: {
        type: Number,
        require: false,
    },

    reactions: {
        type: Number,
        require: false,
    },

    comments: {
        type: Number,
        require: false,
    },

}, {
    timestamps: true,
    versionKey: false
})

const Reports = mongoose.model('Reports', ReportsSchema)

module.exports = Reports