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


app.post('/createStudent', async (req, res) => {
    if (!req.body) {
        return;
    }
    const data = new User({
        email: req.body.email,
        studentAccount: true,
        classes: [],
        name:'',
        bio:'',
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


app.post('/createInstructor', async (req, res) => {
    if (!req.body) {
        return;
    }
    const data = new User({
        email: req.body.email,
        studentAccount: false,
        classes: [],
        name: '',
        bio:'',
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

    if (!req.body) {
        res.send(400);
        return;
    }
    // can use className as id
    Assignment.insertMany({ 'name': req.body.name, 'className': req.body.class,'release': new Date(), 'dueDate': new Date(req.body.dueDate) }).then(res => {
        Class.findOne({name: req.body.class }).then((ans) => {
            ans["classes"].push(req.body.req.body.name)
            ans.save()
        })
    });
});

app.post('/createTestCase', (req, res) => {

    if (!req.body) {
        res.send(400);
        return;
    }

    Test.insertMany({
        name: req.body.name, 
        student: req.body.email,
        class: req.body.class, 
        assignment: req.body.assignment, // assignment test is associated with
        coverage: Math.floor(Math.random() * 101), // percent coverage
        code: req.body.code // block of code for a test

    })

    res.send(200)
   
});

app.post('/updateUser', (req, res) => {
    
    if (!req.body) {
        res.send(400);
        return;
    }
    User.updateOne({email:req.body.email} , {'name' : req.body.name , 'bio' :req.body.bio})

});


app.get('/getStudent', (req, res) => {
    if(!req.body)
    {
        res.send(400)
        return;
    }

    let email = ""
    let classes = [];
    let testCases = [];
    
    User.findOne({
        $and: [
          {
            "email": req.body.email
          },
          {
            "studentAccount": true
          }
        ]
    }).then((res) => 
    {
        classes = res['classes']
        email = res['email']

        Test.findOne({'email' : req.body.email}).then((res) => {
           testCases = res;
        })
    })

    res.json({
        'email': email,
        'classes': classes,
        'testCases': testCases
    });
});


app.get('/getInstructor', (req, res) => {
    if (!req.body) {
        return;
    }

    User.findOne({ email: req.body.email, studentAccount: false }).then(res => {
        res.json({ id: res["_id"], email: res["email"], classes: res["classes"] });
    });
});

app.get('/getAssignments', (req, res) => { //plural , used to populate table in student's dashboard
    if (!req.body) {
        return;
    }
    Assignment.find({ email: req.body.email }).then(res => {
        res.json({ ans: res })
    })
});

app.get('/getAssignment', (req, res) => { //singular , used for the assignment page , need class and assignmentName
    if (!req.body) {
        return;
    }
    Assignment.find({
        $and: [
          {
            "name": req.body.name
          },
          {
            "class": req.body.class
          }
        ]
    }).then(res => {
        res.json({ 'result': res })
    })
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


