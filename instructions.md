# BeaconTrap Run Instructions

This guide explains how to set up, build, and run the **BeaconTrap SOC Dashboard** web application locally.

---

## 📋 Prerequisites
Before you start, make sure you have the following software installed on your machine:
- **Node.js** (Version `18.x` or higher is recommended)
- **npm** (Comes bundled with Node.js)

---

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies
Open your terminal inside the project directory and run:
```bash
npm install
```
This will download and install all required framework dependencies (Next.js, React, Prisma, TailwindCSS, etc.) inside the `node_modules` directory.

### Step 2: Configure Environment Variables
Create a file named `.env` in the root of the project (if it doesn't already exist) and define your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If the key is missing or blank, the application will automatically fall back to static analysis logic and high-fidelity mock generators to guarantee offline stability).*

### Step 3: Setup the SQLite Database
Synchronize the SQLite database with the Prisma schema structure:
```bash
npx prisma db push
```

Next, generate the Prisma Client TypeScript typings:
```bash
npx prisma generate
```

### Step 4: Seed the Database with Cases
Populate the SQLite database with 5 completed pre-configured banking threat cases (SBI Token, HDFC KYC, ICICI Rewards, BOI RAT, WhatsApp Spyware):
```bash
node prisma/seed.js
```

### Step 5: Start the Development Server
Run the Next.js development server locally:
```bash
npm run dev
```
Once started, open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Verification and Build Commands

- **Static Type Safety Verification**:
  ```bash
  npx tsc --noEmit
  ```
- **Lint Check**:
  ```bash
  npm run lint
  ```
- **Production Build Compile**:
  ```bash
  npm run build
  ```
