let mongoose = require('mongoose');

let Author = require('./models/author');
let Book = require('./models/book');

const express = require('express');
const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('assets'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.listen(8080);

let url = 'mongodb://localhost:27017/libraryDB';

mongoose.connect(url, function (err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log('Connected')
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/newbook', (req, res) => {
    res.sendFile(__dirname + '/views/newbook.html');
});

app.post('/newbookpost', (req, res) => {
    let bookDetails = req.body;
    let book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: bookDetails.title,
        isbn: bookDetails.isbn,
        publicationDate: bookDetails.publicationDate,
        summary: bookDetails.summary,
        author: bookDetails.author

    });
    book.save(function (err) {
        if (err) {
            console.log(err);
            res.redirect('/newbook');
        }
        else {
            console.log('Book saved');
            res.redirect('/listbooks');
        }
    });

    Author.findByIdAndUpdate(
        { _id: bookDetails.author }, { $inc: { numBooks: 1 } },
        function (err, result) {
            if (err) console.log(err);
            else {
                console.log('Authors no. books updated');
            }
        }
    );

})

app.get('/newauthor', (req, res) => {
    res.sendFile(__dirname + '/views/newauthor.html');

});

app.post('/newauthorpost', (req, res) => {
    let authorDetails = req.body;
    
    let author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: authorDetails.firstName,
            lastName: authorDetails.lastName
        },
        dob: authorDetails.dob,
        address: {
            state: authorDetails.state,
            suburb: authorDetails.suburb,
            street: authorDetails.street,
            unit: authorDetails.unit
        },
        numBooks: authorDetails.numBooks,
        abn: authorDetails.abn
    })

    author.save(function (err) {
        if (err) {
            console.log(err);
            res.redirect('/newauthor');
        }
        else {
            console.log('Author saved');
            res.redirect('/listauthors');
        }
    });

});

app.get('/listbooks', (req, res) => {
    Book.find({}).populate('author').exec(function (err, books) {
        res.render('listbooks', { booksDb: books });
    });
});

app.get('/listauthors', (req, res) => {
    Author.find({}, function (err, authors) {
        res.render('listauthors', { authorsDB: authors });
    });
});

app.get('/updateauthor', (req, res) => {
    res.sendFile(__dirname + '/views/updateauthor.html');
});

app.post('/updateauthorspost', (req, res) => {
    let authorDetails = req.body;
    Author.findByIdAndUpdate(
        { _id: authorDetails.author_id },
        { numBooks: authorDetails.numBooks },
        { runValidation: true },
        function (err, result) {
            if (err) console.log(err);
            else {
                res.redirect('/listauthors');
            }
        }
    );
});

app.get('/deletebook', (req, res) => {
    res.sendFile(__dirname + '/views/deletebook.html');
});

app.post('/deletebookpost', (req, res) => {
    let bookDetails = req.body;
    Book.deleteOne(
        { 'isbn': bookDetails.isbn },
        function (err, doc) {
            console.log(doc);
        }
    );

    res.redirect('/listbooks');
});