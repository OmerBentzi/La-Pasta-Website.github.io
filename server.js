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

    db.collection('users').findOne({email: data.email}, (err, user) => {
        if (err) {
            throw err;
        }
    
        if (user){
            console.log("Email already exists")
            return res.send("The Email already exists");
        }
        else {
            db.collection('users').insertOne(data, (err, collection) => {
                if(err) {
                    throw err;
                }
                //if the data inserted successfully
                console.log("Data Inserted Successfully");
                console.log(collection);
                return res.send("Sign up Succsessfully");
                
            });
        }
       
            });
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
                return res.send("Log In Successfully");
   }
   
   else {
                // Incorrect password
                console.log("Incorrect password");   
                // You can handle the incorrect password case here, like showing an error message
                return res.send("Incorrect Email or Password"); // Redirect to login page with error message
            }
        });
    });

app.get('/sign_up', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*'
    });
    return res.sendFile('/form.html');

});

app.get('/log_in', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*'
    });
    return res.sendFile('/login.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});