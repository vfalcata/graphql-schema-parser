//Compent level type definitions that are used to compose objects
import{ModifiableNameIndex} from './indexable'

abstract class Component {
    name:string;
    constructor(ComponentAttrs){
        this.name=ComponentAttrs.name;
    }
}

interface ComponentAttrs{
    name:string;
}

interface DirectibleComponentAttrs extends ComponentAttrs{
    directives?:ModifiableNameIndex<DirectiveAnnotation>
}

abstract class DirectibleComponent extends Component{
    directives?:ModifiableNameIndex<DirectiveAnnotation>
    constructor(directibleComponentAttrs:DirectibleComponentAttrs){
        super(directibleComponentAttrs);
        this.directives=directibleComponentAttrs.directives?directibleComponentAttrs.directives:new ModifiableNameIndex<DirectiveAnnotation>()
    }
}

class DirectiveAnnotation extends Component{
    parameters?:ModifiableNameIndex<ParameterComponent>;
    height?: number;

    constructor(directiveAnnotationAttrs:DirectiveAnnotationAttrs){
        super(directiveAnnotationAttrs)
        this.parameters=directiveAnnotationAttrs.parameters?directiveAnnotationAttrs.parameters:new ModifiableNameIndex<ParameterSchemaObject>();
        this.height=directiveAnnotationAttrs.height?directiveAnnotationAttrs.height:1;        
    }
}
interface DirectiveAnnotationAttrs extends DirectibleComponentAttrs{
    parameters?:ModifiableNameIndex<ParameterComponent>;
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

export{
    DirectibleComponent,
    DirectibleComponentAttrs,
    DirectiveAnnotation,
    DirectiveAnnotationAttrs,
    ParameterComponent,
    ParameterComponentAttrs
}