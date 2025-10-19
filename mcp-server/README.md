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

### MCP Integration (v1.1.0)

- ✅ **MCP Server Implementation**: Full Model Context Protocol server with StreamableHTTPServerTransport
- ✅ **MCP Inspector Support**: Container-friendly inspector setup with proper port forwarding (6274, 6277)
- ✅ **Colored Logging**: Chalk-based logging system with organized logger utilities
- ✅ **Constants Management**: Centralized server configuration and response templates
- ✅ **Environment Variables**: dotenv integration for proper configuration management
- ✅ **Minimal Server Structure**: Clean, testable server for MCP protocol development
- ✅ **Container Inspector**: MCP Inspector running inside dev container with HOST=0.0.0.0 binding
- ✅ **Modern TypeScript**: Updated to tsx for faster, cleaner TypeScript execution
- ✅ **Dependency Cleanup**: Removed unused packages, kept only essential dependencies

## Project Structure

```
mcp-server/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main MCP server with HTTP transport
│   ├── constants.ts       # Centralized server configuration
│   └── utils/             # Logging and utility functions
│       └── logger.ts      # Colored logging with chalk
├── public/                 # Static assets
├── dist/                   # Compiled JavaScript (generated)
├── node_modules/           # Dependencies (generated)
├── package.json           # Node.js dependencies and MCP-focused scripts
├── package-lock.json      # Dependency lock file
├── tsconfig.json          # TypeScript configuration
├── nodemon.json           # Nodemon configuration for hot reload
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .env                   # Environment variables (git-ignored)
├── .gitignore             # Git ignore patterns
├── Dockerfile             # Production Dockerfile
├── .dockerignore          # Docker ignore file
└── README.md              # This file
```

**Note:** The dev container configuration (`.devcontainer/`) is located in the root directory of the Contract Manager project, not within the mcp-server folder.

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

**Development:**

- `npm run dev` - Start development server with hot reload
- `npm run dev:inspect` - Start with Node.js inspector for debugging
- `npm run dev:with-inspector` - Start both server and MCP Inspector

**MCP Inspector:**

- `npm run inspector:container` - Start MCP Inspector for dev container (HOST=0.0.0.0)
- `npm run inspector:connect` - Start MCP Inspector and auto-connect to local server

**Build & Production:**

- `npm run build` - Build for production
- `npm run start` - Start production server

**Code Quality:**

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

- `GET /health` - Health check endpoint with server status
- `GET /mcp` - MCP server information (browser-friendly JSON response)

### MCP Protocol

- `POST /mcp` - MCP JSON-RPC endpoint for Model Context Protocol requests

### Capabilities

Current server capabilities:

- **Tools**: 0 (minimal server setup)
- **Resources**: 0 (ready for expansion)
- **Prompts**: 0 (ready for expansion)

## MCP Inspector Setup

### Running in Dev Container

The MCP Inspector is configured to run inside the dev container with proper networking:

```bash
# Start MCP Inspector (container-friendly)
npm run inspector:container

# Or run directly with environment variable
HOST=0.0.0.0 npx @modelcontextprotocol/inspector
```

### Accessing the Inspector

1. **Start the Inspector** (it will show a URL with auth token)
2. **Open in browser**: `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=<token>`
3. **Manual auth setup** (if needed):
   - Click "Configuration" in the Inspector UI
   - Find "Proxy Session Token"
   - Enter the token from the terminal output
   - Click "Save"

### Connecting to Your Server

In the MCP Inspector UI:

- **Transport**: Streamable HTTP
- **Server URL**: `http://localhost:3000/mcp`
- Click "Connect"

**Note**: If you get connection issues, you may need to manually add the proxy auth token to the Inspector UI configuration.

### Troubleshooting

**Inspector UI spinning/not loading:**

- Ensure you're using `npm run inspector:container` in the dev container
- Check that ports 6274 and 6277 are forwarded in your devcontainer.json
- Try manually entering the proxy auth token in the Inspector configuration

**Can't connect to MCP server:**

- Verify your MCP server is running on `http://localhost:3000/mcp`
- Use "Streamable HTTP" transport type
- Check the browser console for CORS or network errors

### Development Container Features

The dev container includes:

- Node.js 22 runtime
- TypeScript and development tools pre-installed
- VS Code extensions for TypeScript, ESLint, Prettier
- **Port forwarding**:
  - `3000` - MCP Server
  - `6274` - MCP Inspector UI
  - `6277` - MCP Inspector Proxy
  - `9229` - Node.js debugging
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
