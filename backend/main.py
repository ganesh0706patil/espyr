from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import mentor, code_agent, problems

app = FastAPI(title="Espyr DSA Coach API")

# Allow CORS for React frontend (adjust origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(mentor.router, prefix="/mentor-agent", tags=["Mentor Agent"])
app.include_router(code_agent.router, prefix="/code-agent", tags=["Code Agent"])
app.include_router(problems.router, prefix="/problems", tags=["Problems"])

@app.get("/")
async def root():
    return {"message": "Welcome to Espyr DSA Coach API"}