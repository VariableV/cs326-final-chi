let studentDetails = {}
studentDetails = await (await fetch('/getStudent')).json()
const classDetails = {}

let avgClassSize = 0
let sumOfStudents = 0
const studentStatsDiv = document.getElementById('studentStats')
const testCaseHolder = document.getElementById('testCases')


function classDeets()
{
   
  
    return new Promise(async resolve =>
    {
        let count = 0;
        for(let i = 0 ; i< studentDetails['classes'].length;i++)
        {
            const classData = await (await fetch('/getClass')).json()
            classDetails[studentDetails['classes'][i]] = classData
            sumOfStudents += classData['size']
            count+=1;

        }
        avgClassSize = sumOfStudents/studentDetails['classes'].length
        if(count === studentDetails['classes'].length)
        {
            resolve(sumOfStudents) // only resolve when the above part is done
        }
        

    })
   
    
   
}

classDeets().then((res) => 
{

    const studentStats = [{title:'Class Taken' , value: studentDetails['classes'].length} ,
    {title:'Semester Classes' , value:studentDetails['classes'].length},
    {title:'Average Class Size' , value:avgClassSize}, 
    {title:'Average Coverage' , value: studentDetails['avgCoverage'] ? studentDetails['avgCoverage'] : 0 }, 
    {title:'Average Rank' , value: studentDetails['avgRank'] ? studentDetails['avgRank'] : 0}]

    const testStats = ['Assignment Name' , 'Class Size' ,  'Coverage' , 'Semester']

    document.getElementById('studentEmailField').innerHTML = studentDetails['email']
    document.getElementById('studentBioField').innerHTML = studentDetails['bio'] ? studentDetails['bio'] : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodont '
    document.getElementById('studentJoinedField').innerHTML = studentDetails['Joined'] ? studentDetails['Joined'] : 'October 9th'
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
        className.innerHTML = studentDetails['testCases'][i]['className']
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
            let value = document.createElement('p')
            value.innerHTML = testStats[j] === 'Assignment Name' ? 
            studentDetails['testCases'][i]['assignment'] : 
            testStats[j] === 'Class Size' ? 
            classDetails[studentDetails['testCases'][i]['className']]['size'] : 
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

}

    document.getElementById('profileButton').addEventListener('click' , () =>
    {
        document.getElementById('editProfileModal').style.display = 'block';
    })

    document.getElementById('Cancel').addEventListener('click' , () => 
    {
        document.getElementById('editProfileModal').style.display = "none";   
    }) 


    addStats();
    addTests();
})






