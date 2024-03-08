FROM python:3.11-alpine

RUN apk add --no-cache build-base

COPY requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

WORKDIR /app

COPY ./user.py ./user_controller.py ./

CMD [ "python", "./user.py" ]
