const mongoose = require('../index');

const TagsSchema = new mongoose.Schema({

    EventTag: {
        type: String,
        require: true
    },

}, {
    timestamps: true,
    versionKey: false
})

const Tags = mongoose.model('Tags', TagsSchema)

module.exports = Tags