
import {generateSchemaObject} from '../ts-type-generator';
const graphqlSchemaText = fs.readFileSync(path.resolve(__dirname, 'fixtures/testschema.graphql'), 'utf8');
const schemaObject = generateSchemaObject(graphqlSchemaText);

const enums=['MutationType']

it('parses all available types, enums and inputs',()=>{
    const expectedSchemaObjects=[
        'Query',
        'Mutation',
        'Subscription',
        'User',
        'Post',
        'Comment',
        'PostSubscriptionPayload',
        'CommentSubscriptionPayload',

    ]
    const expectedSchemaInputs=[       
        'CreateUserInput',
        'UpdateUserInput',
        'CreatePostInput',
        'UpdatePostInput',
        'CreateCommentInput',
        'UpdateCommentInput'
    ]
    const expectedSchemaEnums=[
        'MutationType'
    ]
    const parsedObjects=Object.keys(schemaObject.objects);
    const parsedInputs=Object.keys(schemaObject.inputs);
    const parsedEnums=Object.keys(schemaObject.enums);
    expect(parsedObjects.length).toBe(expectedSchemaObjects.length)
    expect(parsedInputs.length).toBe(expectedSchemaInputs.length)
    expect(parsedEnums.length).toBe(expectedSchemaEnums.length)

    let hasAllSchemaTypes=true
    expectedSchemaObjects
    .forEach(expectedSchemaType => {
        if(hasAllSchemaTypes){
            hasAllSchemaTypes=hasAllSchemaTypes && parsedObjects.includes(expectedSchemaType)
        }
    });
    expect(hasAllSchemaTypes).toBe(true)

    let hasAllSchemaInputs=true
    expectedSchemaInputs
    .forEach(expectedSchemaInput => {
        if(hasAllSchemaInputs){
            hasAllSchemaInputs=hasAllSchemaInputs && parsedInputs.includes(expectedSchemaInput)
        }
    });
    expect(hasAllSchemaInputs).toBe(true)

    let hasAllSchemaEnums=true
    expectedSchemaEnums
    .forEach(expectedSchemaEnum => {
        if(hasAllSchemaEnums){
            hasAllSchemaEnums=hasAllSchemaEnums && parsedEnums.includes(expectedSchemaEnum)
        }
    });
    expect(hasAllSchemaEnums).toBe(true)
})

