import {
    getEnums,
    getFieldedTypes,
    getDirectiveDefinitions,
    getScalars,
    getUnions,
} from './encoded-graphql-schema-parser'
import {
    parseDirectives
} from './graphql-directive-parser'
import {readFileSync} from 'fs'
import {resolve} from 'path';
import { GraphQLSchema,GraphQLSchemaObject } from '../typedefs/graphql-schema';

const generateSchemaObject = (rawGraphqlSchemaText:string,name:string):GraphQLSchemaObject => {
    const { encodedDirectivesSchemaText, directiveProperties } = parseDirectives(rawGraphqlSchemaText)
    const types = getFieldedTypes(encodedDirectivesSchemaText,directiveProperties)
    const unions = getUnions(encodedDirectivesSchemaText,directiveProperties)
    const scalars = getScalars(encodedDirectivesSchemaText,directiveProperties)
    const enums = getEnums(encodedDirectivesSchemaText,directiveProperties)
    const directiveDefinitions = getDirectiveDefinitions(encodedDirectivesSchemaText,directiveProperties)

    // console.log('encodedDirectivesSchemaText',encodedDirectivesSchemaText)
    // console.log('directiveProperties',directiveProperties)
    // console.log('types',types)
    // console.log('unions',unions)
    // console.log('scalars',scalars)
    // console.log('enums',enums)
    // console.log('directiveDefinitions',directiveDefinitions)

    let result = new  GraphQLSchema({name})
    result.objects=types.objects
    result.interfaces=types.interfaces
    result.inputs=types.inputs
    result.enums=enums
    result.directiveDefinitions=directiveDefinitions
    result.scalars=scalars
    result.unions=unions
    return result.getSchemaObject();
}
//returns graphql schema object, as per typedef

export {
    generateSchemaObject
}