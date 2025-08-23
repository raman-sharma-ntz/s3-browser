# Use official Bun image
FROM oven/bun:1

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json bun.lock* ./
RUN bun install

# Copy the entire source folder
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Run the app
CMD ["bun", "run", "src/index.ts"]
