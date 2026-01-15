const saveBtn = document.getElementById('saveBtn')
const filterBtn = document.getElementById('filterBtn')
const allBtn = document.getElementById('allBtn')

const formInputs = document.querySelectorAll('input')

const userName = document.getElementById('name')
const userAge = document.getElementById('age')
const userCity = document.getElementById('city')

const selectField = document.getElementById('selectField')

let records = []; //main array to store all records data

//function to render select options dynamically on select field for filter
function renderSelectOptions(){
    for(let input of formInputs){
        const optionVal = document.createElement('option');
        optionVal.textContent = input.id;
        optionVal.value = input.id.toLowerCase();
        selectField.append(optionVal)
    }
    
    
}
renderSelectOptions()

const saveBtnHandler = ()=>{
    const nameVal = userName.value
    const ageVal = userAge.value
    const cityVal = userCity.value

    const user = {
        id: Number(new Date()),
        name : nameVal,
        age : ageVal,
        city : cityVal
    }

    records.push(user)
    console.log(records); 

}

saveBtn.addEventListener('click', saveBtnHandler)