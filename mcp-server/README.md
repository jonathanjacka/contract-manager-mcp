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

### Database Implementation (v1.2.0)

- ✅ **SQLite Database**: Lightweight, file-based database perfect for development
- ✅ **Knex.js Integration**: TypeScript-first query builder with migrations and seeding
- ✅ **Complete Schema**: Programs, Contracts, Tasks, Employees, Tags with proper relationships
- ✅ **UUID Primary Keys**: All entities use UUIDs for unique identification
- ✅ **Foreign Key Constraints**: Proper referential integrity with cascade deletes
- ✅ **Audit Timestamps**: created_at and updated_at on all entities
- ✅ **Rich Seed Data**: Realistic employee and project data for testing
- ✅ **Service Layer**: Type-safe CRUD operations and relationship queries
- ✅ **Auto-initialization**: Database setup and seeding on every server startup

### MCP Tools Implementation (v1.3.0)

- ✅ **Friendly Code System**: Human-readable codes (E001, P001, C001, T001, TAG001) for all entities
- ✅ **Database Triggers**: Auto-generation of friendly codes with sequence counters
- ✅ **List Tools**: Complete set of list tools for all entities with resource links
- ✅ **Individual Get Tools**: Get specific entities by their friendly codes
- ✅ **Resource Links**: Interactive resource links for easy navigation between entities
- ✅ **Embedded Resources**: Full JSON data embedding for detailed entity information
- ✅ **Zod Schema Validation**: Type-safe input validation for all MCP tool parameters
- ✅ **Error Handling**: Proper error assertions with meaningful messages
- ✅ **Clean Architecture**: Separated tools, schemas, middleware, and routes

### Comprehensive CRUD Operations (v1.4.0)

- ✅ **Task Management**: Full CRUD operations for tasks (create, update, delete, list by contract)
- ✅ **Employee Management**: Complete employee lifecycle (add, edit, delete, assign to tasks, remove from tasks)
- ✅ **Tag System**: Full tag management (create, edit, delete, apply to tasks, remove from tasks)
- ✅ **Unique Validation**: Tag names must be unique across the system
- ✅ **Relationship Management**: Proper handling of many-to-many relationships (employees-tasks, tags-tasks)
- ✅ **Modular Architecture**: Organized tools by entity type in separate files for maintainability
- ✅ **Service Layer Refactoring**: Dedicated service files for each entity with comprehensive operations
- ✅ **Code-Based Operations**: All CRUD operations use friendly codes instead of UUIDs
- ✅ **Cleanup Operations**: Delete operations properly handle relationship cleanup

### MCP Resources Implementation (v1.5.0)

- ✅ **MCP Resources Capability**: Full implementation of MCP Resources specification
- ✅ **List Resources**: 5 list resources providing bulk access to all entity types
- ✅ **Template Resources**: 5 parameterized template resources for individual entity access
- ✅ **Intelligent Completion**: Code completion for all entity friendly codes
- ✅ **Resource Discovery**: Complete resource discovery with clean architecture
- ✅ **URI Standardization**: Consistent `contract-manager://` scheme for all resources
- ✅ **Modular Resource Files**: Organized resources by entity type with dedicated files
- ✅ **Error Handling**: Consistent error handling using project's assert utility
- ✅ **Resource Template Configuration**: Proper `list: undefined` to prevent resource bloat

### MCP Prompts Implementation (v1.6.0)

- ✅ **MCP Prompts Capability**: Full implementation of MCP Prompts specification
- ✅ **Contract Analysis Prompt**: Comprehensive analysis with tasks, team, risk assessment, and recommendations
- ✅ **Task Planning Prompt**: AI-powered task suggestions, breakdown, dependencies, and resource planning
- ✅ **Team Assignment Prompt**: Intelligent employee assignment based on skills, workload, and team composition
- ✅ **Progress Review Prompt**: Automated reports for contracts and programs with executive-level insights
- ✅ **Tag Suggestions Prompt**: Smart tag recommendations with existing tag context and creation workflow
- ✅ **Intelligent Completion**: All prompts support code completion for entity references
- ✅ **Rich Context Embedding**: Prompts include comprehensive data as embedded resources
- ✅ **Structured Instructions**: Clear, detailed business workflow guidance for AI analysis
- ✅ **Modular Prompt Files**: Organized prompts by functionality with dedicated files

