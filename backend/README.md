# Supply Chain AI Backend

A production-ready FastAPI backend with MongoDB authentication integration.

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB credentials
   ```

3. **Run Server**
   ```bash
   python main.py
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name | `n8n_Test` |
| `COLLECTION_NAME` | Users collection name | `n8n_Users` |
| `JWT_SECRET` | JWT secret key | ⚠️ Change in production |
| `JWT_EXPIRES_IN_HOURS` | Token expiration | `24` |
| `PORT` | Server port | `8080` |

## MongoDB User Schema

Users are stored with this exact structure:

```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password_hash": "$2b$12$...",
  "name": "User Name", 
  "role": "admin|user",
  "is_active": true,
  "created_at": ISODate("..."),
  "updated_at": ISODate("..."),
  "last_login": ISODate("...")
}
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/test-connection` - Test database connection
- `GET /api/auth/verify-token` - Verify JWT token
- `GET /api/auth/refresh-token` - Refresh JWT token
- `GET /health` - Health check

## Production Deployment

1. Set strong `JWT_SECRET`
2. Use MongoDB Atlas or secured MongoDB instance
3. Configure proper CORS origins
4. Use HTTPS in production
5. Set `ENVIRONMENT=production`

## Development

Run with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```