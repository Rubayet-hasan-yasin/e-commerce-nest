# E-Commerce Backend API

A production-ready e-commerce backend built with NestJS, TypeORM, and PostgreSQL. Features versioned REST APIs, dual authentication systems (admin & customer), comprehensive order management, and automated image processing with Sharp.

## ✨ Key Features

### Authentication & Authorization
- **Admin Auth** - JWT-based authentication for admin users
- **Customer Auth** - Separate customer authentication with OTP support (email/phone)
- **Role-based Access** - Guards and decorators for route protection
- **Session Management** - Cookie-based sessions with secure token handling

### E-Commerce Core
- **Product Management** - Products with categories, sizes, variants, and stock tracking
- **Shopping Cart** - Persistent cart system with session support
- **Order Processing** - Complete order lifecycle (pending → processing → shipped → delivered)
- **Payment Tracking** - Payment entity with multiple payment method support
- **Address Management** - Customer shipping addresses with CRUD operations
- **Shipping Costs** - Dynamic shipping cost calculation

### Content & Marketing
- **Banner Management** - Promotional banners for homepage/categories
- **About Pages** - CMS-like content management
- **Contact Forms** - Customer inquiry handling
- **Dashboard Stats** - Admin analytics and KPIs

### File Management
- **Image Upload** - Single and multiple file uploads
- **Automatic Compression** - Sharp-based image optimization
- **Watermarking** - Automated watermark application
- **Three Storage Tiers** - Original, compressed, and watermarked versions

### Infrastructure
- **API Versioning** - URI-based versioning (v1)
- **Caching** - Redis integration (configurable)
- **CORS** - Configured for cross-origin requests
- **Swagger Docs** - Auto-generated API documentation at `/api/v1`
- **Database Migrations** - TypeORM migrations with pg_trgm extension
- **Docker Support** - Multi-stage Dockerfile included
- **Request Logging** - Custom middleware for all routes

## 🚀 Quick Start

```bash
# Clone repository
git clone <your-repo-url>
cd e-commerce-nest

# Install dependencies
npm install

# Configure environment
# Create .env file with required variables (see below)

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

Server will start at `http://localhost:3003` (default) with Swagger docs at `http://localhost:3003/api/v1`

## 🔐 Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3003
DOMAIN=http://localhost:3003

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:port/dbname  # Optional
DB_HOST=localhost
DB_PORT=5050
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=ecommerce_db
DATABASE_SSL_CA=  # SSL certificate path (optional for secure connections)

# JWT Authentication
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRED=24h

# Security
SALT_ROUNDS=10
API_KEY=your_api_key  # Optional for additional API security

# OTP Configuration
AUTH_OTP_EXPIRED=300  # OTP expiration in seconds (5 minutes)

# Redis Cache (Optional - currently disabled in config)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration (for OTP/notifications)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
RECIPIENT_EMAIL=admin@example.com
```

## 📦 Database Setup

```bash
# Run pending migrations
npm run migration:run

# Generate new migration after entity changes
npm run migration:generate -- -n DescriptiveMigrationName

# Note: Migration files are stored in src/migrations/
```

**Important:** The project includes a migration to enable PostgreSQL's `pg_trgm` extension for fuzzy text search and autocomplete features.

## 🛠️ Development

```bash
# Development mode with hot reload
npm run start:dev

# Debug mode
npm run start:debug

# Production build
npm run build
npm run start:prod

# Code quality
npm run lint        # ESLint
npm run format      # Prettier

# Testing
npm run test        # Unit tests
npm run test:watch  # Watch mode
npm run test:cov    # Coverage report
npm run test:e2e    # End-to-end tests
```

## 🐳 Docker Deployment

```bash
# Build image
docker build -t ecommerce-api .

