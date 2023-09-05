const jwt = require('jsonwebtoken');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const async = require('hbs/lib/async');
const hbs = require('hbs');

const app = express();
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

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

app.post('/sign_up', async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;

    if (!name || !email || !phone || !password) {
        console.log('All fields must be complete')
        return res.json({ status: 'All fields must be complete' })
    }

    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    let regex = new RegExp(emailRegex);
    if (!regex.test(email)) {
        console.log('Invalid email')
        return res.json({ status: 'Invalid email' })
    }

    var data = {
        "name": name,
        "email": email,
        "phone": phone,
        "password": password,
        "items": "{}"
    }

    db.collection('users').findOne({ email: data.email }, (err, user) => {
        if (err) {
            throw err;
        }

        if (user) {
            console.log("Email already exists")
            return res.json({ status: 'The Email already exists' })
        }
        else {
            db.collection('users').insertOne(data, (err, collection) => {
                if (err) {
                    console.log("Email already exists")
                    return res.json({ status: 'The Email already exists' })
                }
                //if the data inserted successfully
                console.log("Data Inserted Successfully");
                console.log(collection);
                return res.json({ status: 'Sign up Succsessfully', user_name: data.name })

            });
        }

    });
})


app.post('/log_in', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
        console.log('All fields must be complete')
        return res.json({ status: 'All fields must be complete' })
    }

    var data = {
        "email": email,
        "password": password
    }
    db.collection('users').findOne({ email: data.email, password: data.password }, (err, user) => {
        if (err) {
            throw err;
        }

        if (user) {
            const token = generateToken(user);

            // If user with the provided email exists
            // Passwords match, log in successfully
            console.log("Log In Successfully");
            console.log(user.name);
            return res.json({ status: 'Log In Successfully', user_name: user.name, user_email: user.email, user_items: user.items, token: token })
        }

        else {
            // Incorrect Email or Password
            console.log("Incorrect Email or Password");
            // You can handle the Incorrect Email or Password case here, like showing an error message
            return res.json({ status: 'Incorrect Email or Password' })
        }
    });
});

app.post('/contactus', async (req, res) => {
    var full_name = req.body.full_name;
    var email = req.body.email;
    var text = req.body.text;

    var data = {
        "full_name": full_name,
        "email": email,
        "text": text
    }

    db.collection('contact_us').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        //if the data inserted successfully
        console.log("Data Inserted Successfully");
        console.log(collection);
        return res.json({ status: 'Contact Us Succsessfully' })
    });
})

app.post('/set_items', verifyToken, async (req, res) => {
    var email = req.body.email;
    var items = req.body.items;

    if (!email || !items) {
        console.log('All fields must be complete')
        return res.json({ status: 'All fields must be complete' })
    }

    var data = {
        "email": email,
        "items": items
    }
    db.collection('users').updateOne({ email: data.email }, {
        $set: {
            items: data.items
        }
    }, (err, result) => {
        if (err) {
            throw err;
        }
        return res.json({ status: 'success' });
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

app.get('/contactus', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*'
    });
    return res.sendFile('/contactus.html');
});

app.get('/set_items', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*'
    });
    return res.sendFile('/index.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

function generateToken(user) {
    return jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' }); // Customize the expiration time as needed
}

// Middleware to verify the token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ status: 'Token not provided' , redirect:'login'});
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: 'Token is invalid' , redirect:'login'});
        }

        const emailInToken = decoded.email;
        const requestedEmail = req.body.email;

        if (emailInToken!== requestedEmail) {
            return res.status(403).json({ status: 'Token does not match the requested email' , redirect:'login' });
        }

        req.user = decoded;
        next();
    });
}