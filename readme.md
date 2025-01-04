# Deno Project

This project demonstrates basic Deno functionality with TypeScript.

## Running the Project

To run the project with necessary permissions:

```bash
deno run --allow-net --allow-read --allow-write main.ts
```

### Permission Flags Explained:

- `--allow-net`: Allows network access
- `--allow-read`: Allows file system read access
- `--allow-write`: Allows file system write access

## Development

To watch for changes and automatically restart:

```bash
deno run --watch --allow-net --allow-read --allow-write main.ts
```
