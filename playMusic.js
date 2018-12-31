const fs = require('fs');
const exec = require('child_process').exec;
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();

//setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')));

const HTTP_PORT = 8082;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);

    var obj = {table: []}; 
    obj.table.push({ "stdout": '',
                "stderr":''});

    json = JSON.stringify(obj);
    fs.writeFile('./logFile.json', json, 'utf8', (err)=>{ if(err) {console.log(err)}});
}

function logger(standardOut, standardErr){
    fs.readFile('./logFile.json', 'utf8', (err, data)=>{
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        obj.table.push({ "stdout": standardOut,
                "stderr":standardErr});
        json = JSON.stringify(obj);
        fs.writeFile('logFile.json', json, 'utf8', (err)=>{console.log(err)}); 
    }});
}

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'/public/search.html'));
});

app.get('/player', (req,res)=>{
    res.sendFile(path.join(__dirname,'/public/player.html'));
});

app.get('/getSongs', (req,res)=>{
    fs.readdir('./public/media/songs',(err, fileNames)=>{
        if(!err){
            res.json(fileNames);
        }
        else{
            console.log('FileRead Failed');
        }
    });
});

app.post('/addSong', (req,res)=>{
    var fileType = req.body.fileType;
    var url = req.body.songURL;
    var songName = req.body.songName;

    if(url.match(/youtube.com/)){

        if(songName == ""){
            songName = "%(title)s.%(ext)s";
        }

        if(fileType == "Video"){

            var childProcess = exec('youtube-dl -f \'bestvideo[ext=mp4]+bestaudio[ext=m4a]\' -o \'./public/media/songs/' + songName + '\' ' + url, (error, stdout, stderr)=> {
                logger(stdout, stderr);

                if (error !== null) {
                console.log('exec error: ' + error);
                }
            });

            res.redirect('./player');
        }
        else if(fileType == "Audio"){
            
            var childProcess = exec('youtube-dl --extract-audio --audio-format mp3 -o \'./public/media/songs/' + songName + '.%(ext)s\' ' + url, (error, stdout, stderr)=> {
                logger(stdout, stderr);
                
                if (error !== null) {
                console.log('exec error: ' + error);
                }
            });

            res.redirect('./player');
        }
    }
    else if(url.match(/.mp4$/)){
        var childProcess = exec('wget -O \'./public/media/songs/' + songName + '.mp4\' ' + url, (error, stdout, stderr)=> {
            
                        logger(stdout, stderr);
                        
                        if (error !== null) {
                        console.log('exec error: ' + error);
                        }
                    });

        if(fileType == "Audio"){
            var childProcess = exec('ffmpeg -i \'./public/media/songs/' + songName + '.mp4\' \'./public/media/songs/' + songName  + '.mp3\'', (error, stdout, stderr)=> {

                logger(stdout, stderr);
                        
                if (error !== null) {
                console.log('exec error: ' + error);
                }
            });
        }
        
        res.redirect('/addSong');
    }
    else{
        res.send('Enter a valid link!');
    }
});

app.delete('/delete/:file', function(req,res)
{
    fs.unlink('./public/media/songs/' + req.params.file, (err) => {
        if (err) throw err;
        res.send('File deleted successfully!');
    })
});

app.use((req,res) => {
    res.send('404 not found : ' + req.get('host') + req.originalUrl);
});

app.listen(HTTP_PORT, onHttpStart);
