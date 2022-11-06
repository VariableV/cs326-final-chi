document.getElementById('togglePassword').addEventListener('click' , () => 
{
    document.getElementById('togglePassword').classList.toggle('bi-eye');
    const password = document.getElementById('passwordInput');
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
})




document.getElementById('loginButton').addEventListener('click' , () => {

    const password = document.getElementById('passwordInput').value;
    const email = document.getElementById('emailInput').value;

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
    document.getElementById('emailError').innerHTML === "" 
    )
    {
        // LOGIN THE USER HERE
    }


})