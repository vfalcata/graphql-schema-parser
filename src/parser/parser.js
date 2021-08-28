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

// const OBJECT_LEVEL_REGEX=/(extend\s+){0,1}(type|interface|input){1}\s+(\w+){1}(\s+implements\s+){0,1}([\s\w&]*)([@\s\w,:\(\)!\[\]]*){0,1}{([^}]+)}/gm
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

// const FIELD_LEVEL_DIRECTIVE_ENCODED_REGEX=/^\s*(\w+)\({0,1}([\w\s,!\[\]:]*)\){0,1}\s*:\s*([\w!\[\]]*){1}\s*([@!\w\s\(\),:]*)$/gm
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
const DIRECTIVE_NO_PARAMETER_REGEX = /@(\w+)(?=\s+(?!\s*\()|\s*\)|\s*{|\s*,\s*)/g
const DIRECTIVE_NO_PARAMETER_REGEX_GROUPS = {
    FULL_MATCH_GROUP: 0,
    NAME_GROUP: 1,
}

const ENCODED_DIRECTIVE_REGEX = /@+[0-9A-Za-z]+@+/g
const ENCODED_DIRECTIVE_REGEX_GROUPS = {
    FULL_MATCH_GROUP: 0,
}



//returns parameters for a field including its name and type
const getParameterProperties = (rawParametersText, directiveMap) => {
    let results = {}
    results.directiveIds = []
    rawParametersText.split(',').forEach((param) => {
        const paramName = param.split(':')[0].trim()
        let paramType = param.split(':')[1].trim()

        const encodedDirectiveMatches = [...param.matchAll(ENCODED_DIRECTIVE_REGEX)].map(match => match[ENCODED_DIRECTIVE_REGEX.FULL_MATCH_GROUP])
        encodedDirectiveMatches.forEach(directiveId => paramType = paramType.replace(directiveId).trim())
        results.directives = getDirectiveProperties(encodedDirectiveMatches, directiveMap)
        results[paramName] = paramType.trim()
    })
    return results;
}

const getDirectiveProperties = (directiveId, directiveMap) => {
    let result = {}
    directives.forEach(directive => {
        const directiveName = directiveMap[directiveId].name
        result[directiveName] = directiveMap[directiveId]
    })
    return result
}




const encodeAllNonParameterDirectives = (rawGraphQLSchemaText) => {
    let level = 1
    let encodedDirectivesSchema = rawGraphQLSchemaText;
    let getdDirectives = {};
    simpleDirectiveMatches = [...rawGraphQLSchemaText.matchAll(DIRECTIVE_NO_PARAMETER_REGEX)]
    simpleDirectiveMatches
        .forEach((match) => {
            textMatch = match[DIRECTIVE_NO_PARAMETER_REGEX_GROUPS.FULL_MATCH_GROUP]
            const randomId = '@'.repeat(level) + generateRandomId(6) + '@'.repeat(level)
            encodedDirectivesSchema = encodedDirectivesSchema.replace(textMatch.trim(), randomId)
            getdDirectives[randomId] = {
                name: match[DIRECTIVE_NO_PARAMETER_REGEX_GROUPS.NAME_GROUP]
            }
        })
    return { encodedDirectivesSchema, getdDirectives }
}

const generateDirectiveId = (level) => {
    return '@'.repeat(level) + generateRandomId(6) + '@'.repeat(level)
}


const getDirectiveParameters = (rawParametersFieldText, getdDirectives) => {
    let directiveParameters = {}
    let usedDirectives = []
    rawParametersFieldText.forEach((parameter) => {
        const parameterName = parameter.split(':')[0].trim()
        let parameterType = parameter.split(':')[1]
        const directivesForParameter = [...parameter.matchAll(ENCODED_DIRECTIVE_REGEX)].map(match => match[ENCODED_DIRECTIVE_REGEX_GROUPS.FULL_MATCH_GROUP].trim());
        directiveParameters[parameterName] = {
            name: parameterName,
            type: parameterType
        }

        directivesForParameter.forEach((parameterDirectiveId) => {
            parameterType = parameterType.replace(parameterDirectiveId, '').trim()
            directiveParameters[parameterName] = {
                directives: getdDirectives[parameterDirectiveId].directives,
                type: parameterType
            }
            usedDirectives.push(parameterDirectiveId);
        })
    })
    return { directiveParameters, usedDirectives }
}


const encodeAllDirectives = (rawGraphQLSchemaText) => {
    let height = 1
    let { encodedDirectivesSchemaText, directivesProperties } = encodeAllNonParameterDirectives(rawGraphQLSchemaText);
    let directiveMatches = [];

    do {
        directiveMatches = [...encodedDirectivesSchemaText.matchAll(DIRECTIVE_WITH_PARAMETER_REGEX)]
        directiveMatches.forEach((directiveMatch) => {
            const directiveId = generateDirectiveId(height)
            const directiveGroup = directiveMatch[DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS.FULL_MATCH_GROUP].trim();;
            const directiveName = directiveMatch[DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS.NAME_GROUP].trim();
            const parameters = directiveMatch[DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS.PARAMETER_GROUP].split(',')
            encodedDirectivesSchemaText = encodedDirectivesSchemaText.replace(directiveGroup, directiveId)
            directivesProperties[directiveId] = { name: directiveName }
            const { directiveParameters, usedDirectives } = getDirectiveParameters(parameters, directivesProperties)
            usedDirectives.forEach(parameterDirectiveId => delete directivesProperties[parameterDirectiveId])
            directivesProperties[directiveId].parameters = directiveParameters
        })
        height++
    } while (directiveMatches.length > 0)
    return { encodedDirectivesSchemaText, directivesProperties }
}


const getTypes = (rawGraphQLSchemaText, directivesProperties) => {
    const typeMatches = [...rawGraphQLSchemaText.matchAll(OBJECT_LEVEL_REGEX)]
    typeMatches.forEach(typeMatch => delete typeMatch.input)
    let results = {};
    typeMatches.forEach((match) => {
        const typeLabel = match[OBJECT_LEVEL_REGEX_GROUPS.TYPE_LABEL_GROUP_TAG]
        const name = match[OBJECT_LEVEL_REGEX_GROUPS.NAME_GROUP]
        const directives = match[OBJECT_LEVEL_REGEX_GROUPS.OBJECT_DIRECTIVE_GROUP]
        const isExtended = match[OBJECT_LEVEL_REGEX_GROUPS.EXTENDS_TAG_GROUP]
        const implements = match[OBJECT_LEVEL_REGEX_GROUPS.IMPLEMENTS_GROUP]
        const rawTextFields = match[OBJECT_LEVEL_REGEX_GROUPS.BODY_GROUP]

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
                results[typeLabel][name].directives = getDirectiveProperties(directives, directivesProperties)
            }
            results[typeLabel][name].fields = getFieldProperties(rawTextFields)
        }
    })
    return results
}

