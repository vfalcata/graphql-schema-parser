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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnions = exports.getScalars = exports.getDirectiveDefinitions = exports.getFieldedTypes = exports.getEnums = void 0;
var component_1 = require("../typedefs/component");
var element_definition_1 = require("../typedefs/element-definition");
var fielded_type_1 = require("../typedefs/fielded-type");
var graphql_directive_parser_1 = require("./graphql-directive-parser");
/************************************************START OF ALL REGEXP COMPONENTS************************************************/
/*All regexp components must have match groups according to the group that has the same name with suffix "_GROUPS"

/* Suffix used to denote a type that has been extended. Since extended objects do not have their own unique name, to avoid clashing key names, this suffix was requried*/
var EXTENSION_NAME_SUFFIX = '_isExtended_';
/* Regexp that is reused for matching field descriptions */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"""([^"]+)"""\s*){0,1} */
var FIELD_DESCRIPTION = '\(\\s*"""\(\[^"\]+\)"""\\s*\)\{0,1\}';
/* Regexp that is reused for matching field parameter descriptions */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"([^"]+)"\s*){0,1} */
var PARAMETER_DESCRIPTION = '\(\\s*"\(\[^"\]+\)"\\s*\)\{0,1\}';
/* Regexp that is used for matching fielded objects such as an object, interface or input */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"""([^"]+)"""\s*){0,1}^(extend\s+){0,1}(type|interface|input){1}\s+(\w+){1}(\s+implements\s+){0,1}([\s\w&]*)([\s0-9a-zA-Z%]*){0,1}{([^}]+)} */
var OBJECT_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\(extend\\s+\)\{0,1\}\(type|interface|input\)\{1\}\\s+\(\\w+\)\{1\}\(\\s+implements\\s+\)\{0,1\}\(\[\\s\\w&\]*\)\(\[\\s0-9a-zA-Z' + graphql_directive_parser_1.ENCODING_FLAG + '\]*\)\{0,1\}\{\(\[^\}\]+\)\}', 'gm');
/* Group numbers OBJECT_REGEXP for matches */
var OBJECT_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    TYPE_LABEL: 4,
    NAME: 5,
    IMPLEMENTS_TAG: 6,
    IMPLEMENTS: 7,
    ENCODED_DIRECTIVES: 8,
    BODY: 9,
};
/* Regexp that is used for matching the raw text of the fields of a fielded type such as an object, input or interface */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"""([^"]+)"""\s*){0,1}^[\t ]*(\w+)(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|[%\w \t]+$) */
var FIELD_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\[\\t \]*\(\\w+\)\(\\(\(\[^\\)\]+\)\\)\)\{0,1\}:\(\[\\w\\t \\[\\]!\]+\)\[\\t \]*\($|\[' + graphql_directive_parser_1.ENCODING_FLAG + '\\w \\t\]+$\)', 'gm');
/* Group numbers FIELD_REGEXP for matches */
var FIELD_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    NAME: 3,
    PARAMETERS: 5,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
};
/* Regexp that is used for matching an the parameters inside the brackets of a field that can contain parameters belonging to a fielded type such as an object or interface  */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"([^"]+)"\s*){0,1}[\t ]*(\w+)[\t ]*(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|[%\w \t]+$|[%\w \t]*,|$) */
var FIELD_PARAMETER_REGEXP = new RegExp(PARAMETER_DESCRIPTION + '\[\\t \]*\(\\w+\)\[\\t \]*\(\\(\(\[^\\)\]+\)\\)\)\{0,1\}:\(\[\\w\\t \\[\\]!\]+\)\[\\t \]*\($|\[' + graphql_directive_parser_1.ENCODING_FLAG + '\\w \\t\]+$|\[' + graphql_directive_parser_1.ENCODING_FLAG + '\\w \\t\]*,|$\)', 'gm');
/* Group numbers FIELD_PARAMETER_REGEXP for matches */
var FIELD_PARAMETER_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    NAME: 3,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
};
/* Regexp that is used for matching a union type */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}union\s+(\w+)\s*([%\sA-Za-z0-9]*)\s*=\s*(\|{0,1}[|\w\s%]+\|\s*\w+[%\w\s]+)$ */
var UNION_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*\(extend\\s+\)\{0,1\}union\\s+\(\\w+\)\\s*\(\[' + graphql_directive_parser_1.ENCODING_FLAG + '\\sA-Za-z0-9\]*\)\\s*=\\s*\(\\|\{0,1\}\[|\\w\\s' + graphql_directive_parser_1.ENCODING_FLAG + '\]+\\|\\s*\\w+\[' + graphql_directive_parser_1.ENCODING_FLAG + '\\w\\s\]+\)$', 'gm');
/* Group numbers UNION_REGEXP for matches */
var UNION_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5,
    UNION_ELEMENTS: 6,
};
/* Regexp that is used for matching a scalar type */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}scalar\s+(\w+)\s*([%A-Za-z0-9]*)$ */
var SCALAR_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*\(extend\\s+\)\{0,1\}scalar\\s+\(\\w+\)\\s*\(\[' + graphql_directive_parser_1.ENCODING_FLAG + 'A-Za-z0-9\]*\)$', 'gm');
/* Group numbers SCALAR_REGEXP for matches */
var SCALAR_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5
};
/* Regexp that is used for matching a directive definition type */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"""([^"]+)"""\s*){0,1}^[\t ]*directive\s+[\t ]+([\w%\t ]+)[\t ]+on[\t ]*([\w\s|]*)$ */
var DIRECTIVE_DEFINITION_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\[\\t \]*directive\\s+\[\\t \]+\(\[\\w' + graphql_directive_parser_1.ENCODING_FLAG + '\\t \]+\)\[\\t \]+on\[\\t \]*\(\[\\w\\s|\]*\)$', 'gm');
/* Group numbers DIRECTIVE_DEFINITION_REGEXP for matches */
var DIRECTIVE_DEFINITION_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    DIRECTIVE: 3,
    DIRECTIVE_LOCATIONS: 4
};
/* Regexp that is used for matching enum type */
/* Unescaped Regexp, useful for debugging*/
/* (\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}enum\s+(\w+){1}([%\s\w,:\(\)!\[\]]*){0,1}{([^}]+)} */
var ENUM_REGEXP = new RegExp(FIELD_DESCRIPTION + '^\\s*\(extend\\s+\)\{0,1\}enum\\s+\(\\w+\)\{1\}\(\[' + graphql_directive_parser_1.ENCODING_FLAG + '\\s\\w,:\\(\\)!\\[\\]\]*\)\{0,1\}\{\(\[^\}\]+)\}', 'gm');
/* Group numbers ENUM_REGEXP for matches */
var ENUM_REGEXP_GROUPS = {
    DESCRIPTION: 2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5,
    ELEMENTS: 6
};
/************************************************END OF ALL REGEXP COMPONENTS************************************************/
/**
 * parses an encoded schema text and build all union types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all unions in the schema
 */
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
            .forEach(function (element) { return elements[element] = new element_definition_1.UnionElement({ name: element }); });
        var directives = (0, graphql_directive_parser_1.getDirectiveProperties)(unionMatch[UNION_REGEXP_GROUPS.ENCODED_DIRECTIVES].trim(), directiveProperties);
        var isExtended = unionMatch[UNION_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? unionMatch[UNION_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : unionMatch[UNION_REGEXP_GROUPS.NAME];
        var description = unionMatch[UNION_REGEXP_GROUPS.DESCRIPTION] ? unionMatch[UNION_REGEXP_GROUPS.DESCRIPTION].trim() : unionMatch[UNION_REGEXP_GROUPS.DESCRIPTION];
        results[name] = { isExtended: isExtended, name: name, elements: elements };
        if (directives) {
            results[name].directives = directives;
        }
        if (description) {
            results[name].description = description;
        }
    });
    return results;
};
exports.getUnions = getUnions;
/**
 * parses an encoded schema text and build all union types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all scalars in the schema
 */
