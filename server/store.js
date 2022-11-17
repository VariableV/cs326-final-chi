const apiObj = {
    'student' : null,
    'instructor' : null,
}

export function getStudent(email , password)
{
    //get data from server and store to obj
    apiObj['student'] = {email:email}
}

export function getInstructor(email)
{
    //get data from server and store to obj
    apiObj['Instructor'] = {email:email}
}

export function createStudent(email)
{
    //get data from server and store to obj
    apiObj['student'] = {email:email , classes : [] , userSince : "" , grade: "" , testCount: null}
}

export function createInstructor(email)
{
    //get data from server and store to obj
    apiObj['student'] = {email:email , classes : [] , userSince : "" }
}

export default {apiObj};