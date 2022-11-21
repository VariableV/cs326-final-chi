// import apiObj from '../../../server/store.js'
//import sha256


document.getElementById('togglePassword').addEventListener('click' , () => 
{
    document.getElementById('togglePassword').classList.toggle('bi-eye');
    const password = document.getElementById('passwordInput');
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
})




document.getElementById('signupButton').addEventListener('click' , () => {

    const password = document.getElementById('passwordInput').value;
    const email = document.getElementById('emailInput').value;
    const phone = document.getElementById('phoneInput').value;

    if(!email.includes('umass.edu'))
    {
        document.getElementById('emailError').innerHTML = "Please use your umass email"
    }
    else if(!email.includes('@'))
    {
        document.getElementById('emailError').innerHTML = "Invalid Email - must contain '@'"
    }
    else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
    {
        document.getElementById('emailError').innerHTML = "Invalid Email"
    }
    else
    {
        document.getElementById('emailError').innerHTML = ""
    }

    if(phone !== "")
    {
        if(!(/[0-9]{10}/).test(phone))
        {
            document.getElementById('phoneError').innerHTML = "Phone number should be 10 digits"
        }
        else
        {
            document.getElementById('phoneError').innerHTML = ""
        }
    }
    else
    {
        document.getElementById('phoneError').innerHTML = ""
    }


    if(!(/[0-9a-zA-Z!@#$&()\\-`.+,/\)]{6,30}/).test(password))
    {
        document.getElementById('passwordError').innerHTML = "Password Should be atleast 6 characters"
    }
    else if(!(/.*[A-Z].*/).test(password))
    {
        document.getElementById('passwordError').innerHTML = "Password must contain an uppercase character"
    }
    else if(!(/.*[0-9].*/).test(password))
    {
        document.getElementById('passwordError').innerHTML = "Password must contain a number"
    }
    else
    {
        document.getElementById('passwordError').innerHTML = ""
    }

    if(document.getElementById('passwordError').innerHTML === "" &&
    document.getElementById('emailError').innerHTML === "" &&
    document.getElementById('phoneError').innerHTML === ""
    )
    {
        console.log("first pass")
        if(document.getElementById('Instructor').checked)
        {
            console.log("second pass")
            fetch("/createInstructor", {
                method: "post",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'email': email,
                  'password' : password//crypto.createHash('sha256').update(password).digest('hex')
                })
              }).then((res) => 
              {
                if(res.ok)
                {
                    window.localStorage.setItem('email' , email)
                    location.href="/dashboard"
                }
                else
                {
                    document.getElementById('passwordError').innerHTML = "Email Already Exists, Please Login"
                }
                
              })
              .catch(error => alert(error.message))
        }
        else
        {
            fetch("/createStudent", {
                method: "post",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'email': email,
                  'password' : password
                })
              }).then((res) => 
              {
                if(res.ok)
                {
                    window.localStorage.setItem('email' , email)
                    location.href="/dashboard"
                }
                else
                {
                    document.getElementById('passwordError').innerHTML = "Email Already Exists, Please Login"
                }
                
              })
              .catch(error => alert(error.message))
        }

        
    }


})