const ENUM_REGEX = /(extend\s+){0,1}enum\s+(\w+){1}([@\s\w,:\(\)!\[\]]*){0,1}{([^}]+)}/gm
const ENUM_REGEX_GROUPS = {
    EXTENDS_TAG_GROUP: 1,
    NAME_GROUP: 2,
    DIRECTIVE_GROUP: 3,
    VALUE_GROUP: 4

}
const getEnums = (graphqlSchemaString) => {
    // console.log('ebnums',
    //     [...graphqlSchemaString.matchAll(ENUM_REGEX)]
    // )
    let results = {}
    const enumMatches = [...graphqlSchemaString.matchAll(ENUM_REGEX)]
    enumMatches.forEach(typeMatch => delete typeMatch.input)
    enumMatches.forEach((match) => {

        const name = match[ENUM_REGEX_GROUPS.NAME_GROUP]
        const isExtended = match[ENUM_REGEX_GROUPS.EXTENDS_TAG_GROUP]
        const directives = match[ENUM_REGEX_GROUPS.DIRECTIVE_GROUP]
        const values = match[ENUM_REGEX_GROUPS.VALUE_GROUP]
        getEnumValues(values)
    })
}

const getEnumValues = (rawEnumValuesText) => {
    let results = {}
    console.log(
        rawEnumValuesText.split('\n')
            .filter(line => line.length > 0)
            .map(line => line.trim())
            .map((line) => {
                return {
                    name: line
                }
            })
    )
}




