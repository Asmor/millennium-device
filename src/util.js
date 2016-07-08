"use strict";

// via https://bost.ocks.org/mike/shuffle/ with slight tweak to not mutate original array

function shuffle(array) {
  // Make shallow copy of array
  array = array.concat();

  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

module.exports = { shuffle };
