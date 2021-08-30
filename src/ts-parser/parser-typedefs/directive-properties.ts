import { DirectiveAnnotation, ParameterComponent } from "../../typedefs/component";
import { ModifiableNameIndex } from "../../typedefs/indexable";

class DirectiveProperties extends ModifiableNameIndex<DirectiveAnnotation> {

}



let obj=new DirectiveProperties({name:'root'})
let dirparam = new ParameterComponent({name:'if',type:'boolean'})

let dir1 = new DirectiveAnnotation({name:'dir',height:1,})
dir1.parameters.add(dirparam)
let indirparam = new ParameterComponent({name:'param1',type:'type1'})
let indir = new DirectiveAnnotation({name:'indir',height:0,})
indir.parameters.add(indirparam)
// param.directives.add(inobj)
obj.add(dir1)
console.log('inobj',obj.nameIndex['dir'])