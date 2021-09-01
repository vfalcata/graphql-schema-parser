/* Base types used to compose GraphQL schema object types */
import { DirectiveAnnotation, NamedComponent, NameIndex } from "./component"

abstract class SchemaTypeDefinition extends NamedComponent {
    description?: string
    isExtended: boolean
    constructor(schemaTypeDefinitionAttrs: SchemaTypeDefinitionAttrs) {
        super(schemaTypeDefinitionAttrs)
        if (schemaTypeDefinitionAttrs.description && schemaTypeDefinitionAttrs.description.length > 0) {
            this.description = schemaTypeDefinitionAttrs.description;
        }
        this.isExtended = schemaTypeDefinitionAttrs.isExtended ? true : false
    }
}

interface SchemaTypeDefinitionAttrs {
    name: string
    description?: string
    isExtended: boolean
}

abstract class DirectibleSchemaTypeDefinition extends SchemaTypeDefinition {
    directives?: NameIndex<DirectiveAnnotation>

    constructor(directibleSchemaTypeDefinitionAttrs: DirectibleSchemaTypeDefinitionAttrs) {
        super(directibleSchemaTypeDefinitionAttrs)
        if (directibleSchemaTypeDefinitionAttrs.directives && Object.keys(directibleSchemaTypeDefinitionAttrs.directives).length > 0) {
            this.directives = directibleSchemaTypeDefinitionAttrs.directives;
        }

    }
}

interface DirectibleSchemaTypeDefinitionAttrs extends SchemaTypeDefinitionAttrs {
    directives?: NameIndex<DirectiveAnnotation>
}

class ScalarDefinition extends DirectibleSchemaTypeDefinition {
    constructor(scalarTypeAttrs: ScalarTypeAttrs) {
        super(scalarTypeAttrs);
    }
}

interface ScalarTypeAttrs extends SchemaTypeDefinitionAttrs {

}

export {
    SchemaTypeDefinition,
    SchemaTypeDefinitionAttrs,
    DirectibleSchemaTypeDefinition,
    DirectibleSchemaTypeDefinitionAttrs,
    ScalarDefinition
}