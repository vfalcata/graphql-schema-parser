import { DirectiveAnnotation, NameIndex, NamedComponent, NamedComponentAttrs, ParameterComponent } from './component';
import { SchemaTypeDefinition, SchemaTypeDefinitionAttrs } from './base-type';
declare abstract class ElementCollection<TYPE extends Element> extends SchemaTypeDefinition {
    elements: NameIndex<TYPE>;
    constructor(elementCollectionAttrs: ElementCollectionAttrs<TYPE>);
}
interface ElementCollectionAttrs<TYPE extends Element> extends SchemaTypeDefinitionAttrs {
    elements: NameIndex<TYPE>;
}
declare abstract class Element extends NamedComponent {
    constructor(elementAttrs: ElementAttrs);
}
interface ElementAttrs extends NamedComponentAttrs {
}
declare abstract class DirectibleElementCollection<TYPE extends Element> extends ElementCollection<TYPE> {
    directives?: NameIndex<DirectiveAnnotation>;
    constructor(directibleElementCollectionAttrs: DirectibleElementCollectionAttrs<TYPE>);
}
interface DirectibleElementCollectionAttrs<TYPE extends Element> extends ElementCollectionAttrs<TYPE> {
    directives?: NameIndex<DirectiveAnnotation>;
}
declare abstract class DirectibleElement extends Element {
    directives?: NameIndex<DirectiveAnnotation>;
    constructor(directibleElementAttrs: DirectibleElementAttrs);
}
interface DirectibleElementAttrs extends ElementAttrs {
    directives?: NameIndex<DirectiveAnnotation>;
}
declare class EnumDefinition extends DirectibleElementCollection<EnumElement> {
}
declare class EnumElement extends DirectibleElement {
}
declare class UnionElement extends DirectibleElement {
}
declare class UnionDefinition extends DirectibleElementCollection<UnionElement> {
}
declare class DirectiveDefinition extends ElementCollection<DirectiveDefinitionElement> {
    parameters?: NameIndex<ParameterComponent>;
    constructor(directiveDefinitionAttrs: DirectiveDefinitionAttrs);
}
interface DirectiveDefinitionAttrs extends ElementCollectionAttrs<DirectiveDefinitionElement> {
    parameters?: NameIndex<ParameterComponent>;
}
declare class DirectiveDefinitionElement extends Element {
    constructor(elementAttrs: ElementAttrs);
}
declare enum ExecutableDirectiveLocationsEnum {
    QUERY = "QUERY",
    MUTATION = "MUTATION",
    SUBSCRIPTION = "SUBSCRIPTION",
    FIELD = "FIELD",
    FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION",
    FRAGMENT_SPREAD = "FRAGMENT_SPREAD",
    INLINE_FRAGMENT = "INLINE_FRAGMENT"
}
declare enum TypeSystemDirectiveLocationsEnum {
    SCHEMA = "SCHEMA",
    SCALAR = "SCALAR",
    OBJECT = "OBJECT",
    FIELD_DEFINITION = "FIELD_DEFINITION",
    ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION",
    INTERFACE = "INTERFACE",
    UNION = "UNION",
    ENUM = "ENUM",
    ENUM_VALUE = "ENUM_VALUE",
    INPUT_OBJECT = "INPUT_OBJECT",
    INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION"
}
export { EnumDefinition, EnumElement, UnionDefinition, UnionElement, DirectiveDefinition, DirectiveDefinitionElement, DirectiveDefinitionAttrs, ExecutableDirectiveLocationsEnum, TypeSystemDirectiveLocationsEnum, };
