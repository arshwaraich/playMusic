var color0 = {r : 255, g : 0, b : 0};
var color1 = {r : 255, g : 0, b : 0};
var color2 = {r : 0, g : 0, b : 255};
var cick = false;

function setcolor()
{
    var box = document.getElementById('gradient');
    box.style.background = "linear-gradient(to bottom right, " + randColor(color1) + ", " + randColor(color2) + ")";
    box.style.width = "100%";
    box.style.height = "100%";
    box.style.margin = "0%";
}

function randColor(colorArr)
{
    shiftColArr(colorArr);
    return "rgb(" + colorArr.r + ", " + colorArr.g + ", " + colorArr.b + ")";
}

function shiftColArr(colorArr)
{
    if(colorArr.r == 0 && colorArr.g != 0)
    {
        if(colorArr.g > colorArr.b)
            ++colorArr.b;
        else
            --colorArr.g;
    }
    else if(colorArr.b == 0)
    {
        if(colorArr.r > colorArr.g)
            ++colorArr.g;
        else
            --colorArr.r;
    } 
    else if(colorArr.g == 0)
    {
        if(colorArr.b > colorArr.r)
            ++colorArr.r;
        else
            --colorArr.b;
    }
}