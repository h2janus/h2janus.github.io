var currentIndex = 0;

function init() {
    startKara();
}

function getLyrics() {
    return [
        {
            first: {
                text: "Nằm nghe sóng vỗ từng lớp xa",
                delays: [
                    { position: 50, delay: 100 },
                    { position: 150, delay: 200 },
                    { position: 210, delay: 200 },
                    { position: 300, delay: 100 }
                ]
            },
            second: {
                text: "Bọt tràn theo từng làn gió đưa",
                delays: [
                    { position: 50, delay: 100 },
                    { position: 150, delay: 200 },
                    { position: 210, delay: 200 },
                    { position: 300, delay: 100 }
                ]
            }
        },
        {
            first: {
                text: "Một vầng trăng sáng đưa tình yêu chúng ta",
                delays: [
                    { position: 50, delay: 100 },
                    { position: 150, delay: 200 },
                    { position: 210, delay: 200 },
                    { position: 300, delay: 100 }
                ]
            },
            second: {
                text: "Vượt ngàn hải lý cũng không xa",
                delays: [
                    { position: 50, delay: 100 },
                    { position: 150, delay: 200 },
                    { position: 210, delay: 200 },
                    { position: 300, delay: 100 }
                ]
            }
        }
    ];
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
    changeWidth(el, 0, maxWidth, lyrics, 0);
}

function colorSecondLine(lyrics) {
    var textEl = document.getElementById("text");
    textEl.innerHTML = document.querySelector("#second_line").innerHTML;
    var maxWidth = (textEl.clientWidth + 10);

    var el = document.getElementById('second_line_color');
    changeWidth(el, 0, maxWidth, lyrics, 0);
}

function changeWidth(el, width, maxWidth, lyrics, delayIndex) {
    var delays = getDelays(el, lyrics, currentIndex);
    if (delays == null) {
        return;
    }
    var delay;
    if (delays[delayIndex]) {
        if (width > delays[delayIndex].position && delayIndex < delays.length - 1) {
            delayIndex++;
        }
        delay = delays[delayIndex].delay;
    } else {
        delay = delays[delays.length - 1].delay;
    }
    if (width < maxWidth) {
        //console.log(width, delay, delayIndex);
        el.style.width = width + "px";
        setTimeout(function () {
            changeWidth(el, width + 10, maxWidth, lyrics, delayIndex);
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

    function getDelays(el, lyrics, index) {
        var delays = null;
        if (el.id === 'first_line_color') {
            if (lyrics[index].first) {
                delays = lyrics[index].first.delays;
            } else {
                console.log("End.");//end of song
            }
        } else {
            if (lyrics[index].second) {
                delays = lyrics[index].second.delays;
            } else {
                console.log("End.");//end of song
            }
        }
        return delays;
    }
}