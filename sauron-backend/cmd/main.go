package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"sauron-backend/docs"
	"sauron-backend/internal/api"
	"sauron-backend/internal/db"
	"time"

	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Sauron Backend API
// @version         1.0
// @description     A comprehensive API for managing firearm parts, models, and compatibility.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /
// @schemes   http

// @securityDefinitions.basic  BasicAuth

func main() {
	// Define command line flags
	seedFlag := flag.Bool("seed", false, "Seed the database with initial data")
	wipeFlag := flag.Bool("wipe", false, "Wipe all data from the database")
	resetFlag := flag.Bool("reset", false, "DANGER: Completely reset and rebuild the database schema (drops ALL tables and data)")
	cleanFlag := flag.Bool("clean", false, "Clean orphaned records from the database")
	statsFlag := flag.Bool("stats", false, "Display database statistics")
	helpFlag := flag.Bool("help", false, "Display help information")

	// Parse command line flags
	flag.Parse()

	// Display help if requested
	if *helpFlag {
		fmt.Println("Sauron Backend - Database Management Tool")
		fmt.Println("Usage: main [options]")
		fmt.Println("\nOptions:")
		flag.PrintDefaults()
		fmt.Println("\nExamples:")
		fmt.Println("  main                    # Start the server normally")
		fmt.Println("  main --seed             # Seed the database with initial data")
		fmt.Println("  main --wipe             # Wipe all data from the database")
		fmt.Println("  main --reset            # DANGER: Completely reset the database (drops ALL tables)")
		fmt.Println("  main --reset --seed     # Reset database and seed with fresh data")
		fmt.Println("  main --stats            # Display database statistics")
		fmt.Println("  main --clean            # Clean orphaned records")
		return
	}

	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	// Special handling for stats command - connect to DB but don't auto-seed
	if *statsFlag && !(*seedFlag || *wipeFlag || *resetFlag || *cleanFlag) {
		// Just connect to DB without seeding
		db.ConnectDB()

		// Display stats
		stats := db.GetDBStats()
		fmt.Println("\n--- Database Statistics ---")
		for table, count := range stats {
			fmt.Printf("%-20s: %d records\n", table, count)
		}
		fmt.Println("---------------------------\n")

		// Exit early
		log.Println("Stats command executed successfully")
		return
	}

	// Initialize DB connection for all commands
	if *resetFlag {
		// For reset flag, just connect to the database without auto-seeding
		db.ConnectDB()

		fmt.Println("\n⚠️  WARNING: You are about to COMPLETELY RESET the database schema.")
		fmt.Println("⚠️  This will DROP ALL TABLES and DELETE ALL DATA!")
		fmt.Println("⚠️  Press Ctrl+C now to cancel, or wait 5 seconds to continue...\n")

		// Wait 5 seconds to allow user to cancel
		for i := 5; i > 0; i-- {
			fmt.Printf("\rContinuing in %d seconds...", i)
			time.Sleep(1 * time.Second)
		}
		fmt.Println("\rReset operation starting now...           ")

		log.Println("Resetting database schema as requested...")
		if err := db.ResetDatabase(); err != nil {
			log.Fatalf("Error resetting database: %v", err)
		}
	} else {
		// For all other commands, initialize DB normally (with potential auto-seeding)
		db.InitDB()
	}

	// Handle database commands
	handledCommand := false

	// Handle reset flag - mark as handled since we already executed it
	if *resetFlag {
		handledCommand = true

		// After reset, we should explicitly seed if requested,
		// since the database is now empty
		if *seedFlag {
			log.Println("Seeding database after reset...")
			db.SeedDatabase()
			// Mark seed as handled so we don't do it twice
			*seedFlag = false
		}
	}

	// Handle wipe flag
	if *wipeFlag && !*resetFlag {
		log.Println("Wiping database as requested...")
		if err := db.WipeDatabase(); err != nil {
			log.Fatalf("Error wiping database: %v", err)
		}
		handledCommand = true
	}

	// Handle seed flag (unless we already did it after reset)
	if *seedFlag {
		log.Println("Seeding database as requested...")
		db.SeedDatabase()
		handledCommand = true
	}

	// Handle clean flag
	if *cleanFlag {
		log.Println("Cleaning orphaned records as requested...")
		db.CleanOrphanedRecords()
		handledCommand = true
	}

	// Handle stats flag (when combined with other commands)
	if *statsFlag {
		stats := db.GetDBStats()
		fmt.Println("\n--- Database Statistics ---")
		for table, count := range stats {
			fmt.Printf("%-20s: %d records\n", table, count)
		}
		fmt.Println("---------------------------\n")
		handledCommand = true
	}

	// If we handled a command and there's no need to start the server, exit
	if handledCommand && (*seedFlag || *wipeFlag || *resetFlag || *cleanFlag || *statsFlag) {
		log.Println("Command(s) executed successfully")
		return
	}

	// Continue with starting the server
	log.Println("Starting the server...")

	// Programmatically set swagger info
	docs.SwaggerInfo.Title = "Sauron Backend API"
	docs.SwaggerInfo.Description = "A comprehensive API for managing firearm parts, models, and compatibility."
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.BasePath = "/"
	docs.SwaggerInfo.Schemes = []string{"http"}

	// Setup router
	router := api.SetupRouter()

	// Add Swagger documentation route
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server
	log.Printf("Server starting on port %s...\n", port)
	log.Printf("Swagger documentation available at http://localhost:%s/swagger/index.html\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
