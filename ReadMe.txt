# KCUS Information System

## Introduction
This repository represents a design of an information system for a hospital complex developed as a project at the Faculty of Electrical Engineering, University of Sarajevo for the subject "Interakcija Čovjek Računar". The system is built as a web application with React and Vite for visualisation, Python with FastAPI library for backend, and SQLite for data storage. 

## Installation
Steps required to install and set up the project locally are listed below:

```
git clone https://github.com/AdmirAhm/KCUS_Aplikacija

cd KCUS_Aplikacija\frontend

pip install fastapi uvicorn
npm install
npm install react-router-dom
npm install react-icons
npm install chart.js react-chartjs-2
```

## Running the application locally
To run the application locally, you need to run two terminals. The first terminal is run within the backend folder with the following command:
```
uvicorn main:app --reload
```

The second terminal is run within the frontend folder with the following command:
```
npm run dev
```

Alternatively, on Windows you can just run the start.bat file.
After the application is started, you can access it using your browser at localhost:5173

## Contributors
Admir Ahmespahić
Nejla Buljina