const getFieldProperties = (rawTextFields, directivesProperties) => {
    let results = {}
    let argDirectives = []
    const sanitizedTextFields = rawTextFields
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)

    sanitizedTextFields.map(line => [...line.matchAll(FIELD_LEVEL_REGEX)])
        .forEach((regexGroups) => {
            return regexGroups.map((regexGroup) => {
                const name = regexGroup[FIELD_LEVEL_REGEX_GROUPS.NAME_GROUP]
                const returnType = regexGroup[FIELD_LEVEL_REGEX_GROUPS.RETURN_TYPE_GROUP]
                const directives = regexGroup[FIELD_LEVEL_REGEX_GROUPS.DIRECTIVE_GROUP]
                const parameters = regexGroup[FIELD_LEVEL_REGEX_GROUPS.PARAMETER_GROUP]
                if (name && returnType) {
                    results[name] = {}
                    results[name].returnType = returnType
                    if (directives) {
                        results[name].directives = getDirectiveProperties(directives, directivesProperties)
                    }
                    if (parameters) {
                        results[name].parameters = getParameterProperties(parameters)
                    }
                }
            })
        })
    return rawTextFields
}



console.log(generateSchemaObject(file))
const generateSchemaObject = (graphqlSchemaTextString) => {

    const { encodedDirectivesSchemaText, directivesProperties } = encodeAllDirectives(graphqlSchemaTextString)
    const types = getTypes(encodedDirectivesSchemaText,directivesProperties)
    console.log('types',types)
    return results
}

const getUnions = () => {

}
const getScalars = () => {

}

const populateSchemaObjectWithDirectives = (schemaObject, directiveMap) => {

}





// =======MARKED FOR DELETION===============MARKED FOR DELETION===============MARKED FOR DELETION===============MARKED FOR DELETION========
// export {generateSchemaObject}

// const getEncodeText = (sourceText, replacement, regexp, group = 1) => {
//     let encodedText = sourceText
//     matches = [...sourceText.matchAll(regexp)]
//     matches.forEach((match) => {
//         let textMatch = match[group]
//         encodedText = encodedText.replace(replacement)
//         getdDirectives[randomId] = {
//             name: match[DIRECTIVE_NO_PARAMETER_REGEX_GROUPS.NAME_GROUP]
//         }
//     })
// }
//returns all directives
// const getDirectiveProperties=(rawDirectiveTextField)=>{
//     let result = {}
//     let matches= [...rawDirectiveTextField.matchAll(DIRECTIVE_LEVEL_REGEX)]
//         matches.forEach((directive)=>{
//             const directiveName=directive[DIRECTIVE_LEVEL_REGEX_GROUPS.NAME_GROUP]
//             const parameters=directive[DIRECTIVE_LEVEL_REGEX_GROUPS.PARAMETER_GROUP]
//             result[directiveName]=getParameterProperties(parameters)
//         })         
//        return result
// }
////////////////OLD VERSION
// const encodeAllDirectives=(rawGraphQLSchemaText)=>{
//     let level=1
//     let {encodedDirectivesSchema, getdDirectives}=encodeAllNonParameterDirectives(rawGraphQLSchemaText);
//     let directiveMatches=[];

//     do{        
//         directiveMatches = [...encodedDirectivesSchema.matchAll(DIRECTIVE_WITH_PARAMETER_REGEX)]
//         directiveMatches.forEach((directiveMatch)=>{
//             const directiveId=generateDirectiveId(level)
//             const directiveGroup=directiveMatch[DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS.FULL_MATCH_GROUP].trim();;       
//             const directiveName=directiveMatch[DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS.NAME_GROUP].trim();
//             const parameters=directiveMatch[DIRECTIVE_WITH_PARAMETER_REGEX_GROUPS.PARAMETER_GROUP].split(',')
//             encodedDirectivesSchema=encodedDirectivesSchema.replace(directiveGroup,directiveId)

//             getdDirectives[directiveId]={name:directiveName}
//             const {directiveParameters, usedDirectives} = getDirectiveParameters(parameters,getdDirectives)
//             usedDirectives.forEach(parameterDirectiveId => delete getdDirectives[parameterDirectiveId])
//             getdDirectives[directiveId].parameters=directiveParameters
//             // parameters.forEach((parameter)=>{

//             //     if(!getdDirectives[directiveId].parameters){
//             //         getdDirectives[directiveId].parameters={}
//             //     }
//             //     const parameterName=parameter.split(':')[0].trim()
//             //     let parameterType=parameter.split(':')[1]
//             //     let parameterDirectives={};
//             //     const directivesForParameter=[...parameter.matchAll(ENCODED_DIRECTIVE_REGEX)].map(match=>match[ENCODED_DIRECTIVE_REGEX_GROUPS.FULL_MATCH_GROUP].trim());
//             //     getdDirectives[directiveId].parameters[parameterName]={
//             //         name:parameterName,                    
//             //         type:parameterType    
//             //     }                

