"use strict";
//Since directives can be nested in their parameters, and also since node does have native support for recursion or varible length look around, 
//directives will have to be parsed separaetely in its own object, and the schemaText must be encoded so that it is simple to use regexp
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
exports.ENCODED_DIRECTIVE_REGEXP_GROUPS = exports.ENCODED_DIRECTIVE_REGEXP = exports.ENCODING_FLAG = exports.getDirectiveProperties = exports.parseDirectives = void 0;
var crypto_1 = require("crypto");
var component_1 = require("../typedefs/component");
var ENCODING_FLAG = '%';
exports.ENCODING_FLAG = ENCODING_FLAG;
var ENCODED_ID_BYTE_LENGTH = 6;
// const DIRECTIVE_NO_PARAMETER_REGEXP=/@(\w+)(\s*[,\)\s=\{])/g
var DIRECTIVE_NO_PARAMETER_REGEXP = new RegExp('@\(\\w+\)\(\\s*\[,\\)\\s=\\{\])', 'g'); //g
var DIRECTIVE_NO_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    TAIL: 2
};
var generateDirectiveId = function (height) {
    return ENCODING_FLAG.repeat(height) + ENCODING_FLAG + (0, crypto_1.randomBytes)(ENCODED_ID_BYTE_LENGTH).toString('hex') + ENCODING_FLAG + ENCODING_FLAG.repeat(height);
};
// const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP=/@(\w*)\s*\(\s*([\w\s:\[\]!,]+)\)(\s*)/g
//@(\w*)\s*\(\s*([\w\s:\[\]!,]+)\)(\s*)
var DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP = new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:\\[\\]!,\]+\)\\)\(\\s*\)', 'g'); //g
var DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    PARAMETERS: 2,
    TAIL: 3
};
// const DIRECTIVE_WITH_PARAMETER_REGEXP=/@(\w*)\s*\(\s*([\w\s:#\[\]!,]+)\)(\s*)/g
//@(\w*)\s*\(\s*([\w\s:%\[\]!,]+)\)(\s*)
var DIRECTIVE_WITH_PARAMETER_REGEXP = new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:' + ENCODING_FLAG + '\\[\\]!,\]+\)\\)\(\\s*\)', 'g');
var DIRECTIVE_WITH_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    PARAMETERS: 2,
    TAIL: 3
};
//%+[0-9A-Za-z]%+
var ENCODED_DIRECTIVE_REGEXP = new RegExp(ENCODING_FLAG + '+\[0-9A-Za-z\]+' + ENCODING_FLAG + '+', 'gm');
exports.ENCODED_DIRECTIVE_REGEXP = ENCODED_DIRECTIVE_REGEXP;
var ENCODED_DIRECTIVE_REGEXP_GROUPS = {
    FULL_MATCH: 0
};
exports.ENCODED_DIRECTIVE_REGEXP_GROUPS = ENCODED_DIRECTIVE_REGEXP_GROUPS;
//parses component with annotated encoded directive annotations, and gets them from directtive properties a compiles them and returns them
var getDirectiveProperties = function (encodedDirectiveComponent, directivesProperties) {
    var result = new component_1.NameIndex();
    if (!encodedDirectiveComponent || encodedDirectiveComponent.length < 1 || !encodedDirectiveComponent.includes(ENCODING_FLAG)) {
        return result;
    }
    var encodedDirectiveMatches = __spreadArray([], __read(encodedDirectiveComponent.matchAll(ENCODED_DIRECTIVE_REGEXP)), false).map(function (match) { return match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH]; });
    encodedDirectiveMatches.forEach(function (directiveId) {
        var directiveName = directivesProperties[directiveId].name;
        result[directiveName] = directivesProperties[directiveId];
    });
    return result;
};
exports.getDirectiveProperties = getDirectiveProperties;
// encodedDirectivesSchemaText, directivesProperties
//height 0 = directive no params
//height 1 = directive with non directive params
//height 1+ = directive with params that have directives
var parseDirectives = function (rawGraphQLSchemaText) {
    var directiveProperties = new component_1.NameIndex();
    var encodedDirectivesSchemaText = rawGraphQLSchemaText;
    var height = 0;
    var curretRegExp = DIRECTIVE_NO_PARAMETER_REGEXP;
    while (encodedDirectivesSchemaText.match(DIRECTIVE_WITH_PARAMETER_REGEXP) || encodedDirectivesSchemaText.match(DIRECTIVE_NO_PARAMETER_REGEXP)) {
        if (height === 1) {
            curretRegExp = DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP;
        }
        else if (height > 1) {
            curretRegExp = DIRECTIVE_WITH_PARAMETER_REGEXP;
        }
        encodedDirectivesSchemaText = encodedDirectivesSchemaText.replace(curretRegExp, function (match, p1, p2, p3) {
            var directiveId = generateDirectiveId(height);
            var name = p1;
            var tailGroup = p2;
            var parameters;
            if (height > 0) {
                tailGroup = p3;
                parameters = getDirectiveParameters(p2, directiveProperties);
            }
            directiveProperties[directiveId] = {
                name: name,
                height: height,
                parameters: parameters
            };
            return " " + directiveId + tailGroup;
        });
        height++;
    }
    return {
        encodedDirectivesSchemaText: encodedDirectivesSchemaText,
        directiveProperties: directiveProperties
    };
};
exports.parseDirectives = parseDirectives;
//parses parameters inside directives, pull encoded directives from directiveProperties, and deletes ones that have been used
var getDirectiveParameters = function (rawParametersFieldText, directivesProperties) {
    var directiveParameters = new component_1.NameIndex();
    rawParametersFieldText.split(',').map(function (line) { return line.trim(); }).filter(function (line) { return line.length > 0; }).forEach(function (parameter) {
        var parameterName = parameter.split(':')[0].trim();
        var parameterType = parameter.split(':')[1];
        var directivesForParameter = __spreadArray([], __read(parameter.matchAll(ENCODED_DIRECTIVE_REGEXP)), false).map(function (match) { return match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH].trim(); });
        directiveParameters[parameterName] = new component_1.ParameterComponent({
            name: parameterName,
            type: parameterType
        });
        var directives;
        directivesForParameter.forEach(function (parameterDirectiveId) {
            if (!directiveParameters[parameterName].directives) {
                directiveParameters[parameterName].directives = new component_1.NameIndex();
            }
            var directive = directivesProperties[parameterDirectiveId];
            directiveParameters[parameterName].type = parameterType.replace(parameterDirectiveId, '').trim();
            directiveParameters[parameterName].directives[directive.name] = directive;
            delete directivesProperties[parameterDirectiveId];
        });
    });
    return directiveParameters;
};
