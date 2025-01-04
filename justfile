# Default recipe to run when just is called without arguments
default:
    @just --list

# Run examples with different inputs
example1:
    deno run --allow-read --allow-write --allow-net main.ts -i "Buy bananas, milk, bread and some toothpaste"

example2:
    deno run --allow-read --allow-write --allow-net main.ts -i "Remind Professor Smith to review the Stanford research paper next Tuesday at 09:00"

example3:
    deno run --allow-read --allow-write --allow-net main.ts -i "Task schedule quarterly review with Director Emily Brown at Apple Campus in Cupertino on 2024-03-15 at 15:45"

# Run all examples sequentially
run-examples:
    @just example1
    @just example2
    @just example3

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
