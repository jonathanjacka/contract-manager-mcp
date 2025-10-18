# MCP Server

The core Model Context Protocol server for the Contract Manager ecosystem. Built with Express.js and TypeScript, this service handles contract management operations and provides MCP endpoints for client applications.

This service is part of the larger Contract Manager ecosystem. See the [root README](../README.md) for information about the full system.

## Changelog

### Initial Setup (v1.0.0)

- ✅ **Express.js Server**: Basic Express server with TypeScript
- ✅ **Development Container**: Complete Docker and VS Code dev container configuration
- ✅ **Security Middleware**: Helmet for security headers, CORS configuration
- ✅ **Request Logging**: Morgan middleware for HTTP request logging
- ✅ **Health Check Endpoints**: `/health` endpoint with system status
- ✅ **Hot Reload Development**: Nodemon configuration for automatic restarts
- ✅ **Code Quality Tools**: ESLint and Prettier configuration
- ✅ **TypeScript Configuration**: Modern TypeScript setup with Node.js subpath imports
- ✅ **Production Docker Build**: Multi-stage Dockerfile for production deployment
- ✅ **Favicon Handling**: Clean handling of browser favicon requests
- ✅ **API Structure**: Basic API endpoints with placeholder routes for future MCP/OAuth2
- ✅ **Environment Configuration**: Local .env file with development defaults (git-ignored)
- ✅ **Graceful Shutdown**: Proper SIGTERM/SIGINT handling for clean shutdowns

## Project Structure

```
mcp-server/
├── .devcontainer/          # Dev container configuration
│   ├── devcontainer.json   # VS Code dev container settings
│   └── Dockerfile          # Development Dockerfile
├── src/                    # TypeScript source code
│   └── index.ts           # Main Express server
├── dist/                   # Compiled JavaScript (generated)
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── nodemon.json           # Nodemon configuration for hot reload
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .env.example           # Environment variables template
├── Dockerfile             # Production Dockerfile
├── .dockerignore          # Docker ignore file
└── README.md              # This file
```

## Getting Started

### Prerequisites

- VS Code with the Remote-Containers extension
- Docker Desktop

### Development Setup

1. **Clone and open in VS Code:**

   ```bash
   git clone <your-repo-url>
   cd mcp-server
   code .
   ```

2. **Open in Dev Container:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Remote-Containers: Reopen in Container"
   - Wait for the container to build and dependencies to install

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Access the server:**
   - Main API: http://localhost:3000
   - Health check: http://localhost:3000/health
   - API info: http://localhost:3000/api

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run dev:inspect` - Start with Node.js inspector for debugging
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Environment Configuration

The project uses environment variables for configuration. A `.env` file is already included for local development with sensible defaults.

#### Environment Variables

| Variable      | Description          | Default                                       | Required |
| ------------- | -------------------- | --------------------------------------------- | -------- |
| `PORT`        | Server port          | `3000`                                        | No       |
| `NODE_ENV`    | Environment mode     | `development`                                 | No       |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000,http://localhost:8080` | No       |

#### Future Configuration (Placeholders)

The following variables are prepared for future features:

**Database:**

- `DATABASE_URL` - PostgreSQL connection string

**OAuth2 Authentication:**

- `OAUTH_CLIENT_ID` - OAuth2 client ID
- `OAUTH_CLIENT_SECRET` - OAuth2 client secret
- `OAUTH_REDIRECT_URI` - OAuth2 callback URL

**JWT Tokens:**

- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration time

**MCP Server:**

- `MCP_SERVER_NAME` - Server display name
- `MCP_SERVER_VERSION` - Server version

#### Customizing Environment

To customize your environment:

1. **Edit the `.env` file** directly in your workspace
2. **Restart the development server** for changes to take effect:
   ```bash
   # Stop the current server (Ctrl+C), then:
   npm run dev
   ```

**Note:** The `.env` file is ignored by git to keep your local configuration private.

## API Endpoints

### Health & Info

- `GET /health` - Health check endpoint
- `GET /api` - API information and available endpoints
- `GET /` - Welcome message

### Future Endpoints

- `GET /mcp` - MCP server endpoint (placeholder)
- `GET /auth` - OAuth2 authentication endpoint (placeholder)

## Development Container Features

The dev container includes:

- Node.js 22 runtime
- TypeScript and development tools pre-installed
- VS Code extensions for TypeScript, ESLint, Prettier
- Port forwarding for development server (3000), MCP inspector (8080), and debugging (9229)
- Git configuration
- Zsh with Oh My Zsh

## Production Deployment

Build the production Docker image:

```bash
docker build -t mcp-server .
docker run -p 3000:3000 mcp-server
```

## Contributing

1. Follow the existing code style
2. Run `npm run lint` and `npm run format` before committing
3. Ensure all tests pass (when added)
4. Update documentation as needed

## License

ISC
