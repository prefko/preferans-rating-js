const _ = require('lodash');
const expect = require('chai').expect;

let Rating = require('../lib/rating');

describe('Rating tests', function () {
	it('Rating should exist', function () {
		expect(Rating).to.exist;
	});
});