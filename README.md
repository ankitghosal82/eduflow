# EduFlow - Personalized Learning Paths

EduFlow is a personalized learning path application designed to help users track their progress through various topics, earn points, and level up as they gain knowledge. This application focuses purely on content delivery and progress tracking, without user authentication.

## Features

-   **Personalized Learning Paths**: Explore predefined learning paths across various topics.
-   **Progress Tracking**: Mark course items as complete and track your overall progress.
-   **Gamification**: Earn points and level up as you complete learning items.
-   **Multi-language Support**: Content available in multiple languages.
-   **Search and Filter**: Easily find topics by searching and filtering by difficulty.
-   **Responsive Design**: Optimized for various screen sizes.

## Getting Started

Follow these steps to set up and run the EduFlow application locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or Yarn

### Installation

1.  **Clone the repository**:
    \`\`\`bash
    git clone https://github.com/your-username/eduflow.git
    cd eduflow
    \`\`\`

2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Run the development server**:
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Contains Next.js App Router pages and layouts.
-   `components/`: Reusable React components, including Shadcn UI components.
-   `lib/`: Utility functions, Supabase client setup (though authentication is removed, the client setup remains for potential future data interactions), and i18n configurations.
-   `public/`: Static assets like images.
-   `scripts/`: Database initialization scripts (if any, though not directly used for this version without auth).

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
