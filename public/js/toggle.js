window.onload = function() {
    var audio = this.document.getElementsByClassName("radioSub")[0];
    var video = this.document.getElementsByClassName("radioSub")[1];
    var audioRadio = document.getElementById("AudioFileType");
    var videoRadio = document.getElementById("VideoFileType");
    
    function toggle() {
        if(audioRadio.checked){
            video.style.backgroundColor = "#428ae5";
            video.style.color = "#ffffff";
            audio.style.backgroundColor = "#ffffff";
            audio.style.color = "#727272";
            audioRadio.checked = false;
            videoRadio.checked = true;
        }
        else{
            audio.style.backgroundColor = "#428ae5";
            audio.style.color = "#ffffff";
            video.style.backgroundColor = "#ffffff";
            video.style.color = "#727272";
            videoRadio.checked = false;
            audioRadio.checked = true;
        }
    }

    audio.onclick = function() {
        toggle();
    }

    video.onclick = function() {
        toggle();
    }

    toggle();
}