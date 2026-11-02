"""
app.py
------
Entrypoint alias for Render / deployment hosts that default to `uvicorn app:app`.
"""

from main import app

__all__ = ["app"]
