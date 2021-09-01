/* Convert schema file to text for testing */
import { readFileSync } from 'fs'
import { resolve } from 'path';

const rawSchemaText = readFileSync(resolve(__dirname, './test-schema.graphql'), 'utf8');
export{
    rawSchemaText
}