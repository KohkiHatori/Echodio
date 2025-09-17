# Echodio 

> **AI-Powered Ambient Work Environment** - A responsive web application that creates dynamic, personalized study/work environments by generating contextual music and background imagery using artificial intelligence.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.8.1-orange?style=flat&logo=firebase)](https://firebase.google.com/)

## 🌟 Overview

Echodio is an innovative web application inspired by the popular "Lofi Girl" concept, designed to enhance productivity and focus through AI-generated ambient experiences. The application dynamically adapts its musical atmosphere and visual aesthetics based on real-time environmental factors including weather conditions, time of day, and geographical location.

** Live Demo:** [Watch Demo Video](https://www.youtube.com/watch?v=1h2ezTZUQog)

[![Echodio Demo](https://img.youtube.com/vi/1h2ezTZUQog/maxresdefault.jpg)](https://www.youtube.com/watch?v=1h2ezTZUQog)

##  Key Features

### 🤖 AI-Driven Content Generation
- **Dynamic Music Generation**: Leverages Suno AI (via GoAPI) to create instrumental tracks tailored to current weather, time, and location
- **Contextual Background Images**: Uses Midjourney API to generate atmospheric visuals that complement the musical mood
- **Automated Prompt Engineering**: Intelligent system that crafts optimized prompts based on environmental data

### 🌍 Environmental Adaptation
- **Real-time Weather Integration**: OpenWeatherMap API integration for location-based weather data
- **Time-Sensitive Theming**: Automatic adaptation to different times of day (morning, afternoon, evening, night)
- **Location-Aware Experience**: GPS-based personalization for truly contextual content

### 🎨 Advanced UI/UX
- **Responsive Design**: Fully responsive interface built with Tailwind CSS
- **Real-time Audio Visualization**: Custom spectral analyzer with interactive waveform display
- **Dynamic Color Theming**: Automatic color extraction from generated images for cohesive visual experience
- **Smooth Animations**: Framer Motion integration for polished transitions and interactions

### 🎵 Professional Audio Features
- **Seamless Playback Management**: Custom audio queue system with crossfading
- **Volume Control & EQ**: Interactive volume controls with visual feedback
- **Progress Tracking**: Real-time playback progress with seeking functionality
- **Auto-advance Queue**: Intelligent playlist management with smooth transitions

### 👤 User Experience
- **Authentication System**: Firebase Authentication for personalized experiences
- **Favorites Management**: Save and replay preferred music/image combinations
- **Genre Selection**: Choose from Lofi, Ambient, Chillhop, Jazz, and more
- **Idle UI Management**: Smart UI hiding for distraction-free focus sessions

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.3.2** - React framework with App Router
- **React 19.1.0** - Component-based UI library
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion 12.15.0** - Animation library

### **Backend & APIs**
- **Next.js API Routes** - Serverless backend functions
- **Firebase Authentication** - User management
- **Firebase Firestore** - NoSQL database for favorites
- **OpenWeatherMap API** - Weather data integration
- **GoAPI/Suno AI** - Music generation service
- **Midjourney API** - Image generation service

### **Audio & Visual Processing**
- **Web Audio API** - Advanced audio processing and visualization
- **Canvas API** - Custom spectral analyzer rendering
- **K-Means Clustering** - Dominant color extraction from images

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun package manager
- API keys for required services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/echodio.git
   cd echodio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Weather API
   WEATHER_API_KEY=your_openweathermap_api_key
   
   # AI Generation API
   GO_API_KEY=your_goapi_key
   
   # Firebase Configuration (if using authentication)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes for external services
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── Background.tsx     # Dynamic background management
│   ├── SpectralAnalyzer.tsx # Audio visualization
│   ├── Sidebar.tsx        # Navigation and controls
│   └── ...
├── hooks/                 # Custom React hooks
│   ├── useGenerate.ts     # AI content generation
│   ├── useAudioPlaybackManager.ts # Audio control
│   └── ...
├── lib/                   # Utility functions
│   ├── generateMusic.ts   # Music generation logic
│   ├── generateImage.ts   # Image generation logic
│   └── ...
├── context/               # React context providers
└── services/              # External service integrations
```

## 🎯 Core Features Deep Dive

### AI Content Generation Pipeline
The application uses a sophisticated pipeline that:
1. Captures user location and current time
2. Fetches real-time weather data
3. Generates contextual prompts for AI services
4. Creates music and imagery that harmonize with environmental conditions
5. Applies dynamic color theming based on generated content

### Real-time Audio Processing
- Custom Web Audio API implementation
- Real-time frequency analysis and visualization
- Smooth crossfading between tracks
- Interactive EQ controls (planned feature)

### Desktop-Optimized Design System
- Desktop-first approach optimized for productivity workflows
- Immersive full-screen experience with Tailwind CSS
- Keyboard shortcuts and mouse interactions for power users
- Optimized for large screens and extended focus sessions

## 🔮 Future Enhancements

- **Apple Watch Integration**: Heart rate-based mood estimation
- **Social Features**: Share favorite combinations with friends
- **Advanced AI Prompting**: More sophisticated environmental analysis
- **Offline Mode**: Cached content for uninterrupted experience
- **Custom Genre Training**: User-specific AI model fine-tuning
