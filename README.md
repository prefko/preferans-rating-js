<a href="http://prefko.com">
  <img alt="prefko" src="https://avatars0.githubusercontent.com/u/46445292?s=200" width="100">
</a>

# preferans-rating-js
[![build status](https://img.shields.io/travis/prefko/preferans-rating-js.svg?branch=master)](https://travis-ci.org/prefko/preferans-rating-js)
[![codacy](https://img.shields.io/codacy/grade/1877e4f84716402888fd97bd6c881d0f.svg)](https://www.codacy.com/project/prefko/preferans-rating-js/dashboard)
[![coverage](https://img.shields.io/coveralls/github/prefko/preferans-rating-js/master.svg)](https://coveralls.io/github/prefko/preferans-rating-js?branch=master)
[![dependencies](https://david-dm.org/prefko/preferans-rating-js.svg)](https://www.npmjs.com/package/preferans-rating-js)
[![npm](https://img.shields.io/npm/dt/preferans-rating-js.svg)](https://www.npmjs.com/package/preferans-rating-js) [![Greenkeeper badge](https://badges.greenkeeper.io/prefko/preferans-rating-js.svg)](https://greenkeeper.io/)

A TypeScript/JavaScript library for calculating player rating changes in Preferans card games. This library implements a sophisticated rating algorithm that considers player performance, existing ratings, and game-specific parameters (bula) to determine fair rating adjustments after each game.

### Documentation

[TypeDoc documentation](https://prefko.github.io/preferans-rating-js/docs/)

### Bula vs Final Score

It's important to understand the distinction between "bula" and "final score" in Preferans:

**Bula:**
- **Starting Bula**: All players begin with an identical bula value, determining the length of the game.
- **Game End**: The game finishes when the combined bulas of all three players equal zero.
- **Bula Tracking**: Each player tracks their bula progression in the middle column of their scorecard.

**Final Score Calculation:**
The final score used in rating calculations is much more complex than just the final bula. It involves:
- **Middle Column**: Your bula progression (can be positive-bad or negative-good)
- **Side Columns**: Points from tricks taken when other players were leading (multiplied by -10)
- **Opponent Deductions**: Subtracting what opponents documented taking from you in games where you were leading

The `score` parameter in this library represents the **final calculated score** after all these complex scoring rules are applied, not the raw bula value.

### Usage

```javascript
const PrefRating = require("preferans-rating-js");

// Example: Three players with different ratings and final calculated scores
const player1 = {
    username: 'Pedja',
    rating: 1200,    // Current rating before the game
    score: -500      // Final calculated score (negative = good performance)
};

const player2 = {
    username: 'Marko', 
    rating: 1150,
    score: 40        // Final calculated score (positive = poor performance)
};

const player3 = {
    username: 'Johnny',
    rating: 1100,
    score: 460       // Final calculated score (positive = poor performance)
};

// Note: In Preferans scoring, final scores typically sum to zero: -500 + 40 + 460 = 0
const startingBula = 30; // The initial bula value for all players

// Calculate rating changes
const rating = new PrefRating(player1, player2, player3, startingBula);

// Get the results
const result = rating.rating;
console.log(result);
/*
Output:
{
  bula: 30,
  p1: { username: 'Pedja', score: -500, oldRating: 1200, rating: 1173, change: -27 },
  p2: { username: 'Marko', score: 40, oldRating: 1150, rating: 1152, change: 2 },
  p3: { username: 'Johnny', score: 460, oldRating: 1100, rating: 1125, change: 25 }
}
*/
```

### API

#### Constructor
```typescript
new PrefRating(player1, player2, player3, bula)
```

**Parameters:**
- `player1`, `player2`, `player3`: Objects with `username` (string), `rating` (number), and `score` (number - final calculated score)
- `bula`: Number representing the starting bula value for all players

**Returns:** PrefRating instance

#### Properties
- `rating`: Returns an object containing the bula and updated player information including rating changes

### Detailed Example

To grasp the complex scoring system, consider this detailed example with a starting bula of 30:

**Players**: Pedja, Marko, Johnny
- **Order**: Pedja, Marko, Johnny

**Final Papers**:
- **Pedja**:
  - Left (Johnny) = 320
  - Middle (Bula) = -20
  - Right (Marko) = 160
- **Marko**:
  - Left (Pedja) = 120
  - Middle (Bula) = 4
  - Right (Johnny) = 60
- **Johnny**:
  - Left (Marko) = 20
  - Middle (Bula) = 16
  - Right (Pedja) = 60

**Calculations**:
- **Pedja**: -20 x 10 - 320 - 160 + 120 + 60 = -500
- **Marko**: 4 x 10 - 120 - 60 + 160 + 20 = 40
- **Johnny**: 16 x 10 - 20 - 60 + 320 + 60 = 460

**Result**:
- **Pedja**: Good 500
- **Marko**: Bad 40
- **Johnny**: Bad 460

**Explanation**:
- The formula: Middle (Bula) x 10 - Left - Right + Points Opponents Took
- Negative scores are considered "good".

### Rating Algorithm

The rating system is inspired by chess ELO but adapted for 3-player games. The algorithm considers three main factors:

#### Step 1: Calculate D Values (Score Performance)
```
D₁₂ = (Player1.score - Player2.score) / bula
D₁₃ = (Player1.score - Player3.score) / bula  
D₂₃ = (Player2.score - Player3.score) / bula
```
This measures actual performance differences, normalized by game length (bula).

#### Step 2: Calculate T Values (Rating Expectations)
```
T₁₂ = (Player2.rating - Player1.rating) × 2.8 / 100
T₁₃ = (Player3.rating - Player1.rating) × 2.8 / 100
T₂₃ = (Player3.rating - Player2.rating) × 2.8 / 100
```
This represents expected performance based on rating differences. The constant **2.8** is the "magic number" that scales rating differences.

#### Step 3: Calculate N Values (Performance Bonus)
```
N₁₂ = (Player1.score < Player2.score) ? -bula/100 : +bula/100
N₁₃ = (Player1.score < Player3.score) ? -bula/100 : +bula/100
N₂₃ = (Player2.score < Player3.score) ? -bula/100 : +bula/100
```
This gives a small bonus/penalty based on who performed better (remember: lower score = better in Preferans).

#### Step 4: Combine and Average
```
C₁₂ = D₁₂ + T₁₂ + N₁₂
C₁₃ = D₁₃ + T₁₃ + N₁₃  
C₂₃ = D₂₃ + T₂₃ + N₂₃

Player1.change = round((C₁₂ + C₁₃) / 2)
Player2.change = round((-C₁₂ + C₂₃) / 2)
Player3.change = round((-C₁₃ + -C₂₃) / 2)
```

#### Example Calculation (Pedja/Marko/Johnny):
- **D Values**: -18, -32, -14 (Pedja dominated with -500 score)
- **T Values**: -1.4, -2.8, -1.4 (Pedja had highest rating, so negative expectations)
- **N Values**: -0.3, -0.3, -0.3 (All performed as expected relative to each other)
- **Final Changes**: Pedja: -27, Marko: +2, Johnny: +25

**Key Insight**: Pedja had the best performance (-500 score) but **lost** rating points because his high initial rating (1200) created high expectations that even his excellent performance couldn't fully meet.

#### Differences from Chess ELO:
1. **3 Players**: Each player's change considers performance against both opponents
2. **No Draws**: Scores are always different (theoretically ties possible but extremely rare) 
3. **Base Rating**: Uses 1000 instead of chess's 1200
4. **Score Normalization**: Performance scaled by bula (game length)

### Installation

```bash
npm install preferans-rating-js
```

### Requirements

- Node.js ≥ 16.0.0
- TypeScript support included
