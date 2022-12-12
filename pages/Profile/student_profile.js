let studentDetails = {}
studentDetails = await (await fetch(`/getUser/${window.localStorage.getItem('email')}`)).json()

const classDetails = {}
let avgClassSize = 0
let sumOfStudents = 0
const studentStatsDiv = document.getElementById('studentStats')
const testCaseHolder = document.getElementById('testCases')
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
console.log(studentDetails)
let assignmentDetails = []

function Deets()
{
   
  
    return new Promise(async resolve =>
    {
        let count = 0;
        for(let i = 0 ; i< studentDetails['classes'].length;i++)
        {
            const classData = await (await fetch(`/getClass/${studentDetails['classes'][i]['className']}`)).json()
            classDetails[studentDetails['classes'][i]['className']] = classData
            sumOfStudents += classData['size']
            count+=1;

        }
        avgClassSize = (sumOfStudents/studentDetails['classes'].length).toFixed(2)

        assignmentDetails = []
        for(let i = 0 ; i< studentDetails['classes'].length ; i++)
        {
            let assignment = await (await fetch(`/getAssignments/${studentDetails['classes'][i]['className']}`)).json()
            for(let j = 0; j<assignment.length;j++)
            {
                assignmentDetails.push(assignment[j])
            }
        
        }

        assignmentDetails = assignmentDetails.reverse()

        if(count === studentDetails['classes'].length)
        {
            resolve(sumOfStudents) // only resolve when the above part is done
        }

        

    })
   
    
   
}

