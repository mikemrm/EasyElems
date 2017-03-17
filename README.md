# EasyElems
Function for quickly creating a deep structure of html elements in javascript.

For more information/examples check out:

http://dev.mrm.land/mikemrm/EasyElems/

# Usage
```javascript
Root Arguments: EasyElems('string', {object/false}, {object/false}, [array/false], 'Link Name');
var sample = EasyElems('tagName', {'variable':'settings'}, {'attribute':'settings'}, [
    ['childTagName'],
    ['child2TagName', false, false, false, 'child2']
]);
```
### Returns the root object element with additional keys
```javascript
sample            - [object HTMLUnknownElement]
sample.childLinks - {child2: child2tagname}
sample.$child2    - [object HTMLUnknownElement]
```
# Children
Children take the same parameters as the main EasyElems function. and are recursive. See Examples below.

# Argument Breakdown
There are 5 arguments that can be passed. 
The first argument is a string with the Tag Name. This would be "div" or "table"
The second argument is an object {'key': 'value'}
 - These are arguments are variables that get set such as
  - EasyElems('div', {'disabled': true}) would result in
   - mydiv.disabled = true;
The third argument is also an object {'key': 'value'}
 - However these are attributes that get set with object.setAttribute('key', value);
The fourth argument is an array of children where the children are also arrays. See below for examples
The fifth argument is a string name that can be used for quick access later. See below for examples

# Examples

## Required
This is all that is needed to create a basic element.
```javascript
var basic = EasyElems('div');
```
## Appending to established elements
Taking the above example and expanding. This is how you would append the new element to an existing one.
```javascript
var basic = EasyElems('div');
document.body.appendChild(basic);
```
## Setting variables
```javascript
var setvars = EasyElems('div', {'innerHTML':'Some Text','id': 'vardiv'});
```
Creates the following
```javascript
var setvars = document.createElement('div');
setvars.innerHTML = 'Some Text';
setvars.id = 'vardiv';
```
## Setting Arguments and classes
Similar to variables this is also an object however they get set with the object.setAttribute function.
The only exception is the class argument. Instead of it being a string, it must be an array.
```javascript
var setattribs = EasyElems('table', {'classList.add()': ['maintable', 'centertable']}, {'cellspacing':0});
```
This creates the following:
```javascript
var setattribs = document.createElement('table');
setattribs.setAttribute('cellspacing': 0);
setattribs.classList.add('maintable', 'centertable');
```
## Adding Children
Children take the same parameters as the main function does except using an array instead. 
This is a recursive loop, so each child can have its own children.
```javascript
var mytable = EasyElems('table', false, false, [
  ['tbody', false, false, [
    ['tr', false, false, [
      ['td', {'innerHTML': 'My Name is Mike'}, {'id': 'nameholder'}],
      ['td', false, false, [
        ['span', {'innerHTML': 'Change Name'}],
        ['input', false, {'type': 'text', 'value': 'Mike'}]
      ]]
    ]],
    ['tr', false, false, [
      ['td'],
      ['td', false, false, [
        ['input', false, {'type':'button', 'value': 'Change'}]
      ]]
    ]]
  ]]
]);
```
## Link Names
When you use EasyElems to create a lot of children you can lose track of how deep elements are.

Taking the above example you could get the value of the text input box with:
```javascript
console.log(mytable.childNodes[0].childNodes[0].childNodes[1].childNodes[1].value);
```
However that is hard to read, so instead you can create links. Below is the same example with links.
```javascript
var mytable = EasyElems('table', false, false, [
  ['tbody', false, false, [
    ['tr', false, false, [
      ['td', {'innerHTML': 'My Name is Mike'}, {'id': 'nameholder'}],
      ['td', false, false, [
        ['span', {'innerHTML': 'Change Name'}],
        ['input', false, {'type': 'text', 'value': 'Mike'}, false, 'inputname']
      ]]
    ]],
    ['tr', false, false, [
      ['td'],
      ['td', false, false, [
        ['input', false, {'type':'button', 'value': 'Change'}, false, 'submitbtn']
      ]]
    ], 'submitrow']
  ]]
]);
```
This will give you the following returned object:
```javascript
mytable                         - [object HTMLTableElement]
mytable.childLinks              - {inputname: input, submitrow: tr}
mytable.$inputname              - <input type="text" value="Mike">
mytable.$submitrow              - <tr>...</tr>
mytable.$submitrow.$submitbtn   - <input type="button" value="Change">
```
Now you can get all the variables and add additional functions to them.
```javascript
mytable.$submitrow.$submitbtn.addEventListener('click', function(){
  console.log('Changing Name to: ' + mytable.$inputname.value);
});
```

## Setting a new key
By default, the system doesn't set a variable that doesn't exist. In order to have it create keys if it doesn't exist, you need to add a ! to the end of the key you want created. If for some reason you want every key to be created, add a second ! to the end.

Here are some examples.

### The following doesn't work:
This is due to the fact that the dataset object doesn't already include a key called link.
```javascript
var sampleLink = EasyElems('input', {type: 'button', 'value': 'Goto google.com', 'dataset.link': 'https://google.com', onclick: function(){ console.log('Going to: ' + this.dataset.link); }});
// <input type="button" value="Goto google.com">
// Going to: undefined
```
### Resolution:
By simply adding an ! after the key link. It will tell EasyElems to create that key, even if it doesn't exist.
```javascript
var sampleLink = EasyElems('input', {type: 'button', 'value': 'Goto google.com', 'dataset.link!': 'https://google.com', onclick: function(){ console.log('Going to: ' + this.dataset.link); }});
// <input type="button" value="Goto google.com" data-link="https://google.com">
// Going to: https://google.com
```

### Other Uses:
If for some reason, you need each key in the list to be created, instead of putting an exclamation point for each key, you can just make the last key have two excalmation points, like so.
```javascript
var sampleElem = EasyElems('div', {'one.plus.two.plus.three': 6});
// console.log(sampleElem.one.plus.two.plus.three);
// Uncaught TypeError: Cannot read property 'plus' of undefined

var sampleElem = EasyElems('div', {'one.plus.two.plus.three!!': 6});
// console.log(sampleElem.one.plus.two.plus.three);
// 6
```