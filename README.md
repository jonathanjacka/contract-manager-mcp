# Contract Manager Ecosystem

A comprehensive contract management system built with the Model Context Protocol (MCP), featuring an MCP server, authentication service, web UI, and MCP Inspector for development.

## Architecture

This ecosystem consists of multiple services that work together:

- **MCP Server** - Core contract management MCP server with HTTP transport
- **Auth Server** - OAuth2 authentication service _(to do)_
- **Web UI** - Frontend application with MCP UI components _(to do)_
- **MCP Inspector** - Development and debugging tool for MCP protocol testing

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

### MCP Integration (v1.1.0)

- ✅ **MCP Server Implementation**: Full Model Context Protocol server with StreamableHTTPServerTransport
- ✅ **MCP Inspector Support**: Container-friendly inspector setup for MCP protocol development and testing
- ✅ **Colored Logging System**: Organized logging utilities with chalk-based colored output
- ✅ **Constants Management**: Centralized server configuration and response templates
- ✅ **Environment Variables**: Enhanced dotenv integration for proper configuration management
- ✅ **Modern TypeScript**: Updated to tsx for faster, cleaner TypeScript execution
- ✅ **Dependency Cleanup**: Streamlined dependencies, keeping only essential packages for MCP development
- ✅ **Container Networking**: Proper dev container port forwarding for MCP Inspector (6274, 6277)

## Project Structure

```
contract-manager/
├── .devcontainer/         # Dev container configuration (root level)
├── docker-compose.yml     # Multi-service orchestration
├── README.md             # This file
└── mcp-server/           # MCP Server service
    ├── src/              # TypeScript source code
    │   ├── index.ts      # Main MCP server with HTTP transport
    │   ├── constants.ts  # Centralized configuration
    │   └── utils/        # Logging and utility functions
    ├── dist/             # Compiled JavaScript (generated)
    ├── package.json      # Dependencies and MCP-focused scripts
    ├── tsconfig.json     # TypeScript configuration
    ├── Dockerfile        # Production Docker image
    └── README.md         # MCP server specific documentation
```

## Getting Started

### Prerequisites

- VS Code with the Remote-Containers extension
- Docker Desktop

### Development Setup

1. **Clone and open in VS Code:**

   ```bash
   git clone <your-repo-url>
   cd contract-manager/mcp-server
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

4. **Access the services:**
   - MCP Server: http://localhost:3000/mcp
   - Health check: http://localhost:3000/health
   - MCP Inspector: http://localhost:6274 (when running)

**For detailed MCP server setup, scripts, and MCP Inspector usage, see the [mcp-server README](./mcp-server/README.md).**

### Available Scripts

**Core Development:**

- `npm run dev` - Start MCP server with hot reload
- `npm run dev:with-inspector` - Start server and MCP Inspector together
- `npm run build` - Build for production
- `npm run start` - Start production server

**MCP Inspector:**

- `npm run inspector:container` - Start MCP Inspector for dev container
- `npm run inspector:connect` - Start inspector and auto-connect to server

**Code Quality:**

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

**For complete script documentation and MCP Inspector setup, see the [mcp-server README](./mcp-server/README.md).**

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

- `GET /health` - Health check endpoint with server status
- `GET /mcp` - MCP server information (browser-friendly JSON response)

### MCP Protocol

- `POST /mcp` - MCP JSON-RPC endpoint for Model Context Protocol requests

### Future Services

- **Auth Server** - OAuth2 authentication endpoints _(to do)_
- **Web UI** - Frontend application with MCP integration _(to do)_

**For detailed API documentation and MCP capabilities, see the [mcp-server README](./mcp-server/README.md).**

## Development Container Features

The dev container includes:

- **Node.js 22** runtime with modern TypeScript support
- **Development tools** pre-installed (ESLint, Prettier, TypeScript)
- **VS Code extensions** for TypeScript, ESLint, Prettier
- **Port forwarding**:
  - `3000` - MCP Server
  - `6274` - MCP Inspector UI
  - `6277` - MCP Inspector Proxy
  - `9229` - Node.js debugging
- **Git configuration** and Zsh with Oh My Zsh
- **MCP Inspector** configured for container networking

**For detailed dev container setup and MCP Inspector configuration, see the [mcp-server README](./mcp-server/README.md).**

## Production Deployment

### MCP Server

Build and run the MCP server:

```bash
cd mcp-server
docker build -t contract-manager-mcp .
docker run -p 3000:3000 contract-manager-mcp
```

### Multi-Service Deployment

Use Docker Compose for the full ecosystem:

```bash
docker-compose up --build
```

**For detailed deployment instructions and environment configuration, see the [mcp-server README](./mcp-server/README.md).**

## Contributing

1. Follow the existing code style
2. Run `npm run lint` and `npm run format` before committing
3. Ensure all tests pass (when added)
4. Update documentation as needed

## License

ISC
