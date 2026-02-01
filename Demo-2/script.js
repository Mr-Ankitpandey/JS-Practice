const fromSelect = document.getElementById("fromSelect");
const composeForm = document.getElementById("composeForm");

function getUsers() {
  return JSON.parse(localStorage.getItem("mailUsers") || "[]");
}

function getMails() {
    return JSON.parse(localStorage.getItem('allMails') || '[]');
}

const saveUser = (name) => {
  const users = getUsers();
  if (!users.includes(name)) {
    users.push(name);
    console.log(users);
    localStorage.setItem("mailUsers", JSON.stringify(users));
    return true;
  }
  return false;
};
// const renderOptions = () => {
//   const allUsers = getUsers();
//   const fromSelect = document.getElementById("fromSelect");
//   const toSelect = document.getElementById("toSelect");
//   const forSelect = document.getElementById("forSelect");

//   const addOptions = (selectElement, excludeVal = null) => {
//     const currentVal = selectElement.value;
//     selectElement.innerHTML = "<option>Select</option>";

//     allUsers.forEach((user) => {
//       const option = document.createElement("option");
//       option.value = user;
//       option.textContent = user;
//       selectElement.appendChild(option);
//     });
//   };
//   addOptions(fromSelect);
//   addOptions(forSelect);

//   //logic for toSelect ye wala kar raha thaaaaaa
//   const selectedFrom = fromSelect.value;
//   console.log("alll", allUsers)
//   const filteredUser = allUsers.filter((val) => val !== selectedFrom && selectedFrom !== "Select");
// toSelect.innerHTML = "<option>Select</option>";
//   console.log(filteredUser)
//   filteredUser.forEach((user)=>{
//      const option = document.createElement("option");
//       option.value = user;
//       option.textContent = user;
//       toSelect.appendChild(option)
//   })
// };
const renderOptions = () => {
  const allUsers = getUsers();
  const toSelect = document.getElementById("toSelect");
  const forSelect = document.getElementById("forSelect");

  const addOptions = (selectElement, users) => {
    selectElement.innerHTML = "<option>Select</option>";
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user;
      option.textContent = user;
      selectElement.appendChild(option);
    });
  };
  addOptions(fromSelect, allUsers);
  addOptions(forSelect, allUsers);

  const selectedFrom = fromSelect.value;

  // if no user selected → show all users in toSelect
  if (selectedFrom === "Select") {
    addOptions(toSelect, allUsers);
  } else {
    const filteredUsers = allUsers.filter(user => user !== selectedFrom);
    addOptions(toSelect, filteredUsers);
  }
};
fromSelect.addEventListener("change", renderOptions);

const addUser = (event) => {
  event.preventDefault();
  const nameInput = document.getElementById("newUserName");
  const name = nameInput.value.trim();
  if (name) {
    if (saveUser(name)) {
      renderOptions();
      nameInput.value = "";
    } else {
      alert("User already exits");
    }
  }
};

const sendMail = (event) => {
  event.preventDefault();
  const formData = new FormData(composeForm);
  console.log(formData);
};
