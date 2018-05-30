const _ = require('lodash');
const expect = require('chai').expect;

const rewire = require("rewire");
const _Rating = rewire('../lib/rating.js');

// console.log('getDs', _Rating.__get__('D'));

let Rating = require('../lib/rating');

describe('Rating tests', function () {
	it('Rating should exist', function () {
		expect(Rating).to.exist;
	});
});