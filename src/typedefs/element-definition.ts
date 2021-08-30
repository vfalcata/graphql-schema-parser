import { DirectiveAnnotation, NameIndex, NamedComponent, NamedComponentAttrs, ParameterComponent } from './component';
import {  SchemaTypeDefinition, SchemaTypeDefinitionAttrs } from './base-type';




abstract class ElementCollection<TYPE extends Element> extends SchemaTypeDefinition{
    elements:NameIndex<TYPE>;

    constructor(elementCollectionAttrs:ElementCollectionAttrs<TYPE>){
        super(elementCollectionAttrs)
        this.elements=elementCollectionAttrs.elements?elementCollectionAttrs.elements:new NameIndex<TYPE>();
    }
}

interface ElementCollectionAttrs<TYPE extends Element> extends SchemaTypeDefinitionAttrs{
    elements:NameIndex<TYPE>;
}


abstract class Element extends NamedComponent{  
    constructor(elementAttrs:ElementAttrs){
        super(elementAttrs)
    }
}

interface ElementAttrs extends NamedComponentAttrs{

}

abstract class DirectibleElementCollection<TYPE extends Element> extends ElementCollection<TYPE>{
    directives?: NameIndex<DirectiveAnnotation>;

    constructor(directibleElementCollectionAttrs:DirectibleElementCollectionAttrs<TYPE>){
        super(directibleElementCollectionAttrs)
        this.directives=directibleElementCollectionAttrs.directives?directibleElementCollectionAttrs.directives:new NameIndex<DirectiveAnnotation>();
        this.isExtended=false;

    }
}

interface DirectibleElementCollectionAttrs<TYPE extends Element> extends ElementCollectionAttrs<TYPE>{
    directives?: NameIndex<DirectiveAnnotation>;
}

abstract class DirectibleElement extends Element{
    directives?: NameIndex<DirectiveAnnotation>;
    constructor(directibleElementAttrs:DirectibleElementAttrs){
        super(directibleElementAttrs)
        this.directives=directibleElementAttrs.directives;
    }
}


interface DirectibleElementAttrs extends ElementAttrs{
    directives?: NameIndex<DirectiveAnnotation>;
}


class EnumDefinition extends DirectibleElementCollection<EnumElement>{

}
class EnumElement extends DirectibleElement{

}


class UnionElement extends DirectibleElement{

}

class UnionDefinition extends DirectibleElementCollection<UnionElement>{

}

class DirectiveDefinition extends ElementCollection<DirectiveDefinitionElement>{
    parameters:NameIndex<ParameterComponent>;
    constructor(directiveDefinitionAttrs:DirectiveDefinitionAttrs){
        super(directiveDefinitionAttrs);
        this.parameters=directiveDefinitionAttrs.parameters;
    }
}

interface DirectiveDefinitionAttrs extends ElementCollectionAttrs<DirectiveDefinitionElement>{
    parameters?:NameIndex<ParameterComponent>;
}

class DirectiveDefinitionElement extends Element{
    name:ExecutableDirectiveLocationsEnum|TypeSystemDirectiveLocationsEnum
}


enum ExecutableDirectiveLocationsEnum{
    QUERY='QUERY',
    MUTATION='MUTATION',
    SUBSCRIPTION='SUBSCRIPTION',
    FIELD='FIELD',
    FRAGMENT_DEFINITION='FRAGMENT_DEFINITION',
    FRAGMENT_SPREAD='FRAGMENT_SPREAD',
    INLINE_FRAGMENT='INLINE_FRAGMENT'
}
enum TypeSystemDirectiveLocationsEnum{
    SCHEMA='SCHEMA',
    SCALAR='SCALAR',
    OBJECT='OBJECT',
    FIELD_DEFINITION='FIELD_DEFINITION',
    ARGUMENT_DEFINITION='ARGUMENT_DEFINITION',
    INTERFACE='INTERFACE',
    UNION='UNION',
    ENUM='ENUM',
    ENUM_VALUE='ENUM_VALUE',
    INPUT_OBJECT='INPUT_OBJECT',
    INPUT_FIELD_DEFINITION='INPUT_FIELD_DEFINITION',
}


export{
    EnumDefinition,
    EnumElement,
    UnionDefinition,
    UnionElement,
    DirectiveDefinition,
    DirectiveDefinitionElement,
    DirectiveDefinitionAttrs,
    ExecutableDirectiveLocationsEnum,
    TypeSystemDirectiveLocationsEnum,
}