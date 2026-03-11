"""Compatibility entrypoint for hosts that default to `gunicorn app:app`."""

from FinanceTracker.wsgi import application as app
