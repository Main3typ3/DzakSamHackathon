#!/bin/bash
cd /Users/amirdzakwan/Documents/ChainQuest-Academy/backend
/Users/amirdzakwan/Documents/ChainQuest-Academy/.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
