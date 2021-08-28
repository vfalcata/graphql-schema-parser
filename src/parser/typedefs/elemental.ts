import {SchemaType,SchemaTypeAttrs} from './base-type'
import {ModifiableNameIndex} from './indexable'
import {DirectibleComponent, DirectibleComponentAttrs,ParameterComponent} from './component'


abstract class ElementType<TYPE extends ElementItem> extends SchemaType{
    elements:ModifiableNameIndex<TYPE>; 
    constructor(elementTypeAttrs:ElementTypeAttrs<TYPE>){
        super(elementTypeAttrs)
        this.elements=elementTypeAttrs.elements?elementTypeAttrs.elements:new ModifiableNameIndex<TYPE>({name:elementTypeAttrs.name});
    }
}

interface ElementTypeAttrs<TYPE extends ElementItem> extends SchemaTypeAttrs{
    elements:ModifiableNameIndex<TYPE>;
    
}

abstract class ElementItem extends DirectibleComponent{  
    constructor(elementItemAttrs:ElementItemAttrs){
        super(elementItemAttrs)
    }
}
interface ElementItemAttrs extends DirectibleComponentAttrs{

}

class ScalarType extends SchemaType{
    type:string;
    constructor(scalarTypeAttrs:ScalarTypeAttrs){
        super(scalarTypeAttrs);
        this.type=scalarTypeAttrs.type;
    }
}

interface ScalarTypeAttrs extends SchemaTypeAttrs{
    type:string;
}

class EnumType extends ElementType<EnumElement>{

}
class EnumElement extends ElementItem{

}


class UnionElement extends ElementType<UnionType>{

}

class UnionType extends ElementItem{

}
class DirectiveDefinitionType extends ElementType<DirectiveDefinitionElement>{
    parameters:ModifiableNameIndex<ParameterComponent>;
    constructor(directiveDefinitionTypeAttrs:DirectiveDefinitionTypeAttrs<DirectiveDefinitionElement>){
        super(directiveDefinitionTypeAttrs);
        this.parameters=directiveDefinitionTypeAttrs.parameters;
    }
}

interface DirectiveDefinitionTypeAttrs<TYPE extends ElementItem> extends ElementTypeAttrs<TYPE>{
    parameters?:ModifiableNameIndex<ParameterComponent>;
}

class DirectiveDefinitionElement extends ElementItem{
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
    EnumType,
    EnumElement,
    UnionType,
    UnionElement,
    ScalarType,
    DirectiveDefinitionType,
    DirectiveDefinitionElement,
    DirectiveDefinitionTypeAttrs,
    ExecutableDirectiveLocationsEnum,
    TypeSystemDirectiveLocationsEnum,
}