# 🚀 LogicGrid

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-blue?style=for-the-badge&logo=vercel)](https://logicgrid.vercel.app/signup)

> “AI at Your Side, Logic in Your Grid.”

A modern full-stack application built with the MERN stack (MongoDB, Express.js, React, Node.js), utilizing Redux for state management and styled with Tailwind CSS.

---

📖 Description
---------------

Welcome to our Node.js project, a comprehensive and easily maintainable application built with modern technologies such as Redux, Axios, and Tailwind CSS. This project is designed to showcase a scalable and maintainable architecture, making it suitable for real-world applications.

Redux is a state management library that helps to manage global state by using a single source of truth. Axios is a popular HTTP client that simplifies the handling of HTTP requests and responses. Tailwind CSS is a utility-first CSS framework that allows for rapid styling and customization of our application.

In this project, we have built a video creator application that allows administrators to create, save, and delete videos. The application is built with a clean and modular architecture, making it easy to maintain and extend.

✨ Features
------------

1. **Redux-based state management**: Global state is managed using Redux, making it easy to track and manage changes.
2. **Axios-based HTTP requests**: Axios is used to simplify the handling of HTTP requests and responses.
3. **Tailwind CSS styling**: Tailwind CSS is used for rapid styling and customization of the application.
4. **Video creator application**: Administrators can create, save, and delete videos using the application.
5. **User authentication**: Users are authenticated using JWT tokens and Redis.
6. **Error handling**: Errors are handled using a centralized error handling mechanism.
7. **Code organization**: Code is organized into clean and modular folders, making it easy to maintain and extend.
8. **ESLint configuration**: ESLint is configured to ensure code quality and consistency.
9. **Vite configuration**: Vite is configured to enable hot reloading and rapid development.
10. **Redis integration**: Redis is used as a caching layer to improve performance and scalability.

🧰 Tech Stack Table
--------------------

| Tech Stack | Description |
| --- | --- |
| Node.js | JavaScript runtime environment |
| Redux | State management library |
| Axios | HTTP client library |
| Tailwind CSS | Utility-first CSS framework |
| Vite | Rapid development platform |
| React | Frontend framework (not used in this project) |
| Express | Web framework (not used in this project) |
| Redis | In-memory data store |
| ESLint | Code analysis and linting tool |
| JWT | JSON Web Token for authentication |

📁 Project Structure
--------------------

* **src**: Source code for the application
	+ **store**: Redux store code
	+ **actions**: Redux action creators
	+ **reducers**: Redux reducers
	+ **utils**: Utility functions
	+ **api**: API endpoints
	+ **components**: React components (not used in this project)
	+ **pages**: Web pages (not used in this project)
* **config**: Configuration files
	+ **db.js**: Database connection configuration
	+ **redis.js**: Redis configuration
	+ **vite.config.js**: Vite configuration
	+ **eslint.config.js**: ESLint configuration
* **package.json**: Project dependencies and scripts
* **index.html**: Entry point for the application
* **index.js**: Entry point for the server
* **adminMiddleware.js**: Middleware for administrators
* **userMiddleware.js**: Middleware for users

⚙️ How to Run
--------------

1. Clone the repository and install dependencies using npm or yarn
2. Run the application using the command `npm run dev` or `yarn dev`
3. Access the application at `http://localhost:3000` in your web browser
4. Log in as an administrator using the credentials `admin:admin`
5. Create, save, and delete videos using the application

🧪 Testing Instructions
------------------------

1. Run the command `npm run test` or `yarn test` to run unit tests
2. Run the command `npm run cypress:run` or `yarn cypress:run` to run Cypress tests
3. Run the command `npm run test:watch` or `yarn test:watch` to run unit tests in watch mode

📸 Screenshots
------------

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a4f7dcb0-a216-4635-abfe-70d24c9a680d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f3f2961b-cb6a-4379-8dca-96a01fb25ade" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dcb43f8c-43ed-4d82-b834-0a0ec59ab116" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c0dcadf3-29bf-4ebf-96ea-6af4232f3fa2" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/08a1f2a1-72e6-4e9f-8298-dd98579cadca" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/435f4dab-16e5-4cff-9ff3-ee298f046b40" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/651c7c96-ac74-4405-93d5-d6bdd22b9fe8" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/21665d5d-1ec7-4332-b60e-dcb0ab4676ff" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/401a3bf5-dfba-40c7-be71-6441ccce29a0" />


### 📦 API Reference

**Base URL:** `https://logic-grid-backend.onrender.com`

#### **1. User Authentication**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/user/register` | Registers a new user. |
| `POST` | `/user/login` | Authenticates and logs in a user. |
| `POST` | `/user/logout` | Logs out the current user by clearing the token. |
| `GET` | `/user/check` | Checks if a user's session is active. |
| `POST` | `/user/admin/register` | Registers a new administrator (requires admin privileges). |
| `DELETE` | `/user/deleteProfile` | Deletes the current user's profile. |

#### **2. Problem Management**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/problem/create` | Creates a new coding problem (admin only). |
| `PUT` | `/problem/update/:id` | Updates an existing coding problem by ID. |
| `DELETE` | `/problem/delete/:id` | Deletes a coding problem by ID. |
| `GET` | `/problem/problemById/:id` | Retrieves a single problem by its ID. |
| `GET` | `/problem/getAllProblem` | Retrieves a list of all problems. |
| `GET` | `/problem/problemSolvedByUser` | Retrieves all problems solved by the current user. |
| `GET` | `/problem/submittedProblem/:pid`| Retrieves a user's past submissions for a given problem. |

#### **3. Code Submission & Execution**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/submission/submit/:id` | Submits code for a problem to be judged against hidden test cases. |
| `POST` | `/submission/run/:id` | Runs code against the visible test cases. |

#### **4. AI & Video**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/ai/chat` | Interacts with the AI tutor for problem-solving help. |
| `GET` | `/video/create/:problemId` | Generates a Cloudinary signature for video upload. |
| `POST` | `/video/save` | Saves video metadata to the database. |
| `DELETE`| `/video/delete/:problemId`| Deletes a video solution by problem ID. |


👤 **Author**
------------
**[Manish](https://github.com/Manish-792)**


📝 License
---------

* **MIT License**
This project is licensed under the MIT License, which means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software. The license is a simple, permissive open-source license.
