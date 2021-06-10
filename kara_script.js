var currentIndex = 0;

function init() {
    //initDelays();
    startKara();
    //initFileChooser();
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
            var sleep = getSleep(lyrics, 'first');
            setTimeout(function() {
                finishFirstLine(lyrics);
            }, sleep);
        } else if (el.id === 'second_line_color') {
          var sleep = getSleep(lyrics, 'second');
            setTimeout(function() {
                finishSecondLine(lyrics);
            }, sleep);
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

function initDelays() {
  var lyrics = getLyrics();
  lyrics.forEach(function(lr) {
      lr.first.delays = createDelays(lr.first.text);
      lr.second.delays = createDelays(lr.second.text);
      //console.log(JSON.stringify(lr));
  });
  console.log(JSON.stringify(lyrics));
}

function createDelays(text) {
    var textEl = document.getElementById("text");
    textEl.innerHTML = text;
    //var maxWidth = (textEl.clientWidth);
    //console.log(maxWidth);
    var arr = textEl.innerHTML.split(" ");
    var ww = 0;
    var p = [-1];
    for(var i=0; i<arr.length; i++) {
        textEl.innerHTML = arr[i];
        ww += textEl.clientWidth + 10;
        p.push(ww);
    }
    var length = p.length - 1;
    p[length] = 2000;//max width
    var delays = [];
    for(var i=0; i<length; i++) {
        delays.push([p[i] + 1, p[i+1], 50]);
    }
    //console.log(delays);
    return delays;
}

function finishFirstLine(lyrics) {
  colorSecondLine(lyrics);
  if (currentIndex + 1 < lyrics.length) {
      setTimeout(function () {
          displayFirstLine(lyrics, currentIndex + 1);
      }, 600);
  }
}

function finishSecondLine(lyrics) {
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

function getSleep(lyrics, name) {
  var sleep = 0;
  if (lyrics[currentIndex]) {
      var lr = lyrics[currentIndex][name];
      if (lr && lr.sleep) {
          sleep = lr.sleep;
          console.log(name, '-> sleep:', sleep);
      }
  }
  return sleep;
}

function initFileChooser() {
    document.getElementById('file').onchange = function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function(progressEvent) {
            //console.log(this.result);// Entire file
            var lines = this.result.split('\n');// By lines
            var texts = [];
            var str;
            for(var line = 0; line < lines.length; line++){
                str = lines[line].trim();
                if (str.length > 0) {
                  texts.push(str);
                }
            }
            toJson(texts);
        };
        reader.readAsText(file);
    };
}

function toJson(texts) {
    var length = texts.length;
    var lyrics = [];
    var lr;
    for(var i=0; i<length-1;) {
        lr = {
          first: {text: texts[i]}
        };
        lr.first.delays = createDelays(lr.first.text);
        if (i + 1 < length) {
          lr.second = {text: texts[i + 1]};
          lr.second.delays = createDelays(lr.second.text);
        }
        lyrics.push(lr);
        i += 2;
    }
    if (i < length) {
        lr = {
          first: {text: texts[i]}
        };
        lr.first.delays = createDelays(lr.first.text);
        lyrics.push(lr);
    }
    console.log(JSON.stringify(lyrics));
}