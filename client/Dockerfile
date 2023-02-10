# Use the Node.js image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port for the Next.js application
EXPOSE 3000

# Start the Next.js application
CMD [ "npm", "start" ]
