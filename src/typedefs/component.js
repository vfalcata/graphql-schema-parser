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
exports.ParameterComponent = exports.DirectiveAnnotation = exports.DirectibleComponent = void 0;
//Compent level type definitions that are used to compose objects
var indexable_1 = require("./indexable");
var Component = /** @class */ (function () {
    function Component(ComponentAttrs) {
        this.name = ComponentAttrs.name;
    }
    return Component;
}());
var DirectibleComponent = /** @class */ (function (_super) {
    __extends(DirectibleComponent, _super);
    function DirectibleComponent(directibleComponentAttrs) {
        var _this = _super.call(this, directibleComponentAttrs) || this;
        _this.directives = directibleComponentAttrs.directives ? directibleComponentAttrs.directives : new indexable_1.ModifiableNameIndex({ name: 'directives' });
        return _this;
    }
    return DirectibleComponent;
}(Component));
exports.DirectibleComponent = DirectibleComponent;
var DirectiveAnnotation = /** @class */ (function (_super) {
    __extends(DirectiveAnnotation, _super);
    function DirectiveAnnotation(directiveAnnotationAttrs) {
        var _this = _super.call(this, directiveAnnotationAttrs) || this;
        _this.parameters = directiveAnnotationAttrs.parameters ? directiveAnnotationAttrs.parameters : new indexable_1.ModifiableNameIndex({ name: 'parameters' });
        _this.height = directiveAnnotationAttrs.height ? directiveAnnotationAttrs.height : 1;
        return _this;
    }
    return DirectiveAnnotation;
}(Component));
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
