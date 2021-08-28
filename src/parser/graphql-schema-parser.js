const { match } = require('assert');
const fs = require('fs')
const path = require("path");
const { randomBytes } = require('crypto');
const internal = require('stream');

//  ../../../schema/error.graphql

const argInputPath = process.argv[2]
const isRelativePath = !argInputPath.startsWith("fullPath:") || !argInputPath.includes(':')
const schemaPath = isRelativePath ? path.resolve(__dirname, argInputPath) : argInputPath.replace("fullPath:", '')

console.log("input", argInputPath)
const file = fs.readFileSync(schemaPath, 'utf8');

const regArguments = /(([@\w]+)[(]([\w:\s,!]+)[)]{0,1})/g

const generateRandomId = (byteLength) => {
    return randomBytes(byteLength).toString('hex')
}
const ENCODING_FLAG='#'
const FIELD_DESCRIPTION='(\s*"""([^"]+)"""\s*){0,1}'
const PARAMETER_DESCRIPTION='(\s*"([^"]+)"\s*){0,1}'
// const OBJECT_REGEXP = /(\s*"""([^"]+)"""\s*){0,1}^(extend\s+){0,1}(type|interface|input){1}\s+(\w+){1}(\s+implements\s+){0,1}([\s\w&]*)([\s0-9a-zA-Z@]*){0,1}{([^}]+)}/gm
const OBJECT_REGEXP = new RegExp(FIELD_DESCRIPTION+'^(extend\s+){0,1}(type|interface|input){1}\s+(\w+){1}(\s+implements\s+){0,1}([\s\w&]*)([\s0-9a-zA-Z'+ENCODING_FLAG+']*){0,1}{([^}]+)}','gm')



const OBJECT_TYPE_TAG='type'
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

// const FIELD_REGEXP = /(\s*"""([^"]+)"""\s*){0,1}^[\t ]*(\w+)(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|[@\w \t]+$)/gm
const FIELD_REGEXP = new RegExp(FIELD_DESCRIPTION+'^[\t ]*(\w+)(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|['+ENCODING_FLAG+'\w \t]+$)','gm')


const FIELD_REGEXP_GROUPS={
    DESCRIPTION:2,
    NAME: 3,
    PARAMETERS: 5,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
}

// const FIELD_PARAMETER_REGEXP=/(\s*"([^"]+)"\s*){0,1}^[\t ]*(\w+)(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|[@\w \t]+$)/gm
const FIELD_PARAMETER_REGEXP=new RegExp(PARAMETER_DESCRIPTION+'^[\t ]*(\w+)(\(([^\)]+)\)){0,1}:([\w\t \[\]!]+)[\t ]*($|['+ENCODING_FLAG+'\w \t]+$)','gm')
const FIELD_PARAMETER_REGEXP_GROUPS={
    DESCRIPTION:2,
    NAME: 3,
    TYPE: 6,
    ENCODED_DIRECTIVES: 7
}
// const DIRECTIVE_WITH_PARAMETER_REGEXP = /@(\w*)\s*\(\s*([^\)]+)\)/g
const DIRECTIVE_WITH_PARAMETER_REGEXP = new RegExp('@(\w*)\s*\(\s*([^\)]+)\)','g')
const DIRECTIVE_WITH_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    PARAMETERS: 2
}


const DIRECTIVE_NO_PARAMETER_REGEXP=/@(\w+)(\s*[,\)\s=\{])/g
const DIRECTIVE_NO_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    TAIL:2
}

// const ENCODED_DIRECTIVE_REGEXP = /@+[0-9A-Za-z]+@+/g
const ENCODED_DIRECTIVE_REGEXP = new RegExp(ENCODING_FLAG+'+[0-9A-Za-z]+'+ENCODING_FLAG+'+','gm')
const ENCODED_DIRECTIVE_REGEXP_GROUPS = {
    FULL_MATCH: 0,
}

