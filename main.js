//todo add inquisitor timout after hacking
// Add expel animations! Big red cross??
//  Configure Error pop ups
//todo add gender profiling in prefects
// add media query 'wizards don't use mobile phones!'
// Add Finch Fetchley picture grab
// add list displays, attending, expelled, houses, displayed
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

let hackFlag1 = false;
let hackFlag2 = false;
let hackFlag3 = false;
let hackFlag4 = false;
let hacked = false;

const modal = document.querySelector("#modal");


const settings = {
    filterBy: "all",
    searchBy: "all",
    sortBy: "name",
    sortDir: "asc"
}


//global objects
let allStudents = [];
let expelledStudents = [];
let hufflepuffPrefects = [];
let gryffindorPrefects = [];
let ravenclawPrefects = [];
let slytherinPrefects = [];

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
    await loadBlood();
    addButtons();
}

//add eventListeners 

function addButtons() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));

    document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort));

    document.addEventListener("keypress", event => {
        const key = event.key.toLocaleLowerCase();
        console.log("key pressed: ", key);
        if (key === "h") {
            hackFlag1 = true;
            determineHack();
        } else if (key === "a") {
            hackFlag2 = true;
            determineHack();
        } else if (key === "c") {
            hackFlag3 = true;
            determineHack();
        } else if (key === "k") {
            hackFlag4 = true;
            determineHack();
        }
    });
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
async function loadBlood() {
    const bloodData = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
    const studentBlood = await bloodData.json();
    assignBlood(studentBlood);
}

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

    if (!lastName) {
        imageTag1 = "/assets/studentImg/default.png"
    } else if (lastName.includes("-")) {
        imageTag1 = "/assets/studentImg/" + lastName.substring(lastName.indexOf("-") + 1, lastName.length).toLowerCase() + "_" + firstName.toLowerCase().charAt(0) + ".png";
    } else if (lastName) {
        imageTag1 = "/assets/studentImg/" + lastName.toLowerCase() + "_" + firstName.toLowerCase().charAt(0) + ".png";
        imageTag2 = "/assets/studentImg/" + lastName.toLowerCase() + "_" + firstName.toLowerCase() + ".png";
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
    student.isPrefect = "";
    student.isInquisitor = "";

    return student;
}

