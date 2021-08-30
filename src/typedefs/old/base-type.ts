import{DirectiveAnnotation} from '../component'
import{NameIndexItem,NameIndexItemAttrs} from './indexable'


interface NamedComponent {

}

interface DirectibleComponent{

}


interface NamedTypeAttrs extends NameIndexItemAttrs{
    description?:string;
}


//ql schema type that can have its own name, example 'Query'
abstract class NamedType extends NameIndexItem {
        description?:string;
    constructor(namedtypeAttrs:NamedTypeAttrs){
        super(namedtypeAttrs)
        this.description=namedtypeAttrs.description;
    }
}

interface DirectibleTypeAttrs extends NamedTypeAttrs{
    directives?:DirectiveAnnotation
}

abstract class DirectibleType extends NameIndexItem {
    directives?:DirectiveAnnotation
    constructor(directibleTypeAttrs:DirectibleTypeAttrs){
        super(directibleTypeAttrs)
        this.directives=directibleTypeAttrs.directives;
    }
}



abstract class SchemaType extends DirectibleType{
    isExtended:boolean
    constructor(schemaTypeAttrs:SchemaTypeAttrs){
        super(schemaTypeAttrs)
        this.isExtended=schemaTypeAttrs.isExtended?true:false;
    }
}

interface SchemaTypeAttrs extends DirectibleTypeAttrs{
    isExtended:boolean
}


export {
    NamedType,
    NamedTypeAttrs,
    SchemaType,
    SchemaTypeAttrs,
    DirectibleType,
    DirectibleTypeAttrs,
}