# <img src="https://cdn.prod.website-files.com/6105315644a26f77912a1ada/63eea844ae4e3022154e2878_Holberton-p-800.png" width="150" /> 🏠 HBnB - AirBnB Clone

A full-stack web application that clones the core functionality of AirBnB, allowing users to browse, view details, and review places.

## 📁 Project Structure

```
part4/
├── hbnb_backend/          # Backend Flask application
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── run.py            # Application entry point
└── hbnb_frontend/        # Frontend static files
    ├── css/              # Stylesheets
    ├── js/               # JavaScript files
    ├── images/           # Image assets
    └── templates/        # HTML templates
```

## ✨ Features

- 🔐 User authentication (login/logout)
- 🔍 Browse available places
- 📝 View place details
- 💰 Filter places by price
- ⭐ Add reviews to places

## 📋 Prerequisites

- 🐍 Python 3.8 or higher
- 📦 pip (Python package manager)
- 🗄️ MySQL server
- 🌐 Web browser

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/SoliraZ/holbertonschool-hbnb
cd holbertonschool-hbnb/part4
```

2. Set up the backend:
```bash
cd hbnb_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Configure the database:
- Create a MySQL database named `hbnb_dev`
- Update the database credentials in `hbnb_backend/app/config.py`

4. Initialize the database:
```bash
python3 -m app.utils.db_setup
```

## 🏃 Running the Application

You can start both the backend and frontend servers with a single command:

```bash
cd part4
./start_servers.sh
```

This script will:
1. Start the backend Flask server on `http://127.0.0.1:5000`
2. Start the frontend server on `http://localhost:8000`
3. Open your default web browser to the frontend application

Alternatively, you can start the servers manually:

1. Start the backend server:
```bash
cd hbnb_backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python3 run.py
```

2. Open the frontend:
- Open `part4/hbnb_frontend/index.html` in your web browser
- Or use a local server (e.g., Python's built-in server):
```bash
cd hbnb_frontend
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser

## 🔌 API Endpoints

- `POST /api/v1/auth/login` - User login
- `GET /api/v1/places` - List all places
- `GET /api/v1/places/<place_id>` - Get place details
- `GET /api/v1/places/<place_id>/reviews` - Get place reviews
- `POST /api/v1/reviews` - Create a new review

## 📱 Usage

1. **Browse Places**
   - Open the home page to see all available places
   - Use the price filter to narrow down options
   - Click "View Details" to see more information

2. **View Place Details**
   - See complete information about a place
   - View amenities and location
   - Read existing reviews
   - Add your own review (requires login)

3. **User Authentication**
   - Click "Login" to access your account
   - Enter your email and password
   - After login, you can add reviews and access all features

## ⚠️ Troubleshooting

- If the backend server fails to start:
  - Check if MySQL is running
  - Verify database credentials in config.py
  - Ensure all dependencies are installed

- If the frontend doesn't load properly:
  - Check browser console for errors
  - Ensure the backend server is running
  - Clear browser cache and reload


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 👤 Authors:
- [@Hamza Karkouch](https://github.com/SoliraZ)
