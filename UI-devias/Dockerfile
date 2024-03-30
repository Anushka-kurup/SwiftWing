# Use base image 
FROM node:latest

# Set the working directory in the container
WORKDIR /UI-devias

# Clone repo
RUN git clone https://github.com/devias-io/material-kit-react.git

# Change the working directory to the app directory
WORKDIR /UI-devias/material-kit-react

# Copy package.json file
COPY package.json .

# Install dependencies based on package.json
RUN npm install

# Copy all files from the current directory to the container
COPY . .

# Expose the port on which the server will run
EXPOSE 3000

# Command to start the server
CMD ["npm", "run", "dev"]
