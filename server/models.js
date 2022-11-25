import { Schema, model } from "mongoose";

const assignmentDoc = new Schema({
    name: String, // name for assignment
    class: String, // class that assignment is in
    release: Date, // release date for assignment
    due: Date // due date for assignment
});

const classDoc = new Schema({
    name: { required: true, type: String }, // name for class
    assignments: { required: true, type: [String] }, // unique assignments in class
    instructor: { required: true, type: String }, // teacher name
    size: Number , // size of class
    enrollCode:{ required: true, type: String }, // required for enrolling in the class
});

const testDoc = new Schema({
    name: { required: true, type: String }, // name of test
    student: { required: true, type: String }, // which student test is associated with
    class: { required: true, type: String }, // class test is associated with
    assignment: { required: true, type: String }, // assignment test is associated with
    coverage: Number, // percent coverage
    code: { required: true, type: String } // block of code for a test
});

const userDoc = new Schema({
    email: { required: true, type: String }, // email for user
    name: { required: false, type: String }, // name of user, optional field
    bio: { required: false, type: String }, // bio of user, optional field
    studentAccount: { required: true, type: Boolean }, // True for student, False for Teacher
    classes: { required: true, type: [Object] }, // classes teaching or enrolled in
    joined: { required: true, type: Date },// join date
    password:{required: true, type:String} // hashed password
});

export const Assignment = model('Assignment', assignmentDoc)
export const User = model('User', userDoc)
export const Test = model('Test', testDoc)
export const Class = model('Class', classDoc)

export default { Assignment, User, Test, Class };