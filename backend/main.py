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

    dept = conn.execute(
        "SELECT ID, naziv, slika, opis FROM Odjel WHERE ID=?",
        (dept_id,)
    ).fetchone()

    if not dept:
        conn.close()
        raise HTTPException(status_code=404, detail="Department not found")

    zaposlenici = conn.execute(
        "SELECT ID, ime_prezime FROM Uposlenik WHERE odjelID=?",
        (dept_id,)
    ).fetchall()

    conn.close()

    return {
        "id": dept["ID"],
        "naziv": dept["naziv"],
        "opis": dept["opis"],
        "slika": dept["slika"],
        "zaposlenici": [dict(z) for z in zaposlenici]
    }
    
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
    email = data.get("email")
    sifra = data.get("sifra")

    conn = get_db_connection()
    # prvo pronađi korisnika po login podacima
    user = conn.execute(
        "SELECT ID FROM Korisnik WHERE email=? AND password=?",
        (email, sifra)
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

@app.get("/termini", response_model=List[Dict])
def get_termini_for_student(user: int = Query(...)):
    if user == -1:
        raise HTTPException(status_code=401, detail="Korisnik nije prijavljen")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Main termini (student is registered)
    termini = cursor.execute(
        """
        SELECT
            t.ID AS terminID,
            t.vrijeme,
            t.otkazano,
            g.ID AS grupaID,
            g.naziv AS grupa,
            p.ID AS predmetID,
            p.naziv AS predmet
        FROM Prijava pr
        JOIN Grupa g ON pr.grupaID = g.ID
        JOIN Predmet p ON g.predmetID = p.ID
        JOIN Termin t ON t.grupaID = g.ID
        WHERE pr.studentID = ?
        ORDER BY t.vrijeme
        """,
        (user,)
    ).fetchall()

    result = []

    for t in termini:
        termin_dict = dict(t)

        # If cancelled → fetch alternative termini
        if t["otkazano"] == 1:
            alternatives = cursor.execute(
                """
                SELECT
                    g.naziv AS grupa,
                    t.vrijeme
                FROM Termin t
                JOIN Grupa g ON t.grupaID = g.ID
                WHERE g.predmetID = ?
                  AND g.ID != ?
                  AND t.otkazano = 0
                ORDER BY t.vrijeme
                """,
                (t["predmetID"], t["grupaID"])
            ).fetchall()

            termin_dict["alternatives"] = [dict(a) for a in alternatives]
        else:
            termin_dict["alternatives"] = []

        result.append(termin_dict)

    conn.close()
    return result

@app.get("/wait-estimate")
def get_wait_estimate(day: int = Query(..., ge=1, le=7)):
    """
    Returns average wait time per hour (8–16) for a given weekday
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    rows = cursor.execute(
        """
        SELECT sat, ROUND(AVG(minute_cekanja), 1) AS avg_wait
        FROM Cekanje
        WHERE dan = ?
        GROUP BY sat
        ORDER BY sat
        """,
        (day,)
    ).fetchall()

    conn.close()

    return [
        {
            "hour": row["sat"],
            "avg_wait": row["avg_wait"]
        }
        for row in rows
    ]
