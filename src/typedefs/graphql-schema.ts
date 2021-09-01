/* the object that represents an entire GraphQL schema that has been parsed */

import { DirectibleComponent, DirectibleComponentAttrs, NameIndex } from './component';
import { UnionDefinition, EnumDefinition, DirectiveDefinition } from './element-definition'
import { ObjectDefinition, InterfaceDefinition, InputDefinition } from './fielded-type';
import { ScalarDefinition } from './base-type';

class GraphQLSchema extends DirectibleComponent {
    objects?: NameIndex<ObjectDefinition>;
    scalars?: NameIndex<ScalarDefinition>;
    interfaces?: NameIndex<InterfaceDefinition>;
    unions?: NameIndex<UnionDefinition>;
    enums?: NameIndex<EnumDefinition>;
    inputs?: NameIndex<InputDefinition>;
    directiveDefinitions?: NameIndex<DirectiveDefinition>;
    constructor(graphQLSchemaAttrs: GraphQLSchemaAttrs) {
        super(graphQLSchemaAttrs);
        if (graphQLSchemaAttrs.objects && Object.keys(graphQLSchemaAttrs.objects).length > 0) {
            this.objects = graphQLSchemaAttrs.objects
        }
        if (graphQLSchemaAttrs.scalars && Object.keys(graphQLSchemaAttrs.scalars).length > 0) {
            this.scalars = graphQLSchemaAttrs.scalars
        }
        if (graphQLSchemaAttrs.interfaces && Object.keys(graphQLSchemaAttrs.interfaces).length > 0) {
            this.interfaces = graphQLSchemaAttrs.interfaces;
        }
        if (graphQLSchemaAttrs.unions && Object.keys(graphQLSchemaAttrs.unions).length > 0) {
            this.unions = graphQLSchemaAttrs.unions;
        }
        if (graphQLSchemaAttrs.enums && Object.keys(graphQLSchemaAttrs.enums).length > 0) {
            this.enums = graphQLSchemaAttrs.enums;
        }
        if (graphQLSchemaAttrs.inputs && Object.keys(graphQLSchemaAttrs.inputs).length > 0) {
            this.inputs = graphQLSchemaAttrs.inputs;
        }
        if (graphQLSchemaAttrs.directiveDefinitions && Object.keys(graphQLSchemaAttrs.directiveDefinitions).length > 0) {
            this.directiveDefinitions = graphQLSchemaAttrs.directiveDefinitions
        }
    }

    getSchemaObject(): GraphQLSchemaAttrs {
        let result: GraphQLSchemaAttrs = { name: this.name }
        if (this.objects) {
            result.objects = this.objects
        }
        if (this.scalars) {
            result.scalars = this.scalars
        }
        if (this.interfaces) {
            result.interfaces = this.interfaces;
        }
        if (this.unions) {
            result.unions = this.unions;
        }
        if (this.enums) {
            result.enums = this.enums;
        }
        if (this.inputs) {
            result.inputs = this.inputs;
        }
        if (this.directiveDefinitions) {
            result.directiveDefinitions = this.directiveDefinitions
        }
        return result;
    }

}

interface GraphQLSchemaAttrs extends DirectibleComponentAttrs {
    name: string,
    objects?: NameIndex<ObjectDefinition>;
    scalars?: NameIndex<ScalarDefinition>;
    interfaces?: NameIndex<InterfaceDefinition>;
    unions?: NameIndex<UnionDefinition>;
    enums?: NameIndex<EnumDefinition>;
    inputs?: NameIndex<InputDefinition>;
    directiveDefinitions?: NameIndex<DirectiveDefinition>;
}

enum GraphQLType {
    Object = 'Object',
    Scalar = 'Scalar',
    Interface = 'Interface',
    Union = 'Union',
    Enum = 'Enum',
    Input = 'Input',
    DirectiveDefinitions = 'DirectiveDefinitions'
}

export {
    GraphQLSchema,
    GraphQLSchemaAttrs
}