it('parses all parameters',()=>{
    const expectedTypesWithParameters={
        objects:{
            Query:{
                users:{
                    parameters:{
                        query:'String'
                    }
                },
                posts:{
                    parameters:{
                        query:'String'
                    }
                }
            },
            Mutation:{
                createUser:{
                    parameters:{
                        data:'CreateUserInput!'
                    }
                },
                deleteUser:{
                    parameters:{
                        id:'ID!'
                    }
                },
                updateUser:{
                    parameters:{
                        id:'ID!',
                        data: 'UpdateUserInput!'
                    }
                },
                createPost:{
                    parameters:{
                        data:'CreatePostInput!'
                    }
                },
                deletePost:{
                    parameters:{
                        id:'ID!'
                    }
                },
                updatePost:{
                    parameters:{
                        id:'ID!',
                        data:'UpdatePostInput!'
                    }
                },
                createComment:{
                    parameters:{
                        data:'CreateCommentInput!'
                    }
                },
                deleteComment:{
                    parameters:{
                        id:'ID!'
                    }
                },
                updateComment:{
                    parameters:{
                        id:'ID!',
                        data:'UpdateCommentInput!'
                    }
                }
            },
            Subscription:{
                comment:{
                    parameters:{
                        postId:'ID!'
                    }
                }
            }
        }
 
    }


    let numberOfFieldsWithParameters = 0
    let numberOfParameteres = 0

    for (const objectType in schemaObject){
        for (const type in schemaObject[objectType]){
            for (const field in schemaObject[objectType][type]){
                if(schemaObject[objectType][type][field].parameters){
                    numberOfFieldsWithParameters++
                    numberOfParameteres=numberOfParameteres+Object.keys(schemaObject[objectType][type][field].parameters).length
                }
            }
        }
    }

    expect(numberOfFieldsWithParameters).toBe(12)
    expect(numberOfParameteres).toBe(15)

    expect(schemaObject.objects.Query.users.parameters.query).toBe(expectedTypesWithParameters.objects.Query.users.parameters.query)
    expect(Object.keys(schemaObject.objects.Query.users.parameters).length).toBe(1)

    expect(schemaObject.objects.Query.posts.parameters.query).toBe(expectedTypesWithParameters.objects.Query.posts.parameters.query)
    expect(Object.keys(schemaObject.objects.Query.posts.parameters).length).toBe(1)

    expect(schemaObject.objects.Mutation.createUser.parameters.data).toBe(expectedTypesWithParameters.objects.Mutation.createUser.parameters.data)
    expect(Object.keys(schemaObject.objects.Mutation.createUser.parameters).length).toBe(1)

    expect(schemaObject.objects.Mutation.deleteUser.parameters.id).toBe(expectedTypesWithParameters.objects.Mutation.deleteUser.parameters.id)
    expect(Object.keys(schemaObject.objects.Mutation.deleteUser.parameters).length).toBe(1)

    expect(schemaObject.objects.Mutation.updateUser.parameters.id).toBe(expectedTypesWithParameters.objects.Mutation.updateUser.parameters.id)
    expect(schemaObject.objects.Mutation.updateUser.parameters.data).toBe(expectedTypesWithParameters.objects.Mutation.updateUser.parameters.data)
    expect(Object.keys(schemaObject.objects.Mutation.updateUser.parameters).length).toBe(2)



    expect(schemaObject.objects.Mutation.createPost.parameters.data).toBe(expectedTypesWithParameters.objects.Mutation.createPost.parameters.data)
    expect(Object.keys(schemaObject.objects.Mutation.createPost.parameters).length).toBe(1)

    expect(schemaObject.objects.Mutation.deletePost.parameters.id).toBe(expectedTypesWithParameters.objects.Mutation.deletePost.parameters.id)
    expect(Object.keys(schemaObject.objects.Mutation.deletePost.parameters).length).toBe(1)

    expect(schemaObject.objects.Mutation.updatePost.parameters.id).toBe(expectedTypesWithParameters.objects.Mutation.updatePost.parameters.id)
    expect(schemaObject.objects.Mutation.updatePost.parameters.data).toBe(expectedTypesWithParameters.objects.Mutation.updatePost.parameters.data)
    expect(Object.keys(schemaObject.objects.Mutation.updatePost.parameters).length).toBe(2)

    expect(schemaObject.objects.Mutation.createComment.parameters.data).toBe(expectedTypesWithParameters.objects.Mutation.createComment.parameters.data)
    expect(Object.keys(schemaObject.objects.Mutation.createComment.parameters).length).toBe(1)

    expect(schemaObject.objects.Mutation.deleteComment.parameters.id).toBe(expectedTypesWithParameters.objects.Mutation.deleteComment.parameters.id)
    expect(Object.keys(schemaObject.objects.Mutation.deleteComment.parameters).length).toBe(1)

    expect(schemaObject.objects.Mutation.updateComment.parameters.id).toBe(expectedTypesWithParameters.objects.Mutation.updateComment.parameters.id)
    expect(schemaObject.objects.Mutation.updateComment.parameters.data).toBe(expectedTypesWithParameters.objects.Mutation.updateComment.parameters.data)
    expect(Object.keys(schemaObject.objects.Mutation.updateComment.parameters).length).toBe(2)

    expect(schemaObject.objects.Subscription.comment.parameters.postId).toBe(expectedTypesWithParameters.objects.Subscription.comment.parameters.postId)
    expect(Object.keys(schemaObject.objects.Subscription.comment.parameters).length).toBe(1)

})

