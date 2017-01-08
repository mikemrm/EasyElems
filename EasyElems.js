// Author: Mike Mason
// Version: 3
/*
	Function: EasyElems

		A function to make creating html elements easier.

	Parameters:

		HTML Tag		- An HTML Tag or text for a text node. *Required*
		Element Keys	- Items to be set via element.key
		Attributes		- Items to be set via key="value"
		Children		- An array of children with the same argument structure
		Link Name		- A child reference name. *Child arguments only*

	Usage:

		*Input*

		> var sample = EasyElems('div', {'classList.add()': 'login-holder'}, false, [
		> 	['form', false, false, [
		> 		['div', false, false, [
		> 			['span', {innerHTML: 'Username'}, false, false, 'title'],
		> 			['input', {type: 'text'}, false, false, 'input']
		> 		], 'username'],
		> 		['div', false, false, [
		> 			['span', {innerHTML: 'Password'}, false, false, 'title'],
		> 			['input', {type: 'password'}, false, false, 'input']
		> 		], 'password']
		> 	]],
		> 	['div', false, false, [
		> 		['text', {text: 'Check an option:'}],
		> 		['input', {type: 'checkbox', 'value': 1}],
		> 		['input', {type: 'checkbox', 'value': 2}],
		> 		['input', {type: 'checkbox', 'value': 3}],
		> 		['input', {type: 'checkbox', 'value': 4}],
		> 		['input', {type: 'checkbox', 'value': 5}]
		> 	], 'options[]']
		> ]);

		*Output*

		> sample					- [object HTMLDivElement]
		> sample.childLinks			- {username: div, password: div, options: div}
		> sample.$username			- [object HTMLDivElement]
		> sample.$username.$title	- [object HTMLDivElement]
		> sample.$username.$input	- [object HTMLInputElement]
		> ...
	
	Wiki:

		<https://github.com/mikemrm/Cookbook/wiki/EasyElems_js>
*/

function EasyElems(tag, keys, attribs, children){
	function EasyElems_Exception(message){
		this.message = message;
		this.name = 'EasyElems_Exception';
		EasyElems_Exception.prototype.toString = function(){ return this.name + ': ' + this.message; };
	}
	// Used to traverse objects
	function getPath(obj, path){
		var directives = path.split('.');
		var previous_directive = null;
		var current_directive = obj;
		var dir;
		for(var j = 0; j < directives.length; j++){
			dir = directives[j];
			if(current_directive[dir] != undefined){
				previous_directive = current_directive;
				current_directive = current_directive[dir];
			} else
				return null;
			
		}
		return {parent: previous_directive, child: dir};
	}
	function Execute(_level, tag, keys, attribs, children, linkName){
		// Validate inputs
		if(!tag || tag.constructor != String)			throw new EasyElems_Exception('Tag must be a string near level ' + _level + '.');
		if(keys && keys.constructor != Object)			throw new EasyElems_Exception('Keys must be an Object near level ' + _level + '.');
		if(attribs && attribs.constructor != Object)	throw new EasyElems_Exception('Attributes must be an Object near level ' + _level + '.');
		if(children && children.constructor != Array)	throw new EasyElems_Exception('Children must be an Array near level ' + _level + '.');
		if(linkName && linkName.constructor != String)	throw new EasyElems_Exception('Link name must be a String near level ' + _level + '.');

		var elem;
		// If the tag is text and it has a key called text, we can assume they want a text node.
		if(tag == 'text' && keys.hasOwnProperty('text')){
			elem = document.createTextNode(keys.text);
		} else
			elem = document.createElement(tag);

		// If the link name ends with [] we want its child list to be an array.
		var isArray = false;
		if(linkName){
			if(linkName.indexOf('[]') == linkName.length - 2){
				isArray = true;
				linkName = linkName.substr(0, linkName.length - 2);
			}
			if(!linkName.match(/^[a-z][a-z0-9_\-]*$/i))
				throw new EasyElems_Exception('Invalid link name near level ' + _level + '.');
		}
		elem.linkName = (linkName ? linkName : undefined);
		elem.childLinks = (isArray ? [] : {});

		// Attributes set by element.key = value or element.function(value)
		if(keys){
			for(var k in keys){
				var value = keys[k];
				// Check if the key is relating to a function.
				var attribIsFunction = k.indexOf('()') == k.length - 2;
				if(attribIsFunction)
					k = k.substr(0, k.length - 2);
				var attribute = getPath(elem, k);
				// Handle functions calls
				if(attribIsFunction){
					if(!attribute)
						throw new EasyElems_Exception('Unable to locate attribute ' + k + ' near level ' + _level + '.');
					// Make sure that the attribute is in fact a function
					if(attribute.parent[attribute.child].constructor == Function){
						// If the value is an array, then we will assume the items are arguments.
						if(value.constructor == Array)
							attribute.parent[attribute.child].apply(attribute.parent, value);
						else // If not, then we will just pass the variable along.
							attribute.parent[attribute.child].call(attribute.parent, value);
					} else
						throw new EasyElems_Exception(k + ' is not a function near level ' + _level + '.');
				} else if(attribute) // If it is not a function but was found we set it here.
					attribute.parent[attribute.child] = value;
				else elem[k] = value; // If no existing value was found, then we will create a new key.
			}
		}

		// Attributes that should be set like colspacing="0"
		if(attribs){
			for(var attrib in attribs){
				elem.setAttribute(attrib, attribs[attrib]);
			}
		}

		// Process children if provided
		if(children){
			for(var j = 0; j < children.length; j++){
				var child = false;
				if(children[j].length > 0){
					if(children[j].length < 1 || children[j].length > 5)
						throw new EasyElems_Exception('Child index ' + j + ': Invalid argument count near level ' + _level + '.');
					children[j].unshift(_level + 1);
					child = Execute.apply(this, children[j]);
				}
				if(child){
					// Add child to parent
					elem.appendChild(child);

					// If the parent wanted its children in a list, it will push to the array
					if(isArray)
						elem.childLinks.push(child);
					if(child.linkName){
						// If not and it has a name, it will add it's name to the list.
						if(!isArray){
							elem.childLinks[child.linkName] = child;
							elem['$' + child.linkName] = child;
						}
					} else if(child.childLinks.constructor == Object){
						// If the parent doesn't have a name,
						// then it appends all children's children to the parent's list.
						for(var childName in child.childLinks){
							elem.childLinks[childName] = child.childLinks[childName];
							elem['$' + childName] = child.childLinks[childName];
						}
					}
				}
			}
		}
		return elem;
	}

	if(tag && tag.constructor == Array){
		var results = [];
		for(var j = 0; j < arguments.length; j++){
			if(arguments[j].length < 1 || arguments[j].length > 5)
				throw new EasyElems_Exception('Argument index ' + j + ': Invalid argument count.');
			var args = Array.prototype.slice.call(arguments[j]);
			args.unshift(0);
			results.push(Execute.apply(this, args));
		}
		return results;
	} else {
		if(arguments.length > 5)
			throw new EasyElems_Exception('Invalid argument count.');
		return Execute.call(this, 0, tag, keys, attribs, children);
	}
}