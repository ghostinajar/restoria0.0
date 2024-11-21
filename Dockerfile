# Step 1: Use an official Node.js runtime as a base image
FROM node:20

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Step 4: Copy the rest of the app files
COPY . .

# Step 5: Expose the port your app runs on
EXPOSE 3000

# Step 6: Define the command to run your app
CMD ["npm", "start"]
