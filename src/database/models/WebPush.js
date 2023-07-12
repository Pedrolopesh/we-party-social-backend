const mongoose = require('../index');

const WebPushSchema = new mongoose.Schema({

    credentials: {
        type: String,
        require: true
    },
    
    user: {
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

const WebPush = mongoose.model('WebPush', WebPushSchema)

module.exports = WebPush