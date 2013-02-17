// Get all inputs.
var inputs = document.getElementsByTagName('input');

// Keep inputs which might holds mail address.
for (var i=0; i<inputs.length; i++) {
  if(inputs[i].type == "email" || inputs[i].name.match(/e?-?mail/) || inputs[i].id.match(/e?-?mail/)) {
    inputs[i].addEventListener("blur", function(){
      run(this);
    },
    false);
  }
}

/**
 * Runs Kicksend mailcheck.
 */
 function run(input){
  Kicksend.mailcheck.run({
    email: input.value,
    suggested: function(suggestion) {
      chrome.extension.sendMessage({suggestion: suggestion.full});
    },
    empty: function() {
    }
  });
}
