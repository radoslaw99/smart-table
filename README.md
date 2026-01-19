# Smart Table

A modern web application built with **Next.js** showcasing advanced table features combined with **user authentication** and **backend persistence**.

The project focuses on clean frontend architecture, state management, and secure user-based data storage.

---

## ✨ Features

- User authentication (Sign up / Sign in)
- Protected routes (authorized users only)
- Interactive table:
  - Sorting (asc / desc / reset)
  - Group collapsing and expanding
  - Dynamic footer calculations
- Per-user data persistence
- Clean, responsive UI
- Live deployment

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Custom CSS**
- **Supabase** (Auth + PostgreSQL)
- **Vercel** (deployment)

---

## 🚀 Getting Started

```bash
git clone https://github.com/radoslaw99/smart-table.git
cd smart-table
npm install
Create .env.local:

env
Skopiuj kod
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Run locally:

bash
Skopiuj kod
npm run dev
Open:
 http://localhost:3000

 Authentication
Authentication and authorization are handled by Supabase Auth.

Unauthenticated users are redirected to /login

Data access is secured using Row Level Security (RLS)

Each user can access only their own data

 Project Structure
php
Skopiuj kod
app/        # Pages and layout (Next.js App Router)
lib/        # Supabase client and auth helpers
public/     # Static assets
 Live Demo
 https://smart-table-rust.vercel.app/

 Notes
This project demonstrates practical usage of:

frontend frameworks

authentication

backend integration

deployment workflow

Author: Radosław
