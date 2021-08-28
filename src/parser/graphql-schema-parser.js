const { match } = require('assert');
const fs = require('fs')
const path = require("path");
const { randomBytes } = require('crypto')

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

const OBJECT_DIRECTIVE_ENCODED_REGEX = /(extend\s+){0,1}(type|interface|input){1}\s+(\w+){1}(\s+implements\s+){0,1}([\s\w&]*)([\s0-9a-zA-Z@]*){0,1}{([^}]+)}/gm

const OBJECT_DIRECTIVE_ENCODED_REGEX_GROUPS = {
    EXTENDS_TAG_GROUP: 1,
    TYPE_LABEL_GROUP_TAG: 2,
    NAME_GROUP: 3,
    IMPLEMENTS_TAG_GROUP: 4,
    IMPLEMENTS_GROUP: 5,
    OBJECT_DIRECTIVE_GROUP: 6,
    BODY_GROUP: 7,
}

const FIELD_DIRECTIVE_ENCODED_REGEX = /^\s*(\w+)([\s\w\(\)\[\]:,@]*):\s*([\[\]\w\s!]+)\s*([\s@0-9A-Za-z]*)/g
const FIELD_DIRECTIVE_ENCODED_REGEX_GROUPS = {
    NAME_GROUP: 1,
    PARAMETER_GROUP: 2,
    RETURN_TYPE_GROUP: 3,
    DIRECTIVE_GROUP: 4
}

const DIRECTIVE_WITH_PARAMETER_REGEX = /@(\w*)\s*\(\s*([@\w\s:\[\]!,]+)\)/g
const DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS = {
    FULL_MATCH_GROUP: 0,
    NAME_GROUP: 1,
    PARAMETER_GROUP: 2
}


const DIRECTIVE_NO_PARAMETER_REGEX=/(@\w+)(\s*)((?=@)|(?={)|(?=\))|(?=,)|(?==)|(?=$))/gm
const DIRECTIVE_NO_PARAMETER_REGEX_GROUPS = {
    FULL_MATCH_GROUP: 0,
    NAME_GROUP: 1,
}

const ENCODED_DIRECTIVE_REGEX = /@+[0-9A-Za-z]+@+/g
const ENCODED_DIRECTIVE_REGEX_GROUPS = {
    FULL_MATCH_GROUP: 0,
}

const UNION_DIRECTIVE_ENCODED_REGEX =/\s*(extend\s+){0,1}union\s+(\w+)\s*([@\sA-Za-z0-9]*)\s*=\s*(\|{0,1}[|\w\s]+\|\s*\w+)/g

const UNION_DIRECTIVE_ENCODED_REGEX_GROUPS={
    EXTENDS_TAG_GROUP: 1,
    NAME_GROUP: 2,
    DIRECTIVE_GROUP: 3, 
    UNION_MEMBERS_GROUP:4,
}
const SCALAR_DIRECTIVE_ENCODED_REGEX = /^\s*(extend\s+){0,1}scalar\s+(\w+)\s*([@A-Za-z0-9]*)$/gm
const SCALAR_DIRECTIVE_ENCODED_GROUPS = {
    EXTENDS_TAG_GROUP: 1,
    NAME_GROUP: 2,
    DIRECTIVE_GROUP: 3
}

const DIRECTIVE_DEFINITION_REGEXP=/\s*directive @\s*(\w+)\s*\({0,1}([\[\]@\s\w,:!]*)\){0,1}\s*on\s*([|\w\s]+\|\s*\w+|\s*\w+)/g
const DIRECTIVE_DEFINITION_REGEXP_GROUPS={
    NAME_GROUP: 1,
    PARAMETER_GROUP: 2,
    DIRECTIVE_LOCATIONS_GROUP:3 
}

const ENUM_REGEX = /(extend\s+){0,1}enum\s+(\w+){1}([@\s\w,:\(\)!\[\]]*){0,1}{([^}]+)}/gm
const ENUM_REGEX_GROUPS = {
    EXTENDS_TAG_GROUP: 1,
    NAME_GROUP: 2,
    DIRECTIVE_GROUP: 3,
    VALUE_GROUP: 4

}