# Run container
docker run -p 3000:3000 --env-file .env ecommerce-api
```

The Dockerfile uses multi-stage builds for optimized production images.

## 📁 Project Structure

```
e-commerce-nest/
├── src/
│   ├── modules/
│   │   ├── v1/                     # API Version 1 modules
│   │   │   ├── auth/               # Authentication & authorization
│   │   │   │   ├── auth.controller.ts      # Admin login/register/logout
│   │   │   │   ├── customer-auth.controller.ts  # Customer auth with OTP
│   │   │   │   ├── otp.controller.ts       # OTP send/verify endpoints
│   │   │   │   ├── guards/         # JWT & Role guards
│   │   │   │   ├── strategies/     # Passport JWT strategy
│   │   │   │   └── decorators/     # Custom decorators (@GetUser, @Public, @Roles)
│   │   │   ├── user/               # Admin user management
│   │   │   ├── customer/           # Customer profiles & management
│   │   │   ├── product/            # Products, categories, sizes
│   │   │   ├── order/              # Orders, order items, payments
│   │   │   ├── cart/               # Shopping cart operations
│   │   │   ├── address/            # Customer shipping addresses
│   │   │   ├── banner/             # Promotional banners
│   │   │   ├── contact/            # Contact form submissions
│   │   │   ├── dashboard/          # Admin analytics & stats
│   │   │   ├── about/              # About page content
│   │   │   └── shipping-cost/      # Shipping cost configuration
│   │   └── file-upload/            # Image upload & processing service
│   ├── config/
│   │   ├── database.config.ts      # TypeORM configuration
│   │   └── env.ts                  # Environment variables mapping
│   ├── helpers/
│   │   ├── bcrypt.helper.ts        # Password hashing utilities
│   │   └── jwt.helper.ts           # JWT token utilities
│   ├── middleware/
│   │   └── logger.middleware.ts    # Request logging
│   ├── migrations/                 # Database migration files
│   ├── interface/                  # TypeScript interfaces & types
│   ├── app.module.ts               # Root application module
│   ├── main.ts                     # Application entry point
│   └── data-source.ts              # TypeORM data source config
├── uploads/                        # File storage directory
│   ├── original/                   # Original uploaded images
│   ├── compressed/                 # Compressed versions
│   └── watermarked/                # Watermarked versions
├── test/                           # E2E test files
├── Dockerfile                      # Multi-stage Docker build
├── docker-compose.yml              # Docker Compose configuration (if exists)
└── package.json
```

## 🔌 API Endpoints Overview

All endpoints are prefixed with `/v1` for versioning.

### Authentication
- `POST /v1/auth/login` - Admin login
- `POST /v1/auth/register` - Admin registration
- `POST /v1/auth/logout` - Logout (clear tokens)
- `POST /v1/auth/customer/login` - Customer login (traditional)
- `POST /v1/auth/customer/login/otp` - Customer login with OTP
- `POST /v1/auth/customer/reset-password` - Password reset
- `POST /v1/auth/otp/send` - Send OTP
- `POST /v1/auth/otp/verify` - Verify OTP

### Products & Categories
- Products: Full CRUD operations
- Categories: Hierarchical category management
- Sizes: Product size variants with stock tracking

### Orders & Cart
- Cart operations (add, update, remove items)
- Order creation and status management
- Payment tracking

### Admin Features
- Dashboard statistics
- User management
- Content management (banners, about pages)
- Shipping cost configuration

**Full API documentation available at:** `http://localhost:3003/api/v1` (Swagger UI)

## 🧰 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | NestJS 11 |
| **Language** | TypeScript 5.8 |
| **Database** | PostgreSQL with TypeORM 0.3 |
| **Authentication** | Passport.js + JWT |
| **Validation** | class-validator, class-transformer |
| **File Processing** | Sharp (image compression/watermarking) |
| **Caching** | Redis with cache-manager-ioredis (optional) |
| **Email** | Nodemailer |
| **Security** | bcrypt, cookie-parser, CORS |
| **Documentation** | Swagger/OpenAPI |
| **Testing** | Jest, Supertest |
| **Code Quality** | ESLint, Prettier |
| **Build Tools** | SWC (faster TypeScript compilation) |

## 📝 Development Notes

### Image Upload Flow
1. Upload to `uploads/original/`
2. Automatic compression → `uploads/compressed/`
3. Watermark application → `uploads/watermarked/`
4. Files served via static route `/image/*`

### Authentication Flow
- **Admin:** JWT tokens with role-based guards
- **Customer:** Separate auth system with optional OTP verification
- Global JWT guard with `@Public()` decorator for open routes

### Database Extensions
- **pg_trgm:** Enabled for fuzzy text search and similarity matching in product searches

### Caching Strategy
- Redis configuration available but currently disabled
- In-memory cache active (60s TTL, max 100 items)
- Enable Redis by uncommenting config in `app.module.ts`


**Built with ❤️ using NestJS**
