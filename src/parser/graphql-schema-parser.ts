import { getEnums, getFieldedTypes, getDirectiveDefinitions, getScalars, getUnions, } from './encoded-graphql-schema-parser'
import { parseDirectives } from './graphql-directive-parser'
import { GraphQLSchema, GraphQLSchemaAttrs } from '../typedefs/graphql-schema';

/**
 * gets the raw schema text from a GraphQL schema file and parses and converts it to a GraphQLSchemaAttrs object.
 * 
 * @param rawGraphqlSchemaText the raw text as a string from a GraphQL schema file
 * @param name the name that corresponds to the GraphQLSchema object that will be generated, this is useful for indexing if generating from multiple schema files
 * @returns  GraphQLSchemaAttrs the attrs was used here so that implicit functional components of the GraphQLschema class was omitted such as the constructor
 */
const generateSchemaObject = (rawGraphqlSchemaText: string, name: string): GraphQLSchemaAttrs => {
    const { encodedDirectivesSchemaText, directiveProperties } = parseDirectives(rawGraphqlSchemaText)
    const types = getFieldedTypes(encodedDirectivesSchemaText, directiveProperties)
    const unions = getUnions(encodedDirectivesSchemaText, directiveProperties)
    const scalars = getScalars(encodedDirectivesSchemaText, directiveProperties)
    const enums = getEnums(encodedDirectivesSchemaText, directiveProperties)
    const directiveDefinitions = getDirectiveDefinitions(encodedDirectivesSchemaText, directiveProperties)
    let result = new GraphQLSchema({ name })
    result.objects = types.objects
    result.interfaces = types.interfaces
    result.inputs = types.inputs
    result.enums = enums
    result.directiveDefinitions = directiveDefinitions
    result.scalars = scalars
    result.unions = unions
    return result.getSchemaObject();
}

export {
    generateSchemaObject
}