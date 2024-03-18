"use strict";
/* Types that contain a list of elements, such as enum, union, directive definition */
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
exports.TypeSystemDirectiveLocationsEnum = exports.ExecutableDirectiveLocationsEnum = exports.DirectiveDefinitionElement = exports.DirectiveDefinition = exports.UnionElement = exports.UnionDefinition = exports.EnumElement = exports.EnumDefinition = void 0;
var component_1 = require("./component");
var base_type_1 = require("./base-type");
var ElementCollection = /** @class */ (function (_super) {
    __extends(ElementCollection, _super);
    function ElementCollection(elementCollectionAttrs) {
        var _this = _super.call(this, elementCollectionAttrs) || this;
        _this.elements = elementCollectionAttrs.elements ? elementCollectionAttrs.elements : new component_1.NameIndex();
        return _this;
    }
    return ElementCollection;
}(base_type_1.SchemaTypeDefinition));
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element(elementAttrs) {
        return _super.call(this, elementAttrs) || this;
    }
    return Element;
}(component_1.NamedComponent));
var DirectibleElementCollection = /** @class */ (function (_super) {
    __extends(DirectibleElementCollection, _super);
    function DirectibleElementCollection(directibleElementCollectionAttrs) {
        var _this = _super.call(this, directibleElementCollectionAttrs) || this;
        if (directibleElementCollectionAttrs.directives && Object.keys(directibleElementCollectionAttrs.directives).length > 0) {
            _this.directives = directibleElementCollectionAttrs.directives;
        }
        _this.isExtended = false;
        return _this;
    }
    return DirectibleElementCollection;
}(ElementCollection));
var DirectibleElement = /** @class */ (function (_super) {
    __extends(DirectibleElement, _super);
    function DirectibleElement(directibleElementAttrs) {
        var _this = _super.call(this, directibleElementAttrs) || this;
        if (directibleElementAttrs.directives && Object.keys(directibleElementAttrs.directives).length > 0) {
            _this.directives = directibleElementAttrs.directives;
        }
        return _this;
    }
    return DirectibleElement;
}(Element));
var EnumDefinition = /** @class */ (function (_super) {
    __extends(EnumDefinition, _super);
    function EnumDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EnumDefinition;
}(DirectibleElementCollection));
exports.EnumDefinition = EnumDefinition;
var EnumElement = /** @class */ (function (_super) {
    __extends(EnumElement, _super);
    function EnumElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EnumElement;
}(DirectibleElement));
exports.EnumElement = EnumElement;
var UnionElement = /** @class */ (function (_super) {
    __extends(UnionElement, _super);
    function UnionElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnionElement;
}(DirectibleElement));
exports.UnionElement = UnionElement;
var UnionDefinition = /** @class */ (function (_super) {
    __extends(UnionDefinition, _super);
    function UnionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnionDefinition;
}(DirectibleElementCollection));
exports.UnionDefinition = UnionDefinition;
var DirectiveDefinition = /** @class */ (function (_super) {
    __extends(DirectiveDefinition, _super);
    function DirectiveDefinition(directiveDefinitionAttrs) {
        var _this = _super.call(this, directiveDefinitionAttrs) || this;
        if (directiveDefinitionAttrs.parameters && Object.keys(directiveDefinitionAttrs.parameters).length > 0) {
            _this.parameters = directiveDefinitionAttrs.parameters;
        }
        return _this;
    }
    return DirectiveDefinition;
}(ElementCollection));
exports.DirectiveDefinition = DirectiveDefinition;
var DirectiveDefinitionElement = /** @class */ (function (_super) {
    __extends(DirectiveDefinitionElement, _super);
    function DirectiveDefinitionElement(elementAttrs) {
        var _this = _super.call(this, elementAttrs) || this;
        if (!(elementAttrs.name in ExecutableDirectiveLocationsEnum) && !(elementAttrs.name in TypeSystemDirectiveLocationsEnum)) {
            throw new Error("The element name '" + elementAttrs.name + "' cannot be added a since it is not listed in enums, ExecutableDirectiveLocationsEnum or TypeSystemDirectiveLocationsEnum");
        }
        return _this;
    }
    return DirectiveDefinitionElement;
}(Element));
exports.DirectiveDefinitionElement = DirectiveDefinitionElement;
var ExecutableDirectiveLocationsEnum;
(function (ExecutableDirectiveLocationsEnum) {
    ExecutableDirectiveLocationsEnum["QUERY"] = "QUERY";
    ExecutableDirectiveLocationsEnum["MUTATION"] = "MUTATION";
    ExecutableDirectiveLocationsEnum["SUBSCRIPTION"] = "SUBSCRIPTION";
    ExecutableDirectiveLocationsEnum["FIELD"] = "FIELD";
    ExecutableDirectiveLocationsEnum["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
    ExecutableDirectiveLocationsEnum["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
    ExecutableDirectiveLocationsEnum["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
})(ExecutableDirectiveLocationsEnum || (ExecutableDirectiveLocationsEnum = {}));
exports.ExecutableDirectiveLocationsEnum = ExecutableDirectiveLocationsEnum;
var TypeSystemDirectiveLocationsEnum;
(function (TypeSystemDirectiveLocationsEnum) {
    TypeSystemDirectiveLocationsEnum["SCHEMA"] = "SCHEMA";
    TypeSystemDirectiveLocationsEnum["SCALAR"] = "SCALAR";
    TypeSystemDirectiveLocationsEnum["OBJECT"] = "OBJECT";
    TypeSystemDirectiveLocationsEnum["FIELD_DEFINITION"] = "FIELD_DEFINITION";
    TypeSystemDirectiveLocationsEnum["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
    TypeSystemDirectiveLocationsEnum["INTERFACE"] = "INTERFACE";
    TypeSystemDirectiveLocationsEnum["UNION"] = "UNION";
    TypeSystemDirectiveLocationsEnum["ENUM"] = "ENUM";
    TypeSystemDirectiveLocationsEnum["ENUM_VALUE"] = "ENUM_VALUE";
    TypeSystemDirectiveLocationsEnum["INPUT_OBJECT"] = "INPUT_OBJECT";
    TypeSystemDirectiveLocationsEnum["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
})(TypeSystemDirectiveLocationsEnum || (TypeSystemDirectiveLocationsEnum = {}));
exports.TypeSystemDirectiveLocationsEnum = TypeSystemDirectiveLocationsEnum;
