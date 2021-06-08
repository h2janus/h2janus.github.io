var currentIndex = 0;

function init() {
    var textEl = document.getElementById("text");
    textEl.innerHTML = getLyrics()[0].first.text;
    var maxWidth = (textEl.clientWidth);
    //console.log(maxWidth);
    var arr = textEl.innerHTML.split(" ");
    var ww = 0;
    for(var i=0; i<arr.length; i++) {
        textEl.innerHTML = arr[i];
        ww += textEl.clientWidth + 10;
        console.log(ww);
    }
    //console.log(ww);
    //startKara();
}

function getLyrics() {
    return [
        {
            first: {
                text: "Nằm nghe sóng vỗ từng lớp xa",
                delays: [[0, 95, 10], [96, 201, 10], [202, 315, 10], [316, 373, 100], [374, 473, 100], [474, 700, 200]]
            },
            second: {
                text: "Bọt tràn theo từng làn gió đưa"
            }
        },
        {
            first: {
                text: "Một vầng trăng sáng đưa tình yêu chúng ta"
            },
            second: {
                text: "Vượt ngàn hải lý cũng không xa"
            }
        }
    ];
}

function onClickText(div, event) {
    console.log(div.offsetWidth, event.clientX);
}

function startKara() {
    var lyrics = getLyrics();
    displayFirstLine(lyrics, 0);
    displaySecondLine(lyrics, 0);
    setTimeout(function() {
        colorFirstLine(lyrics);
    }, 1000);
}

function displayFirstLine(lyrics, index) {
    var lr = lyrics[index];
    var text = (lr && lr.first ? lr.first.text : '');
    document.querySelector("#first_line").innerHTML = text;
    document.querySelector("#first_line_color > div").innerHTML = text;
    var el = document.getElementById('first_line_color');
    el.style.width = "0px";
}

function displaySecondLine(lyrics, index) {
    var lr = lyrics[index];
    var text = (lr && lr.second ? lr.second.text : '');
    document.querySelector("#second_line").innerHTML = text;
    document.querySelector("#second_line_color > div").innerHTML = text;
    var el = document.getElementById('second_line_color');
    el.style.width = "0px";
}

function colorFirstLine(lyrics) {
    var textEl = document.getElementById("text");
    textEl.innerHTML = document.querySelector("#first_line").innerHTML;;
    var maxWidth = (textEl.clientWidth + 10);

    var el = document.getElementById('first_line_color');
    changeWidth(el, 0, maxWidth, lyrics);
}

function colorSecondLine(lyrics) {
    var textEl = document.getElementById("text");
    textEl.innerHTML = document.querySelector("#second_line").innerHTML;
    var maxWidth = (textEl.clientWidth + 10);

    var el = document.getElementById('second_line_color');
    changeWidth(el, 0, maxWidth, lyrics);
}

function changeWidth(el, width, maxWidth, lyrics) {
    var delay = getDelay(el, lyrics, width);
    console.log(width, delay);
    if (width < maxWidth) {
        el.style.width = width + "px";
        setTimeout(function () {
            changeWidth(el, width + 10, maxWidth, lyrics);
        }, delay);
    } else {
        if (el.id === 'first_line_color') {
            colorSecondLine(lyrics);
            if (currentIndex + 1 < lyrics.length) {
                setTimeout(function () {
                    displayFirstLine(lyrics, currentIndex + 1);
                }, 600);
            }
        } else if (el.id === 'second_line_color') {
            if (currentIndex + 1 < lyrics.length) {
                currentIndex++;
                colorFirstLine(lyrics);
                setTimeout(function () {
                    displaySecondLine(lyrics, currentIndex);
                }, 600);
            } else {
                console.log('End.');
            }
        }
    }

    function getDelay(el, lyrics, width) {
        var delays = null;
        if (el.id === 'first_line_color') {
            if (lyrics[currentIndex].first) {
                delays = lyrics[currentIndex].first.delays;
            }
        } else {
            if (lyrics[currentIndex].second) {
                delays = lyrics[currentIndex].second.delays;
            }
        }
        if (!delays) {
            return 50;
        }
        var arr;
        var length = delays.length;
        for(var i=0; i<length; i++) {
            arr = delays[i];
            if (width >= arr[0] && width <= arr[1]) {
                break;
            }
        }
        return (arr && arr.length > 2 ? arr[2] : 50);
    }
}