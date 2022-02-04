setTimeout( () => {
    if(db){
        let dbTransaction = db.transaction("video","readonly");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryContainer = document.querySelector(".gallery-container");
            videoResult.forEach( (videoObj) => {
                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class","media-container");
                mediaElement.setAttribute("id",videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElement.innerHTML = `
                <div class="media">
                <video src="${url}" autoplay loop></video>
                </div>
                <div class="download action-btn">Delete</div>
                <div class="delete action-btn">Download</div>
                `;

                galleryContainer.appendChild(mediaElement);
            })
        }
    }
},100);

