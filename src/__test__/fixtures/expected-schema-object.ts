/* Expected schema object properties that the parser should create*/
const expectedSchemaObject = {
    name: 'test-schema',
    objects:
    {
        Query_isExtended_: {
            description: "Make a Query",
            name: "Query_isExtended_",
            implements: {
                dog: {
                    name: "dog"
                },
                cat: {
                    name: "cat"
                }
            },
            directives: {
                include1: {
                    name: "include1",
                    height: 1,
                    parameters: {
                        if: {
                            name: "if",
                            type: "boolean"
                        }
                    }
                },
                exclude1: {
                    name: "exclude1",
                    height: 1,
                    parameters: {
                        if: {
                            name: "if",
                            type: "[boolean!]!"
                        }
                    }
                }
            },
            isExtended: true,
            fields: {
                users: {
                    description: "gets the users",
                    name: "user",
                    parameters: {
                        query: {
                            description: "string to specify user",
                            name: "query",
                            type: "String"
                        }
                    },
                    type: "[User!]!",
                    directives: {
                        include2: {
                            name: "include2",
                            height: 2,
                            parameters: {
                                if: {
                                    name: "if",
                                    type: "boolean",
                                    directives: {
                                        require1: {
                                            name: "require1",
                                            height: 0,
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                posts: {
                    description: "gets the posts",
                    name: "posts",
                    type: "[Post!]!",
                    directives: {
                        include4: {
                            height: 1,
                            name: "include4",
                            parameters: {
                                if: {
                                    name: "if",
                                    type: "boolean"
                                }
                            }
                        }
                    },
                    parameters: {
                        available: {
                            description: "is it available",
                            name: "available",
                            type: "Boolean",
                            directives: {
                                include3: {
                                    height: 3,
                                    name: "include3",
                                    parameters: {
                                        if: {
                                            name: "if",
                                            type: "boolean",
                                            directives: {
                                                authenticate1: {
                                                    name: "authenticate1",
                                                    height: 2,
                                                    parameters: {
                                                        email: {
                                                            name: "email",
                                                            type: "String",
                                                        },
                                                        password: {
                                                            name: "password",
                                                            type: "String",
                                                            directives: {
                                                                exclude2: {
                                                                    height: 1,
                                                                    name: "exclude2",
                                                                    parameters: {
                                                                        if: {
                                                                            name: "if",
                                                                            type: "[boolean!]!"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        from5: {
                                            name: "from5",
                                            type: "String",
                                            directives: {
                                                now1: {
                                                    height: 0,
                                                    name: "now1"
                                                },
                                                then1: {
                                                    height: 0,
                                                    name: "then1"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        query: {
                            description: "make a query string for posts",
                            name: "query",
                            type: "String",
                            directives: {
                                authenticate2: {
                                    height: 1,
                                    name: "authenticate2",
                                    parameters: {
                                        email: {
                                            name: "email",
                                            type: "String"
                                        },
                                        password: {
                                            name: "password",
                                            type: "String"
                                        }
                                    }
                                }
                            }
                        }

                    }
                },
                comments: {
                    description: "gets the comments",
                    name: "comments",
                    type: "[Comment!]!",
                    directives: {
                        authenticate3: {
                            height: 2,
                            name: "authenticate3",
                            parameters: {
                                email: {
                                    name: "email",
                                    type: "String",
                                    directives: {
                                        require2: {
                                            height: 0,
                                            name: "require2"
                                        }
                                    }
                                },
                                password: {
                                    name: "password",
                                    type: "String",
                                    directives: {
                                        require3: {
                                            height: 0,
                                            name: "require3"
                                        }
                                    }
                                }


                            }
                        },
                        include5: {
                            height: 1,
                            name: "include5",
                            parameters: {
                                if: {
                                    name: "if",
                                    type: "boolean"
                                }
                            }
                        }
                    }
                },
                me: {
                    description: "gets the current user",
                    name: "me",
                    type: "User!",
                    directives: {
                        last1: {
                            name: "last1",
                            height: 0,
                        },
                        second1: {
                            name: "second1",
                            height: 0,
                        },
                        third: {
                            name: "third",
                            height: 2,
                            parameters: {
                                amount: {
                                    name: "amount",
                                    type: "Int"
                                },
                                time: {
                                    name: "time",
                                    type: "Int",
                                    directives: {
                                        max: {
                                            height: 1,
                                            name: "max",
                                            parameters: {
                                                amount: {
                                                    name: "amount",
                                                    type: "int"
                                                }
                                            }
                                        },
                                        min1: {
                                            height: 0,
                                            name: "min1"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    name: "post",
                    type: "Post!"
                }
            }

        },
        Mutation: {
            name: "Mutation",
            isExtended: false,
            fields: {
                createUser: {
                    name: "createUser",
                    type: "User!",
                    parameters: {
                        data: {
                            name: "data",
                            type: "CreateUserInput!"
                        }
                    }
                },
                deleteUser: {
                    name: "deleteUser",
                    type: "User!",
                    parameters: {
                        id: {
                            name: "id",
                            type: "ID!"
                        }
                    }
                },
                updateUser: {
                    name: "updateUser",
                    type: "User!",
                    parameters: {
                        id: {
                            name: "id",
                            type: "ID!",
                        },
                        data: {
                            name: "data",
                            type: "UpdateUserInput!"
                        }
                    },
                    directives: {
                        exclude4: {
                            height: 1,
                            name: "exclude4",
                            parameters: {
                                if: {
                                    name: "if",
                                    type: "[boolean!]!"
                                }
                            }
                        },
                        authenticate4: {
                            name: "authenticate4",
                            height: 1,
                            parameters: {
                                email: {
                                    name: "email",
                                    type: "String"
                                },
                                password: {
                                    name: "password",
                                    type: "String"
                                }
                            }

                        }
                    }
                },
                createPost: {
                    name: "createPost",
                    type: "Post!",
                    parameters: {
                        data: {
                            name: "data",
                            type: "CreatePostInput!"
                        }
                    }

                }
            }
        },
        Subscription: {
            isExtended: false,
            name: "Subscription",
            description: "Make a Subscription",
            fields: {
                comment: {
                    name: "comment",
                    type: "CommentSubscriptionPayload!",
                    parameters: {
                        postId: {
                            name: "postId",
                            type: "ID!"
                        }
                    }
                },
                post: {
                    name: "post",
                    type: "PostSubscriptionPayload!",
                }
            }
        }
    },
    inputs: {
        CreateUserInput: {
            isExtended: false,
            description: "Input for user creation",
            name: "CreateUserInput",
            fields: {
                name: {
                    name: "name",
                    type: "String!"
                },
                email: {
                    name: "email",
                    type: "String!"
                },
                age: {
                    name: "age",
                    type: "Int"
                }
            }
        }
    },
    interfaces: {
        UpdateUser: {
            isExtended: false,
            name: "UpdateUser",
            description: "interface for user update",
            fields: {
                name: {
                    name: "name",
                    type: "String"
                },
                email: {
                    name: "email",
                    type: "String"
                },
                age: {
                    name: "age",
                    type: "Int"
                }
            }
        }

    },
    unions: {
        SearchResult1_isExtended_: {
            description: "Make a SearchResult1",
            name: "SearchResult1_isExtended_",
            isExtended: true,
            elements: {
                Photo: {
                    name: "Photo"
                },
                Person: {
                    name: "Person"
                },
                asdf: {
                    name: "asdf"
                }
            }
        },
        SearchResult2_isExtended_: {
            name: "SearchResult2_isExtended_",
            isExtended: true,
            directives: {
                dir1: {
                    name: "dir1",
                    height: 2,
                    parameters: {
                        if: {
                            name: "if",
                            type: "Boolean",
                            directives: {
                                dirIn1: {
                                    height: 0,
                                    name: "dirIn1"
                                }
                            }
                        },
                        then: {
                            name: "then",
                            type: "String"
                        }
                    }
                }
            },
            elements: {
                Photo: {
                    name: "Photo",
                },
                Person: {
                    name: "Person"
                }
            }
        },
        SearchResult3: {
            isExtended: false,
            name: "SearchResult3",
            directives: {
                dir2: {
                    height: 0,
                    name: "dir2"
                }
            },
            elements: {
                Photo: {
                    name: "Photo",
                },
                Person: {
                    name: "Person"
                },
                Page: {
                    name: "Page"
                }
            }
        },
        SearchResult4: {
            isExtended: false,
            description: "Make a SearchResult4",
            name: "SearchResult4",
            directives: {
                dir3: {
                    height: 0,
                    name: "dir3"
                }
            },
            elements: {
                Photo: {
                    name: "Photo",
                },
                Person: {
                    name: "Person"
                },
            }
        },
        SearchResult5: {
            isExtended: false,
            name: "SearchResult5",
            directives: {
                dir4: {
                    height: 0,
                    name: "dir4"
                }
            },
            elements: {
                Photo: {
                    name: "Photo",
                },
                Person: {
                    name: "Person"
                },
            }
        }
    },
    scalars: {
        Time: {
            isExtended: false,
            name: "Time",
            description: "Time for scalar time"
        },
        Url_isExtended_: {
            name: "Url_isExtended_",
            isExtended: true
        },
        Time2_isExtended_: {
            name: "Time2_isExtended_",
            description: "Time2 for scalar time",
            isExtended: true,
            directives: {
                dir5: {
                    height: 0,
                    name: "dir5"
                }
            }

        },
        DateTime: {
            isExtended: false,
            name: "DateTime",
            directives: {
                dir6: {
                    name: "dir6",
                    height: 2,
                    parameters: {
                        if: {
                            name: "if",
                            type: "Boolean"
                        },
                        before: {
                            name: "before",
                            type: "String",
                            directives: {
                                dirIn6: {
                                    name: "dirIn6",
                                    height: 1,
                                    parameters: {
                                        force: {
                                            name: "force",
                                            type: "Boolean"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
    },
    enums: {
        Direction: {
            isExtended: false,
            name: "Direction",
            elements: {
                NORTH: {
                    name: "NORTH"
                },
                EAST: {
                    name: "EAST"
                },
                SOUTH: {
                    name: "SOUTH"
                },
                WEST: {
                    name: "WEST"
                }
            }
        },
        Direction_isExtended_: {
            name: "Direction_isExtended_",
            description: "extended Direction enum",
            isExtended: true,
            directives: {
                direnum1: {
                    name: "direnum1",
                    height: 0
                }
            },
            elements: {
                NORTH: {
                    name: "NORTH",
                    directives: {
                        dirEnum2: {
                            height: 0,
                            name: "dirEnum2"
                        }
                    }
                },
                EAST: {
                    name: "EAST"
                },
                SOUTH: {
                    name: "SOUTH"
                },
                WEST: {
                    name: "WEST"
                },
                CENTER: {
                    name: "CENTER",
                    directives: {
                        default: {
                            height: 2,
                            name: "default",
                            parameters: {
                                value: {
                                    name: "value",
                                    type: "string",
                                    directives: {
                                        insideDefaultEnum: {
                                            height: 0,
                                            name: "insideDefaultEnum"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    },
    directiveDefinitions: {
        example: {
            isExtended: false,
            height: 0,
            name: "example",
            elements: {
                FIELD_DEFINITION: {
                    name: "FIELD_DEFINITION"
                },
                ARGUMENT_DEFINITION: {
                    name: "ARGUMENT_DEFINITION"
                }

            }
        },
        example2: {
            isExtended: false,
            description: "directive for example2",
            name: "example2",
            height: 0,
            elements: {
                FIELD_DEFINITION: {
                    name: "FIELD_DEFINITION"
                },
                ARGUMENT_DEFINITION: {
                    name: "ARGUMENT_DEFINITION"
                },
                SCHEMA: {
                    name: "SCHEMA"
                }
            }
        },
        anotherExample3: {
            isExtended: false,
            height: 2,
            name: "anotherExample3",
            parameters: {
                arg: {
                    name: "arg",
                    type: "String",
                    directives: {
                        include: {
                            height: 0,
                            name: "include"
                        }
                    }
                }
            },
            elements: {
                ARGUMENT_DEFINITION: {
                    name: "ARGUMENT_DEFINITION"
                }
            }
        }

    }
}

export {
    expectedSchemaObject
}