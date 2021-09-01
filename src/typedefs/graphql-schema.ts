
import { DirectibleComponent, DirectibleComponentAttrs,NameIndex } from './component';
import{
    UnionDefinition,
    EnumDefinition,
    DirectiveDefinition,
} from './element-definition'
import { ObjectDefinition, InterfaceDefinition, InputDefinition } from './fielded-type';
import { ScalarDefinition } from './base-type';


class GraphQLSchema extends DirectibleComponent{
    objects?:NameIndex<ObjectDefinition>;
    scalars?:NameIndex<ScalarDefinition>;
    interfaces?:NameIndex<InterfaceDefinition>;
    unions?:NameIndex<UnionDefinition>;
    enums?:NameIndex<EnumDefinition>;
    inputs?:NameIndex<InputDefinition>;
    directiveDefinitions?:NameIndex<DirectiveDefinition>;
    constructor(graphQLSchemaAttrs:GraphQLSchemaAttrs){
        super(graphQLSchemaAttrs);
        this.objects=new NameIndex<ObjectDefinition>();
        this.scalars=new NameIndex<ScalarDefinition>();
        this.interfaces=new NameIndex<InterfaceDefinition>();
        this.unions=new NameIndex<UnionDefinition>();
        this.enums=new NameIndex<EnumDefinition>();
        this.inputs=new NameIndex<InputDefinition>();
        this.directiveDefinitions=new NameIndex<DirectiveDefinition>();
    }

    getSchemaObject():GraphQLSchemaObject{
        return{
            name:this.name,
            objects:this.objects,
            scalars:this.scalars,
            interfaces:this.interfaces,
            unions:this.unions,
            enums:this.enums,
            inputs:this.inputs,
            directiveDefinitions:this.directiveDefinitions
        }
    }

}

interface GraphQLSchemaObject{
    name:string,
    objects?:NameIndex<ObjectDefinition>;
    scalars?:NameIndex<ScalarDefinition>;
    interfaces?:NameIndex<InterfaceDefinition>;
    unions?:NameIndex<UnionDefinition>;
    enums?:NameIndex<EnumDefinition>;
    inputs?:NameIndex<InputDefinition>;
    directiveDefinitions?:NameIndex<DirectiveDefinition>;
}

interface GraphQLSchemaAttrs extends DirectibleComponentAttrs {
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
    GraphQLSchema,
    GraphQLSchemaObject
}