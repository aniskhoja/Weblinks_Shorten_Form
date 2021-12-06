const mongoose = require('mongoose')
const shortId = require('shortid')

const urlSchema = new mongoose.Schema({
    url:{
        type: String,
        min:5,
        max:255,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortId.generate
    },
    click: {
        type: Number,
        required: true,
        default: 0
    }

})

const Url = mongoose.model('url', urlSchema)

module.exports= Url