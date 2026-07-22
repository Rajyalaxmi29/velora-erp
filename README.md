# ✦ Velora ERP & CRM

> Cloud-based Enterprise Resource Planning & Customer Relationship Management platform for secure B2B business operations.

[![React](https://img.shields.io/badge/Frontend-React%20v18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/CSS-TailwindCSS%20v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js%20v5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%20v7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

Velora ERP & CRM is a modern, high-performance, role-based business management platform designed to automate and secure core commercial operations. It provides a cohesive interface for managing customer sales pipelines, product catalog structures, transactional stock logs, and multi-item sales dispatches with strict permissions enforcement and atomic database transaction isolation.

---

## 2. Project Overview

### The Business Problem
Small and Medium Enterprises (SMEs) struggle with siloed systems where customer CRM leads, inventory stock counts, and sales orders (challans) are tracked in separate spreadsheets. This leads to duplicate entries, stock counting errors, order confirmation delays, and zero accountability over user actions.

### The Velora Solution
Velora resolves these inefficiencies by linking all operational areas into a unified, secure database:
*   **Unified CRM**: Real-time sales lead timelines, contact catalogs, and follow-up alerts.
*   **Atomic Inventory**: Warehouse level adjustments with automatic double-entry audit trails and negative balance protection.
*   **Direct Workflows**: Dispatching a sales challan automatically deducts warehouse stock and locks snapshot item valuations.
*   **Role Security**: Guarantees that employees only access endpoints matching their specific job responsibilities.

### Platform Offerings
*   **Customer Relationship Management (CRM)**: Track customer records and follow-ups.
*   **Product Management**: Catalog wholesale SKUs, categories, and unit price lists.
*   **Inventory Tracking**: Record Stock IN/OUT transactions with reorder flags.
*   **Sales Challan Generation**: Propose draft orders and confirm dispatches.
*   **Role Based Authentication**: Restrict workflows to designated permissions.
*   **Secure REST APIs**: Enforce JWT checks, input validation, and SQL transaction isolation.
*   **Cloud Database**: Store data reliably on Supabase PostgreSQL.
*   **Live Deployment**: Deploy automatically via Vercel and Railway CI/CD pipelines.

---

## 3. Live Deployment

*   **Frontend URL (React)**: *[https://velora-erp.vercel.app](https://velora-erp.vercel.app)* (Placeholder)
*   **Backend URL (Express)**: *[https://velora-erp-production.up.railway.app](https://velora-erp-production.up.railway.app)* (Placeholder)
*   **GitHub Repository**: [https://github.com/Rajyalaxmi29/velora-erp](https://github.com/Rajyalaxmi29/velora-erp)

---

## 4. Features

| Module | Feature | Implementation Details |
| :--- | :--- | :--- |
| **Authentication** | User Register | Registers new user profiles with secure password hashing via `bcryptjs`. |
| | User Login | Authenticates credentials and returns a signed JWT containing role claims. |
| | Role-Based Guards | Restricts sidebar navigation and backend endpoints to authorized roles only. |
| **Customer CRM** | Business Directory | Maintain contact records, business entities, and communication details. |
| | Interaction Timeline | Log follow-up details, business status (`Lead`, `Active`, `Inactive`), and action notes. |
| **Product Catalog** | Catalog Management | Manage catalog items, catalog categories, SKUs, and default unit prices. |
| | Reorder Watchlist | Track stock limits against `minStock` parameters to alert operators. |
| **Inventory** | Stock IN / OUT | Modify warehouse stock levels with reason codes and operator signatures. |
| | Atomic Bounds | Excludes negative balances, throwing transaction rollbacks on insufficient stock. |
| | Audit Logs | Timeline log of all stock movements with timestamps and creator names. |
| **Sales Challans** | Draft Challans | Compile dispatch lists with search-suggested products and quantities. |
| | Snapshot Valuations | Locks product price parameters inside challan items to preserve invoice details. |
| | Dispatch Confirmation | Confirming dispatches atomically decreases warehouse stock counts. |
| **Dashboard** | Analytics | Displays KPIs, charts, and activity feeds customized to the authenticated role. |
| **Deployment** | Web Services | Hosted on Vercel and Railway, connected via encrypted PostgreSQL TLS links. |

---

## 5. Technology Stack

### Frontend
*   **Core**: React v18, Vite.
*   **Language**: TypeScript (strict mode compilation).
*   **Styling**: Tailwind CSS v4, Vanilla CSS tokens.
*   **Iconography**: Lucide React.
*   **Animations**: Framer Motion (micro-interactions, page transitions).

### Backend
*   **Server Runtime**: Node.js, Express.js.
*   **Language**: TypeScript (tsc compilation build).
*   **Database Client**: Prisma ORM v7 with `@prisma/adapter-pg` driver adapter.
*   **Security & Middleware**: JWT (jsonwebtoken), bcryptjs, Zod validation, CORS, Helmet, Morgan logging.

### Database & Hosting
*   **Database Engines**: Supabase PostgreSQL.
*   **Frontend Hosting**: Vercel (static web adapter hosting).
*   **Backend Hosting**: Railway (Dockerized Node Web Service).
*   **Version Control**: Git, GitHub.

---

## 6. System Architecture

```mermaid
graph TD
    User([User Browser]) <-->|HTTPS / JSON| FE[React Frontend - Vercel]
    FE <-->|CORS / JWT Auth| BE[Express API - Railway]
    BE <-->|Prisma Client| ORM[Prisma ORM v7]
    ORM <-->|PG Driver Adapter / Pool| DB[(Supabase PostgreSQL)]
```

---

## 7. Folder Structure

```text
Root/
├── backend/                  # Express.js Server Workspace
│   ├── prisma/               # Prisma Database Configurations
│   │   ├── migrations/       # SQL Migrations History
│   │   └── schema.prisma     # Relational Database Models
│   ├── src/                  # Backend Source Code
│   │   ├── config/           # Environment and Database Instantiations
│   │   ├── controllers/      # Route Handler Logic
│   │   ├── middleware/       # JWT Auth and Validation Filters
│   │   ├── routes/           # Endpoint Registrations
│   │   ├── services/         # Business & DB Transactions Service Layer
│   │   ├── utils/            # Shared Helpers and AppError Wrappers
│   │   └── validators/       # Zod Request Validation Schemas
│   ├── package.json          # Backend Dependencies and Scripts
│   ├── prisma.config.ts      # Prisma 7 Environment Configuration
│   └── tsconfig.json         # Backend TS Compiler Setup
├── public/                   # Frontend Static Assets
├── src/                      # React Frontend Source Code
│   ├── components/           # Common Layout and Protected Route Guards
│   ├── context/              # Global Authentication State Provider
│   ├── pages/                # CRM, Inventory, Products, Challans, Reports, Settings Views
│   ├── services/             # Axios API Request Methods
│   ├── types/                # Shared TypeScript Definitions
│   ├── App.tsx               # Main Component and Router Shell
│   └── index.css             # Tailwind Directives and CSS variables
├── package.json              # Frontend Dependencies and Scripts
└── vite.config.js            # Vite Project Compiler Options
```

---

## 8. Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant API as Express Auth Endpoint
    participant DB as Supabase Database

    Note over User, DB: User Registration
    User->>API: POST /auth/register (name, email, password, role)
    API->>API: Hash password using bcryptjs (10 salt rounds)
    API->>DB: Save User record with hashed password
    DB-->>API: User persisted
    API-->>User: 201 Created (Success message)

    Note over User, DB: User Login
    User->>API: POST /auth/login (email, password)
    API->>DB: Query User record by email
    DB-->>API: User details with passwordHash
    API->>API: Compare password with passwordHash
    API->>API: Sign JWT with claims (userId, name, role)
    API-->>User: 200 OK (JWT Access Token & Profile metadata)

    Note over User, DB: Accessing Protected API
    User->>API: GET /api/v1/customers (Headers: Authorization Bearer JWT)
    API->>API: Decode and verify JWT signature
    API->>API: Check Role permission list
    API->>DB: Query customers data
    DB-->>API: Customer records
    API-->>User: 200 OK (Customers JSON array)
```

---

## 9. Role Based Access Control (RBAC)

The application implements strict role boundaries. Unauthorized attempts yield `403 Forbidden` errors.

| Module | Route / Action | Admin | Sales | Warehouse | Accounts |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Auth** | View Profile | ✅ | ✅ | ✅ | ✅ |
| **CRM** | View / Search Customers | ✅ | ✅ | ❌ | ❌ |
| | Create / Edit / Delete Customers | ✅ | ✅ | ❌ | ❌ |
| **Products**| View Catalog | ✅ | ❌ | ✅ | ❌ |
| | Add / Modify / Delete Products | ✅ | ❌ | ✅ | ❌ |
| **Inventory**| View Stock Movement Log | ✅ | ❌ | ✅ | ❌ |
| | Record Stock IN / OUT | ✅ | ❌ | ✅ | ❌ |
| **Challans**| View / Draft Challans | ✅ | ✅ | ❌ | ✅ |
| | Confirm Dispatch (Deduct Stock) | ✅ | ❌ | ✅ | ❌ |
| | Cancel Dispatch (Restore Stock) | ✅ | ❌ | ✅ | ❌ |
| **Reports** | View Executive Business Analytics | ✅ | ✅ | ✅ | ✅ |
| **Settings**| Configure System Configurations | ✅ | ❌ | ❌ | ✅ |

---

## 10. Database Schema

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string passwordHash
        string name
        Role role
        datetime createdAt
        datetime updatedAt
    }
    Customer {
        string id PK
        string name
        string email
        string phone
        string businessName
        string status
        string notes
        string followUpDate
        datetime createdAt
        datetime updatedAt
    }
    Product {
        string id PK
        string sku UK
        string name
        string description
        string category
        float unitPrice
        int currentStock
        int minStock
        string warehouse
        datetime createdAt
        datetime updatedAt
    }
    StockMovement {
        string id PK
        string productId FK
        MovementType type
        int quantity
        string reason
        string createdBy
        datetime timestamp
    }
    SalesChallan {
        string id PK
        string challanNumber UK
        string customerId
        string customerName
        float grandTotal
        int grandQuantity
        ChallanStatus status
        string createdBy
        string createdDate
        datetime createdAt
        datetime updatedAt
    }
    ChallanItem {
        string id PK
        string challanId FK
        string productId
        string productName
        int quantity
        float price
        float subtotal
    }

    Product ||--o{ StockMovement : "has"
    SalesChallan ||--|{ ChallanItem : "contains"
```

---

## 11. REST APIs

| Module | Method | Endpoint | Description | Allowed Roles |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Registers a new user account. | Public |
| | `POST` | `/api/v1/auth/login` | Authenticates details, returns JWT. | Public |
| | `GET` | `/api/v1/auth/profile` | Fetches details of current user. | All logged-in users |
| **CRM** | `POST` | `/api/v1/customers` | Creates a customer card profile. | Admin, Sales |
| | `GET` | `/api/v1/customers` | Returns customers list. | Admin, Sales |
| | `GET` | `/api/v1/customers/:id` | Returns customer record by ID. | Admin, Sales |
| | `PUT` | `/api/v1/customers/:id` | Updates customer details. | Admin, Sales |
| | `DELETE`| `/api/v1/customers/:id` | Deletes customer from database. | Admin, Sales |
| **Product** | `POST` | `/api/v1/products` | Creates product item SKU in catalog. | Admin, Warehouse |
| | `GET` | `/api/v1/products` | Returns products catalog list. | Admin, Warehouse |
| | `GET` | `/api/v1/products/:id` | Returns product details by ID. | Admin, Warehouse |
| | `PUT` | `/api/v1/products/:id` | Updates product unitPrice or minStock. | Admin, Warehouse |
| | `DELETE`| `/api/v1/products/:id` | Removes product from catalog. | Admin, Warehouse |
| **Inventory**| `POST` | `/api/v1/stock/in` | Records stock entry (increases count). | Admin, Warehouse |
| | `POST` | `/api/v1/stock/out` | Records stock dispatch (decreases count). | Admin, Warehouse |
| | `GET` | `/api/v1/stock/history` | Fetches stock audit log timeline. | Admin, Warehouse |
| **Challans**| `POST` | `/api/v1/challans` | Creates a new Draft sales challan. | Admin, Sales, Accounts |
| | `GET` | `/api/v1/challans` | Returns sales challans list. | Admin, Sales, Accounts |
| | `PUT` | `/api/v1/challans/:id` | Updates draft challan items and quantity. | Admin, Sales, Accounts |
| | `POST` | `/api/v1/challans/:id/confirm`| Confirms dispatch, deducts stock. | Admin, Warehouse |
| | `POST` | `/api/v1/challans/:id/cancel` | Cancels dispatch, restores stock counts. | Admin, Warehouse |

---

## 12. Business Workflow

```mermaid
graph TD
    L[Login Screen] -->|Authenticated| D[Role-Based Dashboard]
    
    D -->|Admin/Sales| CRM[Manage Customer Directory]
    D -->|Admin/Warehouse| PROD[Manage Product Catalog]
    
    PROD -->|Restock / Adjust| INV[Record Stock Movement IN/OUT]
    INV -->|Audit Log| HIST[View Stock History Logs]
    
    CRM & PROD -->|Admin/Sales/Accounts| CH[Create Sales Challan Draft]
    CH -->|Snapshot Prices| ITEMS[Draft Challan Items]
    
    ITEMS -->|Admin/Warehouse Confirm| DISPATCH[Confirm Challan Dispatch]
    DISPATCH -->|Atomic Deduction| STOCK_DEC[Deduct Product Stock in Supabase]
```

---

## 13. Installation Guide

### Prerequisites
*   Node.js (v18 or higher recommended)
*   Git
*   A running Supabase PostgreSQL database instance

### 1. Clone the Repository
```bash
git clone https://github.com/Rajyalaxmi29/velora-erp.git
cd velora-erp
```

### 2. Configure the Backend Workspace
1.  Navigate to the `backend/` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file based on `.env.example`:
    ```env
    PORT=5000
    NODE_ENV=development
    DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres?schema=public"
    JWT_SECRET="generate-a-secure-256-bit-key-in-production"
    ```
4.  Generate the Prisma Client and deploy the migrations:
    ```bash
    npx prisma generate
    npx prisma migrate deploy
    ```
5.  Start the backend API dev server:
    ```bash
    npm run dev
    ```

### 3. Configure the Frontend Workspace
1.  Open a new terminal at the project root directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to **[http://localhost:5174/](http://localhost:5174/)** to view the application.

---

## 14. Environment Variables

| Variable | Scope | Description | Default / Format |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | The port the Express server will listen on. | `5000` |
| `NODE_ENV` | Backend | Application environment configuration. | `development` \| `production` |
| `DATABASE_URL` | Backend | Supabase connection string. | `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/...` |
| `JWT_SECRET` | Backend | Encryption key used for signing session tokens. | Writable string key |
| `VITE_API_URL` | Frontend | API root base URL. | `http://localhost:5000/api/v1` (Dev) |

---

## 15. Deployment Guide

### Database (Supabase)
1.  Sign in to the Supabase dashboard and create a new project.
2.  Copy the connection string (URI mode) from **Project Settings > Database**.
3.  Provide this string to the `DATABASE_URL` parameter in your backend service.

### Backend (Railway)
1.  Create a new Web Service on Railway and connect your GitHub repository.
2.  Set the **Root Directory** to `backend`.
3.  Configure the build variables in the settings tab:
    *   **Build Command**: `npm install && npx prisma generate && npm run build`
    *   **Start Command**: `npm start`
4.  Add the required Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `PORT`).

### Frontend (Vercel)
1.  Create a new project on Vercel and import your repository.
2.  Set the Root Directory to `./` (repository root).
3.  Provide the environment variable `VITE_API_URL` pointing to your live Railway backend server.
4.  Deploy. All communication is routed over secure HTTPS channels.

---

## 16. Testing

Comprehensive integration test suites were run over real HTTP requests. All test suites completed with a **100% success rate**.

*   **Auth Verification**: Checked user registers, JWT token generation, and profile retrieval.
*   **CRM Mutation Checks**: Verified adding, searching, modifying, and cascade deleting customer entries.
*   **Catalog Integrity**: Confirmed product SKU creation and unit pricing modifications.
*   **Stock Ledger isolation**: Tested Stock IN/OUT transactions. Verified that requests to deduct stock beyond current limits are blocked and rolled back.
*   **Challans Lifecycle**: Verified draft creation, items updating, price snapshotting, and stock deduction on confirmation.
*   **RBAC Guards**: Checked that unauthorized routes yield `403 Forbidden` and block requests.

---

## 17. Screenshots

### Landing Page
*(Placeholder for landing page screenshot)*

### User Login
*(Placeholder for login page screenshot)*

### Operations Dashboard
*(Placeholder for role-based dashboard view)*

### CRM Client Directory
*(Placeholder for Customer CRM management list)*

### Inventory Movements Ledger
*(Placeholder for stock logs timeline)*

### Sales Challan Workspace
*(Placeholder for challan draft compiling interface)*

### Executive Reports & Settings
*(Placeholder for interactive business analytics charts)*

### Supabase Table Schema
*(Placeholder for Supabase database table listing)*

---

## 18. Security Features

*   **Secure Password Hashing**: Utilizes `bcryptjs` with 10 salt rounds, ensuring that plaintext passwords are never stored in the database.
*   **JWT Session Claims**: Exchanges credentials for a signed JWT token containing role credentials.
*   **REST Route Guards**: Implemented `requireRole` middleware checks on endpoints, preventing unauthorized access.
*   **Prisma Transactions**: Utilizes database-level isolation blocks for inventory adjustments, avoiding race conditions and negative values.
*   **Helmet & CORS**: Backend uses security header injection and limits CORS requests to trusted client origins only.

---

## 19. Future Enhancements

*   **Direct Invoice PDF Generator**: Render and print invoice documents directly from confirmed challans.
*   **Barcode Scanning**: Connect mobile camera scanners to update warehouse stock in real-time.
*   **SMS & WhatsApp notifications**: Auto-dispatch delivery notifications to customers when challans are confirmed.
*   **AI Stock Analytics**: Predict seasonal product demand using stock movement timeline data.
*   **GST Accounts ledger**: Automatically calculate tax brackets (CGST/SGST/IGST) on dispatches.
*   **Multi-Warehouse tracking**: Manage inventory counts separately across multiple distinct warehouse locations.

---

## 20. Conclusion

Velora ERP & CRM is a modern, highly secure operational suite designed for SMEs. Built with a fast React frontend, robust Express TypeScript backend, and a cloud-hosted Supabase database, it guarantees data consistency and security. The platform is ready to scale with business expansion and can be deployed rapidly via automatic Git integration on Railway and Vercel.
