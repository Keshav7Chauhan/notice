let express = require('express');
let app = express();
let cors = require('cors');
let mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mypro')
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err))


let userSchema = new mongoose.Schema({
    username: String,
    password: String
})
// schema h yee notice kaa
const noticeSchema = new mongoose.Schema({

    description: {
        type: String,

    },


});

// model h yee notice kaa
const Notice = mongoose.model('Notice', noticeSchema);



// all niotice kaa schema
const StudentSchema = new mongoose.Schema({

    description: {
        type: String,

    },



});

// Create a model using the schema
const Student = mongoose.model('Student', StudentSchema);


app.get('/notice', async (req, res) => {
    try {
        const notices = await Notice.find();
        res.json(notices);
    } catch (error) {
        console.error('Error during fetching notices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




let User = new mongoose.model('User', userSchema);
app.use(bodyParser.json());
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({ username, password: hashedPassword });


        await newUser.save();

        res.json({ message: 'User saved successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Incorrect username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect username or password' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put("/updateData/:id", async (req, res) => {
    try {
        const updatedProduct = await Notice.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).send("Notice not found");
        }
        console.log("Notice updated successfully:", updatedProduct);
        res.send(updatedProduct);
    } catch (error) {
        console.error("Error updating notice:", error);
        res.status(500).send(error.message);
    }
});

app.post('/allnotice', async (req, res) => {
    try {
        const { description } = req.body;
        const newNotice = new Student({ description: description });
        const savedNotice = await newNotice.save();
        console.log("Notice saved successfully:", savedNotice);
        res.json(savedNotice); // Send the saved notice in the response
    } catch (error) {
        console.error("Error saving notice to students collection:", error);
        res.status(500).send(error.message); // Send the error response here
    }
});


app.get('/noticeview', async (req, res) => {
    try {
        const notices = await Student.find();
        res.json(notices);
    } catch (error) {
        console.error('Error during fetching notices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const formDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    batch: String,
    role: String
});

const FormData = mongoose.model('FormData', formDataSchema);

app.post('/form', async (req, res) => {
    const { name, email, batch, role } = req.body;

    try {
        const formData = new FormData({
            name,
            email,
            batch,
            role
        });

        await formData.save();

        console.log('Form data saved successfully:', formData);

        res.status(200).json({ message: 'Form data received and saved successfully!' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Define schema and model
// const FormSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     batch: String,
//     role: String
// });
// const FormModel = mongoose.model('Form', FormSchema);

// // Route to handle form submission
// app.post('/form', async (req, res) => {
//     try {
//         const { name, email, batch, role } = req.body;
//         const formData = new FormModel({ name, email, batch, role });
//         await formData.save();
//         res.status(201).json({ message: 'Form submitted successfully!' });
//     } catch (error) {
//         console.error('Error saving form data:', error);
//         res.status(500).json({ error: 'An error occurred while saving form data' });
//     }
// });



app.get('/table', async (req, res) => {
    try {
        const users = await FormData.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



app.listen(9000, () => {
    console.log('Server started');
});