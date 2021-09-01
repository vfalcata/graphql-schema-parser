/* The current 2018 GraphQL spec allows directives to be nested in their parameters, and also since node does not have native support for recursion or varible length look around, The directives
 * are parsed and the raw schema text is encoded replacing directive annotions by a unique id, to easily be parsed and recalled from id index of directive annotations.
*/

import { randomBytes } from 'crypto'
import { DirectiveAnnotation, ParameterComponent, NameIndex } from '../typedefs/component'

/* character that denotes a encoded directive annotation */
const ENCODING_FLAG = '%'
const ENCODED_ID_BYTE_LENGTH = 6

/************************************************START OF ALL REGEXP COMPONENTS************************************************/
/*All regexp components must have match groups according to the group that has the same name with suffix "_GROUPS"
/*in this particular file not all the regex group const are used, but the regexp still must adhere to the group numberings

/* Regexp that captures directives with no parameters */
/* Unescaped Regex, useful for debugging*/
/* @(\w+)(\s*[,\)\s=\{]) */
const DIRECTIVE_NO_PARAMETER_REGEXP = new RegExp('@\(\\w+\)\(\\s*\[,\\)\\s=\\{\])', 'g')//g
/* Group numbers DIRECTIVE_NO_PARAMETER_REGEXP for matches, Note that although these groups are not explicitly used, the regexp MUST follow the group numbering order */
const DIRECTIVE_NO_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    TAIL: 2
}

const generateDirectiveId = (height: number): string => {
    return ENCODING_FLAG.repeat(height) + ENCODING_FLAG + randomBytes(ENCODED_ID_BYTE_LENGTH).toString('hex') + ENCODING_FLAG + ENCODING_FLAG.repeat(height)
}

/* Regexp that captures all directiveds that have simple parameters that do not have any directive annotations */
/* Unescaped Regexp, useful for debugging*/
/* @(\w*)\s*\(\s*([\w\s:\[\]!,]+)\)(\s*) */
const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP = new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:\\[\\]!,\]+\)\\)\(\\s*\)', 'g')//g
/* Group numbers DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP for matches, Note that although these groups are not explicitly used, the regexp MUST follow the group numbering order */
const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    PARAMETERS: 2,
    TAIL: 3
}

/* Regexp that captures any directives with parameters, regardless if they are annotated or not */
/* Unescaped Regexp, useful for debugging*/
/* @(\w*)\s*\(\s*([\w\s:%\[\]!,]+)\)(\s*) */
const DIRECTIVE_WITH_PARAMETER_REGEXP = new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:' + ENCODING_FLAG + '\\[\\]!,\]+\)\\)\(\\s*\)', 'g');
/* Group numbers DIRECTIVE_WITH_PARAMETER_REGEXP for matches, Note that although these groups are not explicitly used, the regexp MUST follow the group numbering order */
const DIRECTIVE_WITH_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    PARAMETERS: 2,
    TAIL: 3
}

/* Regexp that captures any all encoded directives, the encoding should be availble on some data structure in order to reference the actual directive itself when building the schema object */
/* Unescaped Regexp, useful for debugging*/
/* %+[0-9A-Za-z]%+ */
const ENCODED_DIRECTIVE_REGEXP = new RegExp(ENCODING_FLAG + '+\[0-9A-Za-z\]+' + ENCODING_FLAG + '+', 'gm')
const ENCODED_DIRECTIVE_REGEXP_GROUPS = {
    FULL_MATCH: 0,
}

/************************************************END OF ALL REGEXP COMPONENTS************************************************/

/**
 * parses any text component match that has encoded directives, matches the id to the some data structure to get the actual directive, and returns a name index of all the directives annotated on this component.
 * Useful for outside modules to call and compile a complete directive annotation object.
 * @param encodedDirectiveComponent text of a component group that has an encoded directive annotation
 * @param directivesProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all directive annotations that annotated some component in the schema
 */
const getDirectiveProperties = (encodedDirectiveComponent: string, directivesProperties: NameIndex<DirectiveAnnotation>): NameIndex<DirectiveAnnotation> => {
    let result = new NameIndex<DirectiveAnnotation>();
    if (!encodedDirectiveComponent || encodedDirectiveComponent.length < 1 || !encodedDirectiveComponent.includes(ENCODING_FLAG)) {
        return result;
    }
    const encodedDirectiveMatches = [...encodedDirectiveComponent.matchAll(ENCODED_DIRECTIVE_REGEXP)].map(match => match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH])
    encodedDirectiveMatches.forEach((directiveId) => {
        const directiveName = directivesProperties[directiveId].name
        result[directiveName] = directivesProperties[directiveId]
    })
    return result
}

