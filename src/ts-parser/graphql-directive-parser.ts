//Since directives can be nested in their parameters, and also since node does have native support for recursion or varible length look around, 
//directives will have to be parsed separaetely in its own object, and the schemaText must be encoded so that it is simple to use regexp

import {randomBytes} from 'crypto'
import { DirectiveAnnotation, ParameterComponent,NameIndex } from '../typedefs/component'
const ENCODING_FLAG='%'

const ENCODED_ID_BYTE_LENGTH = 6
// const DIRECTIVE_NO_PARAMETER_REGEXP=/@(\w+)(\s*[,\)\s=\{])/g
const DIRECTIVE_NO_PARAMETER_REGEXP=new RegExp('@\(\\w+\)\(\\s*\[,\\)\\s=\\{\])','g')//g
const DIRECTIVE_NO_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    TAIL:2
}


const generateDirectiveId = (height:number):string => {
    return ENCODING_FLAG.repeat(height) +ENCODING_FLAG+ randomBytes(ENCODED_ID_BYTE_LENGTH).toString('hex') +ENCODING_FLAG+ ENCODING_FLAG.repeat(height)
}


// const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP=/@(\w*)\s*\(\s*([\w\s:\[\]!,]+)\)(\s*)/g
//@(\w*)\s*\(\s*([\w\s:\[\]!,]+)\)(\s*)
const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP=new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:\\[\\]!,\]+\)\\)\(\\s*\)','g')//g

    const DIRECTIVE_WITH_NON_DIRECTIVE_PARAMETER_REGEXP_GROUPS = {
        FULL_MATCH: 0,
        NAME: 1,
        PARAMETERS: 2,
        TAIL:3
    }
  
// const DIRECTIVE_WITH_PARAMETER_REGEXP=/@(\w*)\s*\(\s*([\w\s:#\[\]!,]+)\)(\s*)/g
//@(\w*)\s*\(\s*([\w\s:%\[\]!,]+)\)(\s*)
const DIRECTIVE_WITH_PARAMETER_REGEXP=new RegExp('@\(\\w*\)\\s*\\(\\s*\(\[\\w\\s:'+ENCODING_FLAG+'\\[\\]!,\]+\)\\)\(\\s*\)','g');
const DIRECTIVE_WITH_PARAMETER_REGEXP_GROUPS = {
    FULL_MATCH: 0,
    NAME: 1,
    PARAMETERS: 2,
    TAIL:3
}

//%+[0-9A-Za-z]%+
const ENCODED_DIRECTIVE_REGEXP = new RegExp(ENCODING_FLAG+'+\[0-9A-Za-z\]+'+ENCODING_FLAG+'+','gm')
const ENCODED_DIRECTIVE_REGEXP_GROUPS = {
    FULL_MATCH: 0,
}


//parses component with annotated encoded directive annotations, and gets them from directtive properties a compiles them and returns them
const getDirectiveProperties = (encodedDirectiveComponent:string, directivesProperties:NameIndex<DirectiveAnnotation>):NameIndex<DirectiveAnnotation> => {
    let result = new NameIndex<DirectiveAnnotation>();
    if(!encodedDirectiveComponent || encodedDirectiveComponent.length<1 || !encodedDirectiveComponent.includes(ENCODING_FLAG)){
        return result;
    }
    const encodedDirectiveMatches = [...encodedDirectiveComponent.matchAll(ENCODED_DIRECTIVE_REGEXP)].map(match => match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH])
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
const parseDirectives = (rawGraphQLSchemaText:string):{encodedDirectivesSchemaText:string,directiveProperties:NameIndex<DirectiveAnnotation>}=>{
    let directiveProperties=new NameIndex<DirectiveAnnotation>()
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
            directiveProperties[directiveId]={name};
            let tailGroup=p2
            let parameters;
            if(height>0){
                tailGroup=p3
                parameters=getDirectiveParameters(p2,directiveProperties)      
            }

            if(parameters){
                directiveProperties[directiveId].parameters=parameters
            }
            if(name){
                directiveProperties[directiveId].name=name
            }
            if(height){
                directiveProperties[directiveId].height=height
            }
            return ` ${directiveId}${tailGroup}`;
        })
        height++;
    }
    
    return {
        encodedDirectivesSchemaText,directiveProperties
    }
}



//parses parameters inside directives, pull encoded directives from directiveProperties, and deletes ones that have been used
const getDirectiveParameters = (rawParametersFieldText:string, directivesProperties:NameIndex<DirectiveAnnotation>):NameIndex<ParameterComponent> => {
    let directiveParameters = new NameIndex<ParameterComponent>();
    rawParametersFieldText.split(',').map(line=>line.trim()).filter(line=>line.length>0).forEach((parameter) => {
        const parameterName = parameter.split(':')[0].trim()
        let parameterType = parameter.split(':')[1]
        const directivesForParameter = [...parameter.matchAll(ENCODED_DIRECTIVE_REGEXP)].map(match => match[ENCODED_DIRECTIVE_REGEXP_GROUPS.FULL_MATCH].trim());
        directiveParameters[parameterName]= new ParameterComponent({
            name: parameterName,
            type: parameterType
        })

        let directives:NameIndex<DirectiveAnnotation>;
        directivesForParameter.forEach((parameterDirectiveId) => {
            if(! directiveParameters[parameterName].directives){
                directiveParameters[parameterName].directives=new NameIndex<DirectiveAnnotation>();
            }
            let directive = directivesProperties[parameterDirectiveId]
            directiveParameters[parameterName].type =parameterType.replace(parameterDirectiveId, '').trim()
            if(directive){
                directiveParameters[parameterName].directives![directive.name]=directive
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