"""
app/main.py
-----------
Module wrapper so `uvicorn app.main:app` works seamlessly on Render.
"""

from main import app

__all__ = ["app"]
