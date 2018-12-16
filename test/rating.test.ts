import {expect} from 'chai';
import PrefRating from '../src/rating';
import PrefPlayer from '../src/player';

describe("PrefRating tests", () => {
	it("PrefRating should exist", () => {
		expect(PrefRating).to.exist;
	});

	describe("PrefRating constructor tests", () => {
		let p1 = new PrefPlayer("p1", 1152, -238);
		let p2 = new PrefPlayer("p1", 1074, 112);
		let p3 = new PrefPlayer("p1", 986, 126);
		it("contructor should create object", () => {
			expect(() => new PrefRating(p1, p2, p3, 60)).to.not.throw();
			expect(new PrefRating(p1, p2, p3, 60)).to.be.a("object");
		});
	});

	describe("PrefRating calculation tests 1", () => {
		let p1 = new PrefPlayer("p1", 1152, -238);
		let p2 = new PrefPlayer("p2", 1074, 112);
		let p3 = new PrefPlayer("p3", 986, 126);
		console.log(p1.getObject());
		let rating = new PrefRating(p1, p2, p3, 60);
		console.log(p1.getObject());
		it("ratings.getObject() should create object", () => {
			expect(rating.getObject()).to.be.a("object");
		});
		it("ratings.getObject() should work properly", () => {
			expect(rating.getObject()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: -238, oldRating: 1152, rating: 1142, change: -10},
					p2: {username: "p2", score: 112, oldRating: 1074, rating: 1077, change: 3},
					p3: {username: "p3", score: 126, oldRating: 986, rating: 993, change: 7}
				}
			);
		});
	});

	describe("PrefRating calculation tests 2", () => {
		let p1 = new PrefPlayer("p1", 986, 126);
		let p2 = new PrefPlayer("p2", 1074, 112);
		let p3 = new PrefPlayer("p3", 1152, -238);
		let rating = new PrefRating(p1, p2, p3, 60);

		it("ratings.getObject() should work properly", () => {
			expect(rating.getObject()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: 126, oldRating: 986, rating: 993, change: 7},
					p2: {username: "p2", score: 112, oldRating: 1074, rating: 1077, change: 3},
					p3: {username: "p3", score: -238, oldRating: 1152, rating: 1142, change: -10}
				}
			);
		});
	});

	describe("PrefRating calculation tests 3", () => {
		let p1 = new PrefPlayer("p1", 986, 120);
		let p2 = new PrefPlayer("p2", 1074, 120);
		let p3 = new PrefPlayer("p3", 1152, -240);
		let rating = new PrefRating(p1, p2, p3, 60);

		it("ratings.getObject() should work properly", () => {
			expect(rating.getObject()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: 120, oldRating: 986, rating: 993, change: 7},
					p2: {username: "p2", score: 120, oldRating: 1074, rating: 1077, change: 3},
					p3: {username: "p3", score: -240, oldRating: 1152, rating: 1142, change: -10}
				}
			);
		});
	});

});