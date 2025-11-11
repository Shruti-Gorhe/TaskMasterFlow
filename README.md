# 🧩 TaskMasterFlow

**TaskMasterFlow** is a modern, full-stack task management application designed to help users organize, prioritize, and track their tasks seamlessly.  
Built with **TypeScript**, **Vite**, **Tailwind CSS**, and **Drizzle ORM**, it combines performance, scalability, and a clean user experience for managing projects efficiently.

---

## 🚀 Features

- 📋 Add, edit, delete, and track tasks effortlessly  
- ⚡ Fast performance using **Vite** build tool  
- 🎨 Modern UI styled with **Tailwind CSS**  
- 🧠 Type-safe code using **TypeScript**  
- 🧱 Database management with **Drizzle ORM**  
- 🧩 Modular architecture separating client, server, and shared modules  
- 🔧 Easy to extend with authentication, notifications, and analytics  

---

## 🧱 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, TypeScript, Drizzle ORM |
| Database | PostgreSQL / MySQL / SQLite |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Version Control | Git & GitHub |

---

## ⚙️ Getting Started

Follow the steps below to run **TaskMasterFlow** on your local system 👇

### Step 1: Clone the Repository
To get a local copy of the project:
```bash
git clone https://github.com/Shruti-Gorhe/TaskMasterFlow.git
cd TaskMasterFlow

### Step 2: Install Dependencies

Install the required dependencies for both the client and server:

cd client
npm install
cd ../server
npm install

###Step 3: Configure Environment Variables

Inside the server directory, create a file named .env and add your environment configurations:

DATABASE_URL=your_database_connection_string
PORT=4000

###Step 4: Run Database Migrations

If your setup uses Drizzle ORM migrations, run:

npx drizzle-kit migrate

Step 5: Start the Development Servers

Start the frontend and backend servers in separate terminals:

For the client:

cd client
npm run dev

For the server:

cd server
npm run dev

###Step 6: Access the Application

Once both servers are running, open your browser and go to:

http://localhost:3000
