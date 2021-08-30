//NO LONGER NEEDED
class TypeIndex<TYPE>{
    [index:string]:TYPE;
}

abstract class NameIndexItem{
    name:string;
    constructor(nameIndexItemAttrs:NameIndexItemAttrs){
        this.name=nameIndexItemAttrs.name;
    }
}

interface NameIndexItemAttrs{
    name:string;
}

class NameIndex<TYPE extends NameIndexItem> {
    [index:string]:TYPE;
}

interface ModifiableIndex<TYPE>{
    add(element:TYPE):TypeIndex<TYPE>;
    set(replacement:TypeIndex<TYPE>);
    addMultiple(elements:TYPE[]);
    remove(removeElement:TYPE);
}
class ModifiableNameIndex<TYPE extends NameIndexItem> implements ModifiableIndex<TYPE>{
    nameIndex:TypeIndex<TYPE>;
    name?:string;
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

interface ModifiableNameIndexAttrs<TYPE extends NameIndexItem>{
    nameIndex?:TypeIndex<TYPE>;
    name:string;
}
