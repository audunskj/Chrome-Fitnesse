// This is included and executed in the inspected page
function inserted() {
	console.log('External script attached');
  console.log(document.body);
}
inserted();