import { FieldDefinition, NamedComponent, NameIndex, ParameterizibleFieldDefinition } from "./component";
import { DirectibleSchemaTypeDefinition,DirectibleSchemaTypeDefinitionAttrs } from "./base-type";


class FieldedTypeDefinition<T extends FieldDefinition> extends DirectibleSchemaTypeDefinition {
    description?:string;
    fields?:NameIndex<T>
}
interface FieldedTypeDefinitionAttrs extends DirectibleSchemaTypeDefinitionAttrs{

}
class ObjectDefinition extends FieldedTypeDefinition<ParameterizibleFieldDefinition>{
    implements?:NameIndex<NamedComponent>
    constructor(objectDefinitionAttrs:ObjectDefinitionAttrs){
        super(objectDefinitionAttrs)
        this.implements=objectDefinitionAttrs.implements;
    }
}

interface ObjectDefinitionAttrs extends FieldedTypeDefinitionAttrs{
    implements?:NameIndex<NamedComponent>
}

class InterfaceDefinition extends FieldedTypeDefinition<FieldDefinition>{
    
}


class InputDefinition extends FieldedTypeDefinition<FieldDefinition>{

}

export {
    ObjectDefinition,
    InterfaceDefinition,
    InputDefinition
}