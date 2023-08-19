var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const e = require('express');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });


var db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to database"));
db.once('open', () => console.log("Connected to database"));
app.post('/sign_up', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password; 

    var data = {
        "name": name,
        "email": email,
        "phone": phone,
        "password": password
    }
    db.collection('users').insertOne(data, (err, collection) => {
        if(err) {
            throw err;
        }
        console.log("Record inserted successfully");
    });
    return res.redirect('form.html')
})

app.get('/', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*'
    })
    return res.redirect('form.html');
}).listen(3000);

console.log("Server running at "+ 3000);