//             //     directivesForParameter.forEach((parameterDirectiveId)=>{
//             //         parameterType=parameterType.replace(parameterDirectiveId,'').trim()
//             //         getdDirectives[directiveId].parameters[parameterName]={
//             //             directives:getdDirectives[parameterDirectiveId].directives, 
//             //             type:parameterType                        
//             //         }
//             //         if(directiveName === 'include1'){
//             //             console.log('include1',getdDirectives[directiveId].parameters[parameterName])
//             //         }
//             //         delete getdDirectives[parameterDirectiveId];
//             //     })
//             //     console.log('pasta5',getdDirectives)
//             // })
//         })
//         level++
//     }while(directiveMatches.length>0)
//     console.log('pasta5',getdDirectives)
//     console.log('pasta5',encodedDirectivesSchema)

// }


const cleanTextBody = (matches) => {
    let results = {};
    // console.log('asdfasdf',matches[0])


    matches.forEach((match) => {
        results[match[OBJECT_LEVEL_REGEX_GROUPS.NAME_GROUP]] = {}
        if (match[OBJECT_LEVEL_REGEX_GROUPS.EXTENDS_TAG_GROUP]) {
            results[match[OBJECT_LEVEL_REGEX_GROUPS.NAME_GROUP]].extends = true
        }
        if (match[OBJECT_LEVEL_REGEX_GROUPS.IMPLEMENTS_TAG_GROUP]) {
            results[match[OBJECT_LEVEL_REGEX_GROUPS.NAME_GROUP]].implements = match[OBJECT_LEVEL_REGEX_GROUPS.IMPLEMENTS_GROUP].trim()
        }
        if (match[OBJECT_LEVEL_REGEX_GROUPS.OBJECT_DIRECTIVE_GROUP]) {
            results[match[OBJECT_LEVEL_REGEX_GROUPS.NAME_GROUP]].directives = match[OBJECT_LEVEL_REGEX_GROUPS.OBJECT_DIRECTIVE_GROUP].trim()
        }
        results[match[OBJECT_LEVEL_REGEX_GROUPS.NAME_GROUP]].rawTextfields = match[OBJECT_LEVEL_REGEX_GROUPS.BODY_GROUP]
        // .split("\n")
        // .filter(line => line.length>0)
        // .map(line=>line.replace(/\s+/g,""))

    })
    return results
}


//finds all properties that have a directive and returns an object where the key is the name of the text field and the value is the original raw text field
const getRawTextFieldsWithDirective = (rawTextFields) => {
    let result = {};
    rawTextFields
        .filter(rawTextField => rawTextField.includes('@'))
        .map(rawTextField => extractFieldNameAndRawText(rawTextField))
        .forEach(rawTextField => result[rawTextField.textFieldName] = rawTextField.textField)

    return result
}

//finds all properties that have a parameter and returns an object where the key is the name of the text field and the value is the original raw text field
const getRawTextFieldsWithParameters = (rawTextFields) => {
    let result = {}
    rawTextFields
        .filter(rawTextField => rawTextField.match(/^\w*\([\w,:\[\]!]+\)/g))
        .map(rawTextField => extractFieldNameAndRawText(rawTextField))
        .forEach(rawTextField => result[rawTextField.textFieldName] = rawTextField.textField)
    return result
}

//finds all properties that have no directives or parameter and returns an object where the key is the name of the text field and the value is the original raw text field
const getRawTextFieldWithTypeOnly = (rawTextFields) => {
    let result = {}
    rawTextFields
        .filter(rawTextField => !rawTextField.includes('(') && !rawTextField.includes(')') && !rawTextField.includes(',') && !rawTextField.includes('@'))
        .map(rawTextField => extractFieldNameAndRawText(rawTextField))
        .forEach(rawTextField => result[rawTextField.textFieldName] = rawTextField.textField)
    return result
}