it('parses all return types',()=>{
    const expectedTypesWithParameters={
        objects:{
            Query:{
                users:{returnType:'[User!]!'},
                posts:{returnType:'[Post!]!'},
                comments:{returnType:'[Comment!]!'},
                me:{returnType:'User!'},
                post:{returnType:'Post!'}
            },
            Mutation:{
                createUser:{returnType:'User!'},
                deleteUser:{returnType:'User!'},
                updateUser:{returnType:'User!'},
                createPost:{returnType:'Post!'},
                deletePost:{returnType:'Post!'},
                updatePost:{returnType:'Post!'},
                createComment:{returnType:'Comment!'},
                deleteComment:{returnType:'Comment!'},
                updateComment:{returnType:'Comment!'},
            },
            Subscription:{
                comment:{returnType:'CommentSubscriptionPayload!'},
                post:{returnType:'PostSubscriptionPayload!'}
            },
            User: {
                id: {returnType:'ID!'},
                name: {returnType:'String!'},
                email: {returnType:'String!'},
                age: {returnType:'Int'},
                posts: {returnType:'[Post!]!'},
                comments: {returnType:'[Comment!]!'}
            },
            Post: {
                id: {returnType:'ID!'},
                title: {returnType:'String!'},
                body: {returnType:'String!'},
                published: {returnType:'Boolean!'},
                author: {returnType:'User!'},
                comments: {returnType:'[Comment!]!'}
            },
            Comment: {
                id: {returnType:'ID!'},
                text: {returnType:'String!'},
                author: {returnType:'User!'},
                post: {returnType:'Post!'}
            },
            PostSubscriptionPayload: {
                mutation: {returnType:'MutationType!'},
                data: {returnType:'Post!'}
            },
            CommentSubscriptionPayload: {
                mutation: {returnType:'MutationType!'},
                data: {returnType:'Comment!'}
            }
        
        },
        inputs:{
            CreateUserInput: {
                name: {returnType:'String!'},
                email: {returnType:'String!'},
                age: {returnType:'Int'},
            },            
            UpdateUserInput: {
                name: {returnType:'String'},
                email: {returnType:'String'},
                age: {returnType:'Int'},
            },            
            CreatePostInput: {
                title: {returnType:'String!'},
                body: {returnType:'String!'},
                published: {returnType:'Boolean!'},
                author: {returnType:'ID!'},
            },            
            UpdatePostInput: {
                title: {returnType:'String'},
                body: {returnType:'String'},
                published:{returnType:'Boolean'},
            },            
            CreateCommentInput: {
                text: {returnType:'String!'},
                author: {returnType:'ID!'},
                post: {returnType:'ID!'},
            },            
            UpdateCommentInput: {
                text: {returnType:'String'},
            }
            
        }   
        
        
    }

    let numberOfFieldsWithReturnTypes=0
    for (const objectType in schemaObject){
        for (const type in schemaObject[objectType]){
            for (const field in schemaObject[objectType][type]){
                if(schemaObject[objectType][type][field].returnType){
                    numberOfFieldsWithReturnTypes++
                }
            }
        }
    }

    expect(numberOfFieldsWithReturnTypes).toBe(53)

    expect(schemaObject.objects.Query.users.returnType).toBe(expectedTypesWithParameters.objects.Query.users.returnType)
    expect(schemaObject.objects.Query.posts.returnType).toBe(expectedTypesWithParameters.objects.Query.posts.returnType)
    expect(schemaObject.objects.Query.comments.returnType).toBe(expectedTypesWithParameters.objects.Query.comments.returnType)
    expect(schemaObject.objects.Query.me.returnType).toBe(expectedTypesWithParameters.objects.Query.me.returnType)
    expect(schemaObject.objects.Query.post.returnType).toBe(expectedTypesWithParameters.objects.Query.post.returnType)

    expect(schemaObject.objects.Mutation.createUser.returnType).toBe(expectedTypesWithParameters.objects.Mutation.createUser.returnType)
    expect(schemaObject.objects.Mutation.deleteUser.returnType).toBe(expectedTypesWithParameters.objects.Mutation.deleteUser.returnType)
    expect(schemaObject.objects.Mutation.updateUser.returnType).toBe(expectedTypesWithParameters.objects.Mutation.updateUser.returnType)
    expect(schemaObject.objects.Mutation.createPost.returnType).toBe(expectedTypesWithParameters.objects.Mutation.createPost.returnType)
    expect(schemaObject.objects.Mutation.deletePost.returnType).toBe(expectedTypesWithParameters.objects.Mutation.deletePost.returnType)
    expect(schemaObject.objects.Mutation.updatePost.returnType).toBe(expectedTypesWithParameters.objects.Mutation.updatePost.returnType)
    expect(schemaObject.objects.Mutation.createComment.returnType).toBe(expectedTypesWithParameters.objects.Mutation.createComment.returnType)
    expect(schemaObject.objects.Mutation.deleteComment.returnType).toBe(expectedTypesWithParameters.objects.Mutation.deleteComment.returnType)
    expect(schemaObject.objects.Mutation.updateComment.returnType).toBe(expectedTypesWithParameters.objects.Mutation.updateComment.returnType)

    expect(schemaObject.inputs.CreateUserInput.name.returnType).toBe(expectedTypesWithParameters.inputs.CreateUserInput.name.returnType)
    expect(schemaObject.inputs.CreateUserInput.email.returnType).toBe(expectedTypesWithParameters.inputs.CreateUserInput.email.returnType)
    expect(schemaObject.inputs.CreateUserInput.age.returnType).toBe(expectedTypesWithParameters.inputs.CreateUserInput.age.returnType)

    expect(schemaObject.inputs.UpdateUserInput.name.returnType).toBe(expectedTypesWithParameters.inputs.UpdateUserInput.name.returnType)
    expect(schemaObject.inputs.UpdateUserInput.email.returnType).toBe(expectedTypesWithParameters.inputs.UpdateUserInput.email.returnType)
    expect(schemaObject.inputs.UpdateUserInput.age.returnType).toBe(expectedTypesWithParameters.inputs.UpdateUserInput.age.returnType)

    expect(schemaObject.inputs.CreatePostInput.title.returnType).toBe(expectedTypesWithParameters.inputs.CreatePostInput.title.returnType)
    expect(schemaObject.inputs.CreatePostInput.body.returnType).toBe(expectedTypesWithParameters.inputs.CreatePostInput.body.returnType)
    expect(schemaObject.inputs.CreatePostInput.published.returnType).toBe(expectedTypesWithParameters.inputs.CreatePostInput.published.returnType)
    expect(schemaObject.inputs.CreatePostInput.author.returnType).toBe(expectedTypesWithParameters.inputs.CreatePostInput.author.returnType)

    expect(schemaObject.inputs.UpdatePostInput.title.returnType).toBe(expectedTypesWithParameters.inputs.UpdatePostInput.title.returnType)
    expect(schemaObject.inputs.UpdatePostInput.body.returnType).toBe(expectedTypesWithParameters.inputs.UpdatePostInput.body.returnType)
    expect(schemaObject.inputs.UpdatePostInput.published.returnType).toBe(expectedTypesWithParameters.inputs.UpdatePostInput.published.returnType)

    expect(schemaObject.inputs.CreateCommentInput.text.returnType).toBe(expectedTypesWithParameters.inputs.CreateCommentInput.text.returnType)
    expect(schemaObject.inputs.CreateCommentInput.author.returnType).toBe(expectedTypesWithParameters.inputs.CreateCommentInput.author.returnType)
    expect(schemaObject.inputs.CreateCommentInput.post.returnType).toBe(expectedTypesWithParameters.inputs.CreateCommentInput.post.returnType)
    
    expect(schemaObject.inputs.UpdateCommentInput.text.returnType).toBe(expectedTypesWithParameters.inputs.UpdateCommentInput.text.returnType)

})

