# Playwright API Testing Framework

A comprehensive Playwright-based API testing framework designed for testing REST APIs with robust features including custom matchers, JSON schema validation, and authentication handling.

## 🎯 Project Overview

This framework provides a structured approach to API test automation with:
- **Fluent API for request building** - Chainable methods for constructing HTTP requests
- **Automatic schema validation** - JSON schema-based response validation with auto-generation
- **Custom expect matchers** - TypeScript-based assertions with enhanced logging
- **Authentication handling** - Automatic token management and authentication
- **Response logging** - Detailed request/response logging for debugging
- **Schema generation** - Automatic JSON schema creation from API responses

## 🏗️ Project Structure

```
├── .github/
│   ├── copilot-instructions.md              # Framework guidelines and patterns
│   ├── instructions/
│   │   └── schema-validation.instructions.md # Schema validation rules
│   └── prompts/
│       ├── add-schemas.prompt.md            # Prompt for adding schema validation
│       └── update-schemas.prompt.md         # Prompt for fixing schema failures
├── config/                                  # Configuration files
├── helpers/
│   └── createToken.ts                       # Authentication token creation
├── request-objects/                         # Reusable request payloads
│   └── [endpoint]/
│       ├── GET-[resource].json
│       ├── POST-[resource].json
│       └── PUT-[resource].json
├── response-schemas/                        # JSON schemas for validation
│   └── [endpoint]/
│       ├── GET_[resource]_schema.json
│       ├── POST_[resource]_schema.json
│       └── PUT_[resource]_schema.json
├── tests/                                   # Test suite
│   ├── conduit/                             # Framework tests
│   └── *.spec.ts                            # Practice tests
├── utils/                                   # Core utilities
│   ├── RequestHandler.ts                    # Fluent API request builder
│   ├── custom-expect.ts                     # Custom Playwright matchers
│   ├── fixtures.ts                          # Test fixtures and setup
│   ├── schema-validator.ts                  # JSON schema validation logic
│   ├── data-generator.ts                    # Test data generation
│   └── logger.ts                            # Request/response logging
├── playwright.config.ts                     # Playwright configuration
└── tsconfig.json                            # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (if not installed)
npx playwright install
```

## 📋 Dependencies

```json
{
  "@faker-js/faker": "^10.4.0",          // Generate fake test data
  "@playwright/test": "^1.59.1",         // Testing framework
  "@types/node": "^25.6.0",              // TypeScript Node types
  "ajv": "^8.20.0",                      // JSON schema validation
  "ajv-formats": "^3.0.1",               // Extended AJV formats
  "dotenv": "^17.4.2",                   // Environment variable management
  "genson-js": "^0.0.8"                  // Automatic schema generation
}
```

## 🧪 Test Execution

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run tests and display HTML report
npx playwright test --reporter=html
npx playwright test show-report

# Run specific test file
npx playwright test practice.spec.ts

# Run tests matching a pattern
npx playwright test -g 'Get Tags'

# Run failed tests only
npx playwright test --last-failed

# Run with different environment (default: INT)
API_ENV=QA npx playwright test practice.spec.ts

# Run specific project (configured in playwright.config.ts)
npx playwright test --project framework
npx playwright test --project practice
```

### Advanced Options

```bash
# Run tests with debugging
npx playwright test --debug

# Run tests with trace (for debugging failures)
npx playwright test --trace on

# Run tests with UI mode (interactive)
npx playwright test --ui

# Run single test in a file
npx playwright test practice.spec.ts:5

# Generate new test
npx playwright codegen
```

## 🔧 Core Concepts & Patterns

### 1. Request Handler Pattern

The `RequestHandler` class provides a fluent, chainable API for building HTTP requests:

```typescript
// Basic request structure
const response = await api
    .path('/endpoint')
    .body({ data: 'value' })
    .headers({ 'Custom-Header': 'value' })
    .params({ limit: 10 })
    .postRequest(201)
```

**Available Methods:**
- `.path(string)` - Set API endpoint path
- `.body(object)` - Set request body
- `.headers(object)` - Set custom headers
- `.params(object)` - Set query parameters
- `.url(string)` - Override default base URL
- `.clearAuth()` - Remove authentication headers
- `.getRequest(expectedStatus)` - Execute GET request
- `.postRequest(expectedStatus)` - Execute POST request
- `.putRequest(expectedStatus)` - Execute PUT request
- `.deleteRequest(expectedStatus)` - Execute DELETE request

### 2. Custom Expect Matchers

Custom matchers extend Playwright's expect with domain-specific assertions:

```typescript
import { expect } from '../utils/custom-expect';

// Schema validation
await expect(response).shouldMatchSchema('articles', 'GET_articles')

// Value assertions
expect(response.title).shouldEqual('Expected Title')
expect(response.count).shouldBeLessThanOrEqual(100)
```

### 3. Test Fixtures

All tests use fixtures that provide:
- `api` - RequestHandler instance for API calls
- `page` - Playwright page object (if needed)
- Automatic authentication setup

```typescript
import { test } from '../utils/fixtures';

