exports.annotations = {
  openapi: "3.0.0",
  info: {
    title: "Library Management API",
    version: "1.0.0",
    description: "API for managing users, books, and book requests",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Server",
    },
  ],
  paths: {
    "/v1/auth/net/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "phone", "password"],
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string", format: "email" },
                  phone: { type: "integer" },
                  password: { type: "string" },
                  role: {
                    type: "string",
                    enum: ["STUDENT", "ADMIN"],
                    default: "STUDENT",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Invalid input" },
        },
      },
    },
    "/v1/auth/net/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email_phone", "password"],
                properties: {
                  email_phone: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/book": {
      post: {
        tags: ["Book"],
        summary: "Register a new book",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "bookName",
                  "author",
                  "publisher",
                  "publishedYear",
                  "subject",
                  "bookIsbn",
                ],
                properties: {
                  bookName: { type: "string" },
                  author: { type: "string" },
                  publisher: { type: "string" },
                  publishedYear: { type: "integer" },
                  subject: { type: "string" },
                  bookIsbn: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Book created successfully" },
          400: { description: "Invalid input" },
        },
      },
      get: {
        tags: ["Book"],
        summary: "Get all books",
        responses: {
          200: {
            description: "List of all books",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      bookName: { type: "string" },
                      author: { type: "string" },
                      publisher: { type: "string" },
                      publishedYear: { type: "integer" },
                      subject: { type: "string" },
                      bookIsbn: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/bookrequest": {
      post: {
        tags: ["Book Request"],
        summary: "Request a book",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["studentName", "bookName"],
                properties: {
                  studentName: { type: "string" },
                  bookName: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Book requested successfully" },
          400: { description: "Invalid request" },
        },
      },
      get: {
        tags: ["Book Request"],
        summary: "Get all book requests",
        responses: {
          200: {
            description: "List of book requests",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        enum: ["pending", "approved", "rejected"],
                      },
                      studentName: { type: "string" },
                      bookName: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
