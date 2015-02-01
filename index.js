"use strict";

exports = module.exports = cappedArray;

exports.cap   = cap
exports.uncap = uncap
exports.clone = clone


var _push     = Array.prototype.push
var _unshift  = Array.prototype.unshift
var isInteger = Number.isInteger || function(value) { return parseInt(value, 10) === value }

function cappedArray(lengthCap) {
  return cap([], lengthCap)
}

function cap(array, lengthCap) {
  if (lengthCap === undefined) lengthCap = array.hasOwnProperty('lengthCap') ? array.lengthCap : array.length
  
  var _lengthCap
  
  Object.defineProperties(
    array,
    {
      "lengthCap": {
        get: function() { return _lengthCap },
        set: function(lengthCap) {
          if ( !isInteger(lengthCap) || lengthCap < 0 ) {
            throw new Error('Invalid array lengthCap')
          }
          _lengthCap = lengthCap
        },
        enumerable: false,
        configurable: true
      },
      
      "push": {
        value: cappedPush,
        enumerable: false,
        configurable: true
      },
      
      "unshift": {
        value: cappedUnshift,
        enumerable: false,
        configurable: true
      }
    }
  )
  
  array.lengthCap = lengthCap

  return array
}


function cappedPush(){
  _push.apply(this, arguments)
  var length = this.length, lengthCap = this.lengthCap
  if (length > lengthCap) this.splice(0, length - lengthCap)
  return this.length
}

function cappedUnshift(){
  _unshift.apply(this, arguments)
  var length = this.length, lengthCap = this.lengthCap
  if (length > lengthCap) this.splice(lengthCap, length - lengthCap)
  return this.length
}


function uncap(array) {
  delete array.lengthCap
  delete array.push
  delete array.unshift
  
  return array
}

function clone(array) {
  return cap(array.slice(), array.lengthCap)
}