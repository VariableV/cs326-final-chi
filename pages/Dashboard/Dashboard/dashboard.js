let studentDetails = {};
let assignmentDetails = [];
let classDetails = [];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const assignmentDiv = document.getElementById('assignments')

studentDetails = await (await fetch(`/getUser/${window.localStorage.getItem('email')}`)).json()
document.getElementById('dashboard').innerHTML = studentDetails['name'] !== '' ? `${studentDetails['name']}'s Dashboard` : `${studentDetails['email'].substring(0,studentDetails['email'].indexOf("@"))}'s Dashboard`;
document.getElementById('email').innerHTML = studentDetails['email']
document.getElementById('instructor').innerHTML = studentDetails['studentAccount'] ? 'Student' : 'Instructor'
document.getElementById('createAssignment').style.display = studentDetails['studentAccount'] ? 'none' : 'block'
document.getElementById('addOrCreateCourse').innerHTML = studentDetails['studentAccount'] ? '+ Add A Course' : '+ Create A Course'
const isStudent = studentDetails['studentAccount']
console.log(studentDetails)


async function getClassDetails()
{
    for(let i = 0; i< studentDetails['classes'].length;i++)
    {
        let classObj =  await (await fetch(`/getClass/${studentDetails['classes'][i]['className']}`)).json()
        classDetails.push(classObj)
    }
}

async function getAssignments()
{
    assignmentDetails = []
    for(let i = 0 ; i< studentDetails['classes'].length ; i++)
    {
        let assignment = await (await fetch(`/getAssignments/${studentDetails['classes'][i]['className']}`)).json()
        for(let j = 0; j<assignment.length;j++)
        {
            assignmentDetails.push(assignment[j])
        }
       
    }    

    addAssignmentsToDiv();
}


getClassDetails();
getAssignments();





function addClassesToDiv()
{
    document.getElementById('classes').innerHTML = ""

    for(let i = studentDetails.classes.length - 1; i>=0;i--)
    {
        const div = document.createElement('div');
        div.classList.add('class')
        let className = document.createElement('h2');
        className.innerHTML = studentDetails.classes[i]['className']
        let code = document.createElement('h5')
        code.innerHTML = `Enroll Code: ${studentDetails.classes[i]['code']}`// if studentaccount is true code will just say fall 2022
        div.appendChild(className)
        div.appendChild(code)
        classes.appendChild(div)
    }


}

function addClassesToSelect()
{
    document.getElementById('classSelect').innerHTML = ""
    for(let i = studentDetails.classes.length - 1; i>=0;i--)
    {
        const option = document.createElement('option');
        option.innerHTML = `${studentDetails.classes[i]['className']}`;
        option.value = studentDetails.classes[i]['code']
        document.getElementById('classSelect').appendChild(option)
    }
}

function addAssignmentsToDiv()
{

    document.getElementById('assignments').innerHTML = ""
    for(let i = 0 ; i<assignmentDetails.length;i++)
    {
            const div = document.createElement('div');
            div.classList.add('assignmentElem')
            let className = document.createElement('p')
            className.innerHTML = assignmentDetails[i]['className']
            let assignmentName = document.createElement('p')
            assignmentName.innerHTML = assignmentDetails[i]['name']
            let createdAt = document.createElement('p')
            createdAt.innerHTML = `${months[new Date(assignmentDetails[i]['release']).getMonth()]} ${new Date(assignmentDetails[i]['release']).getDate()}, ${new Date(assignmentDetails[i]['release']).getFullYear()}`
            let dueAt = document.createElement('p')
            dueAt.innerHTML = `${months[new Date(assignmentDetails[i]['due']).getMonth()]} ${new Date(assignmentDetails[i]['due']).getDate()}, ${new Date(assignmentDetails[i]['due']).getFullYear()}`
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
// addAssignmentsToDiv()
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
        assignmentDetails = assignmentDetails.sort((a,b) =>  b.className.localeCompare(a.className))
    }
    else    // sort Ascending
    {   
        assignmentDetails = assignmentDetails.sort((a,b) =>  a.className.localeCompare(b.className))
    }
    document.getElementById('classNameArrow').classList.toggle('bi-caret-up-fill');
    // document.getElementById('dueDateArrow').className = "bi bi-caret-down-fill"
    addAssignmentsToDiv()
   
})

