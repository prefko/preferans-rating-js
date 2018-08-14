#!/usr/bin/env node
"use strict";

const PrefRating = require("./lib/rating");

let p1 = {username: "p1", oldRating: 1152, rating: 1000, score: 0};
let p2 = {username: "p1", oldRating: 1152, rating: 1000, score: 0};
let p3 = {username: "p1", oldRating: 1152, rating: 1000, score: 0};

let r = new PrefRating(p1, p2, p3, 60);

// console.log(r);