test('Test Description', async ({ api }) => {
    // api fixture is automatically injected
    // with authentication pre-configured
});
```

### 4. Authentication Pattern

- Authentication tokens are automatically created at the worker scope
- Tokens are automatically included in all requests
- Use `.clearAuth()` to remove authentication for specific requests:

```typescript
const response = await api
    .path('/public-endpoint')
    .clearAuth()
    .getRequest(200)
```

### 5. Schema Validation Pattern

#### Overview
- JSON schemas validate API response structure and data types
- Schemas can be auto-generated from responses
- Store schemas in `response-schemas/[endpoint]/` folder

#### Using `shouldMatchSchema()`

```typescript
await expect(response).shouldMatchSchema(folderName, fileName, createSchemaFlag)
```

**Parameters:**

| Parameter | Type | Required | Description | Examples |
|-----------|------|----------|-------------|----------|
| `folderName` | string | Yes | API endpoint name (from path) | `'articles'`, `'tags'`, `'users'` |
| `fileName` | string | Yes | Schema file name format: `[METHOD]_[endpoint]` | `'GET_articles'`, `'POST_users'`, `'PUT_articles'` |
| `createSchemaFlag` | boolean | No | Set `true` to auto-generate/update schema | Default: `false` |

**Schema Naming Convention:**
- Endpoint: `/articles` → Folder: `articles`, File: `GET_articles`, `POST_articles`
- Endpoint: `/articles/{id}/comments` → Folder: `articles`, File: `GET_articles_comments`
- HTTP Method: Use uppercase (GET, POST, PUT)

**Schema Validation Examples:**

```typescript
// GET request - auto-generate schema
const articles = await api
    .path('/articles')
    .getRequest(200)
await expect(articles).shouldMatchSchema('articles', 'GET_articles', true)

// POST request with payload
const created = await api
    .path('/articles')
    .body({ article: { title: 'New Article' } })
    .postRequest(201)
await expect(created).shouldMatchSchema('articles', 'POST_articles', true)

// PUT request
const updated = await api
    .path('/articles/123')
    .body({ article: { title: 'Updated' } })
    .putRequest(200)
await expect(updated).shouldMatchSchema('articles', 'PUT_articles', true)

// DELETE request - NO schema validation
await api
    .path('/articles/123')
    .deleteRequest(204)
// Note: DELETE requests don't return bodies, so skip schema validation
```

## 📝 Writing Tests

### Test Structure

Follow this structure when creating new tests:

```typescript
import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';

test('Descriptive test name', async ({ api }) => {
    // 1. Call API endpoint
    const response = await api
        .path('/endpoint')
        .getRequest(200)
    
    // 2. Validate schema immediately after API call
    await expect(response).shouldMatchSchema('folderName', 'METHOD_endpoint')
    
    // 3. Assert specific values
    expect(response.property).shouldEqual('expectedValue')
});
```

### Best Practices

#### When Creating Tests
- Import test fixture and custom expect utilities
- Use the `api` fixture for all API requests
- Validate every response with schema matching
- Use custom matchers for assertions
- Single test can contain multiple API request sequences
- Use camelCase for variable names (e.g., `articleResponse`, `userId`)
- Assign API responses to constants for reuse
- **Do NOT assign response for `deleteRequest()`** (returns no body)

#### When Creating POST/PUT Requests
- Save request objects in `request-objects/` folder
- Use naming pattern: `[METHOD]-[endpoint].json`
  - Examples: `POST-article.json`, `PUT-user.json`
- Import request objects into tests:
  ```typescript
  import articlePayload from '../request-objects/POST-article.json'
  ```
- Create a clone for each test using `structuredClone()`:
  ```typescript
  const articleRequest = structuredClone(articlePayload)
  ```
- Pass the cloned object to `.body()`:
  ```typescript
  .body(articleRequest)
  ```

#### Schema Validation Rules
- **REQUIRED** for: GET, POST, PUT requests (must validate response)
- **EXCLUDE** for: DELETE requests (no response body)
- **METHOD**: Add schema validation immediately after the API call
- **PLACEMENT**: Before any other response assertions

### Example Test Template

```typescript
import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';
import createPayload from '../request-objects/POST-article.json'

