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

### Database Implementation (v1.2.0)

- ✅ **SQLite Database**: Lightweight, file-based database with contract management schema
- ✅ **Knex.js Integration**: TypeScript-first query builder with migrations and seeding
- ✅ **Complete Schema**: Programs, Contracts, Tasks, Employees, Tags with proper relationships
- ✅ **UUID Primary Keys**: All entities use UUIDs for unique identification
- ✅ **Auto-initialization**: Database setup and seeding on every server startup
- ✅ **Service Layer**: Type-safe CRUD operations and relationship queries
- ✅ **Rich Sample Data**: Realistic employee and project data for testing

### MCP Tools Implementation (v1.3.0)

- ✅ **Friendly Code System**: Human-readable codes (E001, P001, C001, T001, TAG001) for all entities
- ✅ **Database Triggers**: Auto-generation of friendly codes for new records
- ✅ **List Tools**: Complete set of list tools for all entities (employees, programs, contracts, tasks, tags)
- ✅ **Individual Get Tools**: Get specific entities by their friendly codes
- ✅ **Resource Links**: Interactive resource links for easy navigation between entities
- ✅ **Embedded Resources**: Full JSON data embedding for detailed entity information
- ✅ **Zod Schema Validation**: Type-safe input validation for all MCP tool parameters
- ✅ **Error Handling**: Proper error assertions with meaningful messages

### Comprehensive CRUD Operations (v1.4.0)

- ✅ **Task Management**: Full CRUD operations for tasks (create, update, delete, list by contract)
- ✅ **Employee Management**: Complete employee lifecycle (add, edit, delete, assign to tasks, remove from tasks)
- ✅ **Tag System**: Full tag management (create, edit, delete, apply to tasks, remove from tasks)
- ✅ **Unique Validation**: Tag names must be unique across the system
- ✅ **Relationship Management**: Proper handling of many-to-many relationships (employees-tasks, tags-tasks)
- ✅ **Modular Architecture**: Organized tools by entity type for better maintainability
- ✅ **Service Layer**: Dedicated service files for each entity with comprehensive operations
- ✅ **Code-Based Operations**: All CRUD operations use friendly codes instead of UUIDs

### MCP Resources Implementation (v1.5.0)

- ✅ **MCP Resources Capability**: Full implementation of MCP Resources specification
- ✅ **List Resources**: 5 list resources providing bulk access to all entity types (employees, programs, contracts, tasks, tags)
- ✅ **Template Resources**: 5 parameterized template resources for individual entity access with friendly code completion
- ✅ **Resource Discovery**: Complete resource discovery with `list: undefined` to prevent resource bloat
- ✅ **Intelligent Completion**: Code completion for all entity friendly codes (E001, P001, C001, T001, TAG001)
- ✅ **Consistent URI Patterns**: Standardized `contract-manager://` scheme for all resources
- ✅ **Modular Resource Architecture**: Organized resources by entity type in separate files
- ✅ **Error Handling**: Consistent error handling using project's assert utility

### MCP Prompts Implementation (v1.6.0)

- ✅ **MCP Prompts Capability**: Full implementation of MCP Prompts specification for structured AI interactions
- ✅ **Contract Analysis Prompt**: Comprehensive contract analysis with tasks, team, and risk assessment
- ✅ **Task Planning Prompt**: AI-powered task suggestions, breakdown, and planning recommendations
- ✅ **Team Assignment Prompt**: Intelligent employee assignment suggestions based on skills and workload
- ✅ **Progress Review Prompt**: Automated progress reports for contracts and programs with executive insights
- ✅ **Tag Suggestions Prompt**: Smart tag recommendations for tasks with existing tag context
- ✅ **Intelligent Completion**: All prompts support code completion for entity references
- ✅ **Rich Context Embedding**: Prompts include relevant data as embedded resources for AI analysis
- ✅ **Modular Prompt Architecture**: Organized prompts by functionality in separate files

### MCP Annotations Implementation (v1.7.0)

- ✅ **Tool Annotations**: Complete MCP ToolAnnotations implementation for all 21 tools with semantic behavior hints
- ✅ **Resource Annotations**: MCP Annotations implementation for all 10 resources with priority and audience targeting
- ✅ **Type-Safe Annotations**: Custom TypeScript types enforcing proper annotation combinations and defaults
- ✅ **Read-Only Operations**: Proper `readOnlyHint: true` for all list/get operations (13 tools)
- ✅ **Safe Operations**: `destructiveHint: false` for create/update operations with clear behavior indicators
- ✅ **Idempotent Operations**: `idempotentHint: true` for update and assignment operations that can be safely repeated
- ✅ **Delete Operations**: Proper destructive operation handling with default `destructiveHint: true` for delete tools
- ✅ **Closed-World System**: `openWorldHint: false` across all tools indicating self-contained contract management
- ✅ **Resource Priorities**: Business-logic driven priority hierarchy (Programs: 1.0, Contracts: 0.9, Tasks: 0.8, Employees: 0.7, Tags: 0.5)
- ✅ **Audience Targeting**: All resources target both `user` and `assistant` audiences for comprehensive access
- ✅ **Client Optimization**: Annotations enable smart context window management and tool selection by MCP clients

