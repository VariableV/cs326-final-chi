const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/getStudent', (req, res) => {
    res.json({email: 'student@test.gov', classes: ['ID1', 'ID2', 'ID3']});
});

app.post('/createStudent', (req, res) => {
    res.json({email: 'student@test.gov', id: '1234'});
});

app.get('/getInstructor', (req, res) => {
    res.json({id: '23', email: 'teacher@test.gov', classes: ['ID1', 'ID2', 'ID3']});
});

app.post('/createInstructor', (req, res) => {
    res.json({email: 'student@test.gov', id: '23'});
});

app.post('/createClass', (req, res) => {
    res.json({id: 'ID1', name: 'COMPSCI 326', instructors: ['23']});
});

app.post('/createTestCase', (req, res) => {
    res.json({id: 'ID', name: 'test name', project: 'ID2', student: '1234'});
});

app.use('/components/appNavbar/', express.static('components/appNavBar'));

app.use('/profile', express.static('pages/Profile'));
app.use('/signup', express.static('pages/Landing/Signup'));
app.use('/login', express.static('pages/Landing/Login'));
app.use('/assignment', express.static('pages/Dashboard/Assignment'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
