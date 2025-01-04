# Default recipe to run when just is called without arguments
default:
    @just --list

# Run the main script with necessary permissions
run:
    deno run --allow-read --allow-write --allow-net main.ts

# Run the script in watch mode for development
watch:
    deno run --watch --allow-read --allow-write --allow-net main.ts

# Check types without running
check:
    deno check main.ts

# Format the code
fmt:
    deno fmt

# Cache dependencies and check types
cache:
    deno cache main.ts 