var getScalars = function (encodedDirectivesSchemaText, directiveProperties) {
    var scalarMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(SCALAR_REGEXP)), false);
    var results = {};
    scalarMatches.forEach(function (scalarMatch) {
        var directives = (0, graphql_directive_parser_1.getDirectiveProperties)(scalarMatch[SCALAR_REGEXP_GROUPS.ENCODED_DIRECTIVES].trim(), directiveProperties);
        var description = scalarMatch[SCALAR_REGEXP_GROUPS.DESCRIPTION] ? scalarMatch[SCALAR_REGEXP_GROUPS.DESCRIPTION].trim() : scalarMatch[SCALAR_REGEXP_GROUPS.DESCRIPTION];
        var isExtended = scalarMatch[SCALAR_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? scalarMatch[SCALAR_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : scalarMatch[SCALAR_REGEXP_GROUPS.NAME];
        results[name] = { name: name, isExtended: isExtended };
        if (directives) {
            results[name].directives = directives;
        }
        if (description) {
            results[name].description = description;
        }
    });
    return results;
};
exports.getScalars = getScalars;
/**
 * parses an encoded schema text and build all directive definition types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all directive definitions in the schema
 */
var getDirectiveDefinitions = function (encodedDirectivesSchemaText, directiveProperties) {
    var directiveDefinitionMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(DIRECTIVE_DEFINITION_REGEXP)), false);
    var results = {};
    directiveDefinitionMatches.forEach(function (directiveDefinitionMatch) {
        var directiveId = directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DIRECTIVE].trim();
        var directive = directiveProperties[directiveId];
        var name = directive.name;
        var parameters = directive.parameters;
        var description = directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DESCRIPTION];
        var isExtended = false;
        var elements = {};
        directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DIRECTIVE_LOCATIONS]
            .split('|')
            .map(function (line) { return line.trim(); })
            .filter(function (line) { return line.length > 0; })
            .forEach(function (directiveLocationField) {
            try {
                elements[directiveLocationField] = new element_definition_1.DirectiveDefinitionElement({ name: directiveLocationField });
            }
            catch (e) {
                console.log(e);
            }
        });
        results[name] = { name: name, elements: elements, isExtended: isExtended };
        if (description) {
            results[name].description = description.trim();
        }
        if (parameters) {
            results[name].parameters = parameters;
        }
    });
    return results;
};
exports.getDirectiveDefinitions = getDirectiveDefinitions;
/**
 * parses an encoded schema text and build all types which contain fields which are: object, inputs and interface types and returns a NameIndex of them.
 * Since the regex is so similar between the three all of the parsing was done on this function.
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all fielded types which are objects, interfaces and inputs in the schema
 */
