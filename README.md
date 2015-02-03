cappedarray
===========


## Basic usage

```js
var cappedArray = require('cappedarray')

// Create array with a length cap of 3
var log = cappedArray(3)  // []

// log.lengthCap === 3


// Add some items
log.push(1)               // [1]         
log.push(2)               // [1, 2]       
log.push(3)               // [1, 2, 3]


// Add more items than the length cap
log.push(4)               // [2, 3, 4] - Too many items, The 1 is pushed off the front
log.push(5)               // [3, 4, 5]
log.unshift(6)            // [6, 3, 4] - The 5 is unshifted off the back

// Add a lot more than the cap length
for (var i = 0; i < 50; i++) {
	log.push(i)
}

// Still 3 items
console.log(log.length)
> 3

console.log(log)
> [47, 48, 49]
```

## Installation

```bash
$ npm install cappedarray
```


## How it works
The capped array is just a normal array with the `push` and `unshift` functions overridden and an extra `lengthCap` property.
The functions and lengthCap are set to enumerable `false` so they do not show up in forEach loops, Object.keys, etc...
```js
var recentItems = cappedArray(5)

recentItems.push('foo')
recentItems.push('bar')

var util = require('util')
util.isArray(recentItems)   // true
Array.isArray(recentItems)  // true

Object.keys(recentItems)    // ['0', '1']
JSON.stringify(recentItems) // '["foo","bar"]'
```

## Further Examples

#### Multiple arguments
```js
// Create array with a length cap of 5
var log = cappedArray(5)                    // []

// Multiple arguments to push and unshift work as expected.
log.unshift('a', 'b', 'c', 'd', 'e', 'f')   // ['a', 'b', 'c', 'd', 'e'] - Too long, 'f' has already popped off the end.
                                            // If this was a 'push' the 'f' would have stayed and the 'a' would have gone.

log.unshift('h')                            // ['h', 'a', 'b', 'c', 'd']
log.unshift.apply(log, ['i', 'j', 'k'])     // ['i', 'j', 'k', 'h', 'a']
log.push('l', 'm')                          // ['k', 'h', 'a', 'l', 'm']
```


#### The length cap can be changed on the fly.

```js
// Create array with a length cap of 5
var recentItems = cappedArray(5)

recentItems.push(1, 2, 3, 4, 5, 6, 7)   // [3, 4, 5, 6, 7]

// Need to keep more recent items
recentItems.lengthCap = 8               // [3, 4, 5, 6, 7] Still only 5 items

recentItems.push(8, 9, 10, 11)          // [4, 5, 6, 7, 8, 9, 10, 11]

```
When changing the length cap to a lower value than the existing item count, the extra items will **not** be automatically removed. It is unknown whether the first or last items should be removed until `push` or `unshift` is called afterward. 

```js

// I've changed my mind. There's too many items now, lower the cap.
recentItems.lengthCap = 6              // [4, 5, 6, 7, 8, 9, 10, 11]

// More items than the lengthCap?
console.log(recentItems.length)
> 8
console.log(recentItems.lengthCap)
> 6
```

Passing no arguments to either `push` or `unshift` will reduce the array to the capped length.
```js
// I want to keep the end of the array.
recentItems.push()                     // [6, 7, 8, 9, 10, 11]

// That has sorted it!
console.log(recentItems.length)
> 6
console.log(recentItems.lengthCap)
> 6

```


## Capping existing Arrays
```js
var cap = require('cappedarray').cap

var messages = [{msg: 'First!'}, {msg: 'Second'}, {msg: 'Third'}]

// Cap the array to 5 items
cap(messages, 5)

messages.push({msg: 'Forth'}, {msg: 'Fith'}, {msg: 'Sixth'})

console.log(log)
> [ { msg: 'Second' },
  { msg: 'Third' },
  { msg: 'Forth' },
  { msg: 'Fith' },
  { msg: 'Sixth' } ]
```

If the second argument is missing the cap is set to the length of the array or the lengthCap property if it exists.

```js
var numerosEnFrancais = cap(['un', 'deux', 'trois'])

// Both the cap and length are the same
console.log(numerosEnFrancais.length + ' === ' numerosEnFrancais.lengthCap)
> 3 === 3

// This can be used to loop through an array repeatedly
numerosEnFrancais.push(numerosEnFrancais[0])  // ['deux', 'trois', 'un']
numerosEnFrancais.push(numerosEnFrancais[0])  // ['trois', 'un', 'deux']
numerosEnFrancais.push(numerosEnFrancais[0])  // ['un', 'deux', 'trois']



var top5 = ['High Fidelity']

// This...
top5.lengthCap = 5
cap(top5)  // Uses the existing lengthCap property for the length cap

// ...is the same as
cap(top5, 5)
```



