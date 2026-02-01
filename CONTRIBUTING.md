# Contributing to ArchiSteamFarm Raycast Extension

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and considerate to all contributors
- Provide constructive feedback
- Focus on what is best for the community

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Raycast installed on macOS
- Git
- An ArchiSteamFarm instance running locally (for testing)

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/archisteamfarm-raycast.git
   cd archisteamfarm-raycast
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development mode:
   ```bash
   npm run dev
   ```

5. The extension will appear in Raycast under the development tab

## Development Workflow

### Branching

- `master` - Production branch
- Create a new branch for your feature or bugfix:
  ```bash
   git checkout -b feature/your-feature-name
   ```
  or
  ```bash
   git checkout -b fix/your-bugfix-name
   ```

### Making Changes

1. Write clean, readable code
2. Follow the existing code style and conventions
3. Ensure proper TypeScript typing
4. Test your changes with a real ASF instance

### Testing

Before submitting, test with:
- A running ASF instance with IPC enabled
- Multiple bots configured
- Test all actions (start, stop, pause, resume)
- Test 2FA token copying
- Test error scenarios (offline ASF, wrong password)

### Committing

- Write clear, descriptive commit messages
- Use conventional commit format:
  ```
  type(scope): description

  Examples:
  feat(dashboard): add bot sorting by status
  fix(api): improve error handling for connection timeouts
  docs(readme): update installation instructions
  ```

### Pull Requests

1. Push your changes to your fork
2. Open a pull request against the `master` branch
3. Provide a clear description of your changes
4. Reference any related issues
5. Ensure all CI checks pass

## Project Structure

```
archisteamfarm-raycast/
├── src/
│   ├── dashboard.tsx       # Main dashboard command
│   ├── copy-2fa.tsx        # 2FA token copy command
│   └── utils/
│       └── api.ts          # ASF API client
├── assets/                # Extension assets
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Tech Stack

- **Framework**: Raycast Extensions API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: npm

## Guidelines

### Type Safety

- Use TypeScript for all new files
- Avoid using `any` type
- Use proper type definitions from ASF API

### API Integration

- The ASF API client is in `src/utils/api.ts`
- Use existing functions where possible
- Add proper error handling for all API calls
- Follow the existing pattern for new endpoints

### UI/UX

- Maintain consistency with Raycast design guidelines
- Use appropriate icons and colors
- Provide clear feedback for user actions (toasts, HUD)
- Handle loading states properly

### Error Handling

- Always catch errors from API calls
- Display user-friendly error messages
- Include actionable error details when possible
- Log technical errors for debugging

## Scripts

```bash
npm run dev      # Start development mode
npm run build    # Build extension for production
npm run lint     # Run ESLint
npm run fix-lint # Auto-fix linting issues
```

## Testing Scenarios

### Connection Testing
- Test with local ASF instance
- Test with remote ASF instance (if available)
- Test with wrong credentials
- Test with ASF offline

### Bot Operations
- Start a stopped bot
- Stop a running bot
- Pause farming (permanent and temporary)
- Resume farming
- Refresh bot status

### 2FA Token Operations
- Copy 2FA token for bots with 2FA
- Attempt to copy for bots without 2FA
- Copy Steam IDs
- Handle token generation failures

### Error Scenarios
- Connection timeout
- Authentication failure
- Bot not found
- 2FA token generation failure

## Questions?

If you have any questions, feel free to open an issue or reach out to the maintainers.

## Resources

- [ArchiSteamFarm Documentation](https://github.com/JustArchiNET/ArchiSteamFarm/wiki)
- [ASF IPC API](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/IPC)
- [Raycast Extensions Documentation](https://developers.raycast.com)
- [Raycast API Reference](https://developers.raycast.com/api-reference)

---

Happy contributing! 🚀
