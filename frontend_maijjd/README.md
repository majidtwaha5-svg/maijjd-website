# Maijjd Frontend

A modern, responsive React application for the Maijjd platform, built with TypeScript and Tailwind CSS, optimized for Vercel deployment.

## 🚀 Features

- **React 18** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Responsive Design** - Mobile-first approach
- **AI Integration** - Chat functionality with backend
- **Authentication** - User login/registration system
- **Modern UI/UX** - Beautiful, accessible components
- **PWA Ready** - Progressive Web App capabilities

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Vercel Account** (for deployment)
- **Railway Backend** (already deployed)

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd frontend_maijjd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **For development on different port:**
   ```bash
   npm run start:3001
   ```

### Production Deployment

This frontend is optimized for Vercel deployment:

1. **Connect to Vercel:**
   - Link your GitHub repository
   - Vercel will auto-detect React app
   - Configure build settings

2. **Environment Variables:**
   - Set `REACT_APP_API_URL` to your Railway backend
   - Configure any additional variables

3. **Deploy:**
   - Vercel automatically deploys on push to main branch
   - Preview deployments for pull requests

## 📡 API Integration

### Backend Connection

The frontend connects to the Railway backend:

- **Base URL**: `https://maijjd-backend-production-ad65.up.railway.app`
- **API Endpoint**: `/api`
- **Health Check**: `/api/health`

### Environment Configuration

```env
# API Configuration
REACT_APP_API_URL=https://maijjd-backend-production-ad65.up.railway.app/api

# Development Configuration
PORT=3000

# Additional Configuration
REACT_APP_ANALYTICS_ID=your_analytics_id
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

## 📦 Dependencies

### Core Dependencies
- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **react-scripts** - Create React App scripts
- **typescript** - Type safety

### UI & Styling
- **tailwindcss** - Utility-first CSS framework
- **lucide-react** - Beautiful icons
- **autoprefixer** - CSS vendor prefixes
- **postcss** - CSS processing

### HTTP & Data
- **axios** - HTTP client
- **file-saver** - File download functionality
- **jszip** - ZIP file handling

### Development
- **@testing-library/react** - React testing utilities
- **@testing-library/jest-dom** - Jest DOM matchers
- **@testing-library/user-event** - User event simulation

## 🏗️ Project Structure

```
frontend_maijjd/
├── public/                 # Static assets
│   ├── index.html         # Main HTML file
│   ├── manifest.json      # PWA manifest
│   └── logo.svg           # App logo
├── src/                   # Source code
│   ├── components/        # Reusable components
│   │   ├── Navbar.js      # Navigation component
│   │   ├── AIAssistant.js # AI chat component
│   │   ├── AIChat.js      # Chat interface
│   │   └── ...           # Other components
│   ├── pages/            # Page components
│   │   ├── Home.js       # Home page
│   │   ├── About.js      # About page
│   │   ├── Services.js   # Services page
│   │   ├── Software.js   # Software page
│   │   ├── Dashboard.js  # User dashboard
│   │   ├── Contact.js    # Contact page
│   │   ├── AIDevelopment.js # AI development page
│   │   ├── AIChatDemo.js # AI chat demo
│   │   ├── Billing.js    # Billing page
│   │   └── ResetPassword.js # Password reset
│   ├── contexts/         # React contexts
│   │   └── AuthContext.js # Authentication context
│   ├── hooks/            # Custom React hooks
│   │   └── useApi.js     # API hook
│   ├── services/         # API services
│   │   └── api.js        # API service layer
│   ├── App.js            # Main App component
│   ├── index.js          # Entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── vercel.json           # Vercel deployment config
├── .vercelignore         # Vercel ignore rules
└── README.md            # This file
```

## 🌐 Vercel Deployment

### Automatic Deployment
1. **Connect Repository:**
   - Link your GitHub repository to Vercel
   - Vercel will auto-detect React app

2. **Configure Settings:**
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables:**
   - Set `REACT_APP_API_URL`
   - Configure any additional variables

4. **Deploy:**
   - Vercel automatically deploys on push to main branch
   - Preview deployments for pull requests
   - Automatic rollback on failure

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🎨 UI Components

### Navigation
- **Responsive Navbar** - Mobile-friendly navigation
- **Breadcrumbs** - Page navigation
- **Sidebar** - Collapsible menu

### Forms
- **Contact Form** - User contact submission
- **Login Form** - User authentication
- **Registration Form** - User signup
- **Password Reset** - Password recovery

### AI Integration
- **AI Chat Interface** - Real-time chat with AI
- **Chat Demo** - Public AI chat demo
- **Voice Input** - Voice-to-text functionality

### Content
- **Service Cards** - Service showcase
- **Software Gallery** - Software portfolio
- **Dashboard Widgets** - User dashboard components

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1024px
- **Desktop**: 1025px+

### Mobile-First Approach
- Touch-friendly interfaces
- Optimized for mobile performance
- Progressive enhancement

## 🔒 Security

### Authentication
- JWT token management
- Secure token storage
- Automatic token refresh
- Protected routes

### API Security
- CORS configuration
- HTTPS enforcement
- Input validation
- XSS protection

### Environment Variables
- Sensitive data in environment variables
- No hardcoded secrets
- Secure API key management

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern=App.test.js
```

### Testing Tools
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **User Event** - User interaction simulation

## 📈 Performance

### Optimization
- **Code Splitting** - Lazy loading of components
- **Bundle Optimization** - Minimized bundle size
- **Image Optimization** - Compressed images
- **Caching** - Browser caching strategies

### Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

## 🚨 Error Handling

### Error Boundaries
- React error boundaries
- Graceful error recovery
- User-friendly error messages

### API Error Handling
- Network error handling
- Retry logic for failed requests
- User feedback for errors

### Form Validation
- Client-side validation
- Real-time feedback
- Accessibility compliance

## 🔄 State Management

### React Context
- **AuthContext** - Authentication state
- **ThemeContext** - Theme management
- **LoadingContext** - Loading states

### Local State
- Component-level state
- Form state management
- UI state handling

## 📚 API Documentation

### Service Layer
The `services/api.js` file provides:
- Centralized API calls
- Request/response interceptors
- Error handling
- Authentication headers

### API Methods
```javascript
// Authentication
apiService.login(credentials)
apiService.register(userData)
apiService.getProfile()

// Services
apiService.getServices()
apiService.submitContact(data)

// AI Integration
apiService.aiChat(message, software)
apiService.demoAiChat(message, software)

// Payments
apiService.getPlans()
apiService.startCheckout(planId)
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new features**
5. **Submit a pull request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new components
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README first
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: Contact the development team

### Common Issues
- **Build fails**: Check Node.js version and dependencies
- **API connection**: Verify `REACT_APP_API_URL`
- **Styling issues**: Check Tailwind CSS configuration
- **Vercel deployment**: Check build logs and environment variables

## 🔗 Links

- **Live Frontend**: https://maijjd-frontend.vercel.app
- **Backend API**: https://maijjd-backend-production-ad65.up.railway.app
- **API Health Check**: https://maijjd-backend-production-ad65.up.railway.app/api/health
- **GitHub Repository**: [Your Repository URL]
- **Vercel Dashboard**: [Your Vercel Project URL]

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Deploy to Vercel
vercel --prod
```

---

**Built with ❤️ by the Maijjd Development Team**