Like changing the lengthCap above, capping an existing array with more items than the length cap will **not** automatically remove the extra items. Use `push` or `unshift` with no arguments to reduce the array to the capped length.

```js

var alphabet = ['a', 'b', 'c', 'd', etc..., 'x', 'y', 'z']
console.log(alphabet.length)
> 26

// Cap it to 13 items...
cap(alphabet, 13)

// ...but it still has 26 items.
console.log(alphabet.length)
> 26
console.log(alphabet.lengthCap)
> 13

// removes extra items from the front.
cap.push()        

console.log(alphabet.length)
> 13
console.log(alphabet)
> ['n', 'o', 'p', 'q', 'r', 's', etc..., 'x', 'y', 'z']


// Lets try that again with unshift
var alphabet = ['a', 'b', 'c', 'd', etc..., 'x', 'y', 'z']

// cap returns the array so we can do this. Unshift removes extra items from the back.
cap(alphabet, 13).unshift()

console.log(alphabet.length)
> 13
console.log(alphabet)
> ['a', 'b', 'c', 'd', 'e', 'f', etc..., 'k', 'l', 'm']

``` 

## Uncap

Use uncap to turn the array back to normal.

```js
var cap   = require('cappedarray').cap
var uncap = require('cappedarray').uncap

var cycleNumbers = cap([1, 2, 3, 4, 5]) // Sets lengthCap to length: 5

cycleNumbers.push(cycleNumbers[0])      // [2, 3, 4, 5, 1]
cycleNumbers.push(cycleNumbers[0])      // [3, 4, 5, 1, 2]
cycleNumbers.push(cycleNumbers[0])      // [4, 5, 1, 2, 3]

uncap(cycleNumbers)

// The cycle is broken
cycleNumbers.push(cycleNumbers[0])      // [4, 5, 1, 2, 3, 4]
cycleNumbers.push(cycleNumbers[0])      // [4, 5, 1, 2, 3, 4, 4]
cycleNumbers.push(cycleNumbers[0])      // [4, 5, 1, 2, 3, 4, 4, 4]

```

## Clone

Copy the values into a new capped array with the same lengthCap

```js
var cap   = require('cappedarray').cap
var clone = require('cappedarray').clone

var capped1 = cap([1, 2, 3])
var capped2 = clone(capped1)

capped2.push(4)

console.log(capped1, capped2)
> [1, 2, 3] [2, 3, 4]

// Clone is just a wrapper for
cap(capped.slice(), capped.lengthCap)
```


## Gotchas

* Behavior maybe unexpected if a capped array is passed to a library for modification.
* lengthCap must be a non negative integer. Other values will throw 'Invalid array lengthCap'. This mimics the behavior of assigning array.length.
* `push` and `unshift` return the length of the array, **not** the array, in line with the existing behavior.
```js
// array1 is not an array
var array1 = cap([1, 2, 3, 4, 5, 6], 3).push()
console.log(array1)
> 3

// This works
var array2 = cap([1, 2, 3, 4, 5, 6], 3)
array2.push()
console.log(array2)
> [4, 5, 6]

// or this
var array3
( array3 = cap([1, 2, 3, 4, 5, 6], 3) ).push()
console.log(array3)
> [4, 5, 6]
```

* Arrays can be made longer than lengthCap by using splice, assigning to a numbered key or using the Array prototype functions with `call` or `apply`.
```js
var array1 = cap([1, 2, 3], 3)       // [1, 2, 3]                length = 3, lengthCap = 3
array1.splice(1, 0, 1.1, 1.2, 1.3)   // [1, 1.1, 1.2, 1.3, 2, 3] length = 6, lengthCap = 3


var array2 = cap([1, 2, 3], 3)       // [1, 2, 3]    length = 3, lengthCap = 3
array2[3] = 4                        // [1, 2, 3, 4] length = 4, lengthCap = 3


var array3 = cap([1, 2, 3], 3)       // [1, 2, 3]          length = 3, lengthCap = 3
Array.prototype.push.call(array3, 4) // [1, 2, 3, 4]       length = 4, lengthCap = 3
[].push.apply(array3, [5, 6])        // [1, 2, 3, 4, 5, 6] length = 6, lengthCap = 3
```
