# Typescript

This project is a monorepository containing:

- Client folder (/client) that uses Next version 15 with Typescript with the following styles:

- Indent with 2 spaces ONLY
- variables will be camelCase
- Constants will be in all caps with underscores (i.e. `MAX_USERS`)
- All function will be in camelCase
- All code files will be lower case with underscores
- Have inline if statement without curly braces if there is ONLY one line of code in the if statement
- All application logic will go in the `src` directory
- All configuration will be done with environment variables, using a `.env` file

- Server folder (/server) that uses AdonisJS with Typescript with the following styles:

- Indent with 2 spaces ONLY
- variables will be camelCase
- Constants will be in all caps with underscores (i.e. `MAX_USERS`)
- All function will be in camelCase
- All code files will be lower case with underscores
- Have inline if statement without curly braces if there is ONLY one line of code in the if statement
- All application logic will go in the `app` or `lib` directory
- All configuration will be done with environment variables, using a `.env` file

# Expertise & Focus

## **Expertise**

Client: TypeScript, Node.js, Next.js (App Router & Server Components), React

- Shadcn UI, Tailwind CSS

Server: TypeScript, Adonis.js

## **Focus**

- Code clarity, readability, maintainability, and adherence to best practices.

## **Style**

- Factual, solution‑focused, and expert‑level responses.
- Concise yet thorough explanations.

---

# Code Style & Structure

## **General Principles**

- Write concise, technical TypeScript code using modern best practices.
- Use **functional and declarative programming patterns**; avoid classes.
- Favor **modularization** and **iteration** over code duplication.
- Use **descriptive variable names** (e.g., `isLoading`, `hasError`).
- Organize code with a **clear file structure**:
  - Separate exported components, subcomponents, helpers, static content, and types.

## **Naming Conventions**

- **Directories**: lowercase with dashes (e.g., `components/auth-wizard`).
- **Components**: Named exports, PascalCase (e.g., `AuthWizard.tsx`).
- **Variables & functions**: camelCase (e.g., `fetchUserData`).
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`).

---

# TypeScript Best Practices

- Enforce **strict type checking** (`strict` mode enabled).
- Prefer **interfaces** over types where appropriate.
- Avoid `any`, `unknown`, or overly generic types; **rely on proper type inference**.
- Document functions and components using **TSdoc/JSDoc**.

---

# React & Next.js Guidelines

## **React Best Practices**

- Use **functional components** with React Hooks.
- Minimize reliance on **stateful client logic**.

## **Next.js (App Router)**

- Favor **Server Components** for data fetching.
- Keep **Client Components lean**; pass data from **Server Components** when possible.
- Implement **responsive design** using Tailwind CSS (mobile‑first approach).

---

# API & Data Fetching

- Use **async/await** with robust **error handling**.
- Prefer **Next.js Server Components** or **type-safe hooks** for data fetching.
- When integrating with databases (e.g., **Supabase**):
  - **Enforce safe queries**.
  - **Ensure proper schema usage**.

---

# Styling & UI Components

- Use **Tailwind CSS** and **Shadcn UI** for consistent styling.
- Avoid **inline styles**; use **utility classes** or **CSS modules** when needed.
- Follow **design system conventions** for:
  - Spacing
  - Colors
  - Typography

---

# Testing & Documentation

## **Testing**

- Include **unit, integration, and E2E tests**.
- Encourage **test-driven development (TDD)**.

## **Documentation**

- Provide **clear inline comments** for non-trivial logic.
- Use **TSdoc/JSDoc** for:
  - Function parameters
  - Return types
  - Component descriptions

---

# Additional Guidelines

- **Context-aware recommendations**: Consider the entire project structure.
- **Security & Performance**: Ensure **error handling**, **security**, and **performance optimizations**.
- **Modern Development Practices**: Align with industry best practices.
