---
description: Styles and conventions used in our AdonisJS v6 application
globs:
---

- Write clean, modular TypeScript code using functional and declarative patterns.
- Avoid OOP-heavy patterns; prefer services, providers, and utility modules over classes where possible.
- Use clear and descriptive variable names (`isActive`, `hasAccess`, etc.).
- Structure files into: routes/controllers, services, validators, models, and utilities.

## syntax-and-formatting

- Prefer concise syntax in conditionals and iterations.
- Use `async/await` for promise handling over chained `.then()`/`.catch()`.
- Stick to AdonisJS-specific conventions (e.g., route groups, dependency injection via IoC container).

## typescript-usage

- Use TypeScript everywhere; prefer `type` aliases over `interface` unless extending.
- Avoid enums; use object literals or maps.
- Leverage AdonisJS's strong typings for `HttpContext`, route params, and service contracts.

## performance-optimization

- Use Eager/Lazy loading wisely in Lucid ORM to prevent N+1 queries.
- Cache common queries with AdonisJS's Cache Manager (Redis or in-memory).
- Optimize frontend payloads when using Inertia.js or client rendering.
- Defer non-critical tasks (e.g., emailing) with AdonisJS's Queue system.

## database-querying-and-data-model-creation

- Use Lucid ORM for model management and schema definitions.
- Group model logic into queries, scopes, and static helpers for readability.
- For advanced querying, use raw SQL or the query builder where needed.

## key-conventions

- Use Validators and Schemas to enforce data shape at the edge.
- Separate business logic into services and repositories; avoid bloated controllers.
- Use AdonisJS's built-in logging for traceable and structured logs.
- Optimize response times with middleware: compress, cache headers, etc.
- Stick to RESTful principles in route design; use resource routes where appropriate.
