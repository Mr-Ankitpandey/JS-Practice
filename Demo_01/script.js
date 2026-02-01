let filteredRecords = []
const renderSelectOptions = () => {
  for (let input of formInputs) {
    const optionVal = document.createElement("option");
    optionVal.textContent = input.name;
    optionVal.value = input.name.toLowerCase();
    selectField?.append(optionVal);
  }
};
renderSelectOptions();

const renderId = () => {
  const { id } = user;
  const idOption = document?.createElement("option");
  idOption.textContent = id;
  idOption.id = id;
  idOption.value = id;
  idSelection?.append(idOption);
};

const displayTableHeader = () => {
  const tr = document.createElement("tr");
  for (let input of formInputs) {
    const th = document.createElement("th");
    th.textContent = input.name;
    tr.append(th);
  }
  recordsTable?.append(tr);
};

const renderNewData = (user, selectedValue) => {
  const { name, city, age } = user;
  const row = document.createElement("tr");
  row.id = user?.id;

  row.innerHTML = `
    <td>${name}</td>
    <td>${city}</td>
    <td>${age}</td>
  `;
  console.log(selectedValue);
  recordsTable?.append(row);
};
const clearValues = () => {
  formInputs.forEach((input) => (input.value = ""));
};

const saveBtnHandler = (e) => {
  e.preventDefault();
  let formData;
  try {
    formData = new FormData(form);
  } catch (error) {
    console.error("Form Data not found");
    return;
  }
  const userData = Object.fromEntries(formData);
  if (!isNaN(Number(userData.Name)) || !isNaN(Number(userData.City))) {
    alert("Please provide valid details!");
    return;
  }

  if (!userData.Name || !userData.City || !userData.Age || userData.Age < 1) {
    alert("Please provide valid details!");
    return;
  }
  user = {
    id: Number(new Date()),
    name: userData.Name.trim(),
    age: userData.Age.trim(),
    city: userData.City.trim(),
  };
  records.push(user);
  renderId();
  if (recordsTable?.children.length === 0) {
    displayTableHeader();
  }

  form.reset();
  selectFieldHandler();
  const selectedValue = selectUnique?.value;
  console.log(records, userData.Age, userData.City, selectedValue);
  if (selectedValue == "select-value") {
    // allBtnHandler();
  }
  if(userData.Name == selectedValue || userData.Age == selectedValue || userData.City == selectedValue){
    filteredRecords.push(user)
    filterBtnHandler()
  } 
  isFilter ? "" : renderNewData(user);


};

const idSelectionHandler = () => {
  const selectedId = idSelection?.value;
  if (selectedId === "select-id") return;
  let userDetails;
  try {
    userDetails = records.find((obj) => obj.id == selectedId);
  } catch (error) {
    console.error("Details not found", error);
    return;
  }
  userName.value = userDetails.name;
  userCity.value = userDetails.city;
  userAge.value = userDetails.age;

  const btndiv = document.querySelector("#btndiv");
  saveBtn.style.display = "none";
  btndiv.style.display = "block";
};

const updateBtnHandler = (event) => {
  event.preventDefault();
  let selectedId = idSelection?.value;
  let userDetails;
  try {
    userDetails = records.find((obj) => obj.id == selectedId);
  } catch (error) {
    console.log("Records not found", error);
  }

  const activeField = selectField?.value;
  const activeValue = selectUnique?.value;

  const wasMatchingFilter =
    activeField !== "select-field" &&
    activeValue !== "select-value" &&
    userDetails[activeField] == activeValue;

  records.forEach((obj) => {
    if (obj.id == selectedId) {
      obj.name = userName?.value.trim();
      obj.city = userCity?.value.trim();
      obj.age = userAge?.value.trim();
    }
  });

  for (let row of recordsTable?.children) {
    if (row.id == selectedId) {
      let { name, city, age } = userDetails;
      row.children[0].textContent = name;
      row.children[1].textContent = city;
      row.children[2].textContent = age;
    }
  }

  if (wasMatchingFilter) {
    // const newValue = userDetails[activeField];
    selectFieldHandler();
    // selectUnique.value = newValue;
    filterBtnHandler();
  } else {
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
  let indexToDel;
  try {
    indexToDel = records.findIndex((obj) => obj.id == selectedId);
  } catch (error) {
    console.error("Index not found");
  }
  records?.splice(indexToDel, 1); //to delte from array
  for (let node of idSelection?.children) {
    if (node.textContent == selectedId) {
      idSelection.removeChild(node);
      clearValues();
    }
  }
  for (let row of recordsTable?.children) {
    if (row.id == selectedId) {
      recordsTable.removeChild(row);
    }
  }

  saveBtn.style.display = "block";
  btndiv.style.display = "none";
  idSelection.selectedIndex = 0;
  if (recordsTable?.children.length <= 1) {
    recordsTable.innerHTML = "";
  }

  selectFieldHandler();
};

const allBtnHandler = () => {
  isFilter = false
  isAllButtonClicked = true;
  if (records.length == 0) return;
  selectField.selectedIndex = 0;
  selectFieldHandler();
  recordsTable.innerHTML = "";
  displayTableHeader();
  records.forEach((record) => renderNewData(record));
};

const selectFieldHandler = () => {
  const selectedField = selectField.value;
  const previousValue = selectUnique.value; // store old value

  selectUnique.innerHTML = `<option value="select-value">Select Value</option>`;
  if (selectedField === "select-field") return;

  const values = records?.map((obj) => obj[selectedField].trim().toLowerCase());
  const uniqueValues = [...new Set(values)];

  uniqueValues?.forEach((val) => {
    const option = document.createElement("option");
    option.textContent = val;
    option.value = val;
    selectUnique?.append(option);
  });

  if (uniqueValues.includes(previousValue)) {
    selectUnique.value = previousValue;
  } 
};

const filterBtnHandler = () => {
  
  const selectedField = selectField?.value;
  const selectedValue = selectUnique?.value;
  if (selectedValue == "select-value") {
    allBtnHandler();
    
  }else if (!isAllButtonClicked) recordsTable.innerHTML = "";
  
  // if(selectedField == "select-field" && selectedValue == "select-value") alert("Chose Filter")

  try {
    filteredRecords = records.filter(
      (obj) => obj[selectedField].toLowerCase() == selectedValue,
    );
  } catch (error) {
    console.log("Filtered records not found");
    return;
  }
  if (filteredRecords.length === 0) return;
  recordsTable.innerHTML = "";
  displayTableHeader();
  isFilter = true;
  filteredRecords.forEach((record) => renderNewData(record, isFilter));
  if (selectedValue == "select-value") {
    alert("Please select unique value");
    return;
  }
};
