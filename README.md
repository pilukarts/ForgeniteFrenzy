# Alliance Forge: Forgeite Frenzy

Welcome to the official repository for **Alliance Forge: Forgeite Frenzy**, a sci-fi themed incremental clicker game built with Next.js and integrated with Firebase. Lead humanity's escape from a doomed Earth by tapping your way to galactic dominance, upgrading your commander, and competing on a global scale.

## 🚀 Game Concept

In a desperate future, humanity must escape the clutches of the encroaching Cyber Concord. As a Commander in the Alliance, your mission is to gather critical resources to build colossal StarForge Arks and guide your people to a new home in the Sanctaris system.

This game is a "tap-to-earn" experience where players progress through seasons, complete quests, and climb the leaderboards.

## ✨ Core Features

- **Tap-to-Earn Gameplay:** The core mechanic involves tapping the Commander portrait to earn points and progress.
- **Player Progression System:**
  - **Levels & XP:** Earn XP with every point, level up, and unlock new rank titles.
  - **Dynamic Tier Colors:** The UI and commander's aura visually evolve with player level, changing colors at major milestones.
- **Upgrades & Enhancements:**
  - **Commander Upgrades:** Spend points to enhance tap power, critical hit chance, combo bonuses, and more.
  - **Ark Hangar:** Connect a (simulated) crypto wallet to unlock and purchase exclusive Ark upgrades.
- **Passive Income with M.U.L.E. Drones:** Purchase M.U.L.E. Drones that passively generate points for you while you're offline.
- **In-Game Economy:**
  - **Dual Currency:** Earn **Points** through gameplay and use **Auron** (premium currency) for special items.
  - **Item Shop:** Purchase temporary tap boosts and other buffs using Auron.
- **Battle Pass System:**
  - Progress through a seasonal Battle Pass by earning XP.
  - Includes both **free and premium** reward tracks.
  - Unlock exclusive skins, titles, currency, and buffs.
- **C.O.R.E. AI Companion (Genkit Powered):**
  - An AI-powered companion that provides dynamic mission briefings, adaptive gameplay advice, and immersive lore snippets based on player progress.
- **Social & Community Features:**
  - **Global Leaderboards:** Compete with players worldwide for the top score.
  - **Alliance Chat:** A simulated chat room to coordinate with fellow commanders.
  - **Feedback & Support Forms:** Integrated pages for players to submit feedback or contact support.
- **Daily Quests:** Complete daily objectives to earn valuable rewards and accelerate your progress.
- **Web3 Integration (Simulated):**
  - A "Connect Wallet" feature that rewards players with Auron and unlocks special game content.
  - A comprehensive **Transparency Statement** page explaining the role of digital assets.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🛠️ Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

- `src/app/`: Contains all the pages and routes for the application.
- `src/components/`: Shared React components used across different pages (e.g., layout, UI elements, game components).
- `src/contexts/`: Home of the `GameContext.tsx`, which manages all global game state and logic.
- `src/lib/`: Core game data (`gameData.ts`), type definitions (`types.ts`), and utility functions.
- `src/ai/`: Holds all the Genkit-related code, including flows for the C.O.R.E. AI companion.
- `public/`: Static assets like images and sounds.

## ☁️ Deployment

This project is configured for seamless deployment using **Firebase App Hosting**. The `apphosting.yaml` file defines the hosting settings.

The deployment process is automated via GitHub Actions:
1.  Push your code changes to the `main` branch of your GitHub repository.
2.  Firebase App Hosting automatically detects the push, builds the Next.js application, and deploys it.
3.  The live URL will be available in your Firebase project's App Hosting dashboard, which is `https://nextn.web.app`.
