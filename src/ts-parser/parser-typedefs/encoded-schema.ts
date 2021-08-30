import { DirectiveAnnotation } from "../../typedefs/component";
import { ModifiableNameIndex } from "../../typedefs/indexable";
import {randomBytes} from 'crypto'

class EncodedSchema {

    directiveProperties:ModifiableNameIndex<DirectiveAnnotation>;
    encodedText:string
    constructor(rawGraphqlSchemaText:string,encodingCallback:(rawGraphqlSchemaText:string)=>{encodedText:string,directiveProperties:ModifiableNameIndex<DirectiveAnnotation>}){
        let {directiveProperties,encodedText} = encodingCallback(rawGraphqlSchemaText)
        this.directiveProperties=directiveProperties
        this.encodedText=encodedText
    }

    generateDirectiveId = (height) => {
        return this.ENCODING_FLAG.repeat(height) +this.ENCODING_FLAG+ randomBytes(this.idByteLength).toString('hex') +this.ENCODING_FLAG+ this.ENCODING_FLAG.repeat(height)
    }

}
