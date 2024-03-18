import { InputFieldDefinition, NamedComponent, NameIndex, ParameterFieldDefinition } from "./component";
import { DirectibleSchemaTypeDefinition, DirectibleSchemaTypeDefinitionAttrs } from "./base-type";
declare class FieldedTypeDefinition<T extends InputFieldDefinition> extends DirectibleSchemaTypeDefinition {
    description?: string;
    fields?: NameIndex<T>;
}
interface FieldedTypeDefinitionAttrs extends DirectibleSchemaTypeDefinitionAttrs {
}
declare class ObjectDefinition extends FieldedTypeDefinition<ParameterFieldDefinition> {
    implements?: NameIndex<NamedComponent>;
    constructor(objectDefinitionAttrs: ObjectDefinitionAttrs);
}
interface ObjectDefinitionAttrs extends FieldedTypeDefinitionAttrs {
    implements?: NameIndex<NamedComponent>;
}
declare class InterfaceDefinition extends FieldedTypeDefinition<ParameterFieldDefinition> {
}
declare class InputDefinition extends FieldedTypeDefinition<InputFieldDefinition> {
}
export { ObjectDefinition, InterfaceDefinition, InputDefinition };
