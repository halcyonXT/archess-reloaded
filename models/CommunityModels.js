const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    authos: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    title: {
        type: String,
        required: true
    },
    body: String,
    attachments: [{
        // * uploaded to IBB, fetched as URL
        type: String
    }],
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ]
}, {
    timestamps: true
})

const boardSchema = new mongoose.Schema({
    boardName: {
        type: String,
        required: true
    },
    isOfficialBoard: {
        type: Boolean,
        required: true
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

module.exports = {
    Post: mongoose.model('Post', postSchema),
    Board: mongoose.model('Board', boardSchema)
}
