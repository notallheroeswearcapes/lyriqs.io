FROM node:latest

# Set the work directory to app folder. 
# We will be copying our code here
WORKDIR /lyriqs-server

# Copy package.json file in the node folder inside container
COPY package.json .

# Install the dependencies in the container
RUN npm install

# Copy the rest of the code in the container
COPY . .

# Compile the TypeScript code and build the application
RUN npm run build

# Run the node server with compiled server file
CMD ["node", "build/server.js"]

# Expose the service over PORT 3000
EXPOSE 3000