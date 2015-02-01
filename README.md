cappedarray
===========


Basic usage
```js
var cappedArray = require('cappedarray')

// Create array with a lenth cap of 5
var log = cappedArray(3)  // []

// Add some items
log.push(1)         
log.push(2)         
log.push(3)               // [1, 2, 3]


// Add more than the lenth cap
log.push(4)               // [2, 3, 4]
log.push(5)               // [3, 4, 5]


for (var i = 0; i < 50; i++) {
	log.push(i)
}

console.log(log)
> [47, 48, 49]
```

Unshift
```js
var log = cappedArray(5)                    // []

// Multiple arguments to push and unshift work as standard
log.unshift('a', 'b', 'c', 'd', 'e', 'f')   // ['b', 'c', 'd', 'e', 'f']

log.unshift('h')                            // ['h', 'b', 'c', 'd', 'e']
log.unshift('i')                            // ['i', 'h', 'b', 'c', 'd']
log.push('j')                               // ['h', 'b', 'c', 'd', 'j']

```


## Installation

```bash
$ npm install cappedarray
```

