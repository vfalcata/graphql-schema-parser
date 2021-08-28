import{DirectiveAnnotation} from './component'
import{NamedIndexItem,NamedIndexItemAttrs} from './indexable'


interface NamedTypeAttrs extends NamedIndexItemAttrs{
    description?:string;
}

abstract class NamedType extends NamedIndexItem {
    description?:string;
    constructor(namedtypeAttrs:NamedTypeAttrs){
        super(namedtypeAttrs)
        this.description=namedtypeAttrs.description;
    }
}

interface DirectibleTypeAttrs extends NamedTypeAttrs{
    directives?:DirectiveAnnotation
}

abstract class DirectibleType extends NamedIndexItem {
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