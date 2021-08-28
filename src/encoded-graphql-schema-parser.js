import {    parseDirectives,    getDirectiveProperties,ENCODING_FLAG } from './graphql-directive-parser.js'


const FIELD_DESCRIPTION='\(\\s*"""\(\[^"\]+\)"""\\s*\)\{0,1\}'
const PARAMETER_DESCRIPTION='\(\\s*"\(\[^"\]+\)"\\s*\)\{0,1\}'
const OBJECT_REGEXP = new RegExp(FIELD_DESCRIPTION+'^\(extend\\s+\)\{0,1\}\(type|interface|input\)\{1\}\\s+\(\\w+\)\{1\}\(\\s+implements\\s+\)\{0,1\}\(\[\\s\\w&\]*\)\(\[\\s0-9a-zA-Z'+ENCODING_FLAG+'\]*\)\{0,1\}\{\(\[^\}\]+\)\}','gm')

const OBJECT_REGEXP_GROUPS = {
    DESCRIPTION:2,
    EXTENDS_TAG: 3,
    TYPE_LABEL: 4,
    NAME: 5,
    IMPLEMENTS_TAG: 6,
    IMPLEMENTS: 7,
    ENCODED_DIRECTIVES: 8,
    BODY: 9,
}

const FIELD_REGEXP = new RegExp(FIELD_DESCRIPTION+'^\[\\t \]*\(\\w+\)\(\\(\(\[^\\)\]+\)\\)\)\{0,1\}:\(\[\\w\\t \\[\\]!\]+\)\[\\t \]*\($|\['+ENCODING_FLAG+'\\w \\t\]+$\)','gm')


const FIELD_REGEXP_GROUPS={
    DESCRIPTION:2,
    NAME: 3,
    PARAMETERS: 5,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
}

const FIELD_PARAMETER_REGEXP=new RegExp(PARAMETER_DESCRIPTION+'^\[\\t \]*\(\\w+\)\(\\(\(\[^\\)\]+\)\\)\)\{0,1\}:\(\[\\w\\t \\[\\]!\]+\)\[\\t \]*\($|\['+ENCODING_FLAG+'\\w \\t\]+$\)','gm')
const FIELD_PARAMETER_REGEXP_GROUPS={
    DESCRIPTION:2,
    NAME: 3,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
}

    
const ENCODED_DIRECTIVE_REGEXP = new RegExp(ENCODING_FLAG+'+\[0-9A-Za-z\]+'+ENCODING_FLAG+'+','gm')
const ENCODED_DIRECTIVE_REGEXP_GROUPS = {
    FULL_MATCH: 0,
}

const UNION_REGEXP =new RegExp(FIELD_DESCRIPTION+'^\\s*\(extend\\s+\)\{0,1\}union\\s+\(\\w+\)\\s*\(\['+ENCODING_FLAG+'\\sA-Za-z0-9\]*\)\\s*=\\s*\(\\|\{0,1\}\[|\\w\\s'+ENCODING_FLAG+'\]+\\|\\s*\\w+\['+ENCODING_FLAG+'\\w\\s\]+\)$','gm');
const UNION_REGEXP_GROUPS={
    DESCRIPTION:2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5, 
    UNION_MEMBERS:6,
}
const SCALAR_REGEXP=new RegExp(FIELD_DESCRIPTION+'^\\s*\(extend\\s+\)\{0,1\}scalar\\s+\(\\w+\)\\s*\(\['+ENCODING_FLAG+'A-Za-z0-9\]*\)$','gm')
const SCALAR_REGEXP_GROUPS = {
    DESCRIPTION:2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5
}

const DIRECTIVE_DEFINITION_REGEXP=new RegExp(FIELD_DESCRIPTION+'^\\s*directive '+ENCODING_FLAG+'\\s*\(\\w+\)\\s*\\(\{0,1\}\(\[\\[\\]'+ENCODING_FLAG+'\\s\\w,:!\]*\)\\)\{0,1\}\\s*on\\s*\(\[|\\w\\s]+\\|\\s*\\w+|\\s*\\w+\)','gm')
const DIRECTIVE_DEFINITION_REGEXP_GROUPS={
    DESCRIPTION:2,
    NAME: 3,
    PARAMETERS: 4,
    DIRECTIVE_LOCATIONS:5 
}