### MCP Annotations Implementation (v1.7.0)

- ✅ **Tool Annotations**: Complete MCP ToolAnnotations implementation for all 21 tools with semantic behavior hints
- ✅ **Resource Annotations**: MCP Annotations implementation for all 10 resources with priority and audience targeting
- ✅ **Type-Safe Annotations**: Custom TypeScript types (`ToolAnnotations`, `ResourceAnnotations`) enforcing proper combinations
- ✅ **Read-Only Operations**: Proper `readOnlyHint: true` for all list/get operations (13 tools) with `openWorldHint: false`
- ✅ **Safe Operations**: `destructiveHint: false` for create/update operations indicating additive-only changes
- ✅ **Idempotent Operations**: `idempotentHint: true` for update and assignment operations that can be safely repeated
- ✅ **Delete Operations**: Proper destructive operation handling with default `destructiveHint: true` for delete tools (3 tools)
- ✅ **Closed-World System**: `openWorldHint: false` across all tools indicating self-contained contract management domain
- ✅ **Resource Priority Hierarchy**: Business-logic driven priorities (Programs: 1.0, Contracts: 0.9, Tasks: 0.8, Employees: 0.7, Tags: 0.5)
- ✅ **Audience Targeting**: All resources target both `user` and `assistant` audiences for comprehensive access
- ✅ **Client Optimization**: Annotations enable smart context window management, tool selection, and safety warnings by MCP clients
- ✅ **Modular Architecture**: Annotations organized in centralized types file with consistent imports across all tool/resource files

## Project Structure

