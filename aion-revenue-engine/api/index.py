from fastapi import FastAPI

from main import app as core_app

app = FastAPI(title="AION Revenue Engine API")
app.mount("/api", core_app)

__all__ = ["app"]
