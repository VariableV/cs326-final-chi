import apiObj, { getStudent, getInstructor, createStudent, createInstructor } from './server/store.js';
import express from 'express';
import { connect } from 'mongoose';
import { Assignment, User, Test, Class } from './server/models.js';

const url = 'mongodb://127.0.0.1:27017';

connect(url);

const app = express();
const port = process.env.PORT || 3000;

// no get class , only get assignment 
//if a user clicks on  the class nothing happnes , only if the user clicks on the assignment we will redirect
// no class page (classes always COMPSCI not CS)

// 3DBs , Classes
app.use(express.json());

app.get('/getStudent', (req, res) => {
    res.json({
        email: 'student@test.gov',
        classes: ['COMPSCI 446', 'COMPSCI 187', 'COMPSCI 326'],
        testCases: [{ name: 'Linear Probing', className: 'COMPSCI 326', coverage: 56, assignment: 'P4' },
        { name: 'Alpha Beta Pruning', className: 'COMPSCI 326', coverage: 40, assignment: 'P6' },
        { name: 'Palindrome', className: 'COMPSCI 326', coverage: 100, assignment: 'HW1' },
        { name: 'Anagram Solver', className: 'COMPSCI 326', coverage: 78, assignment: 'Project' },]
    });
});

app.post('/createStudent', async (req, res) => {
    if (!req.body) {
        return;
    }
    const data = new User({
        email: req.body.email,
        studentAccount: true,
        classes: [],
        joined: new Date()
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.get('/getInstructor', (req, res) => {
    if (!req.body) {
        return;
    }

    User.findOne({ email: req.body.email, studentAccount: false }).then(res => {
        res.json({ id: res["_id"], email: res["email"], classes: res["classes"] });
    });
});

app.get('/getAssignments', (req, res) => {
    if (!req.body) {
        return;
    }
    Assignment.find({ email: req.body.email }).then(res => {
        res.json({ ans: res })
    })
});


app.post('/createInstructor', async (req, res) => {
    if (!req.body) {
        return;
    }
    const data = new User({
        email: req.body.email,
        studentAccount: false,
        classes: [],
        joined: new Date()
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.post('/createClass', (req, res) => {
    if (!req.body) {
        return;
    }
    // check1 : make sure the person creating class is an instructor
    Class.insertMany({ name: req.body.name, instructor: req.body.email, size: 0 }).then(res => {
        console.log(req.body.email.length)
        User.findOne({ email: req.body.email }).then((ans) => {
            ans["classes"].push(req.body.name)
            ans.save()
        })
    });
});

app.post('/createAssignment', (req, res) => {   // creates assignemnt in class need a class 
    res.json({ id: 'ID1', name: 'COMPSCI 326', instructors: ['23'] });
});

app.post('/createTestCase', (req, res) => {
    res.json({ id: 'ID', name: 'test name', project: 'ID2', student: '1234' });
});



app.use('/components/appNavbar/', express.static('components/appNavBar'));
app.use('/components/loginNavbar/', express.static('components/loginNavbar'));
app.use('/constants/images/', express.static('constants/images'));


app.use('/', !apiObj['student'] && !apiObj['instructor'] ? express.static('pages/Landing/Login') : express.static('pages/Dashboard/Assignment'))
apiObj['student'] && app.use('/profile', express.static('pages/Profile'));
app.use('/signup', express.static('pages/Landing/Signup'));
app.use('/login', express.static('pages/Landing/Login'));
app.use('/assignment', express.static('pages/Dashboard/Assignment'));
app.use('/dashboard', express.static('pages/Dashboard/Dashboard'));
app.use('/profile', express.static('pages/Profile'));


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});


