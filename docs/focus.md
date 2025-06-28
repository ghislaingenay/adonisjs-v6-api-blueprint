# Focus File for Coding Conventions

## Project Structure

- All application logic will go in the `src` directory.
- All configuration will be done with environment variables, using a `.env` file.

## Coding Conventions

### General

- Use TypeScript for all code.
- Indent with 2 spaces ONLY.
- Use camelCase for variable names.
- Use PascalCase for class names.
- Use snake_case for code file names.
- Use single quotes for strings.
- Constants will be in all caps with underscores (e.g., `MAX_USERS`).
- All functions will be in camelCase.
- Inline if statements without curly braces if there is ONLY one line of code in the if statement.

### Example

#### File: `src/example_file.ts`

```typescript
// filepath: src/example_file.ts

const MAX_USERS = 100

class User {
  private userName: string

  constructor(userName: string) {
    this.userName = userName
  }

  getUserName(): string {
    return this.userName
  }
}

const createUser = (name: string): User => new User(name)

if (MAX_USERS > 0) console.log('Max users is greater than 0')
```

## Environment Variables

- All configuration will be done with environment variables, using a `.env` file.
- Example `.env` file:

```
DATABASE_URL=your_database_url
API_KEY=your_api_key
```