const UNION_REGEXP =/(\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}union\s+(\w+)\s*([@\sA-Za-z0-9]*)\s*=\s*(\|{0,1}[|\w\s@]+\|\s*\w+[@\w\s]+$)/gm
const UNION_REGEXP =new RegExp(FIELD_DESCRIPTION+'^\s*(extend\s+){0,1}union\s+(\w+)\s*(['+ENCODING_FLAG+'\sA-Za-z0-9]*)\s*=\s*(\|{0,1}[|\w\s'+ENCODING_FLAG+']+\|\s*\w+['+ENCODING_FLAG+'\w\s]+$','gm')
const UNION_REGEXP_GROUPS={
    DESCRIPTION:2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5, 
    UNION_MEMBERS:6,
}
// const SCALAR_REGEXP = /(\s*"""([^"]+)"""\s*){0,1}^\s*(extend\s+){0,1}scalar\s+(\w+)\s*([@A-Za-z0-9]*)$/gm
new RegExp(FIELD_DESCRIPTION+'^\s*(extend\s+){0,1}scalar\s+(\w+)\s*(['+ENCODING_FLAG+'A-Za-z0-9]*)$','gm')
const SCALAR_REGEXP_GROUPS = {
    DESCRIPTION:2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5
}

// const DIRECTIVE_DEFINITION_REGEXP=/(\s*"""([^"]+)"""\s*){0,1}^\s*directive @\s*(\w+)\s*\({0,1}([\[\]@\s\w,:!]*)\){0,1}\s*on\s*([|\w\s]+\|\s*\w+|\s*\w+)/gm
const DIRECTIVE_DEFINITION_REGEXP=new RegExp(FIELD_DESCRIPTION+'^\s*directive '+ENCODING_FLAG+'\s*(\w+)\s*\({0,1}([\[\]'+ENCODING_FLAG+'\s\w,:!]*)\){0,1}\s*on\s*([|\w\s]+\|\s*\w+|\s*\w+)','gm')
const DIRECTIVE_DEFINITION_REGEXP_GROUPS={
    DESCRIPTION:2,
    NAME: 3,
    PARAMETERS: 4,
    DIRECTIVE_LOCATIONS:5 
}

// const ENUM_REGEXP = /(\s*"""([^"]+)"""\s*)^\s*(extend\s+){0,1}enum\s+(\w+){1}([@\s\w,:\(\)!\[\]]*){0,1}{([^}]+)}/gm
const ENUM_REGEXP = new RegExp(FIELD_DESCRIPTION+'^\s*(extend\s+){0,1}enum\s+(\w+){1}(['+ENCODING_FLAG+'\s\w,:\(\)!\[\]]*){0,1}{([^}]+)}','gm')
const ENUM_REGEXP_GROUPS = {
    DESCRIPTION:2,
    EXTENDS_TAG: 3,
    NAME: 4,
    ENCODED_DIRECTIVES: 5,
    VALUE: 6
}