Deets().then((res) => 
{

    const studentStats = studentDetails['studentAccount'] ? [{title:'Class Taken' , value: studentDetails['classes'].length} ,
    {title:'Semester Classes' , value:studentDetails['classes'].length},
    {title:'Average Class Size' , value:avgClassSize}, 
    {title:'Average Coverage' , value: studentDetails['avgCoverage'] ? studentDetails['avgCoverage'] : 0 }, 
    {title:'Average Rank' , value: studentDetails['avgRank'] ? studentDetails['avgRank'] : 0}] 
    : 
    [{title:'Class Teaching' , value: studentDetails['classes'].length} ,
    {title:'Current Classes' , value:studentDetails['classes'].length},
    {title:'Average Class Size' , value:avgClassSize}, 
    {title:'Submission Ratio' , value:assignmentDetails.reduce((p, c) => p + c['submissions'], 0) / sumOfStudents === 0 ? 1 : sumOfStudents}, 
    ]

    const testStats = ['Assignment Name' , 'Class Size' ,  'Coverage' , 'Semester']
    const assignmentStats =  [ 'Submissions', 'Class Size', 'Due Date' , 'Semester']

    document.getElementById('instructorField').innerHTML = studentDetails['studentAccount'] ? 'Student' : 'Instructor'
    document.getElementById('studentNameField').innerHTML = studentDetails['name'] !== '' ? studentDetails['name'] : studentDetails['email'].substring(0,studentDetails['email'].indexOf("@"))
    document.getElementById('studentEmailField').innerHTML = studentDetails['email']
    document.getElementById('studentBioField').innerHTML = studentDetails['bio']!=='' ? studentDetails['bio'] : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodont '
    document.getElementById('studentJoinedField').innerHTML = studentDetails['joined']!=='' ? `${months[(new Date(studentDetails['joined'])).getMonth()]} ${(new Date(studentDetails['joined'])).getDate()}, ${(new Date(studentDetails['joined'])).getFullYear()}`: 'October 9th'
    document.getElementById('emailInput').value = studentDetails['email']
    document.getElementById('nameInput').value = studentDetails['name'] ? studentDetails['name'] : ''
    document.getElementById('bioInput').innerHTML = studentDetails['bio'] ? studentDetails['bio'] : ''


const addStats = () => {

    studentStatsDiv.innerHTML = ""
    for(let i = 0 ; i< studentStats.length; i++)
    {
        const div = document.createElement('div');
        div.classList.add('stat')
        let value = document.createElement('h1');
        value.innerHTML = studentStats[i]['value']
        let title = document.createElement('p')
        title.innerHTML = studentStats[i]['title']
        div.appendChild(value)
        div.appendChild(title)
        studentStatsDiv.appendChild(div)
    }
}

const addAssignments = () => 
{
    testCaseHolder.innerHTML = ""

    for(let i = 0 ; i < assignmentDetails.length; i++)
    {
        const div = document.createElement('div');
        div.classList.add('testCase')
        let testName = document.createElement('h1');
        testName.innerHTML = assignmentDetails[i]['name']
        let className = document.createElement('h3')
        className.innerHTML = assignmentDetails[i]['className']
        let grayBar = document.createElement('div')

        let ProgressBar = document.createElement('div')
        ProgressBar.style.width = `${assignmentDetails[i]['submissions']}%`
        ProgressBar.style.height = 25;
        ProgressBar.style.borderRadius = `5px`;
        ProgressBar.style.backgroundColor = assignmentDetails[i]['submissions'] > 85 ? '#34A853' : 
        assignmentDetails[i]['submissions'] > 70 ? '#95B159' : assignmentDetails[i]['submissions'] > 50 ? '#B19E59' : '#A33333'

        const testStatsDiv = document.createElement('div')
        testStatsDiv.classList.add('testStats') //common class for assignments (instructors) and tests (students)

        for(let j = 0; j< assignmentStats.length;j++)
        {
            const div2 = document.createElement('div')
            div2.style.display='flex'
            div2.style.marginRight=10
            div2.style.alignItems='center'
            let p = document.createElement('p')
            p.innerHTML = assignmentStats[j] + ':'
            p.style.marginRight = 5
            p.style.color='rgb(95, 95, 95)'
            p.style.fontSize=15
            let value = document.createElement('p')
            value.innerHTML = assignmentStats[j] === 'Due Date' ? 
            `${months[new Date(assignmentDetails[i]['due']).getMonth()]} ${new Date(assignmentDetails[i]['due']).getDate()}, ${new Date(assignmentDetails[i]['due']).getFullYear()}` : 
            assignmentStats[j] === 'Class Size' ? 
            classDetails[assignmentDetails[i]['className']]['size'] : 
            assignmentStats[j] === 'Semester' ? 'Fall 2022' :
            assignmentDetails[i]['submissions']
            value.style.color = assignmentStats[j] === 'Due Date' ?  new Date() < new Date(assignmentDetails[i]['due']) ? 'green' : '#8a1a1a' : 'black'
            

            value.style.fontWeight=550
            div2.appendChild(p)
            div2.appendChild(value)
            testStatsDiv.appendChild(div2)

        }

        grayBar.classList.add('grayBar')
        grayBar.appendChild(ProgressBar)
        div.appendChild(testName)
        div.appendChild(className)
        div.appendChild(grayBar)
        div.appendChild(testStatsDiv)
        testCaseHolder.appendChild(div)
    }


    if(assignmentDetails.length === 0)
    {
        let div = document.createElement('div')
        let empty = document.createElement('p')
        empty.innerHTML = "YOU HAVE 0 ASSIGNMENTS"
        empty.style.marginTop= 20
        empty.style.marginBottom= 15
        empty.style.fontWeight = 550
        empty.style.textAlign = 'center'
        div.appendChild(empty)
        div.classList.add('testCase')
        div.style.backgroundColor='#DFDFDF'
        testCaseHolder.appendChild(div)
    }
}


const addTests = () => 
{
    testCaseHolder.innerHTML = ""

    for(let i = 0 ; i < studentDetails['testCases'].length; i++)
    {
        const div = document.createElement('div');
        div.classList.add('testCase')
        let testName = document.createElement('h1');
        testName.innerHTML = studentDetails['testCases'][i]['name']
        let className = document.createElement('h3')
        className.innerHTML = studentDetails['testCases'][i]['class']
        let grayBar = document.createElement('div')

        let ProgressBar = document.createElement('div')
        ProgressBar.style.width = `${studentDetails['testCases'][i]['coverage']}%`
        ProgressBar.style.height = 25;
        ProgressBar.style.borderRadius = `5px`;
        ProgressBar.style.backgroundColor = studentDetails['testCases'][i]['coverage'] > 85 ? '#34A853' : 
        studentDetails['testCases'][i]['coverage'] > 70 ? '#95B159' : studentDetails['testCases'][i]['coverage'] > 50 ? '#B19E59' : '#A33333'

        const testStatsDiv = document.createElement('div')
        testStatsDiv.classList.add('testStats')

        for(let j = 0; j< testStats.length;j++)
        {
            const div2 = document.createElement('div')
            div2.style.display='flex'
            div2.style.marginRight=10
            div2.style.alignItems='center'
            let p = document.createElement('p')
            p.innerHTML = testStats[j] + ':'
            p.style.marginRight = 5
            p.style.color='rgb(95, 95, 95)'
            p.style.fontSize=15
           // console.log(studentDetails['testCases'][i])
            let value = document.createElement('p')
            value.innerHTML = testStats[j] === 'Assignment Name' ? 
            studentDetails['testCases'][i]['assignment'] : 
            testStats[j] === 'Class Size' ? 
            classDetails[studentDetails['testCases'][i]['class']]['size'] : 
            testStats[j] === 'Semester' ? 'Fall 2022' :
            studentDetails['testCases'][i]['coverage']

            value.style.fontWeight=550
            div2.appendChild(p)
            div2.appendChild(value)
            testStatsDiv.appendChild(div2)

        }

        grayBar.classList.add('grayBar')
        grayBar.appendChild(ProgressBar)
        div.appendChild(testName)
        div.appendChild(className)
        div.appendChild(grayBar)
        div.appendChild(testStatsDiv)
        testCaseHolder.appendChild(div)
    }


    if(studentDetails['testCases'].length === 0)
    {
        let div = document.createElement('div')
        let empty = document.createElement('p')
        empty.innerHTML = studentDetails['studentAccount'] ?  "YOU HAVE 0 PUBLISHED TESTS" : "YOU HAVE 0 ASSIGNMENTS"
        empty.style.marginTop= 20
        empty.style.marginBottom= 15
        empty.style.fontWeight = 550
        empty.style.textAlign = 'center'
        div.appendChild(empty)
        div.classList.add('testCase')
        div.style.backgroundColor='#DFDFDF'
        testCaseHolder.appendChild(div)
    }

}

    document.getElementById('profileButton').addEventListener('click' , () =>
    {
        document.getElementById('editProfileModal').style.display = 'block';
    })

    document.getElementById('Cancel').addEventListener('click' , () => 
    {
        document.getElementById('editProfileModal').style.display = "none";   
    })
    
    document.getElementById('Submit').addEventListener('click' , () => 
    {
       let newName = document.getElementById('nameInput').value
       let newBio = document.getElementById('bioInput').value

       fetch("/updateUser", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'email': studentDetails['email'],
          'name': newName,
          'bio' : newBio
        })
      }).then(res => {
        studentDetails['name'] = newName;
        studentDetails['bio'] = newBio;

        document.getElementById('studentNameField').innerHTML = studentDetails['name'] !== '' ? studentDetails['name'] : studentDetails['email'].substring(0,studentDetails['email'].indexOf("@"))
        document.getElementById('studentBioField').innerHTML = studentDetails['bio'] ? studentDetails['bio'] : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodont '
        document.getElementById('editProfileModal').style.display = "none";   
      })
    }) 

    


    addStats();
    studentDetails['studentAccount'] ?  addTests() : addAssignments();
})






