#!/bin/bash
cd /var/www/html/backend 
# Create virtual environment (if not already created)
python3 -m venv venv  
# Activate the virtual environment
source venv/bin/activate 
# Install dependencies
pip install -r requirements.txt