const getUnionProperties = (encodedDirectivesSchemaText,directiveMap)=>{
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

const getScalarProperties=(encodedDirectivesSchemaText,directiveMap)=>{
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



const splitDirectivesString=encodedDirectivesString=>[...encodedDirectivesString.matchAll(ENCODED_DIRECTIVE_REGEXP)].map(match => match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH])

const getDirectiveProperties = (encodedDirectivesString, directivesProperties) => {
    let result = {}
    if(!encodedDirectivesString || encodedDirectivesString.length<1 || !encodedDirectivesString.includes('@')){
        return;
    }
    const encodedDirectiveMatches = splitDirectivesString(encodedDirectivesString)
    encodedDirectiveMatches.forEach((directiveId) => {
        const directiveName = directivesProperties[directiveId].name
        result[directiveName] = directivesProperties[directiveId]
    })
    return result
}

const encodeAllDirectives = (rawGraphQLSchemaText,textPreprocessorCallback) => {
    let height = 1
    let preprocessedText=rawGraphQLSchemaText
    if(textPreprocessorCallback){
        preprocessedText=textPreprocessorCallback(rawGraphQLSchemaText)
    }

    let { encodedDirectivesSchemaText, directivesProperties } = encodeAllNonParameterDirectives(preprocessedText);

    do {
        encodedDirectivesSchemaText=encodedDirectivesSchemaText.replace(DIRECTIVE_WITH_PARAMETER_REGEXP,(match,p1,p2)=>{
            const directiveId = generateDirectiveId(height);
            const directiveName = p1
            const parameters = p2;   
            directivesProperties[directiveId] = { name: directiveName,height }
            const { directiveParameters, usedDirectives } = getDirectiveParameters(parameters, directivesProperties)
            usedDirectives.forEach(parameterDirectiveId => delete directivesProperties[parameterDirectiveId])
            directivesProperties[directiveId].parameters = directiveParameters
            return ` ${directiveId} `
        })
        height++
    } while (encodedDirectivesSchemaText.match(DIRECTIVE_WITH_PARAMETER_REGEXP))
    return { encodedDirectivesSchemaText, directivesProperties }
}




const encodeAllNonParameterDirectives = (rawGraphQLSchemaText) => {
    let encodedDirectivesSchemaText = rawGraphQLSchemaText;
    let directivesProperties = {};
    simpleDirectiveMatches = [...encodedDirectivesSchemaText.matchAll(DIRECTIVE_NO_PARAMETER_REGEXP)]
    encodedDirectivesSchemaText=rawGraphQLSchemaText.replace(DIRECTIVE_NO_PARAMETER_REGEXP,(match,p1,p2)=>{

        const directiveId = generateDirectiveId(1)
        directivesProperties[directiveId]={name:p1.replace(ENCODING_LABEL,'')}
        return ` ${directiveId}${p2}`;
    })
    return { encodedDirectivesSchemaText, directivesProperties }
}

const generateDirectiveId = (level) => {
    return ENCODING_LABEL.repeat(level) + generateRandomId(6) + ENCODING_LABEL.repeat(level)
}


const getDirectiveParameters = (rawParametersFieldText, directivesProperties) => {
    let directiveParameters = {}
    let usedDirectives = []
    rawParametersFieldText.split(',').map(line=>line.trim()).filter(line=>line.length>0).forEach((parameter) => {
        const parameterName = parameter.split(':')[0].trim()
        let parameterType = parameter.split(':')[1]
        const directivesForParameter = [...parameter.matchAll(ENCODED_DIRECTIVE_REGEXP)].map(match => match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH].trim());
        directiveParameters[parameterName] = {
            name: parameterName,
            type: parameterType
        }

        directivesForParameter.forEach((parameterDirectiveId) => {
            parameterType = parameterType.replace(parameterDirectiveId, '').trim()
            let directives;
            directiveParameters[parameterName] = {
                directives: directivesProperties[parameterDirectiveId],
                type: parameterType
            }
            usedDirectives.push(parameterDirectiveId);
        })
    })
    return { directiveParameters, usedDirectives }
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
                results[typeLabel][name].interfaces = interfaces.split('&').map(interface =>interface.trim()).filter(interface =>interface.length>0)
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
        const name = line.includes(ENCODING_LABEL)? (line.split(ENCODING_LABEL))[0].trim():line.trim()
        const directives = getDirectiveProperties(line,directivesProperties)
        results[name]={
            name,
            directives
        }
    })
    
    return results
}


const getParameterProperties = (rawParametersText, directiveMap) => {
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
                        console.log('my matches para',parameters)                  
                        results[name].parameters = getParameterProperties(parameters,directivesProperties)
                    }
                }

        })
    return results
}

const executeConfigurations = (config)=>{
    for(const item in config){
        config.graphqlSchemaTextString
        const test={
            type:"enum",
            name:"something",
            separateFilePerType:true,
            fileNameFormat: 'prefix'+name+'suffix.ts'
        }
    }
}

const generateSchemaObject = (graphqlSchemaTextString) => {
    const { encodedDirectivesSchemaText, directivesProperties } = encodeAllDirectives(graphqlSchemaTextString)
    console.log('enco',encodeAllNonParameterDirectives(graphqlSchemaTextString).encodedDirectivesSchemaText)
    // const types = getTypes(encodedDirectivesSchemaText,directivesProperties)
    // console.log('types',types)
    // // console.log('typessss',types.type.Query_isExtended_.directives.include1.parameters)

    // const unions = getUnionProperties(encodedDirectivesSchemaText,directivesProperties)
    // console.log('unions',unions)

    // const scalars = getScalarProperties(encodedDirectivesSchemaText,directivesProperties)
    // console.log('scalars',scalars)

    // const enums = getEnums(encodedDirectivesSchemaText,directivesProperties)
    // console.log('enums',enums)
}

generateSchemaObject(file)