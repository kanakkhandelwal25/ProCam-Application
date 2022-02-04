//Open a database
//Create ObjectStore(can only be created in upgradeneeded)

let db;

let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success" , (e) => {
    db = openRequest.result;
});

openRequest.addEventListener("error", (e) => {

});

openRequest.addEventListener("upgradeneeded",(e) => {
    //Initial DB Creation
    db = openRequest.result;

    db.createObjectStore("video" , {keyPath : "id"});
    db.createObjectStore("image" , {keyPath : "id"});
});