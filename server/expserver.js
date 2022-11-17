const express = require('express');
const app = express();
const port = 3000;

/*
/getStudent (GET) - this endpoint will be used during login when a student logs into their test it account. This will return students’ information, and their classes. This will help us populate the profile and part of the dashboard frontend.

/createStudent (GET) - this endpoint will be used during signup when a new student signs up for testit. This will add the student to DB and log the user in. 

/getInstructor (GET) - works similar to /getStudent but this time it returns the instructor's information and classes teaching.

/createInstructor (POST) - works similarly to /createStudent. This will add the instructor to the DB and log the instructor in.

/createClass (POST) - will create a class. An instructor can only do this. This will add the new class to class DB.

/createTestCase (POST) - this will create a new test case in a particular class. A student can only do this. This will update the class DB JSON tree (No SQL)
*/

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});