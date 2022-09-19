"use strict"

//global variables
let studentNames;
let firstName;
let middleName;
let lastName;
let imageTag1;
let imageTag2;


//global objects
let allStudents = [];

// create template for student data

const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    studentGender: "",
    studentImg1: "",
    studentImg2: "",
    houseName: "",
    bloodType: "",
    isPrefect: "",
    isInquisitor: "",
    isExpelled: "",
}



document.addEventListener("DOMContentLoaded", event => {
    initialise();
    addButtons();
})


//fetch the data 

async function initialise() {
    await loadNames();
    // await loadBlood();
    prepareObjects();
}

//add eventListeners 

function addButtons() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter))

    document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort))
}

//fetch names 
async function loadNames() {
    const nameData = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    studentNames = await nameData.json();
    prepareObjects(studentNames);

}

//fetch images


//fetch blood status
// async function loadBlood() {
//     const bloodData = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
//     const studentBlood = await bloodData.json();
// }

function prepareObjects(names) {
    allStudents = names.map(prepareData);
    displayList(allStudents);
    // addClick();
}

//clean up the name data 
function prepareData(el) {
    // trim whitespace from edges
    el.fullname = el.fullname.trim();

    //make all letters lower case
    el.fullname = el.fullname.toLowerCase();

    //return nickname betweens ""
    let nickName = el.fullname.substring(el.fullname.indexOf(`"`), el.fullname.lastIndexOf(`"`) + 1)

    //remove nickname from fullname
    el.fullname = el.fullname.replace(nickName, "");

    //tidy up nickname
    nickName = nickName.replaceAll(`"`, "");
    nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1);

    //replace double " " with " ";
    el.fullname = el.fullname.replaceAll("  ", " ");

    //capitalise first letter and first letter after " ";
    let fullNameArr = el.fullname.split(" ");

    for (let i = 0; i < fullNameArr.length; i++) {
        fullNameArr[i] = fullNameArr[i][0].toUpperCase() + fullNameArr[i].substring(1);
    }

    el.fullname = fullNameArr.join(" ");

    //capitalise first letter after "-";
    let fullNameArr2 = el.fullname.split("-");

    for (let i = 0; i < fullNameArr2.length; i++) {
        fullNameArr2[i] = fullNameArr2[i][0].toUpperCase() + fullNameArr2[i].substring(1);
    }

    el.fullname = fullNameArr2.join("-");

    //trim white space from start
    el.fullname = el.fullname.trimStart();

    //tidy up house name 
    el.house = el.house.replaceAll(`"`, "");
    let houseName = el.house.toLowerCase();
    houseName = houseName.trim();
    houseName = houseName.charAt(0).toUpperCase() + houseName.slice(1);

    //tidy up gender
    let studentGender = el.gender.toLowerCase();
    studentGender = studentGender.trim();
    studentGender = studentGender.charAt(0).toUpperCase() + studentGender.slice(1);


    //Separate names and add to variables
    let fullNameArr3 = el.fullname.split(" ");
    if (fullNameArr3.length > 2) {
        firstName = fullNameArr3[0];
        middleName = fullNameArr3[1];
        lastName = fullNameArr3[2];
    } else if (fullNameArr.length <= 2) {
        firstName = fullNameArr3[0];
        middleName = "null";
        lastName = fullNameArr3[1];
    } else if (fullNameArr3.length < 2) {
        firstName = fullNameArr3[0];
        middleName = "null"
        lastName = "null"
    };
    // console.log("Fullname: ", el.fullname);
    // console.log("First Name: ", firstName);
    // console.log("Middle Name: ", middleName);
    // console.log("Last Name: ", lastName);
    // console.log("Nickname: ", nickName);
    // console.log("House: ", houseName);
    // console.log("Gender: ", studentGender);
    // console.log(" ");

    //put variables into newobjects
    const student = Object.create(Student);
    student.firstName = firstName;
    student.lastName = lastName;
    student.middleName = middleName;
    student.nickName = nickName;
    student.house = houseName;
    student.gender = studentGender;

    return student;
}

//filter the data 
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("User selected: ", filter);
    filterList(filter)
}

function filterList(filterBy) {
    let filteredList = allStudents;
    if (filterBy === "Gryffindor") {
        filteredList = allStudents.filter(isGryff);
    } else if (filterBy === "Slytherin") {
        filteredList = allStudents.filter(isSlyth);
    } else if (filterBy === "Ravenclaw") {
        filteredList = allStudents.filter(isRave);
    } else if (filterBy === "Hufflepuff") {
        filteredList = allStudents.filter(isHuff);
    }

    displayList(filteredList)
}
//filter by attending/expelled

//filter by house

function isGryff(item) {
    return item.house === "Gryffindor"
};

function isSlyth(item) {
    return item.house === "Slytherin"
};

function isRave(item) {
    return item.house === "Ravenclaw"
};

function isHuff(item) {
    return item.house === "Hufflepuff"
}

//filter by prefects

//filter by inquisitors


//sort the data
function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    //toggle direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc"
    } else {
        event.target.dataset.sortDirection = "asc"
    }
    console.log("User selected: ", sortBy, sortDir);
    sortList(sortBy, sortDir);
}

//sort by first name / last name / house
function sortList(sortBy, sortDir) {
    let sortedList = allStudents;
    let direction;
    if (sortDir === "desc") {
        direction = 1
    } else {
        direction = -1;
    }


    sortedList = sortedList.sort(sortByProperty)

    function sortByProperty(studentA, studentB) {
        if (studentA[sortBy] < studentB[sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }

    displayList(sortedList)
}


//display the data 

function displayList(students) {

    //clear the list
    document.querySelector("#list tbody").innerHTML = "";

    //build a new list
    students.forEach(displayStudents)
}

function displayStudents(listItem) {
    //create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);


    //set clone data 
    clone.querySelector("[data-field=firstName]").textContent = listItem.firstName;
    clone.querySelector("[data-field=lastName]").textContent = listItem.lastName;
    clone.querySelector("[data-field=houseName]").textContent = listItem.house;

    document.querySelector("#list tbody").appendChild(clone);
}




// open student page 
// function addClick() {
//     document.addEventListener
// }

//display student information


//expel function

//configure pop up

//display pop up


//prefect function

//configure pop up

//display pop up


//hack the system / hackTheSystem()