//Since directives can be nested in their parameters, and also since node does have native support for recursion or varible length look around, 
//directives will have to be parsed separaetely in its own object, and the schemaText must be encoded so that it is simple to use regexp

import {randomBytes} from 'crypto'
const ENCODING_FLAG='%'

// const DIRECTIVE_NO_PARAMETER_REGEXP=/@(\w+)(\s*[,\)\s=\{])/g
const DIRECTIVE_NO_PARAMETER_REGEXP=new RegExp('@\(\\w+\)\(\\s*\[,\\)\\s=\\{\])','g')//g
const DIRECTIVE_NO_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    TAIL:2
}


// const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP=/@(\w*)\s*\(\s*([\w\s:\[\]!,]+)\)(\s*)/g
const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP=new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:\\[\\]!,\]+\)\\)\(\\s*\)','g')//g

    const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP_GROUPS = {
        FULL_MATCH: 0,
        NAME: 1,
        PARAMETERS: 2,
        TAIL:3
    }
  
// const DIRECTIVE_WITH_PARAMETER_REGEXP=/@(\w*)\s*\(\s*([\w\s:#\[\]!,]+)\)(\s*)/g
const DIRECTIVE_WITH_PARAMETER_REGEXP=new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:'+ENCODING_FLAG+'\\[\\]!,\]+\)\\)\(\\s*\)','g');
const DIRECTIVE_WITH_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    PARAMETERS: 2,
    TAIL:3
}

    
const ENCODED_DIRECTIVE_REGEXP = new RegExp(ENCODING_FLAG+'+\[0-9A-Za-z\]+'+ENCODING_FLAG+'+','gm')
const ENCODED_DIRECTIVE_REGEXP_GROUPS = {
    FULL_MATCH: 0,
}


const splitDirectivesString=encodedDirectivesString=>[...encodedDirectivesString.matchAll(ENCODED_DIRECTIVE_REGEXP)].map(match => match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH])

const getDirectiveProperties = (encodedDirectivesString, directivesProperties) => {
    let result = {}
    if(!encodedDirectivesString || encodedDirectivesString.length<1 || !encodedDirectivesString.includes(ENCODING_FLAG)){
        return;
    }
    const encodedDirectiveMatches = splitDirectivesString(encodedDirectivesString)
    encodedDirectiveMatches.forEach((directiveId) => {
        const directiveName = directivesProperties[directiveId].name
        result[directiveName] = directivesProperties[directiveId]
    })
    return result
}

// encodedDirectivesSchemaText, directivesProperties
//height 0 = directive no params
//height 1 = directive with non directive params
//height 1+ = directive with params that have directives
const parseDirectives = (rawGraphQLSchemaText)=>{
    let directiveProperties={}
    let encodedDirectivesSchemaText=rawGraphQLSchemaText
    let height=0
    let curretRegExp=DIRECTIVE_NO_PARAMETER_REGEXP
    while(encodedDirectivesSchemaText.match(DIRECTIVE_WITH_PARAMETER_REGEXP) || encodedDirectivesSchemaText.match(DIRECTIVE_NO_PARAMETER_REGEXP)){
        if(height === 1){
            curretRegExp=DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP
 
        }else if(height>1){
            curretRegExp=DIRECTIVE_WITH_PARAMETER_REGEXP
        }
        encodedDirectivesSchemaText=encodedDirectivesSchemaText.replace(curretRegExp,(match,p1,p2,p3)=>{
            const directiveId = generateDirectiveId(height)
            let name=p1
            let tailGroup=p2
            let parameters;
            if(height>0){
                tailGroup=p3
                parameters=getDirectiveParameters(p2,directiveProperties)      
            }


            directiveProperties[directiveId]={
                name,
                height,
                parameters
            }

            return ` ${directiveId}${tailGroup}`;
        })
        height++;
    }
    
    return {
        encodedDirectivesSchemaText,directiveProperties
    }
}

const generateRandomId = (byteLength) => {
    return randomBytes(byteLength).toString('hex')
}
const generateDirectiveId = (height) => {
    return ENCODING_FLAG.repeat(height) +ENCODING_FLAG+ generateRandomId(6) +ENCODING_FLAG+ ENCODING_FLAG.repeat(height)
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