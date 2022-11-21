let studentDetails = {};
let assignmentDetails = [];

studentDetails = await (await fetch(`/getStudent/${window.localStorage.getItem('email')}`)).json()
document.getElementById('dashboard').innerHTML = studentDetails['name'] !== '' ? `${studentDetails['name']}'s Dashboard` : `${studentDetails['email'].substring(0,studentDetails['email'].indexOf("@"))}'s Dashboard`;
document.getElementById('email').innerHTML = studentDetails['email']
const isStudent = studentDetails['studentAccount']

async function getAssignments()
{
    for(let i = 0 ; i< studentDetails['classes'].length ; i++)
    {
        let assignment = await (await fetch(`/getAssignments/${studentDetails['classes'][i]}`)).json()
        assignmentDetails.push(...assignment.ans)
    }
    
}

getAssignments()

// const classes = document.getElementById('classes');
// 


// let assignments = assignmentDetails.map(elem => 
//         {
//           return elem['assignments'].map(assignment => { return {'className': elem['className'] , ...assignment}})
//         })[0]


const assignmentDiv = document.getElementById('assignments')

function addClassesToDiv()
{
    document.getElementById('classes').innerHTML = ""
    for(let i = 0; i<studentDetails.classes.length;i++)
    {
        const div = document.createElement('div');
        div.classList.add('class')
        let className = document.createElement('h2');
        className.innerHTML = studentDetails.classes[i]
        let sem = document.createElement('p')
        sem.innerHTML = "Fall 2022"
        div.appendChild(className)
        div.appendChild(sem)
        classes.appendChild(div)
    }

    const div = document.createElement('div')
    div.classList.add('addEnroll')
    div.id = 'addEnroll'
    let course = document.createElement('h2');
    course.innerHTML = "+ Add A Course"
    div.appendChild(course)
    classes.appendChild(div)

}

function addClassesToSelect()
{
    document.getElementById('classSelect').innerHTML = ""
    for(let i = 0; i<studentDetails.classes.length;i++)
    {
        const option = document.createElement('option');
        option.innerHTML = studentDetails.classes[i]

        document.getElementById('classSelect').appendChild(option)
    }
}

function addAssignmentsToDiv()
{

    document.getElementById('assignments').innerHTML = ""
    for(let i = 0 ; i<assignments.length;i++)
    {
            const div = document.createElement('div');
            div.classList.add('assignmentElem')
            let className = document.createElement('p')
            className.innerHTML = assignments[i]['className']
            let assignmentName = document.createElement('p')
            assignmentName.innerHTML = assignments[i]['name']
            let createdAt = document.createElement('p')
            createdAt.innerHTML = assignments[i]['createdAt']
            let dueAt = document.createElement('p')
            dueAt.innerHTML = assignments[i]['dueAt']
            div.appendChild(className)
            div.appendChild(assignmentName)
            div.appendChild(createdAt)
            div.appendChild(dueAt)
            assignmentDiv.appendChild(div)

    }
    if(assignmentDetails.length === 0)
    {
        let empty = document.createElement('p')
        empty.innerHTML = "NO ASSIGNMENTS AS OF NOW"
        empty.style.marginTop= 20
        empty.style.marginBottom= 15
        empty.style.fontWeight = 550
        empty.style.textAlign = 'center'
        assignmentDiv.appendChild(empty)
    }

}


addClassesToDiv()
addAssignmentsToDiv()
addClassesToSelect();

document.getElementById('addEnroll').addEventListener('click' , () => 
{
    if(isStudent)
    {
        document.getElementById('addCourseModal').style.display = "block"
    }
    else
    {
        document.getElementById('createClassModal').style.display = "block"
    }
})

document.getElementById('createAssignment').addEventListener('click' , () => 
{
    document.getElementById('createAssignmentModal').style.display = "block"
})


document.getElementById('classNameArrow').addEventListener('click' , () => {


    if(document.getElementById('classNameArrow').className === "bi bi-caret-down-fill") // sort descending
    {
        assignments = assignments.sort((a,b) => b['className'] - a['className'])
    }
    else    // sort Ascending
    {   
        assignments = assignments.sort((a,b) => a['className'] - b['className'])
    }
    document.getElementById('classNameArrow').classList.toggle('bi-caret-up-fill');
    // document.getElementById('dueDateArrow').className = "bi bi-caret-down-fill"
    addAssignmentsToDiv()
   
})

document.getElementById('dueDateArrow').addEventListener('click' , () => {

    if(document.getElementById('dueDateArrow').className === "bi bi-caret-down-fill") // sort descending
    {
        assignments = assignments.slice(0).sort((a,b) =>{
            
            var aDate = new Date(a['dueAt']);
            var bDate = new Date(b['dueAt']);
            return bDate.getTime() - aDate.getTime();
        })
    }
    else    // sort Ascending
    {   
        assignments = assignments.slice(0).sort((a,b) => {
           
            var aDate = new Date(a['dueAt']);
            var bDate = new Date(b['dueAt']);
            return aDate.getTime() - bDate.getTime();
        })
    }
    document.getElementById('dueDateArrow').classList.toggle('bi-caret-up-fill');
    // document.getElementById('classNameArrow').className = "bi bi-caret-down-fill"
    addAssignmentsToDiv()
   
})

document.getElementById('assignmentCancel').addEventListener('click' , () => 
{
    document.getElementById('createAssignmentModal').style.display = "none";   
})


document.getElementById('classCancel').addEventListener('click' , () =>  // enroll code cancel button
{
    document.getElementById('addCourseModal').style.display = "none";   
})

document.getElementById('classSubmit').addEventListener('click' , () =>  //enroll code submit button
{

    fetch("/enrollClass", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'email': email,
          'password' : crypto.createHash('sha256').update(password).digest('hex')
        })
      })

    document.getElementById('addCourseModal').style.display = "none";   
})

document.getElementById('createCancel').addEventListener('click' , () => 
{
    document.getElementById('createClassModal').style.display = "none";   
})

document.getElementById('classEnroll').addEventListener('click' , () => 
{
    document.getElementById('addCourseModal').style.display = "none"
    
})