document.getElementById('dueDateArrow').addEventListener('click' , () => {

    if(document.getElementById('dueDateArrow').className === "bi bi-caret-down-fill") // sort descending
    {
        assignmentDetails = assignmentDetails.slice(0).sort((a,b) =>{
            
            var aDate = new Date(a['due']);
            var bDate = new Date(b['due']);
            return bDate.getTime() - aDate.getTime();
        })
    }
    else    // sort Ascending
    {   
        assignmentDetails = assignmentDetails.slice(0).sort((a,b) => {
           
            var aDate = new Date(a['due']);
            var bDate = new Date(b['due']);
            return aDate.getTime() - bDate.getTime();
        })
    }
    document.getElementById('dueDateArrow').classList.toggle('bi-caret-up-fill');
    // document.getElementById('classNameArrow').className = "bi bi-caret-down-fill"
    addAssignmentsToDiv()
   
})

document.getElementById('assignmentSubmit').addEventListener('click' , () =>    //assignment create cancel 
{
    fetch("/createAssignment", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          'className': document.getElementById('classSelect').options[document.getElementById('classSelect').selectedIndex].text,
          'name' : document.getElementById('assignmentNameInputField').value,
          'classEnrollCode': document.getElementById('classSelect').value,
          'dueDate': new Date(document.getElementById('assignmentDueInputField').value),
          'released': new Date(),
          
        })
      }).then((res) => 
      {
        getAssignments()
        document.getElementById('createAssignmentModal').style.display = "none";   
      })

    
})

document.getElementById('assignmentCancel').addEventListener('click' , () =>    //assignment create cancel 
{
    document.getElementById('createAssignmentModal').style.display = "none";   
})



document.getElementById('classCancel').addEventListener('click' , () =>  // enroll code cancel button
{
    document.getElementById('addCourseModal').style.display = "none";   
    document.getElementById('studentEnrollCode').style.borderColor='black'
})

document.getElementById('classSubmit').addEventListener('click' , () =>  //enroll code submit button
{
    if(document.getElementById('studentEnrollCode').value !== "")
    {

    fetch("/enrollClass", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          'email': studentDetails['email'],
          'code' : document.getElementById('studentEnrollCode').value
        })
      }).then((res) =>  {
        if(res.ok)
        {
            fetch(`/getClassByCode/${document.getElementById('studentEnrollCode').value}`).then((response) => response.json())
            .then((response) => {
                studentDetails['classes'].push(
                    {'className' : response['name'] , 
                    'code' : document.getElementById('studentEnrollCode').value
                    })
                document.getElementById('addCourseModal').style.display = "none";  
                addClassesToDiv();
                getAssignments();
                document.getElementById('studentEnrollCode').value = ""
                
            })

        }
        else
        {   
            document.getElementById('studentEnrollCode').style.borderColor='red'
        }

    })}

   
})


document.getElementById('createClassNameInput').addEventListener('keypress' , (event) => 
{
    let key = event.keyCode;
    if (key === 32) {
      event.preventDefault();
    }
})

document.getElementById('createCancel').addEventListener('click' , () =>  // cancel button of create class modal
{
    document.getElementById('createClassModal').style.display = "none";   
})

document.getElementById('createSubmit').addEventListener('click' , () =>  // submit button of create class modal
{
    if(document.getElementById('createClassNameInput').value !== "")
    {
     
    let code = 0;   

    fetch("/createClass", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          'name': document.getElementById('createClassNameInput').value,
          'email': studentDetails['email'],
        })
      }).then((res) => 
      {
        if(res.ok)
        {
           let obj = fetch(`/getClass/${document.getElementById('createClassNameInput').value}`).
            then(response => response.json()).then(response => {
                code = response['enrollCode']
                studentDetails['classes'].push(
                    {'className' : document.getElementById('createClassNameInput').value , 
                    'code' : code
                    })
                addClassesToDiv();
                addClassesToSelect();
                document.getElementById('createClassModal').style.display = "none";  
            })

            
      
        }
        else
        {
            document.getElementById('createClassError').innerHTML = "Class already exists for this semester"
        }

      })}
    

})