var getFieldedTypes = function (encodedDirectivesSchemaText, directiveProperties) {
    var typeMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(OBJECT_REGEXP)), false);
    typeMatches.forEach(function (typeMatch) { return delete typeMatch.input; });
    var results = {};
    var objectsResult = new component_1.NameIndex();
    var interfacesResult = new component_1.NameIndex();
    var inputsResult = new component_1.NameIndex();
    typeMatches.forEach(function (match) {
        var typeLabel = match[OBJECT_REGEXP_GROUPS.TYPE_LABEL];
        var type;
        var result;
        var encodedDirectives = match[OBJECT_REGEXP_GROUPS.ENCODED_DIRECTIVES];
        var isExtended = match[OBJECT_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? match[OBJECT_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : match[OBJECT_REGEXP_GROUPS.NAME];
        var interfaces = match[OBJECT_REGEXP_GROUPS.IMPLEMENTS];
        var rawTextFields = match[OBJECT_REGEXP_GROUPS.BODY];
        var description = match[OBJECT_REGEXP_GROUPS.DESCRIPTION];
        if (name && typeLabel && rawTextFields) {
            if (typeLabel === 'input') {
                result = new fielded_type_1.InputDefinition({ name: name, isExtended: isExtended });
                result.fields = getInputFieldProperties(rawTextFields, directiveProperties);
            }
            else if (typeLabel === 'interface') {
                result = new fielded_type_1.InterfaceDefinition({ name: name, isExtended: isExtended });
                result.fields = getParameterFieldProperties(rawTextFields, directiveProperties);
            }
            else {
                var object = new fielded_type_1.ObjectDefinition({ name: name, isExtended: isExtended });
                if (interfaces && interfaces.length > 0) {
                    var implementations_1 = new component_1.NameIndex();
                    interfaces
                        .split('&')
                        .map(function (anInterface) { return anInterface.trim(); })
                        .filter(function (anInterface) { return anInterface.length > 0; })
                        .map(function (anInterface) { return new component_1.NamedComponent({ name: anInterface }); })
                        .forEach(function (interfaceComponent) { return implementations_1[interfaceComponent.name] = interfaceComponent; });
                    if (Object.keys(implementations_1).length > 0) {
                        object.implements = implementations_1;
                    }
                }
                var fields = getParameterFieldProperties(rawTextFields, directiveProperties);
                if (Object.keys(fields).length > 0) {
                    object.fields = fields;
                }
                result = object;
            }
            if (description) {
                result.description = description.trim();
            }
            if (encodedDirectives) {
                result.directives = (0, graphql_directive_parser_1.getDirectiveProperties)(encodedDirectives, directiveProperties);
            }
            if (result instanceof fielded_type_1.ObjectDefinition) {
                objectsResult[result.name] = result;
            }
            else if (result instanceof fielded_type_1.InterfaceDefinition) {
                interfacesResult[result.name] = result;
            }
            else if (result instanceof fielded_type_1.InputDefinition) {
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
/**
 * parses an FIELD_REGEXP_GROUPS.PARAMETERS which is the text inside the parameter brackets of a field (for an object or interface type), parses them and creates an index of
 * these parameter objects. These parameters can also have descriptions
 * @param rawParametersText the text string inside the parameters brackets of a field (that can contain parameters, which are objects and interfaces)
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all parameters of a field from a type in the schema
 */
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
            results[name] = new component_1.DescribableParameterComponent({ name: name, type: type });
            if (description) {
                results[name].description = description.trim();
            }
            if (directives) {
                results[name].directives = (0, graphql_directive_parser_1.getDirectiveProperties)(directives, directiveProperties);
            }
        }
    });
    return results;
};
/**
 * parses an OBJECT_REGEXP_GROUPS.BODY which is the fields of an object or interface type as text and build all fields returns a NameIndex of them. These fields have optional parameters
 * @param rawTextFields the text string of all the fields that can have parameters of an individual type from the schema, these types are objects and interfaces
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all fields of a types from the schema that can contain parameters in their fields
 */
var getParameterFieldProperties = function (rawTextFields, directiveProperties) {
    var results = new component_1.NameIndex();
    var matches = __spreadArray([], __read(rawTextFields.matchAll(FIELD_REGEXP)), false);
    matches
        .forEach(function (match) {
        var name = match[FIELD_REGEXP_GROUPS.NAME].trim();
        var type = match[FIELD_REGEXP_GROUPS.TYPE].trim();
        var directives = match[FIELD_REGEXP_GROUPS.ENCODED_DIRECTIVES];
        var parameters = match[FIELD_REGEXP_GROUPS.PARAMETERS];
        var description = match[FIELD_REGEXP_GROUPS.DESCRIPTION];
        if (name && type) {
            results[name] = { name: name, type: type };
            if (description && description.length > 0) {
                results[name].description = description.trim();
            }
            if (directives && directives.length > 0) {
                results[name].directives = (0, graphql_directive_parser_1.getDirectiveProperties)(directives, directiveProperties);
            }
            if (parameters && parameters.length > 0) {
                results[name].parameters = getParameterProperties(parameters, directiveProperties);
            }
        }
    });
    return results;
};
/**
 * parses an OBJECT_REGEXP_GROUPS.BODY which is the fields of an input type as text and builds all fields returns a NameIndex of them. These fields cannot have parameters
 * @param rawTextFields the text string of all the fields that CANNOT have parameters of an individual type from the schema, these types are inputs
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all fields of a types from the schema that CANNOT contain parameters in their fields, these types are inputs
 */
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
            results[name] = { name: name, type: type };
            if (description && description.length > 0) {
                results[name].description = description.trim();
            }
            if (directives && directives.length > 0) {
                results[name].directives = (0, graphql_directive_parser_1.getDirectiveProperties)(directives, directiveProperties);
            }
        }
    });
    return results;
};
/**
 * parses an encoded schema text and build all enum types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all enums in the schema
 */
