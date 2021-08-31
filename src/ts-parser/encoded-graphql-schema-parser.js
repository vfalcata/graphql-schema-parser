"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getUnions = exports.getScalars = exports.getDirectiveDefinitions = exports.getFieldedTypes = exports.getEnums = void 0;
var component_js_1 = require("../typedefs/component.js");
var element_definition_js_1 = require("../typedefs/element-definition.js");
var fielded_type_js_1 = require("../typedefs/fielded-type.js");
var graphql_directive_parser_js_1 = require("./graphql-directive-parser.js");
var EXTENSION_NAME_SUFFIX = '_isExtended_';
//(\s*"""([^"]+)"""\s*){0,1}
var FIELD_DESCRIPTION = '\(\\s*"""\(\[^"\]+\)"""\\s*\)\{0,1\}';
//(\s*"([^"]+)"\s*){0,1}
var PARAMETER_DESCRIPTION = '\(\\s*"\(\[^"\]+\)"\\s*\)\{0,1\}';
//(\s*"""([^"]+)"""\s*){0,1}^(extend\s+){0,1}(type|interface|input){1}\s+(\w+){1}(\s+implements\s+){0,1}([\s\w&]*)([\s0-9a-zA-Z%]*){0,1}{([^}]+)}
var OBJECT_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\(extend\\s+\)\{0,1\}\(type|interface|input\)\{1\}\\s+\(\\w+\)\{1\}\(\\s+implements\\s+\)\{0,1\}\(\[\\s\\w&\]*\)\(\[\\s0-9a-zA-Z' + graphql_directive_parser_js_1.ENCODING_FLAG + '\]*\)\{0,1\}\{\(\[^\}\]+\)\}', 'gm');
var OBJECT_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    TYPE_LABEL: 4,
    NAME: 5,
    IMPLEMENTS_TAG: 6,
    IMPLEMENTS: 7,
    ENCODED_DIRECTIVES: 8,
    BODY: 9
};
//(\s*"""([^"]+)"""\s*){0,1}^[\t ]*(\w+)(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|[%\w \t]+$)
var FIELD_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\[\\t \]*\(\\w+\)\(\\(\(\[^\\)\]+\)\\)\)\{0,1\}:\(\[\\w\\t \\[\\]!\]+\)\[\\t \]*\($|\[' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\w \\t\]+$\)', 'gm');
var FIELD_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    NAME: 3,
    PARAMETERS: 5,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
};
// const FIELD_PARAMETER_REGEXP = new RegExp(PARAMETER_DESCRIPTION + '^\[\\t \]*\(\\w+\)\(\\(\(\[^\\)\]+\)\\)\)\{0,1\}:\(\[\\w\\t \\[\\]!\]+\)\[\\t \]*\($|\[' + ENCODING_FLAG + '\\w \\t\]+$\)', 'gm')
//(\w+)[\t ]*:[\t ]*(\w+)[\t ]*([\w%]+)
// const FIELD_PARAMETER_REGEXP=new RegExp('\(\\w+\)\[\\t \]*:\[\\t \]*\(\\w+\)\[\\t \]*\(\[\\w%\]+\)','gm')
// (\s*"([^"]+)"\s*){0,1}[\t ]*(\w+)[\t ]*(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|[%\w \t]+$|[%\w \t]+,)
var FIELD_PARAMETER_REGEXP = new RegExp(PARAMETER_DESCRIPTION + '\[\\t \]*\(\\w+\)\[\\t \]*\(\\(\(\[^\\)\]+\)\\)\)\{0,1\}:\(\[\\w\\t \\[\\]!\]+\)\[\\t \]*\($|\[' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\w \\t\]+$|\[' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\w \\t\]+,\)', 'gm');
var FIELD_PARAMETER_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    NAME: 3,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
};
//(\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}union\s+(\w+)\s*([%\sA-Za-z0-9]*)\s*=\s*(\|{0,1}[|\w\s%]+\|\s*\w+[%\w\s]+)$
//(\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}union\s+(\w+)\s*([%\sA-Za-z0-9]*)\s*=\s*(\|{0,1}[|\w\s%]+\|\s*\w+[%\w\s]+)$
var UNION_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*\(extend\\s+\)\{0,1\}union\\s+\(\\w+\)\\s*\(\[' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\sA-Za-z0-9\]*\)\\s*=\\s*\(\\|\{0,1\}\[|\\w\\s' + graphql_directive_parser_js_1.ENCODING_FLAG + '\]+\\|\\s*\\w+\[' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\w\\s\]+\)$', 'gm');
var UNION_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5,
    UNION_ELEMENTS: 6
};
//(\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}scalar\s+(\w+)\s*([%A-Za-z0-9]*)$
var SCALAR_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*\(extend\\s+\)\{0,1\}scalar\\s+\(\\w+\)\\s*\(\[' + graphql_directive_parser_js_1.ENCODING_FLAG + 'A-Za-z0-9\]*\)$', 'gm');
var SCALAR_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5
};
//(\s*"""([^"]+)"""\s*){0,1}^\s*directive %\s*(\w+)\s*\({0,1}([\[\]%\s\w,:!]*)\){0,1}\s*on\s*([|\w\s]+\|\s*\w+|\s*\w+)
//CORRECT ONE
//(\s*"""([^"]+)"""\s*){0,1}^[\t ]*directive\s+[\t ]+([\w%\t ]+)[\t ]+on[\t ]*([\w\s|]*)$
// const DIRECTIVE_DEFINITION_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*directive ' + ENCODING_FLAG + '\\s*\(\\w+\)\\s*\\(\{0,1\}\(\[\\[\\]' + ENCODING_FLAG + '\\s\\w,:!\]*\)\\)\{0,1\}\\s*on\\s*\(\[|\\w\\s]+\\|\\s*\\w+|\\s*\\w+\)', 'gm')
var DIRECTIVE_DEFINITION_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\[\\t \]*directive\\s+\[\\t \]+\(\[\\w' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\t \]+\)\[\\t \]+on\[\\t \]*\(\[\\w\\s|\]*\)$', 'gm');
var DIRECTIVE_DEFINITION_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    DIRECTIVE: 3,
    DIRECTIVE_LOCATIONS: 4
};
//(\s*"""([^"]+)"""\s*){0,1}^[\t ]*directive\s+[\t ]+([\w%\t ]+)[\t ]+on[\t ]*$([\w\s|]*)$
//3=directives
//4 contents
//(\s*"""([^"]+)"""\s*){0,1}^[\t ]*directive\s+[\t ]+([\w%\t ]+)[\t ]+on[\t ]*$([\w\s|]*)$
var MULTILINE_DIRECTIVE_DEFINITION_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*directive ' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\s*\(\\w+\)\\s*\\(\{0,1\}\(\[\\[\\]' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\s\\w,:!\]*\)\\)\{0,1\}\\s*on\\s*\(\[|\\w\\s]+\\|\\s*\\w+|\\s*\\w+\)', 'gm');
var MULTILINE_DIRECTIVE_DEFINITION_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    DIRECTIVE: 3,
    DIRECTIVE_LOCATIONS: 4
};
//(\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}enum\s+(\w+){1}([%\s\w,:\(\)!\[\]]*){0,1}{([^}]+)}
var ENUM_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*\(extend\\s+\)\{0,1\}enum\\s+\(\\w+\)\{1\}\(\[' + graphql_directive_parser_js_1.ENCODING_FLAG + '\\s\\w,:\\(\\)!\\[\\]\]*\)\{0,1\}\{\(\[^\}\]+)\}', 'gm');
var ENUM_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5,
    ELEMENTS: 6
};
var getUnions = function (encodedDirectivesSchemaText, directiveProperties) {
    var unionMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(UNION_REGEXP)), false);
    var results = {};
    unionMatches.forEach(function (unionMatch) {
        var elements = {};
        unionMatch[UNION_REGEXP_GROUPS.UNION_ELEMENTS]
            .trim()
            .split('|')
            .map(function (line) { return line.trim(); })
            .filter(function (line) { return line.length > 0; })
            .forEach(function (element) { return elements[element] = new element_definition_js_1.UnionElement({ name: element }); });
        var directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(unionMatch[UNION_REGEXP_GROUPS.ENCODED_DIRECTIVES].trim(), directiveProperties);
        var isExtended = unionMatch[UNION_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? unionMatch[UNION_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : unionMatch[UNION_REGEXP_GROUPS.NAME];
        var description = unionMatch[UNION_REGEXP_GROUPS.DESCRIPTION] ? unionMatch[UNION_REGEXP_GROUPS.DESCRIPTION].trim() : unionMatch[UNION_REGEXP_GROUPS.DESCRIPTION];
        results[name] = {
            isExtended: isExtended,
            name: name,
            elements: elements,
            directives: directives,
            description: description
        };
    });
    return results;
};
exports.getUnions = getUnions;
var getScalars = function (encodedDirectivesSchemaText, directiveProperties) {
    var scalarMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(SCALAR_REGEXP)), false);
    var results = {};
    scalarMatches.forEach(function (scalarMatch) {
        var directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(scalarMatch[SCALAR_REGEXP_GROUPS.ENCODED_DIRECTIVES].trim(), directiveProperties);
        var description = scalarMatch[SCALAR_REGEXP_GROUPS.DESCRIPTION] ? scalarMatch[SCALAR_REGEXP_GROUPS.DESCRIPTION].trim() : scalarMatch[SCALAR_REGEXP_GROUPS.DESCRIPTION];
        var isExtended = scalarMatch[SCALAR_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? scalarMatch[SCALAR_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : scalarMatch[SCALAR_REGEXP_GROUPS.NAME];
        results[name] = {
            isExtended: isExtended,
            name: name,
            directives: directives,
            description: description
        };
    });
    return results;
};
exports.getScalars = getScalars;
var getDirectiveDefinitions = function (encodedDirectivesSchemaText, directiveProperties) {
    var directiveDefinitionMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(DIRECTIVE_DEFINITION_REGEXP)), false);
    var results = {};
    directiveDefinitionMatches.forEach(function (directiveDefinitionMatch) {
        var directiveId = directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DIRECTIVE].trim();
        var directive = directiveProperties[directiveId];
        var name = directive.name;
        var parameters = directive.parameters;
        var description = directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DESCRIPTION] ? directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DESCRIPTION].trim() : directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DESCRIPTION];
        var isExtended = false;
        var elements = {};
        directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DIRECTIVE_LOCATIONS]
            .split('|')
            .map(function (line) { return line.trim(); })
            .filter(function (line) { return line.length > 0; })
            .forEach(function (directiveLocationField) {
            try {
                elements[directiveLocationField] = new element_definition_js_1.DirectiveDefinitionElement({ name: directiveLocationField });
            }
            catch (e) {
                console.log(e);
            }
        });
        results[name] = {
            parameters: parameters,
            name: name,
            elements: elements,
            description: description,
            isExtended: isExtended
        };
    });
    return results;
};
exports.getDirectiveDefinitions = getDirectiveDefinitions;
//gets all fielded types
var getFieldedTypes = function (encodedDirectivesSchemaText, directiveProperties) {
    var typeMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(OBJECT_REGEXP)), false);
    typeMatches.forEach(function (typeMatch) { return delete typeMatch.input; });
    var results = {};
    var objectsResult = new component_js_1.NameIndex();
    var interfacesResult = new component_js_1.NameIndex();
    var inputsResult = new component_js_1.NameIndex();
    typeMatches.forEach(function (match) {
        var typeLabel = match[OBJECT_REGEXP_GROUPS.TYPE_LABEL];
        var type;
        var result;
        var encodedDirectives = match[OBJECT_REGEXP_GROUPS.ENCODED_DIRECTIVES];
        var isExtended = match[OBJECT_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? match[OBJECT_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : match[OBJECT_REGEXP_GROUPS.NAME];
        var interfaces = match[OBJECT_REGEXP_GROUPS.IMPLEMENTS];
        var rawTextFields = match[OBJECT_REGEXP_GROUPS.BODY];
        var description = match[OBJECT_REGEXP_GROUPS.DESCRIPTION] ? match[OBJECT_REGEXP_GROUPS.DESCRIPTION].trim() : match[OBJECT_REGEXP_GROUPS.DESCRIPTION];
        if (name && typeLabel && rawTextFields) {
            if (typeLabel === 'input') {
                result = new fielded_type_js_1.InputDefinition({ name: name, isExtended: isExtended });
                result.fields = getInputFieldProperties(rawTextFields, directiveProperties);
            }
            else if (typeLabel === 'interface') {
                result = new fielded_type_js_1.InterfaceDefinition({ name: name, isExtended: isExtended });
                result.fields = getInputFieldProperties(rawTextFields, directiveProperties);
            }
            else {
                var object = new fielded_type_js_1.ObjectDefinition({ name: name, isExtended: isExtended });
                if (interfaces && interfaces.length > 0) {
                    var implementations_1 = new component_js_1.NameIndex();
                    interfaces
                        .split('&')
                        .map(function (anInterface) { return anInterface.trim(); })
                        .filter(function (anInterface) { return anInterface.length > 0; })
                        .map(function (anInterface) { return new component_js_1.NamedComponent({ name: anInterface }); })
                        .forEach(function (interfaceComponent) { return implementations_1[interfaceComponent.name] = interfaceComponent; });
                    object.implements = implementations_1;
                }
                object.fields = getParameterFieldProperties(rawTextFields, directiveProperties);
                result = object;
            }
            if (description) {
                result.description = description.trim();
            }
            if (encodedDirectives) {
                result.directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(encodedDirectives, directiveProperties);
            }
            if (result instanceof fielded_type_js_1.ObjectDefinition) {
                objectsResult[result.name] = result;
            }
            else if (result instanceof fielded_type_js_1.InterfaceDefinition) {
                interfacesResult[result.name] = result;
            }
            else if (result instanceof fielded_type_js_1.InputDefinition) {
                inputsResult[result.name] = result;
            }
        }
    });
    results.objects = objectsResult;
    results.interfaces = interfacesResult;
    results.inputs = inputsResult;
    return results;
};
exports.getFieldedTypes = getFieldedTypes;
//parse text inside inside brackets of a field that has parameters
var getParameterProperties = function (rawParametersText, directiveProperties) {
    var matches = __spreadArray([], __read(rawParametersText.matchAll(FIELD_PARAMETER_REGEXP)), false);
    var results = {};
    matches
        .forEach(function (match) {
        var name = match[FIELD_PARAMETER_REGEXP_GROUPS.NAME];
        var type = match[FIELD_PARAMETER_REGEXP_GROUPS.TYPE];
        var directives = match[FIELD_PARAMETER_REGEXP_GROUPS.ENCODED_DIRECTIVES];
        var description = match[FIELD_PARAMETER_REGEXP_GROUPS.DESCRIPTION];
        if (name && type) {
            results[name] = new component_js_1.DescribableParameterComponent({ name: name, type: type });
            if (description) {
                results[name].description = description.trim();
            }
            if (directives) {
                results[name].directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(directives, directiveProperties);
            }
        }
    });
    return results;
};
//parses the field of a type definition
var getParameterFieldProperties = function (rawTextFields, directiveProperties) {
    var results = {};
    var matches = __spreadArray([], __read(rawTextFields.matchAll(FIELD_REGEXP)), false);
    matches
        .forEach(function (match) {
        var name = match[FIELD_REGEXP_GROUPS.NAME].trim();
        var type = match[FIELD_REGEXP_GROUPS.TYPE].trim();
        var directives = match[FIELD_REGEXP_GROUPS.ENCODED_DIRECTIVES];
        var parameters = match[FIELD_REGEXP_GROUPS.PARAMETERS];
        var description = match[FIELD_REGEXP_GROUPS.DESCRIPTION];
        if (name && type) {
            results[name] = new component_js_1.ParameterFieldDefinition({ name: name, type: type });
            if (description) {
                results[name].description = description.trim();
            }
            if (directives) {
                results[name].directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(directives, directiveProperties);
            }
            if (parameters) {
                results[name].parameters = getParameterProperties(parameters, directiveProperties);
                console.log('parametersparametersparameters', parameters);
            }
        }
    });
    return results;
};
//parses the field of a type definition
var getInputFieldProperties = function (rawTextFields, directiveProperties) {
    var results = {};
    var matches = __spreadArray([], __read(rawTextFields.matchAll(FIELD_REGEXP)), false);
    matches
        .forEach(function (match) {
        var name = match[FIELD_REGEXP_GROUPS.NAME];
        var type = match[FIELD_REGEXP_GROUPS.TYPE];
        var directives = match[FIELD_REGEXP_GROUPS.ENCODED_DIRECTIVES];
        var description = match[FIELD_REGEXP_GROUPS.DESCRIPTION];
        if (name && type) {
            results[name] = new component_js_1.InputFieldDefinition({ name: name, type: type });
            if (description) {
                results[name].description = description.trim();
            }
            if (directives) {
                results[name].directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(directives, directiveProperties);
            }
        }
    });
    return results;
};
// if(type==='inputs'){
//     results[type]![name].fields = getInputFieldProperties(rawTextFields,directiveProperties)
// }else{
//     results[type]![name].fields = getParameterFieldProperties(rawTextFields,directiveProperties)
// }
var getEnums = function (encodedDirectivesSchemaText, directiveProperties) {
    var results = new component_js_1.NameIndex();
    var enumMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(ENUM_REGEXP)), false);
    enumMatches.forEach(function (typeMatch) { return delete typeMatch.input; });
    enumMatches.forEach(function (match) {
        var isExtended = match[ENUM_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? match[ENUM_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : match[ENUM_REGEXP_GROUPS.NAME];
        var directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(match[ENUM_REGEXP_GROUPS.ENCODED_DIRECTIVES], directiveProperties);
        var elements = getEnumElements(match[ENUM_REGEXP_GROUPS.ELEMENTS], directiveProperties);
        var description = match[ENUM_REGEXP_GROUPS.DESCRIPTION] ? match[ENUM_REGEXP_GROUPS.DESCRIPTION].trim() : match[ENUM_REGEXP_GROUPS.DESCRIPTION];
        results[name] = {
            name: name,
            isExtended: isExtended,
            directives: directives,
            elements: elements,
            description: description
        };
    });
    return results;
};
exports.getEnums = getEnums;
var getEnumElements = function (rawEnumValuesText, directiveProperties) {
    var results = new component_js_1.NameIndex();
    rawEnumValuesText
        .split('\n')
        .filter(function (line) { return line.length > 0; })
        .map(function (line) { return line.trim(); })
        .forEach(function (line) {
        var name = line.includes(graphql_directive_parser_js_1.ENCODING_FLAG) ? (line.split(graphql_directive_parser_js_1.ENCODING_FLAG))[0].trim() : line.trim();
        var directives = (0, graphql_directive_parser_js_1.getDirectiveProperties)(line, directiveProperties);
        results[name] = {
            name: name,
            directives: directives
        };
    });
    return results;
};
