var initialize = function() {
	// clear out the host element (kinda janky)
	document.getElementById('host').innerHTML = "";
	
	// box side length (based on css)
	var boxsize = 50;
	
	// we pulled in a whole dep for this :(
	var size = u('.container').size();
	
	// math out how many boxes can fit in the viewport
	var linewidth = Math.ceil(size.width / boxsize);
	var linecount = Math.ceil(size.height / boxsize);
	
	for (var boxnumber = 0; boxnumber < linewidth * linecount; boxnumber++) {
		// create a box
		var div = document.createElement('div');

		div.className = 'box';

		// compute the offset
		div.style.left = '' + boxsize * (boxnumber % linewidth) + 'px';
		div.style.top = '' + boxsize * (Math.floor(boxnumber / linewidth)) + 'px';
		
		div.style.animationDelay = '-' + boxnumber * 4 + 'ms';

		// ... and insert it
		document.getElementById('host').append(div);
	}
}

initialize();
window.addEventListener('resize', initialize);