const extractFieldNameAndRawText = (rawTextField) => {
    let textField = {};
    textField[rawTextField.replace('(', ':').split(':')[0]] = rawTextField
    return {
        textFieldName: rawTextField.replace('(', ':').split(':')[0],
        textField: rawTextField
    }

}
const getFieldProperties = (rawTextFields) => {
    const rawTextFieldsWithDirectives = getRawTextFieldsWithDirective(rawTextFields)
    const rawTextFieldsWithParameters = getRawTextFieldsWithParameters(rawTextFields)
    const rawTextFieldWithTypeOnly = getRawTextFieldWithTypeOnly(rawTextFields)
    const fieldNamesArray = rawTextFields.map(rawTextField => rawTextField.replace('(', ':').split(':')[0]);
    let fieldNames = fieldNamesArray.reduce((object, fieldName) => (object[fieldName] = {}, object), {});
    let results = {}
    fieldNamesArray.forEach((fieldName) => {
        results[fieldName] = {}
        if (rawTextFieldsWithDirectives[fieldName]) {
            results[fieldName]['directives'] = getDirectiveProperties(rawTextFieldsWithDirectives[fieldName])
            results[fieldName].returnType = getReturnType(rawTextFieldsWithDirectives[fieldName])
        }

        if (rawTextFieldsWithParameters[fieldName]) {
            results[fieldName]['parameters'] = getParameters(rawTextFieldsWithParameters[fieldName])
            results[fieldName].returnType = getReturnType(rawTextFieldsWithParameters[fieldName])
        }

        if (rawTextFieldWithTypeOnly[fieldName]) {
            results[fieldName] = {
                returnType: getReturnType(rawTextFieldWithTypeOnly[fieldName])
            }
        }


    })
    return results
}


const getFieldsFromTypeBodyText = (graphqlTypeBodyText) => {
    let result = {}
    result = graphqlTypeBodyText
        .split("\n")
        .filter(line => line.length > 0 && line.includes(":"))
        .map(line => line.replace(/\s+/g, ""))
    return result
}

const getTypesWithRawBody = (graphqlSchemaString) => {
    // const regexp = /\s*type\s*(\w+)\s*{\s*/gm;
    // const regexpRootObjects= /type\s*(\w*)\s*([\s\w&]*)([@\s\w,:\(\)!\[\]]*){([^}]+)}/gm;
    const regexpRootObjects = /(extend\s+){0,1}(type|interface|input){1}\s+(\w+)(\s+implements\s+){0,1}([\s\w&]*)([@\s\w,:\(\)!\[\]]*){([^}]+)}/gm
    const regexpExtendedObjects = /(extend\s+){0,1}type\s+(\w*)(\s+implements\s+){0,1}([\s\w&]*)([@\s\w,:\(\)!\[\]]*){([^}]+)}/gm;
    const regexpInputs = /input\s*(\w*)\s*{([^}]+)}/gm;
    const regexpEnums = /enum\s*(\w*)\s*{([^}]+)}/g;
    const regexpInterfaces = /interface\s*(\w*)\s*{([^}]+)}/g;
    const regexpExtendInterfaces = /extend\s*interface\s*(\w*)\s*{([^}]+)}/g;
    const regexpUnions = /union\s*(\w*)\s*=\s*([\w\s|]+)/g;
    const regexpUnionExtensions = /extend\s*union\s*(\w*)\s*=\s*([\w\s|]+)/g;
    const regexpDirectiveDefinitions = /directive\s*@(\w*)\s*on\s*([\w\s|]+)/g;
    const regexpScalar = /scalar\s*(\w*)\s*/g;
    const regexpObjectsWithDirectives = /type\s*(\w*)\s*@(\w*)[(]{0,1}([\w:\s,!\[\]]+)[)]{0,1}\s*{/g
    //const regexp= /type\s*(\w*)/g;
    //     directive @example on
    //   | FIELD
    //   | FRAGMENT_SPREAD
    //   | INLINE_FRAGMENT
    let results = {};
    const rootObjectMatches = [...graphqlSchemaString.matchAll(regexpRootObjects)]
    const extendObjectMatches = [...graphqlSchemaString.matchAll(regexpExtendedObjects)]
    const inputMatches = [...graphqlSchemaString.matchAll(regexpInputs)]
    const enumMatches = [...graphqlSchemaString.matchAll(regexpEnums)]
    const interfaceMatches = [...graphqlSchemaString.matchAll(regexpInterfaces)]
    const extendInterfaceMatches = [...graphqlSchemaString.matchAll(regexpExtendInterfaces)]
    const directiveDefinitionsMatches = [...graphqlSchemaString.matchAll(regexpDirectiveDefinitions)]
    const scalarMatches = [...graphqlSchemaString.matchAll(regexpScalar)]
    const unionMatches = [...graphqlSchemaString.matchAll(regexpUnions)]
    const unionExtensionMatches = [...graphqlSchemaString.matchAll(regexpUnionExtensions)]
    const directivesOnTypeMatches = [...graphqlSchemaString.matchAll(regexpObjectsWithDirectives)]


    // QUERY ..query root
    // MUTATION .. mutation root
    // SUBSCRIPTION ...
    return {
        objects: cleanTextBody(rootObjectMatches),
        // extendedObjects:cleanTextBody(extendObjectMatches),
        // inputs:cleanTextBody(inputMatches),
        // interfaces: cleanTextBody(interfaceMatches),
        // extendedInterfaces: cleanTextBody(extendInterfaceMatches),
        // enums: cleanTextBody(enumMatches),
        // unions: cleanTextBody(unionMatches),
        // extendedUnions:cleanTextBody(unionExtensionMatches),
        // scalars: cleanTextBody(scalarMatches),
        // directiveDefinitions:cleanTextBody(directiveDefinitionsMatches),
        // objectsWithDirectives:cleanTextBody(directivesOnTypeMatches)
    };
}

