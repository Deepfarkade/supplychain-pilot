# Supply Chain AI Studio

A modern React-based application for supply chain management with AI-powered microservices.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── AppCard.tsx      # Application card component  
│   ├── AppHeader.tsx    # Main header component
│   ├── ProtectedRoute.tsx # Route protection
│   └── SessionTimeoutModal.tsx # Session timeout warning
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── security/            # Security & authentication
│   ├── auth.ts          # Main authentication service
│   ├── jwt.ts           # JWT token management
│   ├── session.ts       # Session timeout handling
│   └── types.ts         # Security type definitions
├── services/            # External service integrations
│   └── database/        # Database services
│       └── mongodb.ts   # MongoDB integration
├── microservices/       # Microservice components
│   ├── registry.ts      # Microservice registry
│   ├── general/         # General microservices
│   └── supply-chain/    # Supply chain microservices
├── pages/               # Page components
│   ├── Home.tsx         # Main dashboard
│   ├── Login.tsx        # Authentication page
│   ├── AppStore.tsx     # Microservice catalog
│   └── Settings.tsx     # Application settings
└── assets/              # Static assets
```

## 🔐 Security & Authentication

### Production-Grade Security Features

- **JWT Token Management**: Secure token generation, validation, and refresh
- **Session Timeout**: 20-minute idle timeout with 2-minute warning
- **Activity Tracking**: Automatic session extension on user activity
- **Multi-Strategy Authentication**: MongoDB → Environment → Fallback
- **Concurrent User Support**: Designed for multiple simultaneous users
- **Automatic Token Refresh**: Seamless token renewal before expiration

### Authentication Flow

1. **Login Attempt**: User provides credentials
2. **Strategy Selection**: 
   - Primary: MongoDB authentication (production)
   - Fallback 1: Environment variables (PC deployment)
   - Fallback 2: Dummy credentials (development)
3. **JWT Generation**: Secure token with 20-minute expiration
4. **Session Management**: Activity tracking and timeout handling
5. **Automatic Refresh**: Token renewal 5 minutes before expiry

### Default Credentials (Development)
```
Admin: admin@supplychainai.com / admin123
User:  user@supplychainai.com / user123
```

### Session Management

- **Idle Timeout**: 20 minutes of inactivity
- **Warning Period**: 2-minute countdown with modal
- **Activity Events**: Mouse, keyboard, scroll, touch interactions
- **Automatic Extension**: Activity resets the timeout timer
- **Graceful Logout**: Clean session termination and storage cleanup

## 🗄️ Database Integration

### Deployment Strategies

**Development (Lovable):**
- Uses localStorage for MongoDB configuration
- Falls back to dummy credentials
- Session state persisted in browser

**Production (PC Deployment):**
- Environment variables for database credentials
- Secure server-side authentication
- Redis/database session storage

### MongoDB Configuration

```javascript
// Required Environment Variables (PC deployment)
MONGODB_CONNECTION_STRING=mongodb+srv://...
MONGODB_DATABASE_NAME=supplychainai
MONGODB_COLLECTION_NAME=users
JWT_SECRET_KEY=your-secure-secret-key
SESSION_SECRET=your-session-secret
```

### Database Schema

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  name: String,
  role: String (enum: 'admin', 'user'),
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  isActive: Boolean
}
```

## ⚡ Performance & Scalability

### Optimizations

- **Lazy Loading**: Components loaded on demand
- **Token Caching**: JWT tokens cached with automatic refresh
- **Activity Debouncing**: Efficient activity tracking
- **Memory Management**: Proper cleanup of timers and listeners
- **Concurrent Sessions**: Support for multiple active users

### Production Considerations

- **Load Balancing**: Stateless JWT enables horizontal scaling
- **Session Storage**: Redis for production session management
- **Rate Limiting**: API rate limiting for security
- **CDN Integration**: Asset delivery optimization
- **Database Indexing**: Optimized queries with proper indexes

## 🎨 Design System

Built with modern UI components:
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: High-quality React components
- **Smooth Animations**: CSS transitions and micro-interactions
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Theme switching capability

## 🔧 Development

### Adding New Microservices

1. Create component in `src/microservices/{domain}/{service}/`
2. Add entry to `src/microservices/registry.ts`
3. Add corresponding image to `src/assets/`
4. Component automatically appears in AppStore

### Security Best Practices

1. **Token Security**:
   - Use HTTPS in production
   - Implement proper CORS
   - Store JWT securely (httpOnly cookies in production)

2. **Session Management**:
   - Configure appropriate timeout values
   - Implement proper cleanup
   - Monitor session activity

3. **Database Security**:
   - Use connection pooling
   - Implement query validation
   - Enable MongoDB authentication

## 🚀 Deployment

### Lovable Deployment
```bash
# Publish to Lovable hosting
Click "Publish" in Lovable interface
```

### PC/Server Deployment
```bash
# Build for production
npm run build

# Set environment variables
export MONGODB_CONNECTION_STRING="..."
export JWT_SECRET_KEY="..."

# Start production server
npm run preview
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## 📊 Monitoring & Analytics

### Session Analytics
- Track user login patterns
- Monitor session duration
- Analyze timeout rates
- User activity metrics

### Security Monitoring
- Failed login attempts
- Token refresh patterns
- Session timeout events
- Concurrent user tracking

## 🤝 Contributing

1. Follow security-first development
2. Test authentication flows thoroughly
3. Update security documentation
4. Validate session management
5. Test concurrent user scenarios

## 📄 License

This project is proprietary software for supply chain management.

---

**Security Note**: This system is designed for production use with proper backend infrastructure. The fallback mechanisms ensure development continuity while maintaining security standards.