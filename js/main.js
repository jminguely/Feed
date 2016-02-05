var news = {};
var charCodeRange = {
  start: 0,
  end: 127
};
var ticker;

var apiKey = "505576aa8af5d22828cffd41fb262d46:5:69846818";

var charList = {};

var charSize = 340;

$(document).ready(function(){

  for (var i = 0; i < charSize; i++) {
    charList[i] = [];
    charList[i]['current'] = 0;
    charList[i]['target'] = 0;
    $( "<span id='" + i + "'></span>").appendTo( "#container" );
  }

  // $.getJSON( "data/data.json", function( data ) {
  //   news = data['news'];
  // });


  var term = "berlin";
  $.get("http://api.nytimes.com/svc/search/v2/articlesearch.json", {
		"api-key":apiKey,
		sort:"oldest",
		fq:"headline:(\""+term+"\")",
		fl:"headline,snippet,multimedia,pub_date"}, function(res) {
    for (var i = 0; i < res.response.docs.length; i++) {
      news[i] = {
        id: i,
        content: res.response.docs[i].headline.main
      };
    }
    changeNews(0);

	}, "JSON");


});

function changeNews(id){
  text = news[id]['content'];


  arrayChars = text.split("");

  for (var i = 0; i < charSize; i++) {
    if(arrayChars[i] !== undefined){
      charList[i]['target'] = arrayChars[i].charCodeAt(0);
    } else{
      charList[i]['target'] = 0;
    }
  }

}

function fixedCharCodeAt (str, idx) {
    // ex. fixedCharCodeAt ('\uD800\uDC00', 0); // 65536
    // ex. fixedCharCodeAt ('\uD800\uDC00', 1); // false
    idx = idx || 0;
    var code = str.charCodeAt(idx);
    var hi, low;

    // High surrogate (could change last hex to 0xDB7F to treat high
    // private surrogates as single characters)
    if (0xD800 <= code && code <= 0xDBFF) {
        hi = code;
        low = str.charCodeAt(idx+1);
        if (isNaN(low)) {
            throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
        }
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        // We return false to allow loops to skip this iteration since should have
        // already handled high surrogate above in the previous iteration
        return false;
        /*hi = str.charCodeAt(idx-1);
        low = code;
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;*/
    }
    return code;
}



function draw(){
  for (var i = 0; i < charSize; i++) {
    if(charList[i] !== undefined){

      if(charList[i]['current'] !== charList[i]['target']){
        if(charList[i]['current'] < charList[i]['target']){
          charList[i]['current']++;
        } else {
          charList[i]['current']--;
        }
        $('#'+i).attr('class', 'loading').text(String.fromCharCode(charList[i]['current']));
      }else{
        $('#'+i).attr('class', 'done');

      }
    }
  }
  requestAnimationFrame(draw);
}

draw();

var newMaintenant= 1;
setInterval(function(){
  changeNews(newMaintenant);
  newMaintenant++;
  if(newMaintenant>=10) newMaintenant = 0;
}, 10000);
