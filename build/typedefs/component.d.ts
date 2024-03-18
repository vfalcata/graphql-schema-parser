declare class NameIndex<TYPE extends NamedComponent> {
    [index: string]: TYPE;
}
declare class NamedComponent {
    name: string;
    constructor(namedComponentAttrs: NamedComponentAttrs);
}
interface NamedComponentAttrs {
    name: string;
}
interface DirectibleComponentAttrs extends NamedComponentAttrs {
    directives?: NameIndex<DirectiveAnnotation>;
}
declare abstract class DirectibleComponent extends NamedComponent {
    directives?: NameIndex<DirectiveAnnotation>;
    constructor(directibleComponentAttrs: DirectibleComponentAttrs);
}
declare class DirectiveAnnotation extends NamedComponent {
    parameters?: NameIndex<ParameterComponent>;
    height?: number;
    constructor(directiveAnnotationAttrs: DirectiveAnnotationAttrs);
}
interface DirectiveAnnotationAttrs extends DirectibleComponentAttrs {
    parameters?: NameIndex<ParameterComponent>;
    height?: number;
}
declare class ParameterComponent extends DirectibleComponent {
    type: string;
    constructor(parameterComponentAttrs: ParameterComponentAttrs);
}
interface ParameterComponentAttrs extends DirectibleComponent {
    type: string;
}
declare class DescribableParameterComponent extends ParameterComponent {
    description?: string;
    constructor(describableParameterComponentAttrs: DescribableParameterComponentAttrs);
}
interface DescribableParameterComponentAttrs extends ParameterComponentAttrs {
    description?: string;
}
declare class InputFieldDefinition extends ParameterComponent {
    description?: string;
    constructor(inputFieldDefinitionAttrs: InputFieldDefinitionAttrs);
}
interface InputFieldDefinitionAttrs extends ParameterComponentAttrs {
    description?: string;
}
declare class ParameterFieldDefinition extends InputFieldDefinition {
    parameters?: NameIndex<DescribableParameterComponent>;
    constructor(parameterFieldDefinitionAttrs: ParameterFieldDefinitionAttrs);
}
interface ParameterFieldDefinitionAttrs extends InputFieldDefinitionAttrs {
    parameters?: NameIndex<DescribableParameterComponent>;
}
export { DirectibleComponent, DirectibleComponentAttrs, DirectiveAnnotation, DirectiveAnnotationAttrs, DescribableParameterComponent, ParameterComponent, ParameterComponentAttrs, ParameterFieldDefinition, ParameterFieldDefinitionAttrs, InputFieldDefinition, InputFieldDefinitionAttrs, NameIndex, NamedComponent, NamedComponentAttrs };
