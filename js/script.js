var allItems;
var headerButtons;

//Emitovace se kada je stranica skroz ucitana, logika se izvrsava kad se stranica skroz spremna 
window.addEventListener("load", function () {
    headerButtons = document.getElementsByClassName("header-cell");
    allItems = document.getElementById("all-items");

    for (let i = 0; i < headerButtons.length; i++) {
        //kada se klikne aktivira se funkcija:
        headerButtons[i].onclick = function() {
            // na osnovu id vrednosti izvlacim samo 1 deo stringa metodom substr
            openTab(parseInt(this.id.substr(this.id.length - 1)));
        }
    }
    examineHash();
    //za unos teksta i za add dugme
    var contentInput = document.getElementById("content");
    var addButton = document.getElementById("add-btn");
    //kada se klikne na add button proverava se dal je uneo text i ako jeste onda ce uneti
    addButton.onclick = function () {
        if (contentInput.value !== '') {
            toDoApp.add(contentInput.value);
            contentInput.value = '';
        }
    };

    var allItemsContainer = document.getElementById("all-items-container");
    var activeItemsContainer = document.getElementById("active-items-container");
    var completedItemsContainer = document.getElementById("completed-items-container");

    //kreiranje obj nase ToDo app
    var toDoApp = new toDo(allItemsContainer, activeItemsContainer, completedItemsContainer);
    
});

//ako mi promenimo gore u url-u hash da se i stranica promeni na tu koja treba da bude
window.addEventListener("hashchange", function(e) {
    examineHash();
});
function examineHash() {
    switch (window.location.hash) {
        case '#all-items':
        case "":
            openTab(1);
            break;
        case '#pending-items':
            openTab(2);
            break;
        case '#active-items':
            openTab(3);
            break;
    }
}

//funckija koja prihvata 1 parametar(numericka vrednost br taba koji zelimo da otvorimo);
function openTab(no) {
    //selektujemo sve header-cell elemente i postavljamo klasu inactive
    document.querySelectorAll('.header-cell').forEach(item => {
        item.classList.add("inactive-header-cell");
    });
    //selektovanje elementa koji je korisnik kliknuo i skida se klasa inactive i postaje aktivna
    document.getElementById("tab-" + no).classList.remove("inactive-header-cell");
    switch (no) {
        case 1:
            allItems.style.marginLeft = "0%";
            //naredba koja menja hash url adresu:
            window.location.hash = '#all-items';
            break;
        case 2:
            allItems.style.marginLeft = "-100%";
            window.location.hash = '#pending-items';
            break;
        case 3:
            allItems.style.marginLeft = "-200%";
            window.location.hash = '#active-items';
            break;
    }
}
