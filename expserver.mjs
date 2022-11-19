import apiObj , {getStudent , getInstructor , createStudent , createInstructor} from './server/store.js'
import express from 'express'
const app = express();
const port = process.env.PORT || 3000;

// no get class , only get assignment 

//if a user clicks on  the class nothing happnes , only if the user clicks on the assignment we will redirect

app.get('/getStudent', (req, res) => {
    res.json({email: 'student@test.gov', classes: ['COMPSCI 446', 'COMPSCI 187', 'COMPSCI 326']});
});

app.post('/createStudent', (req, res) => {
    res.json({email: 'student@test.gov', id: '1234'});
});

app.get('/getInstructor', (req, res) => {
    res.json({id: '23', email: 'teacher@test.gov', classes: ['ID1', 'ID2', 'ID3']});
});

app.get('/getAssignment', (req, res) => { // needs class and get its assignments
    res.json(
    {id: '23', className:"CS326",
    email: 'teacher@test.gov', 
    assignments: [
    {name:'HW1' , createdAt:'10/26/2022' , dueAt:'12/3/2022' }, 
    {name:'HW2' , createdAt:'11/4/2022' , dueAt:'11/9/2022' },
    {name:'HW3' , createdAt:'11/11/2022' , dueAt:'11/25/2022' }]});
});

app.post('/createInstructor', (req, res) => {
    res.json({email: 'student@test.gov', id: '23'});
});

app.post('/createClass', (req, res) => {
    res.json({id: 'ID1', name: 'COMPSCI 326', instructors: ['23']});
});

app.post('/createAssignment', (req, res) => {   // creates assignemnt in class need a class 
    res.json({id: 'ID1', name: 'COMPSCI 326', instructors: ['23']});
}); 

app.post('/createTestCase', (req, res) => {
    res.json({id: 'ID', name: 'test name', project: 'ID2', student: '1234'});
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
