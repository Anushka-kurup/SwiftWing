# Use the official Python 3.11 image as the base image
FROM python:3.11

# Set the working directory inside the container
WORKDIR /api

# Copy the requirements.txt file into the container at /api
COPY requirements.txt .

# Copy the environment file into the container at /api
COPY .env .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire current directory contents into the container at /api
COPY . .

# Expose port 5000
EXPOSE 5000

# Command to run the FastAPI application using uvicorn
CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "5000"]
