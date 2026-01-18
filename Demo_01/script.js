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

let records = []; // to store all records data
let user = {}; // to store each details

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

function renderId(user) {
  const { id } = user;
  const idOption = document.createElement("option");
  idOption.textContent = id;
  idOption.id = id;
  idOption.value = id;
  idSelection.append(idOption);
}

function displayTable() {
  //display table headings
  if (records.length == 1) {
    const tr = document.createElement("tr");
    for (let input of formInputs) {
      const th = document.createElement("th");
      th.textContent = input.name;
      tr.append(th);
    }
    recordsTable.append(tr);
  }
}

function renderNewData(user) {
  const { name, city, age } = user;
  const row = document.createElement("tr");
  row.id = user.id;
  const nameCell = document.createElement("td");
  nameCell.textContent = name;
  row.appendChild(nameCell);
  const cityCell = document.createElement("td");
  cityCell.textContent = city;
  row.appendChild(cityCell);

  const ageCell = document.createElement("td");
  ageCell.textContent = age;
  row.appendChild(ageCell);
  recordsTable.append(row);
}

function clearValues() {
  formInputs.forEach((input) => (input.value = ""));
}

const saveBtnHandler = () => {
  const nameVal = userName.value;
  const ageVal = userAge.value;
  const cityVal = userCity.value;

  if (nameVal === "" || ageVal === "" || cityVal === "") {
    alert("Please fill all details !");
    return;
  }

  user = {
    id: Number(new Date()),
    name: nameVal,
    age: ageVal,
    city: cityVal,
  };
  records.push(user);

  displayTable();
  renderId(user);
  renderNewData(user);
  clearValues();
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
  const selectedId = idSelection.value;
  const userDetails = records.find((obj) => obj.id == selectedId);
  records.forEach((obj) => {
    if (obj.id == selectedId) {
      obj.name = userName.value;
      obj.city = userCity.value;
      obj.age = userAge.value;
    }
    console.log(records);
  });
  for (let row of recordsTable.children) {
    if (row.id == selectedId) {
      let { name, city, age } = userDetails;
      row.children[0].textContent = name;
      row.children[1].textContent = city;
      row.children[2].textContent = age;
    }
  }
};

const deleteBtnHandler = () => {
  const selectedId = idSelection.value;
  const indexToDel = records.findIndex((obj) => obj.id == selectedId);
  records.splice(indexToDel, 1);
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
  if (records.length == 0) {
    saveBtn.style.display = "block";
    btndiv.style.display = "none";
    // recordsTable.style.display = "none";
    return;
  }
  selectFieldHandler(); // to live update the unique dropdown if user get deleted
};
const selectFieldHandler = () => {
  const selectedField = selectField.value;
  selectUnique.innerHTML = `<option value="select-value">Select Value</option>`;
  if (selectedField === "select-field") return;

  const values = records.map((obj) => obj[selectedField]);
  console.log(values);
  const uniqueValues = [...new Set(values)];
  uniqueValues.forEach((val) => {
    const option = document.createElement("option");
    option.textContent = val;
    option.value = val;
    selectUnique.appendChild(option);
  });
};
function renderFilteredData(data) {
  recordsTable.innerHTML = "";

  if (data.length === 0) {
    return;
  }
  data.forEach(record => renderNewData(record));
}

const filterBtnHandler = () => {
    const selectedField = selectField.value;
    const selectedValue = selectUnique.value
    const filteredRecords = records.filter((obj) => obj[selectedField] == selectedValue);
    renderFilteredData(filteredRecords)

};

const allBtnHandler = () => {
  renderFilteredData(records);
};

saveBtn.addEventListener("click", saveBtnHandler);
idSelection.addEventListener("change", idSelectionHandler);
updateBtn.addEventListener("click", updateBtnHandler);
deleteBtn.addEventListener("click", deleteBtnHandler);
filterBtn.addEventListener("click", filterBtnHandler);
selectField.addEventListener("change", selectFieldHandler);
allBtn.addEventListener("click", allBtnHandler);
