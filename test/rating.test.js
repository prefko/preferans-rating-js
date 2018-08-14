const expect = require("chai").expect;

const PrefRating = require("../lib/rating");

describe("PrefRating tests", function () {
	it("PrefRating should exist", function () {
		expect(PrefRating).to.exist;
	});

	describe("PrefRating constructor tests", function () {
		let p1 = {username: "p1", oldRating: 1152, score: -238};
		let p2 = {username: "p1", rating: 1074, score: 112};
		let p3 = {username: "p1", oldRating: 986, score: 126};
		it("contructor should throw correctly for missing attributes", function () {
			expect(() => new PrefRating()).to.throw();
			expect(() => new PrefRating(p1)).to.throw();
			expect(() => new PrefRating(p1, p2)).to.throw();
			expect(() => new PrefRating(p1, p2, p3)).to.throw();
		});
		it("contructor should throw correctly for p1", function () {
			expect(() => new PrefRating({oldRating: 1152, score: -238}, p2, p3)).to.throw();
			expect(() => new PrefRating({username: "p1", score: -238}, p2, p3)).to.throw();
			expect(() => new PrefRating({username: "p1", oldRating: 1152}, p2, p3)).to.throw();
		});
		it("contructor should throw correctly for p2", function () {
			expect(() => new PrefRating(p1, {oldRating: 1152, score: -238}, p3)).to.throw();
			expect(() => new PrefRating(p1, {username: "p2", score: -238}, p3)).to.throw();
			expect(() => new PrefRating(p1, {username: "p2", oldRating: 1152}, p3)).to.throw();
		});
		it("contructor should throw correctly for p3", function () {
			expect(() => new PrefRating(p1, p2, {oldRating: 1152, score: -238})).to.throw();
			expect(() => new PrefRating(p1, p2, {username: "p3", score: -238})).to.throw();
			expect(() => new PrefRating(p1, p2, {username: "p3", oldRating: 1152})).to.throw();
		});
		it("contructor should throw correctly", function () {
			expect(() => new PrefRating(p1, p2, p3, true)).to.throw();
			expect(() => new PrefRating(p1, p2, p3, "60")).to.throw();
		});
		it("contructor should create object", function () {
			expect(() => new PrefRating(p1, p2, p3, 60)).to.not.throw();
			expect(new PrefRating(p1, p2, p3, 60)).to.be.a("object");
		});
	});

	describe("PrefRating calculation tests 1", function () {
		let p1 = {username: "p1", rating: 1152, score: -238};
		let p2 = {username: "p2", oldRating: 1074, score: 112};
		let p3 = {username: "p3", oldRating: 986, score: 126};
		let rating = new PrefRating(p1, p2, p3, 60);
		it("getRatings should create object", function () {
			expect(rating.getRatings()).to.be.a("object");
		});
		it("getRatings should work properly", function () {
			expect(rating.getRatings()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: -238, oldRating: 1152, newRating: 1142, change: -10},
					p2: {username: "p2", score: 112, oldRating: 1074, newRating: 1077, change: 3},
					p3: {username: "p3", score: 126, oldRating: 986, newRating: 993, change: 7}
				}
			);
		});
	});

	describe("PrefRating calculation tests 2", function () {
		let p1 = {username: "p1", oldRating: 986, score: 126};
		let p2 = {username: "p2", oldRating: 1074, score: 112};
		let p3 = {username: "p3", rating: 1152, score: -238};
		let rating = new PrefRating(p1, p2, p3, 60);

		it("getRatings should work properly", function () {
			expect(rating.getRatings()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: 126, oldRating: 986, newRating: 993, change: 7},
					p2: {username: "p2", score: 112, oldRating: 1074, newRating: 1077, change: 3},
					p3: {username: "p3", score: -238, oldRating: 1152, newRating: 1142, change: -10}
				}
			);
		});
	});

	describe("PrefRating calculation tests 3", function () {
		let p1 = {username: "p1", oldRating: 986, score: 120};
		let p2 = {username: "p2", rating: 1074, score: 120};
		let p3 = {username: "p3", oldRating: 1152, score: -240};
		let rating = new PrefRating(p1, p2, p3, 60);

		it("getRatings should work properly", function () {
			expect(rating.getRatings()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: 120, oldRating: 986, newRating: 993, change: 7},
					p2: {username: "p2", score: 120, oldRating: 1074, newRating: 1077, change: 3},
					p3: {username: "p3", score: -240, oldRating: 1152, newRating: 1142, change: -10}
				}
			);
		});
	});

});