from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

departments = [
    {
        "id": 1,
        "name": "Dermatology",
        "floor": 1,
        "working_hours": "07:00 - 16:00",
        "expected_wait": "10 minutes"
    },
    {
        "id": 2,
        "name": "Radiology",
        "floor": 2,
        "working_hours": "08:00 - 17:00",
        "expected_wait": "25 minutes"
    }
]

@app.get("/departments")
def get_departments():
    return departments

@app.get("/departments/{dept_id}")
def get_department(dept_id: int):
    for d in departments:
        if d["id"] == dept_id:
            return d
    return {"error": "Department not found"}
