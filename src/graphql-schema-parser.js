import {
    getEnums,
    getTypes,
    getDirectiveDefinitions,
    getScalars,
    getUnions,
} from './encoded-graphql-schema-parser.js'
import {
    parseDirectives
} from './graphql-directive-parser.js'
import {readFileSync} from 'fs'
import {resolve, dirname} from 'path';
import { fileURLToPath } from 'url';
const generateSchemaObject = (graphqlSchemaTextString) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const file = readFileSync(resolve(__dirname,'./__test__/fixtures/testschema.graphql'), 'utf8');
    console.log(file)
    const { encodedDirectivesSchemaText, directiveProperties } = parseDirectives(graphqlSchemaTextString)
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

    const enums = getEnums(encodedDirectivesSchemaText,directiveProperties)
    console.log('enums',enums)

    const scalars = getScalars(encodedDirectivesSchemaText,directiveProperties)
    console.log('enums',scalars)

}
//returns graphql schema object, as per typedef

generateSchemaObject('');