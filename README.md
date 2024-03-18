# GraphQL Schema Parser

npmjs link:
https://www.npmjs.com/package/graphql-schema-parser

### Description
This is a minimal, tool with documented source code, and well defined type definitions used to parse graphql schema text according to the 2018 spec. It generates an object that has properties corresponding to the input graphql schema. There are absolutely no dependencies, this utility was made using only the basic node libraries. It is intended to be simple minimal and easy to use so you can extend it to whatever use that fits your needs. This module is fairly simple and follows the current graphql 2018 spec including nested directives. 
<br/>
<br/>  

### Use Cases
I built this tool so that any commonly used object within the entire scope of a project, such as error events, general logs etc. can also be defined using a graphql schema specification. This standardizes the language throught a project such that the end points and internal domain language throughout the project would be concretely specified using the same specification. 
This is useful as many projects have their own domain specific languages for interacting with components or services.
<br/>
<br/>
In order to utilize this library you must issue at the root
```
npm install graphql-schema-parser
```
<br/>
then import:

```
import { generateSchemaObject } from 'graphql-schema-parser'
```

Then you can use the schema object as you desire. Thats all there is needed, a single funcitonal call

<br/>
<br/>

### Quick Type Defintion Reference, as always the files inside the ./typedefs are the most accurate.

The most basic type that has a single mandatory property
```
NamedComponent:{
name:string
}
```
<br/>
<br/>
Any component extend from NamedComponent (has a mandatory name) can be listed in a

```
NameIndex<ObjectDefinition>
```

<br/>
<br/>
in order to get a Schema object (defined in this repo ./typedefs/graphql-schema.ts the class 'GraphQLSchema') you must pass in the text of a graphql schema file as a string. This object has the following properties
```
    name: string,
    objects?: NameIndex<ObjectDefinition>;
    scalars?: NameIndex<ScalarDefinition>;
    interfaces?: NameIndex<InterfaceDefinition>;
    unions?: NameIndex<UnionDefinition>;
    enums?: NameIndex<EnumDefinition>;
    inputs?: NameIndex<InputDefinition>;
    directiveDefinitions?: NameIndex<DirectiveDefinition>;
```
<br/>
<br/>

This object represents a map whose key is some string (generally the name or id) and value is the defined generic TYPE

```
NameIndex<TYPE>
```

<br/>
<br/>
Each type has the attributes

```
isExtended:boolean
implements?:NameIndex<NamedComponent>; //For object types only
name:string;
fields:NameIndex<TYPE extends InputFieldDefinition|ParameterFieldDefinition>;
directives?:NameIndex<DirectiveAnnotations>;
description?:string
```

<br/>
<br/>

All element based objects (objects that list out items, and do not define fields) will have the same properties as the above except instead of fields it has:

```
elements:NameIndex<TYPE extends Element>;
```
the elements indexed are generally some NamedComponent restricted by an enumeration

<br/>
<br/>
Fields that can contain parameters can contain the properties

```
type:string
name:string
description?:string
directives?:NameIndex<DirectiveAnnotations>;
parameters?:NameIndex<ParameterFieldDefinition>;
```

<br/>
<br/>

otherwise the parmeters is defined as 

```
parameters?:NameIndex<InputFieldDefinition>;
```

<br/>
<br/>

All Parameters that belong to a field that can be parameterized can contain

```
type:string
name:string
directives?:NameIndex<DirectiveAnnotations>;
description?:string
```

<br/>
<br/>
All directive annotations contains the following, note that the parameters can not have descritions. The parameters can also have their own directives.
This allows for nested directives.

```
name:string,
parameters?:NameIndex<ParameterComponent>;
```

<br/>
<br/>
All Parameters of directive annotations and directive definitions can contain. Note that it has no description, and that directives can also be nested in it

```
type:string
name:string
directives?:NameIndex<DirectiveAnnotations>;
```


  
