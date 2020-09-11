const mongoose = require('mongoose');

let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        validate: {
            validator: function(isbnVal){
                return isbnVal.length == 13;
            },
            message: 'ISBN must be 13 characters'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    publicationDate: {
        type: Date,
        default: Date.now
    },
    summary: {
        type: String
    }
});

module.exports = mongoose.model('Book', bookSchema);