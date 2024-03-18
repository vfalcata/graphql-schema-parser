import { DirectibleComponent, DirectibleComponentAttrs, NameIndex } from './component';
import { UnionDefinition, EnumDefinition, DirectiveDefinition } from './element-definition';
import { ObjectDefinition, InterfaceDefinition, InputDefinition } from './fielded-type';
import { ScalarDefinition } from './base-type';
declare class GraphQLSchema extends DirectibleComponent {
    objects?: NameIndex<ObjectDefinition>;
    scalars?: NameIndex<ScalarDefinition>;
    interfaces?: NameIndex<InterfaceDefinition>;
    unions?: NameIndex<UnionDefinition>;
    enums?: NameIndex<EnumDefinition>;
    inputs?: NameIndex<InputDefinition>;
    directiveDefinitions?: NameIndex<DirectiveDefinition>;
    constructor(graphQLSchemaAttrs: GraphQLSchemaAttrs);
    getSchemaObject(): GraphQLSchemaAttrs;
}
interface GraphQLSchemaAttrs extends DirectibleComponentAttrs {
    name: string;
    objects?: NameIndex<ObjectDefinition>;
    scalars?: NameIndex<ScalarDefinition>;
    interfaces?: NameIndex<InterfaceDefinition>;
    unions?: NameIndex<UnionDefinition>;
    enums?: NameIndex<EnumDefinition>;
    inputs?: NameIndex<InputDefinition>;
    directiveDefinitions?: NameIndex<DirectiveDefinition>;
}
export { GraphQLSchema, GraphQLSchemaAttrs };