const getUnionProperties = (encodedDirectivesSchemaText,directiveMap)=>{
    const unionMatches = [...encodedDirectivesSchemaText.matchAll(UNION_DIRECTIVE_ENCODED_REGEX)]
    const results={}
    unionMatches.forEach((unionMatch)=>{
        const members=unionMatch[UNION_DIRECTIVE_ENCODED_REGEX_GROUPS.UNION_MEMBERS_GROUP].trim().split('|').map(line=>line.replace(/s*/g,'')).filter(line=>line.length>0)
        const directives= getDirectiveProperties(unionMatch[UNION_DIRECTIVE_ENCODED_REGEX_GROUPS.DIRECTIVE_GROUP].trim(),directiveMap)
        const name=unionMatch[UNION_DIRECTIVE_ENCODED_REGEX_GROUPS.NAME_GROUP]
        const isExtended=unionMatch[UNION_DIRECTIVE_ENCODED_REGEX_GROUPS.EXTENDS_TAG_GROUP] && true
        results[name]={
            isExtended,
            name,
            members,
            directives
        }
    })
    return results;
}

const getScalarProperties=(encodedDirectivesSchemaText,directiveMap)=>{
    const scalarMatches = [...encodedDirectivesSchemaText.matchAll(SCALAR_DIRECTIVE_ENCODED_REGEX)]
    const results={}
    scalarMatches.forEach((scalarMatch)=>{
        const directives= getDirectiveProperties(scalarMatch[SCALAR_DIRECTIVE_ENCODED_GROUPS.DIRECTIVE_GROUP].trim(),directiveMap)
        const name=scalarMatch[SCALAR_DIRECTIVE_ENCODED_GROUPS.NAME_GROUP]
        const isExtended=scalarMatch[SCALAR_DIRECTIVE_ENCODED_GROUPS.EXTENDS_TAG_GROUP] && true
        results[name]={
            isExtended,
            name,
            directives
        }
    })
    return results;
}



//returns parameters for a field including its name and type
const getParameterProperties = (rawParametersText, directiveMap) => {
    // if(!rawParametersText||rawParametersText.length<1 ||!rawParametersText.includes(':')){
    //     return;
    // }
    let results = {}
    let preprocessedText=rawParametersText.replace('(','').replace(')','')
    preprocessedText.split(',').forEach((param) => {
        const paramName = param.split(':')[0].trim()
        let paramType = param.split(':')[1].trim()

        const encodedDirectiveMatches = splitDirectivesString(paramType)
        results.directives = getDirectiveProperties(paramType, directiveMap)
        encodedDirectiveMatches.forEach(directiveId => paramType = paramType.replace(directiveId,'').trim())        
        results[paramName] = paramType.trim()
        results.name=paramName
    })
    return results;
}
const splitDirectivesString=encodedDirectivesString=>[...encodedDirectivesString.matchAll(ENCODED_DIRECTIVE_REGEX)].map(match => match[ENCODED_DIRECTIVE_REGEX_GROUPS.FULL_MATCH_GROUP])

const getDirectiveProperties = (encodedDirectivesString, directiveMap) => {
    let result = {}
    if(!encodedDirectivesString || encodedDirectivesString.length<1 || !encodedDirectivesString.includes('@')){
        return;
    }
    const encodedDirectiveMatches = splitDirectivesString(encodedDirectivesString)
    encodedDirectiveMatches.forEach((directiveId) => {
        const directiveName = directiveMap[directiveId].name
        result[directiveName] = directiveMap[directiveId]
    })
    return result
}
//required so that the directive parser does not clash, and also because base node js libs do not have variable length look behinds
const changeDirectiveDefinitionSignatureCharacter=(rawGraphQLSchemaText)=>{
    return rawGraphQLSchemaText.replace(DIRECTIVE_DEFINITION_DEFAULT_LABEL_REGEX,DIRECTIVE_DEFINITION_REPLACEMENT_LABEL)
}