```
mcp-server/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main MCP server with HTTP transport
│   ├── constants.ts       # Centralized server configuration
│   ├── tools/             # Modular MCP tools organized by entity
│   │   ├── index.ts           # Main tools orchestrator
│   │   ├── employeeTools.ts   # Employee CRUD operations
│   │   ├── taskTools.ts       # Task CRUD operations
│   │   ├── tagTools.ts        # Tag CRUD operations
│   │   ├── programTools.ts    # Program list/get operations
│   │   ├── contractTools.ts   # Contract list/get operations
│   │   └── utils.ts           # Shared utility functions
│   ├── services/          # Modular business logic and data access
│   │   ├── index.ts           # Service exports
│   │   ├── employeeService.ts # Employee data operations
│   │   ├── taskService.ts     # Task data operations
│   │   ├── tagService.ts      # Tag data operations
│   │   ├── programService.ts  # Program data operations
│   │   ├── contractService.ts # Contract data operations
│   │   └── database.ts        # Legacy service exports
│   ├── resources/         # MCP Resources for data access
│   │   ├── index.ts           # Resource registration orchestrator
│   │   ├── employeeResources.ts # Employee list/template resources
│   │   ├── taskResources.ts     # Task list/template resources
│   │   ├── tagResources.ts      # Tag list/template resources
│   │   ├── programResources.ts  # Program list/template resources
│   │   └── contractResources.ts # Contract list/template resources
│   ├── prompts/           # MCP Prompts for AI interactions
│   │   ├── index.ts            # Prompt registration orchestrator
│   │   ├── contractAnalysis.ts # Contract analysis prompt
│   │   ├── taskPlanning.ts     # Task planning prompt
│   │   ├── teamAssignment.ts   # Team assignment prompt
│   │   ├── progressReview.ts   # Progress review prompt
│   │   └── tagSuggestions.ts   # Tag suggestions prompt
│   ├── types/             # TypeScript type definitions
│   │   ├── database.ts    # Database entity interfaces
│   │   └── annotations.ts # MCP annotation type definitions
│   ├── database/          # Database configuration and management
│   │   ├── connection.ts  # Knex configuration and connection
│   │   ├── migrations/    # Database schema migrations
│   │   │   └── 001_create_initial_tables.ts
│   │   └── seeds/         # Database seed data
│   │       └── 001_initial_data.ts
│   ├── schemas/           # Input validation schemas
│   │   └── schema.ts      # Zod schemas for MCP tools
│   ├── middleware/        # Express middleware
│   ├── routes/            # Express route handlers
│   └── utils/             # Logging and utility functions
│       ├── logger.ts      # Colored logging with chalk
│       └── assert.ts      # Error assertion utility
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

## MCP Annotations

The server implements comprehensive MCP annotations for both tools and resources, providing semantic information to help MCP clients make intelligent decisions about tool usage, resource prioritization, and context management.

### Tool Annotations

All 21 tools include semantic behavior annotations following the MCP ToolAnnotations specification:

#### Annotation Types

**Read-Only Operations** (13 tools):

```typescript
annotations: {
  readOnlyHint: true,
  openWorldHint: false,
} satisfies ToolAnnotations
```

- All `list_*` and `get_*` tools
- `get_tasks_by_contract`, `get_employee_by_task`
- No environment modifications, safe for repeated execution

**Create Operations** (3 tools):

```typescript
annotations: {
  destructiveHint: false,
  openWorldHint: false,
} satisfies ToolAnnotations
```

- `create_task`, `add_employee`, `create_tag`
- Additive operations that don't modify existing data

**Update/Assignment Operations** (5 tools):

```typescript
annotations: {
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} satisfies ToolAnnotations
```

- `update_task`, `edit_employee`, `edit_tag`
- `add_employee_to_task`, `add_tag_to_task`, `remove_employee_from_task`, `remove_tag_from_task`
- Safe operations that can be repeated without additional side effects

**Delete Operations** (3 tools):

```typescript
annotations: {
  openWorldHint: false,
} satisfies ToolAnnotations
```

- `delete_task`, `delete_employee`, `delete_tag`
- Uses default `destructiveHint: true` to warn about destructive nature

#### Type Safety

The `ToolAnnotations` type enforces proper annotation combinations:

```typescript
export type ToolAnnotations = {
  openWorldHint?: false; // Closed-world system
} & (
  | {
      readOnlyHint: true; // Read-only: no other annotations allowed
    }
  | {
      destructiveHint?: false; // Only allow explicit false
      idempotentHint?: true; // Only allow explicit true
    }
);
```

### Resource Annotations

All 10 resources include priority and audience annotations:

#### Priority Hierarchy

Resources are prioritized based on business importance:

- **Priority 1.0** (Critical): Programs - Top-level organizational units
- **Priority 0.9** (Very High): Contracts - Core business agreements
- **Priority 0.8** (High): Tasks - Operational work items
- **Priority 0.7** (Medium-High): Employees - Human resource information
- **Priority 0.5** (Medium): Tags - Categorization metadata

#### Audience Targeting

All resources target both audiences:

```typescript
annotations: {
  audience: ['user', 'assistant'],
  priority: 0.9, // Example priority
} satisfies ResourceAnnotations
```

#### Type Safety

The `ResourceAnnotations` type ensures consistent structure:

```typescript
export type ResourceAnnotations = {
  audience?: ('user' | 'assistant')[];
  priority?: number; // 0 (least important) to 1 (most important)
  lastModified?: string; // ISO 8601 format
};
```

### Client Benefits

Annotations enable MCP clients to:

1. **Smart Tool Selection**: Understand tool behavior before execution
2. **Safety Warnings**: Alert users about destructive operations
3. **Context Optimization**: Prioritize resources in limited context windows
4. **Idempotent Operations**: Safely retry update operations
5. **Audience Filtering**: Show relevant resources to appropriate users
6. **Performance Optimization**: Cache read-only operations

### Implementation Pattern

All tools and resources follow consistent annotation patterns:

```typescript
// Tool example
agent.server.registerTool(
  'tool_name',
  {
    title: 'Tool Title',
    description: 'Tool description',
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
    } satisfies ToolAnnotations,
    inputSchema: schema,
  },
  handler
);

