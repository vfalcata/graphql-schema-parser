"use strict";
/* the object that represents an entire GraphQL schema that has been parsed */
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
exports.GraphQLSchema = void 0;
var component_1 = require("./component");
var GraphQLSchema = /** @class */ (function (_super) {
    __extends(GraphQLSchema, _super);
    function GraphQLSchema(graphQLSchemaAttrs) {
        var _this = _super.call(this, graphQLSchemaAttrs) || this;
        if (graphQLSchemaAttrs.objects && Object.keys(graphQLSchemaAttrs.objects).length > 0) {
            _this.objects = graphQLSchemaAttrs.objects;
        }
        if (graphQLSchemaAttrs.scalars && Object.keys(graphQLSchemaAttrs.scalars).length > 0) {
            _this.scalars = graphQLSchemaAttrs.scalars;
        }
        if (graphQLSchemaAttrs.interfaces && Object.keys(graphQLSchemaAttrs.interfaces).length > 0) {
            _this.interfaces = graphQLSchemaAttrs.interfaces;
        }
        if (graphQLSchemaAttrs.unions && Object.keys(graphQLSchemaAttrs.unions).length > 0) {
            _this.unions = graphQLSchemaAttrs.unions;
        }
        if (graphQLSchemaAttrs.enums && Object.keys(graphQLSchemaAttrs.enums).length > 0) {
            _this.enums = graphQLSchemaAttrs.enums;
        }
        if (graphQLSchemaAttrs.inputs && Object.keys(graphQLSchemaAttrs.inputs).length > 0) {
            _this.inputs = graphQLSchemaAttrs.inputs;
        }
        if (graphQLSchemaAttrs.directiveDefinitions && Object.keys(graphQLSchemaAttrs.directiveDefinitions).length > 0) {
            _this.directiveDefinitions = graphQLSchemaAttrs.directiveDefinitions;
        }
        return _this;
    }
    GraphQLSchema.prototype.getSchemaObject = function () {
        var result = { name: this.name };
        if (this.objects) {
            result.objects = this.objects;
        }
        if (this.scalars) {
            result.scalars = this.scalars;
        }
        if (this.interfaces) {
            result.interfaces = this.interfaces;
        }
        if (this.unions) {
            result.unions = this.unions;
        }
        if (this.enums) {
            result.enums = this.enums;
        }
        if (this.inputs) {
            result.inputs = this.inputs;
        }
        if (this.directiveDefinitions) {
            result.directiveDefinitions = this.directiveDefinitions;
        }
        return result;
    };
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
