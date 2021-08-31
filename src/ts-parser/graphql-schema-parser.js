"use strict";
exports.__esModule = true;
var encoded_graphql_schema_parser_js_1 = require("./encoded-graphql-schema-parser.js");
var graphql_directive_parser_js_1 = require("./graphql-directive-parser.js");
var fs_1 = require("fs");
var path_1 = require("path");
var generateSchemaObject = function () {
    var file = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, './../__test__/fixtures/nested-directives.graphql'), 'utf8');
    var _a = (0, graphql_directive_parser_js_1.parseDirectives)(file), encodedDirectivesSchemaText = _a.encodedDirectivesSchemaText, directiveProperties = _a.directiveProperties;
    console.log('encodedDirectivesSchemaText', encodedDirectivesSchemaText);
    console.log('directiveProperties', directiveProperties);
    var types = (0, encoded_graphql_schema_parser_js_1.getFieldedTypes)(encodedDirectivesSchemaText, directiveProperties);
    console.log('types', types.objects.Query_isExtended_.fields.users.parameters);
    // // console.log('typessss',types.type.Query_isExtended_.directives.include1.parameters)
    // const unions = getUnions(encodedDirectivesSchemaText,directiveProperties)
    // console.log('unions',unions)
    // const scalars = getScalars(encodedDirectivesSchemaText,directiveProperties)
    // console.log('scalars',scalars)
    // const enums = getEnums(encodedDirectivesSchemaText,directiveProperties)
    // console.log('enums',enums)
    // const directiveDefinitions = getDirectiveDefinitions(encodedDirectivesSchemaText,directiveProperties)
    // console.log('directiveDefinitions',directiveDefinitions)
};
//returns graphql schema object, as per typedef
generateSchemaObject();
