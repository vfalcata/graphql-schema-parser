"use strict";
/* lowest level common building block to compose of types as per the GraphQL spec */
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
Object.defineProperty(exports, "__esModule", { value: true });
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
    function NamedComponent(namedComponentAttrs) {
        this.name = namedComponentAttrs.name;
    }
    return NamedComponent;
}());
exports.NamedComponent = NamedComponent;
var DirectibleComponent = /** @class */ (function (_super) {
    __extends(DirectibleComponent, _super);
    function DirectibleComponent(directibleComponentAttrs) {
        var _this = _super.call(this, directibleComponentAttrs) || this;
        if (directibleComponentAttrs.directives && Object.keys(directibleComponentAttrs.directives).length > 0) {
            _this.directives = directibleComponentAttrs.directives;
        }
        return _this;
    }
    return DirectibleComponent;
}(NamedComponent));
exports.DirectibleComponent = DirectibleComponent;
var DirectiveAnnotation = /** @class */ (function (_super) {
    __extends(DirectiveAnnotation, _super);
    function DirectiveAnnotation(directiveAnnotationAttrs) {
        var _this = _super.call(this, directiveAnnotationAttrs) || this;
        if (directiveAnnotationAttrs.parameters && Object.keys(directiveAnnotationAttrs.parameters).length > 0) {
            _this.parameters = directiveAnnotationAttrs.parameters;
        }
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
        if (describableParameterComponentAttrs.description && describableParameterComponentAttrs.description.length > 0) {
            _this.description = describableParameterComponentAttrs.description;
        }
        return _this;
    }
    return DescribableParameterComponent;
}(ParameterComponent));
exports.DescribableParameterComponent = DescribableParameterComponent;
/* Fields that can only have name and type ONLY and NOT parameters */
var InputFieldDefinition = /** @class */ (function (_super) {
    __extends(InputFieldDefinition, _super);
    function InputFieldDefinition(inputFieldDefinitionAttrs) {
        var _this = _super.call(this, inputFieldDefinitionAttrs) || this;
        if (inputFieldDefinitionAttrs.description && inputFieldDefinitionAttrs.description.length > 0) {
            _this.description = inputFieldDefinitionAttrs.description;
        }
        return _this;
    }
    return InputFieldDefinition;
}(ParameterComponent));
exports.InputFieldDefinition = InputFieldDefinition;
/* Fields that can are permitted to have parameters, such as fields of an object or interface */
var ParameterFieldDefinition = /** @class */ (function (_super) {
    __extends(ParameterFieldDefinition, _super);
    function ParameterFieldDefinition(parameterFieldDefinitionAttrs) {
        var _this = _super.call(this, parameterFieldDefinitionAttrs) || this;
        if (parameterFieldDefinitionAttrs.parameters && Object.keys(parameterFieldDefinitionAttrs.parameters).length > 0) {
            _this.parameters = parameterFieldDefinitionAttrs.parameters;
        }
        return _this;
    }
    return ParameterFieldDefinition;
}(InputFieldDefinition));
exports.ParameterFieldDefinition = ParameterFieldDefinition;
