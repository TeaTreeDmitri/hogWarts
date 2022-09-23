"use strict"

//global variables
let studentNames;
let firstName;
let middleName;
let lastName;
let imageTag1;
let imageTag2;
let index = 0;

let foundStudent;


const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc"
}


//global objects
let allStudents = [];

let expelledStudents = [];

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
    studentId: ""
}

// *INITIALISE /////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", event => {
    initialise();
})


//fetch the data 

async function initialise() {
    await loadNames();
    // await loadBlood();
    addButtons();
}

//add eventListeners 

function addButtons() {
    // console.log("addButtons()")
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));

    document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort));

}

//fetch names 
async function loadNames() {
    const nameData = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    studentNames = await nameData.json();

    // studentNames.forEach((data) => (data.index = index++))
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

// * DATA PROCESS/ The Model///////////////////////////////////////////////////////////////////////////////////

//clean up the name data 
function prepareData(el) {


    el.index = index++
    
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
    
    //associate images with students
        //BEWARE FORWARD SLASH BEFORE FILE NAME MIGHT BE NECESSARY DEPENDING ON FILE STRUCTURE
        if (lastName) {
            imageTag1 = "/assets/studentImg/" + lastName.toLowerCase() + "_" + firstName.toLowerCase().charAt(0) + ".png";
            imageTag2 = "/assets/studentImg/" + lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
        } else {
            imageTag1 = "/assets/studentImg/default.jpeg"
        }


    //put variables into newobjects
    const student = Object.create(Student);
    student.firstName = firstName;
    student.lastName = lastName;
    student.middleName = middleName;
    student.nickName = nickName;
    student.house = houseName;
    student.gender = studentGender;
    student.studentId = index;
    student.studentImg1 = imageTag1;
    student.studentImg2 = imageTag2;

    return student;
}

//filter the data 
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("User selected: ", filter);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    // let filteredList = allStudents;
    if (settings.filterBy === "Gryffindor") {
        filteredList = allStudents.filter(isGryff);
    } else if (settings.filterBy === "Slytherin") {
        filteredList = allStudents.filter(isSlyth);
    } else if (settings.filterBy === "Ravenclaw") {
        filteredList = allStudents.filter(isRave);
    } else if (settings.filterBy === "Hufflepuff") {
        filteredList = allStudents.filter(isHuff);
    } else if (settings.filterBy === "Expelled") {
        filteredList = expelledStudents;
        displayList(expelledStudents);
    }

    return filteredList;
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
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();

}
//sort by first name / last name / house
function sortList(sortedList) {
    let direction;
    if (settings.sortDir === "desc") {
        direction = 1
    } else {
        direction = -1;
    };

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList;
}

//*DISPLAY FUNCTIONS /The View //////////////////////////////////////////////////////////////////////////////////////////////
//display the data 

function buildList() {
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}

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
    clone.querySelector(".studentRow").id = listItem.studentId;

    //print clone
    document.querySelector("#list tbody").appendChild(clone);
    document.querySelectorAll(".studentRow").forEach(button => button.addEventListener("click", displayStudentPage));
}



// open student page 

function displayStudentPage(event) {
    let selectedId = event.target.parentElement.id;
    selectedId = parseInt(selectedId);
    findStudent(selectedId)
    }

function findStudent(selectedId) {
    console.log("ID of chosen student is", selectedId)
    foundStudent = allStudents.find(hasID);

    function hasID(object) {
        console.log("compare: ", object.studentId);
        console.log("with: ", selectedId);
        if ( object.studentId === selectedId) {
            return object.studentId
        }
    }

    console.log("Student to display is: ", foundStudent);
    populatePage(foundStudent)
}

//display student information

function populatePage(student) {
    console.log("populatePage");

    document.querySelector("#studentTitle").textContent = student.firstName + " " + student.lastName;
    document.querySelector("#studentPic1").style.backgroundImage = "url(" + student.studentImg1 + ")";
    document.querySelector("#studentPic2").style.backgroundImage = "url(" + student.studentImg2 + ")";
    document.querySelector("#houseImg").src = "/assets/otherImg/" + student.house + ".jpg";
    document.querySelector("#spanFirst").textContent = student.firstName;
    //add span for prefect #spanPrefect
    //add span for attending #spanExpel
    //add span for blood type
    //add span for inquisition #spanInquisitor

    //set action event listeners
    document.querySelector("#expelButton").addEventListener("click", expel)

    //set animations and effects
    setGlow(student)
}

function setGlow(student) {
    let box = document.querySelector("#houseImg");
    if (student.house === "Gryffindor") {
        box.style.boxShadow = "rgb(226, 51, 51) 2px 2px 20px 10px";
    } else if (student.house === "Slytherin") {
        box.style.boxShadow = "rgb(136, 225, 136) 2px 2px 20px 10px";
    } else if (student.house === "Ravenclaw") {
        box.style.boxShadow = "rgb(16, 49, 137) 2px 2px 20px 10px";
    } else if (student.house === "Hufflepuff") {
        box.style.boxShadow = "rgb(186, 122, 28) 1px 1px 20px 10px";
    }
    
}


//expel function
// function expel() {
//     allStudents.find(findId)

// }

// function findId(object) {
//     console.log("compare: ", object.studentId);
//     console.log("with: ", foundStudent.studentId - 1);
//     if (object.studentId === foundStudent.studentId - 1) {
//         return object.studentId;
//     }
//     expelRemove(object);

//     function expelRemove(object) {
//         console.log(object);
//     }
// }
function expel() {
    console.log("ID of expelled student is", foundStudent.studentId);
    let expelledStudent = allStudents.find(hasID);

    function hasID(object) {
        console.log("compare: ", object.studentId);
        console.log("with: ", foundStudent.studentId);
        if ( object.studentId === foundStudent.studentId) {
            return object.studentId;
        }
    }

    console.log("Student to display is: ", expelledStudent);
    addExpelled(expelledStudent);
}

function addExpelled(student) {
    expelledStudents.push(student);
    removeExpelled(student)
}

function removeExpelled(student) {
    let removeMe = student.studentId -1
    allStudents.splice(removeMe, 1);
    displayList(allStudents);
}




//displayList



//prefect function

//configure pop up

//display pop up


//hack the system / hackTheSystem()