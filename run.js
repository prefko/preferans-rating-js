#!/usr/bin/env node
"use strict";

const PrefRating = require("./lib/rating");
const PrefRatingPlayer = PrefRating.Player;

let p1 = new PrefRatingPlayer(1000, 0);
let p2 = new PrefRatingPlayer(1000, 0);
let p3 = new PrefRatingPlayer(1000, 0);

let r = new PrefRating(p1, p2, p3, 60);

// console.log(r);
