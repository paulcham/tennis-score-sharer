# Tennis Scoring Rules Research

## Basic Tennis Scoring System

### Game Scoring (Points)
- **0** = "Love"
- **15** = First point
- **30** = Second point  
- **40** = Third point
- **Game** = Fourth point (if not deuce)

### Deuce and Advantage
- **Deuce** = Both players have 40 points
- **Advantage** = Player needs one more point to win
- **Game Win** = Player with advantage wins the next point

### Set Scoring (Games)
- **6 Games** = Win a set (must win by 2 games)
- **7-5** = Valid set score
- **6-6** = Tie break (if enabled) or continue until 2-game lead

### Match Scoring (Sets)
- **Best of 3** = First to win 2 sets
- **Best of 5** = First to win 3 sets
- **Single Set** = One set only

## Advanced Scoring Rules

### No-Ad Scoring
- **Deuce** = Next point wins the game
- **No advantage** = Simplified scoring
- **Common in**: College tennis, some recreational leagues

### Tie Break Rules
- **7-Point Tie Break**: First to 7 points (win by 2)
- **10-Point Tie Break**: First to 10 points (win by 2)
- **No Tie Break**: Continue until 2-game lead

### Set Duration Options
- **4 Games**: Short sets (recreational)
- **6 Games**: Standard tennis
- **8 Game Pro-Set**: Single set to 8 games

## Scoring Examples

### Regular Game (Ad Scoring)
```
Player A: 0 → 15 → 30 → 40 → Game
Player B: 0 → 15 → 30 → 40 → Deuce
```

### Deuce Game
```
Player A: 40 → Deuce → Advantage → Game
Player B: 40 → Deuce → 40 → Deuce
```

### Set Example
```
Player A: 6 games (wins set)
Player B: 4 games
```

### Match Example (Best of 3)
```
Player A: 6-4, 6-2 (wins match)
Player B: 4-6, 2-6
```

## Special Cases

### Tie Break Scoring
- **Points**: 1, 2, 3, 4, 5, 6, 7 (not 15, 30, 40)
- **Win by 2**: Must win by 2 points
- **Set Score**: 7-6 (tie break winner)

### No-Ad Scoring
- **Deuce**: Next point wins
- **No advantage**: Simplified
- **Example**: 40-40 → next point wins game

### Pro-Set (8 Games)
- **Single set**: First to 8 games
- **Win by 2**: Must win by 2 games
- **Tie break**: At 8-8 (if enabled)

## Implementation Considerations

### State Management
- Track current game score (0, 15, 30, 40, deuce, advantage)
- Track games won per set
- Track sets won per match
- Handle different scoring systems

### Edge Cases
- **7-5 set**: Valid (2-game lead)
- **6-6 set**: Tie break or continue
- **2-0 match**: Best of 3 complete
- **3-1 match**: Best of 5 complete

### UI Requirements
- Clear point buttons (0, 15, 30, 40, +1)
- Undo functionality
- Visual indicators for deuce/advantage
- Set and match score display 