/**
 * parses the raw GraphQL schema text and encodes all directives. Starts at the least nested directives, and works up one level of nesting each iteration.
 * Each iteration the schema text will be encoded as per the id of the directive it is encoded. This function also build a index of all directive id's that annotate any graphql schema component.
 * This index will only contain root encoded directives, all nexted directives will exist as properties within the directive object itself.
 * heigt levels and correspondance with nesting
 * height 0 = directive annotation with no parameters
 * height 1 = directive annotation with parameters that DO NOT have any directive annotations
 * height 1+ = directive annotation with parameters that have directives annotation. Each additional number in height refers to how nested the directive is.
 * @param rawGraphQLSchemaText the raw GraphQL schema text passed in as a string
 * @returns an encoded version of the the raw GraphQL schema text, that encodes all the root level directive annotations in the original text. all root directives are in the directiveProperties, if a root directive had
 * a nested directive annotation it will be contained inside its properties as well
 */
const parseDirectives = (rawGraphQLSchemaText: string): { encodedDirectivesSchemaText: string, directiveProperties: NameIndex<DirectiveAnnotation> } => {
    let directiveProperties = new NameIndex<DirectiveAnnotation>()
    let encodedDirectivesSchemaText = rawGraphQLSchemaText
    let height = 0
    let curretRegExp = DIRECTIVE_NO_PARAMETER_REGEXP
    while (encodedDirectivesSchemaText.match(DIRECTIVE_WITH_PARAMETER_REGEXP) || encodedDirectivesSchemaText.match(DIRECTIVE_NO_PARAMETER_REGEXP)) {
        if (height === 1) {
            curretRegExp = DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP

        } else if (height > 1) {
            curretRegExp = DIRECTIVE_WITH_PARAMETER_REGEXP
        }
        encodedDirectivesSchemaText = encodedDirectivesSchemaText.replace(curretRegExp, (match, p1, p2, p3) => {
            const directiveId = generateDirectiveId(height)
            let name = p1
            directiveProperties[directiveId] = { name };
            let tailGroup = p2
            let parameters;
            if (height > 0) {
                tailGroup = p3
                parameters = getDirectiveParameters(p2, directiveProperties)
            }
            if (parameters) {
                directiveProperties[directiveId].parameters = parameters
            }
            if (name) {
                directiveProperties[directiveId].name = name
            }
            if (height) {
                directiveProperties[directiveId].height = height
            }
            return ` ${directiveId}${tailGroup}`;
        })
        height++;
    }

    return {
        encodedDirectivesSchemaText, directiveProperties
    }
}

/**
 * parses parameters text inside the brackets of a directive annotation, pulls encoded directives from directiveProperties, and deletes ones that have been used as a nested directive, implies
 * that it is not a root directive, and thus should not be on the datastructure of directive properties that only contain root directives
 * ***SIDE EFFECTS**: This function MAY CHANGE the input directivesProperties.This function will delete all NON ROOT directive annotations, from the input directiveProperties as it stitches them on to higher level directives it is nested inside, and adds newly parsed root directives
 * @param rawParametersFieldText the raw text insides a directives parameters (text inside the bracket only)
 * @param directivesProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all the parameters that a directive annotation contains
 */
const getDirectiveParameters = (rawParametersFieldText: string, directivesProperties: NameIndex<DirectiveAnnotation>): NameIndex<ParameterComponent> => {
    let directiveParameters = new NameIndex<ParameterComponent>();
    rawParametersFieldText.split(',').map(line => line.trim()).filter(line => line.length > 0).forEach((parameter) => {
        const parameterName = parameter.split(':')[0].trim()
        let parameterType = parameter.split(':')[1]
        const directivesForParameter = [...parameter.matchAll(ENCODED_DIRECTIVE_REGEXP)].map(match => match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH].trim());
        directiveParameters[parameterName] = new ParameterComponent({
            name: parameterName,
            type: parameterType
        })
        // let directives: NameIndex<DirectiveAnnotation>;
        directivesForParameter.forEach((parameterDirectiveId) => {
            if (!directiveParameters[parameterName].directives) {
                directiveParameters[parameterName].directives = new NameIndex<DirectiveAnnotation>();
            }
            let directive = directivesProperties[parameterDirectiveId]
            directiveParameters[parameterName].type = parameterType.replace(parameterDirectiveId, '').trim()
            if (directive) {
                directiveParameters[parameterName].directives![directive.name] = directive
            }
            delete directivesProperties[parameterDirectiveId]
        })
    })
    return directiveParameters
}

export {
    parseDirectives,
    getDirectiveProperties,
    ENCODING_FLAG,
    ENCODED_DIRECTIVE_REGEXP,
    ENCODED_DIRECTIVE_REGEXP_GROUPS
}