// Resource example
agent.server.registerResource(
  'resource_name',
  'uri',
  {
    title: 'Resource Title',
    description: 'Resource description',
    annotations: {
      audience: ['user', 'assistant'],
      priority: 0.8,
    } satisfies ResourceAnnotations,
  },
  handler
);
```

## Database Schema

The server uses a SQLite database with a comprehensive contract management schema:

### Core Entities

- **Programs**: Top-level organizational units with assigned managers
- **Contracts**: Specific agreements tied to programs
- **Tasks**: Individual work items within contracts with completion tracking (0-10 scale)
- **Employees**: Team members with roles and contact information
- **Tags**: Flexible categorization system for tasks

### Relationships

- Programs have exactly one manager (Employee) and can contain multiple Contracts
- Contracts belong to one Program and can contain multiple Tasks
- Tasks belong to one Contract and can be assigned to multiple Employees
- Tasks can have multiple Tags for categorization
- All entities include audit timestamps (created_at, updated_at)

### Database Features

- **Auto-initialization**: Database is created and seeded on every server startup
- **Friendly Codes**: Human-readable codes (E001, P001, C001, etc.) for easy identification
- **UUID Primary Keys**: All entities use UUIDs for unique identification
- **Foreign Key Constraints**: Proper referential integrity with cascade deletes
- **Database Triggers**: Auto-generation of friendly codes for new records
- **Type Safety**: Full TypeScript interfaces for all entities and operations
- **Service Layer**: Clean CRUD operations via `services/database.ts`

### Sample Data

The database includes realistic sample data with:

- **5 employees** with friendly codes E001-E005 (Leia, Luke, Padmé, Han, Rey)
- **2 programs** with codes P001-P002 representing different business initiatives
- **3 contracts** with codes C001-C003 under active management
- **7 tasks** with codes T001-T007 and varying completion levels
- **8 tags** with codes TAG001-TAG008 for task categorization

All entities use friendly codes for easy reference in MCP tools.

## API Endpoints

### Health & Info

- `GET /health` - Health check endpoint with server status
- `GET /mcp` - MCP server information (browser-friendly JSON response)

### MCP Protocol

- `POST /mcp` - MCP JSON-RPC endpoint for Model Context Protocol requests

### Capabilities

Current MCP server capabilities:

**List Tools (5):**

- `list_employees` - List all employees with their roles and departments
- `list_programs` - List all programs with descriptions
- `list_contracts` - List all contracts with status information
- `list_tasks` - List all tasks with completion levels
- `list_tags` - List all tags for categorization

**Individual Get Tools (5):**

- `get_employee` - Get specific employee by code (e.g., E001)
- `get_program` - Get specific program by code (e.g., P001)
- `get_contract` - Get specific contract by code (e.g., C001)
- `get_task` - Get specific task by code (e.g., T001)
- `get_tag` - Get specific tag by code (e.g., TAG001)

**Task Management Tools (4):**

- `create_task` - Create new tasks with completion tracking (0-10 scale)
- `update_task` - Update task details and completion status
- `delete_task` - Remove tasks (automatically cleans up relationships)
- `get_tasks_by_contract` - List all tasks for a specific contract

**Employee Management Tools (6):**

- `add_employee` - Create new employees with roles and contact information
- `edit_employee` - Update employee information (name, job title, email)
- `delete_employee` - Remove employees (automatically cleans up task assignments)
- `add_employee_to_task` - Assign employees to tasks
- `remove_employee_from_task` - Remove employee assignments from tasks
- `get_employee_by_task` - List all employees assigned to a specific task

**Tag Management Tools (5):**

- `create_tag` - Create new tags with unique names
- `edit_tag` - Update tag information (names must remain unique)
- `delete_tag` - Remove tags (automatically cleans up task relationships)
- `add_tag_to_task` - Apply tags to tasks for categorization
- `remove_tag_from_task` - Remove tag assignments from tasks

**Total: 25 MCP Tools**

**MCP Resources (10 total):**

**List Resources (5):**

- `employees` - All employees in the database (`contract-manager://employees`)
- `programs` - All programs in the database (`contract-manager://programs`)
- `contracts` - All contracts in the database (`contract-manager://contracts`)
- `tasks` - All tasks in the database (`contract-manager://tasks`)
- `tags` - All tags in the database (`contract-manager://tags`)

