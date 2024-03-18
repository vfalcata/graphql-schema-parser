import { GraphQLSchemaAttrs } from '../typedefs/graphql-schema';
/**
 * gets the raw schema text from a GraphQL schema file and parses and converts it to a GraphQLSchemaAttrs object.
 *
 * @param rawGraphqlSchemaText the raw text as a string from a GraphQL schema file
 * @param name the name that corresponds to the GraphQLSchema object that will be generated, this is useful for indexing if generating from multiple schema files
 * @returns  GraphQLSchemaAttrs the attrs was used here so that implicit functional components of the GraphQLschema class was omitted such as the constructor
 */
export declare const generateSchemaObject: (rawGraphqlSchemaText: string, name: string) => GraphQLSchemaAttrs;
