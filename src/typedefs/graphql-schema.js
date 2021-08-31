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
exports.GraphQLSchema = void 0;
var component_1 = require("./component");
var GraphQLSchema = /** @class */ (function (_super) {
    __extends(GraphQLSchema, _super);
    function GraphQLSchema(graphQLSchemaAttrs) {
        var _this = _super.call(this, graphQLSchemaAttrs) || this;
        _this.objects = new component_1.NameIndex();
        _this.scalars = new component_1.NameIndex();
        _this.interfaces = new component_1.NameIndex();
        _this.unions = new component_1.NameIndex();
        _this.enums = new component_1.NameIndex();
        _this.inputs = new component_1.NameIndex();
        _this.directiveDefinitions = new component_1.NameIndex();
        return _this;
    }
    return GraphQLSchema;
}(component_1.DirectibleComponent));
exports.GraphQLSchema = GraphQLSchema;
var GraphQLType;
(function (GraphQLType) {
    GraphQLType["Object"] = "Object";
    GraphQLType["Scalar"] = "Scalar";
    GraphQLType["Interface"] = "Interface";
    GraphQLType["Union"] = "Union";
    GraphQLType["Enum"] = "Enum";
    GraphQLType["Input"] = "Input";
    GraphQLType["DirectiveDefinitions"] = "DirectiveDefinitions";
})(GraphQLType || (GraphQLType = {}));
