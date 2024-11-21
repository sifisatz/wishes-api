# Wishes API

A simple API built using the Hono framework for managing wishes. This API allows users to create, retrieve, update, and delete wishes, making it easy to keep track of personal goals and desires. The application features schema validation with Zod, ensuring that all data meets specified requirements.

## Key Features

- Create new wishes with descriptions, prices, and priority levels.
- Retrieve all wishes or specific wishes by ID.
- Update existing wishes.
- Delete wishes as needed.
- Comprehensive request validation using Zod for data integrity.

## Installation

To install dependencies, run:

```sh
bun install
```

##Running the Application

To start the development server, use:

```sh
bun run dev
```

### Accessing the API

Open your browser and navigate to:

http://localhost:3000

### Accessing the Swagger API

To view the API documentation via Swagger UI, go to:

http://localhost:3000/ui


docker-compose up -d