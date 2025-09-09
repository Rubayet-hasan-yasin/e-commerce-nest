<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

---

# E-Commerce Backend

A production-ready backend system for e-commerce platforms, built with NestJS, TypeORM, and PostgreSQL. It includes secure authentication, user and product management, and environment-based configuration with SSL-ready database connections.

---

## 🚀 Features

- Modular NestJS architecture
- PostgreSQL + TypeORM integration
- JWT-based authentication and authorization
- Secure password hashing with bcrypt
- Static file serving
- Swagger API documentation
- Image handling with `sharp`
- E2E and unit testing with Jest
- Database migrations
- Environment-based configuration
- SSL-enabled database support

---

## 📦 Project Setup

```bash
git clone https://your-repo-url.git
cd e-commerce
npm install
```

## 🔐 Environment Variables

Create a .env file in the root directory and include the following values:

```bash
NODE_ENV=development
PORT=8000
DB_HOST=localhost
DB_PORT=5234
DB_USERNAME=pg
DB_PASSWORD=123456
DB_NAME=defaultdb
JWT_SECRET=your_dev_secret_key
JWT_EXPIRED=24h
SALT_ROUNDS=10
DOMAIN=http://localhost:8000
AUTH_OTP_EXPIRED=300
DATABASE_SSL_CA=SSL Certificate(Optional if requerded)
```

🛡️ SSL Certificate (for DB) (Optional)

---

## 🧱 Database Migrations ()

This migration enables the pg_trgm extension in PostgreSQL, which is very useful for fuzzy text search (e.g., similarity matching, autocomplete, etc.).

```
# Run migrations
npm run migration:run

# Generate migration
npm run migration:generate -- -n YourMigrationName
```

---

## 🛠️ Compile and Run the Project

```
# Start in development
npm run start:dev

# Watch mode
npm run start:debug

# Production build and run
npm run build
npm run start:prod
```

## 🧪 Run Tests

