from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from typing import List, Dict

app = FastAPI()

# Allow React frontend to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB = "baza/KCUS_baza.db"

def get_db_connection():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row  # Allows access by column name
    return conn

@app.get("/odjeli", response_model=List[Dict])
def list_departments():
    conn = get_db_connection()
    depts = conn.execute("SELECT ID, naziv FROM Odjel").fetchall()
    conn.close()
    return [dict(d) for d in depts]

@app.get("/odjeli/{dept_id}", response_model=Dict)
def get_department(dept_id: int):
    conn = get_db_connection()
    dept = conn.execute("SELECT * FROM Odjel WHERE ID=?", (dept_id,)).fetchone()
    conn.close()
    if dept:
        return dict(dept)
    else:
        raise HTTPException(status_code=404, detail="Department not found")

# Optional: Run with `uvicorn main:app --reload` instead of `app.run()`
