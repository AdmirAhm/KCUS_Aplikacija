from fastapi import FastAPI, HTTPException, Body, Query
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
from pydantic import BaseModel


DB = "baza/KCUS_baza.db"


def get_db_connection():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row  # Allows access by column name
    return conn
# Model za registraciju
class RegisterRequest(BaseModel):
    ime: str
    prezime: str
    password: str
    email: str
    uloga: str  # "student" ili "pacijent"

# Model za prijavu
class LoginRequest(BaseModel):
    email: str
    password: str


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
@app.post("/register")
def register(data: RegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Provjera da li korisnik sa istim email-om postoji
    cursor.execute("SELECT * FROM Korisnik WHERE email = ?", (data.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Greška: email već rezervisan za drugog korisnika")

    # Ubacivanje u tabelu Korisnik
    cursor.execute(
        "INSERT INTO Korisnik (ime, prezime, password, email) VALUES (?, ?, ?, ?)",
        (data.ime, data.prezime, data.password, data.email)
    )
    korisnik_id = cursor.lastrowid  # ID novog korisnika

    # Ubacivanje u Student ili Pacijent tabelu prema ulozi
    if data.uloga.lower() == "student":
        cursor.execute("INSERT INTO Student (korisnikID) VALUES (?)", (korisnik_id,))
    elif data.uloga.lower() == "pacijent":
        cursor.execute("INSERT INTO Pacijent (korisnikID) VALUES (?)", (korisnik_id,))
    else:
        conn.close()
        raise HTTPException(status_code=400, detail="Nepoznata uloga")

    conn.commit()
    conn.close()
    return {"message": "Registracija uspješna"}
from fastapi import FastAPI, HTTPException, Body

@app.post("/prijava")
def login_user(data: dict = Body(...)):
    ime = data.get("ime")
    prezime = data.get("prezime")
    email = data.get("email")
    sifra = data.get("sifra")

    conn = get_db_connection()
    # prvo pronađi korisnika po login podacima
    user = conn.execute(
        "SELECT ID FROM Korisnik WHERE ime=? AND prezime=? AND email=? AND password=?",
        (ime, prezime, email, sifra)
    ).fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="Nepostojeći korisnik!")

    user_id = user["ID"]

    # provjeri ulogu
    student = conn.execute("SELECT korisnikID FROM Student WHERE korisnikID=?", (user_id,)).fetchone()
    pacijent = conn.execute("SELECT korisnikID FROM Pacijent WHERE korisnikID=?", (user_id,)).fetchone()
    conn.close()

    if student:
        role = "student"
    elif pacijent:
        role = "pacijent"
    else:
        role = None  # opcionalno, ako korisnik nije ni student ni pacijent

    return {
        "message": "Prijava uspješna",
        "userRole": role,
        "userId": user_id
    }

@app.get("/nalazi", response_model=List[Dict])
def get_nalazi_for_user(user: int = Query(...)):
    if user == -1:
        raise HTTPException(status_code=401, detail="Korisnik nije prijavljen")

    conn = get_db_connection()

    nalazi = conn.execute(
        """
        SELECT ID, opis, datum, status
        FROM nalaz
        WHERE pacijentID = ?
        ORDER BY ID DESC
        """,
        (user,)
    ).fetchall()

    conn.close()
    return [dict(n) for n in nalazi]
    
@app.get("/grupe", response_model=List[Dict])  
def get_grupe(user: int = Query(...)):
    if user == -1:
        raise HTTPException(status_code=401, detail="Korisnik nije prijavljen")

    conn = get_db_connection()

    grupe = conn.execute(
        """
        SELECT
            g.ID AS ID,
            g.predmetID AS pID,
            g.naziv AS grupa,
            p.naziv AS predmet,
            COUNT(pr.studentID) AS prijavljen
        FROM Grupa g
        JOIN Predmet p ON g.predmetID = p.ID
        LEFT JOIN Prijava pr 
               ON pr.grupaID = g.ID
              AND pr.studentID = ?
        GROUP BY g.ID, g.predmetID, g.naziv, p.naziv
        ORDER BY pID;
        """,
        (user,)
    ).fetchall()

    conn.close()
    return [dict(n) for n in grupe]
    
class PrijavaRequest(BaseModel):
    studentID: int
    grupaID: int


@app.post("/GrupaToggle")
def toggle_prijava(data: PrijavaRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if prijava already exists
    existing = cursor.execute(
        """
        SELECT 1 FROM Prijava
        WHERE studentID = ? AND grupaID = ?
        """,
        (data.studentID, data.grupaID)
    ).fetchone()

    if existing:
        # DELETE
        cursor.execute(
            """
            DELETE FROM Prijava
            WHERE studentID = ? AND grupaID = ?
            """,
            (data.studentID, data.grupaID)
        )
        action = "deleted"
    else:
        # INSERT
        cursor.execute(
            """
            INSERT INTO Prijava (studentID, grupaID)
            VALUES (?, ?)
            """,
            (data.studentID, data.grupaID)
        )
        action = "created"

    conn.commit()
    conn.close()

    return {
        "status": "ok",
        "action": action
    }

