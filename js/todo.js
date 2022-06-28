var toDo = function(rootElementAll, rootElementActive, rootElementCompleted) {

    //prosledjivanje el. , prikazivanje stavki nase app
    this.rootElementAll = rootElementAll;
    this.rootElementActive = rootElementActive;
    this.rootElementCompleted = rootElementCompleted;

    //kreiranje obj koji predstavljaju stavke:
    let ToDoItem = function (content, date) {
        //generisanje nekog text koda
        this.id = Math.random().toString(36).substring(7);
        this.content = content;
        this.date = date;
        //odredjivanje dal je stavka kompletirana ili nije
        this.completed = false;
    }
     
    //funkcija za kreiranje obj koji povezuju objekte modela i DOM elemente kojima su prikazani
    let ToDoItemViewModel = function (toDoItem, views) {
        this.data = toDoItem;
        this.views = views;

        //serijalizacija samo podataka a ne DOM objekata,cuvanje u local storage samo sta smo uneli
        this.toJSON = function() {
            return this.data;
        }
    }
    //niz koji predstavlja sve objkete nase aplikacije 
    let toDoItems = [];

    //definisanje sablona gde ce se prikazivati, template literals => definisanje viselinijskog stringa koriscenjem ` `
    const TODO_ITEM_TEMPLATE = `
        <div class="todo-item-date">
            <span class="day">Nov</span>
            <span class="month">2020</span>
        </div>
        <div class="todo-item-content">
            <span class="data">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
        </div>
        <span class="delete-btn" title="delete"></span>
    `;
    function generateToDoItemView(toDoItem) {
 
        //first, create root element
        //kreiranje diva, unutar njega bice spakovan sablon 
        let toDoItemRoot = document.createElement('div');
        //na takav element postavljanje klase 
        toDoItemRoot.classList.add("todo-item");
        //postavljanje custom data ID atribut koji ce imati vrednost ID-a stavke
        toDoItemRoot.setAttribute('data-id', toDoItem.id);
        //za njegov innerHTML smo postavili sablon
        toDoItemRoot.innerHTML = TODO_ITEM_TEMPLATE;
     
        //ubacivanje podataka unutar odgovarajucih elemenata:
        toDoItemRoot.getElementsByClassName("day")[0].innerHTML = toDoItem.date.toLocaleString('default', { day: 'numeric' });
        toDoItemRoot.getElementsByClassName("month")[0].innerHTML = toDoItem.date.toLocaleString('default', { month: 'short' });
        var dataElem = toDoItemRoot.getElementsByClassName("data")[0].innerHTML = toDoItem.content;
        toDoItemRoot.getElementsByClassName("delete-btn")[0].setAttribute('data-id', toDoItem.id);
     
        //proveravanje da li je prosledjena stavka kompletirana ili nije
        toDoItemRoot.classList.add(toDoItem.completed ? "completed" : null);
     

        //na ovaj nacin je u potpunosti kreirana objekta reprezentacija jedne stavke, DOM element koji ce predstavljati stavku unutar div elemenata
        //koristimo clone jer mora da bude na 2 liste
        let toDoItemRootCopy = toDoItemRoot.cloneNode(true);
     
        //obavljenje ubacivanje el u odgovarajuce liste
        rootElementAll.append(toDoItemRoot);
        if (toDoItem.completed) {
            rootElementCompleted.append(toDoItemRootCopy);
        } else {
            rootElementActive.append(toDoItemRootCopy);
        }
     
        //kreiranje model Obj,dodavanje u niz obj koji se trenutno koriste
        let toDoItemViewModel = new ToDoItemViewModel(toDoItem, [toDoItemRoot, toDoItemRootCopy]);
        toDoItems.push(toDoItemViewModel);
     
        //generisanje prikaza:
        //register handlers for delete button
        registerDeleteHandlers(toDoItemViewModel);
     
        //register handlers for click on item
        registerClickHandlers(toDoItemViewModel);
     
    }

    //funkcija koja obavlja registraciju logike brisanja stavki:
    function registerDeleteHandlers(toDoViewModel) {
        //prolazak kroz niz i za svaki DOM obj obavlja se pretplata na klik dogadjaj na delete button el
        for (let i = 0; i < toDoViewModel.views.length; i++) {
            toDoViewModel.views[i].getElementsByClassName("delete-btn")[0].onclick = function (e) {
                
                //stopiranje propagiranja dogadjaja 
                e.stopPropagation();
     
                //dolazak do ID stavke koje treba obrisati
                var id = this.dataset.id;
                //pronalazak indexa
                var index = toDoItems.findIndex(item => item.data.id === id);
     
                if (index > -1) {
                    //remove from array and from DOM
                    toDoItems.splice(index, 1);
                    toDoViewModel.views[0].parentNode.removeChild(toDoViewModel.views[0]);
                    toDoViewModel.views[1].parentNode.removeChild(toDoViewModel.views[1]);
                }

                saveToLocalStorage();
     
            }
        }
    }

    //markiranje stavke:
    function registerClickHandlers(toDoItemViewModel) {
 
        for (let i = 0; i < toDoItemViewModel.views.length; i++) {
     
            toDoItemViewModel.views[i].onclick = function (e) {
                var id = this.dataset.id;
                var index = toDoItems.findIndex(item => item.data.id === id);
     
                toDoItemViewModel.data.completed = !toDoItemViewModel.data.completed;
     
     
                if (toDoItemViewModel.data.completed) {
     
                    toDoItemViewModel.views[0].classList.add("completed");
                    toDoItemViewModel.views[1].classList.add("completed");
                                                    rootElementCompleted.appendChild(toDoItemViewModel.views[1]);
     
                } else {
                    toDoItemViewModel.views[0].classList.remove("completed");
                    toDoItemViewModel.views[1].classList.remove("completed");
     
                    rootElementActive.appendChild(toDoItemViewModel.views[1]);
                }
                saveToLocalStorage();
            }
        }
    }

    

    //cuvanje u local storage
    function saveToLocalStorage() {
        localStorage.setItem('todo-data', JSON.stringify(toDoItems));
    }

    //citanje iz local storage i pokazivanje svaki put kad ponovo otvorimo ili refresh app
    function loadFromLocalStorage() {
        //citanje podataka pod kljucem todo-data
        var json = localStorage.getItem('todo-data');
        //ako ne postoji izlazi se iz metode
        if (json === null)
            return;
        //parsiranje dobijenih podataka,funkcija koja utice na proces parsiranja tako sto datumi i vremena ce nasa funkcija da prevede i u obj js date oblik
        let toDoItems = JSON.parse(json, (key, value) => {
            if (key === "date") {
                value = new Date(value);
            }
            return value;
        });
        //proveravanje da li uopste ima nekih zapisa pod kljucem toDoData
        if (toDoItems.length === 0)
            return;
        for (let i = 0; i < toDoItems.length; i++) {
            generateToDoItemView(toDoItems[i]);
        }
    }

    //pozivanje funkcije za citanje podataka iz local storage,pozivanje prilikom prvog pokretanja app:
    loadFromLocalStorage();
    
    //kompletna logika iznad nece biti vidljiva izvan ToDo obj,jednim pozivom se obavlja kreiranje stavki,pristupa svim funckionalnostima
    return {
        add: function(content){
           
            //kreiranje obj nase stavke:
            let toDoItem = new ToDoItem(content, new Date());
            //pokretanje logike i umetanje stavki unutar nase app
            generateToDoItemView(toDoItem);
            saveToLocalStorage();
        }
    }
}