```
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📜 Scripts

---

| Script             | Description                 |
| ------------------ | --------------------------- |
| start              | Start app                   |
| start:dev          | Start with watch mode (dev) |
| start:prod         | Run production build        |
| build              | Build the app               |
| lint               | Run ESLint                  |
| format             | Format code with Prettier   |
| test               | Run unit tests              |
| test:e2e           | Run E2E tests               |
| test:cov           | Coverage report             |
| migration:run      | Apply database migrations   |
| migration:generate | Generate new migration      |

# 📂 Project Structure

```
├───src
│   │   app.module.ts
│   │   data-source.ts
│   │   main.ts
│   │
│   ├───about
│   │   │   about.controller.spec.ts
│   │   │   about.controller.ts
│   │   │   about.module.ts
│   │   │   about.service.spec.ts
│   │   │   about.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-about.dto.ts
│   │   │       update-about.dto.ts
│   │   │
│   │   └───entities
│   │           about.entity.ts
│   │
│   ├───address
│   │   │   address.controller.spec.ts
│   │   │   address.controller.ts
│   │   │   address.module.ts
│   │   │   address.service.spec.ts
│   │   │   address.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-address.dto.ts
│   │   │       update-address.dto.ts
│   │   │
│   │   └───entities
│   │           address.entity.ts
│   │
│   ├───auth
│   │   │   auth.controller.spec.ts
│   │   │   auth.controller.ts
│   │   │   auth.module.ts
│   │   │   auth.service.spec.ts
│   │   │   auth.service.ts
│   │   │   customer-auth.controller.ts
│   │   │   customer-auth.service.ts
│   │   │   otp.controller.ts
│   │   │   otp.service.ts
│   │   │
│   │   ├───decorators
│   │   │       get-user.decorator.ts
│   │   │       public.decorator.ts
│   │   │       roles.decorator.ts
│   │   │
│   │   ├───dto
│   │   │       login-with-otp.dto.ts
│   │   │       login.dto.ts
│   │   │       register.dto.ts
│   │   │       reset-password.dto.ts
│   │   │       send-otp.dto.ts
│   │   │       verify-otp.dto.ts
│   │   │
│   │   ├───entities
│   │   │       auth.entity.ts
│   │   │       auth.otp.entity.ts
│   │   │
│   │   ├───guards
│   │   │       jwt-auth.guard.ts
│   │   │       roles.guard.ts
│   │   │
│   │   └───strategies
│   │           jwt.strategy.ts
│   │
│   ├───banner
│   │   │   banner.controller.spec.ts
│   │   │   banner.controller.ts
│   │   │   banner.module.ts
│   │   │   banner.service.spec.ts
│   │   │   banner.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-banner.dto.ts
│   │   │
│   │   └───entities
│   │           banner.entity.ts
│   │
│   ├───config
│   │       database.config.ts
│   │       env.ts
│   │
│   ├───contact
│   │   │   contact.controller.spec.ts
│   │   │   contact.controller.ts
│   │   │   contact.module.ts
│   │   │   contact.service.spec.ts
│   │   │   contact.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-contact.dto.ts
│   │   │       update-contact.dto.ts
│   │   │
│   │   └───entities
│   │           contact.entity.ts
│   │
│   ├───customer
│   │   │   customer.controller.spec.ts
│   │   │   customer.controller.ts
│   │   │   customer.module.ts
│   │   │   customer.service.spec.ts
│   │   │   customer.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-customer.dto.ts
│   │   │       update-customer.dto.ts
│   │   │
│   │   └───entities
│   │           customer.entity.ts
│   │
│   ├───dashboard
│   │   │   dashboard.controller.spec.ts
│   │   │   dashboard.controller.ts
│   │   │   dashboard.module.ts
│   │   │   dashboard.service.spec.ts
│   │   │   dashboard.service.ts
│   │   │
│   │   └───dto
│   │           dashboard-card.dto.ts
│   │
│   ├───file-upload
│   │       file-upload.controller.spec.ts
│   │       file-upload.controller.ts
│   │       file-upload.module.ts
│   │       file-upload.service.spec.ts
│   │       file-upload.service.ts
│   │
│   ├───helpers
│   │       bcrypt.helper.ts
│   │       helper.module.ts
│   │       jwt.helper.ts
│   │
│   ├───interface
│   │       ProductInput.interface.ts
│   │       SizeInput.interface.ts
│   │       user-info.type.ts
│   │
│   ├───middleware
│   │       logger.middleware.ts
│   │
│   ├───migrations
│   │       1750652326871-EnablePgTrgmExtension.ts
│   │
│   ├───order
│   │   │   order.controller.spec.ts
│   │   │   order.controller.ts
│   │   │   order.module.ts
│   │   │   order.service.spec.ts
│   │   │   order.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-order-item.dto.ts
│   │   │       create-order.dto.ts
│   │   │       customer.dto.ts
│   │   │       update-order-status.dto.ts
│   │   │
│   │   └───entities
│   │           order-item.entity.ts
│   │           order.entity.ts
│   │           payment.entity.ts
│   │
│   ├───product
│   │   │   category.controller.ts
│   │   │   category.service.ts
│   │   │   product.controller.spec.ts
│   │   │   product.controller.ts
│   │   │   product.module.ts
│   │   │   product.service.spec.ts
│   │   │   product.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-category.dto.ts
│   │   │       create-product.dto.ts
│   │   │       update-category.dto.ts
│   │   │       update-product.dto.ts
│   │   │
│   │   └───entities
│   │           product.entity.ts
│   │           ProductCategory.entity.ts
│   │           size.entity.ts
│   │
│   ├───shipping-cost
│   │   │   shipping-cost.controller.spec.ts
│   │   │   shipping-cost.controller.ts
│   │   │   shipping-cost.module.ts
│   │   │   shipping-cost.service.spec.ts
│   │   │   shipping-cost.service.ts
│   │   │
│   │   ├───dto
│   │   │       create-shipping-cost.dto.ts
│   │   │       update-shipping-cost.dto.ts
│   │   │
│   │   └───entities
│   │           shipping-cost.entity.ts
│   │
│   └───user
│       │   user.controller.spec.ts
│       │   user.controller.ts
│       │   user.module.ts
│       │   user.service.spec.ts
│       │   user.service.ts
│       │
│       ├───dto
│       │       createUser.dto.ts
│       │
│       └───entities
│               user.entity.ts
├───test
└───uploads
    ├───compressed
    ├───orginal
    └───watermarked
```