const encodeAllDirectives = (rawGraphQLSchemaText,textPreprocessorCallback) => {
    let height = 1
    let preprocessedText=rawGraphQLSchemaText
    if(textPreprocessorCallback){
        preprocessedText=textPreprocessorCallback(rawGraphQLSchemaText)
    }

    let { encodedDirectivesSchemaText, directivesProperties } = encodeAllNonParameterDirectives(preprocessedText);

    do {
        encodedDirectivesSchemaText=encodedDirectivesSchemaText.replace(DIRECTIVE_WITH_PARAMETER_REGEX,(match,p1,p2)=>{
            const directiveId = generateDirectiveId(height);
            const directiveName = p1
            const parameters = p2;   
            directivesProperties[directiveId] = { name: directiveName,height }
            const { directiveParameters, usedDirectives } = getDirectiveParameters(parameters, directivesProperties)
            usedDirectives.forEach(parameterDirectiveId => delete directivesProperties[parameterDirectiveId])
            directivesProperties[directiveId].parameters = directiveParameters
            return directiveId
        })
        height++
    } while (encodedDirectivesSchemaText.includes(DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS))
    return { encodedDirectivesSchemaText, directivesProperties }
}




const encodeAllNonParameterDirectives = (rawGraphQLSchemaText) => {
    let encodedDirectivesSchemaText = rawGraphQLSchemaText;
    let directivesProperties = {};
    simpleDirectiveMatches = [...encodedDirectivesSchemaText.matchAll(DIRECTIVE_NO_PARAMETER_REGEX)]
    encodedDirectivesSchemaText=rawGraphQLSchemaText.replace(DIRECTIVE_NO_PARAMETER_REGEX,(match,p1,p2)=>{
        console.log('groupie',p1)
        const randomId = generateDirectiveId(1)
        directivesProperties[randomId]=p1.replace('@','')
        return `@${randomId}@${p2}`;
    })
    return { encodedDirectivesSchemaText, directivesProperties }
}

const generateDirectiveId = (level) => {
    return '@'.repeat(level) + generateRandomId(6) + '@'.repeat(level)
}


const getDirectiveParameters = (rawParametersFieldText, directivesProperties) => {
    // if(!rawParametersFieldText || rawParametersFieldText.length<1 ||!rawParametersFieldText.includes(':')){
    //     return
    // }
    // console.log('getDirectiveParameters',rawParametersFieldText)
    let directiveParameters = {}
    let usedDirectives = []
    rawParametersFieldText.split(',').map(line=>line.trim()).filter(line=>line.length>0).forEach((parameter) => {
        const parameterName = parameter.split(':')[0].trim()
        let parameterType = parameter.split(':')[1]
        const directivesForParameter = [...parameter.matchAll(ENCODED_DIRECTIVE_REGEX)].map(match => match[ENCODED_DIRECTIVE_REGEX_GROUPS.FULL_MATCH_GROUP].trim());
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
        const parameters= getParameterProperties(directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.PARAMETER_GROUP].trim(),directivesProperties)
        console.log('dirparams',directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.PARAMETER_GROUP].trim())
        const name=directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.NAME_GROUP].trim()
        let directiveLocations={}
        directiveDefinitionMatch[DIRECTIVE_DEFINITION_REGEXP_GROUPS.DIRECTIVE_LOCATIONS_GROUP]
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
            directiveLocations
        }
    })
    return results;
}



const getTypes = (rawGraphQLSchemaText, directivesProperties) => {
    const typeMatches = [...rawGraphQLSchemaText.matchAll(OBJECT_DIRECTIVE_ENCODED_REGEX)]
    typeMatches.forEach(typeMatch => delete typeMatch.input)
    let results = {};
    typeMatches.forEach((match) => {
        const typeLabel = match[OBJECT_DIRECTIVE_ENCODED_REGEX_GROUPS.TYPE_LABEL_GROUP_TAG]
        const name = match[OBJECT_DIRECTIVE_ENCODED_REGEX_GROUPS.NAME_GROUP]
        const directives = match[OBJECT_DIRECTIVE_ENCODED_REGEX_GROUPS.OBJECT_DIRECTIVE_GROUP]
        const isExtended = match[OBJECT_DIRECTIVE_ENCODED_REGEX_GROUPS.EXTENDS_TAG_GROUP]
        const implements = match[OBJECT_DIRECTIVE_ENCODED_REGEX_GROUPS.IMPLEMENTS_GROUP]
        const rawTextFields = match[OBJECT_DIRECTIVE_ENCODED_REGEX_GROUPS.BODY_GROUP]

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
            if (implements) {
                results[typeLabel][name].implements = implements.trim()
            }
            if (directives) {
                console.log('fromtypes',directives)
                results[typeLabel][name].directives = getDirectiveProperties(directives, directivesProperties)
            }
            results[typeLabel][name].fields = getFieldProperties(rawTextFields,directivesProperties)
        }
    })
    return results
}