// const EXTENDS_TAG_GROUP=1
// const NAME_GROUP=2
// const IMPLEMENTS_TAG_GROUP=4
// const IMPLEMENTS_GROUP=4
// const DIRECTIVE_GROUP=5
// const BODY_GROUP=6
const getParameters = (rawTextField) => {

    let matches = [...rawTextField.matchAll(/^(\w*)\(([\w:\s,!\[\]]+)\):\s*([\w!\[\]]*)/g)]

    let result = getParameterProperties(matches[0][2])
    // result.returnType=matches[0][3]
    // matches.forEach((param)=>{
    //     result[param[1]]=getParameterProperties(param[2])
    // })

    return result
}
const getReturnType = (rawTextField) => {
    let matches = [...rawTextField.matchAll(/^(\w*)\(([\w:\s,!\[\]]+)\):\s*([\w!\[\]]*)/g)]
    return matches[0] ? matches[0][3] : rawTextField.split(':')[1].trim()
}


// const DIRECTIVE_LEVEL_REGEX=/@(\w*)[(]{0,1}([\w:\s,!\[\]]+)[)]{0,1}/g
// const DIRECTIVE_LEVEL_REGEX_GROUPS={
//     NAME_GROUP:1,
//     PARAMETER_GROUP:2
// }


// const getFieldProperties =(rawTextFields, directivesProperties)=>{
//     let results={}
//     let argDirectives=[]
//     const sanitizedTextFields = rawTextFields
//         .split("\n")
//         .map(line => line.trim())
//         .filter(line=>line.length>0)
//     sanitizedTextFields.forEach(textField=>{
//         const tail=/\):\s*([\w\[\]!]*)\s*([\s\w:,@\(\)]*)$/g.exec(textField)
//         const argDirectiveMatch=/^\s*(\w+)\(\s*([\w\s:,]*@)/g.exec(textField)
//         const head=/^\s*\w+\s*\(/g.exec(textField)
//         if(argDirectiveMatch && tail && head){
//         // const removedTail=textField.replace(tail[0],'')
//             let parameters=textField.replace(tail[0],'').replace(head[0],'')


//             console.log('goossgh',parameters)
//             if(argDirectiveMatch){
//                 argDirectives.push(argDirectiveMatch[1])
//             }
//         }



//     })

//     sanitizedTextFields.map(line=> [...line.matchAll(FIELD_LEVEL_REGEX)])
//         .forEach((regexGroups)=>{
//             return regexGroups.map((regexGroup)=>{
//                 const name=regexGroup[FIELD_LEVEL_REGEX_GROUPS.NAME_GROUP]
//                 const returnType=regexGroup[FIELD_LEVEL_REGEX_GROUPS.RETURN_TYPE_GROUP] 
//                 const directives=regexGroup[FIELD_LEVEL_REGEX_GROUPS.DIRECTIVE_GROUP]
//                 const parameters=regexGroup[FIELD_LEVEL_REGEX_GROUPS.PARAMETER_GROUP]
//                 const matchh=/^\s*(\w+)\({0,1}\s*([\w\s:,]*@)/g.exec(regexGroup)
//                 console.log('moodj',matchh)
//                 if(name && returnType){
//                     results[name]={}                   
//                     results[name].returnType=returnType
//                     if(directives){
//                         results[name].directives=getDirectiveProperties(directives)
//                     }
//                     if(parameters){
//                         let parameterProperties=getParameterProperties(parameters)
//                         parameterProperties.forEach((parameterProperty)=>{

//                         })
//                         results[name].parameters=getParameterProperties(parameters)
//                     } 
//                 } 
//             })
//         })
//     return rawTextFields
// }
