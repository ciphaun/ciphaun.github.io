var BASE_URL = "https://quote-book2.herokuapp.com"
//http://localhost:8080
function createPhraseOnServer(phraseName, authorName, phraseScore, phraseType, phraseNotes) {
    var data = "name=" + encodeURIComponent(phraseName);
    data += "&author=" +  encodeURIComponent(authorName);
    data += "&score=" + encodeURIComponent(phraseScore);
    data += "&type=" + encodeURIComponent(phraseType);
    data += "&notes=" + encodeURIComponent(phraseNotes);
    fetch(BASE_URL + "/phrases", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then(function (response) {
        loadPhrasesFromServer();
    });
};

function deletePhraseFromServer(phrase_id) {
    fetch(BASE_URL + '/phrases/${phrase_id}', {
        method: "DELETE",
        credentials: "include"
    }).then(function (response) {
        loadPhrasesFromServer();
    })
}

function updatePhraseOnServer(phrase_id, new_name, new_author, new_score, new_notes, new_type) {
    var data = "name="  + encodeURIComponent(new_name) ; 
    data += "&author=" + encodeURIComponent(new_author); 
    data += "&score=" + encodeURIComponent(new_score);
    data += "&type=" + encodeURIComponent(new_type);
    data += "&notes=" + encodeURIComponent(new_notes);
    
    fetch(BASE_URL + '/phrases/${phrase_id}`,{
        method: "PUT",
        credentials: "include",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then(function (response) {
        loadPhrasesFromServer();
    })
}

function helpLoadPhrasesFromServer(phrase) {
    var phrasesList = document.querySelector("#phrase-list");
    var phraseListItem = document.createElement("li");
    phraseListItem.classList.add("list_item")

    var nameDiv = document.createElement('div');
    nameDiv.innerHTML = '"' + phrase.name + '"' + ' - ' + phrase.author;
    nameDiv.classList.add("phrase-name");

    var scoreDiv = document.createElement('div')
    scoreDiv.innerHTML = phrase.score + '/10'
    
    var notesDiv = document.createElement('div')
    notesDiv.innerHTML = phrase.notes

    var deleteButtonDiv = document.createElement('button');
    deleteButtonDiv.innerHTML = "Delete";
    deleteButtonDiv.onclick = function () {
        if (confirm("Are you sure you want to delete this phrase?")){
        deletePhraseFromServer(phrase.id);
        }
    }

    var editButtonDiv = document.createElement('button');
    editButtonDiv.innerHTML = 'Edit';
    editButtonDiv.onclick = function () {beginEdit(phrase)};

    var listItemButtonsDiv = document.createElement('div');
    listItemButtonsDiv.classList.add("list_buttons_grid_container");
    listItemButtonsDiv.appendChild(deleteButtonDiv);
    listItemButtonsDiv.appendChild(editButtonDiv);

    phraseListItem.appendChild(nameDiv);
    phraseListItem.appendChild(scoreDiv);
    phraseListItem.appendChild(notesDiv);
    phraseListItem.appendChild(listItemButtonsDiv);
    phrasesList.appendChild(phraseListItem);
}

function loadPhrasesFromServer() {
fetch(BASE_URL + "/phrases" , {
    credentials: "include"
    }).then(function (response) {

    document.getElementById('input_fn').value = '';
    document.getElementById('input_ln').value = '';
    document.getElementById('input_email_register').value = '';
    document.getElementById('input_password_register').value = '';

    if (response.status == 401) {
        document.getElementById("mother_grid").style.display = "none";
        document.getElementById("phrase-list").style.display = "none";
        document.getElementById("login_body").style.display = "block";
        document.getElementById('register_body').style.display = 'none';
        logoutButton.style.display = 'none';
        loginButton.style.display = 'block';
        document.getElementById("register_button").style.display = "block";
        return;
    }
    else if (response.status == 200) {
        document.getElementById("mother_grid").style.display = "grid";
        document.getElementById("phrase-list").style.display = "block";
        document.getElementById("login_body").style.display = "none";
        logoutButton.style.display = 'block';
        loginButton.style.display = 'none';
        document.getElementById("register_button").style.display = "none";
       
    }

    response.json().then(function (dataFromServer) {
        phrases = dataFromServer;

        var phrasesList = document.querySelector("#phrase-list");
        console.log("List of phrases: ", phrasesList)
        phrasesList.innerHTML = "";

        phrases.forEach(function (phrase) {
            console.log("one time through the loop:", phrase);
            if(document.querySelector("h1").innerHTML == "Wise Words"){
                if (phrase.type == 1) {
                }
                else {
                    helpLoadPhrasesFromServer(phrase)
                }
            }
            else {
                if(phrase.type == 0) {
                }
                else {
                    helpLoadPhrasesFromServer(phrase)
                }
            }
        }
        );
    }); //unravel json data to javascript (parsing the data)
}); //better, returns a promise of data, has a function to be performed when promise is fulfilled.
};

loadPhrasesFromServer(); 

function beginEdit(phrase) {
    console.log('edit button clicked for', phrase.id)
    var addQuoteButton = document.querySelector("#add_quote_button");

    if(addQuoteButton.style.display == 'none') {
        pass
    }

    else {

    addQuoteButton.style.display = "none";

    var name_fill = phrase.name;
    var author_fill = phrase.author;
    var score_fill = phrase.score;
    var notes_fill = phrase.notes;
    var type_fill = phrase.type;

    var nameInput = document.getElementById('input_text');
    nameInput.value = name_fill;
    var authorInput = document.getElementById('author_input_text')
    authorInput.value = author_fill;
    var notesInput = document.getElementById('notes_input_text')
    notesInput.value = notes_fill;
    var scoreInput = document.getElementById('score_input_number')
    scoreInput.value = score_fill;
    var typeInput = document.getElementById('type_input')
    typeInput.value = type_fill;

    var saveEditsButton = document.createElement("button");
    saveEditsButton.innerHTML = "Save Changes";
    saveEditsButton.classList.add('btn');
    document.querySelector("#buttons_div").appendChild(saveEditsButton)

    saveEditsButton.onclick = function () {
        var new_name = nameInput.value;
        var new_author = authorInput.value;
        var new_score = scoreInput.value;
        var new_notes = notesInput.value;
        var new_type = typeInput.value;
        saveEditsButton.remove();
        addQuoteButton.style.display = 'block';
        updatePhraseOnServer(phrase.id, new_name, new_author, new_score, new_notes, new_type);

        nameInput.value = '';
        authorInput.value = '';
        notesInput.value = '';
        scoreInput.value = '';
    }
    }

}

function createUserOnServer (first_name, last_name, email, password) {
    var data = "first_name=" + encodeURIComponent(first_name);
    data += "&last_name=" +  encodeURIComponent(last_name);
    data += "&email=" +  encodeURIComponent(email);
    data += "&password=" +  encodeURIComponent(password);
    fetch(BASE_URL + "/users", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then(function (response) {
        if(response.status == 201) {
            //document.getElementById("mother_grid").style.display = "grid";
            //document.getElementById("phrase-list").style.display = "block";
            //document.getElementById("register_body").style.display = "none";
            alert('Registration successful! You may now login.');
            loadPhrasesFromServer();
        }
        else if (response.status == 422){
            alert('This email is already in use.')
        }
    });
}

function loginUser (email, password) {
    var data = "email=" + encodeURIComponent(email);
    data += "&password=" +  encodeURIComponent(password);
    fetch(BASE_URL + "/sessions", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then(function (response, dataFromServer) {
        if(response.status == 201) {
            document.getElementById("mother_grid").style.display = "grid";
            document.getElementById("phrase-list").style.display = "block";
            document.getElementById("login_body").style.display = "none";
            logoutButton.style.display = 'block';
            loginButton.style.display = 'none';
            alert('Login successful!');
            loadPhrasesFromServer();
        }
        else {
            alert('login failed!')
        }
    });
}

function logoutUser () {
    fetch(BASE_URL + '/sessions', {
        method: "DELETE",
        credentials: "include"
    }).then(function (response) {
        loadPhrasesFromServer();
    })
}


var addPhraseButton = document.querySelector("#add_quote_button");
console.log("Add phrase button: ", addPhraseButton)

addPhraseButton.onclick = function () {
    var Phrase = document.querySelector("#input_text"); 
    var Author = document.querySelector("#author_input_text");
    var Notes = document.querySelector("#notes_input_text");
    var Score = document.querySelector("#score_input_number");
    var Type = document.querySelector("#type_input");

    if (Author.value == '') {
        console.log("Phrase to be added: ", Phrase, 'Anonymous');
        createPhraseOnServer(Phrase.value, 'Anonymous', Score.value, Type.value, Notes.value);
    }
    else {
        createPhraseOnServer(Phrase.value, Author.value, Score.value, Type.value, Notes.value);
    }

    Phrase.value = '';
    Author.value = '';
    Notes.value = '';
    Score.value = null;
};

var switchPageButton = document.querySelector("#switch_page_button");
switchPageButton.onclick = function () {
    var Heading = document.querySelector("h1")
    if(Heading.innerHTML == "Wise Words") {
        document.querySelector("h1").innerHTML = "Not So Wise Words";
        document.querySelector('#stylesheet').setAttribute('href',"StyleSheet_NotSoWiseWords.css");
        document.querySelector('#type_input').value = 1
    }
    else {
        document.querySelector("h1").innerHTML = "Wise Words";
        document.querySelector('#stylesheet').setAttribute('href', "StyleSheet_WiseWords.css");
        document.querySelector('#type_input').value = 0
    }
    loadPhrasesFromServer();

}

var registerButton = document.querySelector('#register_button');
registerButton.onclick = function() {

    document.getElementById("mother_grid").style.display = "none";
    document.getElementById("phrase-list").style.display = "none";
    document.getElementById("register_body").style.display = "block";
    document.getElementById('login_body').style.display = 'none';

    
};

var confirmRegisterButton = document.getElementById('confirm_registration_button');
    confirmRegisterButton.onclick = function () {

        first_name = document.querySelector("#input_fn").value;
        last_name = document.querySelector("#input_ln").value;
        email = document.querySelector("#input_email_register").value;
        password = document.querySelector("#input_password_register").value;

        var response = createUserOnServer(first_name, last_name, email, password);

        document.getElementById('input_fn').value = '';
        document.getElementById('input_ln').value = '';
        document.getElementById('input_email_register').value = '';
        document.getElementById('input_password_register').value = '';
    };

var loginButton = document.getElementById('login_button');
loginButton.onclick = function () {
    document.getElementById("mother_grid").style.display = "none";
    document.getElementById("phrase-list").style.display = "none";
    document.getElementById("login_body").style.display = "block";
    document.getElementById('register_body').style.display = 'none';
}

var confirmLoginButton = document.getElementById('confirm_login_button');
console.log("here is the confirmLoginBuggon:", confirmLoginButton)
confirmLoginButton.onclick = function () {
    
    email = document.querySelector("#input_email").value;
    password = document.querySelector("#input_password").value;
    loginUser(email, password);
    document.getElementById('input_email').value = '';
    document.getElementById('input_password').value = '';
};

var logoutButton = document.getElementById('logout_button');
logoutButton.onclick = function () {
    logoutUser();
    loadPhrasesFromServer();
};
