var sub = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
var nouns = ''; 
var verb = '';
var url = location.href;

function encodeStr(uncoded) {
  uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g,"");
  var coded = "";
  var chr;
  for (var i = uncoded.length - 1; i >= 0; i--) {
    chr = uncoded.charCodeAt(i);
    coded += (chr >= 65 && chr <= 90) ? 
      sub.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) :
      String.fromCharCode(chr); 
    }
  return encodeURIComponent(coded);  
}

function decodeStr(coded) {
  coded = decodeURIComponent(coded);  
  var uncoded = "";
  var chr;
  for (var i = coded.length - 1; i >= 0; i--) {
    chr = coded.charAt(i);
    uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
      String.fromCharCode(65 + 32 + sub.indexOf(chr) % 26) :
      chr; 
    }
  return uncoded;   
} 

function gup( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
  var regexS = "[\\?&]"+name+"=([^&#]*)";  
  var regex = new RegExp( regexS );  
  var results = regex.exec( window.location.href ); 
  if( results == null ) {
    return "";  
  }
  else {
return results[1];
  }
}

$('.reload').click(getWords);

function getWords() {
  $.when(
    $.ajax({
      url: 'http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=4&excludePartOfSpeech=noun-plural,proper-noun-plural,proper-noun-posessive,suffix,family-name,affix&hasDictionaryDef=true&includePartOfSpeech=noun&limit=3&maxLength=22&api_key='+key.API_KEY,
      async: false,
      dataType:"json"
    }),
    $.ajax({
      url: 'http://api.wordnik.com//v4/words.json/randomWord?minCorpusCount=1000&excludePartOfSpeech=noun-plural,proper-noun-plural&hasDictionaryDef=true&minDictionaryCount=3&includePartOfSpeech=noun&api_key='+key.API_KEY,
      async: false,
      dataType:"json"
    })
  ).done(function(noun_data, verb_data) {
    $('#thenewblack').html('');
//  nouns = noun_data[0][0].word.pluralize();
    nouns = noun_data[0][0].word;
	var verb = verb_data[0].word.capitalize();
    $("#thenewblack").append(verb + " is the new " + nouns + ".<br>");
    $('#share').attr('href',location.href.split('?')[0]+'?word='+encodeStr(verb)+'$'+encodeStr(nouns));
  });
  return false;
}

if (gup('word') === "") {
  getWords();
  $('.reload').attr('href',location.origin+location.pathname);
}
else {
  verb = decodeStr(unescape(gup('word')).split('$')[0]);
  nouns = decodeStr(unescape(gup('word')).split('$')[1]);
  $('#thenewblack').text('');
  $("#thenewblack").append(verb + " is the new " + nouns + ".<br>");
  $('.reload').attr('href',location.origin+location.pathname);
  $('#share').attr('href',url);
}
