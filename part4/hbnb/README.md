# HBnB - Auth & DB - Part 3

## Overview

This is the third part of the **HBnB** project, focusing on backend enhancements with authentication and database integration. The project introduces **JWT-based authentication**, role-based access control, and integrates an **SQLite** database for development (with MySQL prepared for production environments). The goal is to secure the backend, implement data persistence, and make the application scalable and production-ready.

## Project Description

In this part of the project, we enhance the backend by:

- Implementing **JWT-based authentication** using `Flask-JWT-Extended`.
- Introducing **role-based access control (RBAC)** with the `is_admin` attribute for endpoint access.
- Transitioning from in-memory data storage to **SQLite** using `SQLAlchemy` as an ORM.
- Preparing for **MySQL** integration in production.
- Designing and visualizing the database schema with **mermaid.js**.
  
This part will ensure secure data handling, authentication, and scalable database integration for the application.

## Learning Objectives

By the end of this part, you should be able to:

- Implement **JWT authentication** to secure your API and manage user sessions.
- Enforce **role-based access control** to restrict access based on user roles (e.g., admin and regular users).
- Transition from **in-memory storage** to **SQLite** for development, while preparing for **MySQL** in production.
- Design and visualize a relational **database schema** with **mermaid.js**.
- Ensure backend security, scalability, and reliable data storage for production.

## Setup Instructions

### Requirements
- Python 3.6+
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-Bcrypt
- SQLite (for development)
- MySQL (for production)

### Setup and Installation
1. Clone the repository:
    ```python
    git clone https://github.com/vlldnt/holbertonschool-hbnb.git
2. Go to part3 folder:
    ```shell
    cd part3/hbnb/
    ```    
3. Install Requirements:
    ```shell
    pip install -r requirements.txt
    ```
4. Create and launch venv:
    ```shell
    python3 -m venv venv
    source venv/bin/activate
    ```
5. Run the Application:
    ```shell
    python run.py
    ```