**Template Resources (5):**

- `employee` - Individual employee by code (`contract-manager://employees/{code}`)
- `program` - Individual program by code (`contract-manager://programs/{code}`)
- `contract` - Individual contract by code (`contract-manager://contracts/{code}`)
- `task` - Individual task by code (`contract-manager://tasks/{code}`)
- `tag` - Individual tag by code (`contract-manager://tags/{code}`)

**Resource Features:**

- **Intelligent Completion**: Template resources provide code completion for friendly codes (E001, P001, C001, T001, TAG001)
- **Bulk Access**: List resources enable efficient access to all entities of a type
- **Parameterized URIs**: Template resources support dynamic code parameters with validation
- **Resource Discovery**: Clean resource architecture with `list: undefined` to prevent bloat
- **Consistent Patterns**: Standardized `contract-manager://` URI scheme across all resources
- **Type Safety**: Full TypeScript integration with service layer and error handling

**MCP Prompts (5 total):**

- `contract_analysis` - Comprehensive contract analysis with tasks, team, and risk assessment
- `task_planning` - AI-powered task suggestions, breakdown, dependencies, and resource planning
- `team_assignment` - Intelligent employee assignment based on skills and team composition
- `progress_review` - Automated progress reports for contracts (type: contract) or programs (type: program)
- `suggest_tags` - Smart tag recommendations for tasks with existing tag context

**Prompt Features:**

- **Intelligent Completion**: All prompts support code completion for entity references
- **Rich Context**: Prompts embed comprehensive data as resources for AI analysis
- **Structured Instructions**: Clear business workflow guidance with specific deliverables
- **Tool Integration**: Prompts suggest using existing MCP tools to implement recommendations
- **Executive Insights**: Progress reviews provide stakeholder-ready metrics and analysis

**Tool Features:**

**Resource Features:**

- **Intelligent Completion**: Template resources provide code completion for friendly codes (E001, P001, C001, T001, TAG001)
- **Bulk Access**: List resources enable efficient access to all entities of a type
- **Parameterized URIs**: Template resources support dynamic code parameters with validation
- **Resource Discovery**: Clean resource architecture with `list: undefined` to prevent bloat
- **Consistent Patterns**: Standardized `contract-manager://` URI scheme across all resources
- **Type Safety**: Full TypeScript integration with service layer and error handling

**Features:**

- Human-readable friendly codes for all entities
- Interactive resource links for navigation
- Full JSON embedding for detailed information
- Type-safe input validation with Zod schemas
- Comprehensive error handling
- Modular architecture organized by entity type
- Complete CRUD operations for tasks, employees, and tags
- Relationship management with automatic cleanup
- Unique constraint validation (e.g., tag names)

## MCP Tool Examples

