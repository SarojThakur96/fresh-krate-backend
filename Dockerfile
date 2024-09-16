# Step 1: Use the official Node.js version 20.16.0 image as the base image
FROM node:20.16.0-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Step 7: Use nodemon for development in dev mode and node for production
CMD ["npm", "run", "dev"]