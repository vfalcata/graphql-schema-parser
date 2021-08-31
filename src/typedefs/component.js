"use strict";
//Compent level type definitions that are used to compose objects
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
exports.NamedComponent = exports.NameIndex = exports.InputFieldDefinition = exports.ParameterFieldDefinition = exports.ParameterComponent = exports.DescribableParameterComponent = exports.DirectiveAnnotation = exports.DirectibleComponent = void 0;
var TypeIndex = /** @class */ (function () {
    function TypeIndex() {
    }
    return TypeIndex;
}());
var NameIndex = /** @class */ (function () {
    function NameIndex() {
    }
    return NameIndex;
}());
exports.NameIndex = NameIndex;
var NamedComponent = /** @class */ (function () {
    function NamedComponent(ComponentAttrs) {
        this.name = ComponentAttrs.name;
    }
    return NamedComponent;
}());
exports.NamedComponent = NamedComponent;
var DirectibleComponent = /** @class */ (function (_super) {
    __extends(DirectibleComponent, _super);
    function DirectibleComponent(directibleComponentAttrs) {
        var _this = _super.call(this, directibleComponentAttrs) || this;
        _this.directives = directibleComponentAttrs.directives ? directibleComponentAttrs.directives : new NameIndex();
        return _this;
    }
    return DirectibleComponent;
}(NamedComponent));
exports.DirectibleComponent = DirectibleComponent;
var DirectiveAnnotation = /** @class */ (function (_super) {
    __extends(DirectiveAnnotation, _super);
    function DirectiveAnnotation(directiveAnnotationAttrs) {
        var _this = _super.call(this, directiveAnnotationAttrs) || this;
        _this.parameters = directiveAnnotationAttrs.parameters ? directiveAnnotationAttrs.parameters : new NameIndex();
        _this.height = directiveAnnotationAttrs.height ? directiveAnnotationAttrs.height : 1;
        return _this;
    }
    return DirectiveAnnotation;
}(NamedComponent));
exports.DirectiveAnnotation = DirectiveAnnotation;
var ParameterComponent = /** @class */ (function (_super) {
    __extends(ParameterComponent, _super);
    function ParameterComponent(parameterComponentAttrs) {
        var _this = _super.call(this, parameterComponentAttrs) || this;
        _this.type = parameterComponentAttrs.type;
        return _this;
    }
    return ParameterComponent;
}(DirectibleComponent));
exports.ParameterComponent = ParameterComponent;
var DescribableParameterComponent = /** @class */ (function (_super) {
    __extends(DescribableParameterComponent, _super);
    function DescribableParameterComponent(describableParameterComponentAttrs) {
        var _this = _super.call(this, describableParameterComponentAttrs) || this;
        _this.description = describableParameterComponentAttrs.description;
        return _this;
    }
    return DescribableParameterComponent;
}(ParameterComponent));
exports.DescribableParameterComponent = DescribableParameterComponent;
//for input types?
var InputFieldDefinition = /** @class */ (function (_super) {
    __extends(InputFieldDefinition, _super);
    function InputFieldDefinition(inputFieldDefinitionAttrs) {
        var _this = _super.call(this, inputFieldDefinitionAttrs) || this;
        _this.description = inputFieldDefinitionAttrs.description;
        return _this;
    }
    return InputFieldDefinition;
}(ParameterComponent));
exports.InputFieldDefinition = InputFieldDefinition;
//for object interface types that have field definitionwith parameters
var ParameterFieldDefinition = /** @class */ (function (_super) {
    __extends(ParameterFieldDefinition, _super);
    function ParameterFieldDefinition(parameterFieldDefinitionAttrs) {
        var _a;
        var _this = _super.call(this, parameterFieldDefinitionAttrs) || this;
        _this.parameters = (_a = parameterFieldDefinitionAttrs.parameters) !== null && _a !== void 0 ? _a : new NameIndex();
        return _this;
    }
    return ParameterFieldDefinition;
}(InputFieldDefinition));
exports.ParameterFieldDefinition = ParameterFieldDefinition;
