var fileNames;
var lastCounter = 0;
var loop;

function nextSong(counter){

    var nexButt = document.getElementById("next");
    var nexCounter = (counter == fileNames.length - 1) ? 0 : counter + 1;
    nexButt.onclick = function(){
        nextSong(nexCounter);
    }

    var delButt = document.getElementById("delete");
    delButt.onclick = function(){
        deleteCurrentSong(counter);
    }

    var listElements = document.getElementsByClassName("listElement");
    listElements[lastCounter].style.backgroundColor = "inherit";
    listElements[counter].style.backgroundColor = "#e1e1e1";

    var videoWrap = document.getElementById("videoWrap");
    videoWrap.innerHTML = '';
    videoWrap.style.filter = "grayscale(0%)";

    clearInterval(loop);

    if(fileNames[counter].match(/mp3$/))
    {
        var fullScreen = document.getElementById("fullScreen");
        
        fullScreen.style.display = "none";

        var audio = document.createElement('audio');
        audio.src = "/music/media/songs/" + fileNames[counter];
        audio.controls = false;
        audio.onended = function() { nextSong(counter + 1); };
        audio.autoplay = true;

        var gradientDiv = document.createElement('div');
        gradientDiv.setAttribute("id", "gradient");
        
        videoWrap.appendChild(audio);
        videoWrap.appendChild(gradientDiv);

        document.getElementById("gradient").onclick = function()
        {
        
            if(cick == false){
                audio.play();
		        gradientDiv.style.filter = "grayscale(0%)";
                cick = true;
            }
            else{
                audio.pause();
		        gradientDiv.style.filter = "grayscale(100%)";
                cick = false;
            }
        }
        loop = setInterval(setcolor,20);
    }
    else if(fileNames[counter].match(/mp4$/))
    {
        var video = document.createElement('video');
        var cick = false;
        video.src = "/music/media/songs/" + fileNames[counter];
        video.controls = false;
        video.autoplay = true;
        video.onended = function() { nextSong(counter + 1); };

        video.onclick = function()
        {
            if(cick == false)
            {
                video.play();
		    videoWrap.style.filter = "grayscale(0%)";
                cick = true;
            }
            else
            {
                video.pause();
		    videoWrap.style.filter = "grayscale(100%)";
                cick = false;
            }
        }

        var fullScreen = document.getElementById("fullScreen");
        
        fullScreen.onclick = function()
        {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) { /* Firefox */
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                video.webkitRequestFullscreen();
            }
        }
        fullScreen.style.display = "inherit";

        videoWrap.appendChild(video);
    }
    else
    {
        var img = document.createElement('img');
        img.src = "/music/media/broken.png";
        videoWrap.appendChild(img);
    }
    
    lastCounter = counter;
};

function deleteCurrentSong(counter){
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('DELETE', "/music/delete/" + fileNames[counter]);
    httpRequest.send();
    document.getElementsByTagName('html')[0].style.cursor = "progress";
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                console.log(fileNames[counter] + ' deleted!');
                window.location.reload();
            }
            else {
                console.log('Delete failed!');
            }
        }
    };
}

function populateList(){
    var list = document.getElementById("list");

    for(var i = 0; i < fileNames.length; ++i)
    {
        var listElement = document.createElement("div");
        listElement.setAttribute("class","listElement");
        listElement.setAttribute("onclick","nextSong(" + i + ")");

        listElement.innerHTML += fileNames[i].substr(0, fileNames[i].indexOf('.'));
        list.appendChild(listElement);
    }
}

window.onload = function(){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET','/music/getSongs');
        httpRequest.send();
        
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    fileNames = JSON.parse(httpRequest.responseText);
                    populateList();
                    nextSong(0);
                }
            }
        }
    };
