## Database Documentation
```
user document {
    _id: <ObjectId>, // unique id for user
    email: String, // email for user
    name: String, // name of user, optional field
    bio: String, // bio of user, optional field
    studentAccount: Boolean, // True for student, False for Teacher
    classes: Array<String>, // classes teaching or enrolled in
    joined: Date // join date
}

test document {
    _id: <ObjectId>, // unique id for test
    name: String, // name of test
    student: String, // which student test is associated with
    class: String, // class test is associated with
    assignment: String, // assignment test is associated with
    coverage: Integer, // percent coverage
    code: String // block of code for a test
}

class document {
    _id: <ObjectId>, // unique id for class
    name: String, // name for class
    assignments: Array<String>, // unique assignments in class
    instructor: String, // teacher name
    size: Integer // size of class
    enrollCode: String // required for enrolling in a class, must be provided by an instructor.
}

assignment document {
    _id: <ObjectId>, // unique id for assignment
    name: String, // name for assignment
    class: String, // class that assignment belongs to
    release: Date, // release date for assignment
    due: Date // due date for assignment
}
```

## Division of Labor
Maheen - Design database schema and connected express endpoints to MongoDB

Kanishk - Added more API endpoints and wrote front-end requests to backend

Daniel - Nothing