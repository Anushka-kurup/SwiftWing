# Use base image 
FROM node:latest

# Set the working directory in the container
WORKDIR /UI-devias


# Copy package.json file
COPY package.json .

# Install dependencies based on package.json
RUN npm install

# Copy all files from the current directory to the container
COPY . .

# Step 6: Build the application
RUN npm run build

# Expose the port on which the server will run
EXPOSE 3000

# Step 8: Define the command to run your app
CMD ["npm", "start"]




