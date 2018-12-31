var fileNames;
var lastCounter = 0;
var gradientLoop;
var loadLoop;
var isExpanded = false;

function nextSong(counter){

    //Set title to song name
    document.getElementsByTagName("title")[0].innerHTML = fileNames[counter].substr(0, fileNames[counter].indexOf('.'));

    //nextSong button
    var nexButt = document.getElementById("next");
    var nexCounter = (counter == fileNames.length - 1) ? 0 : counter + 1;
    nexButt.onclick = function(){
        nextSong(nexCounter);
    }

    //Delete button
    var delButt = document.getElementById("delete");
    delButt.onclick = function(){
        deleteCurrentSong(counter);
    }

    //Current song highlight
    var listElements = document.getElementsByClassName("listElement");
    listElements[lastCounter].style.backgroundColor = "inherit";
    listElements[counter].style.backgroundColor = "#e1e1e1";

    var videoWrap = document.getElementById("videoWrap");
    while (videoWrap.firstChild) {
        videoWrap.removeChild(videoWrap.firstChild);
    }
    videoWrap.style.filter = "grayscale(0%)";

    //Clearing timed gradient callback
    clearInterval(gradientLoop);

    //Clearing timed media load callback
    clearInterval(loadLoop);

    //PlayContent initalization
    if(fileNames[counter].match(/mp3$/))
    {
        
        var audio = document.createElement('audio');
        audio.src = "/media/songs/" + fileNames[counter];
        audio.controls = false;
        audio.onended = function() { nextSong(nexCounter); };
        audio.autoplay = true;
        
        var gradientDiv = document.createElement('div');
        gradientDiv.setAttribute("id", "gradient");
        
        videoWrap.appendChild(audio);
        videoWrap.appendChild(gradientDiv);
        
        var fullScreen = document.getElementById("fullScreen");
        fullScreen.onclick = function(){
            expandPlayContent(counter);
        }
        if(isExpanded){
            expandPlayContent(counter);
        }
        
        playedSlider(audio,counter);

        document.getElementById("gradient").onclick = function()
        {
        
            if(cick == false){
                audio.play();
                gradientDiv.style.filter = "grayscale(0%)";
                gradientLoop = setInterval(setcolor,20);
                cick = true;
            }
            else{
                audio.pause();
		        gradientDiv.style.filter = "grayscale(100%)";
                clearInterval(gradientLoop);
                cick = false;
            }
        }
        gradientLoop = setInterval(setcolor,20);
    }
    else if(fileNames[counter].match(/mp4$/))
    {
        var video = document.createElement('video');
        var cick = false;
        video.src = "/media/songs/" + fileNames[counter];
        video.controls = false;
        video.autoplay = true;
        video.onended = function() { nextSong(nexCounter); };

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
        
        videoWrap.appendChild(video);

        playedSlider(video, counter);
    }
    else
    {
        var img = document.createElement('img');
        img.src = "/media/broken.png";
        videoWrap.appendChild(img);
    }
    
    //>_>
    lastCounter = counter;
};

function deleteCurrentSong(counter){
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('DELETE', "/delete/" + fileNames[counter]);
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

        var listElementSlider = document.createElement("div");
        listElementSlider.setAttribute("class","listElementSlider");

        var listElementContent = document.createElement("div");
        listElementContent.setAttribute("class","listElementContent");
        
        var songName = fileNames[i].substr(0, fileNames[i].indexOf('.'));
        if(songName.length > 40){
            songName = songName.substr(0,40) + "...";
        }
        listElementContent.innerHTML += songName;
        
        listElement.appendChild(listElementSlider);
        listElement.appendChild(listElementContent);
        list.appendChild(listElement);
    }
}

function playedSlider(song, counter) {
    var sliders = document.getElementsByClassName("listElementSlider");
    
    sliders[lastCounter].style.width = "0px";

    loadLoop = setInterval(()=>{
        sliders[counter].style.width = (song.currentTime/song.duration)*100 + "%";
    }, 20);
}

function expandPlayContent(counter){
    var gradientDiv = document.getElementById("gradient");
    document.getElementById("playMeta").style.display = "none";
    document.getElementById("next").style.display = "none";
    document.getElementById("add").style.display = "none";
    document.getElementById("delete").style.display = "none";
    
    document.getElementById("playContent").style.height = "100%";
    document.getElementById("playArea").style.height = "calc(100% - 70px)";
    
    var titleDiv = document.createElement("div");
    titleDiv.id = "titleDiv";

    var titleText = document.createElement("span");
    titleText.id = "titleText";
    titleText.innerHTML = fileNames[counter].substr(0, fileNames[counter].indexOf(' '));

    var upPromptDiv = document.createElement("div");
    upPromptDiv.id = "upPromptDiv";
    upPromptDiv.onclick = function() {
        event.stopPropagation();
        document.getElementById("playMeta").style.display = "inherit";
        document.getElementById("next").style.display = "inline-block";
        document.getElementById("add").style.display = "inline-block";
        document.getElementById("delete").style.display = "inherit";
        
        document.getElementById("playContent").style.height = "calc(50% - 70px)";
        document.getElementById("playArea").style.height = "calc(90% - 70px)";

        while (gradientDiv.firstChild) {
            gradientDiv.removeChild(gradientDiv.firstChild);
        }
        isExpanded = false;
    }

    var upPromptIco = document.createElement("i");
    upPromptIco.setAttribute("class","fas fa-chevron-up");
    upPromptDiv.appendChild(upPromptIco);
    titleDiv.appendChild(titleText);
    gradientDiv.appendChild(titleDiv);
    gradientDiv.appendChild(upPromptDiv);

    isExpanded = true;
}

window.onload = function(){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET','/getSongs');
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
