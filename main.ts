function helloWorlds(): void {
  const worlds = ["Earth", "Mars", "Venus", "Jupiter", "Saturn"];
  worlds.forEach(world => {
    console.log(`Hello, ${world}!`);
  });
}

// Call the function
helloWorlds();
