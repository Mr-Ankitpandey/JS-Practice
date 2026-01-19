const saveBtn = document.getElementById("saveBtn");
const filterBtn = document.getElementById("filterBtn");
const allBtn = document.getElementById("allBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("delBtn");

const formInputs = document.querySelectorAll("input");

const userName = document.getElementById("name");
const userAge = document.getElementById("age");
const userCity = document.getElementById("city");
const idSelection = document.getElementById("selectId");
const selectField = document.getElementById("selectField");
const selectUnique = document.getElementById("selectUnique");
const recordsTable = document.getElementById("recordsTable");
const form = document.getElementById("form");

let records = []; // to store all records data
let user = {}; // to store each details
let displayHeadings = true;

// render select options dynamically on select field
function renderSelectOptions() {
  for (let input of formInputs) {
    const optionVal = document.createElement("option");
    optionVal.textContent = input.name;
    optionVal.value = input.name.toLowerCase();
    selectField.append(optionVal);
  }
}
renderSelectOptions();

function renderId() {
  const { id } = user;
  const idOption = document.createElement("option");
  idOption.textContent = id;
  idOption.id = id;
  idOption.value = id;
  idSelection.append(idOption);
}

function displayTableHeader() {
  const tr = document.createElement("tr");
  for (let input of formInputs) {
    const th = document.createElement("th");
    th.textContent = input.name;
    tr.append(th);
  }
  recordsTable.append(tr);
}

function renderNewData(user) {
  const { name, city, age } = user;
  const row = document.createElement("tr");
  row.id = user.id;

  row.innerHTML = `
    <td>${name}</td>
    <td>${city}</td>
    <td>${age}</td>
  `;
  recordsTable.append(row);
}

function clearValues() {
  formInputs.forEach((input) => (input.value = ""));
}

const saveBtnHandler = (e) => {
  e.preventDefault();
  // const nameVal = userName.value;
  // const ageVal = userAge.value;
  // const cityVal = userCity.value;
  // if (nameVal === "" || ageVal === "" || ageVal < 1 || cityVal === "") {
  //   alert("Please provide valid details !");
  //   return;
  // }
  const formData = new FormData(form);
  const userData = Object.fromEntries(formData);

  if (!userData.Name || !userData.City || !userData.Age || userData.Age < 1) {
  alert("Please provide valid details!");
  return;
}
user = {
  id: Number(new Date()),
  name: userData.Name.trim(),
  age: userData.Age.trim(),
  city: userData.City.trim()
};
  records.push(user);

  renderId();
  if (recordsTable.children.length === 0) {
    displayTableHeader();
  }

  renderNewData(user);
  form.reset();
};

const idSelectionHandler = () => {
  const selectedId = idSelection.value;
  if (selectedId === "select-id") return;
  const userDetails = records.find((obj) => obj.id == selectedId);
  userName.value = userDetails.name;
  userCity.value = userDetails.city;
  userAge.value = userDetails.age;

  const btndiv = document.querySelector("#btndiv");
  saveBtn.style.display = "none";
  btndiv.style.display = "block";
};

const updateBtnHandler = () => {
  let selectedId = idSelection.value;
  const userDetails = records.find((obj) => obj.id == selectedId);

  const activeField = selectField.value;
  const activeValue = selectUnique.value;

  const wasMatchingFilter =
    activeField !== "select-field" &&
    activeValue !== "select-value" &&
    userDetails[activeField] == activeValue;

  // update record in array
  records.forEach((obj) => {
    if (obj.id == selectedId) {
      obj.name = userName.value.trim();
      obj.city = userCity.value.trim();
      obj.age = userAge.value.trim();
    }
  });

  // update UI table row
  for (let row of recordsTable.children) {
    if (row.id == selectedId) {
      let { name, city, age } = userDetails;
      row.children[0].textContent = name;
      row.children[1].textContent = city;
      row.children[2].textContent = age;
    }
  }

  if (wasMatchingFilter) {
    const newValue = userDetails[activeField];

    // refresh unique dropdown and keep filter applied
    selectFieldHandler();
    selectUnique.value = newValue;
    filterBtnHandler();
  } else {
    // no filter action — just refresh unique dropdown (safe)
    selectFieldHandler();
  }
  clearValues();
  const btndiv = document.querySelector("#btndiv");
  saveBtn.style.display = "block";
  btndiv.style.display = "none";
  idSelection.selectedIndex = 0;
};

const deleteBtnHandler = () => {
  const selectedId = idSelection.value;
  const indexToDel = records.findIndex((obj) => obj.id == selectedId);
  records.splice(indexToDel, 1); //to delte from array
  for (let node of idSelection.children) {
    if (node.textContent == selectedId) {
      idSelection.removeChild(node);
      clearValues();
    }
  }
  for (let row of recordsTable.children) {
    if (row.id == selectedId) {
      recordsTable.removeChild(row);
    }
  }

  saveBtn.style.display = "block";
  btndiv.style.display = "none";
  idSelection.selectedIndex = 0;
  if (recordsTable.children.length <= 1) {
    recordsTable.innerHTML = "";
  }

  selectFieldHandler(); // to instant update unique dropdown if any deleteion happens
};
const selectFieldHandler = () => {
  const selectedField = selectField.value;
  const previousValue = selectUnique.value; // store old value

  // reset unique dropdown
  selectUnique.innerHTML = `<option value="select-value">Select Value</option>`;
  if (selectedField === "select-field") return;

  // extract field values
  const values = records.map((obj) => obj[selectedField].trim());
  const uniqueValues = [...new Set(values)];

  // render new unique options
  uniqueValues.forEach((val) => {
    const option = document.createElement("option");
    option.textContent = val;
    option.value = val;
    selectUnique.append(option);
  });

  if (uniqueValues.includes(previousValue)) {
    selectUnique.value = previousValue;
  } else {
    selectUnique.value = "select-value";
  }
};

const filterBtnHandler = () => {
  const selectedField = selectField.value;
  const selectedValue = selectUnique.value;
  const filteredRecords = records.filter(
    (obj) => obj[selectedField] == selectedValue,
  );
  if (selectedValue == "select-value") {
    alert("Please select unique value");
    return;
  }
  if (filteredRecords.length === 0) return;
  recordsTable.innerHTML = ""; // to remove previous records and only render filtered records
  displayTableHeader();
  filteredRecords.forEach((record) => renderNewData(record));
};

const allBtnHandler = () => {
  if(records.length == 0) return
  selectField.selectedIndex = 0;
  selectFieldHandler();
  recordsTable.innerHTML = "";
  displayTableHeader();
  records.forEach((record) => renderNewData(record));
};

// saveBtn.addEventListener("click", saveBtnHandler);
// idSelection.addEventListener("change", idSelectionHandler);
// updateBtn.addEventListener("click", updateBtnHandler);
// deleteBtn.addEventListener("click", deleteBtnHandler);
// filterBtn.addEventListener("click", filterBtnHandler);
// selectField.addEventListener("change", selectFieldHandler);
// allBtn.addEventListener("click", allBtnHandler);
