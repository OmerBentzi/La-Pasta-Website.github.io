var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const async = require('hbs/lib/async');
const hbs = require('hbs');


const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting To Database"));
db.once('open', () => console.log("Connected To MongoDB Database"));
app.post('/sign_up', async(req, res) => {
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
        //if the data inserted successfully
        console.log("Data Inserted Successfully");
        console.log(collection);
    });
    return res.redirect('form_sucsess.html')
})
app.post('/log_in', async(req, res) => {
    var email = req.body.email;
    var password = req.body.password; 

    var data = {
        "email": email,
        "password": password
    }
db.collection('users').findOne({ email: data.email ,password: data.password}, (err, user) => {
    if (err) {
        throw err;
    }

    if (user) {
        // If user with the provided email exists
                // Passwords match, log in successfully
                console.log("Log In Successfully");
                return res.redirect('index.html');
   }
   
   else {
                // Incorrect password
                console.log("Incorrect password");
                //add an messege into the login page that the password is incorrect
                alert("Incorrect password");
                // You can handle the incorrect password case here, like showing an error message
                return res.redirect('login.html'); // Redirect to login page with error message
            }
        });
    });

app.get('/sign_up', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*'
    })
    return res.redirect('form.html');
    
}).listen(3000);

app.get('/log_in', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*'
    })
    return res.redirect('login.html');
}).listen(3000);

console.log("Server running at "+ 3000);

