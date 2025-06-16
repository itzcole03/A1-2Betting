# Sports Configuration

This directory contains centralized sports configuration used throughout the Elite Sports Intelligence Platform.

## Files

### `sports.ts`

Contains the centralized sports configuration that ensures consistency across all components and dropdown lists throughout the application.

#### Features:

- **Centralized Configuration**: All sports are defined in one place with consistent emojis and display names
- **Type Safety**: Full TypeScript support with `SportConfig` interface
- **Helper Functions**: Utility functions for getting sport information
- **Consistency**: Ensures all dropdowns and sport displays are synchronized

#### Sports Included:

- 🏀 NBA & WNBA
- 🏈 NFL
- ⚾ MLB
- 🏒 NHL
- ⚽ Soccer
- 🥊 MMA/UFC
- 🏌️ PGA Golf

**Note:** PrizePicks is a platform/service, not a sport. It has its own dedicated integration section.

#### Key Functions:

- `getAllSports()`: Returns all sport configurations
- `getSportById(id)`: Gets a specific sport by ID
- `getSportNames()`: Returns array of sport IDs
- `getSportNamesWithAll()`: Returns sport IDs with "All" option
- `getSportEmoji(id)`: Gets emoji for a sport
- `getSportDisplayName(id)`: Gets formatted display name with emoji

## Components Using Sports Configuration

1. **HeroSection**: Displays all sports with emojis
2. **PrizePicks**: Sport filtering dropdown
3. **RealTimePredictions**: Sport filtering dropdown
4. **RealPlayersDisplay**: Sport-specific stat calculations
5. **SportSelector**: Reusable dropdown component
6. **ConfigurationMatrix**: AI configuration with sports selection

**Note:** PrizePicks platform integration is shown in its own dedicated section, separate from sports.

## Adding New Sports

To add a new sport:

1. Add the sport to `SPORTS_CONFIG` in `sports.ts`:

```typescript
{
  id: 'NEW_SPORT',
  name: 'NEW_SPORT',
  emoji: '🎾',
  displayName: 'Tennis'
}
```

2. Add sport-specific logic to components if needed (e.g., stat calculations in `RealPlayersDisplay`)

3. The sport will automatically appear in all dropdowns and the HeroSection

## Benefits

- **Maintainability**: Single source of truth for sports
- **Consistency**: All components use the same sports list
- **Scalability**: Easy to add new sports
- **Type Safety**: Full TypeScript support
- **Reusability**: `SportSelector` component can be used anywhere