### Structured Content Implementation (v1.8.0)

- ✅ **MCP Structured Content**: Complete implementation of MCP structured content specification for all 21 tools
- ✅ **Output Schemas**: Comprehensive Zod-based output schemas for all entity types and operations
- ✅ **Type-Safe Validation**: Structured content validated against schemas ensuring data consistency
- ✅ **Backward Compatibility**: All tools return both `content` and `structuredContent` for maximum compatibility
- ✅ **Rich Metadata**: Enhanced structured content with operation success indicators and descriptive messages

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
    │   ├── tools/        # Modular MCP tools organized by entity
    │   │   ├── index.ts           # Main tools orchestrator
    │   │   ├── employeeTools.ts   # Employee CRUD operations
    │   │   ├── taskTools.ts       # Task CRUD operations
    │   │   ├── tagTools.ts        # Tag CRUD operations
    │   │   ├── programTools.ts    # Program list/get operations
    │   │   ├── contractTools.ts   # Contract list/get operations
    │   │   └── utils.ts           # Shared utility functions
    │   ├── services/     # Modular business logic and data access
    │   │   ├── index.ts           # Service exports
    │   │   ├── employeeService.ts # Employee data operations
    │   │   ├── taskService.ts     # Task data operations
    │   │   ├── tagService.ts      # Tag data operations
    │   │   ├── programService.ts  # Program data operations
    │   │   ├── contractService.ts # Contract data operations
    │   │   └── database.ts        # Legacy service exports
    │   ├── resources/    # MCP Resources for data access
    │   │   ├── index.ts           # Resource registration
    │   │   ├── employeeResources.ts # Employee list/template resources
    │   │   ├── taskResources.ts     # Task list/template resources
    │   │   ├── tagResources.ts      # Tag list/template resources
    │   │   ├── programResources.ts  # Program list/template resources
    │   │   └── contractResources.ts # Contract list/template resources
    │   ├── prompts/      # MCP Prompts for AI interactions
    │   │   ├── index.ts            # Prompt registration
    │   │   ├── contractAnalysis.ts # Contract analysis prompt
    │   │   ├── taskPlanning.ts     # Task planning prompt
    │   │   ├── teamAssignment.ts   # Team assignment prompt
    │   │   ├── progressReview.ts   # Progress review prompt
    │   │   └── tagSuggestions.ts   # Tag suggestions prompt
    │   ├── types/        # TypeScript type definitions
    │   │   └── annotations.ts  # MCP annotation type definitions
    │   ├── database/     # Database configuration and migrations
    │   ├── schemas/      # Zod input validation schemas
    │   ├── middleware/   # Express middleware
    │   ├── routes/       # Express route handlers
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

### Database

The MCP server includes a complete contract management database with:

- **Programs**, **Contracts**, **Tasks**, **Employees**, and **Tags**
- **Friendly codes** (E001, P001, C001, T001, TAG001) for human-readable entity identification
- **UUID primary keys** and proper foreign key relationships
- **Automatic seeding** with sample data on server startup
- **Type-safe service layer** for all data operations
- **Database triggers** for auto-generating friendly codes on new records

### MCP Tools

The server provides comprehensive MCP tools for contract management with full MCP annotations for optimal client behavior:

**Tool Annotations Features:**

