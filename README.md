# 🧥 Thrift-and-Gift

A full-stack web application that enables users to **buy**, **sell**, and **donate** second-hand clothes — promoting sustainable fashion through digital thrift culture.

Built with:
- 🐍 Django (Python) for backend
- ⚛️ React + TypeScript for frontend
- 🛒 MySQL for the database
- 💳 Khalti for payment integration

---

## 🚀 Features

- 👚 **Thrift Store** – Sell or buy second-hand clothes
- 🎁 **Clothing Bank** – Donate unused clothes to others
- 🛍️ **Cart & Orders** – Cart, checkout, and order history
- 💳 **Khalti Integration** – Test payment functionality
- 🧑‍⚖️ **Admin Dashboard** – Manage users, listings, and reviews
- 🧵 **User Roles** – Buyer, Seller, Admin
- 📦 **Reviews** – Rate and review purchased items
- 📬 **Live Chat** – Basic communication between users

📁 Project Structure

├── frontend/         # React frontend
├── backend/          # Django backend (APIs)
├── .gitignore
├── README.md

🧪 Getting Started Locally
🔗 Prerequisites
Python 3.9+
Node.js (v18+ recommended)
MySQL server

📦 Backend Setup (Django)
cd backend
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt

# MySQL Database Settings
DB_NAME=thriftandgift
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306

# Khalti Keys (Test Mode)
KHALTI_PUBLIC_KEY=your_public_key
KHALTI_SECRET_KEY=your_secret_key

Then run:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

🌐 Frontend Setup (React + Tailwind)

cd frontend
npm install
npm run dev
This will start the Vite dev server

🗃️ Database Setup (No .sql file required)
The project uses Django ORM, so no .sql dump is needed.
After setting up .env, run:

python manage.py makemigrations
python manage.py migrate

🔐 Khalti Test Integration
Visit: https://khalti.com

Create a developer account
Get your public/secret test keys
Add them to .env as shown above
Payments in this app use Khalti sandbox mode.

# React Frontend URL
FRONTEND_URL=http://localhost:5173

🤝 Contributing
Pull requests are welcome.
For major changes, please open an issue first to discuss what you’d like to change.

👨‍💻 Author
Siddhant Bhurtel
📧 Email: siddhantbhurtel@gmail.com
