export const apiDocumentation = {
  openapi: "3.0.0",
  info: {
    title: "Timetable Generator Integration API",
    version: "1.0.0",
    description: "RESTful API for integrating with external Academic Management Systems",
    contact: {
      name: "API Support",
      email: "api-support@timetable-generator.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/integration",
      description: "Development server",
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
    schemas: {
      Student: {
        type: "object",
        required: ["name", "email", "program", "year", "branch", "division"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john.doe@university.edu" },
          program: { type: "string", enum: ["FYUP", "B.Ed.", "M.Ed.", "ITEP"], example: "FYUP" },
          year: { type: "integer", minimum: 1, maximum: 4, example: 2 },
          branch: { type: "string", example: "Computer Science" },
          division: { type: "string", example: "A" },
          rollNo: { type: "string", example: "CS2021001" },
          enrolledCredits: { type: "integer", example: 24 },
        },
      },
      Course: {
        type: "object",
        required: ["name", "code", "instructor", "duration", "capacity", "year", "branch", "division", "lectureType"],
        properties: {
          name: { type: "string", example: "Data Structures and Algorithms" },
          code: { type: "string", example: "CS201" },
          instructor: { type: "string", format: "objectId", example: "60d5ecb74b24a1234567890a" },
          duration: { type: "integer", example: 60 },
          capacity: { type: "integer", example: 60 },
          year: { type: "integer", minimum: 1, maximum: 4, example: 2 },
          branch: { type: "string", example: "Computer Science" },
          division: { type: "string", example: "A" },
          lectureType: { type: "string", enum: ["theory", "lab"], example: "theory" },
          credits: { type: "integer", example: 4 },
          category: {
            type: "string",
            enum: ["MAJOR", "MINOR", "SEC", "AEC", "VAC", "CORE", "OTHER"],
            example: "MAJOR",
          },
        },
      },
      BulkResponse: {
        type: "object",
        properties: {
          processed: { type: "integer", example: 100 },
          created: { type: "integer", example: 85 },
          updated: { type: "integer", example: 10 },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                index: { type: "integer" },
                data: { type: "object" },
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check endpoint",
        responses: {
          200: {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "healthy" },
                    timestamp: { type: "string", format: "date-time" },
                    version: { type: "string", example: "1.0.0" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/students": {
      get: {
        summary: "Get students with filtering and pagination",
        parameters: [
          { name: "program", in: "query", schema: { type: "string" } },
          { name: "year", in: "query", schema: { type: "integer" } },
          { name: "branch", in: "query", schema: { type: "string" } },
          { name: "division", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 100 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          200: {
            description: "List of students",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    students: { type: "array", items: { $ref: "#/components/schemas/Student" } },
                    pagination: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        limit: { type: "integer" },
                        offset: { type: "integer" },
                        hasMore: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new student",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Student" },
            },
          },
        },
        responses: {
          201: {
            description: "Student created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Student" },
              },
            },
          },
        },
      },
    },
    "/bulk/students": {
      post: {
        summary: "Bulk import/update students",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["students"],
                properties: {
                  students: { type: "array", items: { $ref: "#/components/schemas/Student" } },
                  options: {
                    type: "object",
                    properties: {
                      upsert: { type: "boolean", default: false },
                      validateOnly: { type: "boolean", default: false },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Bulk operation results",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BulkResponse" },
              },
            },
          },
        },
      },
    },
  },
}
