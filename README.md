# EasyCrypto: Crypto Buy & Sell

EasyCrypto is a feature-rich cryptocurrency dashboard and educational web application built with Next.js, and Genkit. It provides real-time cryptocurrency data, an interactive arcade with virtual currency, and AI-powered investment recommendations. This project serves as a comprehensive demo showcasing modern web development practices.

## ✨ Features

- **Real-Time Crypto Data**: Browse top cryptocurrencies, view detailed charts, and track market trends with data from the CoinGecko API.
- **Interactive Dashboard**: A personalized space for users to get an overview of their (simulated) portfolio.
- **Crypto Arcade**: A fun and engaging section with multiple mini-games where users can spend and earn virtual currency.
- **Virtual Wallet System**: Users start with a virtual balance, can "top up" their wallet, and spend virtual currency to play games.
- **AI-Powered Recommendations**: Utilizes Google's Genkit to provide personalized cryptocurrency investment suggestions based on user risk profiles and market data signals.
- **User Authentication**: A complete, session-based authentication flow (Login, Sign Up, Profile) using React Context.
- **Theming Engine**: Multiple customizable color themes (light and dark modes) to personalize the user experience.
- **Responsive Design**: A mobile-friendly interface built with ShadCN UI and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Authentication**: React Context with Session Storage
- **Data Fetching**: Native `fetch` API, SWR for client-side updates
- **Charts**: [Recharts](https://recharts.org/)
- **Deployment**: Firebase App Hosting

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Environment Variables

This project requires an API key from CryptoCompare to display the latest news articles.

1.  Get a free API key from [CryptoCompare](https://www.cryptocompare.com/cryptopian/api-keys).
2.  Create a file named `.env` in the root of the project.
3.  Add your API key to the `.env` file:

    ```
    CRYPTOCOMPARE_API_KEY=your_api_key_here
    ```

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## 📄 Pages & Functionality

- `/`: The landing page displaying the top 50 cryptocurrencies.
- `/dashboard`: A personalized dashboard for logged-in users.
- `/games`: The Crypto Arcade with a variety of games to play using virtual currency.
- `/trending`: Shows the latest trending coins on CoinGecko.
- `/exchanges`: A list of top cryptocurrency exchanges.
- `/nft`: A gallery of popular NFT collections.
- `/defi`: An overview of the DeFi space and top protocols.
- `/coin/[id]`: A detailed page for a specific cryptocurrency, including charts, market data, and an option to buy (simulation).
- `/login` & `/signup`: User authentication pages.
- `/profile`: User profile page to view and edit details.
- `/settings`: Page to change the application's theme and other settings.

---

***Disclaimer**: This is a demo application for educational purposes. The cryptocurrency data is real, but all transactions, wallet balances, and game rewards are virtual and have no real-world value. This is not financial advice.*
