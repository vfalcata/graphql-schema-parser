import { DirectiveAnnotation, NameIndex } from '../typedefs/component';
declare const ENCODING_FLAG = "%";
declare const ENCODED_DIRECTIVE_REGEXP: RegExp;
declare const ENCODED_DIRECTIVE_REGEXP_GROUPS: {
    FULL_MATCH: number;
};
/************************************************END OF ALL REGEXP COMPONENTS************************************************/
/**
 * parses any text component match that has encoded directives, matches the id to the some data structure to get the actual directive, and returns a name index of all the directives annotated on this component.
 * Useful for outside modules to call and compile a complete directive annotation object.
 * @param encodedDirectiveComponent text of a component group that has an encoded directive annotation
 * @param directivesProperties the datastructure containing all the root directives that corresponds to the schema in which the encodedDirectiveComponent text was taken from
 * @returns a name index of all directive annotations that annotated some component in the schema
 */
declare const getDirectiveProperties: (encodedDirectiveComponent: string, directivesProperties: NameIndex<DirectiveAnnotation>) => NameIndex<DirectiveAnnotation>;
/**
 * parses the raw GraphQL schema text and encodes all directives. Starts at the least nested directives, and works up one level of nesting each iteration.
 * Each iteration the schema text will be encoded as per the id of the directive it is encoded. This function also build a index of all directive id's that annotate any graphql schema component.
 * This index will only contain root encoded directives, all nexted directives will exist as properties within the directive object itself.
 * heigt levels and correspondance with nesting
 * height 0 = directive annotation with no parameters
 * height 1 = directive annotation with parameters that DO NOT have any directive annotations
 * height 1+ = directive annotation with parameters that have directives annotation. Each additional number in height refers to how nested the directive is.
 * @param rawGraphQLSchemaText the raw GraphQL schema text passed in as a string
 * @returns an encoded version of the the raw GraphQL schema text, that encodes all the root level directive annotations in the original text. all root directives are in the directiveProperties, if a root directive had
 * a nested directive annotation it will be contained inside its properties as well
 */
declare const parseDirectives: (rawGraphQLSchemaText: string) => {
    encodedDirectivesSchemaText: string;
    directiveProperties: NameIndex<DirectiveAnnotation>;
};
export { parseDirectives, getDirectiveProperties, ENCODING_FLAG, ENCODED_DIRECTIVE_REGEXP, ENCODED_DIRECTIVE_REGEXP_GROUPS };
