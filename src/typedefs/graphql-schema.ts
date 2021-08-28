import {SchemaType,SchemaTypeAttrs,DirectibleType,DirectibleTypeAttrs,} from './base-type'
import {ModifiableNameIndex,NamedIndexItem,NamedIndexItemAttrs} from './indexable'
import{
    EnumType,
    EnumElement,
    UnionType,
    UnionElement,
    ScalarType,
    DirectiveDefinitionType,
} from './elemental'
import {DirectibleComponentAttrs} from './component'


class ObjectType extends SchemaType{
    implements?:ModifiableNameIndex<ObjectImplementations>
    constructor(objectTypeAttrs:ObjectTypeAttrs){
        super(objectTypeAttrs)
        this.implements=objectTypeAttrs.implements;
    }
}

interface ObjectTypeAttrs extends SchemaTypeAttrs{
    implements?:ModifiableNameIndex<ObjectImplementations>
}

class ObjectImplementations extends NamedIndexItem{
    
}

class InterfaceType extends SchemaType{

}


class InputType extends SchemaType{

}




class GraphQLSchema extends DirectibleType{
    objects:ModifiableNameIndex<ObjectType>;
    scalars:ModifiableNameIndex<ScalarType>;
    interfaces:ModifiableNameIndex<InterfaceType>;
    unions:ModifiableNameIndex<UnionType>;
    enums:ModifiableNameIndex<EnumType>;
    inputs:ModifiableNameIndex<InputType>;
    directiveDefinitions:ModifiableNameIndex<DirectiveDefinitionType>;
    constructor(graphQLSchemaAttrs:GraphQLSchemaAttrs){
        super(graphQLSchemaAttrs);
        this.objects=new ModifiableNameIndex<ObjectType>({name:'objects'});
        this.scalars=new ModifiableNameIndex<ScalarType>({name:'scalars'});
        this.interfaces=new ModifiableNameIndex<InterfaceType>({name:'interfaces'});
        this.unions=new ModifiableNameIndex<UnionType>({name:'unions'});
        this.enums=new ModifiableNameIndex<EnumType>({name:'enums'});
        this.inputs=new ModifiableNameIndex<InputType>({name:'inputs'});
        this.directiveDefinitions=new ModifiableNameIndex<DirectiveDefinitionType>({name:'directiveDefinitions'});
    }

}

interface GraphQLSchemaAttrs extends DirectibleComponentAttrs{
    name:string
}

enum GraphQLType {
    Object='Object',
    Scalar='Scalar',
    Interface='Interface',
    Union='Union',
    Enum='Enum',
    Input='Input',
    DirectiveDefinitions='DirectiveDefinitions'
}



export {
    ObjectType,
    ObjectTypeAttrs,
    InterfaceType,
    InputType,
    GraphQLType,
}