import {
    getEnums,
    getTypes,
    getDirectiveDefinitions,
    getScalars,
    getUnions,
} from './encoded-graphql-schema-parser'

const generateSchemaObject = (graphqlSchemaTextString) => {
    const { encodedDirectivesSchemaText, directiveProperties } = encodeAllDirectives(graphqlSchemaTextString)
    console.log('enco',directiveProperties)
    const types = getTypes(encodedDirectivesSchemaText,directiveProperties)
    console.log('types',types)
    // // console.log('typessss',types.type.Query_isExtended_.directives.include1.parameters)

    const unions = getUnions(encodedDirectivesSchemaText,directiveProperties)
    console.log('unions',unions)

    const scalars = getScalars(encodedDirectivesSchemaText,directiveProperties)
    console.log('scalars',scalars)

    const enums = getEnums(encodedDirectivesSchemaText,directiveProperties)
    console.log('enums',enums)
}
//returns graphql schema object, as per typedef

generateSchemaObject(file)