test('Complete workflow - Create, Read, Update, Delete', async ({ api }) => {
    // CREATE - POST request
    const createRequest = structuredClone(createPayload)
    createRequest.title = 'Test Article'
    
    const createResponse = await api
        .path('/articles')
        .body(createRequest)
        .postRequest(201)
    await expect(createResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createResponse.title).shouldEqual('Test Article')
    
    const articleId = createResponse.id
    
    // READ - GET request
    const getResponse = await api
        .path(`/articles/${articleId}`)
        .getRequest(200)
    await expect(getResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(getResponse.id).shouldEqual(articleId)
    
    // UPDATE - PUT request
    const updateRequest = structuredClone(createPayload)
    updateRequest.title = 'Updated Title'
    
    const updateResponse = await api
        .path(`/articles/${articleId}`)
        .body(updateRequest)
        .putRequest(200)
    await expect(updateResponse).shouldMatchSchema('articles', 'PUT_articles')
    expect(updateResponse.title).shouldEqual('Updated Title')
    
    // DELETE
    await api
        .path(`/articles/${articleId}`)
        .deleteRequest(204)
});
```

## 🛠️ Utilities

### RequestHandler (RequestHandler.ts)
Provides the fluent API for building and executing HTTP requests with automatic authentication and logging.

### Custom Expect Matchers (custom-expect.ts)
Extends Playwright's expect with:
- `shouldMatchSchema()` - Validate response against JSON schema
- `shouldEqual()` - Compare values with logging
- `shouldBeLessThanOrEqual()` - Compare numeric values
- And other domain-specific matchers

### Fixtures (fixtures.ts)
Provides test fixtures:
- `api` - RequestHandler instance
- Automatic authentication setup
- Worker-scoped token creation

### Schema Validator (schema-validator.ts)
Handles:
- JSON schema validation using AJV
- Automatic schema generation using Genson-JS
- Schema storage and retrieval

### Data Generator (data-generator.ts)
Uses Faker.js for generating test data:
- Random user data
- Fake emails and names
- Test-specific data generation

### Logger (logger.ts)
Logs API requests and responses for debugging:
- Request method, URL, headers
- Request body
- Response status, headers, body

### Token Creation (helpers/createToken.ts)
Handles authentication:
- Token generation
- Token refresh logic
- Token injection into request headers

## 🔐 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
API_URL=https://api.example.com
API_ENV=INT
AUTH_TOKEN_ENDPOINT=/auth/login
API_USERNAME=test_user
API_PASSWORD=test_password
```

Use environment variables in tests:

```typescript
const baseUrl = process.env.API_URL
const environment = process.env.API_ENV || 'INT'
```

### Playwright Configuration (playwright.config.ts)

Configure test behavior:
- Test directory: `./tests`
- Workers: 1 (serial execution)
- Retries: 2 (in CI), 0 (locally)
- Reporters: HTML and list
- Projects:
  - `framework` - Main framework tests (in `tests/conduit`)
  - `practice` - Practice tests

## 📊 Test Reports

### HTML Report
After running tests, view the HTML report:

```bash
npx playwright test --reporter=html
npx playwright show-report
```

The report shows:
- Test results (passed/failed/skipped)
- Execution time
- Traces for failed tests (if enabled)
- Screenshots and videos (if captured)

### Debugging Failed Tests
Enable tracing to debug failures:

```typescript
// In playwright.config.ts
use: {
    trace: 'retain-on-failure',  // Keep trace on failure
    screenshot: 'only-on-failure', // Capture screenshots
    video: 'retain-on-failure'    // Retain videos
}
```

## 📚 Copilot Integration

### Custom Instructions (.github/copilot-instructions.md)
Provides AI-assisted development guidelines including:
- Test patterns and conventions
- Request object structure
- Schema validation approach
- Response logging practices

### Custom Prompts (.github/prompts/)
Pre-configured prompts for common tasks:
- **add-schemas.prompt.md** - Add schema validation to tests
- **update-schemas.prompt.md** - Fix schema validation failures

Use these prompts with GitHub Copilot for:
- Batch adding schema validation
- Automatically updating failed schemas
- Following project conventions

### Custom Instructions (.github/instructions/)
Detailed instructions for specific aspects:
- **schema-validation.instructions.md** - Comprehensive schema validation guide

## 🔍 Schema Validation Workflow

### 1. Create Schema During Development

When building a new test, set `true` as the third argument:

```typescript
const response = await api
    .path('/articles')
    .getRequest(200)
await expect(response).shouldMatchSchema('articles', 'GET_articles', true)
```

This will auto-generate `response-schemas/articles/GET_articles_schema.json`

### 2. Remove Schema Generation Flag

After schema is created, remove the `true` flag:

```typescript
await expect(response).shouldMatchSchema('articles', 'GET_articles')
```

### 3. Fix Failed Validations

If schema validation fails during test runs:
1. Run tests and identify failures
2. Add `true` flag to failed schema validation
3. Re-run to regenerate schema
4. Verify tests pass
5. Remove the `true` flag
6. Run again to confirm

```bash
# Run tests
npx playwright test

# If schema validation fails, update the test
# Add true to the failed shouldMatchSchema() call
# Then run again
npx playwright test
```

## 🚀 CI/CD Integration

### Running in CI

Set environment for CI:

```bash
# Run tests with CI settings
npm run test:ci

# Or manually with CI environment
CI=true npx playwright test --reporter=github
```

Playwright configuration automatically enables:
- 2 retries in CI mode
- GitHub reporter for CI/CD platforms

## 🤝 Contributing

When contributing tests:
1. Follow the test structure patterns
2. Always add schema validation
3. Store request objects in `request-objects/`
4. Use meaningful test descriptions
5. Generate or update schemas with `true` flag
6. Remove `true` flag before committing
7. Run full test suite before submitting PR

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [AJV JSON Schema Validation](https://ajv.js.org/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

ISC

## 👨‍💻 Author

Ibtisam Khan