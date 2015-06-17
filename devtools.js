// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
//document.getElementById("yo").innerHTML = "yoyoyo";
//console.log("ok");
chrome.devtools.panels.create("Fitnesse", "toast.png", "panel.html", function(panel) {});