var getEnums = function (encodedDirectivesSchemaText, directiveProperties) {
    var results = new component_1.NameIndex();
    var enumMatches = __spreadArray([], __read(encodedDirectivesSchemaText.matchAll(ENUM_REGEXP)), false);
    enumMatches.forEach(function (typeMatch) { return delete typeMatch.input; });
    enumMatches.forEach(function (match) {
        var isExtended = match[ENUM_REGEXP_GROUPS.EXTENDS_TAG] ? true : false;
        var name = isExtended ? match[ENUM_REGEXP_GROUPS.NAME] + EXTENSION_NAME_SUFFIX : match[ENUM_REGEXP_GROUPS.NAME];
        var directives = match[ENUM_REGEXP_GROUPS.ENCODED_DIRECTIVES];
        var elements = getEnumElements(match[ENUM_REGEXP_GROUPS.ELEMENTS], directiveProperties);
        var description = match[ENUM_REGEXP_GROUPS.DESCRIPTION] ? match[ENUM_REGEXP_GROUPS.DESCRIPTION].trim() : match[ENUM_REGEXP_GROUPS.DESCRIPTION];
        if (name && Object.keys(elements).length > 0) {
            results[name] = { name: name, elements: elements, isExtended: isExtended };
            if (description && description.length > 0) {
                results[name].description = description.trim();
            }
            if (directives && directives.length > 0) {
                results[name].directives = (0, graphql_directive_parser_1.getDirectiveProperties)(directives, directiveProperties);
            }
        }
    });
    return results;
};
exports.getEnums = getEnums;
/**
 * parses ENUM_REGEXP_GROUPS.ELEMENTS encoded schema text and build all union elements and returns a NameIndex of them
 * @param rawEnumValuesText the text string of a the elements listed in an enum
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all enum elements belonging to an enum in the schema
 */
var getEnumElements = function (rawEnumValuesText, directiveProperties) {
    var results = new component_1.NameIndex();
    rawEnumValuesText
        .split('\n')
        .filter(function (line) { return line.length > 0; })
        .map(function (line) { return line.trim(); })
        .forEach(function (line) {
        var name = line.includes(graphql_directive_parser_1.ENCODING_FLAG) ? (line.split(graphql_directive_parser_1.ENCODING_FLAG))[0].trim() : line.trim();
        results[name] = { name: name };
        if (line.includes(graphql_directive_parser_1.ENCODING_FLAG)) {
            var directives = (0, graphql_directive_parser_1.getDirectiveProperties)(line, directiveProperties);
            if (Object.keys(directives).length > 0) {
                results[name].directives = directives;
            }
        }
    });
    return results;
};
