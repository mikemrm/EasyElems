# EasyElems
Function for quickly creating a deep structure of html elements in javascript.

For more information/examples check out:

http://dev.mrm.land/mikemrm/EasyElems/

# Usage
```
Root Arguments: EasyElems('string', {object/false}, {object/false}, [array/false], 'Link Name');
var sample = EasyElems('tagName', {'variable':'settings'}, {'attribute':'settings'}, [
    ['childTagName'],
    ['child2TagName', false, false, false, 'child2']
]);
```
### Returns the root object element with additional keys
```
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
```
var basic = EasyElems('div');
```
## Appending to established elements
Taking the above example and expanding. This is how you would append the new element to an existing one.
```
var basic = EasyElems('div');
document.body.appendChild(basic);
```
## Setting variables
```
var setvars = EasyElems('div', {'innerHTML':'Some Text','id': 'vardiv'});
```
Creates the following
```
var setvars = document.createElement('div');
setvars.innerHTML = 'Some Text';
setvars.id = 'vardiv';
```
## Setting Arguments and classes
Similar to variables this is also an object however they get set with the object.setAttribute function.
The only exception is the class argument. Instead of it being a string, it must be an array.
```
var setattribs = EasyElems('table', {'classList.add()': ['maintable', 'centertable']}, {'cellspacing':0});
```
This creates the following:
```
var setattribs = document.createElement('table');
setattribs.setAttribute('cellspacing': 0);
setattribs.classList.add('maintable', 'centertable');
```
## Adding Children
Children take the same parameters as the main function does except using an array instead. 
This is a recursive loop, so each child can have its own children.
```
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
```
console.log(mytable.childNodes[0].childNodes[0].childNodes[1].childNodes[1].value);
```
However that is hard to read, so instead you can create links. Below is the same example with links.
```
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
```
mytable                         - [object HTMLTableElement]
mytable.childLinks              - {inputname: input, submitrow: tr}
mytable.$inputname              - <input type="text" value="Mike">
mytable.$submitrow              - <tr>...</tr>
mytable.$submitrow.$submitbtn   - <input type="button" value="Change">
```
Now you can get all the variables and add additional functions to them.
```
mytable.$submitrow.$submitbtn.addEventListener('click', function(){
  console.log('Changing Name to: ' + mytable.$inputname.value);
});
```
