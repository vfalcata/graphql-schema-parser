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
exports.InputDefinition = exports.InterfaceDefinition = exports.ObjectDefinition = void 0;
var base_type_1 = require("./base-type");
var FieldedTypeDefinition = /** @class */ (function (_super) {
    __extends(FieldedTypeDefinition, _super);
    function FieldedTypeDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FieldedTypeDefinition;
}(base_type_1.DirectibleSchemaTypeDefinition));
var ObjectDefinition = /** @class */ (function (_super) {
    __extends(ObjectDefinition, _super);
    function ObjectDefinition(objectDefinitionAttrs) {
        var _this = _super.call(this, objectDefinitionAttrs) || this;
        _this.implements = objectDefinitionAttrs.implements;
        return _this;
    }
    return ObjectDefinition;
}(FieldedTypeDefinition));
exports.ObjectDefinition = ObjectDefinition;
var InterfaceDefinition = /** @class */ (function (_super) {
    __extends(InterfaceDefinition, _super);
    function InterfaceDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InterfaceDefinition;
}(FieldedTypeDefinition));
exports.InterfaceDefinition = InterfaceDefinition;
var InputDefinition = /** @class */ (function (_super) {
    __extends(InputDefinition, _super);
    function InputDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InputDefinition;
}(FieldedTypeDefinition));
exports.InputDefinition = InputDefinition;
