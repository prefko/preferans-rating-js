#!/usr/bin/env node
'use strict';

/**
 * @typedef {Object} Player
 * @property {string} username Username
 * @property {number} score Score
 * @property {number} oldRating Previous rating
 * @property {number} [newRating] New rating
 */

/**
 * @typedef {Object} Rating
 * @property {number} bula The game bula
 * @property {Player} p1 The 1st Player
 * @property {Player} p2 The 2nd Player
 * @property {Player} p3 The 3rd Player
 */

const _ = require('lodash');
const math = require('mathjs');
const Ajv = require('ajv');
const ajv = new Ajv({ useDefaults: true });
const _validatePlayer = ajv.compile({
  type: 'object',
  properties: {
    username: { type: 'string' },
    score: { type: 'integer' },
    rating: { type: 'integer', minimum: 0 },
    oldRating: { type: 'integer', minimum: 0 },
  },
  additionalProperties: false,
  oneOf: [{ required: ['rating'] }, { required: ['oldRating'] }],
  required: ['username', 'score'],
});

/** @constant
 * @type {number}
 * @default
 */
const MAGIC = 2.8;

const _d = (p1, p2, bula) =>
  math.round(
    math
      .chain(p1.score)
      .subtract(p2.score)
      .divide(bula)
      .done(),
    3,
  );
const _calculateDs = (p1, p2, p3, bula) => ({
  D12: _d(p1, p2, bula),
  D13: _d(p1, p3, bula),
  D23: _d(p2, p3, bula),
});

const _t = (p1, p2) =>
  math.round(
    math
      .chain(p2.oldRating)
      .subtract(p1.oldRating)
      .multiply(MAGIC)
      .divide(100)
      .done(),
    3,
  );
const _calculateTs = (p1, p2, p3) => ({
  T12: _t(p1, p2),
  T13: _t(p1, p3),
  T23: _t(p2, p3),
});

const _n = (p1, p2, bula) => (p1.score > p2.score ? bula : p1.score < p2.score ? -bula : 0) / 100;
const _calculateNs = (p1, p2, p3, bula) => ({
  N12: _n(p1, p2, bula),
  N13: _n(p1, p3, bula),
  N23: _n(p2, p3, bula),
});

const _c = (c1, c2) =>
  math.round(
    math
      .chain(c1)
      .add(c2)
      .divide(2)
      .done(),
  );
const _calculateChanges = (p1, p2, p3, bula) => {
  let D = _calculateDs(p1, p2, p3, bula);
  let T = _calculateTs(p1, p2, p3);
  let N = _calculateNs(p1, p2, p3, bula);

  let C12 = D.D12 + T.T12 + N.N12;
  let C13 = D.D13 + T.T13 + N.N13;
  let C23 = D.D23 + T.T23 + N.N23;

  return {
    change1: _c(C12, C13),
    change2: _c(-C12, C23),
    change3: _c(-C13, -C23),
  };
};

/** Adjust the players rating.
 * @private
 * @memberof PrefRating
 * @param {Player} p - The player object
 */
const _fixRatingAttributes = p => {
  p.oldRating = p.rating || p.oldRating;
  delete p.rating;
  return p;
};

const _validate = (p1, p2, p3, bula) => {
  if (!_validatePlayer(p1)) throw new Error('PrefRating::constructor:Player 1 invalid ' + p1);
  if (!_validatePlayer(p2)) throw new Error('PrefRating::constructor:Player 2 invalid ' + p2);
  if (!_validatePlayer(p3)) throw new Error('PrefRating::constructor:Player 3 invalid ' + p3);
  if (!bula || !_.isNumber(bula)) throw new Error('PrefRating::constructor:No bula defined ' + bula);
};

/** This is the Preferans Rating main class. */
class PrefRating {
  /** @constructor
   * @param {Player} p1 - 1st player object
   * @param {Player} p2 - 2nd player object
   * @param {Player} p3 - 3rd player object
   * @param {number} bula - Game bula
   * @returns {object} PrefRating instance
   */
  constructor(p1, p2, p3, bula) {
    _validate(p1, p2, p3, bula);

    p1 = _fixRatingAttributes(p1);
    p2 = _fixRatingAttributes(p2);
    p3 = _fixRatingAttributes(p3);

    this.bula = bula;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    let { change1, change2, change3 } = _calculateChanges(p1, p2, p3, bula);
    this.p1.change = change1;
    this.p2.change = change2;
    this.p3.change = change3;
    this.p1.newRating = this.p1.oldRating + change1;
    this.p2.newRating = this.p2.oldRating + change2;
    this.p3.newRating = this.p3.oldRating + change3;

    return this;
  }

  /** Getter.
   * @returns {Rating} Rating object
   */
  getRatings() {
    return {
      bula: this.bula,
      p1: this.p1,
      p2: this.p2,
      p3: this.p3,
    };
  }
}

module.exports = PrefRating;