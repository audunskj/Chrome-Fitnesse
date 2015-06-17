var id = function (el) {
    return document.getElementById(el);
};

function print(value) {
    return value === '' ? '[empty]' : value;
}

function log(field, value, errorMsg) {
    out.innerHTML += '| input | ' + field + ' | value | ' + print(value) + ' |';

    if (errorMsg) {
        out.innerHTML += ' error | ' + errorMsg + ' |';
    }
    
    out.innerHTML += '<br>';
}

if(id('output') === null) {
  var elemDiv = document.createElement('div');
  elemDiv.setAttribute("id", "output");
  
  var infoDiv = document.createElement('div');
  infoDiv.setAttribute('id', 'fitnesse-form');
  elemDiv.appendChild(infoDiv);
  
  document.body.appendChild(elemDiv);
}

document.addEventListener('click', function(event) {

  node = event.target;
  while (node.nodeName != "FORM" && node.parentNode) {
      node = node.parentNode;
  }
  
  if(node.nodeName === "FORM") {
    id('fitnesse-form').innerHTML = 'Skjema valgt';
    
    var w = node;
    var out = id('output');



    w.addEventListener('change', function (evt) {
        var t = evt.target;

        log(t.id, t.value);
    });

    function logCompleteForm() {  
      console.log("yoyo");
      var inputs = w.getElementsByTagName('input');

      for(var i = 0; i<inputs.length; i++) {
        console.log(inputs[i].value); 
      }
    }

    w.addEventListener('submit', function (evt) {
        evt.preventDefault();

        logCompleteForm();
    });
  } else {
    id('fitnesse-form').innerHTML = 'Skjema ikke funnet'; 
  }
  
  document.removeEventListener('click');
});                           
  