const ENUM_REGEXP = new RegExp(FIELD_DESCRIPTION+'^\\s*\(extend\\s+\)\{0,1\}enum\\s+\(\\w+\)\{1\}\(\['+ENCODING_FLAG+'\\s\\w,:\\(\\)!\\[\\]\]*\)\{0,1\}\{\(\[^\}\]+)\}','gm')
const ENUM_REGEXP_GROUPS = {
    DESCRIPTION:2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5,
    VALUE: 6
}

const getUnions = (encodedDirectivesSchemaText,directiveMap)=>{
    const unionMatches = [...encodedDirectivesSchemaText.matchAll(UNION_REGEXP)]
    const results={}
    unionMatches.forEach((unionMatch)=>{
        const members=unionMatch[UNION_REGEXP_GROUPS.UNION_MEMBERS].trim().split('|').map(line=>line.replace(/\s*/g,'')).filter(line=>line.length>0)
        const directives= getDirectiveProperties(unionMatch[UNION_REGEXP_GROUPS.ENCODED_DIRECTIVES].trim(),directiveMap)
        const isExtended=unionMatch[UNION_REGEXP_GROUPS.EXTENDS_TAG] && true
        const name =isExtended?match[UNION_REGEXP_GROUPS.NAME]+EXTENSION_NAME_SUFFIX:match[UNION_REGEXP_GROUPS.NAME]
        const description=unionMatch[UNION_REGEXP_GROUPS.DESCRIPTION]
        results[name]={
            isExtended,
            name,
            members,
            directives,
            description
        }
    })
    return results;
}

const EXTENSION_NAME_SUFFIX='_isExtended_'

const getScalars=(encodedDirectivesSchemaText,directiveMap)=>{
    const scalarMatches = [...encodedDirectivesSchemaText.matchAll(SCALAR_REGEXP)]
    const results={}
    scalarMatches.forEach((scalarMatch)=>{
        const directives= getDirectiveProperties(scalarMatch[SCALAR_REGEXP_GROUPS.ENCODED_DIRECTIVES].trim(),directiveMap)
        const description=scalarMatch[SCALAR_REGEXP_GROUPS.DESCRIPTION]
        const isExtended=scalarMatch[SCALAR_REGEXP_GROUPS.EXTENDS_TAG] && true
        const name=isExtended?scalarMatch[SCALAR_REGEXP_GROUPS.NAME]+EXTENSION_NAME_SUFFIX:scalarMatch[SCALAR_REGEXP_GROUPS.NAME]
        results[name]={
            isExtended,
            name,
            directives,
            description
        }
    })
    return results;
}


const getDirectiveDefinitions = (encodedDirectivesSchemaText,directivesProperties)=>{
    const directiveDefinitionMatches = [...encodedDirectivesSchemaText.matchAll(DIRECTIVE_DEFINITION_REGEXP)]
    const results={}
    directiveDefinitionMatches.forEach((directiveDefinitionMatch)=>{
        const parameters= getParameterProperties(directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.PARAMETERS].trim(),directivesProperties)
        const name=directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.NAME].trim()
        const description=directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DESCRIPTION].trim()
        let directiveLocations={}
        directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DIRECTIVE_LOCATIONS]
        .split('|')
        .map(line=>line.trim())
        .filter(line=>line.length>0)
        .forEach((directiveLocationField) =>{
            directiveLocations[directiveLocationField]={
                name:directiveLocationField
            }
        } )
        results[name]={
            parameters,
            name,
            directiveLocations,
            description
        }
    })
    return results;
}

const getTypes = (rawGraphQLSchemaText, directivesProperties) => {
    const typeMatches = [...rawGraphQLSchemaText.matchAll(OBJECT_REGEXP)]
    typeMatches.forEach(typeMatch => delete typeMatch.input)
    let results = {};
    typeMatches.forEach((match) => {
        const typeLabel = match[OBJECT_REGEXP_GROUPS.TYPE_LABEL]
        const directives = match[OBJECT_REGEXP_GROUPS.OBJECT_ENCODED_DIRECTIVES]
        const isExtended = match[OBJECT_REGEXP_GROUPS.EXTENDS_TAG]
        const name =isExtended?match[OBJECT_REGEXP_GROUPS.NAME]+EXTENSION_NAME_SUFFIX:match[OBJECT_REGEXP_GROUPS.NAME]
        const interfaces = match[OBJECT_REGEXP_GROUPS.IMPLEMENTS]
        const rawTextFields = match[OBJECT_REGEXP_GROUPS.BODY]
        const description = match[OBJECT_REGEXP_GROUPS.DESCRIPTION]

        if (name && typeLabel && rawTextFields) {
            if (!results[typeLabel]) {
                results[typeLabel] = {}
            }
            if (!results[typeLabel][name]) {
                results[typeLabel][name] = {}
            }
            if (isExtended) {
                results[typeLabel][name].extends = true
            }
            if(description){
                results[typeLabel][name].description = description
            }
            if (interfaces && interfaces.length>0) {
                results[typeLabel][name].interfaces = interfaces.split('&').map(anInterface =>anInterface.trim()).filter(anInterface =>anInterface.length>0)
            }
            if (directives) {
                results[typeLabel][name].directives = getDirectiveProperties(directives, directivesProperties)
            }

            results[typeLabel][name].fields = getFieldProperties(rawTextFields,directivesProperties)
            
        }
    })
    return results
}


