let loginForm = document.querySelector('#loginForm');
let signupForm = document.querySelector('#signupForm');
let loginUsername = document.querySelector('#loginUsername');
let loginPassword = document.querySelector('#loginPassword');


loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  let userName = loginUsername.value.trim();
  let userPass = loginPassword.value.trim();

  // get all users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // check if user exists
  let matchedUser = users.find(
    (user) => user.username === userName && user.password === userPass
  );

  if (matchedUser) {
    localStorage.setItem("loggedInUser", matchedUser.username);
    window.location.href = "welcome.html";
  } else {
    // alert("Invalid credentials or user not found. Please sign up first.");
    let message  = document.querySelector('.msg');
    message.textContent = "No user found | Please Signup."
    message.style.display = "initial";
    setTimeout(() => {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    }, 2500);

    // signupForm.classList.add("active");
    // loginForm.classList.remove("active");
  }
});


// --- SIGNUP LOGIC ---
signupForm.addEventListener("submit", function(event) {
  event.preventDefault();

  let userName = document.querySelector('#signupUsername').value.trim();
  let email = document.querySelector('#signupEmail').value.trim();
  let userPass = document.querySelector('#signupPassword').value.trim();

  // get existing users (if any)
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // check if username already exists
  let userExists = users.some((user) => user.username === userName);

  if (userExists) {
    alert("Username already taken! Please choose another one.");
    return;
  }

  // add new user
  let newUser = { username: userName, email: email, password: userPass };
  users.push(newUser);

  // save updated list back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! Please login now.");

  signupForm.classList.remove("active");
  loginForm.classList.add("active");

  document.querySelector('#signupUsername').value = "";
  document.querySelector('#signupEmail').value = "";
  document.querySelector('#signupPassword').value = "";
});

let signInBtn = document.querySelector('#showSignup');
signInBtn.addEventListener("click", function(){
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
})
let loginBtn = document.querySelector('#showLogin');
loginBtn.addEventListener("click", function(){
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
})