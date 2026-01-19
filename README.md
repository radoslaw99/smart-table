 Smart Table

A web application built with Next.js that demonstrates advanced table functionality combined with user authentication and backend integration.

The project focuses on sorting, grouping, collapsing table rows and securing access using Supabase authentication.

---

 Features

- User authentication (sign up / sign in)
- Protected routes (only authenticated users can access the table)
- Interactive table:
  - Sorting (ascending / descending / reset)
  - Group collapsing and expanding
  - Dynamic footer calculations
- Per-user data persistence
- Live deployment

---

 Tech Stack

- Next.js (App Router)
- TypeScript
- Custom CSS
- Supabase (Authentication + PostgreSQL)
- Vercel (deployment)

---

 Getting Started (Local)

```bash
git clone https://github.com/radoslaw99/smart-table.git
cd smart-table
npm install
```

Create .env.local in the project root:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Run locally:
```
npm run dev
```

Open: http://localhost:3000

Authentication

Authentication is handled by Supabase Auth.

Unauthenticated users are redirected to /login

Access to data is secured using Row Level Security (RLS)

Each user can access only their own data

Live Version

https://smart-table-rust.vercel.app/