- **Behavior Hints**: All tools include semantic annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`)
- **Type Safety**: Custom `ToolAnnotations` type enforces proper annotation combinations
- **Client Optimization**: Annotations help MCP clients with tool selection, context management, and safety warnings
- **Closed-World System**: All tools marked with `openWorldHint: false` indicating self-contained operations

**List Tools** (Read-Only):

- `list_employees` - List all employees with their roles and departments
- `list_programs` - List all programs with descriptions
- `list_contracts` - List all contracts with status and values
- `list_tasks` - List all tasks with completion status
- `list_tags` - List all tags for categorization

**Individual Get Tools** (Read-Only):

- `get_employee` - Get specific employee by code (e.g., E001)
- `get_program` - Get specific program by code (e.g., P001)
- `get_contract` - Get specific contract by code (e.g., C001)
- `get_task` - Get specific task by code (e.g., T001)
- `get_tag` - Get specific tag by code (e.g., TAG001)

**Task Management Tools** (Mixed Operations):

- `create_task` - Create new tasks with completion tracking (Safe: `destructiveHint: false`)
- `update_task` - Update task details and completion status (Safe & Idempotent: `destructiveHint: false, idempotentHint: true`)
- `delete_task` - Remove tasks (Destructive: default `destructiveHint: true`)
- `get_tasks_by_contract` - List all tasks for a specific contract (Read-Only)

**Employee Management Tools** (Mixed Operations):

- `add_employee` - Create new employees with roles and contact info (Safe: `destructiveHint: false`)
- `edit_employee` - Update employee information (Safe & Idempotent: `destructiveHint: false, idempotentHint: true`)
- `delete_employee` - Remove employees (Destructive: default `destructiveHint: true`)
- `add_employee_to_task` - Assign employees to tasks (Safe & Idempotent: `destructiveHint: false, idempotentHint: true`)
- `remove_employee_from_task` - Remove employee assignments (Safe & Idempotent: `destructiveHint: false, idempotentHint: true`)
- `get_employee_by_task` - List all employees assigned to a task (Read-Only)

**Tag Management Tools** (Mixed Operations):

- `create_tag` - Create new tags with unique names (Safe: `destructiveHint: false`)
- `edit_tag` - Update tag information (Safe & Idempotent: `destructiveHint: false, idempotentHint: true`)
- `delete_tag` - Remove tags (Destructive: default `destructiveHint: true`)
- `add_tag_to_task` - Apply tags to tasks for categorization (Safe & Idempotent: `destructiveHint: false, idempotentHint: true`)
- `remove_tag_from_task` - Remove tag assignments from tasks (Safe & Idempotent: `destructiveHint: false, idempotentHint: true`)

### MCP Resources

The server provides comprehensive MCP Resources for efficient data access with priority-based annotations:

**Resource Annotations Features:**

- **Priority Hierarchy**: Business-logic driven priorities from 0.5 to 1.0 for context window optimization
- **Audience Targeting**: All resources target both `user` and `assistant` for comprehensive access
- **Type Safety**: Custom `ResourceAnnotations` type ensures consistent annotation structure
- **Client Optimization**: Annotations help clients prioritize resources in context-limited scenarios

**Resource Priority Levels:**

- **Priority 1.0** (Critical): Programs - Top-level organizational units
- **Priority 0.9** (Very High): Contracts - Core business agreements
- **Priority 0.8** (High): Tasks - Operational work items
- **Priority 0.7** (Medium-High): Employees - Human resource information
- **Priority 0.5** (Medium): Tags - Categorization and filtering metadata

**List Resources (5 total):**

- `employees` - All employees currently in the database (`contract-manager://employees`)
- `programs` - All programs currently in the database (`contract-manager://programs`)
- `contracts` - All contracts currently in the database (`contract-manager://contracts`)
- `tasks` - All tasks currently in the database (`contract-manager://tasks`)
- `tags` - All tags currently in the database (`contract-manager://tags`)

**Template Resources (5 total):**

- `employee` - Individual employee by code (`contract-manager://employees/{code}`, e.g., `contract-manager://employees/E001`)
- `program` - Individual program by code (`contract-manager://programs/{code}`, e.g., `contract-manager://programs/P001`)
- `contract` - Individual contract by code (`contract-manager://contracts/{code}`, e.g., `contract-manager://contracts/C001`)
- `task` - Individual task by code (`contract-manager://tasks/{code}`, e.g., `contract-manager://tasks/T001`)
- `tag` - Individual tag by code (`contract-manager://tags/{code}`, e.g., `contract-manager://tags/TAG001`)

**Resource Features:**

- **Intelligent Completion**: All template resources provide code completion for friendly codes
- **Resource Discovery**: List resources enable bulk access to entity data
- **Clean Architecture**: Template resources use `list: undefined` to prevent resource bloat
- **Consistent URI Patterns**: Standardized `contract-manager://` scheme across all resources
- **Type Safety**: Full TypeScript integration with existing service layer

### MCP Prompts

The server provides intelligent MCP Prompts for AI-powered contract management workflows:

**Available Prompts (5 total):**

- `contract_analysis` - Comprehensive contract analysis with tasks, team, and risk assessment
- `task_planning` - AI-powered task suggestions, breakdown, and planning recommendations
- `team_assignment` - Intelligent employee assignment suggestions based on skills and context
- `progress_review` - Automated progress reports for contracts (by code) or programs (by code)
- `suggest_tags` - Smart tag recommendations for tasks with existing tag context

**Prompt Features:**

- **Intelligent Completion**: All prompts support code completion for entity references (contracts, tasks, etc.)
- **Rich Context**: Prompts embed relevant data as resources for comprehensive AI analysis
- **Structured Instructions**: Clear, detailed instructions for specific business workflows
- **Tool Integration**: Prompts suggest using existing MCP tools for implementing recommendations
- **Executive Insights**: Progress reviews provide stakeholder-ready analysis and metrics

### Future Services

- **Auth Server** - OAuth2 authentication endpoints _(to do)_
- **Web UI** - Frontend application with MCP integration _(to do)_

**For detailed database schema, API documentation, and MCP capabilities, see the [mcp-server README](./mcp-server/README.md).**

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
