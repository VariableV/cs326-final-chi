let studentDetails = {};
let assignmentDetails = [];
studentDetails = await (await fetch('/getStudent')).json()
let assignment = await (await fetch('/getClass')).json()
assignmentDetails.push(assignment)

const classes = document.getElementById('classes');
const assignmentDiv = document.getElementById('assignments')


let assignments = assignmentDetails.map(elem => 
        {
          return elem['assignments'].map(assignment => { return {'className': elem['className'] , ...assignment}})
        })[0]



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

}


addClassesToDiv()
addAssignmentsToDiv()

document.getElementById('addEnroll').addEventListener('click' , () => 
{
    document.getElementById('addCourseModal').style.display = "block"
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


document.getElementById('classCancel').addEventListener('click' , () => 
{
    document.getElementById('addCourseModal').style.display = "none";   
})

document.getElementById('classEnroll').addEventListener('click' , () => 
{
    //add new class to studentDetails.clases
    document.getElementById('addCourseModal').style.display = "none"
    
})