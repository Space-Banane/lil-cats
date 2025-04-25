# Lil-Cats 🐈

An interactive cat simulation where cute virtual cats follow your cursor and interact with their environment.

![Lil-Cats Screenshot](https://cdn.reversed.dev/pictures/lil-cats.png)

## Features

- **Cat Cursor Following**: The nearest cat follows your cursor with a realistic delay
- **Interactive Behaviors**: Cats display different states like running, sleeping, eating, playing, and sitting
- **Food System**: Spawn food items for cats to find and eat
- **Random Movement**: Cats move around the screen with natural behaviors
- **Click Interactions**: Click on cats to make them angry, and click again to remove them
- **Customization**: Control how many cats appear on screen
- **Dark Mode**: Toggle between light and dark themes

## Live Demo

Visit [https://cats.reversed.dev](https://cats.reversed.dev) to see Lil-Cats in action.

## Getting Started

### Prerequisites

- Node.js (v22.0.0 or higher)
- pnpm (v8.0.0 or higher)

### Installation (dev server)

1. Clone the repository
   ```bash
   git clone https://github.com/Space-Banane/lil-cats.git
   cd lil-cats
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Start the development server
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Installation (Docker; Prod Server)
1. Clone the repository
   ```bash
   git clone https://github.com/Space-Banane/lil-cats.git
   cd lil-cats
   ```

2. Start the Container
   ```bash
   docker-compose up -d
   ```
3. Open your browser and navigate to `http://localhost:1231`
4. Stop the Container
   ```bash
   docker-compose down
   ```

## How to Use

- **Right-click** anywhere to toggle cursor following
- Use the **navbar buttons** to:
  - Add individual cats
  - Add random cats
  - Spawn food
  - Remove all cats
  - Remove all food
  - Toggle dark mode
  - Toggle cursor following
- **Click on a cat** once to make it angry (it will return to normal in 3 seconds)
- **Click on an angry cat** to remove it

## Building for Production

```bash
pnpm build
```

The build files will be in the `dist` directory, which you can then deploy to any static hosting service.

## Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)


## License

Distributed under the MIT License. See `LICENSE` for more information.


## Personal Note
This project was fully "Vibe-Coded", meaning i made 100% of the code without any plan or design, just with AI. I mainly used Claude 3.7 in Copilot using their new Agent Mode.
Fun project tho, no clue why i made this.
All my prompts are in the `Prompts.md` file.