//filter the data 
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    // let filteredList = allStudents;
    if (settings.filterBy === "all") {
        filteredList = allStudents;
    } else if (settings.filterBy === "Prefects") {
        filteredList = allStudents.filter(isPref);
    } else if (settings.filterBy === "Gryffindor") {
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

function isPref(item) {
    return item.isPrefect === "Prefect"
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
    addCounters()
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
    addSearch()

}

//assign Blood Status

function assignBlood(bloodList) {

    const pureList = bloodList.pure;
    const halfList = bloodList.half;
    allStudents.forEach(findBlood)

    function findBlood(student) {
        lastName = student.lastName
        if (pureList.includes(lastName)) {
            student.bloodType = "Pure";
        } else if (halfList.includes(lastName)) {
            student.bloodType = "Half"
        } else student.bloodType = "Muggle"
    }
    
}

// activate search

function addSearch() {
    document.querySelector("#searchBar").addEventListener("keyup", setSearchTerm);
}

function setSearchTerm() {
    let searchTerm = document.querySelector("#searchBar").value.toLowerCase();
    setSearch(searchTerm)
}

function setSearch(term) {
    settings.searchBy = term;
    displayResults();
}

function findMatches(allStuds) {
    allStuds = allStudents.filter(findMe);

    function findMe(student) {
        let stringValues = Object.values(student).toString();
        stringValues = stringValues.toLowerCase();
        return stringValues.includes(settings.searchBy)
    }
    return allStuds
}

function displayResults() {
    const searchedList = findMatches(allStudents);
    displayList(searchedList)
}

//active counters

function addCounters() {
    document.querySelector("#attendingCount").value = allStudents.length;
    document.querySelector("#expelledCount").value = expelledStudents.length;
    //houses
    const huffleCount = allStudents.filter(x => x.house === "Hufflepuff").length;
    document.querySelector("#hufflepuffCount").value = huffleCount;

    const gryffinCount = allStudents.filter(x => x.house === "Gryffindor").length;
    document.querySelector("#gryffindorCount").value = gryffinCount;

    const ravenCount = allStudents.filter(x => x.house === "Ravenclaw").length;
    document.querySelector("#ravenclawCount").value = ravenCount;

    const slytherCount = allStudents.filter(x => x.house === "Slytherin").length;
    document.querySelector("#slytherinCount").value = slytherCount;
}

// open student page 

function displayStudentPage(event) {
    let selectedId = event.target.parentElement.id;
    selectedId = parseInt(selectedId);
    findStudent(selectedId)
}

function findStudent(selectedId) {
    foundStudent = allStudents.find(hasID);

    function hasID(object) {
        if (object.studentId === selectedId) {
            return object.studentId
        }
    }

    populatePage(foundStudent)
}

//display student information

function populatePage(student) {
    document.querySelector(".pageTwoContainer").classList.add("hidden");
    document.querySelector("#studentTitle").textContent = student.firstName + " " + student.lastName;
    document.querySelector("#studentPic1").style.backgroundImage = "url(" + student.studentImg1 + ")";
    document.querySelector("#studentPic2").style.backgroundImage = "url(" + student.studentImg2 + ")";
    document.querySelector("#houseImg").src = "/assets/otherImg/" + student.house + ".jpg";
    addSpans();

    document.querySelector("#prefectButton").textContent = "Make Prefect";


    //add blood
    document.querySelector("#bloodPoint").textContent = student.bloodType + "-Blood";
    if (student.bloodType === "Muggle") {
        document.querySelector("#spanBlood").textContent = "is muggle-born";
    } else if (student.bloodType === "Pure") {
        document.querySelector("#spanBlood").textContent = "is of pure-blood";
    } else {
        document.querySelector("#spanBlood").textContent = "is of half-blood";
    }

    //add prefect
    if (student.isPrefect) {
        document.querySelector("#prefectPoint").textContent = "Is a prefect";
        document.querySelector("#spanPrefect").textContent = "is a prefect,";
    } else {
        document.querySelector("#prefectPoint").textContent = "Not a prefect";
        document.querySelector("#spanPrefect").textContent = "is not a prefect,";

    }

    //add Inquisitor
    if (student.isInquisitor) {
        document.querySelector("#inquisitorPoint").textContent = "Is an Inquisitor";
        document.querySelector("#spanInquisitor").textContent = "and is currently a member of the inquisition";
    } else {
        document.querySelector("#inquisitorPoint").textContent = "Is not an Inquisitor";
        document.querySelector("#spanInquisitor").textContent = "and is not a member of the inquisition";
    }

    if (student.house === "Slytherin" || student.bloodType === "Pure") {
        document.querySelector("#inquisitorButton").classList.remove("hidden");
    } else {
        document.querySelector("#inquisitorButton").classList.add("hidden");
    }

    //add nickName
    if (student.nickName) {
        document.querySelector("#spanNickname").textContent = `"${student.nickName}" ${student.lastName}`;
    }

    //set action event listeners
    document.querySelector("#expelButton").addEventListener("click", expel);
    document.querySelector("#prefectButton").addEventListener("click", makePrefect);
    document.querySelector("#inquisitorButton").addEventListener("click", checkInquisitor);
    //Todo Add expel are you sure?? pop up

    //set animations and effects
    setGlow(student)

    function addSpans() {

        document.querySelector("#spanFirst").textContent = student.firstName;

    }
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

function expel() {
    let expelledStudent = allStudents.find(hasID);
    function hasID(object) {
        if (object.studentId === foundStudent.studentId) {
            return object.studentId;
        }
    }
    addExpelled(expelledStudent);
    const expelledDiv = document.querySelector(".expelledDiv");
    expelledDiv.classList.add("expelledAnim");
    setTimeout(openModal, 1500, foundStudent.firstName, " has been expelled FOREVER!");
    setTimeout(closeExpelled, 3000), expelledDiv;
    setTimeout(populatePage, 3000, allStudents[0]);

    function closeExpelled() {   
        console.log(closeExpelled); 
        expelledDiv.classList.remove("expelledAnim");
        expelledDiv.classList.add("hidden");
    }
}



function addExpelled(student) {
    expelledStudents.push(student);
    removeExpelled(student)
}

function removeExpelled(student) {
    let removeMe = student.studentId - 1
    allStudents.splice(removeMe, 1);
    displayList(allStudents);
}

//hacked Expel


// Prefects

function makePrefect() {
    let studentNumber = foundStudent.studentId - 1;
    let houseArray = [];
    let prefect = allStudents[studentNumber]
    if (foundStudent.house === "Hufflepuff") {
        houseArray = hufflepuffPrefects;
    } else if (foundStudent.house === "Gryffindor") {
        houseArray = gryffindorPrefects;
    } else if (foundStudent.house === "Ravenclaw") {
        houseArray = ravenclawPrefects;
    } else if (foundStudent.house === "Slytherin") {
        houseArray = slytherinPrefects;
    }
    checkPrefects()

    function checkPrefects() {
        if (houseArray.length < 2 && !prefect.isPrefect) {
            houseArray.push(prefect);
            document.querySelector("#prefectButton").textContent = "Fire Prefect";
            prefect.isPrefect = "Prefect"
            document.querySelector("#prefectPoint").textContent = "Is a Prefect";
            document.querySelector("#spanPrefect").textContent = "is a prefect,";
            openModal(foundStudent.firstName , " has been made a prefect!")
        } else if (prefect.isPrefect) {
            houseArray = houseArray.filter(data => data.studentId - 1 !== studentNumber);
            prefect.isPrefect = "";
            document.querySelector("#prefectButton").textContent = "Hire Prefect";
            document.querySelector("#prefectPoint").textContent = "Not a Prefect";
            document.querySelector("#spanPrefect").textContent = "is a not a prefect,";
            openModal(foundStudent.firstName , " is no longer a prefect!")

            if (prefect.house === "Hufflepuff") {
                hufflepuffPrefects = houseArray;
            } else if (foundStudent.house === "Gryffindor") {
                gryffindorPrefects = houseArray;
            } else if (foundStudent.house === "Ravenclaw") {
                ravenclawPrefects = houseArray;
            } else if (foundStudent.house === "Slytherin") {
                slytherinPrefects = houseArray;
            }
        } else {
            prefectPopUp(prefect.house);
        };
    }

}

//Inquisitors

function checkInquisitor() {
    let studentNumber = foundStudent.studentId - 1;
    let newInquisitor = allStudents[studentNumber];
    if (hacked === true && !newInquisitor.isInquisitor) {
        console.log("post hack inquisitor");
        makeInquisitor();
        setTimeout(fireInquisitor, 3000);
    }
    else if (!newInquisitor.isInquisitor) {
        console.log("inquisitor");
        makeInquisitor();
    } else {
        console.log("inquisitor fired");

        fireInquisitor();
        
    }


    function makeInquisitor() {
        //change object to have inquisitor
        newInquisitor.isInquisitor = "Inquisitor";
        //update icon list
        openModal(foundStudent.studentName, " has been made a member of The Inquisitorial Squad!")
        //change text to "Fire Inquisitor"
        document.querySelector("#inquisitorButton").textContent = "Fire Inquisitor";
        populatePage(newInquisitor);

    }

    function fireInquisitor() {
        newInquisitor.isInquisitor = "";
        document.querySelector("#inquisitorButton").textContent = "Make Inquisitor";
        populatePage(newInquisitor);
        openModal(foundStudent.studentName, " is no longer a member of The Inquisitorial Squad!")
    }
}






function prefectPopUp(house) {
    openModal(house , " already has two prefects!")
}

//display pop up


//hack the system / hackTheSystem

//determine hack
function determineHack() {
    if (hackFlag1 && hackFlag2 && hackFlag3 && hackFlag4 && !hacked) {
        hackTheSystem()
        hackFlag1, hackFlag2, hackFlag3, hackFlag4  = false;
        hacked = true
        return true;
    } else {
        console.log("keep hacking cowboy!");
    }
}


function hackTheSystem() {
    console.log("system Hacked!")
    document.querySelector("#hackTheme").play();

    //creat object of Gareth
    const me = Object.create(Student);

    me.firstName = "Gareth";
    me.middleName = "Davies";
    me.lastName = "Davies";
    me.studentGender = "Male";
    me.studentImg1 = "assets/studentImg/davies_g.png";
    me.studentImg2 = "";
    me.house = "Gryffindor";
    me.bloodType = "Muggle";
    me.isPrefect = "";
    me.isInquisitor = "";
    me.studentId = 35;

    allStudents.unshift(me);
    displayList(allStudents);
    populatePage(me);
    hackTheBlood()
    hackTheView()
}

function hackTheBlood(){
    const bloodArray = ["Muggle", "Half"];
    allStudents.forEach((student) => {
        if (student.bloodType === "Pure") {
            const rnd = Math.floor(Math.random()*2);
            student.bloodType = bloodArray[rnd];
        } else {
            student.bloodType = "Pure"
        }
    })
}

function hackTheView() {
    document.querySelector(".backGround").style.backgroundImage = "none";
    document.querySelector(".backGround").style.backgroundImage = "url(assets/otherImg/matrix.gif)";
    document.querySelector("#spanFirst").textContent = "I've got you now Dumbledore you old bag! Muahahah!!! Now I control the whole school, no one can be expelled, and you won't be able to continue your terrible blood profiling";

    document.querySelector("#spanNickname").textContent = "";
    document.querySelector("#spanPrefect").textContent = "";
    document.querySelector("#spanBlood").textContent = "";
    document.querySelector("#spanInquisitor").textContent = "";
    hackElements();
}

function hackElements() {
    hackH1()
    hackH2()
    hackSpans()
    hackPictures()
    hackPages()
    hackExpel();
}

function hackH1() {
    let allText = document.querySelector("h1");
    allText.style.fontFamily = "Comic Sans MS, serif";
    allText.style.fontSize = "45px";
    allText.style.color = "Fuchsia";
    allText.textContent = allText.textContent.toLowerCase();
}

function hackH2() {
    let allText = document.querySelectorAll(".bodyText");
    allText.forEach((el) => {
        el.style.fontFamily = "Comic Sans MS, serif";
        el.style.color = "lightpink";
        el.textContent = el.textContent.toLowerCase();
    });
};

function hackSpans() {
    let allText = document.querySelectorAll("span");
    
    allText.forEach((el) => {
        el.style.fontFamily = "Comic Sans MS, serif";
        el.style.fontSize = "15px";
        el.style.lineHeight = "5px";
        el.style.color = "hotpink";
        el.textContent = el.textContent.toLowerCase();
    });

};

function hackPictures() {
    document.querySelector(".studentPic").style.backgroundSize = "cover";
    document.querySelector(".studentPic").style.boxShadow = " 2px 2px 20px 20px hotpink";
    document.querySelector(".studentPic").classList.add("throbbing");
}

function hackPages() {
    const page1 = document.querySelector(".pageOne");
    const page2 = document.querySelector(".pageTwo");
    const pageCard = document.querySelector(".studentCard");
    page1.style.backgroundColor = "mistyrose";
    page1.style.borderColor = "Fuchsia";
    page2.style.borderColor = "Fuchsia";
    page2.style.backgroundColor = "mistyrose";
    pageCard.style.backgroundColor = "mistyrose";
}

function hackExpel() {
    document.querySelector("#expelButton").classList.add("hidden");
    document.querySelector("#fakeExpelButton").classList.remove("hidden");
    document.querySelector("#fakeExpelButton").addEventListener("click", expelFail)
}

function expelFail() {
    console.log(modal);
    openModal("you can't expel US ANYMORE");

}


function openModal(content1, content2) {
    const modal = document.querySelector("#modal");
    modal.classList.remove("hidden");
    modal.classList.add("grid");
    modal.classList.add("pointer");
    if (content2) {
    document.querySelector("#modalText").textContent = content1 + content2;
    } else {
    document.querySelector("#modalText").textContent = content1;
    }
    modal.addEventListener("click", closeModal);
    setTimeout(closeModal, 1500);
}

function closeModal() {
    document.querySelector("#modal").classList.remove("grid");
    document.querySelector("#modal").classList.add("hidden");
}




// const Student = {
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     nickName: "",
//     studentGender: "",
//     studentImg1: "",
//     studentImg2: "",
//     houseName: "",
//     bloodType: "",
//     isPrefect: "",
//     isInquisitor: "",
//     isExpelled: "",
//     studentId: ""
// }
//push to allStudents

//displayList(allStudents)