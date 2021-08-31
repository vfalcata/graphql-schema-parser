import { DirectiveAnnotation, NamedComponent,NameIndex } from "./component"

abstract class SchemaTypeDefinition extends NamedComponent{
    description?:string
    isExtended:boolean

    constructor(schemaTypeDefinitionAttrs:SchemaTypeDefinitionAttrs){
        super(schemaTypeDefinitionAttrs)
        this.description=schemaTypeDefinitionAttrs.name;
        this.isExtended=schemaTypeDefinitionAttrs.isExtended?true:false
    }
}
interface SchemaTypeDefinitionAttrs{
    name:string
    description?:string
    isExtended:boolean
}

abstract class DirectibleSchemaTypeDefinition extends SchemaTypeDefinition{
    directives?:NameIndex<DirectiveAnnotation>

    constructor(directibleSchemaTypeDefinitionAttrs:DirectibleSchemaTypeDefinitionAttrs){
        super(directibleSchemaTypeDefinitionAttrs)
        this.directives=directibleSchemaTypeDefinitionAttrs.directives;
    }
}
interface DirectibleSchemaTypeDefinitionAttrs extends SchemaTypeDefinitionAttrs{
    directives?:NameIndex<DirectiveAnnotation>
}

//scalars arent fielded nor elemental 
class ScalarDefinition extends DirectibleSchemaTypeDefinition{
    constructor(scalarTypeAttrs:ScalarTypeAttrs){
        super(scalarTypeAttrs);
    }
}

interface ScalarTypeAttrs extends SchemaTypeDefinitionAttrs{

}


export {
    SchemaTypeDefinition,
    SchemaTypeDefinitionAttrs,
    DirectibleSchemaTypeDefinition,
    DirectibleSchemaTypeDefinitionAttrs,
    ScalarDefinition

}