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
- 📱 Responsive design for all devices

## 📋 Prerequisites

- 🐍 Python 3.8 or higher
- 📦 pip (Python package manager)
- 🗄️ MySQL server
- 🌐 Web browser

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd holbertonschool-hbnb/part4
```

2. Set up the backend:
```bash
cd hbnb_backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
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

1. Start the backend server:
```bash
cd hbnb_backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python3 run.py
```
The backend server will start on `http://127.0.0.1:5000`

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 📘 [Part 1: UML Diagrams](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1)
We launched the development of the HBnB Evolution application by creating a detailed blueprint. This technical document compiles all essential diagrams and explanations, serving as a comprehensive guide to the system's architecture, design, and implementation phases detailing the steps from the user to the database.


1. [The high-level architecture of the application](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1/00-architecture_diagram.md) with a package diagram that outlines the three layers and the use of the Facade Pattern.

2. [Detailed diagrams representing the business logic layer](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1/01-class_diagram.md) with a detailed class diagram illustrating key entities and their relationships.

3. [Sequence diagrams for key API interactions](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1/02-sequence_diagram.md) depicting critical operations such as :
    - [user registration](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1/02-detailed_sequence_diagrams/2-user_registration.md)
    - [place creation](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1/02-detailed_sequence_diagrams/2-place_creation.md)
    - [review submission](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1/02-detailed_sequence_diagrams/2-review_submission.md)
    - [fetching places](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part1/02-detailed_sequence_diagrams/2-place_fetching.md)

### ⚙️ [Part 2: Implementation of Business Logic and API Endpoints](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part2/hbnb)

This part is focused on creating a functional and scalable foundation for the application. You will be working on:

**Business Logic Layer:** Building the core models and logic that drive the application's functionality. This includes defining relationships, handling data validation, and managing interactions between different components.

**Presentation Layer:** Defining the services and API endpoints using Flask and flask-restx. You will structure the endpoints logically, ensuring clear paths and parameters for each operation.

0. _**Project Setup and Package Initialization:**_ Set up the project structure with Presentation, Business Logic, and Persistence layers, using in-memory storage and the Facade pattern.
1. _**Core Business Logic Classes:**_ Implement core business logic classes (User, Place, Review, Amenity) with attributes, relationships, and validations.
2. _**User Endpoints:**_ Develop API endpoints for user management (POST, GET, PUT) while ensuring sensitive data security.
3. _**Amenity Endpoints:**_ Implement API endpoints for managing amenities (POST, GET, PUT) via the Facade pattern.
4. _**Place Endpoints:**_ Create API endpoints for managing places (POST, GET, PUT) with attribute validation and integration with users and amenities.
5. _**Review Endpoints:**_ Develop API endpoints for managing reviews (POST, GET, PUT, DELETE) while maintaining associations with users and places.
6. _**Testing and Validation:**_ Perform validation, manual and automated testing using cURL and unittest/pytest, and document the results.


### 🔒 [Part 3: Authentification and Database](https://github.com/vlldnt/holbertonschool-hbnb/blob/main/part3/hbnb)

This part of the project will extend the backend of the application by introducing user authentication, authorization, and database integration using `SQLAlchemy` and `SQLite` for development. We'll configure `MySQL` for production environments and will secure the backend, introduce persistent storage, and prepare the application for a scalable, real-world deployment.


#### Main Tasks of the HBnB - Auth & DB Project
0. **Modify the Application Factory to Include the Configuration:** Update the `create_app()` method to include the configuration object.
1. **Modify the User Model to Include Password Hashing:** Add password hashing with bcrypt to the User model and update the registration endpoint.
2. **Implement JWT Authentication with flask-jwt-extended:** Configure the API to generate and verify JWT tokens for securing endpoints.
3. **Implement Authenticated User Access Endpoints:** Secure endpoints to allow only authenticated users to create and modify resources.
4. **Implement Administrator Access Endpoints:** Restrict access to specific endpoints for users with administrative privileges.
5. **Implement SQLAlchemy Repository:** Replace the in-memory repository with a SQLAlchemy-based repository for data persistence.
6. **Map the User Entity to SQLAlchemy Model:** Map the User entity to a SQLAlchemy model and implement CRUD operations.
7. **Map the Place, Review, and Amenity Entities:** Map these entities to SQLAlchemy models, ensuring basic CRUD functionality.
8. **Map Relationships Between Entities Using SQLAlchemy:** Define one-to-many and many-to-many relationships between entities.
9. **SQL Scripts for Table Generation and Initial Data:** Create SQL scripts to generate the database schema and populate it with initial data.
10. **Generate Database Diagrams:** Create ER diagrams using Mermaid.js to visualize the database schema.




### 👤 Authors:
- [@Madjiguene Elodie Mbaye](https://github.com/Elodie-mbaye)
- [@Hamza Karkouch](https://github.com/SoliraZ)
- [@Adrien Vieilledent](https://github.com/vlldnt)

