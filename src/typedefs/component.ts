//Compent level type definitions that are used to compose objects

class TypeIndex<TYPE>{
    [index:string]:TYPE;
}

class NameIndex<TYPE extends NamedComponent> {
    [index:string]:TYPE;
}


interface Directible {
    directives?:TypeIndex<DirectibleComponent>;
}

interface Describable {
    description:string;
}

interface Parameterizible {
    parameters?:TypeIndex<ParameterComponent>;
}


class NamedComponent {
    name:string;
    constructor(namedComponentAttrs:NamedComponentAttrs){
        this.name=namedComponentAttrs.name;
    }
}



interface NamedComponentAttrs{
    name:string;
}

interface DirectibleComponentAttrs extends NamedComponentAttrs{
    directives?:NameIndex<DirectiveAnnotation>
}

abstract class DirectibleComponent extends NamedComponent{
    directives?:NameIndex<DirectiveAnnotation>
    constructor(directibleComponentAttrs:DirectibleComponentAttrs){
        super(directibleComponentAttrs);
        if(directibleComponentAttrs.directives && Object.keys(directibleComponentAttrs.directives).length>0){
            this.directives=directibleComponentAttrs.directives;
        }
    }
}

class DirectiveAnnotation extends NamedComponent{
    parameters?:NameIndex<ParameterComponent>;
    height?: number;

    constructor(directiveAnnotationAttrs:DirectiveAnnotationAttrs){
        super(directiveAnnotationAttrs)
        if(directiveAnnotationAttrs.parameters && Object.keys(directiveAnnotationAttrs.parameters).length>0){
            this.parameters=directiveAnnotationAttrs.parameters;
        }
        this.height=directiveAnnotationAttrs.height?directiveAnnotationAttrs.height:1;        
    }
}

interface DirectiveAnnotationAttrs extends DirectibleComponentAttrs{
    parameters?:NameIndex<ParameterComponent>;
    height?: number;
}

class ParameterComponent extends DirectibleComponent{
    type:string;
    constructor(parameterComponentAttrs:ParameterComponentAttrs){
        super(parameterComponentAttrs)
        this.type=parameterComponentAttrs.type;
    }

}
interface ParameterComponentAttrs extends DirectibleComponent{
    type:string;
}

class DescribableParameterComponent extends ParameterComponent{
    description?:string;
    constructor(describableParameterComponentAttrs:DescribableParameterComponentAttrs){
        super(describableParameterComponentAttrs)
        if(describableParameterComponentAttrs.description && describableParameterComponentAttrs.description.length>0){
            this.description=describableParameterComponentAttrs.description
        }        
    }
}

interface DescribableParameterComponentAttrs extends ParameterComponentAttrs{
    description?:string;
}


//for input types?
class InputFieldDefinition extends ParameterComponent{    
    description?:string;
    constructor(inputFieldDefinitionAttrs:InputFieldDefinitionAttrs){
        super(inputFieldDefinitionAttrs)
        if(inputFieldDefinitionAttrs.description && inputFieldDefinitionAttrs.description.length>0){
            this.description=inputFieldDefinitionAttrs.description
        }     
        
    }
    
}

interface InputFieldDefinitionAttrs extends ParameterComponentAttrs{
    description?:string;
}

//for object interface types that have field definitionwith parameters
class ParameterFieldDefinition extends InputFieldDefinition{
    parameters?:NameIndex<DescribableParameterComponent>;
    constructor(parameterFieldDefinitionAttrs:ParameterFieldDefinitionAttrs){
        super(parameterFieldDefinitionAttrs)
        if(parameterFieldDefinitionAttrs.parameters && Object.keys(parameterFieldDefinitionAttrs.parameters).length>0){
            this.parameters=parameterFieldDefinitionAttrs.parameters
        }
  
    }
}

interface ParameterFieldDefinitionAttrs extends InputFieldDefinitionAttrs{
    parameters?:NameIndex<DescribableParameterComponent>;

}

export{
    DirectibleComponent,
    DirectibleComponentAttrs,
    DirectiveAnnotation,
    DirectiveAnnotationAttrs,
    DescribableParameterComponent,
    ParameterComponent,
    ParameterComponentAttrs,
    ParameterFieldDefinition,
    ParameterFieldDefinitionAttrs,
    InputFieldDefinition,
    InputFieldDefinitionAttrs,
    NameIndex,
    NamedComponent,
    NamedComponentAttrs
    
}