# Default recipe to run when just is called without arguments
default:
    @just --list

# Run examples with curl POST requests
example1:
    curl -X POST -H "Content-Type: application/json" -d '{"input":"Buy bananas, milk, bread and some toothpaste"}' http://localhost:3000/process | jq

example2:
    curl -X POST -H "Content-Type: application/json" -d '{"input":"Remind Professor Smith to review the Stanford research paper next Tuesday at 09:00"}' http://localhost:3000/process | jq

example3:
    curl -X POST -H "Content-Type: application/json" -d '{"input":"Task schedule quarterly review with Director Emily Brown at Apple Campus in Cupertino on 2024-03-15 at 15:45"}' http://localhost:3000/process | jq

# Run all examples sequentially (requires server to be running)
run-examples:
    @just example1
    @just example2
    @just example3

# Check types without running
check:
    deno check main.ts server.ts

# Format the code
fmt:
    deno fmt

# Cache dependencies and check types
cache:
    deno cache main.ts server.ts

# Start the web server (main command to run the application)
serve:
    deno run --allow-read --allow-write --allow-net server.ts

# Show database contents
show-db:
    cat json_db.json | jq
