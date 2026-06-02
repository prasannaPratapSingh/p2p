const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Peer2Peer Skill Swap API',
        version: '1.0.0',
        description: 'API documentation for the Peer2Peer Skill Swap backend.',
    },
    servers: [
        {
            url: 'http://localhost:4000',
            description: 'Local development server'
        }
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'accessToken'
            }
        },
        schemas: {
            ApiResponse: {
                type: 'object',
                properties: {
                    statusCode: { type: 'integer' },
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { type: ['object', 'array', 'null'] }
                }
            },
            RegisterBody: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                    name: { type: 'string' }
                }
            },
            LoginBody: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                }
            },
            SkillUpdateBody: {
                type: 'object',
                properties: {
                    skillsToLearn: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    skillsToTeach: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                }
            },
            ConnectionRequestBody: {
                type: 'object',
                required: ['receiverId', 'proposedTime'],
                properties: {
                    receiverId: { type: 'string' },
                    proposedTime: { type: 'string', format: 'date-time' }
                }
            },
            ConnectionResponseBody: {
                type: 'object',
                required: ['connectionId', 'action'],
                properties: {
                    connectionId: { type: 'string' },
                    action: { type: 'string', enum: ['accepted', 'rejected'] }
                }
            },
            ConnectionCompleteBody: {
                type: 'object',
                required: ['connectionId'],
                properties: {
                    connectionId: { type: 'string' }
                }
            }
        }
    },
    security: [
        {
            cookieAuth: []
        }
    ],
    paths: {
        '/api/healthcheck': {
            get: {
                summary: 'Check server health',
                responses: {
                    '200': {
                        description: 'Healthcheck successful',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/register': {
            post: {
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterBody' }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'User created successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'Login and receive authentication cookies',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginBody' }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Logged in successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/refresh': {
            post: {
                summary: 'Refresh the access token using refresh cookie',
                responses: {
                    '200': {
                        description: 'Token refreshed successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/logout': {
            post: {
                summary: 'Logout user and clear authentication cookies',
                responses: {
                    '200': {
                        description: 'Logout successful',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/skills/update': {
            put: {
                summary: 'Create or update the current user skill profile',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SkillUpdateBody' }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Skill profile updated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/skills/me': {
            get: {
                summary: 'Get the authenticated user skill profile',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': {
                        description: 'User skill profile fetched',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/wallet/me': {
            get: {
                summary: 'Retrieve the current user wallet',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': {
                        description: 'Wallet details retrieved',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/match/dashboard': {
            get: {
                summary: 'Get dashboard skill matches',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': {
                        description: 'Match results returned',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/connection/request': {
            post: {
                summary: 'Send a new peer connection request',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ConnectionRequestBody' }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Connection request sent',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/connection/respond': {
            post: {
                summary: 'Accept or reject a pending connection request',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ConnectionResponseBody' }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Connection request responded',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/connection/complete': {
            post: {
                summary: 'Complete an accepted connection swap',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ConnectionCompleteBody' }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Connection swap completed',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiResponse' }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default swaggerDocument;
