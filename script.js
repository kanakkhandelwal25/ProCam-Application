let video = document.querySelector("video");

let recorderBtnCont = document.querySelector(".record-btn-container");

let recordBtn = document.querySelector(".record-btn");

let captureBtnCont = document.querySelector(".capture-btn-container");

let captureBtn = document.querySelector(".capture-btn");

let recordFlag = false;

let recorder;
let chunks = [];  //Media data in chunks

let constraints = {
    video: true,
    audio: true
}

let transparentColor = "transparent";

// navigator -> global,browser information,window property
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable",(e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e) => {
        //Conversion media chunks data to video
        let blob = new Blob(chunks,{type: "video/mp4"});

        if(db){
            let videoID = shortid();
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id : `video- ${videoID}`,
                blobData:blob
            }
            videoStore.add(videoEntry);
        }
        let videoURL = window.URL.createObjectURL(blob);

        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "stream.mp4";
        // a.click();
    })
});

recordBtn.addEventListener("click",(e) => {
    if (!recorder) return ;

    recordFlag = !recordFlag;

    if(recordFlag){
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
});

captureBtn.addEventListener("click",(e) => {
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    // filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    // tool.drawImage(0,0,canvas.width,canvas.height);

    let imageURL = canvas.toDataURL();

    if(db){
        let imageID = shortid();
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id : `img - ${imageID}`,
            url : imageURL
        }
        imageStore.add(imageEntry);
    }
    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();

});

let timerID;
let counter = 0;    //represents total seconds

let timer = document.querySelector(".timer");

function startTimer(){
    timer.style.display = "block";
    counter = 0;
    function displayTimer(){

        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;

        minutes = (minutes < 10) ? `0${minutes}` : minutes;

        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID = setInterval(displayTimer,1000);
}

function stopTimer(){
    timer.style.display = "none";
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}

//Image Capture

let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        //Get
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
});