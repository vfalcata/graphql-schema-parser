import { InputFieldDefinition, NamedComponent, NameIndex, ParameterFieldDefinition } from "./component";
import { DirectibleSchemaTypeDefinition,DirectibleSchemaTypeDefinitionAttrs } from "./base-type";


class FieldedTypeDefinition<T extends InputFieldDefinition> extends DirectibleSchemaTypeDefinition {
    description?:string;
    fields?:NameIndex<T>
}
interface FieldedTypeDefinitionAttrs extends DirectibleSchemaTypeDefinitionAttrs{

}
class ObjectDefinition extends FieldedTypeDefinition<ParameterFieldDefinition>{
    implements?:NameIndex<NamedComponent>
    constructor(objectDefinitionAttrs:ObjectDefinitionAttrs){
        super(objectDefinitionAttrs)
        this.implements=objectDefinitionAttrs.implements;
    }
}

interface ObjectDefinitionAttrs extends FieldedTypeDefinitionAttrs{
    implements?:NameIndex<NamedComponent>
}

class InterfaceDefinition extends FieldedTypeDefinition<ParameterFieldDefinition>{
    
}


class InputDefinition extends FieldedTypeDefinition<InputFieldDefinition>{

}

export {
    ObjectDefinition,
    InterfaceDefinition,
    InputDefinition
}