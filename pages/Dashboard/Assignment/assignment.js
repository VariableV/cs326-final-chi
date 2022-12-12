/*
Leaderboard value

*/

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function groupBy(xs, key) {
    return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

window.addEventListener('load', async () => {
    const path = window.location.pathname.split("/");
    const className = path[2];
    const assignment = path[3];

    document.getElementById("class_name").innerText = className;
    document.getElementById("assignment_name").innerText = assignment;

    // fetch test cases for assignment
    const r = await fetch(`/getTestCases/${className}/${assignment}`).then(res => res.json());
    const tests = r["result"];

    // render test cases for user
    let total = 0;
    let sum = 0;

    tests.filter(test => test["student"] === window.localStorage["email"]).forEach((test, id) => {
        const name = test["name"];
        const coverage = test["coverage"];
        const codeBlock = test["code"];
        const codeBlocks = document.getElementById("codeBlocks");
        total += 1;
        sum += coverage;

        codeBlocks.appendChild(htmlToElement(`<div class="row border rounded-4 bg-muted shadow p-3 mb-5">
            <div class="col d-flex justify-content-center">
                <a>${name}</a>
            </div>
            <div class="col-9">
                <div class="progress mt-1">
                    <div class="progress-bar" role="progressbar" style="width: ${coverage}%; background-color: ${coverage < 85 ? (coverage < 70 ? (coverage < 50 ? '#A33333' : '#B19E59'): '#95B159') : '#34A853'}" aria-valuenow="${coverage}"
                        aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div class="col d-flex justify-content-center">
                <a class="text-dark text-decoration-none" data-toggle="collapse" href="#collapse${id}"
                    role="button" aria-expanded="false" aria-controls="collapseExample">
                    +
                </a>
            </div>
    
            <div class="collapse mt-2" id="collapse${id}">
                <div class="card card-body" style="font-family:courier, courier new, serif;">
                    ${codeBlock}
                </div>
            </div>
        </div>`));
    })

    // render coverage
    document.getElementById('coveragePercent').innerText = (total === 0 ? 0 : Math.round(sum / total)) + '%';

    // render leaderboard
    const peopleTests = groupBy(tests, "student");
    let leaderboard = [];

    for (let person of Object.keys(peopleTests)) {
        const pTest = peopleTests[person];
        const user = await fetch(`/getUser/${person}`).then(res => res.json())
        leaderboard.push([user["name"].length > 0 ? user["name"] : person, pTest.reduce((p, c) => p + c["coverage"], 0) / pTest.length]);
    }

    leaderboard.sort((a, b) => b[1] - a[1]);

    leaderboard.forEach((v, i) => {
        const lbElem = document.getElementById('leaderboard');
        lbElem.appendChild(htmlToElement(`<div class="row border rounded-4 bg-muted shadow p-3 ${i > 0 ? 'mt-4' : ''}">
        <div class="col d-flex justify-content-center">
            <a>${v[0]}</a>
        </div>
        <div class="col">
            <div class="progress mt-1">
                <div class="progress-bar" role="progressbar" style="width: ${Math.round(v[1])}%; background-color: ${v[1] < 85 ? (v[1] < 70 ? (v[1] < 50 ? '#A33333' : '#B19E59'): '#95B159') : '#34A853'}" aria-valuenow="${Math.round(v[1])}"
                    aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
    </div>`));
    });

    const as = await fetch(`/getAssignment/${className}/${assignment}`).then(res => res.json());
    document.getElementById('testCode').innerText = as["result"][0]["test"]

    document.getElementById('createTest').addEventListener('click', () => {
        document.getElementById('createTestModal').style.display = "block";
    });

    document.getElementById('testCancel').addEventListener('click', () => {
        document.getElementById('createTestModal').style.display = "none";
    });

    document.getElementById('testSubmit').addEventListener('click', () => {
        fetch("/createTestCase", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': document.getElementById('testNameField').value,
                'email': window.localStorage["email"],
                'class': className,
                'assignment': assignment,
                'code': document.getElementById('testCodeBlock').value
            })
        }).then(() => {
            window.location.reload()
        })
    });
})