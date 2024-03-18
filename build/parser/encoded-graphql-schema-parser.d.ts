import { ScalarDefinition } from '../typedefs/base-type';
import { DirectiveAnnotation, NameIndex } from '../typedefs/component';
import { DirectiveDefinition, EnumDefinition, UnionDefinition } from '../typedefs/element-definition';
import { InputDefinition, InterfaceDefinition, ObjectDefinition } from '../typedefs/fielded-type';
/************************************************END OF ALL REGEXP COMPONENTS************************************************/
/**
 * parses an encoded schema text and build all union types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all unions in the schema
 */
declare const getUnions: (encodedDirectivesSchemaText: string, directiveProperties: NameIndex<DirectiveAnnotation>) => NameIndex<UnionDefinition>;
/**
 * parses an encoded schema text and build all union types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all scalars in the schema
 */
declare const getScalars: (encodedDirectivesSchemaText: string, directiveProperties: NameIndex<DirectiveAnnotation>) => NameIndex<ScalarDefinition>;
/**
 * parses an encoded schema text and build all directive definition types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all directive definitions in the schema
 */
declare const getDirectiveDefinitions: (encodedDirectivesSchemaText: string, directiveProperties: NameIndex<DirectiveAnnotation>) => NameIndex<DirectiveDefinition>;
/**
 * parses an encoded schema text and build all types which contain fields which are: object, inputs and interface types and returns a NameIndex of them.
 * Since the regex is so similar between the three all of the parsing was done on this function.
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all fielded types which are objects, interfaces and inputs in the schema
 */
declare const getFieldedTypes: (encodedDirectivesSchemaText: string, directiveProperties: NameIndex<DirectiveAnnotation>) => {
    objects?: NameIndex<ObjectDefinition>;
    interfaces?: NameIndex<InterfaceDefinition>;
    inputs?: NameIndex<InputDefinition>;
};
/**
 * parses an encoded schema text and build all enum types and returns a NameIndex of them
 * @param encodedDirectivesSchemaText the text string of a schema whose root directives have all been encoded
 * @param directiveProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all enums in the schema
 */
declare const getEnums: (encodedDirectivesSchemaText: string, directiveProperties: NameIndex<DirectiveAnnotation>) => NameIndex<EnumDefinition>;
export { getEnums, getFieldedTypes, getDirectiveDefinitions, getScalars, getUnions, };
