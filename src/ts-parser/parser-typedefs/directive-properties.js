"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var component_1 = require("../../typedefs/component");
var indexable_1 = require("../../typedefs/indexable");
var DirectiveProperties = /** @class */ (function (_super) {
    __extends(DirectiveProperties, _super);
    function DirectiveProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DirectiveProperties;
}(indexable_1.ModifiableNameIndex));
var obj = new DirectiveProperties({ name: 'root' });
var dirparam = new component_1.ParameterComponent({ name: 'if', type: 'boolean' });
var dir1 = new component_1.DirectiveAnnotation({ name: 'dir', height: 1 });
dir1.parameters.add(dirparam);
var indirparam = new component_1.ParameterComponent({ name: 'param1', type: 'type1' });
var indir = new component_1.DirectiveAnnotation({ name: 'indir', height: 0 });
indir.parameters.add(indirparam);
// param.directives.add(inobj)
obj.add(dir1);
console.log('inobj', obj.nameIndex['dir']);
