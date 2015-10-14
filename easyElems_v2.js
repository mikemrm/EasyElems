// Author: Mike Mason
// Version: 2

function ee(tag, keys, attribs, children, linkName){
	// Custom Exception method
	function ee_Exception(message){
		this.message = message;
		this.name = 'ee_Exception';
		this.toString = function(){ return this.name + ': ' + this.message; }
		return this;
	}
	// Allows us to recursively call this function
	function runee(tag, keys, attribs, children, linkName){
		// Validate Types
		if(typeof tag != 'string')			throw new ee_Exception('Tag must be string');
		if(keys && typeof keys != 'object')		throw new ee_Exception('Keys must be object');
		if(attribs && typeof attribs != 'object')	throw new ee_Exception('Attribs must be object');
		if(children && typeof children != 'object')	throw new ee_Exception('Children must be array');
		if(linkName && typeof linkName != 'string')	throw new ee_Exception('Link Names must be a string');
		var links = {};
		// Create Element
		var elem = document.createElement(tag);
		if(linkName)
			links[linkName] = elem;
		// Create empty Children array
		var kids = new Array();
		// Loop through keys
		for(var k in keys)
			elem[k] = keys[k];
		if(attribs){
			// Loop through keys
			for(var attrib in attribs){
				// Give special function to 'class' attributes so you can pass arrays to them
				if(attrib == 'class')
					elem.setAttribute(attrib, attribs[attrib].join(' '));
				else
					elem.setAttribute(attrib, attribs[attrib]);
			}
		}
		if(children){
			// Loop through children
			for(var j = 0; j < children.length; j++){
				// Set default child value;
				var child = false;
				// If array is not empty
				if(children[j].length > 0){
					// Run same command for children, and apply all parameters to function
					child = runee.apply(this, children[j]);
				}
				if(child){
					// If child was created, add it to the child array
					kids.push(child);
					// And append it to the root element
					elem.appendChild(child.root);
					for(var link in child.links){
						links[(linkName ? linkName + '_' : '') + link] = child.links[link];
					}
				}
			}
		}
		// Return root element and its children
		return {root: elem, children: kids, links: links};
	}
	// Return master list
	return runee.apply(this, arguments);
}
