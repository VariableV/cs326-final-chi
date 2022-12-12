import apiObj, { getStudent, getInstructor, createStudent, createInstructor } from './server/store.js';
import express from 'express';
import { connect } from 'mongoose';
import { Assignment, User, Test, Class } from './server/models.js';
import dotenv from "dotenv"
dotenv.config()
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
import session from 'express-session'

connect(url);

const app = express();
const port = process.env.PORT || 3000;
const store = new session.MemoryStore();

app.use(express.json());

app.use(session({
    secret: 'QWERTYU',
    cookie: { maxAge: 600000 },
    saveUninitialized: false,
    store
}))


app.use('/components/appNavbar/', express.static('components/appNavBar'));
app.use('/components/loginNavbar/', express.static('components/loginNavbar'));
app.use('/constants/images/', express.static('constants/images'));



app.use((req, res, next) => {
   
    const headerCookie = req.headers.cookie?.split('s%3A')[1]
    console.log(req.originalUrl?.split('/')[1])

    if (req.originalUrl?.split('/')[1] !== 'loginUser' && req.originalUrl?.split('/')[1] !== 'createStudent' && req.originalUrl?.split('/')[1] !== 'createInstructor'
    && req.originalUrl?.split('/')[1] !== 'login' && req.originalUrl?.split('/')[1] !== 'signup' && 
    req.path !== '/login' && req.path !== '/signup') 
    {
        if(req.sessionID !== headerCookie?.split('.')[0])
        {
           
            console.log('-----------')
            console.log(req.originalUrl?.split('/')[1] !== 'loginUser')
            console.log(req.sessionID)
            console.log(headerCookie?.split('.')[0])
            console.log("USER NOT AUTHENTICATED")
            res.redirect('/login')
           
        }
        else{
            console.log('here')
            next()
        }
    }
    else{
        next()
    }

  
})

app.use('/logout', (req,res , next) => 
{
    // const sessionId = req.sessionID;
    // const headerCookie = req.headers.cookie?.split('s%3A')[1];

    req.session.destroy();
    console.log(req.sessionID)
    console.log(req.session)
    res.redirect('/login')
    

})


app.post('/loginUser', (req, res) => {

    console.log(req.sessionID)
    console.log(req.session)
    console.log(store)

    if (req.body.password && req.body.email) {
        User.find({ email: req.body.email, password: req.body.password }).count().then((ans) => {
            if (ans) {
                req.session.authenticated = true;  // when the session object is modified it is going to save  to store automatically
                req.session.user = {
                    'email': req.body.email
                }
                res.status(200).json({ sesssion: req.session, found: true })
            }
            else {
                res.status(500).json({ found: false })
            }

        })
    }
    else {
        res.sendStatus(500)
    }

})




