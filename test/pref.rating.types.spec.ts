'use strict';

import PrefRatingPlayer from '../src/pref.rating.player';
import {TPrefRatingObject, TPrefRatingPlayerInput, PrefRatingPlayerObject} from '../src/pref.rating.types';

describe('pref.rating.types tests', () => {
	it('should export TPrefRatingObject type', () => {
		// Test that we can create an object matching TPrefRatingObject structure
		const testObject: TPrefRatingObject = {
			bula: 60,
			p1: {
				username: 'test1',
				score: -100,
				rating: 1200,
				change: 10,
				oldRating: 1190
			},
			p2: {
				username: 'test2',
				score: 50,
				rating: 1150,
				change: -5,
				oldRating: 1155
			},
			p3: {
				username: 'test3',
				score: 50,
				rating: 1100,
				change: -5,
				oldRating: 1105
			}
		};

		expect(testObject.bula).toBe(60);
		expect(testObject.p1.username).toBe('test1');
	});

	it('should export TPrefRatingPlayerInput type', () => {
		// Test that we can create an object matching TPrefRatingPlayerInput structure
		const testInput: TPrefRatingPlayerInput = {
			username: 'testplayer',
			rating: 1000,
			score: -200
		};

		expect(testInput.username).toBe('testplayer');
		expect(testInput.rating).toBe(1000);
		expect(testInput.score).toBe(-200);
	});

	it('should export PrefRatingPlayerObject type', () => {
		// Test that we can create an object matching PrefRatingPlayerObject structure
		const testPlayerObject: PrefRatingPlayerObject = {
			username: 'testuser',
			score: 100,
			rating: 1250,
			change: 15,
			oldRating: 1235
		};

		expect(testPlayerObject.username).toBe('testuser');
		expect(testPlayerObject.change).toBe(15);
		expect(testPlayerObject.oldRating).toBe(1235);
	});

	it('should work with actual PrefRatingPlayer instance', () => {
		// Test that PrefRatingPlayer produces objects matching PrefRatingPlayerObject type
		const player = new PrefRatingPlayer('realplayer', 1300, -150);
		player.change = 20;

		const playerJson: PrefRatingPlayerObject = player.json;

		expect(playerJson.username).toBe('realplayer');
		expect(playerJson.rating).toBe(1320); // 1300 + 20
		expect(playerJson.score).toBe(-150);
		expect(playerJson.change).toBe(20);
		expect(playerJson.oldRating).toBe(1300);
	});
});
