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
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── microservices/      # Microservice components
│   ├── registry.ts     # Microservice registry
│   ├── general/        # General microservices
│   └── supply-chain/   # Supply chain microservices
├── pages/              # Page components
│   ├── Home.tsx        # Main dashboard
│   ├── Login.tsx       # Authentication page
│   ├── AppStore.tsx    # Microservice catalog
│   └── ...
├── services/           # External service integrations
│   └── database/       # Database services
│       └── mongodb.ts  # MongoDB integration
└── assets/             # Static assets
```

## 🔐 Authentication & Security

### Current Setup
- **Frontend Authentication**: JWT-based with localStorage persistence
- **Protected Routes**: All main routes require authentication
- **Session Management**: Automatic session restoration on app load
- **MongoDB Integration**: Ready for Azure/MongoDB backend integration

### Default Credentials (Development)
```
Admin: admin@supplychainai.com / admin123
User:  user@supplychainai.com / user123
```

### Security Best Practices

#### ⚠️ Important Security Notes

1. **Database Credentials**: Never store database credentials in frontend code in production
2. **JWT Tokens**: Current implementation uses mock tokens - replace with secure backend generation
3. **Password Hashing**: Passwords should be hashed on the backend before storage
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: This app doesn't use .env files - use Supabase for secure secret management

#### Production Security Checklist

- [ ] Implement backend authentication service (Azure AD recommended)
- [ ] Use secure password hashing (bcrypt, argon2)
- [ ] Implement JWT token validation on backend
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Set up proper error handling (don't expose sensitive info)
- [ ] Configure MongoDB connection with proper security

## 🗄️ Database Integration

### MongoDB Setup Options

**⚠️ Important**: Lovable doesn't support .env files or environment variables.

1. **Option 1 (Recommended - Supabase)**:
   - Connect to Supabase for secure credential management
   - Use Supabase Edge Functions for database operations
   - [Connect to Supabase](https://docs.lovable.dev/supabase-integration)

2. **Option 2 (Development Only)**:
   - Use the DatabaseConfig component to set credentials
   - Credentials stored in localStorage (not secure for production)

3. **Option 3 (Production)**:
   - Implement backend API with Azure services
   - Frontend calls secure backend endpoints
   - Backend handles MongoDB connections

### Configuration Steps

1. Navigate to the database configuration page
2. Enter your MongoDB connection details:
   - Connection String: `mongodb+srv://username:password@cluster.mongodb.net/`
   - Database Name: Your database name
   - Collection Name: Collection for user data (default: `users`)
3. Test the connection
4. Save configuration

### MongoDB Schema

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Design System

The application uses a custom design system built on:
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Custom Tokens**: Semantic color and spacing tokens

### Color Scheme
- Primary: Supply chain themed colors
- Background: Dark mode optimized
- Accent: Yellow highlights for important elements

## 🔧 Development

### Adding New Microservices

1. Create component in appropriate folder under `src/microservices/`
2. Add entry to `src/microservices/registry.ts`
3. Add corresponding image to `src/assets/`
4. Component will automatically appear in AppStore

### Folder Organization
- Keep components focused and single-purpose
- Use proper TypeScript interfaces
- Follow existing naming conventions
- Add proper error handling

## 🚀 Deployment

### Production Considerations

1. **Backend Services**:
   - Implement proper authentication backend with Azure AD
   - Set up secure database connections
   - Use Azure Key Vault for secrets

2. **Frontend Build**:
   - Configure proper base URL
   - Optimize bundle size
   - Set up CDN for assets

3. **Security**:
   - Enable HTTPS
   - Configure security headers
   - Implement proper CORS
   - Use Azure App Service or similar for hosting

## 📦 Dependencies

### Core
- React 18 + TypeScript
- Vite (build tool)
- React Router DOM (routing)
- Tailwind CSS (styling)

### UI Components
- Radix UI primitives
- Lucide React (icons)
- Shadcn/ui components

### State Management
- React Context API
- Local Storage for persistence

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Test authentication flows
5. Update documentation for new features

## 📄 License

This project is proprietary software for supply chain management.

---

**Security Reminder**: Always review and update security configurations before production deployment. Consider using Azure services for production-grade security and scalability.