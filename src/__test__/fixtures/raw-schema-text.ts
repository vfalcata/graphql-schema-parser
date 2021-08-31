import { readFileSync } from 'fs'
import { resolve } from 'path';

const rawSchemaText = readFileSync(resolve(__dirname, './../__test__/fixtures/test-schema.graphql'), 'utf8');
export{
    rawSchemaText
}