const getEnums = (graphqlSchemaString,directivesProperties) => {
    let results = {}
    const enumMatches = [...graphqlSchemaString.matchAll(ENUM_REGEX)]
    enumMatches.forEach(typeMatch => delete typeMatch.input)
    enumMatches.forEach((match) => {

        const name = match[ENUM_REGEX_GROUPS.NAME_GROUP]
        const isExtended = match[ENUM_REGEX_GROUPS.EXTENDS_TAG_GROUP] && true
        const directives = getDirectiveProperties(match[ENUM_REGEX_GROUPS.DIRECTIVE_GROUP],directivesProperties)
        const values = getEnumValues(match[ENUM_REGEX_GROUPS.VALUE_GROUP],directivesProperties)
        results[name]={
            name,
            isExtended,
            directives,
            values
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
        const name = line.includes('@')? (line.split('@'))[0].trim():line.trim()
        const directives = getDirectiveProperties(line,directivesProperties)
        results[name]={
            name,
            directives
        }
    })
    
    return results
}




const getFieldProperties = (rawTextFields, directivesProperties) => {
    let results = {}
    let argDirectives = []
    const sanitizedTextFields = rawTextFields
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)

    sanitizedTextFields.map(line => [...line.matchAll(FIELD_DIRECTIVE_ENCODED_REGEX)])
        .forEach((regexGroups) => {
            return regexGroups.map((regexGroup) => {
                const name = regexGroup[FIELD_DIRECTIVE_ENCODED_REGEX_GROUPS.NAME_GROUP]
                const returnType = regexGroup[FIELD_DIRECTIVE_ENCODED_REGEX_GROUPS.RETURN_TYPE_GROUP]
                const directives = regexGroup[FIELD_DIRECTIVE_ENCODED_REGEX_GROUPS.DIRECTIVE_GROUP]
                const parameters = regexGroup[FIELD_DIRECTIVE_ENCODED_REGEX_GROUPS.PARAMETER_GROUP]
                if (name && returnType) {
                    results[name] = {}
                    results[name].returnType = returnType
                    if (directives) {

                        results[name].directives = getDirectiveProperties(directives, directivesProperties)
                    }
                    if (parameters) {
                        
                        results[name].parameters = getParameterProperties(parameters,directivesProperties)
                    }
                }
            })
        })
    return results
}



const generateSchemaObject = (graphqlSchemaTextString) => {
    const { encodedDirectivesSchemaText, directivesProperties } = encodeAllDirectives(graphqlSchemaTextString)
    console.log('enco',encodedDirectivesSchemaText)
    const types = getTypes(encodedDirectivesSchemaText,directivesProperties)
    console.log('types',types)
    // const unions = getUnionProperties(encodedDirectivesSchemaText,directivesProperties)
    // console.log('typessss',types.type.Query.directives.include1.parameters)
    // console.log('unions',unions)

    // const scalars = getScalarProperties(encodedDirectivesSchemaText,directivesProperties)
    // console.log('scalars',scalars)
    // const enums = getEnums(encodedDirectivesSchemaText,directivesProperties)
    
    // changeDirectiveDefinitionCharacter(graphqlSchemaTextString)
    // const directiveDefinitions = getDirectiveDefinitions(encodedDirectivesSchemaText,directivesProperties)
    // console.log('dir def',directiveDefinitions)
}


generateSchemaObject(file)

const getUnions = () => {

}
const getScalars = () => {

}

const populateSchemaObjectWithDirectives = (schemaObject, directiveMap) => {

}
