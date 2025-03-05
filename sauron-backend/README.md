# Sauron Backend

The backend service for the Sauron project. This service provides APIs for managing firearm parts, models, and compatibility information.

## Getting Started

### Prerequisites

- Go 1.17+
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory with the following content (modify as needed):

```
# Server Configuration
PORT=8080

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=sauron_db

# Optional: Additional Configuration
GIN_MODE=debug  # Set to 'release' in production 
```

### Running the Application

Build and run the application:

```bash
go run cmd/main.go
```

The server will start on port 8080 (or the port specified in your .env file). 
Swagger documentation will be available at `http://localhost:8080/swagger/index.html`.

## Database Management Commands

The application includes several command-line parameters for managing the database:

### Available Commands

- `--seed`: Seed the database with initial test data
- `--wipe`: Wipe all data from the database
- `--clean`: Clean orphaned records from the database
- `--stats`: Display database statistics
- `--help`: Display help information

### Examples

```bash
# Start the server normally
go run cmd/main.go

# Seed the database with initial data
go run cmd/main.go --seed

# Wipe all data from the database
go run cmd/main.go --wipe

# Wipe and then reseed the database
go run cmd/main.go --wipe --seed

# Display database statistics
go run cmd/main.go --stats

# Clean orphaned records
go run cmd/main.go --clean
```

### Important Notes

- The `--wipe` command will permanently delete all data from all tables. Use with caution.
- Running the application normally will automatically apply any needed migrations.
- The `--seed` command is intended for testing and development purposes.

## API Documentation

Once the server is running, you can access the Swagger UI at:
`http://localhost:8080/swagger/index.html`

This provides interactive documentation for all available API endpoints.

## Project Structure

- `cmd/`: Contains the application entry points
- `internal/`: Contains the internal application code
  - `api/`: API route handlers and middleware
  - `db/`: Database connection and data access
  - `models/`: Database models
  - `types/`: Type definitions used throughout the application
- `docs/`: Swagger documentation

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request 