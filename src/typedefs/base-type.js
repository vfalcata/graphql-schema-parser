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
exports.ScalarDefinition = exports.DirectibleSchemaTypeDefinition = exports.SchemaTypeDefinition = void 0;
var component_1 = require("./component");
var SchemaTypeDefinition = /** @class */ (function (_super) {
    __extends(SchemaTypeDefinition, _super);
    function SchemaTypeDefinition(schemaTypeDefinitionAttrs) {
        var _this = _super.call(this, schemaTypeDefinitionAttrs) || this;
        _this.description = schemaTypeDefinitionAttrs.name;
        _this.isExtended = schemaTypeDefinitionAttrs.isExtended ? true : false;
        return _this;
    }
    return SchemaTypeDefinition;
}(component_1.NamedComponent));
exports.SchemaTypeDefinition = SchemaTypeDefinition;
var DirectibleSchemaTypeDefinition = /** @class */ (function (_super) {
    __extends(DirectibleSchemaTypeDefinition, _super);
    function DirectibleSchemaTypeDefinition(directibleSchemaTypeDefinitionAttrs) {
        var _this = _super.call(this, directibleSchemaTypeDefinitionAttrs) || this;
        _this.directives = directibleSchemaTypeDefinitionAttrs.directives;
        return _this;
    }
    return DirectibleSchemaTypeDefinition;
}(SchemaTypeDefinition));
exports.DirectibleSchemaTypeDefinition = DirectibleSchemaTypeDefinition;
//scalars arent fielded nor elemental 
var ScalarDefinition = /** @class */ (function (_super) {
    __extends(ScalarDefinition, _super);
    function ScalarDefinition(scalarTypeAttrs) {
        return _super.call(this, scalarTypeAttrs) || this;
    }
    return ScalarDefinition;
}(DirectibleSchemaTypeDefinition));
exports.ScalarDefinition = ScalarDefinition;
