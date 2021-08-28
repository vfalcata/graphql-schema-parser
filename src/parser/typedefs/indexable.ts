class TypeIndex<TYPE>{
    [index:string]:TYPE;
}

abstract class NamedIndexItem{
    name:string;
    constructor(namedIndexItemAttrs:NamedIndexItemAttrs){
        this.name=namedIndexItemAttrs.name;
    }
}

interface NamedIndexItemAttrs{
    name:string;
}

interface ModifiableIndex<TYPE>{
    add(element:TYPE):TypeIndex<TYPE>;
    set(replacement:TypeIndex<TYPE>);
    addMultiple(elements:TYPE[]);
    remove(removeElement:TYPE);
}
class ModifiableNameIndex<TYPE extends NamedIndexItem> implements ModifiableIndex<TYPE>{
    nameIndex:TypeIndex<TYPE>;
    name:string;
    constructor(modifiableNameIndexAttrs:ModifiableNameIndexAttrs<TYPE>){
        this.nameIndex=modifiableNameIndexAttrs.nameIndex?modifiableNameIndexAttrs.nameIndex:new TypeIndex<TYPE>();
        this.name=modifiableNameIndexAttrs.name;
    }

    add(element:TYPE):TypeIndex<TYPE>{
        this.nameIndex[element.name]=element;
        return this.nameIndex;
    };
    set(replacement:TypeIndex<TYPE>){
        this.nameIndex=replacement
        return this.nameIndex;
    };
    addMultiple(elements:TYPE[]){
        elements.forEach((element) =>{
            this.nameIndex[element.name]=element;
        })
        return this.nameIndex;
    };

    remove(removeElement:TYPE){
        delete  this.nameIndex[removeElement.name]
        return  this.nameIndex;
    };
}

interface ModifiableNameIndexAttrs<TYPE extends NamedIndexItem>{
    nameIndex?:TypeIndex<TYPE>;
    name:string;
}

export {
    ModifiableIndex,
    ModifiableNameIndex,
    TypeIndex,
    NamedIndexItem,
    NamedIndexItemAttrs,
    
}