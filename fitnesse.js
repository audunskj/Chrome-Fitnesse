var id = function (el) {
    return document.getElementById(el);
};

function print(value) {
    return value === '' ? '[empty]' : value;
}

function log(field, value, out) {
  out.innerHTML += '| input | ' + field + ' | value | ' + print(value) + ' |';

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

id('fitnesse-form').innerHTML = 'Velg skjema';

function addListener(event) {
  
  document.removeEventListener('click', addListener);
  node = event.target;
  while (node.nodeName != "FORM" && node.parentNode) {
      node = node.parentNode;
  }
  
  if(node.nodeName === "FORM") {
    id('fitnesse-form').innerHTML = 'Skjema valgt';
    
    var w = node;
    var out = id('output');
    console.log(out);

    function logCompleteForm() {  
      console.log("yoyo");
      console.log(out);
      var inputs = w.getElementsByTagName('input');

      for(var i = 0; i<inputs.length; i++) {
        log(inputs[i].id, inputs[i].value, out);
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
  
}

document.addEventListener('click', addListener);
  


