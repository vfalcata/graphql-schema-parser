"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemaObject = void 0;
var encoded_graphql_schema_parser_1 = require("./encoded-graphql-schema-parser");
var graphql_directive_parser_1 = require("./graphql-directive-parser");
var graphql_schema_1 = require("../typedefs/graphql-schema");
/**
 * gets the raw schema text from a GraphQL schema file and parses and converts it to a GraphQLSchemaAttrs object.
 *
 * @param rawGraphqlSchemaText the raw text as a string from a GraphQL schema file
 * @param name the name that corresponds to the GraphQLSchema object that will be generated, this is useful for indexing if generating from multiple schema files
 * @returns  GraphQLSchemaAttrs the attrs was used here so that implicit functional components of the GraphQLschema class was omitted such as the constructor
 */
var generateSchemaObject = function (rawGraphqlSchemaText, name) {
    var _a = (0, graphql_directive_parser_1.parseDirectives)(rawGraphqlSchemaText), encodedDirectivesSchemaText = _a.encodedDirectivesSchemaText, directiveProperties = _a.directiveProperties;
    var types = (0, encoded_graphql_schema_parser_1.getFieldedTypes)(encodedDirectivesSchemaText, directiveProperties);
    var unions = (0, encoded_graphql_schema_parser_1.getUnions)(encodedDirectivesSchemaText, directiveProperties);
    var scalars = (0, encoded_graphql_schema_parser_1.getScalars)(encodedDirectivesSchemaText, directiveProperties);
    var enums = (0, encoded_graphql_schema_parser_1.getEnums)(encodedDirectivesSchemaText, directiveProperties);
    var directiveDefinitions = (0, encoded_graphql_schema_parser_1.getDirectiveDefinitions)(encodedDirectivesSchemaText, directiveProperties);
    var result = new graphql_schema_1.GraphQLSchema({ name: name });
    result.objects = types.objects;
    result.interfaces = types.interfaces;
    result.inputs = types.inputs;
    result.enums = enums;
    result.directiveDefinitions = directiveDefinitions;
    result.scalars = scalars;
    result.unions = unions;
    return result.getSchemaObject();
};
exports.generateSchemaObject = generateSchemaObject;
