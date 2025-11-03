# Contract Manager MCP Server

A demonstration [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server built with the official [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk). This server simulates a contract management system and showcases MCP capabilities including tools, resources, prompts, subscriptions, progress notifications, sampling, elicitation, and interactive UI cards.

Built with TypeScript, Express.js, SQLite, and [@mcp-ui/server](https://www.npmjs.com/package/@mcp-ui/server).

## Quick Start

### Prerequisites

- [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Setup

1. **Clone and open the repository:**

   ```bash
   git clone <repository-url>
   cd contract-manager-mcp
   code .
   ```

2. **Open in Dev Container:**
   - VS Code will prompt: "Reopen in Container" → Click it
   - Or use Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):
     - Type: `Dev Containers: Reopen in Container`
   - Wait for container to build (~2-3 minutes first time)

3. **Build the project:**
   ```bash
   npm run build
   ```

### Running the Server

The server supports three transport methods. **stdio is recommended** for most MCP clients.

#### stdio Transport (Recommended)

```bash
npm run dev:stdio
```

Best for:

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) testing
- Integration with Claude Desktop, Cursor, VS Code
- Local development and debugging

#### Streamable HTTP Transport

```bash
npm run dev:http
```

Runs on `http://localhost:3000/mcp`

Best for:

- Remote connections
- Web-based clients
- RESTful integrations

#### SSE Transport (Legacy)

```bash
npm run dev:sse
```

Runs on `http://localhost:3000/sse`

Note: SSE transport is deprecated in favor of Streamable HTTP.

### Testing with MCP Inspector

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the official tool for testing MCP servers.

#### Option 1: Combined Start (Easiest)

```bash
# Start both server and inspector
npm run dev:stdio:with-inspector
```

The inspector will automatically open at `http://localhost:6274` with authentication pre-configured.

#### Option 2: Manual Start

**Terminal 1 - Start Server:**

```bash
npm run dev:stdio
```

**Terminal 2 - Start Inspector:**

```bash
npm run inspector:container
```

Then open the URL shown in Terminal 2 (includes auth token).

#### Connecting in the Inspector

For stdio transport:

1. Click **"Connect to Server"**
2. **Server Command:** `node`
3. **Arguments:** `dist/index-stdio.js`
4. Click **Connect**

For HTTP transport:

1. Select **"Streamable HTTP"** transport
2. **URL:** `http://localhost:3000/mcp`
3. Click **Connect**

### Testing with Nanobot

[Nanobot](https://github.com/coleam00/nanobot) is an AI agent that supports MCP servers with UI capabilities. Use this to interact with the server's interactive UI cards.

**Prerequisites:**

- OpenAI API key (required for Nanobot)

**Setup:**

1. **Create a `.env` file** in the project root with your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Build and run:**

   ```bash
   npm run build
   npm run nanobot
   ```

The `nanobot` script automatically loads your API key from `.env` and starts Nanobot with the MCP server configured.

**Interactive UI Cards Available:**

- `view_task` - Interactive task card with completion tracking, employee assignment, and tag management
- `view_employee` - Employee profile with workload statistics and assigned tasks
- `view_contract` - Full contract dashboard with task filtering, sorting, and metrics

## Available Scripts

### Preferred for development with stdio transport

- `npm run dev:stdio` - stdio transport (recommended)
- `npm run dev:stdio:with-inspector` - Server + Inspector together

_Other scripts are available, but these are the main ones_

# Project Overview

This server simulates a **contract management system** for demonstration purposes. It models a fictional organization managing:

- **Programs** - Top-level initiatives (e.g., "Digital Transformation")
- **Contracts** - Specific agreements within programs
- **Tasks** - Work items within contracts (with 0-10 completion tracking)
- **Employees** - Team members who can be assigned to tasks
- **Tags** - Categorization system for tasks

The database includes realistic sample data with friendly codes (E001, P001, C001, T001, TAG001) for easy reference.

## MCP Capabilities

### Tools (26 total)

**Entity Management:**

- List operations for all entities (employees, programs, contracts, tasks, tags)
- Get individual entities by code
- Full CRUD for tasks, employees, and tags
- Relationship management (assign employees/tags to tasks)

**Progress Demonstration:**

- `run_really_long_task` - Simulates long-running operations with progress notifications and cancellation support

**Interactive UI Tools:**

- `view_task` - Display interactive task card with completion, assignments, and tags
- `view_employee` - Display employee profile with workload metrics
- `view_contract` - Display contract dashboard with filtering and sorting

Find implementations in: `src/tools/`

### Resources (10 total)

**List Resources:** Bulk access to all entities

- `contract-manager://employees`
- `contract-manager://programs`
- `contract-manager://contracts`
- `contract-manager://tasks`
- `contract-manager://tags`

**Template Resources:** Individual entity access with code completion

- `contract-manager://employees/{code}`
- `contract-manager://programs/{code}`
- `contract-manager://contracts/{code}`
- `contract-manager://tasks/{code}`
- `contract-manager://tags/{code}`

**Subscriptions:** Demonstrates MCP subscription protocol

- Subscribe to individual contracts: `contract-manager://contracts/{code}`
- Receive `resources/updated` notifications when contract or its tasks change

Find implementations in: `src/resources/`

### Prompts (5 total)

- `contract_analysis` - Comprehensive contract analysis with risk assessment
- `task_planning` - AI-powered task suggestions and dependencies
- `team_assignment` - Intelligent employee assignment recommendations
- `progress_review` - Executive-level progress reports
- `suggest_tags` - Tag categorization suggestions

**Sampling Example:** `suggest_tags` prompt uses MCP sampling to request AI suggestions from the client

Find implementations in: `src/prompts/`

### Advanced Features

**Elicitation:** Demonstrated in delete operations (tasks, employees, tags) which request user confirmation before proceeding

**Progress Notifications:** `run_really_long_task` tool shows proper progress token usage with step-by-step updates

**Subscriptions:** Contract resources support subscription with automatic notifications when contracts or their tasks change

**Structured Content:** All tools return both human-readable content and machine-readable JSON with output schemas

**Annotations:** Tools and resources include semantic hints (readOnly, destructive, priority, audience) for intelligent client behavior

## Project Structure

```
contract-manager-mcp/
├── src/
│   ├── index-stdio.ts          # stdio transport entry
│   ├── index-http.ts           # HTTP transport entry
│   ├── index-sse.ts            # SSE transport entry
│   ├── contractManagerMCP.ts   # Main MCP server class
│   ├── tools/                  # MCP tools
│   │   ├── contractTools.ts
│   │   ├── taskTools.ts
│   │   ├── employeeTools.ts
│   │   ├── tagTools.ts
│   │   ├── programTools.ts
│   │   ├── progressTools.ts    # Progress demo
│   │   └── schemas/            # Tool schemas
│   ├── resources/              # MCP resources
│   │   ├── contractResources.ts
│   │   ├── taskResources.ts
│   │   └── ...
│   ├── prompts/                # MCP prompts
│   │   ├── contractAnalysis.ts
│   │   ├── taskPlanning.ts
│   │   └── ...
│   ├── ui/                     # UI components
│   │   ├── taskCard.ts         # Interactive task card
│   │   ├── employeeCard.ts     # Employee profile card
│   │   ├── contractDashboard.ts # Contract dashboard
│   │   └── styles/             # Shared styling
│   │       ├── constants.ts    # Color palette & dimensions
│   │       ├── loader.ts       # CSS file loader
│   │       ├── taskCard.css
│   │       ├── employeeCard.css
│   │       └── contractDashboard.css
│   ├── services/               # Business logic
│   ├── database/               # SQLite + Knex
│   ├── subscriptions/          # Subscription manager
│   ├── schemas/                # Zod validation
│   └── types/                  # TypeScript types
├── dist/                       # Compiled output
├── nanobot.yaml                # Nanobot config
├── run-nanobot.sh              # Nanobot launcher
├── package.json
├── tsconfig.json
└── README.md
```

## Database

SQLite database with auto-initialization and seeding on startup.

**Entities:**

- Programs (P001, P002)
- Contracts (C001-C003)
- Tasks (T001-T007) with completion values 0-10
- Employees (E001-E005)
- Tags (TAG001-TAG008)

**Features:**

- Auto-generated friendly codes
- Cascade deletes
- Many-to-many relationships (employees-tasks, tags-tasks)
- Audit timestamps

## UI Features

This server includes interactive UI cards powered by [@mcp-ui/server](https://www.npmjs.com/package/@mcp-ui/server):

### Interactive Cards

**Task Card** (`view_task` tool):

- Real-time completion tracking (0-10 scale)
- Employee assignment/removal
- Tag management (add/remove)
- Visual progress indicators
- Contract and program context

**Employee Card** (`view_employee` tool):

- Contact information display
- Workload statistics (total, completed, in-progress, not-started)
- Overall completion rate with progress bar
- List of assigned tasks with quick view buttons

**Contract Dashboard** (`view_contract` tool):

- Contract overview with task metrics
- Overall completion percentage
- Task filtering (All, Completed, In Progress, Not Started)
- Sorting options (by name, by completion)
- Add Task, View, and Edit buttons
- Detailed contract information

### Design System

- **Color Palette**: Monochromatic blue/cyan theme with 8 harmonious colors
- **Typography**: Lato font family from Google Fonts
- **Architecture**: Centralized styling constants for consistency
- **Responsive**: Frame sizes optimized for different card types
- **Interactive**: postMessage API for seamless tool communication

### Technical Implementation

- **Raw HTML**: Self-contained cards with embedded CSS and JavaScript
- **Communication**: postMessage API for iframe-to-parent tool calls
- **Styling**: CSS variables generated from TypeScript constants
- **Build Pipeline**: Automatic CSS asset copying to dist folder

## Environment Configuration

The `.env` file contains development defaults:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
```

**For Nanobot UI features**, you must also add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Customize as needed and restart the server.

## Development Container

The dev container includes:

- Node.js 22
- TypeScript and development tools
- VS Code extensions (TypeScript, ESLint, Prettier)
- Port forwarding (3000, 6274, 6277, 9229)
- Zsh with Oh My Zsh

## Production Deployment

```bash
docker build -t contract-manager-mcp .
docker run -p 3000:3000 contract-manager-mcp
```

## Contributing

1. Follow existing code style
2. Run `npm run lint` and `npm run format` before committing
3. Ensure TypeScript compiles: `npm run build`
4. Update documentation as needed

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP Specification](https://spec.modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)

## License

- ISC

## Troubleshooting

**Inspector UI spinning/not loading:**

- Ensure you're using `npm run inspector:container` in the dev container
- Check that ports 6274 and 6277 are forwarded in your devcontainer.json
- Try manually entering the proxy auth token in the Inspector configuration

**Can't connect to MCP server:**

- Verify your MCP server is running on `http://localhost:3000/mcp`
- Use "Streamable HTTP" transport type
- Check the browser console for CORS or network errors

**Note**: If you get connection issues, you may need to manually add the proxy auth token to the Inspector UI configuration.
