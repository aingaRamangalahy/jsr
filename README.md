# JS Resources

A platform to discover, share, and recommend JavaScript learning resources for developers of all skill levels.

![JS Resources Screenshot](https://via.placeholder.com/800x400?text=JS+Resources+Screenshot)

## 🌟 Features

- **Resource Discovery**: Browse a curated collection of JavaScript learning materials including websites, books, YouTube channels, and more
- **Dark/Light Mode**: Seamlessly switch between themes with a daily.dev inspired dark theme
- **Filtering System**: Find exactly what you need with multiple filtering options
- **Framework Filters**: Quickly find resources related to specific frameworks (React, Vue, Angular, etc.)
- **Responsive Design**: Works great on both desktop and mobile devices

# comming soon
- **Add Resources**: Contribute by adding your favorite JavaScript learning materials

## 🛠️ Tech Stack

### Frontend
- Vue 3 with Composition API
- TypeScript
- Tailwind CSS
- PrimeVue (UI components)
- Pinia (State management)
- Vite (Build system)

### Backend
- Node.js
- Express
- TypeScript
- Docker for containerization

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose (for containerized deployment)

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

### Docker Deployment

The project includes Docker configuration for easy deployment:
```bash
#Build and start both frontend and backend
docker compose up -d

#Stop services
docker compose down
```

### 🔧 Configuration
The application uses the following ports:
- Frontend: Port 80
- Backend API: Port 3000

### 📄 License
This project is licensed under the ISC License

### 🙏 Acknowledgements
Vue.js
Tailwind CSS
PrimeVue
Express
daily.dev (inspiration)