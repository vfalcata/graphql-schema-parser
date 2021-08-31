import {
    getEnums,
    getFieldedTypes,
    getDirectiveDefinitions,
    getScalars,
    getUnions,
} from './encoded-graphql-schema-parser.js'
import {
    parseDirectives
} from './graphql-directive-parser.js'
import {readFileSync} from 'fs'
import {resolve} from 'path';

const generateSchemaObject = () => {
    const file = readFileSync(resolve(__dirname,'./../__test__/fixtures/nested-directives.graphql'), 'utf8');
    const { encodedDirectivesSchemaText, directiveProperties } = parseDirectives(file)
    console.log('encodedDirectivesSchemaText',encodedDirectivesSchemaText)
    console.log('directiveProperties',directiveProperties)
    const types = getFieldedTypes(encodedDirectivesSchemaText,directiveProperties)
    console.log('types',types.objects!.Query_isExtended_.fields!.users.parameters)
    // // console.log('typessss',types.type.Query_isExtended_.directives.include1.parameters)

    // const unions = getUnions(encodedDirectivesSchemaText,directiveProperties)
    // console.log('unions',unions)

    // const scalars = getScalars(encodedDirectivesSchemaText,directiveProperties)
    // console.log('scalars',scalars)

    // const enums = getEnums(encodedDirectivesSchemaText,directiveProperties)
    // console.log('enums',enums)


    // const directiveDefinitions = getDirectiveDefinitions(encodedDirectivesSchemaText,directiveProperties)
    // console.log('directiveDefinitions',directiveDefinitions)

}
//returns graphql schema object, as per typedef

generateSchemaObject();