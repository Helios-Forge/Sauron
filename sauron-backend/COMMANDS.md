# Sauron Backend Database Management Commands

A quick reference guide for managing the Sauron database.

## Available Commands

| Command | Description |
|---------|-------------|
| `--seed` | Seed the database with initial test data |
| `--wipe` | Wipe all data from the database |
| `--clean` | Clean orphaned records from the database |
| `--stats` | Display database statistics |
| `--help` | Display help information |

## Usage Examples

### Display Help
```
go run cmd/main.go --help
```

### View Database Statistics
```
go run cmd/main.go --stats
```

### Seed the Database
```
go run cmd/main.go --seed
```

### Wipe the Database
```
go run cmd/main.go --wipe
```

### Wipe and Reseed
```
go run cmd/main.go --wipe --seed
```

### Clean Orphaned Records
```
go run cmd/main.go --clean
```

## Warning

The `--wipe` command will permanently delete all data from the database. Use with caution, especially in production environments.

## Notes

- These commands are intended primarily for development and testing purposes.
- Running the application normally (`go run cmd/main.go` without flags) will start the API server.
- The database is automatically migrated when the application starts. 