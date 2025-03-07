//Switch Between Login Page and Register Page
const signInButton = document.getElementById("signInButton")
const signUpButton = document.getElementById("signUpButton")

const signInForm = document.getElementById("signIn")
const signUpForm = document.getElementById("signUp")

signUpButton.addEventListener('click', function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";

})

signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";

})



document.getElementById("loginbtn").addEventListener("click", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    message.classList.remove("success", "error"); // Reset classes

    if (email === "admin@example.com" && password === "password123") {
        message.classList.add("success");
        message.innerText = "Login Successful!";
        setTimeout(function() {
            window.location.href = "../dashboard/dashboard.html"; // Redirect after 2 seconds
        }, 2000);
    } else {
        message.classList.add("error");
        message.innerText = "Invalid email or password. Try again!";
    }
});


  
