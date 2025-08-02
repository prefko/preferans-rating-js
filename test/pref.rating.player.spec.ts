'use strict';

import PrefRatingPlayer from '../src/pref.rating.player';

describe('pref.rating.player tests', () => {
	describe('Constructor tests', () => {
		it('should create a PrefRatingPlayer instance', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 100);
			expect(player).toBeInstanceOf(PrefRatingPlayer);
		});

		it('should initialize properties correctly', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 100);
			expect(player.score).toBe(100);
			expect(player.rating).toBe(1000);
		});
	});

	describe('Getter tests', () => {
		it('should return correct score', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 150);
			expect(player.score).toBe(150);
		});

		it('should return correct rating', () => {
			const player = new PrefRatingPlayer('testuser', 1200, 100);
			expect(player.rating).toBe(1200);
		});

		it('should return correct json representation', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 100);
			expect(player.json).toEqual({
				username: 'testuser',
				score: 100,
				rating: 1000,
				change: 0,
				oldRating: 1000
			});
		});
	});

	describe('Change setter tests', () => {
		it('should update change and rating when positive change is set', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 100);
			player.change = 50;
			expect(player.rating).toBe(1050);
			expect(player.json.change).toBe(50);
			expect(player.json.oldRating).toBe(1000);
		});

		it('should update change and rating when negative change is set', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 100);
			player.change = -30;
			expect(player.rating).toBe(970);
			expect(player.json.change).toBe(-30);
			expect(player.json.oldRating).toBe(1000);
		});

		it('should update change and rating when zero change is set', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 100);
			player.change = 0;
			expect(player.rating).toBe(1000);
			expect(player.json.change).toBe(0);
			expect(player.json.oldRating).toBe(1000);
		});

		it('should handle multiple change updates correctly', () => {
			const player = new PrefRatingPlayer('testuser', 1000, 100);
			player.change = 20;
			expect(player.rating).toBe(1020);
			player.change = -10;
			expect(player.rating).toBe(1010); // 1020 + (-10)
			expect(player.json.change).toBe(-10); // Last change value
			expect(player.json.oldRating).toBe(1000); // Original rating
		});
	});

	describe('Edge case tests', () => {
		it('should handle negative initial rating', () => {
			const player = new PrefRatingPlayer('testuser', -100, 50);
			expect(player.rating).toBe(-100);
			expect(player.json.oldRating).toBe(-100);
		});

		it('should handle negative score', () => {
			const player = new PrefRatingPlayer('testuser', 1000, -50);
			expect(player.score).toBe(-50);
		});

		it('should handle empty username', () => {
			const player = new PrefRatingPlayer('', 1000, 100);
			expect(player.json.username).toBe('');
		});

		it('should handle zero values', () => {
			const player = new PrefRatingPlayer('testuser', 0, 0);
			expect(player.rating).toBe(0);
			expect(player.score).toBe(0);
			expect(player.json.oldRating).toBe(0);
		});
	});
});
