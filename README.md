# RecipAId 🍳

> Your AI-Powered Kitchen Assistant

RecipAId is a mobile app that uses AI vision to scan ingredients from your fridge or pantry and generates personalized recipes based on what you have available.

## Features

- **📸 Ingredient Scanner**: Take a photo of your ingredients and let AI identify them
- **🍽️ Smart Recipe Generation**: Get personalized recipe suggestions based on your available ingredients
- **🌍 Cuisine Styles**: Choose from Mexican, Italian, Indian, Chinese, Japanese, French, American, Thai, Mediterranean, or any style
- **🛒 Shopping Lists**: Automatically generate shopping lists for recipes that need extra ingredients
- **📚 Recipe Library**: Save and organize your favorite recipes
- **✏️ Recipe Editing**: Customize saved recipes to your liking

## Tech Stack

- **Framework**: [Expo](https://expo.dev) SDK 54 (React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS for React Native)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Server State**: [TanStack Query](https://tanstack.com/query)
- **Backend**: [Supabase](https://supabase.com) (Auth, Database, Storage)
- **AI**: [OpenAI GPT-4o](https://openai.com) (Vision + Chat)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Expo Go app

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TomVanGeert/RecipAId.git
   cd RecipAId/recipaid
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Open the app:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Project Structure

```
recipaid/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Scan screen
│   │   ├── recipes.tsx    # Recipe generation
│   │   ├── saved.tsx      # Saved recipes & lists
│   │   └── profile.tsx    # User profile
│   └── recipe/[id].tsx    # Recipe detail
├── components/            # Reusable UI components
├── constants/             # App constants & theme
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities
│   ├── supabase.ts       # Supabase client
│   └── openai.ts         # OpenAI client
├── stores/               # Zustand stores
│   ├── auth-store.ts     # Authentication state
│   ├── ingredients-store.ts # Ingredients state
│   └── recipes-store.ts  # Recipes state
└── types/                # TypeScript definitions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `EXPO_PUBLIC_OPENAI_API_KEY` | Your OpenAI API key |

## Database Schema

The app uses Supabase with the following tables:

- **profiles**: User profile information
- **ingredients**: Scanned ingredients history
- **recipes**: Saved recipes
- **shopping_lists**: Generated shopping lists

All tables have Row Level Security (RLS) enabled for user data protection.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---

Built with ❤️ using Expo, Supabase, and OpenAI