### List Tool Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "list_employees"
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 5 employees."
      },
      {
        "type": "resource_link",
        "uri": "contract-manager://employees/E001",
        "name": "E001: Leia Organa",
        "description": "Employee: \"Leia Organa\" - Senior Project Manager",
        "mimeType": "application/json"
      },
      {
        "type": "resource_link",
        "uri": "contract-manager://employees/E002",
        "name": "E002: Luke Skywalker",
        "description": "Employee: \"Luke Skywalker\" - Lead Developer",
        "mimeType": "application/json"
      }
    ]
  }
}
```

### Get Tool Example

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_employee",
    "arguments": {
      "code": "E001"
    }
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "resource",
        "resource": {
          "uri": "contract-manager://employees/E001",
          "mimeType": "application/json",
          "text": "{\"id\":\"550e8400-e29b-41d4-a716-446655440001\",\"code\":\"E001\",\"name\":\"Leia Organa\",\"job_title\":\"Senior Project Manager\",\"email\":\"leia.organa@rebellion.com\",\"created_at\":\"2025-01-20T...\",\"updated_at\":\"2025-01-20T...\"}"
        }
      }
    ]
  }
}
```

## MCP Resource Examples

### List Resource Example

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "contract-manager://employees"
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "contents": [
      {
        "mimeType": "application/json",
        "text": "[{\"id\":\"550e8400-e29b-41d4-a716-446655440001\",\"code\":\"E001\",\"name\":\"Leia Organa\",\"job_title\":\"Senior Project Manager\",\"email\":\"leia.organa@rebellion.com\"},{\"id\":\"550e8400-e29b-41d4-a716-446655440002\",\"code\":\"E002\",\"name\":\"Luke Skywalker\",\"job_title\":\"Lead Developer\",\"email\":\"luke.skywalker@rebellion.com\"}]",
        "uri": "contract-manager://employees"
      }
    ]
  }
}
```

### Template Resource Example

**Request (with completion):**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "resource",
      "uri": "contract-manager://employees/E0"
    },
    "argument": {
      "name": "code",
      "value": "E0"
    }
  }
}
```

**Completion Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "completion": {
      "values": ["E001", "E002", "E003", "E004", "E005"]
    }
  }
}
```

**Resource Read Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/read",
  "params": {
    "uri": "contract-manager://employees/E001"
  }
}
```

**Resource Read Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "contents": [
      {
        "mimeType": "application/json",
        "text": "{\"id\":\"550e8400-e29b-41d4-a716-446655440001\",\"code\":\"E001\",\"name\":\"Leia Organa\",\"job_title\":\"Senior Project Manager\",\"email\":\"leia.organa@rebellion.com\",\"created_at\":\"2025-01-20T...\",\"updated_at\":\"2025-01-20T...\"}",
        "uri": "contract-manager://employees/E001"
      }
    ]
  }
}
```

## MCP Prompt Examples

### Contract Analysis Prompt

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/get",
  "params": {
    "name": "contract_analysis",
    "arguments": {
      "contractCode": "C001"
    }
  }
}
```

**Response:** Returns a structured prompt with contract data, tasks, employees, and instructions for comprehensive analysis including risk assessment, team performance, and actionable recommendations.

### Task Planning Prompt

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "task_planning",
    "arguments": {
      "contractCode": "C001"
    }
  }
}
```

**Response:** Returns a structured prompt with contract context, existing tasks, and team data, with instructions for AI to suggest missing tasks, dependencies, and resource planning.

### Progress Review Prompt

**Request (Contract Review):**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "prompts/get",
  "params": {
    "name": "progress_review",
    "arguments": {
      "type": "contract",
      "code": "C001"
    }
  }
}
```

**Request (Program Review):**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "prompts/get",
  "params": {
    "name": "progress_review",
    "arguments": {
      "type": "program",
      "code": "P001"
    }
  }
}
```

**Response:** Returns executive-level progress analysis with financial status, timeline analysis, risk assessment, and strategic recommendations.

### Tag Suggestions Prompt

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "prompts/get",
  "params": {
    "name": "suggest_tags",
    "arguments": {
      "taskCode": "T001"
    }
  }
}
```

**Response:** Returns task context with available tags and instructions for AI to suggest relevant categorization tags, with guidance to use MCP tools for tag creation and assignment.

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
