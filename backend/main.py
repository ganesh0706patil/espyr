from fastapi import FastAPI
import routers.mentor as mentor

app = FastAPI()

app.include_router(mentor.router, prefix="/mentor")
