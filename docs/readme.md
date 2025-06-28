# README Standards Enforcement Guide for GitHub Copilot

## Context
Apply these standards when:
- Assisting with project documentation creation/updates
- Implementing new features or dependencies
- Modifying project structure
- Updating installation/usage instructions
- Responding to documentation-related queries

## Enforcement Rules

### Structural Requirements
1. **Header Section**
   - Clear project title (H1)
   - Concise 1-2 sentence description
   - Status badges (first 3 lines):
     ```markdown
     [![Build Status](https://img.shields.io/travis/user/repo)](https://travis-ci.org/user/repo)
     [![Coverage](https://img.shields.io/coveralls/github/user/repo)](https://coveralls.io/github/user/repo)
     [![Version](https://img.shields.io/npm/v/package-name)](https://www.npmjs.com/package/package-name)
     ```

2. **Content Sections** (Maintain order):
   - **Features** (bullet points with key capabilities)
   - **Quick Start** (installation and basic usage)
   - Detailed Usage Examples
   - Configuration Guide
   - API Documentation (if applicable)
   - Contribution Guidelines

3. **Technical Requirements**
   - Code blocks with language specification:
     ```javascript
     console.log('Proper syntax highlighting');
     ```
   - Relative links for internal documentation references
   - Version-specific dependency requirements

### Formatting Standards
- **Line Length**: Hard wrap at 120 characters
- **Headings**: Use sentence case (e.g., "## Quick start")
- **Lists**: Use hyphen-style markers with proper indentation
- **Images**:
  - Include alt text
  - Use responsive markup:
    ```markdown
    <img src="diagram.png" alt="System architecture" style="max-width: 600px;">
    ```

### Update Protocol
1. **Version Tracking**
   - Maintain changelog in separate CHANGELOG.md
   - Update documentation with each merged PR
   - Quarterly reviews for outdated information

2. **Validation Checks**
   - Verify all commands in bash blocks:
     ```bash
     npm test && npm run build
     ```
   - Confirm external links are active
   - Ensure API examples match current implementation

## Validation Examples

**Valid Implementation**
```markdown
# AI Documentation Assistant

[![Build](https://img.shields.io/github/actions/workflow/status/user/repo/build.yml)](https://github.com/user/repo/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

AI-powered documentation generator with multi-format support.

## Features
- Natural language processing integration
- Markdown/PDF/HTML output
- Custom template engine
- Version control integration

## Quick Start
Install dependencies:
```bash
npm install -g ai-docs