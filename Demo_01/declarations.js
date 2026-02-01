const saveBtn = document.getElementById("saveBtn");
const formInputs = document.querySelectorAll("input");
const userName = document.getElementById("name");
const userAge = document.getElementById("age");
const userCity = document.getElementById("city");
const idSelection = document.getElementById("selectId");
const selectField = document.getElementById("selectField");
const selectUnique = document.getElementById("selectUnique");
const recordsTable = document.getElementById("recordsTable");
const form = document.getElementById("form");

const records = []; // to store all records data
let user = {}; // to store each details
let displayHeadings = true;
let isFilter = false;
let isAllButtonClicked = false

document.addEventListener('keydown', function(event) {
  // Prevent the 'Enter' key
  if (event.key === 'Enter') {
    event.preventDefault(); // Stop the default action
  }
  });