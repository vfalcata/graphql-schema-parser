"use strict";
exports.__esModule = true;
exports.NamedIndexItem = exports.TypeIndex = exports.ModifiableNameIndex = void 0;
var TypeIndex = /** @class */ (function () {
    function TypeIndex() {
    }
    return TypeIndex;
}());
exports.TypeIndex = TypeIndex;
var NamedIndexItem = /** @class */ (function () {
    function NamedIndexItem(namedIndexItemAttrs) {
        this.name = namedIndexItemAttrs.name;
    }
    return NamedIndexItem;
}());
exports.NamedIndexItem = NamedIndexItem;
var ModifiableNameIndex = /** @class */ (function () {
    function ModifiableNameIndex(modifiableNameIndexAttrs) {
        this.nameIndex = modifiableNameIndexAttrs.nameIndex ? modifiableNameIndexAttrs.nameIndex : new TypeIndex();
        this.name = modifiableNameIndexAttrs.name;
    }
    ModifiableNameIndex.prototype.add = function (element) {
        this.nameIndex[element.name] = element;
        return this.nameIndex;
    };
    ;
    ModifiableNameIndex.prototype.set = function (replacement) {
        this.nameIndex = replacement;
        return this.nameIndex;
    };
    ;
    ModifiableNameIndex.prototype.addMultiple = function (elements) {
        var _this = this;
        elements.forEach(function (element) {
            _this.nameIndex[element.name] = element;
        });
        return this.nameIndex;
    };
    ;
    ModifiableNameIndex.prototype.remove = function (removeElement) {
        delete this.nameIndex[removeElement.name];
        return this.nameIndex;
    };
    ;
    return ModifiableNameIndex;
}());
exports.ModifiableNameIndex = ModifiableNameIndex;
