# ✦ Velora ERP & CRM

An enterprise-grade role-based ERP & CRM application built on React, Node.js, Express, TypeScript, and Supabase PostgreSQL via Prisma ORM.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Rajyalaxmi29/velora-erp)

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, Tailwind CSS, Lucide icons, Framer Motion.
*   **Backend**: Node.js, Express.js, TypeScript, JWT, bcryptjs, Zod validation.
*   **Database**: Supabase PostgreSQL, Prisma ORM 7.
*   **Hosting**: Render (Backend), Localhost (Frontend).

## 🚀 Deployment Instructions

### One-Click Deployment to Render
1. Click the **Deploy to Render** button above.
2. Render will automatically import the configurations from `render.yaml`.
3. Provide the required Environment Variables in the Render dashboard:
    *   `DATABASE_URL`: Your Supabase connection string.
    *   `JWT_SECRET`: A secure key for token signatures.
    *   `PORT`: `5000`
    *   `NODE_ENV`: `production`
4. Click **Apply** to trigger the build and deploy.

### Local Development Setup
1. Clone the repository and install dependencies:
    ```bash
    npm install
    cd backend && npm install
    ```
2. Set up the `.env` file in the `backend/` folder:
    ```env
    PORT=5000
    DATABASE_URL="your-supabase-connection-string"
    JWT_SECRET="your-jwt-secret"
    ```
3. Generate the Prisma client and apply database migrations:
    ```bash
    npx prisma generate
    npx prisma migrate deploy
    ```
4. Start both development servers:
    *   Backend: `npm run dev` (inside `backend/`)
    *   Frontend: `npm run dev` (in the root directory)
