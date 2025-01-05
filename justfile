# Default recipe to run when just is called without arguments
default:
    @just --list

# Run examples with curl POST requests
example1:
    curl -X POST -H "Content-Type: application/json" -d '{"input":"Buy bananas, milk, bread and some toothpaste"}' http://localhost:3000/process | jq

example2:
    curl -X POST -H "Content-Type: application/json" -d '{"input":"Remind Professor Smith to review the Stanford research paper next Tuesday at 09:00"}' http://localhost:3000/process | jq

example3:
    curl -X POST -H "Content-Type: application/json" -d '{"input":"buy a car, a house and a dog"}' http://localhost:3000/process | jq

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

# Embedding examples with curl POST requests
embed1:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"Buy bananas, milk, bread and some toothpaste"}' http://localhost:3000/embed

embed2:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"Remind Professor Smith to review the Stanford research paper next Tuesday at 09:00"}' http://localhost:3000/embed

embed3:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"Task schedule quarterly review with Director Emily Brown at Apple Campus in Cupertino on 2024-03-15 at 15:45"}' http://localhost:3000/embed

embed4:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"Planks, nails, hammer, paint for my house"}' http://localhost:3000/embed

# Embed task about buying major items
embed5:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"I love my car, my house and my dog"}' http://localhost:3000/embed


# Run all embedding examples sequentially (requires server to be running)
run-embeds:
    @just embed1
    @just embed2
    @just embed3
    @just embed4
    @just embed5


# Compare text similarity against stored documents
compare1:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"meeting with Emily Brown at Apple Inc"}' http://localhost:3000/compare

# Compare similar to shopping list
compare2:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"need to buy groceries: apples, toilet paper and tooth picks"}' http://localhost:3000/compare

# Compare completely different content
compare3:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"The weather in Paris is beautiful during springtime"}' http://localhost:3000/compare

# Compare byuing material
compare4:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"need to aquire some material for building a new shed in my garden, a plank, some nails and a hammer"}' http://localhost:3000/compare

# Compare family and house
compare5:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"my assets are: a car, a house and my avanza account"}' http://localhost:3000/compare

# Compare buy statements
compare6:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"car, dog, milk, bread"}' http://localhost:3000/compare

# Compare entities
compare7:
    curl -X POST -H "Content-Type: application/json" -d '{"text":"I need to see both Smith and Emily Brown next time Im in town"}' http://localhost:3000/compare    

# Source route examples with curl POST requests
source1:
    curl -X POST -H "Content-Type: application/json" -d '{"originSource":"personal","serviceType":"notes","serviceDetails":"shopping-list","content":"Buy bananas, milk, bread and some toothpaste"}' http://localhost:3000/source | jq

source2:
    curl -X POST -H "Content-Type: application/json" -d '{"originSource":"work","serviceType":"email","serviceDetails":"professor@stanford.edu","content":"Remind Professor Smith to review the Stanford research paper next Tuesday at 09:00"}' http://localhost:3000/source | jq

source3:
    curl -X POST -H "Content-Type: application/json" -d '{"originSource":"personal","serviceType":"todo","serviceDetails":"wishlist","content":"buy a car, a house and a dog"}' http://localhost:3000/source | jq

# Run all source examples sequentially
run-sources:
    @just source1
    @just source2
    @just source3
