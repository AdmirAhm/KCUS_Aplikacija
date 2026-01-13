from fastapi import FastAPI, HTTPException, Body
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
_user_ID=-1
def setUserID(userID):
    global _user_ID
    _user_ID=userID

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
    setUserID(user_id)

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
def get_nalazi_for_user():
    if _user_ID == -1:
        raise HTTPException(status_code=401, detail="Korisnik nije prijavljen")

    conn = get_db_connection()

    nalazi = conn.execute(
        """
        SELECT ID, opis, datum, status
        FROM nalaz
        WHERE pacijentID = ?
        ORDER BY ID DESC
        """,
        (_user_ID,)
    ).fetchall()

    conn.close()
    return [dict(n) for n in nalazi]