app.post('/createStudent', async (req, res) => {


    console.log(req.sessionID)
    console.log('here')
    

    if (req.body.password && req.body.email) {


        let userExists = false;

        await User.findOne({ email: req.body.email }).then(val => {
            if (val !== null) {
                userExists = true;
            }
        })

        if (userExists) {
            res.sendStatus(500)
            return;
        }


        const data = new User({
            email: req.body.email,
            studentAccount: true,
            classes: [],
            name: '',
            bio: '',
            joined: new Date(),
            password: req.body.password
        })


        try {
            const dataToSave = await data.save();
            req.session.authenticated = true;  // when the session object is modified it is going to save  to store automatically
            req.session.user = {
                'email': req.body.email
            }
            res.status(200).json(dataToSave)
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
    else {
        res.sendStatus(500)
    }
});

app.post('/createInstructor', async (req, res) => {

    console.log('here')
    if (req.body.password && req.body.email) {

        let userExists = false;
        await User.findOne({ email: req.body.email }).then(val => {
            if (val !== null) {
                userExists = true;
            }
        })

        if (userExists) {
            res.sendStatus(500)
            return;
        }

        const data = new User({
            email: req.body.email,
            studentAccount: false,
            classes: [],
            name: '',
            bio: '',
            joined: new Date(),
            password: req.body.password
        })

        try {
            const dataToSave = await data.save();
            req.session.authenticated = true;  // when the session object is modified it is going to save  to store automatically
            req.session.user = {
                'email': req.body.email
            }
            res.status(200).json(dataToSave)
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
    else {
        res.sendStatus(500)
    }

});

app.post('/createClass', async (req, res) => {
    
    console.log(req.session.user)
    console.log(req.sessionID)

    let classExists = false;

    await Class.findOne({ name: req.body.name }).then(val => {
        if (val !== null) {
            classExists = true;
        }
    })

    if (classExists) {
        res.sendStatus(500)
        return;
    }

    const codesArray = await Class.distinct('enrollCode')

    while (true) {
        let rand = Math.floor(Math.random() * 10000)
        if (!codesArray.includes(rand)) {
            await Class.insertMany({ name: req.body.name, instructor: req.body.email, size: 0, assignments: [], enrollCode: rand })
            await User.updateOne({ email: req.body.email }, { $push: { 'classes': { 'className': req.body.name, 'code': rand } } })
            break;
        }
    }

    res.sendStatus(200)

});


app.post('/createAssignment', async (req, res) => {   // creates assignemnt in class need a class 

    if (!req.body) {
        res.send(400);
        return;
    }

    let assignmentName = req.body.name.toLowerCase()
    let className = req.body.className
    let classEnrollCode = req.body.classEnrollCode
    let dueDate = req.body.dueDate
    let releasedDate = req.body.released
    let testFunction = req.body.testFunction
    let correctFunction = req.body.correctFunction

    await Assignment.insertMany({
        'name': assignmentName, 'className': className, 'release': releasedDate, 'due': dueDate,
        'submissions': 0, 'test': testFunction, 'correct': correctFunction
    })

    await Class.updateOne({
        $and: [
            {
                "name": className
            },
            {
                "enrollCode": classEnrollCode
            }
        ]
    }, { $push: { 'assignments': assignmentName } })

    res.sendStatus(200)

});


app.post('/createTestCase', (req, res) => { //increment assignment submission by 1 for each user once he uploads a testcase

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

    Assignment.findOne({'name': req.body.assignment, 'className': req.body.class}).then(r => {
        r.submissions += 1
        r.save()
        res.send(200)
    });

});

app.post('/updateUser', async (req, res) => {

    if (!req.body) {
        res.send(400);
        return;
    }

    await User.updateOne({ email: req.body.email }, { $set: { 'name': req.body.name, 'bio': req.body.bio } })
    res.sendStatus(200)

});

app.post('/enrollClass', async (req, res) => {
    // increment the size value of that class
    let code = req.body.code;
    let email = req.body.email;
    let found = true;
    let className = "";

    await Class.updateOne({ 'enrollCode': code }, { $inc: { 'size': 1 } }).then((ans) => {
        if (ans.matchedCount === 0) {
            found = false;
        }
    })
    if (!found) {
        res.sendStatus(500)
        return
    }

    let classObj = await Class.findOne({ 'enrollCode': code })

    await User.updateOne({ email: email }, { $push: { 'classes': { 'className': classObj['name'], 'code': req.body.code } } })

    res.sendStatus(200);

})

app.get('/getUser/:email', (req, res) => {
    let name = ''
    let email = ""
    let classes = [];
    let testCases = [];
    let bio = ''
    let joined = ''

    User.findOne({
        "email": req.params['email']

    }).then((res2) => {
        classes = res2['classes']
        email = res2['email']
        name = res2['name']
        bio = res2['bio']
        joined = res2['joined']

        if (res2['studentAccount']) {

            Test.find({ 'email': req.params['email'] }).then((testCases) => {
                res.json({
                    'name': name,
                    'bio': bio,
                    'email': email,
                    'classes': classes,
                    'testCases': testCases,
                    'joined': joined,
                    'studentAccount': res2['studentAccount']
                });
            })
        }
        else {
            res.json({
                'name': name,
                'bio': bio,
                'email': email,
                'classes': classes,
                'testCases': testCases,
                'joined': joined,
                'studentAccount': res2['studentAccount']
            });
        }
    })
})

app.get('/getClass/:class', (req, res) => {

    Class.findOne({ 'name': req.params['class'] }).then((response) => {
        res.json(response)
    })

});

app.get('/getClassByCode/:enrollCode', (req, res) => {

    Class.findOne({ 'enrollCode': req.params['enrollCode'] }).then((response) => {
        res.json(response)
    })

});




app.get('/getAssignments/:class', (req, res) => { //plural , used to populate table in student's dashboard


    Assignment.find({ className: req.params['class'] }).then(response => {
      //  console.log(response)
        res.json(response)
    })
});



app.get('/getAssignment/:class/:assignment', (req, res) => { //singular , used for the assignment page , need assignmentId

    Assignment.find({
        $and: [
            {
                "name": req.params["assignment"]
            },
            {
                "class": req.params["class"]
            }
        ]
    }).then(ans => {
      //  console.log(ans)
        res.json({ 'result': ans })
    })
});

app.get('/getTestCases/:class/:assignment', (req, res) => {
    const className = req.params["class"];
    const assignment = req.params["assignment"];
    Test.find({ $and: [{ "class": className }, { "assignment": assignment }] }).then(z => {
        res.json({ "result": z })
    })
})

app.use('/assignment/:class/:assignment', express.static('pages/Dashboard/Assignment'));
app.use('/dashboard', express.static('pages/Dashboard/Dashboard'));
app.use('/profile', express.static('pages/Profile'));

app.use('/', express.static('pages/Landing/Login'))
app.use('/signup', express.static('pages/Landing/Signup'));
app.use('/login', express.static('pages/Landing/Login'));


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});


