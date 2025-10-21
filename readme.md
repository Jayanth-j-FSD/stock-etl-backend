STRUCTURE 


backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── core/                        ← global core modules
│   │   ├── config/
│   │   │   ├── app.config.ts
│   │   │   ├── database.config.ts
│   │   │   └── jwt.config.ts
│   │   ├── interceptors/
│   │   ├── guards/
│   │   ├── filters/
│   │   ├── exceptions/
│   │   └── logger/
│   │
│   ├── infrastructure/              ← external integrations
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── database.service.ts
│   │   │   ├── migrations/
│   │   │   └── ormconfig.ts
│   │   ├── cache/
│   │   ├── mail/
│   │   ├── jobs/
│   │   └── external-services/
│   │
│   ├── domain/                      ← business logic + entities
│   │   ├── auth/
│   │   │   ├── auth.entity.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.use-cases.ts
│   │   │   ├── dto/
│   │   │   └── index.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.entity.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.service.ts
│   │   │   ├── dto/
│   │   │   └── index.ts
│   │   │
│   │   ├── stocks/
│   │   └── currency/
│   │
│   ├── application/                 ← orchestration layer
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── users.controller.ts
│   │   │   └── stocks.controller.ts
│   │   ├── dto/
│   │   └── pipes/
│   │
│   ├── shared/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── interfaces/
│   │   └── types/
│   │
│   └── common/
│       ├── decorators/
│       └── helpers/
│
├── .env
├── package.json
└── tsconfig.json

88=-=-=-=-=-=-=-=-=-=-=-=-=-=-88

STEP - 1 
-============================================================-


Base Backend Setup (Core + Config + Database)**


>
> Create a NestJS backend project named `backend` with a scalable, domain-driven architecture.
> The backend should use **TypeScript**, **TypeORM**, and **PostgreSQL**, and follow the folder structure below:
>
> ```
> src/
> ├── main.ts
> ├── app.module.ts
> ├── core/
> │   ├── config/
> │   │   ├── app.config.ts
> │   │   ├── database.config.ts
> │   │   └── jwt.config.ts
> │   ├── interceptors/
> │   ├── guards/
> │   ├── filters/
> │   ├── exceptions/
> │   └── logger/
> ├── infrastructure/
> │   ├── database/
> │   │   ├── database.module.ts
> │   │   ├── database.service.ts
> │   │   ├── migrations/
> │   │   └── ormconfig.ts
> │   ├── cache/
> │   ├── mail/
> │   ├── jobs/
> │   └── external-services/
> ├── domain/
> │   ├── auth/
> │   ├── users/
> │   ├── stocks/
> │   └── currency/
> ├── application/
> │   ├── controllers/
> │   ├── dto/
> │   └── pipes/
> ├── shared/
> │   ├── utils/
> │   ├── constants/
> │   ├── interfaces/
> │   └── types/
> └── common/
>     ├── decorators/
>     └── helpers/
> ```
>
> **Requirements:**
>
> * Initialize a NestJS project using `@nestjs/cli`
> * Install and configure **TypeORM** with **PostgreSQL**
> * Add a `DatabaseModule` and `DatabaseService` under `infrastructure/database/`
> * Add a `ConfigModule` for reading `.env` (using `@nestjs/config`)
> * Add a sample `.env` file with `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, and `DB_NAME`
> * Implement a minimal working setup with:
>
>   * `app.module.ts` loading Config and Database modules
>   * `database.config.ts` exporting DB options
>   * `database.service.ts` providing a reusable connection service
> * Include `npm scripts` for:
>
>   * `start:dev`
>   * `migration:run`
>   * `migration:generate`
> * Use TypeScript strict mode and ESLint
> * The final setup should build and run using `npm run start:dev`
>
> Output full working code for:
>
> 1. `main.ts`
> 2. `app.module.ts`
> 3. `database.module.ts`
> 4. `database.service.ts`
> 5. `database.config.ts`
> 6. `.env.example`
> 7. `package.json` (dependencies and scripts)
>
> The goal: a **clean, scalable, ready-to-extend NestJS base** with TypeORM, PostgreSQL, environment config, and structured folders.

 



-============================================================-

STEP 2 
-============================================================-
Create an auth module under src/domain/auth and corresponding auth.controller.ts under src/application/controllers/.
 The module should handle:
POST /auth/register — register user


POST /auth/login — authenticate user


POST /auth/refresh — refresh access token


Use JWT Access + Refresh tokens with @nestjs/jwt.
 Store refresh tokens securely in the database.
 Passwords must be hashed using bcrypt.
 Use TypeORM entities for persistence.
Architecture:
domain/auth/
├── auth.entity.ts
├── auth.repository.ts
├── auth.service.ts
├── auth.use-cases.ts
├── dto/
│   ├── login.dto.ts
│   ├── register.dto.ts
│   └── token-response.dto.ts
└── index.ts

application/controllers/
└── auth.controller.ts

Requirements:
Access token expiry: 15m


Refresh token expiry: 7d


Use jwt.config.ts for secrets


Use AuthService → UserRepository for DB operations


Include guards for JwtAuthGuard and RefreshTokenGuard


Make sure auth.module.ts is imported in app.module.ts


Output:
Full code for auth.module.ts, auth.service.ts, auth.controller.ts, entities, DTOs, and strategies.

Minimal example of jwt.config.ts setup.

=-----============================================================----------

