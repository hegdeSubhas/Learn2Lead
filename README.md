# Learn2Lead: Empowering Rural Students

Learn2Lead is a comprehensive web platform designed to bridge the opportunity gap for students in rural areas. It provides personalized guidance, educational resources, and direct connections to experienced mentors, helping students navigate their academic and professional journeys successfully.

## Core Features

The platform is divided into two main user roles: **Student** and **Mentor**, each with a tailored set of tools and features.

### For Students

*   **Dashboard**: A centralized hub displaying recent announcements and new quizzes from connected mentors.
*   **AI Mentor**: An interactive, voice-enabled chatbot providing personalized guidance on career paths, skill development, and academic questions.
*   **Career Roadmap Generator**: An AI-powered tool that creates a step-by-step roadmap for a chosen career path, tailored to the student's interests.
*   **Opportunities**: A live feed of job and internship opportunities, powered by an external API.
*   **Scholarships**: A curated list of scholarships available to Indian students.
*   **Quiz Center**: Take quizzes assigned by mentors to test knowledge and skills.
*   **Learning Resources**: Access a rich collection of study materials, video tutorials, and an AI-powered tool to find tutorials on any topic.
*   **Find a Mentor**: Browse profiles of available mentors and send connection requests.

### For Mentors

*   **Dashboard**: An overview of pending student connection requests.
*   **My Content**: A dedicated space to create and manage educational content.
    *   **Create Quizzes**: Build custom quizzes manually for students.
    *   **Create Announcements**: Post updates and messages for all connected students.
*   **Student Requests**: A page to review, accept, or reject mentorship requests from students.
*   **View Submissions**: Track student performance by viewing scores and submission details for each quiz created.

## Technology Stack

This application is built with a modern, robust, and scalable technology stack:

*   **Framework**: [Next.js](https://nextjs.org/) with the App Router
*   **Database**: [Supabase](https://supabase.io/) (PostgreSQL with authentication and real-time capabilities)
*   **Generative AI**: [Google's Gemini models](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Deployment**: Ready for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Project Setup

To run this project locally, follow these steps.

### 1. Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. You can get the Supabase keys from your Supabase project dashboard under `Project Settings > API`.

```
# Supabase keys
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Google AI (Gemini) API Key
# Get this from Google AI Studio: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

**Optional Keys for External Services:**

*   `YOUTUBE_API_KEY`: For fetching videos on the Resources page.
*   `RAPID_INTERNSHIP_API_KEY` and `RAPID_INTERNSHIP_API_HOST`: For fetching live job/internship data.
*   `GOOGLE_CUSTOM_SEARCH_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID`: For the AI Mentor's search tool.

If these optional keys are not provided, the application will gracefully fall back to using mock data.

### 2. Database Setup

The application relies on a specific database schema, including tables, row-level security policies, and helper functions. The necessary SQL scripts have been provided throughout the development process. Ensure they are all executed in your Supabase SQL Editor to set up the database correctly.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
