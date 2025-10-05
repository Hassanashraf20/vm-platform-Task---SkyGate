# SkyGate VM Platform

A robust microservices-based platform for virtual machine management with secure authentication.

## 📋 Project Overview

SkyGate is a comprehensive VM management platform built with a microservices architecture. The system consists of three main components:

1. **Auth Service**: Handles user authentication and authorization
2. **Machine Service**: Manages VM provisioning and lifecycle
3. **API Gateway**: Routes requests and provides a unified API interface

## 🏗️ System Architecture

The platform follows a microservices architecture pattern with:

- **Decoupled Services**: Each service has its own database and business logic
- **API Gateway**: Single entry point for all client requests
- **JWT Authentication**: Secure token-based authentication system
- **Asynchronous Processing**: Non-blocking VM provisioning

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│   Client    │─────▶│ API Gateway │─────▶│ Auth Service│
│             │      │             │      │             │
└─────────────┘      └──────┬──────┘      └─────────────┘
                            │                    ▲
                            ▼                    │
                     ┌─────────────┐            │
                     │   Machine   │            │
                     │   Service   │────────────┘
                     │             │
                     └─────────────┘
```

## 🔐 Auth Service

The authentication service provides secure user management:

- User registration and login
- JWT token generation and validation
- Refresh token management
- Role-based access control

### Key Features:
- Secure password hashing
- Token-based authentication
- Refresh token rotation
- User profile management

## 🖥️ Machine Service

The VM management service handles all aspects of virtual machine lifecycle:

- VM creation with asynchronous provisioning
- VM listing with pagination support
- Status management (provisioning → running/failed)
- Idempotency with duplicate hostname prevention

### Key Features:
- Asynchronous VM provisioning
- Pagination for efficient VM listing
- Status tracking and updates
- Data consistency mechanisms

## 🌐 API Gateway

The API gateway serves as the entry point for all client requests:

- Request routing to appropriate microservices
- JWT authentication and validation
- User context propagation
- Unified error handling

### Key Features:
- Centralized authentication
- Request routing
- Response transformation
- Error standardization

## 📊 Database Schemas

### Auth Service Database
- **Users**: id, username, email, password, role, created_at, updated_at
- **Tokens**: id, user_id, refresh_token, expires_at, created_at

### Machine Service Database
- **VMs**: id, hostname, status, owner_id, specs, created_at, updated_at
- **VM_Logs**: id, vm_id, action, status, message, created_at

## 🔌 API Endpoints

### Auth Service
- `POST /auth/register` - Register new user
- `POST /auth/login` - Authenticate user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile

### Machine Service
- `POST /machines` - Create new VM
- `GET /machines` - List VMs with pagination

### API Gateway
- `POST /api/auth/*` - Auth service routes
- `POST /api/machines/*` - Machine service routes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (for Auth and Machine services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skygate-vm-platform.git
cd skygate-vm-platform
```

2. Install dependencies for each service:
```bash
# Auth Service
cd auth-service
npm install

# Machine Service
cd ../machine-service
npm install

# API Gateway
cd ../api-gateway
npm install
```

3. Configure environment variables:
Create `.env` files in each service directory with appropriate configuration.

4. Start the services:
```bash
# Start Auth Service
cd auth-service
npm run start:dev

# Start Machine Service
cd ../machine-service
npm run start:dev

# Start API Gateway
cd ../api-gateway
npm run start:dev
```

## 🧪 Testing

### API Testing Examples
- Postman Published Collection
- https://documenter.getpostman.com/view/28448135/2sB3QGvC7u

## 🛠️ Design Decisions & Trade-offs

### Microservices Architecture
- **Pros**: Scalability, technology diversity, fault isolation
- **Cons**: Increased complexity, distributed system challenges

### JWT Authentication
- **Pros**: Stateless, scalable, cross-domain capable
- **Cons**: Token size, revocation challenges

### Asynchronous VM Provisioning
- **Pros**: Non-blocking, better user experience, scalable
- **Cons**: Complexity in status tracking, eventual consistency

## 🔒 Security Considerations

- JWT tokens with appropriate expiration
- Password hashing with bcrypt
- HTTPS for all communications
- Input validation and sanitization
- Rate limiting on authentication endpoints
- Role-based access control

## 📈 Scalability Strategies

- Horizontal scaling of individual services
- Database sharding for high-volume services
- Caching layer for frequently accessed data
- Load balancing across service instances
- Message queues for asynchronous processing

## 🔧 Troubleshooting

### Common Issues

#### Services won't start
- Check if MongoDB is running
- Verify environment variables are set correctly
- Ensure ports are not in use by other applications

#### Authentication failures
- Verify token expiration
- Check if user exists in the database
- Ensure correct password is being used

#### VM creation issues
- Check machine service logs for errors
- Verify user has appropriate permissions
- Ensure hostname is unique

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Mssql-DB]
- [JWT.io](https://jwt.io/)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.