import { DirectiveAnnotation, NamedComponent, NameIndex } from "./component";
declare abstract class SchemaTypeDefinition extends NamedComponent {
    description?: string;
    isExtended: boolean;
    constructor(schemaTypeDefinitionAttrs: SchemaTypeDefinitionAttrs);
}
interface SchemaTypeDefinitionAttrs {
    name: string;
    description?: string;
    isExtended: boolean;
}
declare abstract class DirectibleSchemaTypeDefinition extends SchemaTypeDefinition {
    directives?: NameIndex<DirectiveAnnotation>;
    constructor(directibleSchemaTypeDefinitionAttrs: DirectibleSchemaTypeDefinitionAttrs);
}
interface DirectibleSchemaTypeDefinitionAttrs extends SchemaTypeDefinitionAttrs {
    directives?: NameIndex<DirectiveAnnotation>;
}
declare class ScalarDefinition extends DirectibleSchemaTypeDefinition {
    constructor(scalarTypeAttrs: ScalarTypeAttrs);
}
interface ScalarTypeAttrs extends SchemaTypeDefinitionAttrs {
}
export { SchemaTypeDefinition, SchemaTypeDefinitionAttrs, DirectibleSchemaTypeDefinition, DirectibleSchemaTypeDefinitionAttrs, ScalarDefinition };
