import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SATELITE.UZ API Documentation',
      version: '1.0.0',
      description: 'Official REST API for the SATELITE.UZ Educational Examination Platform.',
      contact: {
        name: 'SATELITE.UZ Engineering',
        email: 'support@gmail.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Current Environment API Base'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT bearer token in the format: Bearer <token>'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
            error: { type: 'string', example: 'NOT_FOUND' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['STUDENT', 'ADMIN'] },
            avatar: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Subject: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            isActive: { type: 'boolean' }
          }
        },
        QuestionOption: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            optionLabel: { type: 'string', example: 'A' },
            optionText: { type: 'string', example: '12' },
            isCorrect: { type: 'boolean', example: true }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            subjectId: { type: 'string' },
            topicId: { type: 'string' },
            questionText: { type: 'string' },
            questionType: { type: 'string', enum: ['MULTIPLE_CHOICE', 'MULTI_SELECT', 'TRUE_FALSE'] },
            difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] },
            explanation: { type: 'string' },
            imageUrl: { type: 'string', nullable: true },
            isPublished: { type: 'boolean' },
            options: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuestionOption' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