it('parses all enumerations',()=>{
    const expectedEnumerations={
        MutationType:[
            'CREATED',
            'UPDATED',
            'DELETED'
        ]
    }
    expect(Object.keys(schemaObject.enums).length).toBe(1)
    expect(schemaObject.enums.MutationType.length).toBe(3)
    expect(schemaObject.enums.MutationType[0]).toBe(expectedEnumerations.MutationType[0])
    expect(schemaObject.enums.MutationType[1]).toBe(expectedEnumerations.MutationType[1])
    expect(schemaObject.enums.MutationType[2]).toBe(expectedEnumerations.MutationType[2])
    console.log(schemaObject.enums)
})

it('parses all directives and their respective parameters',()=>{
    const expectedTypesWithDirectives={
        objects:{
            Query:{
                users:{
                    directives:{
                        include:{
                            if:'boolean'
                        }
                    }
                },
                posts:{
                    directives:{
                        include:{
                            if:'boolean'
                        }
                    }
                },
            },
            Mutation:{
                updateUser:{
                    directives:{
                        exclude:{
                            if:'[boolean!]!'
                        },
                        authenticate:{
                            email:'String',
                            password:'String'
                        }
                    }
                }

            },            
            Post: {
                id:{
                    directives:{
                        authenticate:{
                            email:'String',
                            password:'String'
                        }
                    }
                }
            },
        },         
    }
   
    let numberOfFieldsWithDirectives=0
    let numberOfDirectives=0
    let numberOfDirectiveParameters=0
    for (const objectType in schemaObject){
        for (const type in schemaObject[objectType]){
            for (const field in schemaObject[objectType][type]){
                if(schemaObject[objectType][type][field].directives && Object.keys(schemaObject[objectType][type][field].directives).length>0){
                    numberOfFieldsWithDirectives++
                    numberOfDirectives=numberOfDirectives+Object.keys(schemaObject[objectType][type][field].directives).length
                    for(const directive in schemaObject[objectType][type][field].directives){
                        numberOfDirectiveParameters=numberOfDirectiveParameters+Object.keys(schemaObject[objectType][type][field].directives[directive]).length
                    }
                }
            }
        }
    }

    expect(numberOfFieldsWithDirectives).toBe(4)
    expect(numberOfDirectives).toBe(5)
    expect(numberOfDirectiveParameters).toBe(7)

    expect(schemaObject.objects.Query.users.directives.include.if).toBe(expectedTypesWithDirectives.objects.Query.users.directives.include.if)
    expect(schemaObject.objects.Query.posts.directives.include.if).toBe(expectedTypesWithDirectives.objects.Query.posts.directives.include.if)
    expect(Object.keys(schemaObject.objects.Query.users.directives).length).toBe(1)
    expect(Object.keys(schemaObject.objects.Query.posts.directives).length).toBe(1)
    let numberOfDirectivesOnQuery=0
    let numberOfDirectiveParametersOnQuery=0
    for(const field in schemaObject.objects.Query){
        if(schemaObject.objects.Query[field].directives){
            numberOfDirectivesOnQuery=numberOfDirectivesOnQuery+Object.keys(schemaObject.objects.Query[field].directives).length

            for(const directive in schemaObject.objects.Query[field].directives){
                numberOfDirectiveParametersOnQuery=numberOfDirectiveParametersOnQuery+Object.keys(schemaObject.objects.Query[field].directives[directive]).length
            }
        }
    }

    expect(numberOfDirectivesOnQuery).toBe(2)
    expect(numberOfDirectiveParametersOnQuery).toBe(2)


    expect(schemaObject.objects.Mutation.updateUser.directives.exclude.if).toBe(expectedTypesWithDirectives.objects.Mutation.updateUser.directives.exclude.if)
    expect(schemaObject.objects.Mutation.updateUser.directives.authenticate.email).toBe(expectedTypesWithDirectives.objects.Mutation.updateUser.directives.authenticate.email)
    expect(schemaObject.objects.Mutation.updateUser.directives.authenticate.password).toBe(expectedTypesWithDirectives.objects.Mutation.updateUser.directives.authenticate.password)
    let numberOfDirectivesOnMutation=0
    let numberOfDirectiveParametersOnMutation=0
    for(const field in schemaObject.objects.Mutation){
        if(schemaObject.objects.Mutation[field].directives){
            numberOfDirectivesOnMutation=numberOfDirectivesOnMutation+Object.keys(schemaObject.objects.Mutation[field].directives).length
            for(const directive in schemaObject.objects.Mutation[field].directives){
                numberOfDirectiveParametersOnMutation=numberOfDirectiveParametersOnMutation+Object.keys(schemaObject.objects.Mutation[field].directives[directive]).length
            }
        }
    }
    expect(numberOfDirectivesOnMutation).toBe(2)
    expect(numberOfDirectiveParametersOnMutation).toBe(3)

    expect(schemaObject.objects.Post.id.directives.authenticate.email).toBe(expectedTypesWithDirectives.objects.Post.id.directives.authenticate.email)
    expect(schemaObject.objects.Post.id.directives.authenticate.password).toBe(expectedTypesWithDirectives.objects.Post.id.directives.authenticate.password)

    let numberOfDirectivesOnPost=0
    let numberOfDirectiveParametersOnPost=0
    for(const field in schemaObject.objects.Post){
        if(schemaObject.objects.Post[field].directives){
            numberOfDirectivesOnPost=numberOfDirectivesOnPost+Object.keys(schemaObject.objects.Post[field].directives).length
            for(const directive in schemaObject.objects.Post[field].directives){
                numberOfDirectiveParametersOnPost=numberOfDirectiveParametersOnPost+Object.keys(schemaObject.objects.Post[field].directives[directive]).length
            }
        }
    }
    expect(numberOfDirectivesOnPost).toBe(1)
    expect(numberOfDirectiveParametersOnPost).toBe(2)




})
