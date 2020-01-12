#!/usr/bin/env node
'use strict';

export type PrefRatingPlayerObject = {
	username: string,
	score: number,
	rating: number,
	change: number,
	oldRating: number
}

export type TPrefRatingObject = { bula: number, p1: PrefRatingPlayerObject, p2: PrefRatingPlayerObject, p3: PrefRatingPlayerObject }

export type TPrefRatingPlayerInput = { username: string, rating: number, score: number }
