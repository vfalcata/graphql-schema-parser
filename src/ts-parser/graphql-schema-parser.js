"use strict";
exports.__esModule = true;
var encoded_graphql_schema_parser_js_1 = require("./encoded-graphql-schema-parser.js");
var graphql_directive_parser_js_1 = require("./graphql-directive-parser.js");
var fs_1 = require("fs");
var path_1 = require("path");
var graphql_schema_js_1 = require("../typedefs/graphql-schema.js");
var generateSchemaObject = function () {
    var file = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, './../__test__/fixtures/nested-directives.graphql'), 'utf8');
    var _a = (0, graphql_directive_parser_js_1.parseDirectives)(file), encodedDirectivesSchemaText = _a.encodedDirectivesSchemaText, directiveProperties = _a.directiveProperties;
    console.log('encodedDirectivesSchemaText', encodedDirectivesSchemaText);
    console.log('directiveProperties', directiveProperties);
    var types = (0, encoded_graphql_schema_parser_js_1.getFieldedTypes)(encodedDirectivesSchemaText, directiveProperties);
    console.log('types', types);
    // // console.log('typessss',types.type.Query_isExtended_.directives.include1.parameters)
    var unions = (0, encoded_graphql_schema_parser_js_1.getUnions)(encodedDirectivesSchemaText, directiveProperties);
    console.log('unions', unions);
    var scalars = (0, encoded_graphql_schema_parser_js_1.getScalars)(encodedDirectivesSchemaText, directiveProperties);
    console.log('scalars', scalars);
    var enums = (0, encoded_graphql_schema_parser_js_1.getEnums)(encodedDirectivesSchemaText, directiveProperties);
    console.log('enums', enums);
    var directiveDefinitions = (0, encoded_graphql_schema_parser_js_1.getDirectiveDefinitions)(encodedDirectivesSchemaText, directiveProperties);
    console.log('directiveDefinitions', directiveDefinitions);
    var result = new graphql_schema_js_1.GraphQLSchema({ name: 'test' });
    result.objects = types.objects;
    result.interfaces = types.interfaces;
    result.inputs = types.inputs;
    result.enums = enums;
    result.directiveDefinitions = directiveDefinitions;
    result.scalars = scalars;
    result.unions = unions;
    return result;
};
//returns graphql schema object, as per typedef
generateSchemaObject();
