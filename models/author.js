const mongoose = require('mongoose');

let authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String,
    },
    dob: Date,
    address: {
        state: {
            type: String,
            validate:{
                validator: function(stateVal){
                    return stateVal.length >= 2 && stateVal.length <= 3;
                },
                message: 'State must be between 2 and 3 characters'
            }
        },
        suburb: String,
        street: String,
        unit: String
    },
    numBooks: {
        type: Number,
        validate: {
            validator: function(numBooksVal){
                return numBooksVal >= 1 && numBooksVal <= 150;
            },
            message: 'Number of books must be an integer between 1 and 150'
        }
    }
});

module.exports = mongoose.model('Author', authorSchema);