const getEnums = (graphqlSchemaString,directivesProperties) => {
    let results = {}
    const enumMatches = [...graphqlSchemaString.matchAll(ENUM_REGEXP)]
    enumMatches.forEach(typeMatch => delete typeMatch.input)
    enumMatches.forEach((match) => {

        const isExtended = match[ENUM_REGEXP_GROUPS.EXTENDS_TAG] && true
        const name =isExtended?match[ENUM_REGEXP_GROUPS.NAME]+EXTENSION_NAME_SUFFIX:match[ENUM_REGEXP_GROUPS.NAME]
        const directives = getDirectiveProperties(match[ENUM_REGEXP_GROUPS.ENCODED_DIRECTIVES],directivesProperties)
        const values = getEnumValues(match[ENUM_REGEXP_GROUPS.VALUE],directivesProperties)
        const description = match[ENUM_REGEXP_GROUPS.DESCRIPTION]
        results[name]={
            name,
            isExtended,
            directives,
            values,
            description
        }

    })
    return results;
}

const getEnumValues = (rawEnumValuesText,directivesProperties) => {
    let results = {}
    rawEnumValuesText
    .split('\n')
    .filter(line => line.length > 0)
    .map(line => line.trim())
    .forEach((line) => {
        const name = line.includes(ENCODING_FLAG)? (line.split(ENCODING_FLAG))[0].trim():line.trim()
        const directives = getDirectiveProperties(line,directivesProperties)
        results[name]={
            name,
            directives
        }
    })
    
    return results
}


const getParameterProperties = (rawParametersText, directivesProperties) => {
    const matches = [...rawParametersText.matchAll(FIELD_PARAMETER_REGEXP)]
    let results ={}

    matches
        .forEach((match) => {
                const name = match[FIELD_PARAMETER_REGEXP_GROUPS.NAME]
                const type = match[FIELD_PARAMETER_REGEXP_GROUPS.TYPE]
                const directives = match[FIELD_PARAMETER_REGEXP_GROUPS.ENCODED_DIRECTIVES]
                const description = match[FIELD_PARAMETER_REGEXP_GROUPS.DESCRIPTION]
                if (name && type) {
                    results[name] = {name}
                    results[name].type = type
                    results[name].description=description
                    if (directives) {
                        results[name].directives = getDirectiveProperties(directives, directivesProperties)
                    }

                }
        })
    return results
}


const getFieldProperties = (rawTextFields, directivesProperties) => {
    let results = {}
    const matches = [...rawTextFields.matchAll(FIELD_REGEXP)]
    matches
        .forEach((match) => {

                const name = match[FIELD_REGEXP_GROUPS.NAME]
                const type = match[FIELD_REGEXP_GROUPS.TYPE]
                const directives = match[FIELD_REGEXP_GROUPS.ENCODED_DIRECTIVES]
                const parameters = match[FIELD_REGEXP_GROUPS.PARAMETERS]
                const description = match[FIELD_REGEXP_GROUPS.DESCRIPTION]
                if (name && type) {
                    results[name] = {name}
                    results[name].type = type
                    results[name].description=description
                    
                    if (directives) {
                        results[name].directives = getDirectiveProperties(directives, directivesProperties)
                        
                    }
                    if (parameters) {                      
                        results[name].parameters = getParameterProperties(parameters,directivesProperties)
                    }
                }

        })
    return results
}



export {
    getEnums,
    getTypes,
    getDirectiveDefinitions,
    getScalars,
    getUnions,
}