# Task Tracker CLI

https://roadmap.sh/projects/task-tracker

A lightweight command-line task management tool written in Node.js. Store, list, update, and manage tasks in a JSON file.

## Quick Start

```bash
# Install dependencies
npm install

# Run in interactive mode (no arguments)
node task-cli.js

# Or use CLI mode with specific commands
node task-cli.js add "Buy groceries"
node task-cli.js list
node task-cli.js done <task-id>
node task-cli.js delete <task-id>
```

## Features

- **Add tasks** — Create new tasks with auto-generated 3-character unique IDs
- **List tasks** — View all tasks with ID, description, status, creation & update timestamps
- **Update tasks** — Modify task descriptions
- **Mark status** — Mark tasks as `done` or `in-progress`
- **Delete tasks** — Remove individual tasks or all tasks at once
- **Persistent storage** — All tasks saved in `tasks.json` as JSON array

## File Structure

```
task-cli.js     → Main CLI script (entry point)
tasks.json      → Data file storing task objects
package.json    → Project dependencies (nanoid, Node.js runtime)
```

## Key Learning Points

### What I Built

This is a **first-iteration task manager** focusing on simplicity and learning core Node.js concepts:

- **Synchronous file I/O** — `fs.readFileSync()` and `fs.writeFileSync()` (blocks event loop, fine for small CLI)
- **JSON parsing** — `JSON.parse()` and `JSON.stringify()` for data persistence
- **Unique ID generation** — `nanoid(3)` with **collision prevention** (regenerates if ID exists)
- **Command routing** — Parse `process.argv` to route to different functions
- **Error handling** — Basic validation of inputs (ID, description provided)

### Important Concepts to Remember

1. **Synchronous vs Asynchronous I/O**
   - Current code uses `.readFileSync()` which blocks the event loop
   - For production/high-concurrency, switch to `fs.promises` (async version)

2. **ID Generation**
   - Uses `nanoid(3)` for 3-character IDs (shorter than 5, easier to type)
   - Collision prevention loop ensures no duplicate IDs even with small character set
   - IDs are strings, not numbers (no need for `parseInt()`)

3. **Data Structure** (`tasks.json`)
   ```json
   [
     {
       "id": "a1b",
       "description": "Buy groceries",
       "createdAt": "2026-02-09T10:30:00.000Z",
       "updatedAt": "2026-02-09T10:30:00.000Z",
       "status": "pending"
     }
   ]
   ```

4. **Command Flow**
   - `process.argv.slice(2)` extracts user arguments (skips Node path & script path)
   - Each command (`add`, `list`, `delete`, etc.) calls corresponding function
   - Functions read entire file, modify array, write entire file back (not efficient but simple)

## Known Limitations & Future Improvements

- **No error recovery** — Corrupted `tasks.json` crashes the app
- **Inefficient writes** — Rewrites entire file for each change (OK for small datasets)
- **No argument validation** — Empty descriptions or wrong arg count cause issues
- **Blocking I/O** — Not suitable for concurrent operations or servers

### Next Steps to Try

1. **Create a `loadTasks()` helper**
   ```javascript
   function loadTasks() {
     try {
       if (!fs.existsSync('tasks.json')) {
         fs.writeFileSync('tasks.json', JSON.stringify([], null, 2));
         return [];
       }
       return JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
     } catch (err) {
       console.error('Error loading tasks:', err.message);
       return [];
     }
   }
   ```

2. **Switch to async I/O** (Node.js `fs.promises`)
   ```javascript
   const data = await fs.promises.readFile('tasks.json', 'utf8');
   const tasks = JSON.parse(data);
   ```

3. **Add input validation** — Check if task exists, if description is empty, etc.

4. **Use argument parser library** — `minimist` or `yargs` for robust CLI arg handling

5. **Add an interactive menu** — Use `readline` module for user prompts instead of command-line args

## Running Tests

Currently no automated tests. To manually verify:

```bash
node task-cli.js add "Test task 1"
node task-cli.js add "Test task 2"
node task-cli.js list
node task-cli.js done <id-of-task-1>
node task-cli.js list
node task-cli.js delete <id-of-task-2>
node task-cli.js list
```

## Dependencies

- `nanoid` — Generate short, unique string IDs
- `Node.js v18+` — ES modules, fs, readline built-in

## Resources to Learn From

- [Node.js fs module](https://nodejs.org/api/fs.html)
- [JSON methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [process.argv](https://nodejs.org/api/process.html#process_process_argv)
- [Nanoid documentation](https://github.com/ai/nanoid)

---

**Created:** February 2026  
**Purpose:** Learning Node.js file I/O, JSON handling, and CLI building


https://github.com/vxroone69/task-tracker-cli
