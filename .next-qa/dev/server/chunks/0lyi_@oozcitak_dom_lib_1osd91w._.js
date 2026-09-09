module.exports = [
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Defines the position of a boundary point relative to another.
 */ var BoundaryPosition;
(function(BoundaryPosition) {
    BoundaryPosition[BoundaryPosition["Before"] = 0] = "Before";
    BoundaryPosition[BoundaryPosition["Equal"] = 1] = "Equal";
    BoundaryPosition[BoundaryPosition["After"] = 2] = "After";
})(BoundaryPosition = exports.BoundaryPosition || (exports.BoundaryPosition = {}));
/**
 * Defines the event phase.
 */ var EventPhase;
(function(EventPhase) {
    EventPhase[EventPhase["None"] = 0] = "None";
    EventPhase[EventPhase["Capturing"] = 1] = "Capturing";
    EventPhase[EventPhase["AtTarget"] = 2] = "AtTarget";
    EventPhase[EventPhase["Bubbling"] = 3] = "Bubbling";
})(EventPhase = exports.EventPhase || (exports.EventPhase = {}));
/**
 * Defines the type of a node object.
 */ var NodeType;
(function(NodeType) {
    NodeType[NodeType["Element"] = 1] = "Element";
    NodeType[NodeType["Attribute"] = 2] = "Attribute";
    NodeType[NodeType["Text"] = 3] = "Text";
    NodeType[NodeType["CData"] = 4] = "CData";
    NodeType[NodeType["EntityReference"] = 5] = "EntityReference";
    NodeType[NodeType["Entity"] = 6] = "Entity";
    NodeType[NodeType["ProcessingInstruction"] = 7] = "ProcessingInstruction";
    NodeType[NodeType["Comment"] = 8] = "Comment";
    NodeType[NodeType["Document"] = 9] = "Document";
    NodeType[NodeType["DocumentType"] = 10] = "DocumentType";
    NodeType[NodeType["DocumentFragment"] = 11] = "DocumentFragment";
    NodeType[NodeType["Notation"] = 12] = "Notation"; // historical
})(NodeType = exports.NodeType || (exports.NodeType = {}));
/**
 * Defines the position of a node in the document relative to another
 * node.
 */ var Position;
(function(Position) {
    Position[Position["Disconnected"] = 1] = "Disconnected";
    Position[Position["Preceding"] = 2] = "Preceding";
    Position[Position["Following"] = 4] = "Following";
    Position[Position["Contains"] = 8] = "Contains";
    Position[Position["ContainedBy"] = 16] = "ContainedBy";
    Position[Position["ImplementationSpecific"] = 32] = "ImplementationSpecific";
})(Position = exports.Position || (exports.Position = {}));
/**
 * Defines the return value of a filter callback.
 */ var FilterResult;
(function(FilterResult) {
    FilterResult[FilterResult["Accept"] = 1] = "Accept";
    FilterResult[FilterResult["Reject"] = 2] = "Reject";
    FilterResult[FilterResult["Skip"] = 3] = "Skip";
})(FilterResult = exports.FilterResult || (exports.FilterResult = {}));
/**
 * Defines what to show in node filter.
 */ var WhatToShow;
(function(WhatToShow) {
    WhatToShow[WhatToShow["All"] = 4294967295] = "All";
    WhatToShow[WhatToShow["Element"] = 1] = "Element";
    WhatToShow[WhatToShow["Attribute"] = 2] = "Attribute";
    WhatToShow[WhatToShow["Text"] = 4] = "Text";
    WhatToShow[WhatToShow["CDataSection"] = 8] = "CDataSection";
    WhatToShow[WhatToShow["EntityReference"] = 16] = "EntityReference";
    WhatToShow[WhatToShow["Entity"] = 32] = "Entity";
    WhatToShow[WhatToShow["ProcessingInstruction"] = 64] = "ProcessingInstruction";
    WhatToShow[WhatToShow["Comment"] = 128] = "Comment";
    WhatToShow[WhatToShow["Document"] = 256] = "Document";
    WhatToShow[WhatToShow["DocumentType"] = 512] = "DocumentType";
    WhatToShow[WhatToShow["DocumentFragment"] = 1024] = "DocumentFragment";
    WhatToShow[WhatToShow["Notation"] = 2048] = "Notation";
})(WhatToShow = exports.WhatToShow || (exports.WhatToShow = {}));
/**
 * Defines how boundary points are compared.
 */ var HowToCompare;
(function(HowToCompare) {
    HowToCompare[HowToCompare["StartToStart"] = 0] = "StartToStart";
    HowToCompare[HowToCompare["StartToEnd"] = 1] = "StartToEnd";
    HowToCompare[HowToCompare["EndToEnd"] = 2] = "EndToEnd";
    HowToCompare[HowToCompare["EndToStart"] = 3] = "EndToStart";
})(HowToCompare = exports.HowToCompare || (exports.HowToCompare = {}));
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/Guard.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
/**
 * Contains user-defined type guards for DOM objects.
 */ class Guard {
    /**
     * Determines if the given object is a `Node`.
     *
     * @param a - the object to check
     */ static isNode(a) {
        return !!a && a._nodeType !== undefined;
    }
    /**
     * Determines if the given object is a `Document`.
     *
     * @param a - the object to check
     */ static isDocumentNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Document;
    }
    /**
     * Determines if the given object is a `DocumentType`.
     *
     * @param a - the object to check
     */ static isDocumentTypeNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.DocumentType;
    }
    /**
     * Determines if the given object is a `DocumentFragment`.
     *
     * @param a - the object to check
     */ static isDocumentFragmentNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.DocumentFragment;
    }
    /**
     * Determines if the given object is a `Attr`.
     *
     * @param a - the object to check
     */ static isAttrNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Attribute;
    }
    /**
     * Determines if the given node is a `CharacterData` node.
     *
     * @param a - the object to check
     */ static isCharacterDataNode(a) {
        if (!Guard.isNode(a)) return false;
        const type = a._nodeType;
        return type === interfaces_1.NodeType.Text || type === interfaces_1.NodeType.ProcessingInstruction || type === interfaces_1.NodeType.Comment || type === interfaces_1.NodeType.CData;
    }
    /**
     * Determines if the given object is a `Text` or a `CDATASection`.
     *
     * @param a - the object to check
     */ static isTextNode(a) {
        return Guard.isNode(a) && (a._nodeType === interfaces_1.NodeType.Text || a._nodeType === interfaces_1.NodeType.CData);
    }
    /**
     * Determines if the given object is a `Text`.
     *
     * @param a - the object to check
     */ static isExclusiveTextNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Text;
    }
    /**
     * Determines if the given object is a `CDATASection`.
     *
     * @param a - the object to check
     */ static isCDATASectionNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.CData;
    }
    /**
     * Determines if the given object is a `Comment`.
     *
     * @param a - the object to check
     */ static isCommentNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Comment;
    }
    /**
     * Determines if the given object is a `ProcessingInstruction`.
     *
     * @param a - the object to check
     */ static isProcessingInstructionNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.ProcessingInstruction;
    }
    /**
     * Determines if the given object is an `Element`.
     *
     * @param a - the object to check
     */ static isElementNode(a) {
        return Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Element;
    }
    /**
     * Determines if the given object is a custom `Element`.
     *
     * @param a - the object to check
     */ static isCustomElementNode(a) {
        return Guard.isElementNode(a) && a._customElementState === "custom";
    }
    /**
     * Determines if the given object is a `ShadowRoot`.
     *
     * @param a - the object to check
     */ static isShadowRoot(a) {
        return !!a && a.host !== undefined;
    }
    /**
     * Determines if the given object is a `MouseEvent`.
     *
     * @param a - the object to check
     */ static isMouseEvent(a) {
        return !!a && a.screenX !== undefined && a.screenY != undefined;
    }
    /**
     * Determines if the given object is a slotable.
     *
     * Element and Text nodes are slotables. A slotable has an associated name
     * (a string).
     *
     * @param a - the object to check
     */ static isSlotable(a) {
        return !!a && a._name !== undefined && a._assignedSlot !== undefined && (Guard.isTextNode(a) || Guard.isElementNode(a));
    }
    /**
     * Determines if the given object is a slot.
     *
     * @param a - the object to check
     */ static isSlot(a) {
        return !!a && a._name !== undefined && a._assignedNodes !== undefined && Guard.isElementNode(a);
    }
    /**
     * Determines if the given object is a `Window`.
     *
     * @param a - the object to check
     */ static isWindow(a) {
        return !!a && a.navigator !== undefined;
    }
    /**
     * Determines if the given object is an `EventListener`.
     *
     * @param a - the object to check
     */ static isEventListener(a) {
        return !!a && a.handleEvent !== undefined;
    }
    /**
     * Determines if the given object is a `RegisteredObserver`.
     *
     * @param a - the object to check
     */ static isRegisteredObserver(a) {
        return !!a && a.observer !== undefined && a.options !== undefined;
    }
    /**
   * Determines if the given object is a `TransientRegisteredObserver`.
   *
   * @param a - the object to check
   */ static isTransientRegisteredObserver(a) {
        return !!a && a.source !== undefined && Guard.isRegisteredObserver(a);
    }
}
exports.Guard = Guard;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/Cast.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const Guard_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/Guard.js [app-route] (ecmascript)");
/**
 * Contains type casts for DOM objects.
 */ class Cast {
    /**
     * Casts the given object to a `Node`.
     *
     * @param a - the object to cast
     */ static asNode(a) {
        if (Guard_1.Guard.isNode(a)) {
            return a;
        } else {
            throw new Error("Invalid object. Node expected.");
        }
    }
}
exports.Cast = Cast;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/EmptySet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class EmptySet {
    get size() {
        return 0;
    }
    add(value) {
        throw new Error("Cannot add to an empty set.");
    }
    clear() {
    // no-op
    }
    delete(value) {
        return false;
    }
    forEach(callbackfn, thisArg) {
    // no-op
    }
    has(value) {
        return false;
    }
    [Symbol.iterator]() {
        return new EmptySetIterator();
    }
    entries() {
        return new EmptySetIterator();
    }
    keys() {
        return new EmptySetIterator();
    }
    values() {
        return new EmptySetIterator();
    }
    get [Symbol.toStringTag]() {
        return "EmptySet";
    }
}
exports.EmptySet = EmptySet;
class EmptySetIterator {
    [Symbol.iterator]() {
        return this;
    }
    next() {
        return {
            done: true,
            value: null
        };
    }
}
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Cast_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/Cast.js [app-route] (ecmascript)");
exports.Cast = Cast_1.Cast;
var Guard_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/Guard.js [app-route] (ecmascript)");
exports.Guard = Guard_1.Guard;
var EmptySet_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/EmptySet.js [app-route] (ecmascript)");
exports.EmptySet = EmptySet_1.EmptySet;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/LocalNameSet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Represents a set of unique attribute namespaceURI and localName pairs.
 * This set will contain tuples of unique attribute namespaceURI and
 * localName pairs, and is populated as each attr is processed. This set is
 * used to [optionally] enforce the well-formed constraint that an element
 * cannot have two attributes with the same namespaceURI and localName.
 * This can occur when two otherwise identical attributes on the same
 * element differ only by their prefix values.
 */ class LocalNameSet {
    constructor(){
        // tuple storage
        this._items = {};
        this._nullItems = {};
    }
    /**
     * Adds or replaces a tuple.
     *
     * @param ns - namespace URI
     * @param localName - attribute local name
     */ set(ns, localName) {
        if (ns === null) {
            this._nullItems[localName] = true;
        } else if (this._items[ns]) {
            this._items[ns][localName] = true;
        } else {
            this._items[ns] = {};
            this._items[ns][localName] = true;
        }
    }
    /**
     * Determines if the given tuple exists in the set.
     *
     * @param ns - namespace URI
     * @param localName - attribute local name
     */ has(ns, localName) {
        if (ns === null) {
            return this._nullItems[localName] === true;
        } else if (this._items[ns]) {
            return this._items[ns][localName] === true;
        } else {
            return false;
        }
    }
}
exports.LocalNameSet = LocalNameSet;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/NamespacePrefixMap.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * A namespace prefix map is a map that associates namespaceURI and namespace
 * prefix lists, where namespaceURI values are the map's unique keys (which can
 * include the null value representing no namespace), and ordered lists of
 * associated prefix values are the map's key values. The namespace prefix map
 * will be populated by previously seen namespaceURIs and all their previously
 * encountered prefix associations for a given node and its ancestors.
 *
 * _Note:_ The last seen prefix for a given namespaceURI is at the end of its
 * respective list. The list is searched to find potentially matching prefixes,
 * and if no matches are found for the given namespaceURI, then the last prefix
 * in the list is used. See copy a namespace prefix map and retrieve a preferred
 * prefix string for additional details.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-namespace-prefix-map
 */ class NamespacePrefixMap {
    constructor(){
        this._items = {};
        this._nullItems = [];
    }
    /**
     * Creates a copy of the map.
     */ copy() {
        /**
         * To copy a namespace prefix map map means to copy the map's keys into a
         * new empty namespace prefix map, and to copy each of the values in the
         * namespace prefix list associated with each keys' value into a new list
         * which should be associated with the respective key in the new map.
         */ const mapCopy = new NamespacePrefixMap();
        for(const key in this._items){
            mapCopy._items[key] = this._items[key].slice(0);
        }
        mapCopy._nullItems = this._nullItems.slice(0);
        return mapCopy;
    }
    /**
     * Retrieves a preferred prefix string from the namespace prefix map.
     *
     * @param preferredPrefix - preferred prefix string
     * @param ns - namespace
     */ get(preferredPrefix, ns) {
        /**
         * 1. Let candidates list be the result of retrieving a list from map where
         * there exists a key in map that matches the value of ns or if there is no
         * such key, then stop running these steps, and return the null value.
         */ const candidatesList = ns === null ? this._nullItems : this._items[ns] || null;
        if (candidatesList === null) {
            return null;
        }
        /**
         * 2. Otherwise, for each prefix value prefix in candidates list, iterating
         * from beginning to end:
         *
         * _Note:_ There will always be at least one prefix value in the list.
         */ let prefix = null;
        for(let i = 0; i < candidatesList.length; i++){
            prefix = candidatesList[i];
            /**
             * 2.1. If prefix matches preferred prefix, then stop running these steps
             * and return prefix.
             */ if (prefix === preferredPrefix) {
                return prefix;
            }
        }
        /**
        * 2.2. If prefix is the last item in the candidates list, then stop
        * running these steps and return prefix.
        */ return prefix;
    }
    /**
     * Checks if a prefix string is found in the namespace prefix map associated
     * with the given namespace.
     *
     * @param prefix - prefix string
     * @param ns - namespace
     */ has(prefix, ns) {
        /**
         * 1. Let candidates list be the result of retrieving a list from map where
         * there exists a key in map that matches the value of ns or if there is
         * no such key, then stop running these steps, and return false.
         */ const candidatesList = ns === null ? this._nullItems : this._items[ns] || null;
        if (candidatesList === null) {
            return false;
        }
        /**
         * 2. If the value of prefix occurs at least once in candidates list,
         * return true, otherwise return false.
         */ return candidatesList.indexOf(prefix) !== -1;
    }
    /**
     * Checks if a prefix string is found in the namespace prefix map.
     *
     * @param prefix - prefix string
     */ hasPrefix(prefix) {
        if (this._nullItems.indexOf(prefix) !== -1) return true;
        for(const key in this._items){
            if (this._items[key].indexOf(prefix) !== -1) return true;
        }
        return false;
    }
    /**
     * Adds a prefix string associated with a namespace to the prefix map.
     *
     * @param prefix - prefix string
     * @param ns - namespace
     */ set(prefix, ns) {
        /**
         * 1. Let candidates list be the result of retrieving a list from map where
         * there exists a key in map that matches the value of ns or if there is
         * no such key, then let candidates list be null.
         */ const candidatesList = ns === null ? this._nullItems : this._items[ns] || null;
        /**
         * 2. If candidates list is null, then create a new list with prefix as the
         * only item in the list, and associate that list with a new key ns in map.
         * 3. Otherwise, append prefix to the end of candidates list.
         *
         * _Note:_ The steps in retrieve a preferred prefix string use the list to
         * track the most recently used (MRU) prefix associated with a given
         * namespace, which will be the prefix at the end of the list. This list
         * may contain duplicates of the same prefix value seen earlier
         * (and that's OK).
         */ if (ns !== null && candidatesList === null) {
            this._items[ns] = [
                prefix
            ];
        } else {
            candidatesList.push(prefix);
        }
    }
}
exports.NamespacePrefixMap = NamespacePrefixMap;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Represents the base class of `Error` objects used by this module.
 */ class DOMException extends Error {
    /**
     *
     * @param name - message name
     * @param message - error message
     */ constructor(name, message = ""){
        super(message);
        this.name = name;
    }
}
exports.DOMException = DOMException;
class DOMStringSizeError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("DOMStringSizeError", message);
    }
}
exports.DOMStringSizeError = DOMStringSizeError;
class WrongDocumentError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("WrongDocumentError", "The object is in the wrong document. " + message);
    }
}
exports.WrongDocumentError = WrongDocumentError;
class NoDataAllowedError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("NoDataAllowedError", message);
    }
}
exports.NoDataAllowedError = NoDataAllowedError;
class NoModificationAllowedError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("NoModificationAllowedError", "The object can not be modified. " + message);
    }
}
exports.NoModificationAllowedError = NoModificationAllowedError;
class NotSupportedError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("NotSupportedError", "The operation is not supported. " + message);
    }
}
exports.NotSupportedError = NotSupportedError;
class InUseAttributeError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("InUseAttributeError", message);
    }
}
exports.InUseAttributeError = InUseAttributeError;
class InvalidStateError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("InvalidStateError", "The object is in an invalid state. " + message);
    }
}
exports.InvalidStateError = InvalidStateError;
class InvalidModificationError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("InvalidModificationError", "The object can not be modified in this way. " + message);
    }
}
exports.InvalidModificationError = InvalidModificationError;
class NamespaceError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("NamespaceError", "The operation is not allowed by Namespaces in XML. [XMLNS] " + message);
    }
}
exports.NamespaceError = NamespaceError;
class InvalidAccessError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("InvalidAccessError", "The object does not support the operation or argument. " + message);
    }
}
exports.InvalidAccessError = InvalidAccessError;
class ValidationError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("ValidationError", message);
    }
}
exports.ValidationError = ValidationError;
class TypeMismatchError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("TypeMismatchError", message);
    }
}
exports.TypeMismatchError = TypeMismatchError;
class SecurityError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("SecurityError", "The operation is insecure. " + message);
    }
}
exports.SecurityError = SecurityError;
class NetworkError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("NetworkError", "A network error occurred. " + message);
    }
}
exports.NetworkError = NetworkError;
class AbortError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("AbortError", "The operation was aborted. " + message);
    }
}
exports.AbortError = AbortError;
class URLMismatchError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("URLMismatchError", "The given URL does not match another URL. " + message);
    }
}
exports.URLMismatchError = URLMismatchError;
class QuotaExceededError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("QuotaExceededError", "The quota has been exceeded. " + message);
    }
}
exports.QuotaExceededError = QuotaExceededError;
class TimeoutError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("TimeoutError", "The operation timed out. " + message);
    }
}
exports.TimeoutError = TimeoutError;
class InvalidNodeTypeError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("InvalidNodeTypeError", "The supplied node is incorrect or has an incorrect ancestor for this operation. " + message);
    }
}
exports.InvalidNodeTypeError = InvalidNodeTypeError;
class DataCloneError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("DataCloneError", "The object can not be cloned. " + message);
    }
}
exports.DataCloneError = DataCloneError;
class NotImplementedError extends DOMException {
    /**
    * @param message - error message
    */ constructor(message = ""){
        super("NotImplementedError", "The DOM method is not implemented by this module. " + message);
    }
}
exports.NotImplementedError = NotImplementedError;
class HierarchyRequestError extends DOMException {
    /**
     * @param message - error message
     */ constructor(message = ""){
        super("HierarchyRequestError", "The operation would yield an incorrect node tree. " + message);
    }
}
exports.HierarchyRequestError = HierarchyRequestError;
class NotFoundError extends DOMException {
    /**
     * @param message - error message
     */ constructor(message = ""){
        super("NotFoundError", "The object can not be found here. " + message);
    }
}
exports.NotFoundError = NotFoundError;
class IndexSizeError extends DOMException {
    /**
     * @param message - error message
     */ constructor(message = ""){
        super("IndexSizeError", "The index is not in the allowed range. " + message);
    }
}
exports.IndexSizeError = IndexSizeError;
class SyntaxError extends DOMException {
    /**
     * @param message - error message
     */ constructor(message = ""){
        super("SyntaxError", "The string did not match the expected pattern. " + message);
    }
}
exports.SyntaxError = SyntaxError;
class InvalidCharacterError extends DOMException {
    /**
     * @param message - error message
     */ constructor(message = ""){
        super("InvalidCharacterError", "The string contains invalid characters. " + message);
    }
}
exports.InvalidCharacterError = InvalidCharacterError;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbortControllerImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a controller that allows to abort DOM requests.
 */ class AbortControllerImpl {
    /**
     * Initializes a new instance of `AbortController`.
     */ constructor(){
        /**
         * 1. Let signal be a new AbortSignal object.
         * 2. Let controller be a new AbortController object whose signal is signal.
         * 3. Return controller.
         */ this._signal = algorithm_1.create_abortSignal();
    }
    /** @inheritdoc */ get signal() {
        return this._signal;
    }
    /** @inheritdoc */ abort() {
        algorithm_1.abort_signalAbort(this._signal);
    }
}
exports.AbortControllerImpl = AbortControllerImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventTargetImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a target to which an event can be dispatched.
 */ class EventTargetImpl {
    /**
     * Initializes a new instance of `EventTarget`.
     */ constructor(){}
    get _eventListenerList() {
        return this.__eventListenerList || (this.__eventListenerList = []);
    }
    get _eventHandlerMap() {
        return this.__eventHandlerMap || (this.__eventHandlerMap = {});
    }
    /** @inheritdoc */ addEventListener(type, callback, options = {
        passive: false,
        once: false,
        capture: false
    }) {
        /**
         * 1. Let capture, passive, and once be the result of flattening more options.
         */ const [capture, passive, once] = algorithm_1.eventTarget_flattenMore(options);
        // convert callback function to EventListener, return if null
        let listenerCallback;
        if (!callback) {
            return;
        } else if (util_1.Guard.isEventListener(callback)) {
            listenerCallback = callback;
        } else {
            listenerCallback = {
                handleEvent: callback
            };
        }
        /**
         * 2. Add an event listener with the context object and an event listener
         * whose type is type, callback is callback, capture is capture, passive is
         * passive, and once is once.
         */ algorithm_1.eventTarget_addEventListener(this, {
            type: type,
            callback: listenerCallback,
            capture: capture,
            passive: passive,
            once: once,
            removed: false
        });
    }
    /** @inheritdoc */ removeEventListener(type, callback, options = {
        capture: false
    }) {
        /**
         * TODO: Implement realms
         * 1. If the context object’s relevant global object is a
         * ServiceWorkerGlobalScope object and its associated service worker’s
         * script resource’s has ever been evaluated flag is set, then throw
         * a TypeError. [SERVICE-WORKERS]
         */ /**
         * 2. Let capture be the result of flattening options.
         */ const capture = algorithm_1.eventTarget_flatten(options);
        if (!callback) return;
        /**
         * 3. If the context object’s event listener list contains an event listener
         * whose type is type, callback is callback, and capture is capture, then
         * remove an event listener with the context object and that event listener.
         */ for(let i = 0; i < this._eventListenerList.length; i++){
            const entry = this._eventListenerList[i];
            if (entry.type !== type || entry.capture !== capture) continue;
            if (util_1.Guard.isEventListener(callback) && entry.callback === callback) {
                algorithm_1.eventTarget_removeEventListener(this, entry, i);
                break;
            } else if (callback && entry.callback.handleEvent === callback) {
                algorithm_1.eventTarget_removeEventListener(this, entry, i);
                break;
            }
        }
    }
    /** @inheritdoc */ dispatchEvent(event) {
        /**
         * 1. If event’s dispatch flag is set, or if its initialized flag is not
         * set, then throw an "InvalidStateError" DOMException.
         * 2. Initialize event’s isTrusted attribute to false.
         * 3. Return the result of dispatching event to the context object.
         */ if (event._dispatchFlag || !event._initializedFlag) {
            throw new DOMException_1.InvalidStateError();
        }
        event._isTrusted = false;
        return algorithm_1.event_dispatch(event, this);
    }
    /** @inheritdoc */ _getTheParent(event) {
        return null;
    }
}
exports.EventTargetImpl = EventTargetImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbortSignalImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const EventTargetImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventTargetImpl.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */ class AbortSignalImpl extends EventTargetImpl_1.EventTargetImpl {
    /**
     * Initializes a new instance of `AbortSignal`.
     */ constructor(){
        super();
        this._abortedFlag = false;
        this._abortAlgorithms = new Set();
    }
    /** @inheritdoc */ get aborted() {
        return this._abortedFlag;
    }
    /** @inheritdoc */ get onabort() {
        return algorithm_1.event_getterEventHandlerIDLAttribute(this, "onabort");
    }
    set onabort(val) {
        algorithm_1.event_setterEventHandlerIDLAttribute(this, "onabort", val);
    }
    /**
     * Creates a new `AbortSignal`.
     */ static _create() {
        return new AbortSignalImpl();
    }
}
exports.AbortSignalImpl = AbortSignalImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbstractRangeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Represents an abstract range with a start and end boundary point.
 */ class AbstractRangeImpl {
    get _startNode() {
        return this._start[0];
    }
    get _startOffset() {
        return this._start[1];
    }
    get _endNode() {
        return this._end[0];
    }
    get _endOffset() {
        return this._end[1];
    }
    get _collapsed() {
        return this._start[0] === this._end[0] && this._start[1] === this._end[1];
    }
    /** @inheritdoc */ get startContainer() {
        return this._startNode;
    }
    /** @inheritdoc */ get startOffset() {
        return this._startOffset;
    }
    /** @inheritdoc */ get endContainer() {
        return this._endNode;
    }
    /** @inheritdoc */ get endOffset() {
        return this._endOffset;
    }
    /** @inheritdoc */ get collapsed() {
        return this._collapsed;
    }
}
exports.AbstractRangeImpl = AbstractRangeImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Defines a WebIDL `Const` property on the given object.
 *
 * @param o - object on which to add the property
 * @param name - property name
 * @param value - property value
 */ function idl_defineConst(o, name, value) {
    Object.defineProperty(o, name, {
        writable: false,
        enumerable: true,
        configurable: false,
        value: value
    });
}
exports.idl_defineConst = idl_defineConst;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const EventTargetImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventTargetImpl.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const URLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/url/lib/URLAlgorithm.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a generic XML node.
 */ class NodeImpl extends EventTargetImpl_1.EventTargetImpl {
    /**
     * Initializes a new instance of `Node`.
     */ constructor(){
        super();
        this._parent = null;
        this._firstChild = null;
        this._lastChild = null;
        this._previousSibling = null;
        this._nextSibling = null;
    }
    get _childNodes() {
        return this.__childNodes || (this.__childNodes = algorithm_1.create_nodeList(this));
    }
    get _nodeDocument() {
        return this._nodeDocumentOverride || _1.dom.window._associatedDocument;
    }
    set _nodeDocument(val) {
        this._nodeDocumentOverride = val;
    }
    get _registeredObserverList() {
        return this.__registeredObserverList || (this.__registeredObserverList = []);
    }
    /** @inheritdoc */ get nodeType() {
        return this._nodeType;
    }
    /**
     * Returns a string appropriate for the type of node.
     */ get nodeName() {
        if (util_1.Guard.isElementNode(this)) {
            return this._htmlUppercasedQualifiedName;
        } else if (util_1.Guard.isAttrNode(this)) {
            return this._qualifiedName;
        } else if (util_1.Guard.isExclusiveTextNode(this)) {
            return "#text";
        } else if (util_1.Guard.isCDATASectionNode(this)) {
            return "#cdata-section";
        } else if (util_1.Guard.isProcessingInstructionNode(this)) {
            return this._target;
        } else if (util_1.Guard.isCommentNode(this)) {
            return "#comment";
        } else if (util_1.Guard.isDocumentNode(this)) {
            return "#document";
        } else if (util_1.Guard.isDocumentTypeNode(this)) {
            return this._name;
        } else if (util_1.Guard.isDocumentFragmentNode(this)) {
            return "#document-fragment";
        } else {
            return "";
        }
    }
    /**
     * Gets the absolute base URL of the node.
     */ get baseURI() {
        /**
         * The baseURI attribute’s getter must return node document’s document
         * base URL, serialized.
         * TODO: Implement in HTML DOM
         * https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url
         */ return URLAlgorithm_1.urlSerializer(this._nodeDocument._URL);
    }
    /**
     * Returns whether the node is rooted to a document node.
     */ get isConnected() {
        /**
         * The isConnected attribute’s getter must return true, if context object
         * is connected, and false otherwise.
         */ return util_1.Guard.isElementNode(this) && algorithm_1.shadowTree_isConnected(this);
    }
    /**
     * Returns the parent document.
     */ get ownerDocument() {
        /**
         * The ownerDocument attribute’s getter must return null, if the context
         * object is a document, and the context object’s node document otherwise.
         * _Note:_ The node document of a document is that document itself. All
         * nodes have a node document at all times.
         */ if (this._nodeType === interfaces_1.NodeType.Document) return null;
        else return this._nodeDocument;
    }
    /**
     * Returns the root node.
     *
     * @param options - if options has `composed = true` this function
     * returns the node's shadow-including root, otherwise it returns
     * the node's root node.
     */ getRootNode(options) {
        /**
         * The getRootNode(options) method, when invoked, must return context
         * object’s shadow-including root if options’s composed is true,
         * and context object’s root otherwise.
         */ return algorithm_1.tree_rootNode(this, !!options && options.composed);
    }
    /**
     * Returns the parent node.
     */ get parentNode() {
        /**
         * The parentNode attribute’s getter must return the context object’s parent.
         * _Note:_ An Attr node has no parent.
         */ if (this._nodeType === interfaces_1.NodeType.Attribute) {
            return null;
        } else {
            return this._parent;
        }
    }
    /**
     * Returns the parent element.
     */ get parentElement() {
        /**
         * The parentElement attribute’s getter must return the context object’s
         * parent element.
         */ if (this._parent && util_1.Guard.isElementNode(this._parent)) {
            return this._parent;
        } else {
            return null;
        }
    }
    /**
     * Determines whether a node has any children.
     */ hasChildNodes() {
        /**
         * The hasChildNodes() method, when invoked, must return true if the context
         * object has children, and false otherwise.
         */ return this._firstChild !== null;
    }
    /**
     * Returns a {@link NodeList} of child nodes.
     */ get childNodes() {
        /**
         * The childNodes attribute’s getter must return a NodeList rooted at the
         * context object matching only children.
         */ return this._childNodes;
    }
    /**
     * Returns the first child node.
     */ get firstChild() {
        /**
         * The firstChild attribute’s getter must return the context object’s first
         * child.
         */ return this._firstChild;
    }
    /**
     * Returns the last child node.
     */ get lastChild() {
        /**
         * The lastChild attribute’s getter must return the context object’s last
         * child.
         */ return this._lastChild;
    }
    /**
     * Returns the previous sibling node.
     */ get previousSibling() {
        /**
         * The previousSibling attribute’s getter must return the context object’s
         * previous sibling.
         * _Note:_ An Attr node has no siblings.
         */ return this._previousSibling;
    }
    /**
     * Returns the next sibling node.
     */ get nextSibling() {
        /**
         * The nextSibling attribute’s getter must return the context object’s
         * next sibling.
         */ return this._nextSibling;
    }
    /**
     * Gets or sets the data associated with a {@link CharacterData} node or the
     * value of an {@link @Attr} node. For other node types returns `null`.
     */ get nodeValue() {
        if (util_1.Guard.isAttrNode(this)) {
            return this._value;
        } else if (util_1.Guard.isCharacterDataNode(this)) {
            return this._data;
        } else {
            return null;
        }
    }
    set nodeValue(value) {
        if (value === null) {
            value = '';
        }
        if (util_1.Guard.isAttrNode(this)) {
            algorithm_1.attr_setAnExistingAttributeValue(this, value);
        } else if (util_1.Guard.isCharacterDataNode(this)) {
            algorithm_1.characterData_replaceData(this, 0, this._data.length, value);
        }
    }
    /**
     * Returns the concatenation of data of all the {@link Text}
     * node descendants in tree order. When set, replaces the text
     * contents of the node with the given value.
     */ get textContent() {
        if (util_1.Guard.isDocumentFragmentNode(this) || util_1.Guard.isElementNode(this)) {
            return algorithm_1.text_descendantTextContent(this);
        } else if (util_1.Guard.isAttrNode(this)) {
            return this._value;
        } else if (util_1.Guard.isCharacterDataNode(this)) {
            return this._data;
        } else {
            return null;
        }
    }
    set textContent(value) {
        if (value === null) {
            value = '';
        }
        if (util_1.Guard.isDocumentFragmentNode(this) || util_1.Guard.isElementNode(this)) {
            algorithm_1.node_stringReplaceAll(value, this);
        } else if (util_1.Guard.isAttrNode(this)) {
            algorithm_1.attr_setAnExistingAttributeValue(this, value);
        } else if (util_1.Guard.isCharacterDataNode(this)) {
            algorithm_1.characterData_replaceData(this, 0, algorithm_1.tree_nodeLength(this), value);
        }
    }
    /**
     * Puts all {@link Text} nodes in the full depth of the sub-tree
     * underneath this node into a "normal" form where only markup
     * (e.g., tags, comments, processing instructions, CDATA sections,
     * and entity references) separates {@link Text} nodes, i.e., there
     * are no adjacent Text nodes.
     */ normalize() {
        /**
         * The normalize() method, when invoked, must run these steps for each
         * descendant exclusive Text node node of context object:
         */ const descendantNodes = [];
        let node = algorithm_1.tree_getFirstDescendantNode(this, false, false, (e)=>util_1.Guard.isExclusiveTextNode(e));
        while(node !== null){
            descendantNodes.push(node);
            node = algorithm_1.tree_getNextDescendantNode(this, node, false, false, (e)=>util_1.Guard.isExclusiveTextNode(e));
        }
        for(let i = 0; i < descendantNodes.length; i++){
            const node = descendantNodes[i];
            if (node._parent === null) continue;
            /**
             * 1. Let length be node’s length.
             * 2. If length is zero, then remove node and continue with the next
             * exclusive Text node, if any.
             */ let length = algorithm_1.tree_nodeLength(node);
            if (length === 0) {
                algorithm_1.mutation_remove(node, node._parent);
                continue;
            }
            /**
             * 3. Let data be the concatenation of the data of node’s contiguous
             * exclusive Text nodes (excluding itself), in tree order.
             */ const textSiblings = [];
            let data = '';
            for (const sibling of algorithm_1.text_contiguousExclusiveTextNodes(node)){
                textSiblings.push(sibling);
                data += sibling._data;
            }
            /**
             * 4. Replace data with node node, offset length, count 0, and data data.
             */ algorithm_1.characterData_replaceData(node, length, 0, data);
            /**
             * 5. Let currentNode be node’s next sibling.
             * 6. While currentNode is an exclusive Text node:
             */ if (_1.dom.rangeList.size !== 0) {
                let currentNode = node._nextSibling;
                while(currentNode !== null && util_1.Guard.isExclusiveTextNode(currentNode)){
                    /**
                     * 6.1. For each live range whose start node is currentNode, add length
                     * to its start offset and set its start node to node.
                     * 6.2. For each live range whose end node is currentNode, add length to
                     * its end offset and set its end node to node.
                     * 6.3. For each live range whose start node is currentNode’s parent and
                     * start offset is currentNode’s index, set its start node to node and
                     * its start offset to length.
                     * 6.4. For each live range whose end node is currentNode’s parent and
                     * end offset is currentNode’s index, set its end node to node and its
                     * end offset to length.
                     */ const cn = currentNode;
                    const index = algorithm_1.tree_index(cn);
                    for (const range of _1.dom.rangeList){
                        if (range._start[0] === cn) {
                            range._start[0] = node;
                            range._start[1] += length;
                        }
                        if (range._end[0] === cn) {
                            range._end[0] = node;
                            range._end[1] += length;
                        }
                        if (range._start[0] === cn._parent && range._start[1] === index) {
                            range._start[0] = node;
                            range._start[1] = length;
                        }
                        if (range._end[0] === cn._parent && range._end[1] === index) {
                            range._end[0] = node;
                            range._end[1] = length;
                        }
                    }
                    /**
                     * 6.5. Add currentNode’s length to length.
                     * 6.6. Set currentNode to its next sibling.
                     */ length += algorithm_1.tree_nodeLength(currentNode);
                    currentNode = currentNode._nextSibling;
                }
            }
            /**
             * 7. Remove node’s contiguous exclusive Text nodes (excluding itself),
             * in tree order.
             */ for(let i = 0; i < textSiblings.length; i++){
                const sibling = textSiblings[i];
                if (sibling._parent === null) continue;
                algorithm_1.mutation_remove(sibling, sibling._parent);
            }
        }
    }
    /**
     * Returns a duplicate of this node, i.e., serves as a generic copy
     * constructor for nodes. The duplicate node has no parent
     * ({@link parentNode} returns `null`).
     *
     * @param deep - if `true`, recursively clone the subtree under the
     * specified node. If `false`, clone only the node itself (and its
     * attributes, if it is an {@link Element}).
     */ cloneNode(deep = false) {
        /**
         * 1. If context object is a shadow root, then throw a "NotSupportedError"
         * DOMException.
         * 2. Return a clone of the context object, with the clone children flag set
         * if deep is true.
         */ if (util_1.Guard.isShadowRoot(this)) throw new DOMException_1.NotSupportedError();
        return algorithm_1.node_clone(this, null, deep);
    }
    /**
     * Determines if the given node is equal to this one.
     *
     * @param node - the node to compare with
     */ isEqualNode(node = null) {
        /**
         * The isEqualNode(otherNode) method, when invoked, must return true if
         * otherNode is non-null and context object equals otherNode, and false
         * otherwise.
         */ return node !== null && algorithm_1.node_equals(this, node);
    }
    /**
     * Determines if the given node is reference equal to this one.
     *
     * @param node - the node to compare with
     */ isSameNode(node = null) {
        /**
         * The isSameNode(otherNode) method, when invoked, must return true if
         * otherNode is context object, and false otherwise.
         */ return this === node;
    }
    /**
     * Returns a bitmask indicating the position of the given `node`
     * relative to this node.
     */ compareDocumentPosition(other) {
        /**
         * 1. If context object is other, then return zero.
         * 2. Let node1 be other and node2 be context object.
         * 3. Let attr1 and attr2 be null.
         * attr1’s element.
         */ if (other === this) return 0;
        let node1 = other;
        let node2 = this;
        let attr1 = null;
        let attr2 = null;
        /**
         * 4. If node1 is an attribute, then set attr1 to node1 and node1 to
         * attr1’s element.
         */ if (util_1.Guard.isAttrNode(node1)) {
            attr1 = node1;
            node1 = attr1._element;
        }
        /**
         * 5. If node2 is an attribute, then:
         */ if (util_1.Guard.isAttrNode(node2)) {
            /**
             * 5.1. Set attr2 to node2 and node2 to attr2’s element.
             */ attr2 = node2;
            node2 = attr2._element;
            /**
             * 5.2. If attr1 and node1 are non-null, and node2 is node1, then:
             */ if (attr1 && node1 && node1 === node2) {
                /**
                 * 5.2. For each attr in node2’s attribute list:
                 */ for(let i = 0; i < node2._attributeList.length; i++){
                    const attr = node2._attributeList[i];
                    /**
                     * 5.2.1. If attr equals attr1, then return the result of adding
                     * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and
                     * DOCUMENT_POSITION_PRECEDING.
                     * 5.2.2. If attr equals attr2, then return the result of adding
                     * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and
                     * DOCUMENT_POSITION_FOLLOWING.
                     */ if (algorithm_1.node_equals(attr, attr1)) {
                        return interfaces_1.Position.ImplementationSpecific | interfaces_1.Position.Preceding;
                    } else if (algorithm_1.node_equals(attr, attr2)) {
                        return interfaces_1.Position.ImplementationSpecific | interfaces_1.Position.Following;
                    }
                }
            }
        }
        /**
         * 6. If node1 or node2 is null, or node1’s root is not node2’s root, then
         * return the result of adding DOCUMENT_POSITION_DISCONNECTED,
         * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either
         * DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING,
         * with the constraint that this is to be consistent, together.
         */ if (node1 === null || node2 === null || algorithm_1.tree_rootNode(node1) !== algorithm_1.tree_rootNode(node2)) {
            // nodes are disconnected
            // return a random result but cache the value for consistency
            return interfaces_1.Position.Disconnected | interfaces_1.Position.ImplementationSpecific | (_1.dom.compareCache.check(this, other) ? interfaces_1.Position.Preceding : interfaces_1.Position.Following);
        }
        /**
         * 7. If node1 is an ancestor of node2 and attr1 is null, or node1 is node2
         * and attr2 is non-null, then return the result of adding
         * DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
         */ if (!attr1 && algorithm_1.tree_isAncestorOf(node2, node1) || attr2 && node1 === node2) {
            return interfaces_1.Position.Contains | interfaces_1.Position.Preceding;
        }
        /**
         * 8. If node1 is a descendant of node2 and attr2 is null, or node1 is node2
         * and attr1 is non-null, then return the result of adding
         * DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
         */ if (!attr2 && algorithm_1.tree_isDescendantOf(node2, node1) || attr1 && node1 === node2) {
            return interfaces_1.Position.ContainedBy | interfaces_1.Position.Following;
        }
        /**
         * 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
         */ if (algorithm_1.tree_isPreceding(node2, node1)) return interfaces_1.Position.Preceding;
        /**
         * 10. Return DOCUMENT_POSITION_FOLLOWING.
         */ return interfaces_1.Position.Following;
    }
    /**
     * Returns `true` if given node is an inclusive descendant of this
     * node, and `false` otherwise (including when other node is `null`).
     *
     * @param other - the node to check
     */ contains(other) {
        /**
         * The contains(other) method, when invoked, must return true if other is an
         * inclusive descendant of context object, and false otherwise (including
         * when other is null).
         */ if (other === null) return false;
        return algorithm_1.tree_isDescendantOf(this, other, true);
    }
    /**
     * Returns the prefix for a given namespace URI, if present, and
     * `null` if not.
     *
     * @param namespace - the namespace to search
     */ lookupPrefix(namespace) {
        /**
         * 1. If namespace is null or the empty string, then return null.
         * 2. Switch on the context object:
         */ if (!namespace) return null;
        if (util_1.Guard.isElementNode(this)) {
            /**
             * Return the result of locating a namespace prefix for it using
             * namespace.
             */ return algorithm_1.node_locateANamespacePrefix(this, namespace);
        } else if (util_1.Guard.isDocumentNode(this)) {
            /**
             * Return the result of locating a namespace prefix for its document
             * element, if its document element is non-null, and null otherwise.
             */ if (this.documentElement === null) {
                return null;
            } else {
                return algorithm_1.node_locateANamespacePrefix(this.documentElement, namespace);
            }
        } else if (util_1.Guard.isDocumentTypeNode(this) || util_1.Guard.isDocumentFragmentNode(this)) {
            return null;
        } else if (util_1.Guard.isAttrNode(this)) {
            /**
             * Return the result of locating a namespace prefix for its element,
             * if its element is non-null, and null otherwise.
             */ if (this._element === null) {
                return null;
            } else {
                return algorithm_1.node_locateANamespacePrefix(this._element, namespace);
            }
        } else {
            /**
             * Return the result of locating a namespace prefix for its parent
             * element, if its parent element is non-null, and null otherwise.
             */ if (this._parent !== null && util_1.Guard.isElementNode(this._parent)) {
                return algorithm_1.node_locateANamespacePrefix(this._parent, namespace);
            } else {
                return null;
            }
        }
    }
    /**
     * Returns the namespace URI for a given prefix if present, and `null`
     * if not.
     *
     * @param prefix - the prefix to search
     */ lookupNamespaceURI(prefix) {
        /**
         * 1. If prefix is the empty string, then set it to null.
         * 2. Return the result of running locate a namespace for the context object
         * using prefix.
         */ return algorithm_1.node_locateANamespace(this, prefix || null);
    }
    /**
     * Returns `true` if the namespace is the default namespace on this
     * node or `false` if not.
     *
     * @param namespace - the namespace to check
     */ isDefaultNamespace(namespace) {
        /**
         * 1. If namespace is the empty string, then set it to null.
         * 2. Let defaultNamespace be the result of running locate a namespace for
         * context object using null.
         * 3. Return true if defaultNamespace is the same as namespace, and false otherwise.
         */ if (!namespace) namespace = null;
        const defaultNamespace = algorithm_1.node_locateANamespace(this, null);
        return defaultNamespace === namespace;
    }
    /**
     * Inserts the node `newChild` before the existing child node
     * `refChild`. If `refChild` is `null`, inserts `newChild` at the end
     * of the list of children.
     *
     * If `newChild` is a {@link DocumentFragment} object, all of its
     * children are inserted, in the same order, before `refChild`.
     *
     * If `newChild` is already in the tree, it is first removed.
     *
     * @param newChild - the node to insert
     * @param refChild - the node before which the new node must be
     *   inserted
     *
     * @returns the newly inserted child node
     */ insertBefore(newChild, refChild) {
        /**
         * The insertBefore(node, child) method, when invoked, must return the
         * result of pre-inserting node into context object before child.
         */ return algorithm_1.mutation_preInsert(newChild, this, refChild);
    }
    /**
     * Adds the node `newChild` to the end of the list of children of this
     * node, and returns it. If `newChild` is already in the tree, it is
     * first removed.
     *
     * If `newChild` is a {@link DocumentFragment} object, the entire
     * contents of the document fragment are moved into the child list of
     * this node.
     *
     * @param newChild - the node to add
     *
     * @returns the newly inserted child node
     */ appendChild(newChild) {
        /**
         * The appendChild(node) method, when invoked, must return the result of
         * appending node to context object.
         */ return algorithm_1.mutation_append(newChild, this);
    }
    /**
     * Replaces the child node `oldChild` with `newChild` in the list of
     * children, and returns the `oldChild` node. If `newChild` is already
     * in the tree, it is first removed.
     *
     * @param newChild - the new node to put in the child list
     * @param oldChild - the node being replaced in the list
     *
     * @returns the removed child node
     */ replaceChild(newChild, oldChild) {
        /**
         * The replaceChild(node, child) method, when invoked, must return the
         * result of replacing child with node within context object.
         */ return algorithm_1.mutation_replace(oldChild, newChild, this);
    }
    /**
    * Removes the child node indicated by `oldChild` from the list of
    * children, and returns it.
    *
    * @param oldChild - the node being removed from the list
    *
    * @returns the removed child node
    */ removeChild(oldChild) {
        /**
         * The removeChild(child) method, when invoked, must return the result of
         * pre-removing child from context object.
         */ return algorithm_1.mutation_preRemove(oldChild, this);
    }
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */ _getTheParent(event) {
        /**
         * A node’s get the parent algorithm, given an event, returns the node’s
         * assigned slot, if node is assigned, and node’s parent otherwise.
         */ if (util_1.Guard.isSlotable(this) && algorithm_1.shadowTree_isAssigned(this)) {
            return this._assignedSlot;
        } else {
            return this._parent;
        }
    }
}
exports.NodeImpl = NodeImpl;
NodeImpl.ELEMENT_NODE = 1;
NodeImpl.ATTRIBUTE_NODE = 2;
NodeImpl.TEXT_NODE = 3;
NodeImpl.CDATA_SECTION_NODE = 4;
NodeImpl.ENTITY_REFERENCE_NODE = 5;
NodeImpl.ENTITY_NODE = 6;
NodeImpl.PROCESSING_INSTRUCTION_NODE = 7;
NodeImpl.COMMENT_NODE = 8;
NodeImpl.DOCUMENT_NODE = 9;
NodeImpl.DOCUMENT_TYPE_NODE = 10;
NodeImpl.DOCUMENT_FRAGMENT_NODE = 11;
NodeImpl.NOTATION_NODE = 12;
NodeImpl.DOCUMENT_POSITION_DISCONNECTED = 0x01;
NodeImpl.DOCUMENT_POSITION_PRECEDING = 0x02;
NodeImpl.DOCUMENT_POSITION_FOLLOWING = 0x04;
NodeImpl.DOCUMENT_POSITION_CONTAINS = 0x08;
NodeImpl.DOCUMENT_POSITION_CONTAINED_BY = 0x10;
NodeImpl.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;
/**
 * A performance tweak to share an empty set between all node classes. This will
 * be overwritten by element, document and document fragment nodes to supply an
 * actual set of nodes.
 */ NodeImpl.prototype._children = new util_1.EmptySet();
/**
 * Define constants on prototype.
 */ WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ELEMENT_NODE", 1);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ATTRIBUTE_NODE", 2);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "TEXT_NODE", 3);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "CDATA_SECTION_NODE", 4);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ENTITY_REFERENCE_NODE", 5);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "ENTITY_NODE", 6);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "PROCESSING_INSTRUCTION_NODE", 7);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "COMMENT_NODE", 8);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_NODE", 9);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_TYPE_NODE", 10);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_FRAGMENT_NODE", 11);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "NOTATION_NODE", 12);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_DISCONNECTED", 0x01);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_PRECEDING", 0x02);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_FOLLOWING", 0x04);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_CONTAINS", 0x08);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_CONTAINED_BY", 0x10);
WebIDLAlgorithm_1.idl_defineConst(NodeImpl.prototype, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", 0x20);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AttrImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const NodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents an attribute of an element node.
 */ class AttrImpl extends NodeImpl_1.NodeImpl {
    /**
     * Initializes a new instance of `Attr`.
     *
     * @param localName - local name
     */ constructor(localName){
        super();
        this._namespace = null;
        this._namespacePrefix = null;
        this._element = null;
        this._value = '';
        this._localName = localName;
    }
    /** @inheritdoc */ get ownerElement() {
        return this._element;
    }
    /** @inheritdoc */ get namespaceURI() {
        return this._namespace;
    }
    /** @inheritdoc */ get prefix() {
        return this._namespacePrefix;
    }
    /** @inheritdoc */ get localName() {
        return this._localName;
    }
    /** @inheritdoc */ get name() {
        return this._qualifiedName;
    }
    /** @inheritdoc */ get value() {
        return this._value;
    }
    set value(value) {
        /**
         * The value attribute’s setter must set an existing attribute value with
         * context object and the given value.
         */ algorithm_1.attr_setAnExistingAttributeValue(this, value);
    }
    /**
     * Returns the qualified name.
     */ get _qualifiedName() {
        /**
         * An attribute’s qualified name is its local name if its namespace prefix
         * is null, and its namespace prefix, followed by ":", followed by its
         * local name, otherwise.
         */ return this._namespacePrefix !== null ? this._namespacePrefix + ':' + this._localName : this._localName;
    }
    /**
     * Creates an `Attr`.
     *
     * @param document - owner document
     * @param localName - local name
     */ static _create(document, localName) {
        const node = new AttrImpl(localName);
        node._nodeDocument = document;
        return node;
    }
}
exports.AttrImpl = AttrImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(AttrImpl.prototype, "_nodeType", interfaces_1.NodeType.Attribute);
WebIDLAlgorithm_1.idl_defineConst(AttrImpl.prototype, "specified", true);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CharacterDataImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const NodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a generic text node.
 */ class CharacterDataImpl extends NodeImpl_1.NodeImpl {
    /**
     * Initializes a new instance of `CharacterData`.
     *
     * @param data - the text content
     */ constructor(data){
        super();
        this._data = data;
    }
    /** @inheritdoc */ get data() {
        return this._data;
    }
    set data(value) {
        algorithm_1.characterData_replaceData(this, 0, this._data.length, value);
    }
    /** @inheritdoc */ get length() {
        return this._data.length;
    }
    /** @inheritdoc */ substringData(offset, count) {
        /**
         * The substringData(offset, count) method, when invoked, must return the
         * result of running substring data with node context object, offset offset, and count count.
         */ return algorithm_1.characterData_substringData(this, offset, count);
    }
    /** @inheritdoc */ appendData(data) {
        /**
         * The appendData(data) method, when invoked, must replace data with node
         * context object, offset context object’s length, count 0, and data data.
         */ return algorithm_1.characterData_replaceData(this, this._data.length, 0, data);
    }
    /** @inheritdoc */ insertData(offset, data) {
        /**
         * The insertData(offset, data) method, when invoked, must replace data with
         * node context object, offset offset, count 0, and data data.
         */ algorithm_1.characterData_replaceData(this, offset, 0, data);
    }
    /** @inheritdoc */ deleteData(offset, count) {
        /**
         * The deleteData(offset, count) method, when invoked, must replace data
         * with node context object, offset offset, count count, and data the
         * empty string.
         */ algorithm_1.characterData_replaceData(this, offset, count, '');
    }
    /** @inheritdoc */ replaceData(offset, count, data) {
        /**
         * The replaceData(offset, count, data) method, when invoked, must replace
         * data with node context object, offset offset, count count, and data data.
         */ algorithm_1.characterData_replaceData(this, offset, count, data);
    }
    // MIXIN: NonDocumentTypeChildNode
    /* istanbul ignore next */ get previousElementSibling() {
        throw new Error("Mixin: NonDocumentTypeChildNode not implemented.");
    }
    /* istanbul ignore next */ get nextElementSibling() {
        throw new Error("Mixin: NonDocumentTypeChildNode not implemented.");
    }
    // MIXIN: ChildNode
    /* istanbul ignore next */ before(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ after(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ replaceWith(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ remove() {
        throw new Error("Mixin: ChildNode not implemented.");
    }
}
exports.CharacterDataImpl = CharacterDataImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TextImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const CharacterDataImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CharacterDataImpl.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a text node.
 */ class TextImpl extends CharacterDataImpl_1.CharacterDataImpl {
    /**
     * Initializes a new instance of `Text`.
     *
     * @param data - the text content
     */ constructor(data = ''){
        super(data);
        this._name = '';
        this._assignedSlot = null;
    }
    /** @inheritdoc */ get wholeText() {
        /**
         * The wholeText attribute’s getter must return the concatenation of the
         * data of the contiguous Text nodes of the context object, in tree order.
         */ let text = '';
        for (const node of algorithm_1.text_contiguousTextNodes(this, true)){
            text = text + node._data;
        }
        return text;
    }
    /** @inheritdoc */ splitText(offset) {
        /**
         * The splitText(offset) method, when invoked, must split context object
         * with offset offset.
         */ return algorithm_1.text_split(this, offset);
    }
    // MIXIN: Slotable
    /* istanbul ignore next */ get assignedSlot() {
        throw new Error("Mixin: Slotable not implemented.");
    }
    /**
     * Creates a `Text`.
     *
     * @param document - owner document
     * @param data - the text content
     */ static _create(document, data = '') {
        const node = new TextImpl(data);
        node._nodeDocument = document;
        return node;
    }
}
exports.TextImpl = TextImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(TextImpl.prototype, "_nodeType", interfaces_1.NodeType.Text);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CDATASectionImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const TextImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TextImpl.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a CDATA node.
 */ class CDATASectionImpl extends TextImpl_1.TextImpl {
    /**
     * Initializes a new instance of `CDATASection`.
     *
     * @param data - node contents
     */ constructor(data){
        super(data);
    }
    /**
     * Creates a new `CDATASection`.
     *
     * @param document - owner document
     * @param data - node contents
     */ static _create(document, data = '') {
        const node = new CDATASectionImpl(data);
        node._nodeDocument = document;
        return node;
    }
}
exports.CDATASectionImpl = CDATASectionImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(CDATASectionImpl.prototype, "_nodeType", interfaces_1.NodeType.CData);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ChildNodeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a mixin that extends child nodes that can have siblings
 * including doctypes. This mixin is implemented by {@link Element},
 * {@link CharacterData} and {@link DocumentType}.
 */ class ChildNodeImpl {
    /** @inheritdoc */ before(...nodes) {
        /**
         * 1. Let parent be context object’s parent.
         * 2. If parent is null, then return.
         */ const context = util_1.Cast.asNode(this);
        const parent = context._parent;
        if (parent === null) return;
        /**
         * 3. Let viablePreviousSibling be context object’s first preceding
         * sibling not in nodes, and null otherwise.
         */ let viablePreviousSibling = context._previousSibling;
        let flag = true;
        while(flag && viablePreviousSibling){
            flag = false;
            for(let i = 0; i < nodes.length; i++){
                const child = nodes[i];
                if (child === viablePreviousSibling) {
                    viablePreviousSibling = viablePreviousSibling._previousSibling;
                    flag = true;
                    break;
                }
            }
        }
        /**
         * 4. Let node be the result of converting nodes into a node, given nodes
         * and context object’s node document.
         */ const node = algorithm_1.parentNode_convertNodesIntoANode(nodes, context._nodeDocument);
        /**
         * 5. If viablePreviousSibling is null, set it to parent’s first child,
         * and to viablePreviousSibling’s next sibling otherwise.
         */ if (viablePreviousSibling === null) viablePreviousSibling = parent._firstChild;
        else viablePreviousSibling = viablePreviousSibling._nextSibling;
        /**
         * 6. Pre-insert node into parent before viablePreviousSibling.
         */ algorithm_1.mutation_preInsert(node, parent, viablePreviousSibling);
    }
    /** @inheritdoc */ after(...nodes) {
        /**
         * 1. Let parent be context object’s parent.
         * 2. If parent is null, then return.
         */ const context = util_1.Cast.asNode(this);
        const parent = context._parent;
        if (!parent) return;
        /**
         * 3. Let viableNextSibling be context object’s first following sibling not
         * in nodes, and null otherwise.
         */ let viableNextSibling = context._nextSibling;
        let flag = true;
        while(flag && viableNextSibling){
            flag = false;
            for(let i = 0; i < nodes.length; i++){
                const child = nodes[i];
                if (child === viableNextSibling) {
                    viableNextSibling = viableNextSibling._nextSibling;
                    flag = true;
                    break;
                }
            }
        }
        /**
         * 4. Let node be the result of converting nodes into a node, given nodes
         * and context object’s node document.
         */ const node = algorithm_1.parentNode_convertNodesIntoANode(nodes, context._nodeDocument);
        /**
         * 5. Pre-insert node into parent before viableNextSibling.
         */ algorithm_1.mutation_preInsert(node, parent, viableNextSibling);
    }
    /** @inheritdoc */ replaceWith(...nodes) {
        /**
         * 1. Let parent be context object’s parent.
         * 2. If parent is null, then return.
         */ const context = util_1.Cast.asNode(this);
        const parent = context._parent;
        if (!parent) return;
        /**
         * 3. Let viableNextSibling be context object’s first following sibling not
         * in nodes, and null otherwise.
         */ let viableNextSibling = context._nextSibling;
        let flag = true;
        while(flag && viableNextSibling){
            flag = false;
            for(let i = 0; i < nodes.length; i++){
                const child = nodes[i];
                if (child === viableNextSibling) {
                    viableNextSibling = viableNextSibling._nextSibling;
                    flag = true;
                    break;
                }
            }
        }
        /**
         * 4. Let node be the result of converting nodes into a node, given nodes
         * and context object’s node document.
         */ const node = algorithm_1.parentNode_convertNodesIntoANode(nodes, context._nodeDocument);
        /**
         * 5. If context object’s parent is parent, replace the context object with
         * node within parent.
         * _Note:_ Context object could have been inserted into node.
         * 6. Otherwise, pre-insert node into parent before viableNextSibling.
         */ if (context._parent === parent) algorithm_1.mutation_replace(context, node, parent);
        else algorithm_1.mutation_preInsert(node, parent, viableNextSibling);
    }
    /** @inheritdoc */ remove() {
        /**
         * 1. If context object’s parent is null, then return.
         * 2. Remove the context object from context object’s parent.
         */ const context = util_1.Cast.asNode(this);
        const parent = context._parent;
        if (!parent) return;
        algorithm_1.mutation_remove(context, parent);
    }
}
exports.ChildNodeImpl = ChildNodeImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CommentImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const CharacterDataImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CharacterDataImpl.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a comment node.
 */ class CommentImpl extends CharacterDataImpl_1.CharacterDataImpl {
    /**
     * Initializes a new instance of `Comment`.
     *
     * @param data - the text content
     */ constructor(data = ''){
        super(data);
    }
    /**
     * Creates a new `Comment`.
     *
     * @param document - owner document
     * @param data - node contents
     */ static _create(document, data = '') {
        const node = new CommentImpl(data);
        node._nodeDocument = document;
        return node;
    }
}
exports.CommentImpl = CommentImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(CommentImpl.prototype, "_nodeType", interfaces_1.NodeType.Comment);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a DOM event.
 */ class EventImpl {
    /**
     * Initializes a new instance of `Event`.
     */ constructor(type, eventInit){
        this._target = null;
        this._relatedTarget = null;
        this._touchTargetList = [];
        this._path = [];
        this._currentTarget = null;
        this._eventPhase = interfaces_1.EventPhase.None;
        this._stopPropagationFlag = false;
        this._stopImmediatePropagationFlag = false;
        this._canceledFlag = false;
        this._inPassiveListenerFlag = false;
        this._composedFlag = false;
        this._initializedFlag = false;
        this._dispatchFlag = false;
        this._isTrusted = false;
        this._bubbles = false;
        this._cancelable = false;
        /**
         * When a constructor of the Event interface, or of an interface that
         * inherits from the Event interface, is invoked, these steps must be run,
         * given the arguments type and eventInitDict:
         * 1. Let event be the result of running the inner event creation steps with
         * this interface, null, now, and eventInitDict.
         * 2. Initialize event’s type attribute to type.
         * 3. Return event.
         */ this._type = type;
        if (eventInit) {
            this._bubbles = eventInit.bubbles || false;
            this._cancelable = eventInit.cancelable || false;
            this._composedFlag = eventInit.composed || false;
        }
        this._initializedFlag = true;
        this._timeStamp = new Date().getTime();
    }
    /** @inheritdoc */ get type() {
        return this._type;
    }
    /** @inheritdoc */ get target() {
        return this._target;
    }
    /** @inheritdoc */ get srcElement() {
        return this._target;
    }
    /** @inheritdoc */ get currentTarget() {
        return this._currentTarget;
    }
    /** @inheritdoc */ composedPath() {
        /**
         * 1. Let composedPath be an empty list.
         * 2. Let path be the context object’s path.
         * 3. If path is empty, then return composedPath.
         * 4. Let currentTarget be the context object’s currentTarget attribute
         * value.
         * 5. Append currentTarget to composedPath.
         * 6. Let currentTargetIndex be 0.
         * 7. Let currentTargetHiddenSubtreeLevel be 0.
         */ const composedPath = [];
        const path = this._path;
        if (path.length === 0) return composedPath;
        const currentTarget = this._currentTarget;
        if (currentTarget === null) {
            throw new Error("Event currentTarget is null.");
        }
        composedPath.push(currentTarget);
        let currentTargetIndex = 0;
        let currentTargetHiddenSubtreeLevel = 0;
        /**
         * 8. Let index be path’s size − 1.
         * 9. While index is greater than or equal to 0:
         */ let index = path.length - 1;
        while(index >= 0){
            /**
             * 9.1. If path[index]'s root-of-closed-tree is true, then increase
             * currentTargetHiddenSubtreeLevel by 1.
             * 9.2. If path[index]'s invocation target is currentTarget, then set
             * currentTargetIndex to index and break.
             * 9.3. If path[index]'s slot-in-closed-tree is true, then decrease
             * currentTargetHiddenSubtreeLevel by 1.
             * 9.4. Decrease index by 1.
             */ if (path[index].rootOfClosedTree) {
                currentTargetHiddenSubtreeLevel++;
            }
            if (path[index].invocationTarget === currentTarget) {
                currentTargetIndex = index;
                break;
            }
            if (path[index].slotInClosedTree) {
                currentTargetHiddenSubtreeLevel--;
            }
            index--;
        }
        /**
         * 10. Let currentHiddenLevel and maxHiddenLevel be
         * currentTargetHiddenSubtreeLevel.
         */ let currentHiddenLevel = currentTargetHiddenSubtreeLevel;
        let maxHiddenLevel = currentTargetHiddenSubtreeLevel;
        /**
         * 11. Set index to currentTargetIndex − 1.
         * 12. While index is greater than or equal to 0:
         */ index = currentTargetIndex - 1;
        while(index >= 0){
            /**
             * 12.1. If path[index]'s root-of-closed-tree is true, then increase
             * currentHiddenLevel by 1.
             * 12.2. If currentHiddenLevel is less than or equal to maxHiddenLevel,
             * then prepend path[index]'s invocation target to composedPath.
             */ if (path[index].rootOfClosedTree) {
                currentHiddenLevel++;
            }
            if (currentHiddenLevel <= maxHiddenLevel) {
                composedPath.unshift(path[index].invocationTarget);
            }
            /**
             * 12.3. If path[index]'s slot-in-closed-tree is true, then:
             */ if (path[index].slotInClosedTree) {
                /**
                 * 12.3.1. Decrease currentHiddenLevel by 1.
                 * 12.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set
                 * maxHiddenLevel to currentHiddenLevel.
                 */ currentHiddenLevel--;
                if (currentHiddenLevel < maxHiddenLevel) {
                    maxHiddenLevel = currentHiddenLevel;
                }
            }
            /**
             * 12.4. Decrease index by 1.
             */ index--;
        }
        /**
         * 13. Set currentHiddenLevel and maxHiddenLevel to
         * currentTargetHiddenSubtreeLevel.
         */ currentHiddenLevel = currentTargetHiddenSubtreeLevel;
        maxHiddenLevel = currentTargetHiddenSubtreeLevel;
        /**
         * 14. Set index to currentTargetIndex + 1.
         * 15. While index is less than path’s size:
         */ index = currentTargetIndex + 1;
        while(index < path.length){
            /**
             * 15.1. If path[index]'s slot-in-closed-tree is true, then increase
             * currentHiddenLevel by 1.
             * 15.2. If currentHiddenLevel is less than or equal to maxHiddenLevel,
             * then append path[index]'s invocation target to composedPath.
             */ if (path[index].slotInClosedTree) {
                currentHiddenLevel++;
            }
            if (currentHiddenLevel <= maxHiddenLevel) {
                composedPath.push(path[index].invocationTarget);
            }
            /**
             * 15.3. If path[index]'s root-of-closed-tree is true, then:
             */ if (path[index].rootOfClosedTree) {
                /**
                 * 15.3.1. Decrease currentHiddenLevel by 1.
                 * 15.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set
                 * maxHiddenLevel to currentHiddenLevel.
                 */ currentHiddenLevel--;
                if (currentHiddenLevel < maxHiddenLevel) {
                    maxHiddenLevel = currentHiddenLevel;
                }
            }
            /**
             * 15.4. Increase index by 1.
             */ index++;
        }
        /**
         * 16. Return composedPath.
         */ return composedPath;
    }
    /** @inheritdoc */ get eventPhase() {
        return this._eventPhase;
    }
    /** @inheritdoc */ stopPropagation() {
        this._stopPropagationFlag = true;
    }
    /** @inheritdoc */ get cancelBubble() {
        return this._stopPropagationFlag;
    }
    set cancelBubble(value) {
        if (value) this.stopPropagation();
    }
    /** @inheritdoc */ stopImmediatePropagation() {
        this._stopPropagationFlag = true;
        this._stopImmediatePropagationFlag = true;
    }
    /** @inheritdoc */ get bubbles() {
        return this._bubbles;
    }
    /** @inheritdoc */ get cancelable() {
        return this._cancelable;
    }
    /** @inheritdoc */ get returnValue() {
        return !this._canceledFlag;
    }
    set returnValue(value) {
        if (!value) {
            algorithm_1.event_setTheCanceledFlag(this);
        }
    }
    /** @inheritdoc */ preventDefault() {
        algorithm_1.event_setTheCanceledFlag(this);
    }
    /** @inheritdoc */ get defaultPrevented() {
        return this._canceledFlag;
    }
    /** @inheritdoc */ get composed() {
        return this._composedFlag;
    }
    /** @inheritdoc */ get isTrusted() {
        return this._isTrusted;
    }
    /** @inheritdoc */ get timeStamp() {
        return this._timeStamp;
    }
    /** @inheritdoc */ initEvent(type, bubbles = false, cancelable = false) {
        /**
         * 1. If the context object’s dispatch flag is set, then return.
         */ if (this._dispatchFlag) return;
        /**
         * 2. Initialize the context object with type, bubbles, and cancelable.
         */ algorithm_1.event_initialize(this, type, bubbles, cancelable);
    }
}
exports.EventImpl = EventImpl;
EventImpl.NONE = 0;
EventImpl.CAPTURING_PHASE = 1;
EventImpl.AT_TARGET = 2;
EventImpl.BUBBLING_PHASE = 3;
/**
 * Define constants on prototype.
 */ WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "NONE", 0);
WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "CAPTURING_PHASE", 1);
WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "AT_TARGET", 2);
WebIDLAlgorithm_1.idl_defineConst(EventImpl.prototype, "BUBBLING_PHASE", 3);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CustomEventImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const EventImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventImpl.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents and event that carries custom data.
 */ class CustomEventImpl extends EventImpl_1.EventImpl {
    /**
     * Initializes a new instance of `CustomEvent`.
     */ constructor(type, eventInit){
        super(type, eventInit);
        this._detail = null;
        this._detail = eventInit && eventInit.detail || null;
    }
    /** @inheritdoc */ get detail() {
        return this._detail;
    }
    /** @inheritdoc */ initCustomEvent(type, bubbles = false, cancelable = false, detail = null) {
        /**
         * 1. If the context object’s dispatch flag is set, then return.
         */ if (this._dispatchFlag) return;
        /**
         * 2. Initialize the context object with type, bubbles, and cancelable.
         */ algorithm_1.event_initialize(this, type, bubbles, cancelable);
        /**
         * 3. Set the context object’s detail attribute to detail.
         */ this._detail = detail;
    }
}
exports.CustomEventImpl = CustomEventImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentFragmentImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const NodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a document fragment in the XML tree.
 */ class DocumentFragmentImpl extends NodeImpl_1.NodeImpl {
    /**
     * Initializes a new instance of `DocumentFragment`.
     *
     * @param host - shadow root's host element
     */ constructor(host = null){
        super();
        this._children = new Set();
        this._host = host;
    }
    // MIXIN: NonElementParentNode
    /* istanbul ignore next */ getElementById(elementId) {
        throw new Error("Mixin: NonElementParentNode not implemented.");
    }
    // MIXIN: ParentNode
    /* istanbul ignore next */ get children() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get firstElementChild() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get lastElementChild() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get childElementCount() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ prepend(...nodes) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ append(...nodes) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ querySelector(selectors) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ querySelectorAll(selectors) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /**
     * Creates a new `DocumentFragment`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */ static _create(document, host = null) {
        const node = new DocumentFragmentImpl(host);
        node._nodeDocument = document;
        return node;
    }
}
exports.DocumentFragmentImpl = DocumentFragmentImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(DocumentFragmentImpl.prototype, "_nodeType", interfaces_1.NodeType.DocumentFragment);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const NodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const util_2 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const URLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/url/lib/URLAlgorithm.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a document node.
 */ class DocumentImpl extends NodeImpl_1.NodeImpl {
    /**
     * Initializes a new instance of `Document`.
     */ constructor(){
        super();
        this._children = new Set();
        this._encoding = {
            name: "UTF-8",
            labels: [
                "unicode-1-1-utf-8",
                "utf-8",
                "utf8"
            ]
        };
        this._contentType = 'application/xml';
        this._URL = {
            scheme: "about",
            username: "",
            password: "",
            host: null,
            port: null,
            path: [
                "blank"
            ],
            query: null,
            fragment: null,
            _cannotBeABaseURLFlag: true,
            _blobURLEntry: null
        };
        this._origin = null;
        this._type = "xml";
        this._mode = "no-quirks";
        this._documentElement = null;
        this._hasNamespaces = false;
        this._nodeDocumentOverwrite = null;
    }
    get _nodeDocument() {
        return this._nodeDocumentOverwrite || this;
    }
    set _nodeDocument(val) {
        this._nodeDocumentOverwrite = val;
    }
    /** @inheritdoc */ get implementation() {
        /**
         * The implementation attribute’s getter must return the DOMImplementation
         * object that is associated with the document.
         */ return this._implementation || (this._implementation = algorithm_1.create_domImplementation(this));
    }
    /** @inheritdoc */ get URL() {
        /**
         * The URL attribute’s getter and documentURI attribute’s getter must return
         * the URL, serialized.
         * See: https://url.spec.whatwg.org/#concept-url-serializer
         */ return URLAlgorithm_1.urlSerializer(this._URL);
    }
    /** @inheritdoc */ get documentURI() {
        return this.URL;
    }
    /** @inheritdoc */ get origin() {
        return "null";
    }
    /** @inheritdoc */ get compatMode() {
        /**
         * The compatMode attribute’s getter must return "BackCompat" if context
         * object’s mode is "quirks", and "CSS1Compat" otherwise.
         */ return this._mode === "quirks" ? "BackCompat" : "CSS1Compat";
    }
    /** @inheritdoc */ get characterSet() {
        /**
         * The characterSet attribute’s getter, charset attribute’s getter, and
         * inputEncoding attribute’s getter, must return context object’s
         * encoding’s name.
         */ return this._encoding.name;
    }
    /** @inheritdoc */ get charset() {
        return this._encoding.name;
    }
    /** @inheritdoc */ get inputEncoding() {
        return this._encoding.name;
    }
    /** @inheritdoc */ get contentType() {
        /**
         * The contentType attribute’s getter must return the content type.
         */ return this._contentType;
    }
    /** @inheritdoc */ get doctype() {
        /**
         * The doctype attribute’s getter must return the child of the document
         * that is a doctype, and null otherwise.
         */ for (const child of this._children){
            if (util_1.Guard.isDocumentTypeNode(child)) return child;
        }
        return null;
    }
    /** @inheritdoc */ get documentElement() {
        /**
         * The documentElement attribute’s getter must return the document element.
         */ return this._documentElement;
    }
    /** @inheritdoc */ getElementsByTagName(qualifiedName) {
        /**
         * The getElementsByTagName(qualifiedName) method, when invoked, must return
         * the list of elements with qualified name qualifiedName for the context object.
         */ return algorithm_1.node_listOfElementsWithQualifiedName(qualifiedName, this);
    }
    /** @inheritdoc */ getElementsByTagNameNS(namespace, localName) {
        /**
         * The getElementsByTagNameNS(namespace, localName) method, when invoked,
         * must return the list of elements with namespace namespace and local name
         * localName for the context object.
         */ return algorithm_1.node_listOfElementsWithNamespace(namespace, localName, this);
    }
    /** @inheritdoc */ getElementsByClassName(classNames) {
        /**
         * The getElementsByClassName(classNames) method, when invoked, must return
         * the list of elements with class names classNames for the context object.
         */ return algorithm_1.node_listOfElementsWithClassNames(classNames, this);
    }
    /** @inheritdoc */ createElement(localName, options) {
        /**
         * 1. If localName does not match the Name production, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. If the context object is an HTML document, then set localName to
         * localName in ASCII lowercase.
         * 3. Let is be null.
         * 4. If options is a dictionary and options’s is is present, then set is
         * to it.
         * 5. Let namespace be the HTML namespace, if the context object is an
         * HTML document or context object’s content type is
         * "application/xhtml+xml", and null otherwise.
         * 6. Return the result of creating an element given the context object,
         * localName, namespace, null, is, and with the synchronous custom elements
         * flag set.
         */ if (!algorithm_1.xml_isName(localName)) throw new DOMException_1.InvalidCharacterError();
        if (this._type === "html") localName = localName.toLowerCase();
        let is = null;
        if (options !== undefined) {
            if (util_2.isString(options)) {
                is = options;
            } else {
                is = options.is;
            }
        }
        const namespace = this._type === "html" || this._contentType === "application/xhtml+xml" ? infra_1.namespace.HTML : null;
        return algorithm_1.element_createAnElement(this, localName, namespace, null, is, true);
    }
    /** @inheritdoc */ createElementNS(namespace, qualifiedName, options) {
        /**
         * The createElementNS(namespace, qualifiedName, options) method, when
         * invoked, must return the result of running the internal createElementNS
         * steps, given context object, namespace, qualifiedName, and options.
         */ return algorithm_1.document_internalCreateElementNS(this, namespace, qualifiedName, options);
    }
    /** @inheritdoc */ createDocumentFragment() {
        /**
         * The createDocumentFragment() method, when invoked, must return a new
         * DocumentFragment node with its node document set to the context object.
         */ return algorithm_1.create_documentFragment(this);
    }
    /** @inheritdoc */ createTextNode(data) {
        /**
         * The createTextNode(data) method, when invoked, must return a new Text
         * node with its data set to data and node document set to the context object.
         */ return algorithm_1.create_text(this, data);
    }
    /** @inheritdoc */ createCDATASection(data) {
        /**
         * 1. If context object is an HTML document, then throw a
         * "NotSupportedError" DOMException.
         * 2. If data contains the string "]]>", then throw an
         * "InvalidCharacterError" DOMException.
         * 3. Return a new CDATASection node with its data set to data and node
         * document set to the context object.
         */ if (this._type === "html") throw new DOMException_1.NotSupportedError();
        if (data.indexOf(']]>') !== -1) throw new DOMException_1.InvalidCharacterError();
        return algorithm_1.create_cdataSection(this, data);
    }
    /** @inheritdoc */ createComment(data) {
        /**
         * The createComment(data) method, when invoked, must return a new Comment
         * node with its data set to data and node document set to the context object.
         */ return algorithm_1.create_comment(this, data);
    }
    /** @inheritdoc */ createProcessingInstruction(target, data) {
        /**
         * 1. If target does not match the Name production, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. If data contains the string "?>", then throw an
         * "InvalidCharacterError" DOMException.
         * 3. Return a new ProcessingInstruction node, with target set to target,
         * data set to data, and node document set to the context object.
         */ if (!algorithm_1.xml_isName(target)) throw new DOMException_1.InvalidCharacterError();
        if (data.indexOf("?>") !== -1) throw new DOMException_1.InvalidCharacterError();
        return algorithm_1.create_processingInstruction(this, target, data);
    }
    /** @inheritdoc */ importNode(node, deep = false) {
        /**
         * 1. If node is a document or shadow root, then throw a "NotSupportedError" DOMException.
         */ if (util_1.Guard.isDocumentNode(node) || util_1.Guard.isShadowRoot(node)) throw new DOMException_1.NotSupportedError();
        /**
         * 2. Return a clone of node, with context object and the clone children flag set if deep is true.
         */ return algorithm_1.node_clone(node, this, deep);
    }
    /** @inheritdoc */ adoptNode(node) {
        /**
         * 1. If node is a document, then throw a "NotSupportedError" DOMException.
         */ if (util_1.Guard.isDocumentNode(node)) throw new DOMException_1.NotSupportedError();
        /**
         * 2. If node is a shadow root, then throw a "HierarchyRequestError" DOMException.
         */ if (util_1.Guard.isShadowRoot(node)) throw new DOMException_1.HierarchyRequestError();
        /**
         * 3. Adopt node into the context object.
         * 4. Return node.
         */ algorithm_1.document_adopt(node, this);
        return node;
    }
    /** @inheritdoc */ createAttribute(localName) {
        /**
         * 1. If localName does not match the Name production in XML, then throw
         * an "InvalidCharacterError" DOMException.
         * 2. If the context object is an HTML document, then set localName to
         * localName in ASCII lowercase.
         * 3. Return a new attribute whose local name is localName and node document
         * is context object.
         */ if (!algorithm_1.xml_isName(localName)) throw new DOMException_1.InvalidCharacterError();
        if (this._type === "html") {
            localName = localName.toLowerCase();
        }
        const attr = algorithm_1.create_attr(this, localName);
        return attr;
    }
    /** @inheritdoc */ createAttributeNS(namespace, qualifiedName) {
        /**
         * 1. Let namespace, prefix, and localName be the result of passing
         * namespace and qualifiedName to validate and extract.
         * 2. Return a new attribute whose namespace is namespace, namespace prefix
         * is prefix, local name is localName, and node document is context object.
         */ const [ns, prefix, localName] = algorithm_1.namespace_validateAndExtract(namespace, qualifiedName);
        const attr = algorithm_1.create_attr(this, localName);
        attr._namespace = ns;
        attr._namespacePrefix = prefix;
        return attr;
    }
    /** @inheritdoc */ createEvent(eventInterface) {
        return algorithm_1.event_createLegacyEvent(eventInterface);
    }
    /** @inheritdoc */ createRange() {
        /**
         * The createRange() method, when invoked, must return a new live range
         * with (context object, 0) as its start and end.
         */ const range = algorithm_1.create_range();
        range._start = [
            this,
            0
        ];
        range._end = [
            this,
            0
        ];
        return range;
    }
    /** @inheritdoc */ createNodeIterator(root, whatToShow = interfaces_1.WhatToShow.All, filter = null) {
        /**
         * 1. Let iterator be a new NodeIterator object.
         * 2. Set iterator’s root and iterator’s reference to root.
         * 3. Set iterator’s pointer before reference to true.
         * 4. Set iterator’s whatToShow to whatToShow.
         * 5. Set iterator’s filter to filter.
         * 6. Return iterator.
         */ const iterator = algorithm_1.create_nodeIterator(root, root, true);
        iterator._whatToShow = whatToShow;
        iterator._iteratorCollection = algorithm_1.create_nodeList(root);
        if (util_2.isFunction(filter)) {
            iterator._filter = algorithm_1.create_nodeFilter();
            iterator._filter.acceptNode = filter;
        } else {
            iterator._filter = filter;
        }
        return iterator;
    }
    /** @inheritdoc */ createTreeWalker(root, whatToShow = interfaces_1.WhatToShow.All, filter = null) {
        /**
         * 1. Let walker be a new TreeWalker object.
         * 2. Set walker’s root and walker’s current to root.
         * 3. Set walker’s whatToShow to whatToShow.
         * 4. Set walker’s filter to filter.
         * 5. Return walker.
         */ const walker = algorithm_1.create_treeWalker(root, root);
        walker._whatToShow = whatToShow;
        if (util_2.isFunction(filter)) {
            walker._filter = algorithm_1.create_nodeFilter();
            walker._filter.acceptNode = filter;
        } else {
            walker._filter = filter;
        }
        return walker;
    }
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */ _getTheParent(event) {
        /**
         * TODO: Implement realms
         * A document’s get the parent algorithm, given an event, returns null if
         * event’s type attribute value is "load" or document does not have a
         * browsing context, and the document’s relevant global object otherwise.
         */ if (event._type === "load") {
            return null;
        } else {
            return _1.dom.window;
        }
    }
    // MIXIN: NonElementParentNode
    /* istanbul ignore next */ getElementById(elementId) {
        throw new Error("Mixin: NonElementParentNode not implemented.");
    }
    // MIXIN: DocumentOrShadowRoot
    // No elements
    // MIXIN: ParentNode
    /* istanbul ignore next */ get children() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get firstElementChild() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get lastElementChild() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get childElementCount() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ prepend(...nodes) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ append(...nodes) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ querySelector(selectors) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ querySelectorAll(selectors) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
}
exports.DocumentImpl = DocumentImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(DocumentImpl.prototype, "_nodeType", interfaces_1.NodeType.Document);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentOrShadowRootImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Represents a mixin for an interface to be used to share APIs between
 * documents and shadow roots. This mixin is implemented by
 * {@link Document} and {@link ShadowRoot}.
 *
 * _Note:_ The DocumentOrShadowRoot mixin is expected to be used by other
 * standards that want to define APIs shared between documents and shadow roots.
 */ class DocumentOrShadowRootImpl {
}
exports.DocumentOrShadowRootImpl = DocumentOrShadowRootImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentTypeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const NodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents an object providing methods which are not dependent on
 * any particular document
 */ class DocumentTypeImpl extends NodeImpl_1.NodeImpl {
    /**
     * Initializes a new instance of `DocumentType`.
     *
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */ constructor(name, publicId, systemId){
        super();
        this._name = '';
        this._publicId = '';
        this._systemId = '';
        this._name = name;
        this._publicId = publicId;
        this._systemId = systemId;
    }
    /** @inheritdoc */ get name() {
        return this._name;
    }
    /** @inheritdoc */ get publicId() {
        return this._publicId;
    }
    /** @inheritdoc */ get systemId() {
        return this._systemId;
    }
    // MIXIN: ChildNode
    /* istanbul ignore next */ before(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ after(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ replaceWith(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ remove() {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /**
     * Creates a new `DocumentType`.
     *
     * @param document - owner document
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */ static _create(document, name, publicId = '', systemId = '') {
        const node = new DocumentTypeImpl(name, publicId, systemId);
        node._nodeDocument = document;
        return node;
    }
}
exports.DocumentTypeImpl = DocumentTypeImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(DocumentTypeImpl.prototype, "_nodeType", interfaces_1.NodeType.DocumentType);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents an object implementing DOM algorithms.
 */ class DOMImpl {
    /**
     * Initializes a new instance of `DOM`.
     */ constructor(){
        this._features = {
            mutationObservers: true,
            customElements: true,
            slots: true,
            steps: true
        };
        this._window = null;
        this._compareCache = new util_1.CompareCache();
        this._rangeList = new util_1.FixedSizeSet();
    }
    /**
     * Sets DOM algorithm features.
     *
     * @param features - DOM features supported by algorithms. All features are
     * enabled by default unless explicity disabled.
     */ setFeatures(features) {
        if (features === undefined) features = true;
        if (util_1.isObject(features)) {
            for(const key in features){
                this._features[key] = features[key] || false;
            }
        } else {
            // enable/disable all features
            for(const key in this._features){
                this._features[key] = features;
            }
        }
    }
    /**
     * Gets DOM algorithm features.
     */ get features() {
        return this._features;
    }
    /**
     * Gets the DOM window.
     */ get window() {
        if (this._window === null) {
            this._window = algorithm_1.create_window();
        }
        return this._window;
    }
    /**
     * Gets the global node compare cache.
     */ get compareCache() {
        return this._compareCache;
    }
    /**
     * Gets the global range list.
     */ get rangeList() {
        return this._rangeList;
    }
    /**
     * Returns the instance of `DOM`.
     */ static get instance() {
        if (!DOMImpl._instance) {
            DOMImpl._instance = new DOMImpl();
        }
        return DOMImpl._instance;
    }
}
/**
 * Represents an object implementing DOM algorithms.
 */ exports.dom = DOMImpl.instance;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMImplementationImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents an object providing methods which are not dependent on
 * any particular document.
 */ class DOMImplementationImpl {
    /**
     * Initializes a new instance of `DOMImplementation`.
     *
     * @param document - the associated document
     */ constructor(document){
        this._associatedDocument = document || _1.dom.window.document;
    }
    /** @inheritdoc */ createDocumentType(qualifiedName, publicId, systemId) {
        /**
         * 1. Validate qualifiedName.
         * 2. Return a new doctype, with qualifiedName as its name, publicId as its
         * public ID, and systemId as its system ID, and with its node document set
         * to the associated document of the context object.
         */ algorithm_1.namespace_validate(qualifiedName);
        return algorithm_1.create_documentType(this._associatedDocument, qualifiedName, publicId, systemId);
    }
    /** @inheritdoc */ createDocument(namespace, qualifiedName, doctype = null) {
        /**
         * 1. Let document be a new XMLDocument.
         */ const document = algorithm_1.create_xmlDocument();
        /**
         * 2. Let element be null.
         * 3. If qualifiedName is not the empty string, then set element to
         * the result of running the internal createElementNS steps, given document,
         * namespace, qualifiedName, and an empty dictionary.
         */ let element = null;
        if (qualifiedName) {
            element = algorithm_1.document_internalCreateElementNS(document, namespace, qualifiedName);
        }
        /**
         * 4. If doctype is non-null, append doctype to document.
         * 5. If element is non-null, append element to document.
         */ if (doctype) document.appendChild(doctype);
        if (element) document.appendChild(element);
        /**
         * 6. document’s origin is context object’s associated document’s origin.
         */ document._origin = this._associatedDocument._origin;
        /**
         * 7. document’s content type is determined by namespace:
         * - HTML namespace
         * application/xhtml+xml
         * - SVG namespace
         * image/svg+xml
         * - Any other namespace
         * application/xml
         */ if (namespace === infra_1.namespace.HTML) document._contentType = "application/xhtml+xml";
        else if (namespace === infra_1.namespace.SVG) document._contentType = "image/svg+xml";
        else document._contentType = "application/xml";
        /**
         * 8. Return document.
         */ return document;
    }
    /** @inheritdoc */ createHTMLDocument(title) {
        /**
         * 1. Let doc be a new document that is an HTML document.
         * 2. Set doc’s content type to "text/html".
         */ const doc = algorithm_1.create_document();
        doc._type = "html";
        doc._contentType = "text/html";
        /**
         * 3. Append a new doctype, with "html" as its name and with its node
         * document set to doc, to doc.
         */ doc.appendChild(algorithm_1.create_documentType(doc, "html", "", ""));
        /**
         * 4. Append the result of creating an element given doc, html, and the
         * HTML namespace, to doc.
         */ const htmlElement = algorithm_1.element_createAnElement(doc, "html", infra_1.namespace.HTML);
        doc.appendChild(htmlElement);
        /**
         * 5. Append the result of creating an element given doc, head, and the
         * HTML namespace, to the html element created earlier.
         */ const headElement = algorithm_1.element_createAnElement(doc, "head", infra_1.namespace.HTML);
        htmlElement.appendChild(headElement);
        /**
         * 6. If title is given:
         * 6.1. Append the result of creating an element given doc, title, and
         * the HTML namespace, to the head element created earlier.
         * 6.2. Append a new Text node, with its data set to title (which could
         * be the empty string) and its node document set to doc, to the title
         * element created earlier.
         */ if (title !== undefined) {
            const titleElement = algorithm_1.element_createAnElement(doc, "title", infra_1.namespace.HTML);
            headElement.appendChild(titleElement);
            const textElement = algorithm_1.create_text(doc, title);
            titleElement.appendChild(textElement);
        }
        /**
         * 7. Append the result of creating an element given doc, body, and the
         * HTML namespace, to the html element created earlier.
         */ const bodyElement = algorithm_1.element_createAnElement(doc, "body", infra_1.namespace.HTML);
        htmlElement.appendChild(bodyElement);
        /**
         * 8. doc’s origin is context object’s associated document’s origin.
         */ doc._origin = this._associatedDocument._origin;
        /**
         * 9. Return doc.
         */ return doc;
    }
    /** @inheritdoc */ hasFeature() {
        return true;
    }
    /**
     * Creates a new `DOMImplementation`.
     *
     * @param document - owner document
     */ static _create(document) {
        return new DOMImplementationImpl(document);
    }
}
exports.DOMImplementationImpl = DOMImplementationImpl;
WebIDLAlgorithm_1.idl_defineConst(DOMImplementationImpl.prototype, "_ID", "@oozcitak/dom");
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMTokenListImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a token set.
 */ class DOMTokenListImpl {
    /**
     * Initializes a new instance of `DOMTokenList`.
     *
     * @param element - associated element
     * @param attribute - associated attribute
     */ constructor(element, attribute){
        /**
         * 1. Let element be associated element.
         * 2. Let localName be associated attribute’s local name.
         * 3. Let value be the result of getting an attribute value given element
         * and localName.
         * 4. Run the attribute change steps for element, localName, value, value,
         * and null.
         */ this._element = element;
        this._attribute = attribute;
        this._tokenSet = new Set();
        const localName = attribute._localName;
        const value = algorithm_1.element_getAnAttributeValue(element, localName);
        // define a closure to be called when the associated attribute's value changes
        const thisObj = this;
        function updateTokenSet(element, localName, oldValue, value, namespace) {
            /**
             * 1. If localName is associated attribute’s local name, namespace is null,
             * and value is null, then empty token set.
             * 2. Otherwise, if localName is associated attribute’s local name,
             * namespace is null, then set token set to value, parsed.
             */ if (localName === thisObj._attribute._localName && namespace === null) {
                if (!value) thisObj._tokenSet.clear();
                else thisObj._tokenSet = algorithm_1.orderedSet_parse(value);
            }
        }
        // add the closure to the associated element's attribute change steps
        this._element._attributeChangeSteps.push(updateTokenSet);
        if (_1.dom.features.steps) {
            algorithm_1.dom_runAttributeChangeSteps(element, localName, value, value, null);
        }
    }
    /** @inheritdoc */ get length() {
        /**
         * The length attribute' getter must return context object’s token set’s
         * size.
         */ return this._tokenSet.size;
    }
    /** @inheritdoc */ item(index) {
        /**
         * 1. If index is equal to or greater than context object’s token set’s
         * size, then return null.
         * 2. Return context object’s token set[index].
         */ let i = 0;
        for (const token of this._tokenSet){
            if (i === index) return token;
            i++;
        }
        return null;
    }
    /** @inheritdoc */ contains(token) {
        /**
         * The contains(token) method, when invoked, must return true if context
         * object’s token set[token] exists, and false otherwise.
         */ return this._tokenSet.has(token);
    }
    /** @inheritdoc */ add(...tokens) {
        /**
         * 1. For each token in tokens:
         * 1.1. If token is the empty string, then throw a "SyntaxError"
         * DOMException.
         * 1.2. If token contains any ASCII whitespace, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. For each token in tokens, append token to context object’s token set.
         * 3. Run the update steps.
         */ for (const token of tokens){
            if (token === '') {
                throw new DOMException_1.SyntaxError("Cannot add an empty token.");
            } else if (infra_1.codePoint.ASCIIWhiteSpace.test(token)) {
                throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
            } else {
                this._tokenSet.add(token);
            }
        }
        algorithm_1.tokenList_updateSteps(this);
    }
    /** @inheritdoc */ remove(...tokens) {
        /**
         * 1. For each token in tokens:
         * 1.1. If token is the empty string, then throw a "SyntaxError"
         * DOMException.
         * 1.2. If token contains any ASCII whitespace, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. For each token in tokens, remove token from context object’s token set.
         * 3. Run the update steps.
         */ for (const token of tokens){
            if (token === '') {
                throw new DOMException_1.SyntaxError("Cannot remove an empty token.");
            } else if (infra_1.codePoint.ASCIIWhiteSpace.test(token)) {
                throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
            } else {
                this._tokenSet.delete(token);
            }
        }
        algorithm_1.tokenList_updateSteps(this);
    }
    /** @inheritdoc */ toggle(token, force = undefined) {
        /**
         * 1. If token is the empty string, then throw a "SyntaxError" DOMException.
         * 2. If token contains any ASCII whitespace, then throw an
         * "InvalidCharacterError" DOMException.
         */ if (token === '') {
            throw new DOMException_1.SyntaxError("Cannot toggle an empty token.");
        } else if (infra_1.codePoint.ASCIIWhiteSpace.test(token)) {
            throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
        }
        /**
         * 3. If context object’s token set[token] exists, then:
         */ if (this._tokenSet.has(token)) {
            /**
             * 3.1. If force is either not given or is false, then remove token from
             * context object’s token set, run the update steps and return false.
             * 3.2. Return true.
             */ if (force === undefined || force === false) {
                this._tokenSet.delete(token);
                algorithm_1.tokenList_updateSteps(this);
                return false;
            }
            return true;
        }
        /**
         * 4. Otherwise, if force not given or is true, append token to context
         * object’s token set, run the update steps, and return true.
         */ if (force === undefined || force === true) {
            this._tokenSet.add(token);
            algorithm_1.tokenList_updateSteps(this);
            return true;
        }
        /**
         * 5. Return false.
         */ return false;
    }
    /** @inheritdoc */ replace(token, newToken) {
        /**
         * 1. If either token or newToken is the empty string, then throw a
         * "SyntaxError" DOMException.
         * 2. If either token or newToken contains any ASCII whitespace, then throw
         * an "InvalidCharacterError" DOMException.
         */ if (token === '' || newToken === '') {
            throw new DOMException_1.SyntaxError("Cannot replace an empty token.");
        } else if (infra_1.codePoint.ASCIIWhiteSpace.test(token) || infra_1.codePoint.ASCIIWhiteSpace.test(newToken)) {
            throw new DOMException_1.InvalidCharacterError("Token cannot contain whitespace.");
        }
        /**
         * 3. If context object’s token set does not contain token, then return
         * false.
         */ if (!this._tokenSet.has(token)) return false;
        /**
         * 4. Replace token in context object’s token set with newToken.
         * 5. Run the update steps.
         * 6. Return true.
         */ infra_1.set.replace(this._tokenSet, token, newToken);
        algorithm_1.tokenList_updateSteps(this);
        return true;
    }
    /** @inheritdoc */ supports(token) {
        /**
         * 1. Let result be the return value of validation steps called with token.
         * 2. Return result.
         */ return algorithm_1.tokenList_validationSteps(this, token);
    }
    /** @inheritdoc */ get value() {
        /**
         * The value attribute must return the result of running context object’s
         * serialize steps.
         */ return algorithm_1.tokenList_serializeSteps(this);
    }
    set value(value) {
        /**
         * Setting the value attribute must set an attribute value for the
         * associated element using associated attribute’s local name and the given
         * value.
         */ algorithm_1.element_setAnAttributeValue(this._element, this._attribute._localName, value);
    }
    /**
     * Returns an iterator for the token set.
     */ [Symbol.iterator]() {
        const it = this._tokenSet[Symbol.iterator]();
        return {
            next () {
                return it.next();
            }
        };
    }
    /**
     * Creates a new `DOMTokenList`.
     *
     * @param element - associated element
     * @param attribute - associated attribute
     */ static _create(element, attribute) {
        return new DOMTokenListImpl(element, attribute);
    }
}
exports.DOMTokenListImpl = DOMTokenListImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ElementImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const NodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents an element node.
 */ class ElementImpl extends NodeImpl_1.NodeImpl {
    /**
     * Initializes a new instance of `Element`.
     */ constructor(){
        super();
        this._children = new Set();
        this._namespace = null;
        this._namespacePrefix = null;
        this._localName = "";
        this._customElementState = "undefined";
        this._customElementDefinition = null;
        this._is = null;
        this._shadowRoot = null;
        this._attributeList = algorithm_1.create_namedNodeMap(this);
        this._attributeChangeSteps = [];
        this._name = '';
        this._assignedSlot = null;
    }
    /** @inheritdoc */ get namespaceURI() {
        return this._namespace;
    }
    /** @inheritdoc */ get prefix() {
        return this._namespacePrefix;
    }
    /** @inheritdoc */ get localName() {
        return this._localName;
    }
    /** @inheritdoc */ get tagName() {
        return this._htmlUppercasedQualifiedName;
    }
    /** @inheritdoc */ get id() {
        return algorithm_1.element_getAnAttributeValue(this, "id");
    }
    set id(value) {
        algorithm_1.element_setAnAttributeValue(this, "id", value);
    }
    /** @inheritdoc */ get className() {
        return algorithm_1.element_getAnAttributeValue(this, "class");
    }
    set className(value) {
        algorithm_1.element_setAnAttributeValue(this, "class", value);
    }
    /** @inheritdoc */ get classList() {
        let attr = algorithm_1.element_getAnAttributeByName("class", this);
        if (attr === null) {
            attr = algorithm_1.create_attr(this._nodeDocument, "class");
        }
        return algorithm_1.create_domTokenList(this, attr);
    }
    /** @inheritdoc */ get slot() {
        return algorithm_1.element_getAnAttributeValue(this, "slot");
    }
    set slot(value) {
        algorithm_1.element_setAnAttributeValue(this, "slot", value);
    }
    /** @inheritdoc */ hasAttributes() {
        return this._attributeList.length !== 0;
    }
    /** @inheritdoc */ get attributes() {
        return this._attributeList;
    }
    /** @inheritdoc */ getAttributeNames() {
        /**
         * The getAttributeNames() method, when invoked, must return the qualified
         * names of the attributes in context object’s attribute list, in order,
         * and a new list otherwise.
         */ const names = [];
        for (const attr of this._attributeList){
            names.push(attr._qualifiedName);
        }
        return names;
    }
    /** @inheritdoc */ getAttribute(qualifiedName) {
        /**
         * 1. Let attr be the result of getting an attribute given qualifiedName
         * and the context object.
         * 2. If attr is null, return null.
         * 3. Return attr’s value.
         */ const attr = algorithm_1.element_getAnAttributeByName(qualifiedName, this);
        return attr ? attr._value : null;
    }
    /** @inheritdoc */ getAttributeNS(namespace, localName) {
        /**
         * 1. Let attr be the result of getting an attribute given namespace,
         * localName, and the context object.
         * 2. If attr is null, return null.
         * 3. Return attr’s value.
         */ const attr = algorithm_1.element_getAnAttributeByNamespaceAndLocalName(namespace, localName, this);
        return attr ? attr._value : null;
    }
    /** @inheritdoc */ setAttribute(qualifiedName, value) {
        /**
         * 1. If qualifiedName does not match the Name production in XML, then
         * throw an "InvalidCharacterError" DOMException.
         */ if (!algorithm_1.xml_isName(qualifiedName)) throw new DOMException_1.InvalidCharacterError();
        /**
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         */ if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        /**
         * 3. Let attribute be the first attribute in context object’s attribute
         * list whose qualified name is qualifiedName, and null otherwise.
         */ let attribute = null;
        for(let i = 0; i < this._attributeList.length; i++){
            const attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                attribute = attr;
                break;
            }
        }
        /**
         * 4. If attribute is null, create an attribute whose local name is
         * qualifiedName, value is value, and node document is context object’s
         * node document, then append this attribute to context object, and
         * then return.
         */ if (attribute === null) {
            attribute = algorithm_1.create_attr(this._nodeDocument, qualifiedName);
            attribute._value = value;
            algorithm_1.element_append(attribute, this);
            return;
        }
        /**
         * 5. Change attribute from context object to value.
         */ algorithm_1.element_change(attribute, this, value);
    }
    /** @inheritdoc */ setAttributeNS(namespace, qualifiedName, value) {
        /**
         * 1. Let namespace, prefix, and localName be the result of passing
         * namespace and qualifiedName to validate and extract.
         * 2. Set an attribute value for the context object using localName, value,
         * and also prefix and namespace.
         */ const [ns, prefix, localName] = algorithm_1.namespace_validateAndExtract(namespace, qualifiedName);
        algorithm_1.element_setAnAttributeValue(this, localName, value, prefix, ns);
    }
    /** @inheritdoc */ removeAttribute(qualifiedName) {
        /**
         * The removeAttribute(qualifiedName) method, when invoked, must remove an
         * attribute given qualifiedName and the context object, and then return
         * undefined.
         */ algorithm_1.element_removeAnAttributeByName(qualifiedName, this);
    }
    /** @inheritdoc */ removeAttributeNS(namespace, localName) {
        /**
         * The removeAttributeNS(namespace, localName) method, when invoked, must
         * remove an attribute given namespace, localName, and context object, and
         * then return undefined.
         */ algorithm_1.element_removeAnAttributeByNamespaceAndLocalName(namespace, localName, this);
    }
    /** @inheritdoc */ hasAttribute(qualifiedName) {
        /**
         * 1. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         * 2. Return true if the context object has an attribute whose qualified
         * name is qualifiedName, and false otherwise.
         */ if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        for(let i = 0; i < this._attributeList.length; i++){
            const attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                return true;
            }
        }
        return false;
    }
    /** @inheritdoc */ toggleAttribute(qualifiedName, force) {
        /**
         * 1. If qualifiedName does not match the Name production in XML, then
         * throw an "InvalidCharacterError" DOMException.
         */ if (!algorithm_1.xml_isName(qualifiedName)) throw new DOMException_1.InvalidCharacterError();
        /**
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         */ if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        /**
         * 3. Let attribute be the first attribute in the context object’s attribute
         * list whose qualified name is qualifiedName, and null otherwise.
         */ let attribute = null;
        for(let i = 0; i < this._attributeList.length; i++){
            const attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                attribute = attr;
                break;
            }
        }
        if (attribute === null) {
            /**
             * 4. If attribute is null, then:
             * 4.1. If force is not given or is true, create an attribute whose local
             * name is qualifiedName, value is the empty string, and node document is
             * the context object’s node document, then append this attribute to the
             * context object, and then return true.
             * 4.2. Return false.
             */ if (force === undefined || force === true) {
                attribute = algorithm_1.create_attr(this._nodeDocument, qualifiedName);
                attribute._value = '';
                algorithm_1.element_append(attribute, this);
                return true;
            }
            return false;
        } else if (force === undefined || force === false) {
            /**
             * 5. Otherwise, if force is not given or is false, remove an attribute
             * given qualifiedName and the context object, and then return false.
             */ algorithm_1.element_removeAnAttributeByName(qualifiedName, this);
            return false;
        }
        /**
         * 6. Return true.
         */ return true;
    }
    /** @inheritdoc */ hasAttributeNS(namespace, localName) {
        /**
         * 1. If namespace is the empty string, set it to null.
         * 2. Return true if the context object has an attribute whose namespace is
         * namespace and local name is localName, and false otherwise.
         */ const ns = namespace || null;
        for(let i = 0; i < this._attributeList.length; i++){
            const attr = this._attributeList[i];
            if (attr._namespace === ns && attr._localName === localName) {
                return true;
            }
        }
        return false;
    }
    /** @inheritdoc */ getAttributeNode(qualifiedName) {
        /**
         * The getAttributeNode(qualifiedName) method, when invoked, must return the
         * result of getting an attribute given qualifiedName and context object.
         */ return algorithm_1.element_getAnAttributeByName(qualifiedName, this);
    }
    /** @inheritdoc */ getAttributeNodeNS(namespace, localName) {
        /**
         * The getAttributeNodeNS(namespace, localName) method, when invoked, must
         * return the result of getting an attribute given namespace, localName, and
         * the context object.
         */ return algorithm_1.element_getAnAttributeByNamespaceAndLocalName(namespace, localName, this);
    }
    /** @inheritdoc */ setAttributeNode(attr) {
        /**
         * The setAttributeNode(attr) and setAttributeNodeNS(attr) methods, when
         * invoked, must return the result of setting an attribute given attr and
         * the context object.
         */ return algorithm_1.element_setAnAttribute(attr, this);
    }
    /** @inheritdoc */ setAttributeNodeNS(attr) {
        return algorithm_1.element_setAnAttribute(attr, this);
    }
    /** @inheritdoc */ removeAttributeNode(attr) {
        /**
         * 1. If context object’s attribute list does not contain attr, then throw
         * a "NotFoundError" DOMException.
         * 2. Remove attr from context object.
         * 3. Return attr.
         */ let found = false;
        for(let i = 0; i < this._attributeList.length; i++){
            const attribute = this._attributeList[i];
            if (attribute === attr) {
                found = true;
                break;
            }
        }
        if (!found) throw new DOMException_1.NotFoundError();
        algorithm_1.element_remove(attr, this);
        return attr;
    }
    /** @inheritdoc */ attachShadow(init) {
        /**
         * 1. If context object’s namespace is not the HTML namespace, then throw a
         * "NotSupportedError" DOMException.
         */ if (this._namespace !== infra_1.namespace.HTML) throw new DOMException_1.NotSupportedError();
        /**
         * 2. If context object’s local name is not a valid custom element name,
         * "article", "aside", "blockquote", "body", "div", "footer", "h1", "h2",
         * "h3", "h4", "h5", "h6", "header", "main" "nav", "p", "section",
         * or "span", then throw a "NotSupportedError" DOMException.
         */ if (!algorithm_1.customElement_isValidCustomElementName(this._localName) && !algorithm_1.customElement_isValidShadowHostName(this._localName)) throw new DOMException_1.NotSupportedError();
        /**
         * 3. If context object’s local name is a valid custom element name,
         * or context object’s is value is not null, then:
         * 3.1. Let definition be the result of looking up a custom element
         * definition given context object’s node document, its namespace, its
         * local name, and its is value.
         * 3.2. If definition is not null and definition’s disable shadow is true,
         *  then throw a "NotSupportedError" DOMException.
         */ if (algorithm_1.customElement_isValidCustomElementName(this._localName) || this._is !== null) {
            const definition = algorithm_1.customElement_lookUpACustomElementDefinition(this._nodeDocument, this._namespace, this._localName, this._is);
            if (definition !== null && definition.disableShadow === true) {
                throw new DOMException_1.NotSupportedError();
            }
        }
        /**
         * 4. If context object is a shadow host, then throw an "NotSupportedError"
         * DOMException.
         */ if (this._shadowRoot !== null) throw new DOMException_1.NotSupportedError();
        /**
         * 5. Let shadow be a new shadow root whose node document is context
         * object’s node document, host is context object, and mode is init’s mode.
         * 6. Set context object’s shadow root to shadow.
         * 7. Return shadow.
         */ const shadow = algorithm_1.create_shadowRoot(this._nodeDocument, this);
        shadow._mode = init.mode;
        this._shadowRoot = shadow;
        return shadow;
    }
    /** @inheritdoc */ get shadowRoot() {
        /**
         * 1. Let shadow be context object’s shadow root.
         * 2. If shadow is null or its mode is "closed", then return null.
         * 3. Return shadow.
         */ const shadow = this._shadowRoot;
        if (shadow === null || shadow.mode === "closed") return null;
        else return shadow;
    }
    /** @inheritdoc */ closest(selectors) {
        /**
         * TODO: Selectors
         * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
         * 2. If s is failure, throw a "SyntaxError" DOMException.
         * 3. Let elements be context object’s inclusive ancestors that are
         * elements, in reverse tree order.
         * 4. For each element in elements, if match a selector against an element,
         * using s, element, and :scope element context object, returns success,
         * return element. [SELECTORS4]
         * 5. Return null.
         */ throw new DOMException_1.NotImplementedError();
    }
    /** @inheritdoc */ matches(selectors) {
        /**
         * TODO: Selectors
         * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
         * 2. If s is failure, throw a "SyntaxError" DOMException.
         * 3. Return true if the result of match a selector against an element,
         * using s, element, and :scope element context object, returns success,
         * and false otherwise. [SELECTORS4]
         */ throw new DOMException_1.NotImplementedError();
    }
    /** @inheritdoc */ webkitMatchesSelector(selectors) {
        return this.matches(selectors);
    }
    /** @inheritdoc */ getElementsByTagName(qualifiedName) {
        /**
         * The getElementsByTagName(qualifiedName) method, when invoked, must return
         * the list of elements with qualified name qualifiedName for context
         * object.
         */ return algorithm_1.node_listOfElementsWithQualifiedName(qualifiedName, this);
    }
    /** @inheritdoc */ getElementsByTagNameNS(namespace, localName) {
        /**
         * The getElementsByTagNameNS(namespace, localName) method, when invoked,
         * must return the list of elements with namespace namespace and local name
         * localName for context object.
         */ return algorithm_1.node_listOfElementsWithNamespace(namespace, localName, this);
    }
    /** @inheritdoc */ getElementsByClassName(classNames) {
        /**
         * The getElementsByClassName(classNames) method, when invoked, must return
         * the list of elements with class names classNames for context object.
         */ return algorithm_1.node_listOfElementsWithClassNames(classNames, this);
    }
    /** @inheritdoc */ insertAdjacentElement(where, element) {
        /**
         * The insertAdjacentElement(where, element) method, when invoked, must
         * return the result of running insert adjacent, given context object,
         *  where, and element.
         */ return algorithm_1.element_insertAdjacent(this, where, element);
    }
    /** @inheritdoc */ insertAdjacentText(where, data) {
        /**
         * 1. Let text be a new Text node whose data is data and node document is
         * context object’s node document.
         * 2. Run insert adjacent, given context object, where, and text.
         */ const text = algorithm_1.create_text(this._nodeDocument, data);
        algorithm_1.element_insertAdjacent(this, where, text);
    }
    /**
     * Returns the qualified name.
     */ get _qualifiedName() {
        /**
         * An element’s qualified name is its local name if its namespace prefix is
         * null, and its namespace prefix, followed by ":", followed by its
         * local name, otherwise.
         */ return this._namespacePrefix ? this._namespacePrefix + ':' + this._localName : this._localName;
    }
    /**
     * Returns the upper-cased qualified name for a html element.
     */ get _htmlUppercasedQualifiedName() {
        /**
         * 1. Let qualifiedName be context object’s qualified name.
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * uppercase.
         * 3. Return qualifiedName.
         */ let qualifiedName = this._qualifiedName;
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toUpperCase();
        }
        return qualifiedName;
    }
    // MIXIN: ParentNode
    /* istanbul ignore next */ get children() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get firstElementChild() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get lastElementChild() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ get childElementCount() {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ prepend(...nodes) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ append(...nodes) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ querySelector(selectors) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    /* istanbul ignore next */ querySelectorAll(selectors) {
        throw new Error("Mixin: ParentNode not implemented.");
    }
    // MIXIN: NonDocumentTypeChildNode
    /* istanbul ignore next */ get previousElementSibling() {
        throw new Error("Mixin: NonDocumentTypeChildNode not implemented.");
    }
    /* istanbul ignore next */ get nextElementSibling() {
        throw new Error("Mixin: NonDocumentTypeChildNode not implemented.");
    }
    // MIXIN: ChildNode
    /* istanbul ignore next */ before(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ after(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ replaceWith(...nodes) {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    /* istanbul ignore next */ remove() {
        throw new Error("Mixin: ChildNode not implemented.");
    }
    // MIXIN: Slotable
    /* istanbul ignore next */ get assignedSlot() {
        throw new Error("Mixin: Slotable not implemented.");
    }
    /**
     * Creates a new `Element`.
     *
     * @param document - owner document
     * @param localName - local name
     * @param namespace - namespace
     * @param prefix - namespace prefix
     */ static _create(document, localName, namespace = null, namespacePrefix = null) {
        const node = new ElementImpl();
        node._localName = localName;
        node._namespace = namespace;
        node._namespacePrefix = namespacePrefix;
        node._nodeDocument = document;
        return node;
    }
}
exports.ElementImpl = ElementImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(ElementImpl.prototype, "_nodeType", interfaces_1.NodeType.Element);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/HTMLCollectionImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const util_2 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
/**
 * Represents a collection of elements.
 */ class HTMLCollectionImpl {
    /**
     * Initializes a new instance of `HTMLCollection`.
     *
     * @param root - root node
     * @param filter - node filter
     */ constructor(root, filter){
        this._live = true;
        this._root = root;
        this._filter = filter;
        return new Proxy(this, this);
    }
    /** @inheritdoc */ get length() {
        /**
         * The length attribute’s getter must return the number of nodes
         * represented by the collection.
         */ let count = 0;
        let node = algorithm_1.tree_getFirstDescendantNode(this._root, false, false, (e)=>util_1.Guard.isElementNode(e) && this._filter(e));
        while(node !== null){
            count++;
            node = algorithm_1.tree_getNextDescendantNode(this._root, node, false, false, (e)=>util_1.Guard.isElementNode(e) && this._filter(e));
        }
        return count;
    }
    /** @inheritdoc */ item(index) {
        /**
         * The item(index) method, when invoked, must return the indexth element
         * in the collection. If there is no indexth element in the collection,
         * then the method must return null.
         */ let i = 0;
        let node = algorithm_1.tree_getFirstDescendantNode(this._root, false, false, (e)=>util_1.Guard.isElementNode(e) && this._filter(e));
        while(node !== null){
            if (i === index) return node;
            else i++;
            node = algorithm_1.tree_getNextDescendantNode(this._root, node, false, false, (e)=>util_1.Guard.isElementNode(e) && this._filter(e));
        }
        return null;
    }
    /** @inheritdoc */ namedItem(key) {
        /**
         * 1. If key is the empty string, return null.
         * 2. Return the first element in the collection for which at least one of
         * the following is true:
         * - it has an ID which is key;
         * - it is in the HTML namespace and has a name attribute whose value is key;
         * or null if there is no such element.
         */ if (key === '') return null;
        let ele = algorithm_1.tree_getFirstDescendantNode(this._root, false, false, (e)=>util_1.Guard.isElementNode(e) && this._filter(e));
        while(ele != null){
            if (ele._uniqueIdentifier === key) {
                return ele;
            } else if (ele._namespace === infra_1.namespace.HTML) {
                for(let i = 0; i < ele._attributeList.length; i++){
                    const attr = ele._attributeList[i];
                    if (attr._localName === "name" && attr._namespace === null && attr._namespacePrefix === null && attr._value === key) return ele;
                }
            }
            ele = algorithm_1.tree_getNextDescendantNode(this._root, ele, false, false, (e)=>util_1.Guard.isElementNode(e) && this._filter(e));
        }
        return null;
    }
    /** @inheritdoc */ [Symbol.iterator]() {
        const root = this._root;
        const filter = this._filter;
        let currentNode = algorithm_1.tree_getFirstDescendantNode(root, false, false, (e)=>util_1.Guard.isElementNode(e) && filter(e));
        return {
            next () {
                if (currentNode === null) {
                    return {
                        done: true,
                        value: null
                    };
                } else {
                    const result = {
                        done: false,
                        value: currentNode
                    };
                    currentNode = algorithm_1.tree_getNextDescendantNode(root, currentNode, false, false, (e)=>util_1.Guard.isElementNode(e) && filter(e));
                    return result;
                }
            }
        };
    }
    /**
     * Implements a proxy get trap to provide array-like access.
     */ get(target, key, receiver) {
        if (!util_2.isString(key) || HTMLCollectionImpl.reservedNames.indexOf(key) !== -1) {
            return Reflect.get(target, key, receiver);
        }
        const index = Number(key);
        if (isNaN(index)) {
            return target.namedItem(key) || undefined;
        } else {
            return target.item(index) || undefined;
        }
    }
    /**
     * Implements a proxy set trap to provide array-like access.
     */ set(target, key, value, receiver) {
        if (!util_2.isString(key) || HTMLCollectionImpl.reservedNames.indexOf(key) !== -1) {
            return Reflect.set(target, key, value, receiver);
        }
        const index = Number(key);
        const node = isNaN(index) ? target.namedItem(key) || undefined : target.item(index) || undefined;
        if (node && node._parent) {
            algorithm_1.mutation_replace(node, value, node._parent);
            return true;
        } else {
            return false;
        }
    }
    /**
     * Creates a new `HTMLCollection`.
     *
     * @param root - root node
     * @param filter - node filter
     */ static _create(root, filter = ()=>true) {
        return new HTMLCollectionImpl(root, filter);
    }
}
exports.HTMLCollectionImpl = HTMLCollectionImpl;
HTMLCollectionImpl.reservedNames = [
    '_root',
    '_live',
    '_filter',
    'length',
    'item',
    'namedItem',
    'get',
    'set'
];
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/MutationObserverImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
/**
 * Represents an object that can be used to observe mutations to the tree of
 * nodes.
 */ class MutationObserverImpl {
    /**
     * Initializes a new instance of `MutationObserver`.
     *
     * @param callback - the callback function
     */ constructor(callback){
        this._nodeList = [];
        this._recordQueue = [];
        /**
         * 1. Let mo be a new MutationObserver object whose callback is callback.
         * 2. Append mo to mo’s relevant agent’s mutation observers.
         * 3. Return mo.
         */ this._callback = callback;
        const window = _1.dom.window;
        infra_1.set.append(window._mutationObservers, this);
    }
    /** @inheritdoc */ observe(target, options) {
        options = options || {
            childList: false,
            subtree: false
        };
        /**
         * 1. If either options’s attributeOldValue or attributeFilter is present
         * and options’s attributes is omitted, then set options’s attributes
         * to true.
         * 2. If options’s characterDataOldValue is present and options’s
         * characterData is omitted, then set options’s characterData to true.
         * 3. If none of options’s childList, attributes, and characterData is
         * true, then throw a TypeError.
         * 4. If options’s attributeOldValue is true and options’s attributes is
         * false, then throw a TypeError.
         * 5. If options’s attributeFilter is present and options’s attributes is
         *  false, then throw a TypeError.
         * 6. If options’s characterDataOldValue is true and options’s characterData
         * is false, then throw a TypeError.
         */ if ((options.attributeOldValue !== undefined || options.attributeFilter !== undefined) && options.attributes === undefined) {
            options.attributes = true;
        }
        if (options.characterDataOldValue !== undefined && options.characterData === undefined) {
            options.characterData = true;
        }
        if (!options.childList && !options.attributes && !options.characterData) {
            throw new TypeError();
        }
        if (options.attributeOldValue && !options.attributes) {
            throw new TypeError();
        }
        if (options.attributeFilter !== undefined && !options.attributes) {
            throw new TypeError();
        }
        if (options.characterDataOldValue && !options.characterData) {
            throw new TypeError();
        }
        /**
         * 7. For each registered of target’s registered observer list, if
         * registered’s observer is the context object:
         */ let isRegistered = false;
        const coptions = options;
        for (const registered of target._registeredObserverList){
            if (registered.observer === this) {
                isRegistered = true;
                /**
                 * 7.1. For each node of the context object’s node list, remove all
                 * transient registered observers whose source is registered from node’s
                 * registered observer list.
                 */ for (const node of this._nodeList){
                    infra_1.list.remove(node._registeredObserverList, (ob)=>util_1.Guard.isTransientRegisteredObserver(ob) && ob.source === registered);
                }
                /**
                 * 7.2. Set registered’s options to options.
                 */ registered.options = coptions;
            }
        }
        /**
         * 8. Otherwise:
         * 8.1. Append a new registered observer whose observer is the context
         * object and options is options to target’s registered observer list.
         * 8.2. Append target to the context object’s node list.
         */ if (!isRegistered) {
            target._registeredObserverList.push({
                observer: this,
                options: options
            });
            this._nodeList.push(target);
        }
    }
    /** @inheritdoc */ disconnect() {
        /**
         * 1. For each node of the context object’s node list, remove any
         * registered observer from node’s registered observer list for which the
         * context object is the observer.
         */ for (const node of this._nodeList){
            infra_1.list.remove(node._registeredObserverList, (ob)=>ob.observer === this);
        }
        /**
         * 2. Empty the context object’s record queue.
         */ this._recordQueue = [];
    }
    /** @inheritdoc */ takeRecords() {
        /**
         * 1. Let records be a clone of the context object’s record queue.
         * 2. Empty the context object’s record queue.
         * 3. Return records.
         */ const records = this._recordQueue;
        this._recordQueue = [];
        return records;
    }
}
exports.MutationObserverImpl = MutationObserverImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/MutationRecordImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Represents a mutation record.
 */ class MutationRecordImpl {
    /**
     * Initializes a new instance of `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */ constructor(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue){
        this._type = type;
        this._target = target;
        this._addedNodes = addedNodes;
        this._removedNodes = removedNodes;
        this._previousSibling = previousSibling;
        this._nextSibling = nextSibling;
        this._attributeName = attributeName;
        this._attributeNamespace = attributeNamespace;
        this._oldValue = oldValue;
    }
    /** @inheritdoc */ get type() {
        return this._type;
    }
    /** @inheritdoc */ get target() {
        return this._target;
    }
    /** @inheritdoc */ get addedNodes() {
        return this._addedNodes;
    }
    /** @inheritdoc */ get removedNodes() {
        return this._removedNodes;
    }
    /** @inheritdoc */ get previousSibling() {
        return this._previousSibling;
    }
    /** @inheritdoc */ get nextSibling() {
        return this._nextSibling;
    }
    /** @inheritdoc */ get attributeName() {
        return this._attributeName;
    }
    /** @inheritdoc */ get attributeNamespace() {
        return this._attributeNamespace;
    }
    /** @inheritdoc */ get oldValue() {
        return this._oldValue;
    }
    /**
     * Creates a new `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */ static _create(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
        return new MutationRecordImpl(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue);
    }
}
exports.MutationRecordImpl = MutationRecordImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NamedNodeMapImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a collection of attributes.
 */ class NamedNodeMapImpl extends Array {
    /**
     * Initializes a new instance of `NamedNodeMap`.
     *
     * @param element - parent element
     */ constructor(element){
        super();
        this._element = element;
    }
    _asArray() {
        return this;
    }
    /** @inheritdoc */ item(index) {
        /**
         * 1. If index is equal to or greater than context object’s attribute list’s
         * size, then return null.
         * 2. Otherwise, return context object’s attribute list[index].
         *
         */ return this[index] || null;
    }
    /** @inheritdoc */ getNamedItem(qualifiedName) {
        /**
         * The getNamedItem(qualifiedName) method, when invoked, must return the
         * result of getting an attribute given qualifiedName and element.
         */ return algorithm_1.element_getAnAttributeByName(qualifiedName, this._element);
    }
    /** @inheritdoc */ getNamedItemNS(namespace, localName) {
        /**
         * The getNamedItemNS(namespace, localName) method, when invoked, must
         * return the result of getting an attribute given namespace, localName,
         * and element.
         */ return algorithm_1.element_getAnAttributeByNamespaceAndLocalName(namespace || '', localName, this._element);
    }
    /** @inheritdoc */ setNamedItem(attr) {
        /**
         * The setNamedItem(attr) and setNamedItemNS(attr) methods, when invoked,
         * must return the result of setting an attribute given attr and element.
         */ return algorithm_1.element_setAnAttribute(attr, this._element);
    }
    /** @inheritdoc */ setNamedItemNS(attr) {
        return algorithm_1.element_setAnAttribute(attr, this._element);
    }
    /** @inheritdoc */ removeNamedItem(qualifiedName) {
        /**
         * 1. Let attr be the result of removing an attribute given qualifiedName
         * and element.
         * 2. If attr is null, then throw a "NotFoundError" DOMException.
         * 3. Return attr.
         */ const attr = algorithm_1.element_removeAnAttributeByName(qualifiedName, this._element);
        if (attr === null) throw new DOMException_1.NotFoundError();
        return attr;
    }
    /** @inheritdoc */ removeNamedItemNS(namespace, localName) {
        /**
         * 1. Let attr be the result of removing an attribute given namespace,
         * localName, and element.
         * 2. If attr is null, then throw a "NotFoundError" DOMException.
         * 3. Return attr.
         */ const attr = algorithm_1.element_removeAnAttributeByNamespaceAndLocalName(namespace || '', localName, this._element);
        if (attr === null) throw new DOMException_1.NotFoundError();
        return attr;
    }
    /**
     * Creates a new `NamedNodeMap`.
     *
     * @param element - parent element
     */ static _create(element) {
        return new NamedNodeMapImpl(element);
    }
}
exports.NamedNodeMapImpl = NamedNodeMapImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeFilterImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a node filter.
 */ class NodeFilterImpl {
    /**
     * Initializes a new instance of `NodeFilter`.
     */ constructor(){}
    /**
     * Callback function.
     */ acceptNode(node) {
        return interfaces_1.FilterResult.Accept;
    }
    /**
     * Creates a new `NodeFilter`.
     */ static _create() {
        return new NodeFilterImpl();
    }
}
exports.NodeFilterImpl = NodeFilterImpl;
NodeFilterImpl.FILTER_ACCEPT = 1;
NodeFilterImpl.FILTER_REJECT = 2;
NodeFilterImpl.FILTER_SKIP = 3;
NodeFilterImpl.SHOW_ALL = 0xffffffff;
NodeFilterImpl.SHOW_ELEMENT = 0x1;
NodeFilterImpl.SHOW_ATTRIBUTE = 0x2;
NodeFilterImpl.SHOW_TEXT = 0x4;
NodeFilterImpl.SHOW_CDATA_SECTION = 0x8;
NodeFilterImpl.SHOW_ENTITY_REFERENCE = 0x10;
NodeFilterImpl.SHOW_ENTITY = 0x20;
NodeFilterImpl.SHOW_PROCESSING_INSTRUCTION = 0x40;
NodeFilterImpl.SHOW_COMMENT = 0x80;
NodeFilterImpl.SHOW_DOCUMENT = 0x100;
NodeFilterImpl.SHOW_DOCUMENT_TYPE = 0x200;
NodeFilterImpl.SHOW_DOCUMENT_FRAGMENT = 0x400;
NodeFilterImpl.SHOW_NOTATION = 0x800;
/**
 * Define constants on prototype.
 */ WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "FILTER_ACCEPT", 1);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "FILTER_REJECT", 2);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "FILTER_SKIP", 3);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ALL", 0xffffffff);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ELEMENT", 0x1);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ATTRIBUTE", 0x2);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_TEXT", 0x4);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_CDATA_SECTION", 0x8);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ENTITY_REFERENCE", 0x10);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_ENTITY", 0x20);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_PROCESSING_INSTRUCTION", 0x40);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_COMMENT", 0x80);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT", 0x100);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT_TYPE", 0x200);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT_FRAGMENT", 0x400);
WebIDLAlgorithm_1.idl_defineConst(NodeFilterImpl.prototype, "SHOW_NOTATION", 0x800);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TraverserImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */ class TraverserImpl {
    /**
     * Initializes a new instance of `Traverser`.
     *
     * @param root - root node
     */ constructor(root){
        this._activeFlag = false;
        this._root = root;
        this._whatToShow = interfaces_1.WhatToShow.All;
        this._filter = null;
    }
    /** @inheritdoc */ get root() {
        return this._root;
    }
    /** @inheritdoc */ get whatToShow() {
        return this._whatToShow;
    }
    /** @inheritdoc */ get filter() {
        return this._filter;
    }
}
exports.TraverserImpl = TraverserImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeIteratorImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const TraverserImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TraverserImpl.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */ class NodeIteratorImpl extends TraverserImpl_1.TraverserImpl {
    /**
     * Initializes a new instance of `NodeIterator`.
     */ constructor(root, reference, pointerBeforeReference){
        super(root);
        this._iteratorCollection = undefined;
        this._reference = reference;
        this._pointerBeforeReference = pointerBeforeReference;
        algorithm_1.nodeIterator_iteratorList().add(this);
    }
    /** @inheritdoc */ get referenceNode() {
        return this._reference;
    }
    /** @inheritdoc */ get pointerBeforeReferenceNode() {
        return this._pointerBeforeReference;
    }
    /** @inheritdoc */ nextNode() {
        /**
         * The nextNode() method, when invoked, must return the result of
         * traversing with the context object and next.
         */ return algorithm_1.nodeIterator_traverse(this, true);
    }
    /** @inheritdoc */ previousNode() {
        /**
         * The previousNode() method, when invoked, must return the result of
         * traversing with the context object and previous.
         */ return algorithm_1.nodeIterator_traverse(this, false);
    }
    /** @inheritdoc */ detach() {
        /**
         * The detach() method, when invoked, must do nothing.
         *
         * since JS lacks weak references, we still use detach
         */ algorithm_1.nodeIterator_iteratorList().delete(this);
    }
    /**
     * Creates a new `NodeIterator`.
     *
     * @param root - iterator's root node
     * @param reference - reference node
     * @param pointerBeforeReference - whether the iterator is before or after the
     * reference node
     */ static _create(root, reference, pointerBeforeReference) {
        return new NodeIteratorImpl(root, reference, pointerBeforeReference);
    }
}
exports.NodeIteratorImpl = NodeIteratorImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeListImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents an ordered set of nodes.
 */ class NodeListImpl {
    /**
     * Initializes a new instance of `NodeList`.
     *
     * @param root - root node
     */ constructor(root){
        this._live = true;
        this._filter = null;
        this._length = 0;
        this._root = root;
        return new Proxy(this, this);
    }
    /** @inheritdoc */ get length() {
        /**
         * The length attribute must return the number of nodes represented
         * by the collection.
         */ return this._root._children.size;
    }
    /** @inheritdoc */ item(index) {
        /**
         * The item(index) method must return the indexth node in the collection.
         * If there is no indexth node in the collection, then the method must
         * return null.
         */ if (index < 0 || index > this.length - 1) return null;
        if (index < this.length / 2) {
            let i = 0;
            let node = this._root._firstChild;
            while(node !== null && i !== index){
                node = node._nextSibling;
                i++;
            }
            return node;
        } else {
            let i = this.length - 1;
            let node = this._root._lastChild;
            while(node !== null && i !== index){
                node = node._previousSibling;
                i--;
            }
            return node;
        }
    }
    /** @inheritdoc */ keys() {
        return {
            [Symbol.iterator]: (function() {
                let index = 0;
                return {
                    next: (function() {
                        if (index === this.length) {
                            return {
                                done: true,
                                value: null
                            };
                        } else {
                            return {
                                done: false,
                                value: index++
                            };
                        }
                    }).bind(this)
                };
            }).bind(this)
        };
    }
    /** @inheritdoc */ values() {
        return {
            [Symbol.iterator]: (function() {
                const it = this[Symbol.iterator]();
                return {
                    next () {
                        return it.next();
                    }
                };
            }).bind(this)
        };
    }
    /** @inheritdoc */ entries() {
        return {
            [Symbol.iterator]: (function() {
                const it = this[Symbol.iterator]();
                let index = 0;
                return {
                    next () {
                        const itResult = it.next();
                        if (itResult.done) {
                            return {
                                done: true,
                                value: null
                            };
                        } else {
                            return {
                                done: false,
                                value: [
                                    index++,
                                    itResult.value
                                ]
                            };
                        }
                    }
                };
            }).bind(this)
        };
    }
    /** @inheritdoc */ [Symbol.iterator]() {
        return this._root._children[Symbol.iterator]();
    }
    /** @inheritdoc */ forEach(callback, thisArg) {
        if (thisArg === undefined) {
            thisArg = _1.dom.window;
        }
        let index = 0;
        for (const node of this._root._children){
            callback.call(thisArg, node, index++, this);
        }
    }
    /**
     * Implements a proxy get trap to provide array-like access.
     */ get(target, key, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.get(target, key, receiver);
        }
        const index = Number(key);
        if (isNaN(index)) {
            return Reflect.get(target, key, receiver);
        }
        return target.item(index) || undefined;
    }
    /**
     * Implements a proxy set trap to provide array-like access.
     */ set(target, key, value, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.set(target, key, value, receiver);
        }
        const index = Number(key);
        if (isNaN(index)) {
            return Reflect.set(target, key, value, receiver);
        }
        const node = target.item(index) || undefined;
        if (!node) return false;
        if (node._parent) {
            algorithm_1.mutation_replace(node, value, node._parent);
            return true;
        } else {
            return false;
        }
    }
    /**
     * Creates a new `NodeList`.
     *
     * @param root - root node
     */ static _create(root) {
        return new NodeListImpl(root);
    }
}
exports.NodeListImpl = NodeListImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeListStaticImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
/**
 * Represents an ordered list of nodes.
 * This is a static implementation of `NodeList`.
 */ class NodeListStaticImpl {
    /**
     * Initializes a new instance of `NodeList`.
     *
     * @param root - root node
     */ constructor(root){
        this._live = false;
        this._items = [];
        this._length = 0;
        this._root = root;
        this._items = [];
        this._filter = function(node) {
            return true;
        };
        return new Proxy(this, this);
    }
    /** @inheritdoc */ get length() {
        /**
         * The length attribute must return the number of nodes represented by
         * the collection.
         */ return this._items.length;
    }
    /** @inheritdoc */ item(index) {
        /**
         * The item(index) method must return the indexth node in the collection.
         * If there is no indexth node in the collection, then the method must
         * return null.
         */ if (index < 0 || index > this.length - 1) return null;
        return this._items[index];
    }
    /** @inheritdoc */ keys() {
        return {
            [Symbol.iterator]: (function() {
                let index = 0;
                return {
                    next: (function() {
                        if (index === this.length) {
                            return {
                                done: true,
                                value: null
                            };
                        } else {
                            return {
                                done: false,
                                value: index++
                            };
                        }
                    }).bind(this)
                };
            }).bind(this)
        };
    }
    /** @inheritdoc */ values() {
        return {
            [Symbol.iterator]: (function() {
                const it = this[Symbol.iterator]();
                return {
                    next () {
                        return it.next();
                    }
                };
            }).bind(this)
        };
    }
    /** @inheritdoc */ entries() {
        return {
            [Symbol.iterator]: (function() {
                const it = this[Symbol.iterator]();
                let index = 0;
                return {
                    next () {
                        const itResult = it.next();
                        if (itResult.done) {
                            return {
                                done: true,
                                value: null
                            };
                        } else {
                            return {
                                done: false,
                                value: [
                                    index++,
                                    itResult.value
                                ]
                            };
                        }
                    }
                };
            }).bind(this)
        };
    }
    /** @inheritdoc */ [Symbol.iterator]() {
        const it = this._items[Symbol.iterator]();
        return {
            next () {
                return it.next();
            }
        };
    }
    /** @inheritdoc */ forEach(callback, thisArg) {
        if (thisArg === undefined) {
            thisArg = _1.dom.window;
        }
        let index = 0;
        for (const node of this._items){
            callback.call(thisArg, node, index++, this);
        }
    }
    /**
     * Implements a proxy get trap to provide array-like access.
     */ get(target, key, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.get(target, key, receiver);
        }
        const index = Number(key);
        if (isNaN(index)) {
            return Reflect.get(target, key, receiver);
        }
        return target._items[index] || undefined;
    }
    /**
     * Implements a proxy set trap to provide array-like access.
     */ set(target, key, value, receiver) {
        if (!util_1.isString(key)) {
            return Reflect.set(target, key, value, receiver);
        }
        const index = Number(key);
        if (isNaN(index)) {
            return Reflect.set(target, key, value, receiver);
        }
        if (index >= 0 && index < target._items.length) {
            target._items[index] = value;
            return true;
        } else {
            return false;
        }
    }
    /**
     * Creates a new `NodeList`.
     *
     * @param root - root node
     * @param items - a list of items to initialize the list
     */ static _create(root, items) {
        const list = new NodeListStaticImpl(root);
        list._items = items;
        return list;
    }
}
exports.NodeListStaticImpl = NodeListStaticImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NonDocumentTypeChildNodeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
/**
 * Represents a mixin that extends child nodes that can have siblings
 * other than doctypes. This mixin is implemented by {@link Element} and
 * {@link CharacterData}.
 */ class NonDocumentTypeChildNodeImpl {
    /** @inheritdoc */ get previousElementSibling() {
        /**
         * The previousElementSibling attribute’s getter must return the first
         * preceding sibling that is an element, and null otherwise.
         */ let node = util_1.Cast.asNode(this)._previousSibling;
        while(node){
            if (util_1.Guard.isElementNode(node)) return node;
            else node = node._previousSibling;
        }
        return null;
    }
    /** @inheritdoc */ get nextElementSibling() {
        /**
         * The nextElementSibling attribute’s getter must return the first
         * following sibling that is an element, and null otherwise.
         */ let node = util_1.Cast.asNode(this)._nextSibling;
        while(node){
            if (util_1.Guard.isElementNode(node)) return node;
            else node = node._nextSibling;
        }
        return null;
    }
}
exports.NonDocumentTypeChildNodeImpl = NonDocumentTypeChildNodeImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NonElementParentNodeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */ class NonElementParentNodeImpl {
    /** @inheritdoc */ getElementById(id) {
        /**
         * The getElementById(elementId) method, when invoked, must return the first
         * element, in tree order, within the context object’s descendants,
         * whose ID is elementId, and null if there is no such element otherwise.
         */ let ele = algorithm_1.tree_getFirstDescendantNode(util_1.Cast.asNode(this), false, false, (e)=>util_1.Guard.isElementNode(e));
        while(ele !== null){
            if (ele._uniqueIdentifier === id) {
                return ele;
            }
            ele = algorithm_1.tree_getNextDescendantNode(util_1.Cast.asNode(this), ele, false, false, (e)=>util_1.Guard.isElementNode(e));
        }
        return null;
    }
}
exports.NonElementParentNodeImpl = NonElementParentNodeImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ParentNodeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a mixin that extends parent nodes that can have children.
 * This mixin is implemented by {@link Element}, {@link Document} and
 * {@link DocumentFragment}.
 */ class ParentNodeImpl {
    /** @inheritdoc */ get children() {
        /**
         * The children attribute’s getter must return an HTMLCollection collection
         * rooted at context object matching only element children.
         */ return algorithm_1.create_htmlCollection(util_1.Cast.asNode(this));
    }
    /** @inheritdoc */ get firstElementChild() {
        /**
         * The firstElementChild attribute’s getter must return the first child
         * that is an element, and null otherwise.
         */ let node = util_1.Cast.asNode(this)._firstChild;
        while(node){
            if (util_1.Guard.isElementNode(node)) return node;
            else node = node._nextSibling;
        }
        return null;
    }
    /** @inheritdoc */ get lastElementChild() {
        /**
         * The lastElementChild attribute’s getter must return the last child that
         * is an element, and null otherwise.
         */ let node = util_1.Cast.asNode(this)._lastChild;
        while(node){
            if (util_1.Guard.isElementNode(node)) return node;
            else node = node._previousSibling;
        }
        return null;
    }
    /** @inheritdoc */ get childElementCount() {
        /**
         * The childElementCount attribute’s getter must return the number of
         * children of context object that are elements.
         */ let count = 0;
        for (const childNode of util_1.Cast.asNode(this)._children){
            if (util_1.Guard.isElementNode(childNode)) count++;
        }
        return count;
    }
    /** @inheritdoc */ prepend(...nodes) {
        /**
         * 1. Let node be the result of converting nodes into a node given nodes
         * and context object’s node document.
         * 2. Pre-insert node into context object before the context object’s first
         * child.
         */ const node = util_1.Cast.asNode(this);
        const childNode = algorithm_1.parentNode_convertNodesIntoANode(nodes, node._nodeDocument);
        algorithm_1.mutation_preInsert(childNode, node, node._firstChild);
    }
    /** @inheritdoc */ append(...nodes) {
        /**
         * 1. Let node be the result of converting nodes into a node given nodes
         * and context object’s node document.
         * 2. Append node to context object.
         */ const node = util_1.Cast.asNode(this);
        const childNode = algorithm_1.parentNode_convertNodesIntoANode(nodes, node._nodeDocument);
        algorithm_1.mutation_append(childNode, node);
    }
    /** @inheritdoc */ querySelector(selectors) {
        /**
         * The querySelector(selectors) method, when invoked, must return the first
         * result of running scope-match a selectors string selectors against
         * context object, if the result is not an empty list, and null otherwise.
         */ const node = util_1.Cast.asNode(this);
        const result = algorithm_1.selectors_scopeMatchASelectorsString(selectors, node);
        return result.length === 0 ? null : result[0];
    }
    /** @inheritdoc */ querySelectorAll(selectors) {
        /**
         * The querySelectorAll(selectors) method, when invoked, must return the
         * static result of running scope-match a selectors string selectors against
         * context object.
         */ const node = util_1.Cast.asNode(this);
        const result = algorithm_1.selectors_scopeMatchASelectorsString(selectors, node);
        return algorithm_1.create_nodeListStatic(node, result);
    }
}
exports.ParentNodeImpl = ParentNodeImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ProcessingInstructionImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const CharacterDataImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CharacterDataImpl.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
/**
 * Represents a processing instruction node.
 */ class ProcessingInstructionImpl extends CharacterDataImpl_1.CharacterDataImpl {
    /**
     * Initializes a new instance of `ProcessingInstruction`.
     */ constructor(target, data){
        super(data);
        this._target = target;
    }
    /**
     * Gets the target of the {@link ProcessingInstruction} node.
     */ get target() {
        return this._target;
    }
    /**
     * Creates a new `ProcessingInstruction`.
     *
     * @param document - owner document
     * @param target - instruction target
     * @param data - node contents
     */ static _create(document, target, data) {
        const node = new ProcessingInstructionImpl(target, data);
        node._nodeDocument = document;
        return node;
    }
}
exports.ProcessingInstructionImpl = ProcessingInstructionImpl;
/**
 * Initialize prototype properties
 */ WebIDLAlgorithm_1.idl_defineConst(ProcessingInstructionImpl.prototype, "_nodeType", interfaces_1.NodeType.ProcessingInstruction);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/RangeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const AbstractRangeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbstractRangeImpl.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const WebIDLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
/**
 * Represents a live range.
 */ class RangeImpl extends AbstractRangeImpl_1.AbstractRangeImpl {
    /**
     * Initializes a new instance of `Range`.
     */ constructor(){
        super();
        /**
         * The Range() constructor, when invoked, must return a new live range with
         * (current global object’s associated Document, 0) as its start and end.
         */ const doc = _1.dom.window._associatedDocument;
        this._start = [
            doc,
            0
        ];
        this._end = [
            doc,
            0
        ];
        _1.dom.rangeList.add(this);
    }
    /** @inheritdoc */ get commonAncestorContainer() {
        /**
         * 1. Let container be start node.
         * 2. While container is not an inclusive ancestor of end node, let
         * container be container’s parent.
         * 3. Return container.
         */ let container = this._start[0];
        while(!algorithm_1.tree_isAncestorOf(this._end[0], container, true)){
            if (container._parent === null) {
                throw new Error("Parent node  is null.");
            }
            container = container._parent;
        }
        return container;
    }
    /** @inheritdoc */ setStart(node, offset) {
        /**
         * The setStart(node, offset) method, when invoked, must set the start of
         * context object to boundary point (node, offset).
         */ algorithm_1.range_setTheStart(this, node, offset);
    }
    /** @inheritdoc */ setEnd(node, offset) {
        /**
         * The setEnd(node, offset) method, when invoked, must set the end of
         * context object to boundary point (node, offset).
         */ algorithm_1.range_setTheEnd(this, node, offset);
    }
    /** @inheritdoc */ setStartBefore(node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the start of the context object to boundary point
         * (parent, node’s index).
         */ let parent = node._parent;
        if (parent === null) throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheStart(this, parent, algorithm_1.tree_index(node));
    }
    /** @inheritdoc */ setStartAfter(node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the start of the context object to boundary point
         * (parent, node’s index plus 1).
         */ let parent = node._parent;
        if (parent === null) throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheStart(this, parent, algorithm_1.tree_index(node) + 1);
    }
    /** @inheritdoc */ setEndBefore(node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the end of the context object to boundary point
         * (parent, node’s index).
         */ let parent = node._parent;
        if (parent === null) throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheEnd(this, parent, algorithm_1.tree_index(node));
    }
    /** @inheritdoc */ setEndAfter(node) {
        /**
         * 1. Let parent be node’s parent.
         * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
         * 3. Set the end of the context object to boundary point
         * (parent, node’s index plus 1).
         */ let parent = node._parent;
        if (parent === null) throw new DOMException_1.InvalidNodeTypeError();
        algorithm_1.range_setTheEnd(this, parent, algorithm_1.tree_index(node) + 1);
    }
    /** @inheritdoc */ collapse(toStart) {
        /**
         * The collapse(toStart) method, when invoked, must if toStart is true,
         * set end to start, and set start to end otherwise.
         */ if (toStart) {
            this._end = this._start;
        } else {
            this._start = this._end;
        }
    }
    /** @inheritdoc */ selectNode(node) {
        /**
         * The selectNode(node) method, when invoked, must select node within
         * context object.
         */ algorithm_1.range_select(node, this);
    }
    /** @inheritdoc */ selectNodeContents(node) {
        /**
         * 1. If node is a doctype, throw an "InvalidNodeTypeError" DOMException.
         * 2. Let length be the length of node.
         * 3. Set start to the boundary point (node, 0).
         * 4. Set end to the boundary point (node, length).
         */ if (util_1.Guard.isDocumentTypeNode(node)) throw new DOMException_1.InvalidNodeTypeError();
        const length = algorithm_1.tree_nodeLength(node);
        this._start = [
            node,
            0
        ];
        this._end = [
            node,
            length
        ];
    }
    /** @inheritdoc */ compareBoundaryPoints(how, sourceRange) {
        /**
         * 1. If how is not one of
         * - START_TO_START,
         * - START_TO_END,
         * - END_TO_END, and
         * - END_TO_START,
         * then throw a "NotSupportedError" DOMException.
         */ if (how !== interfaces_1.HowToCompare.StartToStart && how !== interfaces_1.HowToCompare.StartToEnd && how !== interfaces_1.HowToCompare.EndToEnd && how !== interfaces_1.HowToCompare.EndToStart) throw new DOMException_1.NotSupportedError();
        /**
         * 2. If context object’s root is not the same as sourceRange’s root,
         * then throw a "WrongDocumentError" DOMException.
         */ if (algorithm_1.range_root(this) !== algorithm_1.range_root(sourceRange)) throw new DOMException_1.WrongDocumentError();
        /**
         * 3. If how is:
         * - START_TO_START:
         * Let this point be the context object’s start. Let other point be
         * sourceRange’s start.
         * - START_TO_END:
         * Let this point be the context object’s end. Let other point be
         * sourceRange’s start.
         * - END_TO_END:
         * Let this point be the context object’s end. Let other point be
         * sourceRange’s end.
         * - END_TO_START:
         * Let this point be the context object’s start. Let other point be
         * sourceRange’s end.
         */ let thisPoint;
        let otherPoint;
        switch(how){
            case interfaces_1.HowToCompare.StartToStart:
                thisPoint = this._start;
                otherPoint = sourceRange._start;
                break;
            case interfaces_1.HowToCompare.StartToEnd:
                thisPoint = this._end;
                otherPoint = sourceRange._start;
                break;
            case interfaces_1.HowToCompare.EndToEnd:
                thisPoint = this._end;
                otherPoint = sourceRange._end;
                break;
            case interfaces_1.HowToCompare.EndToStart:
                thisPoint = this._start;
                otherPoint = sourceRange._end;
                break;
            /* istanbul ignore next */ default:
                throw new DOMException_1.NotSupportedError();
        }
        /**
         * 4. If the position of this point relative to other point is
         * - before
         * Return −1.
         * - equal
         * Return 0.
         * - after
         * Return 1.
         */ const position = algorithm_1.boundaryPoint_position(thisPoint, otherPoint);
        if (position === interfaces_1.BoundaryPosition.Before) {
            return -1;
        } else if (position === interfaces_1.BoundaryPosition.After) {
            return 1;
        } else {
            return 0;
        }
    }
    /** @inheritdoc */ deleteContents() {
        /**
         * 1. If the context object is collapsed, then return.
         * 2. Let original start node, original start offset, original end node,
         * and original end offset be the context object’s start node,
         * start offset, end node, and end offset, respectively.
         */ if (algorithm_1.range_collapsed(this)) return;
        const originalStartNode = this._startNode;
        const originalStartOffset = this._startOffset;
        const originalEndNode = this._endNode;
        const originalEndOffset = this._endOffset;
        /**
         * 3. If original start node and original end node are the same, and they
         * are a Text, ProcessingInstruction, or Comment node, replace data with
         * node original start node, offset original start offset, count original
         * end offset minus original start offset, and data the empty string,
         * and then return.
         */ if (originalStartNode === originalEndNode && util_1.Guard.isCharacterDataNode(originalStartNode)) {
            algorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset, '');
            return;
        }
        /**
         * 4. Let nodes to remove be a list of all the nodes that are contained in
         * the context object, in tree order, omitting any node whose parent is also
         * contained in the context object.
         */ const nodesToRemove = [];
        for (const node of algorithm_1.range_getContainedNodes(this)){
            const parent = node._parent;
            if (parent !== null && algorithm_1.range_isContained(parent, this)) {
                continue;
            }
            nodesToRemove.push(node);
        }
        let newNode;
        let newOffset;
        if (algorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
            /**
             * 5. If original start node is an inclusive ancestor of original end
             * node, set new node to original start node and new offset to original
             * start offset.
             */ newNode = originalStartNode;
            newOffset = originalStartOffset;
        } else {
            /**
             * 6. Otherwise:
             * 6.1. Let reference node equal original start node.
             * 6.2. While reference node’s parent is not null and is not an inclusive
             * ancestor of original end node, set reference node to its parent.
             * 6.3. Set new node to the parent of reference node, and new offset to
             * one plus the index of reference node.
             */ let referenceNode = originalStartNode;
            while(referenceNode._parent !== null && !algorithm_1.tree_isAncestorOf(originalEndNode, referenceNode._parent, true)){
                referenceNode = referenceNode._parent;
            }
            /* istanbul ignore next */ if (referenceNode._parent === null) {
                throw new Error("Parent node is null.");
            }
            newNode = referenceNode._parent;
            newOffset = algorithm_1.tree_index(referenceNode) + 1;
        }
        /**
         * 7. If original start node is a Text, ProcessingInstruction, or Comment
         * node, replace data with node original start node, offset original start
         * offset, count original start node’s length minus original start offset,
         * data the empty string.
         */ if (util_1.Guard.isCharacterDataNode(originalStartNode)) {
            algorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, algorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset, '');
        }
        /**
         * 8. For each node in nodes to remove, in tree order, remove node from its
         * parent.
         */ for (const node of nodesToRemove){
            /* istanbul ignore else */ if (node._parent) {
                algorithm_1.mutation_remove(node, node._parent);
            }
        }
        /**
         * 9. If original end node is a Text, ProcessingInstruction, or Comment
         * node, replace data with node original end node, offset 0, count original
         * end offset and data the empty string.
         */ if (util_1.Guard.isCharacterDataNode(originalEndNode)) {
            algorithm_1.characterData_replaceData(originalEndNode, 0, originalEndOffset, '');
        }
        /**
         * 10. Set start and end to (new node, new offset).
         */ this._start = [
            newNode,
            newOffset
        ];
        this._end = [
            newNode,
            newOffset
        ];
    }
    /** @inheritdoc */ extractContents() {
        /**
         * The extractContents() method, when invoked, must return the result of
         * extracting the context object.
         */ return algorithm_1.range_extract(this);
    }
    /** @inheritdoc */ cloneContents() {
        /**
         * The cloneContents() method, when invoked, must return the result of
         * cloning the contents of the context object.
         */ return algorithm_1.range_cloneTheContents(this);
    }
    /** @inheritdoc */ insertNode(node) {
        /**
         * The insertNode(node) method, when invoked, must insert node into the
         * context object.
         */ return algorithm_1.range_insert(node, this);
    }
    /** @inheritdoc */ surroundContents(newParent) {
        /**
         * 1. If a non-Text node is partially contained in the context object, then
         * throw an "InvalidStateError" DOMException.
         */ for (const node of algorithm_1.range_getPartiallyContainedNodes(this)){
            if (!util_1.Guard.isTextNode(node)) {
                throw new DOMException_1.InvalidStateError();
            }
        }
        /**
         * 2. If newParent is a Document, DocumentType, or DocumentFragment node,
         * then throw an "InvalidNodeTypeError" DOMException.
         */ if (util_1.Guard.isDocumentNode(newParent) || util_1.Guard.isDocumentTypeNode(newParent) || util_1.Guard.isDocumentFragmentNode(newParent)) {
            throw new DOMException_1.InvalidNodeTypeError();
        }
        /**
         * 3. Let fragment be the result of extracting the context object.
         */ const fragment = algorithm_1.range_extract(this);
        /**
         * 4. If newParent has children, then replace all with null within newParent.
         */ if (newParent._children.size !== 0) {
            algorithm_1.mutation_replaceAll(null, newParent);
        }
        /**
         * 5. Insert newParent into the context object.
         * 6. Append fragment to newParent.
         */ algorithm_1.range_insert(newParent, this);
        algorithm_1.mutation_append(fragment, newParent);
        /**
         * 7. Select newParent within the context object.
         */ algorithm_1.range_select(newParent, this);
    }
    /** @inheritdoc */ cloneRange() {
        /**
         * The cloneRange() method, when invoked, must return a new live range with
         * the same start and end as the context object.
         */ return algorithm_1.create_range(this._start, this._end);
    }
    /** @inheritdoc */ detach() {
        /**
         * The detach() method, when invoked, must do nothing.
         *
         * since JS lacks weak references, we still use detach
         */ _1.dom.rangeList.delete(this);
    }
    /** @inheritdoc */ isPointInRange(node, offset) {
        /**
         * 1. If node’s root is different from the context object’s root, return false.
         */ if (algorithm_1.tree_rootNode(node) !== algorithm_1.range_root(this)) {
            return false;
        }
        /**
         * 2. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
         * 3. If offset is greater than node’s length, then throw an
         * "IndexSizeError" DOMException.
         */ if (util_1.Guard.isDocumentTypeNode(node)) throw new DOMException_1.InvalidNodeTypeError();
        if (offset > algorithm_1.tree_nodeLength(node)) throw new DOMException_1.IndexSizeError();
        /**
         * 4. If (node, offset) is before start or after end, return false.
         */ const bp = [
            node,
            offset
        ];
        if (algorithm_1.boundaryPoint_position(bp, this._start) === interfaces_1.BoundaryPosition.Before || algorithm_1.boundaryPoint_position(bp, this._end) === interfaces_1.BoundaryPosition.After) {
            return false;
        }
        /**
         * 5. Return true.
         */ return true;
    }
    /** @inheritdoc */ comparePoint(node, offset) {
        /**
         * 1. If node’s root is different from the context object’s root, then throw
         * a "WrongDocumentError" DOMException.
         * 2. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
         * 3. If offset is greater than node’s length, then throw an
         * "IndexSizeError" DOMException.
         */ if (algorithm_1.tree_rootNode(node) !== algorithm_1.range_root(this)) throw new DOMException_1.WrongDocumentError();
        if (util_1.Guard.isDocumentTypeNode(node)) throw new DOMException_1.InvalidNodeTypeError();
        if (offset > algorithm_1.tree_nodeLength(node)) throw new DOMException_1.IndexSizeError();
        /**
         * 4. If (node, offset) is before start, return −1.
         * 5. If (node, offset) is after end, return 1.
         * 6. Return 0.
         */ const bp = [
            node,
            offset
        ];
        if (algorithm_1.boundaryPoint_position(bp, this._start) === interfaces_1.BoundaryPosition.Before) {
            return -1;
        } else if (algorithm_1.boundaryPoint_position(bp, this._end) === interfaces_1.BoundaryPosition.After) {
            return 1;
        } else {
            return 0;
        }
    }
    /** @inheritdoc */ intersectsNode(node) {
        /**
         * 1. If node’s root is different from the context object’s root, return false.
         */ if (algorithm_1.tree_rootNode(node) !== algorithm_1.range_root(this)) {
            return false;
        }
        /**
         * 2. Let parent be node’s parent.
         * 3. If parent is null, return true.
         */ const parent = node._parent;
        if (parent === null) return true;
        /**
         * 4. Let offset be node’s index.
         */ const offset = algorithm_1.tree_index(node);
        /**
         * 5. If (parent, offset) is before end and (parent, offset plus 1) is
         * after start, return true.
         */ if (algorithm_1.boundaryPoint_position([
            parent,
            offset
        ], this._end) === interfaces_1.BoundaryPosition.Before && algorithm_1.boundaryPoint_position([
            parent,
            offset + 1
        ], this._start) === interfaces_1.BoundaryPosition.After) {
            return true;
        }
        /**
         * 6. Return false.
         */ return false;
    }
    toString() {
        /**
         * 1. Let s be the empty string.
         */ let s = '';
        /**
         * 2. If the context object’s start node is the context object’s end node
         * and it is a Text node, then return the substring of that Text node’s data
         * beginning at the context object’s start offset and ending at the context
         * object’s end offset.
         */ if (this._startNode === this._endNode && util_1.Guard.isTextNode(this._startNode)) {
            return this._startNode._data.substring(this._startOffset, this._endOffset);
        }
        /**
         * 3. If the context object’s start node is a Text node, then append the
         * substring of that node’s data from the context object’s start offset
         * until the end to s.
         */ if (util_1.Guard.isTextNode(this._startNode)) {
            s += this._startNode._data.substring(this._startOffset);
        }
        /**
         * 4. Append the concatenation of the data of all Text nodes that are
         * contained in the context object, in tree order, to s.
         */ for (const child of algorithm_1.range_getContainedNodes(this)){
            if (util_1.Guard.isTextNode(child)) {
                s += child._data;
            }
        }
        /**
         * 5. If the context object’s end node is a Text node, then append the
         * substring of that node’s data from its start until the context object’s
         * end offset to s.
         */ if (util_1.Guard.isTextNode(this._endNode)) {
            s += this._endNode._data.substring(0, this._endOffset);
        }
        /**
         * 6. Return s.
         */ return s;
    }
    /**
     * Creates a new `Range`.
     *
     * @param start - start point
     * @param end - end point
     */ static _create(start, end) {
        const range = new RangeImpl();
        if (start) range._start = start;
        if (end) range._end = end;
        return range;
    }
}
exports.RangeImpl = RangeImpl;
RangeImpl.START_TO_START = 0;
RangeImpl.START_TO_END = 1;
RangeImpl.END_TO_END = 2;
RangeImpl.END_TO_START = 3;
/**
 * Define constants on prototype.
 */ WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "START_TO_START", 0);
WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "START_TO_END", 1);
WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "END_TO_END", 2);
WebIDLAlgorithm_1.idl_defineConst(RangeImpl.prototype, "END_TO_START", 3);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ShadowRootImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const DocumentFragmentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentFragmentImpl.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a shadow root.
 */ class ShadowRootImpl extends DocumentFragmentImpl_1.DocumentFragmentImpl {
    /**
     * Initializes a new instance of `ShadowRoot`.
     *
     * @param host - shadow root's host element
     * @param mode - shadow root's mode
     */ constructor(host, mode){
        super();
        this._host = host;
        this._mode = mode;
    }
    /** @inheritdoc */ get mode() {
        return this._mode;
    }
    /** @inheritdoc */ get host() {
        return this._host;
    }
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */ _getTheParent(event) {
        /**
         * A shadow root’s get the parent algorithm, given an event, returns null
         * if event’s composed flag is unset and shadow root is the root of
         * event’s path’s first struct’s invocation target, and shadow root’s host
         * otherwise.
         */ if (!event._composedFlag && !util_1.isEmpty(event._path) && algorithm_1.tree_rootNode(event._path[0].invocationTarget) === this) {
            return null;
        } else {
            return this._host;
        }
    }
    // MIXIN: DocumentOrShadowRoot
    // No elements
    /**
     * Creates a new `ShadowRoot`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */ static _create(document, host) {
        return new ShadowRootImpl(host, "closed");
    }
}
exports.ShadowRootImpl = ShadowRootImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/SlotableImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */ class SlotableImpl {
    get _name() {
        return this.__name || '';
    }
    set _name(val) {
        this.__name = val;
    }
    get _assignedSlot() {
        return this.__assignedSlot || null;
    }
    set _assignedSlot(val) {
        this.__assignedSlot = val;
    }
    /** @inheritdoc */ get assignedSlot() {
        return algorithm_1.shadowTree_findASlot(this, true);
    }
}
exports.SlotableImpl = SlotableImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/StaticRangeImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const AbstractRangeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbstractRangeImpl.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
/**
 * Represents a static range.
 */ class StaticRangeImpl extends AbstractRangeImpl_1.AbstractRangeImpl {
    /**
     * Initializes a new instance of `StaticRange`.
     */ constructor(init){
        super();
        /**
         * 1. If init’s startContainer or endContainer is a DocumentType or Attr
         * node, then throw an "InvalidNodeTypeError" DOMException.
         * 2. Let staticRange be a new StaticRange object.
         * 3. Set staticRange’s start to (init’s startContainer, init’s startOffset)
         * and end to (init’s endContainer, init’s endOffset).
         * 4. Return staticRange.
         */ if (util_1.Guard.isDocumentTypeNode(init.startContainer) || util_1.Guard.isAttrNode(init.startContainer) || util_1.Guard.isDocumentTypeNode(init.endContainer) || util_1.Guard.isAttrNode(init.endContainer)) {
            throw new DOMException_1.InvalidNodeTypeError();
        }
        this._start = [
            init.startContainer,
            init.startOffset
        ];
        this._end = [
            init.endContainer,
            init.endOffset
        ];
    }
}
exports.StaticRangeImpl = StaticRangeImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TreeWalkerImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const TraverserImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TraverserImpl.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents the nodes of a subtree and a position within them.
 */ class TreeWalkerImpl extends TraverserImpl_1.TraverserImpl {
    /**
     * Initializes a new instance of `TreeWalker`.
     */ constructor(root, current){
        super(root);
        this._current = current;
    }
    /** @inheritdoc */ get currentNode() {
        return this._current;
    }
    set currentNode(value) {
        this._current = value;
    }
    /** @inheritdoc */ parentNode() {
        /**
         * 1. Let node be the context object’s current.
         * 2. While node is non-null and is not the context object’s root:
         */ let node = this._current;
        while(node !== null && node !== this._root){
            /**
             * 2.1. Set node to node’s parent.
             * 2.2. If node is non-null and filtering node within the context object
             * returns FILTER_ACCEPT, then set the context object’s current to node
             * and return node.
             */ node = node._parent;
            if (node !== null && algorithm_1.traversal_filter(this, node) === interfaces_1.FilterResult.Accept) {
                this._current = node;
                return node;
            }
        }
        /**
         * 3. Return null.
         */ return null;
    }
    /** @inheritdoc */ firstChild() {
        /**
         * The firstChild() method, when invoked, must traverse children with the
         * context object and first.
         */ return algorithm_1.treeWalker_traverseChildren(this, true);
    }
    /** @inheritdoc */ lastChild() {
        /**
         * The lastChild() method, when invoked, must traverse children with the
         * context object and last.
         */ return algorithm_1.treeWalker_traverseChildren(this, false);
    }
    /** @inheritdoc */ nextSibling() {
        /**
         * The nextSibling() method, when invoked, must traverse siblings with the
         * context object and next.
         */ return algorithm_1.treeWalker_traverseSiblings(this, true);
    }
    /** @inheritdoc */ previousNode() {
        /**
         * 1. Let node be the context object’s current.
         * 2. While node is not the context object’s root:
         */ let node = this._current;
        while(node !== this._root){
            /**
             * 2.1. Let sibling be node’s previous sibling.
             * 2.2. While sibling is non-null:
             */ let sibling = node._previousSibling;
            while(sibling){
                /**
                 * 2.2.1. Set node to sibling.
                 * 2.2.2. Let result be the result of filtering node within the context
                 * object.
                 */ node = sibling;
                let result = algorithm_1.traversal_filter(this, node);
                /**
                 * 2.2.3. While result is not FILTER_REJECT and node has a child:
                 */ while(result !== interfaces_1.FilterResult.Reject && node._lastChild){
                    /**
                     * 2.2.3.1. Set node to node’s last child.
                     * 2.2.3.2. Set result to the result of filtering node within the
                     * context object.
                     */ node = node._lastChild;
                    result = algorithm_1.traversal_filter(this, node);
                }
                /**
                 * 2.2.4. If result is FILTER_ACCEPT, then set the context object’s
                 * current to node and return node.
                 */ if (result === interfaces_1.FilterResult.Accept) {
                    this._current = node;
                    return node;
                }
                /**
                 * 2.2.5. Set sibling to node’s previous sibling.
                 */ sibling = node._previousSibling;
            }
            /**
             * 2.3. If node is the context object’s root or node’s parent is null,
             * then return null.
             */ if (node === this._root || node._parent === null) {
                return null;
            }
            /**
             * 2.4. Set node to node’s parent.
             */ node = node._parent;
            /**
             * 2.5. If the return value of filtering node within the context object is
             * FILTER_ACCEPT, then set the context object’s current to node and
             * return node.
             */ if (algorithm_1.traversal_filter(this, node) === interfaces_1.FilterResult.Accept) {
                this._current = node;
                return node;
            }
        }
        /**
         * 3. Return null.
         */ return null;
    }
    /** @inheritdoc */ previousSibling() {
        /**
         * The previousSibling() method, when invoked, must traverse siblings with
         * the context object and previous.
         */ return algorithm_1.treeWalker_traverseSiblings(this, false);
    }
    /** @inheritdoc */ nextNode() {
        /**
         * 1. Let node be the context object’s current.
         * 2. Let result be FILTER_ACCEPT.
         * 3. While true:
         */ let node = this._current;
        let result = interfaces_1.FilterResult.Accept;
        while(true){
            /**
             * 3.1. While result is not FILTER_REJECT and node has a child:
             */ while(result !== interfaces_1.FilterResult.Reject && node._firstChild){
                /**
                 * 3.1.1. Set node to its first child.
                 * 3.1.2. Set result to the result of filtering node within the context
                 * object.
                 * 3.1.3. If result is FILTER_ACCEPT, then set the context object’s
                 * current to node and return node.
                 */ node = node._firstChild;
                result = algorithm_1.traversal_filter(this, node);
                if (result === interfaces_1.FilterResult.Accept) {
                    this._current = node;
                    return node;
                }
            }
            /**
             * 3.2. Let sibling be null.
             * 3.3. Let temporary be node.
             * 3.4. While temporary is non-null:
             */ let sibling = null;
            let temporary = node;
            while(temporary !== null){
                /**
                 * 3.4.1. If temporary is the context object’s root, then return null.
                 */ if (temporary === this._root) {
                    return null;
                }
                /**
                 * 3.4.2. Set sibling to temporary’s next sibling.
                 * 3.4.3. If sibling is non-null, then break.
                 */ sibling = temporary._nextSibling;
                if (sibling !== null) {
                    node = sibling;
                    break;
                }
                /**
                 * 3.4.4. Set temporary to temporary’s parent.
                 */ temporary = temporary._parent;
            }
            /**
             * 3.5. Set result to the result of filtering node within the context object.
             * 3.6. If result is FILTER_ACCEPT, then set the context object’s current
             * to node and return node.
             */ result = algorithm_1.traversal_filter(this, node);
            if (result === interfaces_1.FilterResult.Accept) {
                this._current = node;
                return node;
            }
        }
    }
    /**
     * Creates a new `TreeWalker`.
     *
     * @param root - iterator's root node
     * @param current - current node
     */ static _create(root, current) {
        return new TreeWalkerImpl(root, current);
    }
}
exports.TreeWalkerImpl = TreeWalkerImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/WindowImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const EventTargetImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventTargetImpl.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents a window containing a DOM document.
 */ class WindowImpl extends EventTargetImpl_1.EventTargetImpl {
    /**
     * Initializes a new instance of `Window`.
     */ constructor(){
        super();
        this._signalSlots = new Set();
        this._mutationObserverMicrotaskQueued = false;
        this._mutationObservers = new Set();
        this._iteratorList = new util_1.FixedSizeSet();
        this._associatedDocument = algorithm_1.create_document();
    }
    /** @inheritdoc */ get document() {
        return this._associatedDocument;
    }
    /** @inheritdoc */ get event() {
        return this._currentEvent;
    }
    /**
     * Creates a new window with a blank document.
     */ static _create() {
        return new WindowImpl();
    }
}
exports.WindowImpl = WindowImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/XMLDocumentImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const DocumentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentImpl.js [app-route] (ecmascript)");
/**
 * Represents an XML document.
 */ class XMLDocumentImpl extends DocumentImpl_1.DocumentImpl {
    /**
     * Initializes a new instance of `XMLDocument`.
     */ constructor(){
        super();
    }
}
exports.XMLDocumentImpl = XMLDocumentImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
// Import implementation classes
const AbortControllerImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbortControllerImpl.js [app-route] (ecmascript)");
exports.AbortController = AbortControllerImpl_1.AbortControllerImpl;
const AbortSignalImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbortSignalImpl.js [app-route] (ecmascript)");
exports.AbortSignal = AbortSignalImpl_1.AbortSignalImpl;
const AbstractRangeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbstractRangeImpl.js [app-route] (ecmascript)");
exports.AbstractRange = AbstractRangeImpl_1.AbstractRangeImpl;
const AttrImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AttrImpl.js [app-route] (ecmascript)");
exports.Attr = AttrImpl_1.AttrImpl;
const CDATASectionImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CDATASectionImpl.js [app-route] (ecmascript)");
exports.CDATASection = CDATASectionImpl_1.CDATASectionImpl;
const CharacterDataImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CharacterDataImpl.js [app-route] (ecmascript)");
exports.CharacterData = CharacterDataImpl_1.CharacterDataImpl;
const ChildNodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ChildNodeImpl.js [app-route] (ecmascript)");
const CommentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CommentImpl.js [app-route] (ecmascript)");
exports.Comment = CommentImpl_1.CommentImpl;
const CustomEventImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CustomEventImpl.js [app-route] (ecmascript)");
exports.CustomEvent = CustomEventImpl_1.CustomEventImpl;
const DocumentFragmentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentFragmentImpl.js [app-route] (ecmascript)");
exports.DocumentFragment = DocumentFragmentImpl_1.DocumentFragmentImpl;
const DocumentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentImpl.js [app-route] (ecmascript)");
exports.Document = DocumentImpl_1.DocumentImpl;
const DocumentOrShadowRootImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentOrShadowRootImpl.js [app-route] (ecmascript)");
const DocumentTypeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentTypeImpl.js [app-route] (ecmascript)");
exports.DocumentType = DocumentTypeImpl_1.DocumentTypeImpl;
const DOMImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMImpl.js [app-route] (ecmascript)");
exports.dom = DOMImpl_1.dom;
const DOMImplementationImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMImplementationImpl.js [app-route] (ecmascript)");
exports.DOMImplementation = DOMImplementationImpl_1.DOMImplementationImpl;
const DOMTokenListImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMTokenListImpl.js [app-route] (ecmascript)");
exports.DOMTokenList = DOMTokenListImpl_1.DOMTokenListImpl;
const ElementImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ElementImpl.js [app-route] (ecmascript)");
exports.Element = ElementImpl_1.ElementImpl;
const EventImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventImpl.js [app-route] (ecmascript)");
exports.Event = EventImpl_1.EventImpl;
const EventTargetImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventTargetImpl.js [app-route] (ecmascript)");
exports.EventTarget = EventTargetImpl_1.EventTargetImpl;
const HTMLCollectionImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/HTMLCollectionImpl.js [app-route] (ecmascript)");
exports.HTMLCollection = HTMLCollectionImpl_1.HTMLCollectionImpl;
const MutationObserverImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/MutationObserverImpl.js [app-route] (ecmascript)");
exports.MutationObserver = MutationObserverImpl_1.MutationObserverImpl;
const MutationRecordImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/MutationRecordImpl.js [app-route] (ecmascript)");
exports.MutationRecord = MutationRecordImpl_1.MutationRecordImpl;
const NamedNodeMapImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NamedNodeMapImpl.js [app-route] (ecmascript)");
exports.NamedNodeMap = NamedNodeMapImpl_1.NamedNodeMapImpl;
const NodeFilterImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeFilterImpl.js [app-route] (ecmascript)");
exports.NodeFilter = NodeFilterImpl_1.NodeFilterImpl;
const NodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeImpl.js [app-route] (ecmascript)");
exports.Node = NodeImpl_1.NodeImpl;
const NodeIteratorImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeIteratorImpl.js [app-route] (ecmascript)");
exports.NodeIterator = NodeIteratorImpl_1.NodeIteratorImpl;
const NodeListImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeListImpl.js [app-route] (ecmascript)");
exports.NodeList = NodeListImpl_1.NodeListImpl;
const NodeListStaticImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeListStaticImpl.js [app-route] (ecmascript)");
exports.NodeListStatic = NodeListStaticImpl_1.NodeListStaticImpl;
const NonDocumentTypeChildNodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NonDocumentTypeChildNodeImpl.js [app-route] (ecmascript)");
const NonElementParentNodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NonElementParentNodeImpl.js [app-route] (ecmascript)");
const ParentNodeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ParentNodeImpl.js [app-route] (ecmascript)");
const ProcessingInstructionImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ProcessingInstructionImpl.js [app-route] (ecmascript)");
exports.ProcessingInstruction = ProcessingInstructionImpl_1.ProcessingInstructionImpl;
const RangeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/RangeImpl.js [app-route] (ecmascript)");
exports.Range = RangeImpl_1.RangeImpl;
const ShadowRootImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ShadowRootImpl.js [app-route] (ecmascript)");
exports.ShadowRoot = ShadowRootImpl_1.ShadowRootImpl;
const SlotableImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/SlotableImpl.js [app-route] (ecmascript)");
const StaticRangeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/StaticRangeImpl.js [app-route] (ecmascript)");
exports.StaticRange = StaticRangeImpl_1.StaticRangeImpl;
const TextImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TextImpl.js [app-route] (ecmascript)");
exports.Text = TextImpl_1.TextImpl;
const TraverserImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TraverserImpl.js [app-route] (ecmascript)");
exports.Traverser = TraverserImpl_1.TraverserImpl;
const TreeWalkerImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TreeWalkerImpl.js [app-route] (ecmascript)");
exports.TreeWalker = TreeWalkerImpl_1.TreeWalkerImpl;
const WindowImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/WindowImpl.js [app-route] (ecmascript)");
exports.Window = WindowImpl_1.WindowImpl;
const XMLDocumentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/XMLDocumentImpl.js [app-route] (ecmascript)");
exports.XMLDocument = XMLDocumentImpl_1.XMLDocumentImpl;
// Apply mixins
// ChildNode
util_1.applyMixin(ElementImpl_1.ElementImpl, ChildNodeImpl_1.ChildNodeImpl);
util_1.applyMixin(CharacterDataImpl_1.CharacterDataImpl, ChildNodeImpl_1.ChildNodeImpl);
util_1.applyMixin(DocumentTypeImpl_1.DocumentTypeImpl, ChildNodeImpl_1.ChildNodeImpl);
// DocumentOrShadowRoot
util_1.applyMixin(DocumentImpl_1.DocumentImpl, DocumentOrShadowRootImpl_1.DocumentOrShadowRootImpl);
util_1.applyMixin(ShadowRootImpl_1.ShadowRootImpl, DocumentOrShadowRootImpl_1.DocumentOrShadowRootImpl);
// NonDocumentTypeChildNode
util_1.applyMixin(ElementImpl_1.ElementImpl, NonDocumentTypeChildNodeImpl_1.NonDocumentTypeChildNodeImpl);
util_1.applyMixin(CharacterDataImpl_1.CharacterDataImpl, NonDocumentTypeChildNodeImpl_1.NonDocumentTypeChildNodeImpl);
// NonElementParentNode
util_1.applyMixin(DocumentImpl_1.DocumentImpl, NonElementParentNodeImpl_1.NonElementParentNodeImpl);
util_1.applyMixin(DocumentFragmentImpl_1.DocumentFragmentImpl, NonElementParentNodeImpl_1.NonElementParentNodeImpl);
// ParentNode
util_1.applyMixin(DocumentImpl_1.DocumentImpl, ParentNodeImpl_1.ParentNodeImpl);
util_1.applyMixin(DocumentFragmentImpl_1.DocumentFragmentImpl, ParentNodeImpl_1.ParentNodeImpl);
util_1.applyMixin(ElementImpl_1.ElementImpl, ParentNodeImpl_1.ParentNodeImpl);
// Slotable
util_1.applyMixin(TextImpl_1.TextImpl, SlotableImpl_1.SlotableImpl);
util_1.applyMixin(ElementImpl_1.ElementImpl, SlotableImpl_1.SlotableImpl);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
/**
 * Gets the next descendant of the given node of the tree rooted at `root`
 * in depth-first pre-order.
 *
 * @param root - root node of the tree
 * @param node - a node
 * @param shadow - whether to visit shadow tree nodes
 */ function _getNextDescendantNode(root, node, shadow = false) {
    // traverse shadow tree
    if (shadow && util_1.Guard.isElementNode(node) && util_1.Guard.isShadowRoot(node.shadowRoot)) {
        if (node.shadowRoot._firstChild) return node.shadowRoot._firstChild;
    }
    // traverse child nodes
    if (node._firstChild) return node._firstChild;
    if (node === root) return null;
    // traverse siblings
    if (node._nextSibling) return node._nextSibling;
    // traverse parent's next sibling
    let parent = node._parent;
    while(parent && parent !== root){
        if (parent._nextSibling) return parent._nextSibling;
        parent = parent._parent;
    }
    return null;
}
function _emptyIterator() {
    return {
        [Symbol.iterator]: ()=>{
            return {
                next: ()=>{
                    return {
                        done: true,
                        value: null
                    };
                }
            };
        }
    };
}
/**
 * Returns the first descendant node of the tree rooted at `node` in
 * depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */ function tree_getFirstDescendantNode(node, self = false, shadow = false, filter) {
    let firstNode = self ? node : _getNextDescendantNode(node, node, shadow);
    while(firstNode && filter && !filter(firstNode)){
        firstNode = _getNextDescendantNode(node, firstNode, shadow);
    }
    return firstNode;
}
exports.tree_getFirstDescendantNode = tree_getFirstDescendantNode;
/**
 * Returns the next descendant node of the tree rooted at `node` in
 * depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param currentNode - current descendant node
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */ function tree_getNextDescendantNode(node, currentNode, self = false, shadow = false, filter) {
    let nextNode = _getNextDescendantNode(node, currentNode, shadow);
    while(nextNode && filter && !filter(nextNode)){
        nextNode = _getNextDescendantNode(node, nextNode, shadow);
    }
    return nextNode;
}
exports.tree_getNextDescendantNode = tree_getNextDescendantNode;
/**
 * Traverses through all descendant nodes of the tree rooted at
 * `node` in depth-first pre-order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */ function tree_getDescendantNodes(node, self = false, shadow = false, filter) {
    if (!self && node._children.size === 0) {
        return _emptyIterator();
    }
    return {
        [Symbol.iterator]: ()=>{
            let currentNode = self ? node : _getNextDescendantNode(node, node, shadow);
            return {
                next: ()=>{
                    while(currentNode && filter && !filter(currentNode)){
                        currentNode = _getNextDescendantNode(node, currentNode, shadow);
                    }
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        currentNode = _getNextDescendantNode(node, currentNode, shadow);
                        return result;
                    }
                }
            };
        }
    };
}
exports.tree_getDescendantNodes = tree_getDescendantNodes;
/**
 * Traverses through all descendant element nodes of the tree rooted at
 * `node` in depth-first preorder.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */ function tree_getDescendantElements(node, self = false, shadow = false, filter) {
    if (!self && node._children.size === 0) {
        return _emptyIterator();
    }
    return {
        [Symbol.iterator]: ()=>{
            const it = tree_getDescendantNodes(node, self, shadow, (e)=>util_1.Guard.isElementNode(e))[Symbol.iterator]();
            let currentNode = it.next().value;
            return {
                next () {
                    while(currentNode && filter && !filter(currentNode)){
                        currentNode = it.next().value;
                    }
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        currentNode = it.next().value;
                        return result;
                    }
                }
            };
        }
    };
}
exports.tree_getDescendantElements = tree_getDescendantElements;
/**
 * Traverses through all sibling nodes of `node`.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */ function tree_getSiblingNodes(node, self = false, filter) {
    if (!node._parent || node._parent._children.size === 0) {
        return _emptyIterator();
    }
    return {
        [Symbol.iterator] () {
            let currentNode = node._parent ? node._parent._firstChild : null;
            return {
                next () {
                    while(currentNode && (filter && !filter(currentNode) || !self && currentNode === node)){
                        currentNode = currentNode._nextSibling;
                    }
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        currentNode = currentNode._nextSibling;
                        return result;
                    }
                }
            };
        }
    };
}
exports.tree_getSiblingNodes = tree_getSiblingNodes;
/**
 * Gets the first ancestor of `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */ function tree_getFirstAncestorNode(node, self = false, filter) {
    let firstNode = self ? node : node._parent;
    while(firstNode && filter && !filter(firstNode)){
        firstNode = firstNode._parent;
    }
    return firstNode;
}
exports.tree_getFirstAncestorNode = tree_getFirstAncestorNode;
/**
 * Gets the first ancestor of `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */ function tree_getNextAncestorNode(node, currentNode, self = false, filter) {
    let nextNode = currentNode._parent;
    while(nextNode && filter && !filter(nextNode)){
        nextNode = nextNode._parent;
    }
    return nextNode;
}
exports.tree_getNextAncestorNode = tree_getNextAncestorNode;
/**
 * Traverses through all ancestor nodes `node` in reverse tree order.
 *
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */ function tree_getAncestorNodes(node, self = false, filter) {
    if (!self && !node._parent) {
        return _emptyIterator();
    }
    return {
        [Symbol.iterator] () {
            let currentNode = tree_getFirstAncestorNode(node, self, filter);
            return {
                next () {
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        currentNode = tree_getNextAncestorNode(node, currentNode, self, filter);
                        return result;
                    }
                }
            };
        }
    };
}
exports.tree_getAncestorNodes = tree_getAncestorNodes;
/**
 * Returns the common ancestor of the given nodes.
 *
 * @param nodeA - a node
 * @param nodeB - a node
 */ function tree_getCommonAncestor(nodeA, nodeB) {
    if (nodeA === nodeB) {
        return nodeA._parent;
    }
    // lists of parent nodes
    const parentsA = [];
    const parentsB = [];
    let pA = tree_getFirstAncestorNode(nodeA, true);
    while(pA !== null){
        parentsA.push(pA);
        pA = tree_getNextAncestorNode(nodeA, pA, true);
    }
    let pB = tree_getFirstAncestorNode(nodeB, true);
    while(pB !== null){
        parentsB.push(pB);
        pB = tree_getNextAncestorNode(nodeB, pB, true);
    }
    // walk through parents backwards until they differ
    let pos1 = parentsA.length;
    let pos2 = parentsB.length;
    let parent = null;
    for(let i = Math.min(pos1, pos2); i > 0; i--){
        const parent1 = parentsA[--pos1];
        const parent2 = parentsB[--pos2];
        if (parent1 !== parent2) {
            break;
        }
        parent = parent1;
    }
    return parent;
}
exports.tree_getCommonAncestor = tree_getCommonAncestor;
/**
 * Returns the node following `node` in depth-first preorder.
 *
 * @param root - root of the subtree
 * @param node - a node
 */ function tree_getFollowingNode(root, node) {
    if (node._firstChild) {
        return node._firstChild;
    } else if (node._nextSibling) {
        return node._nextSibling;
    } else {
        while(true){
            const parent = node._parent;
            if (parent === null || parent === root) {
                return null;
            } else if (parent._nextSibling) {
                return parent._nextSibling;
            } else {
                node = parent;
            }
        }
    }
}
exports.tree_getFollowingNode = tree_getFollowingNode;
/**
 * Returns the node preceding `node` in depth-first preorder.
 *
 * @param root - root of the subtree
 * @param node - a node
 */ function tree_getPrecedingNode(root, node) {
    if (node === root) {
        return null;
    }
    if (node._previousSibling) {
        node = node._previousSibling;
        if (node._lastChild) {
            return node._lastChild;
        } else {
            return node;
        }
    } else {
        return node._parent;
    }
}
exports.tree_getPrecedingNode = tree_getPrecedingNode;
/**
 * Determines if the node tree is constrained. A node tree is
 * constrained as follows, expressed as a relationship between the
 * type of node and its allowed children:
 *  - Document (In tree order)
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *    * Optionally one DocumentType node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *    * Optionally one Element node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *  - DocumentFragment, Element
 *    * Zero or more nodes each of which is Element, Text,
 *      ProcessingInstruction, or Comment.
 *  - DocumentType, Text, ProcessingInstruction, Comment
 *    * None.
 *
 * @param node - the root of the tree
 */ function tree_isConstrained(node) {
    switch(node._nodeType){
        case interfaces_1.NodeType.Document:
            let hasDocType = false;
            let hasElement = false;
            for (const childNode of node._children){
                switch(childNode._nodeType){
                    case interfaces_1.NodeType.ProcessingInstruction:
                    case interfaces_1.NodeType.Comment:
                        break;
                    case interfaces_1.NodeType.DocumentType:
                        if (hasDocType || hasElement) return false;
                        hasDocType = true;
                        break;
                    case interfaces_1.NodeType.Element:
                        if (hasElement) return false;
                        hasElement = true;
                        break;
                    default:
                        return false;
                }
            }
            break;
        case interfaces_1.NodeType.DocumentFragment:
        case interfaces_1.NodeType.Element:
            for (const childNode of node._children){
                switch(childNode._nodeType){
                    case interfaces_1.NodeType.Element:
                    case interfaces_1.NodeType.Text:
                    case interfaces_1.NodeType.ProcessingInstruction:
                    case interfaces_1.NodeType.CData:
                    case interfaces_1.NodeType.Comment:
                        break;
                    default:
                        return false;
                }
            }
            break;
        case interfaces_1.NodeType.DocumentType:
        case interfaces_1.NodeType.Text:
        case interfaces_1.NodeType.ProcessingInstruction:
        case interfaces_1.NodeType.CData:
        case interfaces_1.NodeType.Comment:
            return !node.hasChildNodes();
    }
    for (const childNode of node._children){
        // recursively check child nodes
        if (!tree_isConstrained(childNode)) return false;
    }
    return true;
}
exports.tree_isConstrained = tree_isConstrained;
/**
 * Returns the length of a node.
 *
 * @param node - a node to check
 */ function tree_nodeLength(node) {
    /**
        * To determine the length of a node node, switch on node:
        * - DocumentType
        * Zero.
        * - Text
        * - ProcessingInstruction
        * - Comment
        * Its data’s length.
        * - Any other node
        * Its number of children.
        */ if (util_1.Guard.isDocumentTypeNode(node)) {
        return 0;
    } else if (util_1.Guard.isCharacterDataNode(node)) {
        return node._data.length;
    } else {
        return node._children.size;
    }
}
exports.tree_nodeLength = tree_nodeLength;
/**
 * Determines if a node is empty.
 *
 * @param node - a node to check
 */ function tree_isEmpty(node) {
    /**
        * A node is considered empty if its length is zero.
        */ return tree_nodeLength(node) === 0;
}
exports.tree_isEmpty = tree_isEmpty;
/**
 * Returns the root node of a tree. The root of an object is itself,
 * if its parent is `null`, or else it is the root of its parent.
 * The root of a tree is any object participating in that tree
 * whose parent is `null`.
 *
 * @param node - a node of the tree
 * @param shadow - `true` to return shadow-including root, otherwise
 * `false`
 */ function tree_rootNode(node, shadow = false) {
    /**
        * The root of an object is itself, if its parent is null, or else it is the
        * root of its parent. The root of a tree is any object participating in
        * that tree whose parent is null.
        */ if (shadow) {
        const root = tree_rootNode(node, false);
        if (util_1.Guard.isShadowRoot(root)) return tree_rootNode(root._host, true);
        else return root;
    } else {
        if (!node._parent) return node;
        else return tree_rootNode(node._parent);
    }
}
exports.tree_rootNode = tree_rootNode;
/**
 * Determines whether `other` is a descendant of `node`. An object
 * A is called a descendant of an object B, if either A is a child
 * of B or A is a child of an object C that is a descendant of B.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the
 * node's and its descendant's shadow trees as well.
 */ function tree_isDescendantOf(node, other, self = false, shadow = false) {
    /**
        * An object A is called a descendant of an object B, if either A is a
        * child of B or A is a child of an object C that is a descendant of B.
        *
        * An inclusive descendant is an object or one of its descendants.
    */ let child = tree_getFirstDescendantNode(node, self, shadow);
    while(child !== null){
        if (child === other) {
            return true;
        }
        child = tree_getNextDescendantNode(node, child, self, shadow);
    }
    return false;
}
exports.tree_isDescendantOf = tree_isDescendantOf;
/**
 * Determines whether `other` is an ancestor of `node`. An object A
 * is called an ancestor of an object B if and only if B is a
 * descendant of A.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the
 * node's and its descendant's shadow trees as well.
 */ function tree_isAncestorOf(node, other, self = false, shadow = false) {
    let ancestor = self ? node : shadow && util_1.Guard.isShadowRoot(node) ? node._host : node._parent;
    while(ancestor !== null){
        if (ancestor === other) return true;
        ancestor = shadow && util_1.Guard.isShadowRoot(ancestor) ? ancestor._host : ancestor._parent;
    }
    return false;
}
exports.tree_isAncestorOf = tree_isAncestorOf;
/**
 * Determines whether `other` is a host-including ancestor of `node`. An
 * object A is a host-including inclusive ancestor of an object B, if either
 * A is an inclusive ancestor of B, or if B’s root has a non-null host and
 * A is a host-including inclusive ancestor of B’s root’s host.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 */ function tree_isHostIncludingAncestorOf(node, other, self = false) {
    if (tree_isAncestorOf(node, other, self)) return true;
    const root = tree_rootNode(node);
    if (util_1.Guard.isDocumentFragmentNode(root) && root._host !== null && tree_isHostIncludingAncestorOf(root._host, other, self)) return true;
    return false;
}
exports.tree_isHostIncludingAncestorOf = tree_isHostIncludingAncestorOf;
/**
 * Determines whether `other` is a sibling of `node`. An object A is
 * called a sibling of an object B, if and only if B and A share
 * the same non-null parent.
 *
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 */ function tree_isSiblingOf(node, other, self = false) {
    /**
        * An object A is called a sibling of an object B, if and only if B and A
        * share the same non-null parent.
        *
        * An inclusive sibling is an object or one of its siblings.
        */ if (node === other) {
        if (self) return true;
    } else {
        return node._parent !== null && node._parent === other._parent;
    }
    return false;
}
exports.tree_isSiblingOf = tree_isSiblingOf;
/**
 * Determines whether `other` is preceding `node`. An object A is
 * preceding an object B if A and B are in the same tree and A comes
 * before B in tree order.
 *
 * @param node - a node
 * @param other - the node to check
 */ function tree_isPreceding(node, other) {
    /**
        * An object A is preceding an object B if A and B are in the same tree and
        * A comes before B in tree order.
        */ const nodePos = tree_treePosition(node);
    const otherPos = tree_treePosition(other);
    if (nodePos === -1 || otherPos === -1) return false;
    else if (tree_rootNode(node) !== tree_rootNode(other)) return false;
    else return otherPos < nodePos;
}
exports.tree_isPreceding = tree_isPreceding;
/**
 * Determines whether `other` is following `node`. An object A is
 * following an object B if A and B are in the same tree and A comes
 * after B in tree order.
 *
 * @param node - a node
 * @param other - the node to check
 */ function tree_isFollowing(node, other) {
    /**
        * An object A is following an object B if A and B are in the same tree and
        * A comes after B in tree order.
        */ const nodePos = tree_treePosition(node);
    const otherPos = tree_treePosition(other);
    if (nodePos === -1 || otherPos === -1) return false;
    else if (tree_rootNode(node) !== tree_rootNode(other)) return false;
    else return otherPos > nodePos;
}
exports.tree_isFollowing = tree_isFollowing;
/**
 * Determines whether `other` is the parent node of `node`.
 *
 * @param node - a node
 * @param other - the node to check
 */ function tree_isParentOf(node, other) {
    /**
        * An object that participates in a tree has a parent, which is either
        * null or an object, and has children, which is an ordered set of objects.
        * An object A whose parent is object B is a child of B.
        */ return node._parent === other;
}
exports.tree_isParentOf = tree_isParentOf;
/**
 * Determines whether `other` is a child node of `node`.
 *
 * @param node - a node
 * @param other - the node to check
 */ function tree_isChildOf(node, other) {
    /**
        * An object that participates in a tree has a parent, which is either
        * null or an object, and has children, which is an ordered set of objects.
        * An object A whose parent is object B is a child of B.
        */ return other._parent === node;
}
exports.tree_isChildOf = tree_isChildOf;
/**
 * Returns the previous sibling node of `node` or null if it has no
 * preceding sibling.
 *
 * @param node
 */ function tree_previousSibling(node) {
    /**
        * The previous sibling of an object is its first preceding sibling or null
        * if it has no preceding sibling.
        */ return node._previousSibling;
}
exports.tree_previousSibling = tree_previousSibling;
/**
 * Returns the next sibling node of `node` or null if it has no
 * following sibling.
 *
 * @param node
 */ function tree_nextSibling(node) {
    /**
        * The next sibling of an object is its first following sibling or null
        * if it has no following sibling.
        */ return node._nextSibling;
}
exports.tree_nextSibling = tree_nextSibling;
/**
 * Returns the first child node of `node` or null if it has no
 * children.
 *
 * @param node
 */ function tree_firstChild(node) {
    /**
        * The first child of an object is its first child or null if it has no
        * children.
        */ return node._firstChild;
}
exports.tree_firstChild = tree_firstChild;
/**
 * Returns the last child node of `node` or null if it has no
 * children.
 *
 * @param node
 */ function tree_lastChild(node) {
    /**
        * The last child of an object is its last child or null if it has no
        * children.
        */ return node._lastChild;
}
exports.tree_lastChild = tree_lastChild;
/**
 * Returns the zero-based index of `node` when counted preorder in
 * the tree rooted at `root`. Returns `-1` if `node` is not in
 * the tree.
 *
 * @param node - the node to get the index of
 */ function tree_treePosition(node) {
    const root = tree_rootNode(node);
    let pos = 0;
    let childNode = tree_getFirstDescendantNode(root);
    while(childNode !== null){
        pos++;
        if (childNode === node) return pos;
        childNode = tree_getNextDescendantNode(root, childNode);
    }
    return -1;
}
exports.tree_treePosition = tree_treePosition;
/**
 * Determines the index of `node`. The index of an object is its number of
 * preceding siblings, or 0 if it has none.
 *
 * @param node - a node
 * @param other - the node to check
 */ function tree_index(node) {
    /**
        * The index of an object is its number of preceding siblings, or 0 if it
        * has none.
        */ let n = 0;
    while(node._previousSibling !== null){
        n++;
        node = node._previousSibling;
    }
    return n;
}
exports.tree_index = tree_index;
/**
 * Retargets an object against another object.
 *
 * @param a - an object to retarget
 * @param b - an object to retarget against
 */ function tree_retarget(a, b) {
    /**
        * To retarget an object A against an object B, repeat these steps until
        * they return an object:
        * 1. If one of the following is true
        * - A is not a node
        * - A's root is not a shadow root
        * - B is a node and A's root is a shadow-including inclusive ancestor
        * of B
        * then return A.
        * 2. Set A to A's root's host.
        */ while(true){
        if (!a || !util_1.Guard.isNode(a)) {
            return a;
        }
        const rootOfA = tree_rootNode(a);
        if (!util_1.Guard.isShadowRoot(rootOfA)) {
            return a;
        }
        if (b && util_1.Guard.isNode(b) && tree_isAncestorOf(rootOfA, b, true, true)) {
            return a;
        }
        a = rootOfA.host;
    }
}
exports.tree_retarget = tree_retarget;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const DOMImplementationImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMImplementationImpl.js [app-route] (ecmascript)");
const WindowImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/WindowImpl.js [app-route] (ecmascript)");
const XMLDocumentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/XMLDocumentImpl.js [app-route] (ecmascript)");
const DocumentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentImpl.js [app-route] (ecmascript)");
const AbortControllerImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbortControllerImpl.js [app-route] (ecmascript)");
const AbortSignalImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AbortSignalImpl.js [app-route] (ecmascript)");
const DocumentTypeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentTypeImpl.js [app-route] (ecmascript)");
const ElementImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ElementImpl.js [app-route] (ecmascript)");
const DocumentFragmentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DocumentFragmentImpl.js [app-route] (ecmascript)");
const ShadowRootImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ShadowRootImpl.js [app-route] (ecmascript)");
const AttrImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/AttrImpl.js [app-route] (ecmascript)");
const TextImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TextImpl.js [app-route] (ecmascript)");
const CDATASectionImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CDATASectionImpl.js [app-route] (ecmascript)");
const CommentImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CommentImpl.js [app-route] (ecmascript)");
const ProcessingInstructionImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ProcessingInstructionImpl.js [app-route] (ecmascript)");
const HTMLCollectionImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/HTMLCollectionImpl.js [app-route] (ecmascript)");
const NodeListImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeListImpl.js [app-route] (ecmascript)");
const NodeListStaticImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeListStaticImpl.js [app-route] (ecmascript)");
const NamedNodeMapImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NamedNodeMapImpl.js [app-route] (ecmascript)");
const RangeImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/RangeImpl.js [app-route] (ecmascript)");
const NodeIteratorImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeIteratorImpl.js [app-route] (ecmascript)");
const TreeWalkerImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/TreeWalkerImpl.js [app-route] (ecmascript)");
const NodeFilterImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/NodeFilterImpl.js [app-route] (ecmascript)");
const MutationRecordImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/MutationRecordImpl.js [app-route] (ecmascript)");
const DOMTokenListImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMTokenListImpl.js [app-route] (ecmascript)");
/**
 * Creates a `DOMImplementation`.
 *
 * @param document - associated document
 */ function create_domImplementation(document) {
    return DOMImplementationImpl_1.DOMImplementationImpl._create(document);
}
exports.create_domImplementation = create_domImplementation;
/**
 * Creates a `Window` node.
 */ function create_window() {
    return WindowImpl_1.WindowImpl._create();
}
exports.create_window = create_window;
/**
 * Creates an `XMLDocument` node.
 */ function create_xmlDocument() {
    return new XMLDocumentImpl_1.XMLDocumentImpl();
}
exports.create_xmlDocument = create_xmlDocument;
/**
 * Creates a `Document` node.
 */ function create_document() {
    return new DocumentImpl_1.DocumentImpl();
}
exports.create_document = create_document;
/**
 * Creates an `AbortController`.
 */ function create_abortController() {
    return new AbortControllerImpl_1.AbortControllerImpl();
}
exports.create_abortController = create_abortController;
/**
 * Creates an `AbortSignal`.
 */ function create_abortSignal() {
    return AbortSignalImpl_1.AbortSignalImpl._create();
}
exports.create_abortSignal = create_abortSignal;
/**
 * Creates a `DocumentType` node.
 *
 * @param document - owner document
 * @param name - name of the node
 * @param publicId - `PUBLIC` identifier
 * @param systemId - `SYSTEM` identifier
 */ function create_documentType(document, name, publicId, systemId) {
    return DocumentTypeImpl_1.DocumentTypeImpl._create(document, name, publicId, systemId);
}
exports.create_documentType = create_documentType;
/**
 * Creates a new `Element` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */ function create_element(document, localName, namespace, prefix) {
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
exports.create_element = create_element;
/**
 * Creates a new `HTMLElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */ function create_htmlElement(document, localName, namespace, prefix) {
    // TODO: Implement in HTML DOM
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
exports.create_htmlElement = create_htmlElement;
/**
 * Creates a new `HTMLUnknownElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */ function create_htmlUnknownElement(document, localName, namespace, prefix) {
    // TODO: Implement in HTML DOM
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
exports.create_htmlUnknownElement = create_htmlUnknownElement;
/**
 * Creates a new `DocumentFragment` node.
 *
 * @param document - owner document
 */ function create_documentFragment(document) {
    return DocumentFragmentImpl_1.DocumentFragmentImpl._create(document);
}
exports.create_documentFragment = create_documentFragment;
/**
 * Creates a new `ShadowRoot` node.
 *
 * @param document - owner document
 * @param host - shadow root's host element node
 */ function create_shadowRoot(document, host) {
    return ShadowRootImpl_1.ShadowRootImpl._create(document, host);
}
exports.create_shadowRoot = create_shadowRoot;
/**
 * Creates a new `Attr` node.
 *
 * @param document - owner document
 * @param localName - local name
 */ function create_attr(document, localName) {
    return AttrImpl_1.AttrImpl._create(document, localName);
}
exports.create_attr = create_attr;
/**
 * Creates a new `Text` node.
 *
 * @param document - owner document
 * @param data - node contents
 */ function create_text(document, data) {
    return TextImpl_1.TextImpl._create(document, data);
}
exports.create_text = create_text;
/**
 * Creates a new `CDATASection` node.
 *
 * @param document - owner document
 * @param data - node contents
 */ function create_cdataSection(document, data) {
    return CDATASectionImpl_1.CDATASectionImpl._create(document, data);
}
exports.create_cdataSection = create_cdataSection;
/**
 * Creates a new `Comment` node.
 *
 * @param document - owner document
 * @param data - node contents
 */ function create_comment(document, data) {
    return CommentImpl_1.CommentImpl._create(document, data);
}
exports.create_comment = create_comment;
/**
 * Creates a new `ProcessingInstruction` node.
 *
 * @param document - owner document
 * @param target - instruction target
 * @param data - node contents
 */ function create_processingInstruction(document, target, data) {
    return ProcessingInstructionImpl_1.ProcessingInstructionImpl._create(document, target, data);
}
exports.create_processingInstruction = create_processingInstruction;
/**
 * Creates a new `HTMLCollection`.
 *
 * @param root - root node
 * @param filter - node filter
 */ function create_htmlCollection(root, filter = ()=>true) {
    return HTMLCollectionImpl_1.HTMLCollectionImpl._create(root, filter);
}
exports.create_htmlCollection = create_htmlCollection;
/**
 * Creates a new live `NodeList`.
 *
 * @param root - root node
 */ function create_nodeList(root) {
    return NodeListImpl_1.NodeListImpl._create(root);
}
exports.create_nodeList = create_nodeList;
/**
 * Creates a new static `NodeList`.
 *
 * @param root - root node
 * @param items - a list of items to initialize the list
 */ function create_nodeListStatic(root, items) {
    return NodeListStaticImpl_1.NodeListStaticImpl._create(root, items);
}
exports.create_nodeListStatic = create_nodeListStatic;
/**
 * Creates a new `NamedNodeMap`.
 *
 * @param element - parent element
 */ function create_namedNodeMap(element) {
    return NamedNodeMapImpl_1.NamedNodeMapImpl._create(element);
}
exports.create_namedNodeMap = create_namedNodeMap;
/**
 * Creates a new `Range`.
 *
 * @param start - start point
 * @param end - end point
 */ function create_range(start, end) {
    return RangeImpl_1.RangeImpl._create(start, end);
}
exports.create_range = create_range;
/**
 * Creates a new `NodeIterator`.
 *
 * @param root - iterator's root node
 * @param reference - reference node
 * @param pointerBeforeReference - whether the iterator is before or after the
 * reference node
 */ function create_nodeIterator(root, reference, pointerBeforeReference) {
    return NodeIteratorImpl_1.NodeIteratorImpl._create(root, reference, pointerBeforeReference);
}
exports.create_nodeIterator = create_nodeIterator;
/**
 * Creates a new `TreeWalker`.
 *
 * @param root - iterator's root node
 * @param current - current node
 */ function create_treeWalker(root, current) {
    return TreeWalkerImpl_1.TreeWalkerImpl._create(root, current);
}
exports.create_treeWalker = create_treeWalker;
/**
 * Creates a new `NodeFilter`.
 */ function create_nodeFilter() {
    return NodeFilterImpl_1.NodeFilterImpl._create();
}
exports.create_nodeFilter = create_nodeFilter;
/**
 * Creates a new `MutationRecord`.
 *
 * @param type - type of mutation: `"attributes"` for an attribute
 * mutation, `"characterData"` for a mutation to a CharacterData node
 * and `"childList"` for a mutation to the tree of nodes.
 * @param target - node affected by the mutation.
 * @param addedNodes - list of added nodes.
 * @param removedNodes - list of removed nodes.
 * @param previousSibling - previous sibling of added or removed nodes.
 * @param nextSibling - next sibling of added or removed nodes.
 * @param attributeName - local name of the changed attribute,
 * and `null` otherwise.
 * @param attributeNamespace - namespace of the changed attribute,
 * and `null` otherwise.
 * @param oldValue - value before mutation: attribute value for an attribute
 * mutation, node `data` for a mutation to a CharacterData node and `null`
 * for a mutation to the tree of nodes.
 */ function create_mutationRecord(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
    return MutationRecordImpl_1.MutationRecordImpl._create(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue);
}
exports.create_mutationRecord = create_mutationRecord;
/**
 * Creates a new `DOMTokenList`.
 *
 * @param element - associated element
 * @param attribute - associated attribute
 */ function create_domTokenList(element, attribute) {
    return DOMTokenListImpl_1.DOMTokenListImpl._create(element, attribute);
}
exports.create_domTokenList = create_domTokenList;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationObserverAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const CreateAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const EventAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/EventAlgorithm.js [app-route] (ecmascript)");
/**
 * Queues a mutation observer microtask to the surrounding agent’s mutation
 * observers.
 */ function observer_queueAMutationObserverMicrotask() {
    /**
     * 1. If the surrounding agent’s mutation observer microtask queued is true,
     * then return.
     * 2. Set the surrounding agent’s mutation observer microtask queued to true.
     * 3. Queue a microtask to notify mutation observers.
     */ const window = dom_1.dom.window;
    if (window._mutationObserverMicrotaskQueued) return;
    window._mutationObserverMicrotaskQueued = true;
    Promise.resolve().then(()=>{
        observer_notifyMutationObservers();
    });
}
exports.observer_queueAMutationObserverMicrotask = observer_queueAMutationObserverMicrotask;
/**
 * Notifies the surrounding agent’s mutation observers.
 */ function observer_notifyMutationObservers() {
    /**
     * 1. Set the surrounding agent’s mutation observer microtask queued to false.
     * 2. Let notifySet be a clone of the surrounding agent’s mutation observers.
     * 3. Let signalSet be a clone of the surrounding agent’s signal slots.
     * 4. Empty the surrounding agent’s signal slots.
     */ const window = dom_1.dom.window;
    window._mutationObserverMicrotaskQueued = false;
    const notifySet = infra_1.set.clone(window._mutationObservers);
    const signalSet = infra_1.set.clone(window._signalSlots);
    infra_1.set.empty(window._signalSlots);
    /**
     * 5. For each mo of notifySet:
     */ for (const mo of notifySet){
        /**
         * 5.1. Let records be a clone of mo’s record queue.
         * 5.2. Empty mo’s record queue.
         */ const records = infra_1.list.clone(mo._recordQueue);
        infra_1.list.empty(mo._recordQueue);
        /**
         * 5.3. For each node of mo’s node list, remove all transient registered
         * observers whose observer is mo from node’s registered observer list.
         */ for(let i = 0; i < mo._nodeList.length; i++){
            const node = mo._nodeList[i];
            infra_1.list.remove(node._registeredObserverList, (observer)=>{
                return util_1.Guard.isTransientRegisteredObserver(observer) && observer.observer === mo;
            });
        }
        /**
         * 5.4. If records is not empty, then invoke mo’s callback with « records,
         * mo », and mo. If this throws an exception, then report the exception.
         */ if (!infra_1.list.isEmpty(records)) {
            try {
                mo._callback.call(mo, records, mo);
            } catch (err) {
            // TODO: Report the exception
            }
        }
    }
    /**
     * 6. For each slot of signalSet, fire an event named slotchange, with its
     * bubbles attribute set to true, at slot.
     */ if (dom_1.dom.features.slots) {
        for (const slot of signalSet){
            EventAlgorithm_1.event_fireAnEvent("slotchange", slot, undefined, {
                bubbles: true
            });
        }
    }
}
exports.observer_notifyMutationObservers = observer_notifyMutationObservers;
/**
 * Queues a mutation record of the given type for target.
 *
 * @param type - mutation record type
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */ function observer_queueMutationRecord(type, target, name, namespace, oldValue, addedNodes, removedNodes, previousSibling, nextSibling) {
    /**
     * 1. Let interestedObservers be an empty map.
     * 2. Let nodes be the inclusive ancestors of target.
     * 3. For each node in nodes, and then for each registered of node’s
     * registered observer list:
     */ const interestedObservers = new Map();
    let node = TreeAlgorithm_1.tree_getFirstAncestorNode(target, true);
    while(node !== null){
        for(let i = 0; i < node._registeredObserverList.length; i++){
            const registered = node._registeredObserverList[i];
            /**
             * 3.1. Let options be registered’s options.
             * 3.2. If none of the following are true
             * - node is not target and options’s subtree is false
             * - type is "attributes" and options’s attributes is not true
             * - type is "attributes", options’s attributeFilter is present, and
             * options’s attributeFilter does not contain name or namespace is
             * non-null
             * - type is "characterData" and options’s characterData is not true
             * - type is "childList" and options’s childList is false
             */ const options = registered.options;
            if (node !== target && !options.subtree) continue;
            if (type === "attributes" && !options.attributes) continue;
            if (type === "attributes" && options.attributeFilter && (!options.attributeFilter.includes(name || '') || namespace !== null)) continue;
            if (type === "characterData" && !options.characterData) continue;
            if (type === "childList" && !options.childList) continue;
            /**
             * then:
             * 3.2.1. Let mo be registered’s observer.
             * 3.2.2. If interestedObservers[mo] does not exist, then set
             * interestedObservers[mo] to null.
             * 3.2.3. If either type is "attributes" and options’s attributeOldValue
             * is true, or type is "characterData" and options’s
             * characterDataOldValue is true, then set interestedObservers[mo]
             * to oldValue.
             */ const mo = registered.observer;
            if (!interestedObservers.has(mo)) {
                interestedObservers.set(mo, null);
            }
            if (type === "attributes" && options.attributeOldValue || type === "characterData" && options.characterDataOldValue) {
                interestedObservers.set(mo, oldValue);
            }
        }
        node = TreeAlgorithm_1.tree_getNextAncestorNode(target, node, true);
    }
    /**
     * 4. For each observer → mappedOldValue of interestedObservers:
     */ for (const [observer, mappedOldValue] of interestedObservers){
        /**
         * 4.1. Let record be a new MutationRecord object with its type set to
         * type, target set to target, attributeName set to name,
         * attributeNamespace set to namespace, oldValue set to mappedOldValue,
         * addedNodes set to addedNodes, removedNodes set to removedNodes,
         * previousSibling set to previousSibling, and nextSibling set to
         * nextSibling.
         * 4.2. Enqueue record to observer’s record queue.
         */ const record = CreateAlgorithm_1.create_mutationRecord(type, target, CreateAlgorithm_1.create_nodeListStatic(target, addedNodes), CreateAlgorithm_1.create_nodeListStatic(target, removedNodes), previousSibling, nextSibling, name, namespace, mappedOldValue);
        const queue = observer._recordQueue;
        queue.push(record);
    }
    /**
     * 5. Queue a mutation observer microtask.
     */ observer_queueAMutationObserverMicrotask();
}
exports.observer_queueMutationRecord = observer_queueMutationRecord;
/**
 * Queues a tree mutation record for target.
 *
 * @param target - target node
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */ function observer_queueTreeMutationRecord(target, addedNodes, removedNodes, previousSibling, nextSibling) {
    /**
     * To queue a tree mutation record for target with addedNodes, removedNodes,
     * previousSibling, and nextSibling, queue a mutation record of "childList"
     * for target with null, null, null, addedNodes, removedNodes,
     * previousSibling, and nextSibling.
     */ observer_queueMutationRecord("childList", target, null, null, null, addedNodes, removedNodes, previousSibling, nextSibling);
}
exports.observer_queueTreeMutationRecord = observer_queueTreeMutationRecord;
/**
 * Queues an attribute mutation record for target.
 *
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 */ function observer_queueAttributeMutationRecord(target, name, namespace, oldValue) {
    /**
     * To queue an attribute mutation record for target with name, namespace,
     * and oldValue, queue a mutation record of "attributes" for target with
     * name, namespace, oldValue, « », « », null, and null.
     */ observer_queueMutationRecord("attributes", target, name, namespace, oldValue, [], [], null, null);
}
exports.observer_queueAttributeMutationRecord = observer_queueAttributeMutationRecord;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ShadowTreeAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const util_2 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const MutationObserverAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationObserverAlgorithm.js [app-route] (ecmascript)");
/**
 * Signals a slot change to the given slot.
 *
 * @param slot - a slot
 */ function shadowTree_signalASlotChange(slot) {
    /**
     * 1. Append slot to slot’s relevant agent’s signal slots.
     * 2. Queue a mutation observer microtask.
     */ const window = dom_1.dom.window;
    window._signalSlots.add(slot);
    MutationObserverAlgorithm_1.observer_queueAMutationObserverMicrotask();
}
exports.shadowTree_signalASlotChange = shadowTree_signalASlotChange;
/**
 * Determines whether a the shadow tree of the given element node is
 * connected to a document node.
 *
 * @param element - an element node of the shadow tree
 */ function shadowTree_isConnected(element) {
    /**
     * An element is connected if its shadow-including root is a document.
     */ return util_1.Guard.isDocumentNode(TreeAlgorithm_1.tree_rootNode(element, true));
}
exports.shadowTree_isConnected = shadowTree_isConnected;
/**
 * Determines whether a slotable is assigned.
 *
 * @param slotable - a slotable
 */ function shadowTree_isAssigned(slotable) {
    /**
     * A slotable is assigned if its assigned slot is non-null.
     */ return slotable._assignedSlot !== null;
}
exports.shadowTree_isAssigned = shadowTree_isAssigned;
/**
 * Finds a slot for the given slotable.
 *
 * @param slotable - a slotable
 * @param openFlag - `true` to search open shadow tree's only
 */ function shadowTree_findASlot(slotable, openFlag = false) {
    /**
     * 1. If slotable’s parent is null, then return null.
     * 2. Let shadow be slotable’s parent’s shadow root.
     * 3. If shadow is null, then return null.
     * 4. If the open flag is set and shadow’s mode is not "open", then
     * return null.
     * 5. Return the first slot in tree order in shadow’s descendants whose name
     * is slotable’s name, if any, and null otherwise.
     */ const node = util_1.Cast.asNode(slotable);
    const parent = node._parent;
    if (parent === null) return null;
    const shadow = parent._shadowRoot || null;
    if (shadow === null) return null;
    if (openFlag && shadow._mode !== "open") return null;
    let child = TreeAlgorithm_1.tree_getFirstDescendantNode(shadow, false, true, (e)=>util_1.Guard.isSlot(e));
    while(child !== null){
        if (child._name === slotable._name) return child;
        child = TreeAlgorithm_1.tree_getNextDescendantNode(shadow, child, false, true, (e)=>util_1.Guard.isSlot(e));
    }
    return null;
}
exports.shadowTree_findASlot = shadowTree_findASlot;
/**
 * Finds slotables for the given slot.
 *
 * @param slot - a slot
 */ function shadowTree_findSlotables(slot) {
    /**
     * 1. Let result be an empty list.
     * 2. If slot’s root is not a shadow root, then return result.
     */ const result = [];
    const root = TreeAlgorithm_1.tree_rootNode(slot);
    if (!util_1.Guard.isShadowRoot(root)) return result;
    /**
     * 3. Let host be slot’s root’s host.
     * 4. For each slotable child of host, slotable, in tree order:
     */ const host = root._host;
    for (const slotable of host._children){
        if (util_1.Guard.isSlotable(slotable)) {
            /**
             * 4.1. Let foundSlot be the result of finding a slot given slotable.
             * 4.2. If foundSlot is slot, then append slotable to result.
             */ const foundSlot = shadowTree_findASlot(slotable);
            if (foundSlot === slot) {
                result.push(slotable);
            }
        }
    }
    /**
     * 5. Return result.
     */ return result;
}
exports.shadowTree_findSlotables = shadowTree_findSlotables;
/**
 * Finds slotables for the given slot.
 *
 * @param slot - a slot
 */ function shadowTree_findFlattenedSlotables(slot) {
    /**
     * 1. Let result be an empty list.
     * 2. If slot’s root is not a shadow root, then return result.
     */ const result = [];
    const root = TreeAlgorithm_1.tree_rootNode(slot);
    if (!util_1.Guard.isShadowRoot(root)) return result;
    /**
     * 3. Let slotables be the result of finding slotables given slot.
     * 4. If slotables is the empty list, then append each slotable child of
     * slot, in tree order, to slotables.
     */ const slotables = shadowTree_findSlotables(slot);
    if (util_2.isEmpty(slotables)) {
        for (const slotable of slot._children){
            if (util_1.Guard.isSlotable(slotable)) {
                slotables.push(slotable);
            }
        }
    }
    /**
     * 5. For each node in slotables:
     */ for (const node of slotables){
        /**
         * 5.1. If node is a slot whose root is a shadow root, then:
         */ if (util_1.Guard.isSlot(node) && util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(node))) {
            /**
             * 5.1.1. Let temporaryResult be the result of finding flattened slotables given node.
             * 5.1.2. Append each slotable in temporaryResult, in order, to result.
             */ const temporaryResult = shadowTree_findFlattenedSlotables(node);
            result.push(...temporaryResult);
        } else {
            /**
             * 5.2. Otherwise, append node to result.
             */ result.push(node);
        }
    }
    /**
     * 6. Return result.
     */ return result;
}
exports.shadowTree_findFlattenedSlotables = shadowTree_findFlattenedSlotables;
/**
 * Assigns slotables to the given slot.
 *
 * @param slot - a slot
 */ function shadowTree_assignSlotables(slot) {
    /**
     * 1. Let slotables be the result of finding slotables for slot.
     * 2. If slotables and slot’s assigned nodes are not identical, then run
     * signal a slot change for slot.
     */ const slotables = shadowTree_findSlotables(slot);
    if (slotables.length === slot._assignedNodes.length) {
        let nodesIdentical = true;
        for(let i = 0; i < slotables.length; i++){
            if (slotables[i] !== slot._assignedNodes[i]) {
                nodesIdentical = false;
                break;
            }
        }
        if (!nodesIdentical) {
            shadowTree_signalASlotChange(slot);
        }
    }
    /**
     * 3. Set slot’s assigned nodes to slotables.
     * 4. For each slotable in slotables, set slotable’s assigned slot to slot.
     */ slot._assignedNodes = slotables;
    for (const slotable of slotables){
        slotable._assignedSlot = slot;
    }
}
exports.shadowTree_assignSlotables = shadowTree_assignSlotables;
/**
 * Assigns slotables to all nodes of a tree.
 *
 * @param root - root node
 */ function shadowTree_assignSlotablesForATree(root) {
    /**
     * To assign slotables for a tree, given a node root, run assign slotables
     * for each slot slot in root’s inclusive descendants, in tree order.
     */ let descendant = TreeAlgorithm_1.tree_getFirstDescendantNode(root, true, false, (e)=>util_1.Guard.isSlot(e));
    while(descendant !== null){
        shadowTree_assignSlotables(descendant);
        descendant = TreeAlgorithm_1.tree_getNextDescendantNode(root, descendant, true, false, (e)=>util_1.Guard.isSlot(e));
    }
}
exports.shadowTree_assignSlotablesForATree = shadowTree_assignSlotablesForATree;
/**
 * Assigns a slot to a slotables.
 *
 * @param slotable - a slotable
 */ function shadowTree_assignASlot(slotable) {
    /**
     * 1. Let slot be the result of finding a slot with slotable.
     * 2. If slot is non-null, then run assign slotables for slot.
     */ const slot = shadowTree_findASlot(slotable);
    if (slot !== null) {
        shadowTree_assignSlotables(slot);
    }
}
exports.shadowTree_assignASlot = shadowTree_assignASlot;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const ShadowTreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ShadowTreeAlgorithm.js [app-route] (ecmascript)");
const supportedTokens = new Map();
/**
 * Runs removing steps for node.
 *
 * @param removedNode - removed node
 * @param oldParent - old parent node
 */ function dom_runRemovingSteps(removedNode, oldParent) {
// No steps defined
}
exports.dom_runRemovingSteps = dom_runRemovingSteps;
/**
 * Runs cloning steps for node.
 *
 * @param copy - node clone
 * @param node - node
 * @param document - document to own the cloned node
 * @param cloneChildrenFlag - whether child nodes are cloned
 */ function dom_runCloningSteps(copy, node, document, cloneChildrenFlag) {
// No steps defined
}
exports.dom_runCloningSteps = dom_runCloningSteps;
/**
 * Runs adopting steps for node.
 *
 * @param node - node
 * @param oldDocument - old document
 */ function dom_runAdoptingSteps(node, oldDocument) {
// No steps defined
}
exports.dom_runAdoptingSteps = dom_runAdoptingSteps;
/**
 * Runs attribute change steps for an element node.
 *
 * @param element - element node owning the attribute
 * @param localName - attribute's local name
 * @param oldValue - attribute's old value
 * @param value - attribute's new value
 * @param namespace - attribute's namespace
 */ function dom_runAttributeChangeSteps(element, localName, oldValue, value, namespace) {
    // run default steps
    if (dom_1.dom.features.slots) {
        updateASlotablesName.call(element, element, localName, oldValue, value, namespace);
        updateASlotsName.call(element, element, localName, oldValue, value, namespace);
    }
    updateAnElementID.call(element, element, localName, value, namespace);
    // run custom steps
    for (const step of element._attributeChangeSteps){
        step.call(element, element, localName, oldValue, value, namespace);
    }
}
exports.dom_runAttributeChangeSteps = dom_runAttributeChangeSteps;
/**
 * Runs insertion steps for a node.
 *
 * @param insertedNode - inserted node
 */ function dom_runInsertionSteps(insertedNode) {
// No steps defined
}
exports.dom_runInsertionSteps = dom_runInsertionSteps;
/**
 * Runs pre-removing steps for a node iterator and node.
 *
 * @param nodeIterator - a node iterator
 * @param toBeRemoved - node to be removed
 */ function dom_runNodeIteratorPreRemovingSteps(nodeIterator, toBeRemoved) {
    removeNodeIterator.call(nodeIterator, nodeIterator, toBeRemoved);
}
exports.dom_runNodeIteratorPreRemovingSteps = dom_runNodeIteratorPreRemovingSteps;
/**
 * Determines if there are any supported tokens defined for the given
 * attribute name.
 *
 * @param attributeName - an attribute name
 */ function dom_hasSupportedTokens(attributeName) {
    return supportedTokens.has(attributeName);
}
exports.dom_hasSupportedTokens = dom_hasSupportedTokens;
/**
 * Returns the set of supported tokens defined for the given attribute name.
 *
 * @param attributeName - an attribute name
 */ function dom_getSupportedTokens(attributeName) {
    return supportedTokens.get(attributeName) || new Set();
}
exports.dom_getSupportedTokens = dom_getSupportedTokens;
/**
 * Runs event construction steps.
 *
 * @param event - an event
 */ function dom_runEventConstructingSteps(event) {
// No steps defined
}
exports.dom_runEventConstructingSteps = dom_runEventConstructingSteps;
/**
 * Runs child text content change steps for a parent node.
 *
 * @param parent - parent node with text node child nodes
 */ function dom_runChildTextContentChangeSteps(parent) {
// No steps defined
}
exports.dom_runChildTextContentChangeSteps = dom_runChildTextContentChangeSteps;
/**
 * Defines pre-removing steps for a node iterator.
 */ function removeNodeIterator(nodeIterator, toBeRemovedNode) {
    /**
     * 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s
     * reference, or toBeRemovedNode is nodeIterator’s root, then return.
     */ if (toBeRemovedNode === nodeIterator._root || !TreeAlgorithm_1.tree_isAncestorOf(nodeIterator._reference, toBeRemovedNode, true)) {
        return;
    }
    /**
     * 2. If nodeIterator’s pointer before reference is true, then:
     */ if (nodeIterator._pointerBeforeReference) {
        /**
         * 2.1. Let next be toBeRemovedNode’s first following node that is an
         * inclusive descendant of nodeIterator’s root and is not an inclusive
         * descendant of toBeRemovedNode, and null if there is no such node.
         */ while(true){
            const nextNode = TreeAlgorithm_1.tree_getFollowingNode(nodeIterator._root, toBeRemovedNode);
            if (nextNode !== null && TreeAlgorithm_1.tree_isDescendantOf(nodeIterator._root, nextNode, true) && !TreeAlgorithm_1.tree_isDescendantOf(toBeRemovedNode, nextNode, true)) {
                /**
                 * 2.2. If next is non-null, then set nodeIterator’s reference to next
                 * and return.
                 */ nodeIterator._reference = nextNode;
                return;
            } else if (nextNode === null) {
                /**
                 * 2.3. Otherwise, set nodeIterator’s pointer before reference to false.
                 */ nodeIterator._pointerBeforeReference = false;
                return;
            }
        }
    }
    /**
     * 3. Set nodeIterator’s reference to toBeRemovedNode’s parent, if
     * toBeRemovedNode’s previous sibling is null, and to the inclusive
     * descendant of toBeRemovedNode’s previous sibling that appears last in
     * tree order otherwise.
     */ if (toBeRemovedNode._previousSibling === null) {
        if (toBeRemovedNode._parent !== null) {
            nodeIterator._reference = toBeRemovedNode._parent;
        }
    } else {
        let referenceNode = toBeRemovedNode._previousSibling;
        let childNode = TreeAlgorithm_1.tree_getFirstDescendantNode(toBeRemovedNode._previousSibling, true, false);
        while(childNode !== null){
            if (childNode !== null) {
                referenceNode = childNode;
            }
            // loop through to get the last descendant node
            childNode = TreeAlgorithm_1.tree_getNextDescendantNode(toBeRemovedNode._previousSibling, childNode, true, false);
        }
        nodeIterator._reference = referenceNode;
    }
}
/**
 * Defines attribute change steps to update a slot’s name.
 */ function updateASlotsName(element, localName, oldValue, value, namespace) {
    /**
     * 1. If element is a slot, localName is name, and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to the
     * empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. Run assign slotables for a tree with element’s root.
     */ if (util_1.Guard.isSlot(element) && localName === "name" && namespace === null) {
        if (value === oldValue) return;
        if (value === null && oldValue === '') return;
        if (value === '' && oldValue === null) return;
        if (value === null || value === '') {
            element._name = '';
        } else {
            element._name = value;
        }
        ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(element));
    }
}
/**
 * Defines attribute change steps to update a slotable’s name.
 */ function updateASlotablesName(element, localName, oldValue, value, namespace) {
    /**
     * 1. If localName is slot and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to
     * the empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. If element is assigned, then run assign slotables for element’s
     * assigned slot.
     * 1.7. Run assign a slot for element.
     */ if (util_1.Guard.isSlotable(element) && localName === "slot" && namespace === null) {
        if (value === oldValue) return;
        if (value === null && oldValue === '') return;
        if (value === '' && oldValue === null) return;
        if (value === null || value === '') {
            element._name = '';
        } else {
            element._name = value;
        }
        if (ShadowTreeAlgorithm_1.shadowTree_isAssigned(element)) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotables(element._assignedSlot);
        }
        ShadowTreeAlgorithm_1.shadowTree_assignASlot(element);
    }
}
/**
 * Defines attribute change steps to update an element's ID.
 */ function updateAnElementID(element, localName, value, namespace) {
    /**
     * 1. If localName is id, namespace is null, and value is null or the empty
     * string, then unset element’s ID.
     * 2. Otherwise, if localName is id, namespace is null, then set element’s
     * ID to value.
     */ if (localName === "id" && namespace === null) {
        if (!value) element._uniqueIdentifier = undefined;
        else element._uniqueIdentifier = value;
    }
}
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/EventAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const CustomEventImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/CustomEventImpl.js [app-route] (ecmascript)");
const EventImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/EventImpl.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const ShadowTreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ShadowTreeAlgorithm.js [app-route] (ecmascript)");
const DOMAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)");
/**
 * Sets the canceled flag of an event.
 *
 * @param event - an event
 */ function event_setTheCanceledFlag(event) {
    if (event._cancelable && !event._inPassiveListenerFlag) {
        event._canceledFlag = true;
    }
}
exports.event_setTheCanceledFlag = event_setTheCanceledFlag;
/**
 * Initializes the value of an event.
 *
 * @param event - an event to initialize
 * @param type - the type of event
 * @param bubbles - whether the event propagates in reverse
 * @param cancelable - whether the event can be cancelled
 */ function event_initialize(event, type, bubbles, cancelable) {
    event._initializedFlag = true;
    event._stopPropagationFlag = false;
    event._stopImmediatePropagationFlag = false;
    event._canceledFlag = false;
    event._isTrusted = false;
    event._target = null;
    event._type = type;
    event._bubbles = bubbles;
    event._cancelable = cancelable;
}
exports.event_initialize = event_initialize;
/**
 * Creates a new event.
 *
 * @param eventInterface - event interface
 * @param realm - realm
 */ function event_createAnEvent(eventInterface, realm = undefined) {
    /**
     * 1. If realm is not given, then set it to null.
     * 2. Let dictionary be the result of converting the JavaScript value
     * undefined to the dictionary type accepted by eventInterface’s
     * constructor. (This dictionary type will either be EventInit or a
     * dictionary that inherits from it.)
     * 3. Let event be the result of running the inner event creation steps with
     * eventInterface, realm, the time of the occurrence that the event is
     * signaling, and dictionary.
     * 4. Initialize event’s isTrusted attribute to true.
     * 5. Return event.
     */ if (realm === undefined) realm = null;
    const dictionary = {};
    const event = event_innerEventCreationSteps(eventInterface, realm, new Date(), dictionary);
    event._isTrusted = true;
    return event;
}
exports.event_createAnEvent = event_createAnEvent;
/**
 * Performs event creation steps.
 *
 * @param eventInterface - event interface
 * @param realm - realm
 * @param time - time of occurrance
 * @param dictionary - event attributes
 *
 */ function event_innerEventCreationSteps(eventInterface, realm, time, dictionary) {
    /**
     * 1. Let event be the result of creating a new object using eventInterface.
     * TODO: Implement realms
     * If realm is non-null, then use that Realm; otherwise, use the default
     * behavior defined in Web IDL.
     */ const event = new eventInterface("");
    /**
     * 2. Set event’s initialized flag.
     * 3. Initialize event’s timeStamp attribute to a DOMHighResTimeStamp
     * representing the high resolution time from the time origin to time.
     * 4. For each member → value in dictionary, if event has an attribute
     * whose identifier is member, then initialize that attribute to value.
     * 5. Run the event constructing steps with event.
     * 6. Return event.
     */ event._initializedFlag = true;
    event._timeStamp = time.getTime();
    Object.assign(event, dictionary);
    if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runEventConstructingSteps(event);
    }
    return event;
}
exports.event_innerEventCreationSteps = event_innerEventCreationSteps;
/**
 * Dispatches an event to an event target.
 *
 * @param event - the event to dispatch
 * @param target - event target
 * @param legacyTargetOverrideFlag - legacy target override flag
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */ function event_dispatch(event, target, legacyTargetOverrideFlag = false, legacyOutputDidListenersThrowFlag = {
    value: false
}) {
    let clearTargets = false;
    /**
     * 1. Set event's dispatch flag.
     */ event._dispatchFlag = true;
    /**
     * 2. Let targetOverride be target, if legacy target override flag is not
     * given, and target's associated Document otherwise.
     *
     * _Note:_ legacy target override flag is only used by HTML and only when
     * target is a Window object.
     */ let targetOverride = target;
    if (legacyTargetOverrideFlag) {
        const doc = target._associatedDocument;
        if (util_1.Guard.isDocumentNode(doc)) {
            targetOverride = doc;
        }
    }
    /**
     * 3. Let activationTarget be null.
     * 4. Let relatedTarget be the result of retargeting event's relatedTarget
     * against target.
     * 5. If target is not relatedTarget or target is event's relatedTarget,
     * then:
    */ let activationTarget = null;
    let relatedTarget = TreeAlgorithm_1.tree_retarget(event._relatedTarget, target);
    if (target !== relatedTarget || target === event._relatedTarget) {
        /**
         * 5.1. Let touchTargets be a new list.
         * 5.2. For each touchTarget of event's touch target list, append the
         * result of retargeting touchTarget against target to touchTargets.
         * 5.3. Append to an event path with event, target, targetOverride,
         * relatedTarget, touchTargets, and false.
         * 5.4. Let isActivationEvent be true, if event is a MouseEvent object
         * and event's type attribute is "click", and false otherwise.
         * 5.5. If isActivationEvent is true and target has activation behavior,
         * then set activationTarget to target.
         * 5.6. Let slotable be target, if target is a slotable and is assigned,
         * and null otherwise.
         * 5.7. Let slot-in-closed-tree be false.
         * 5.8. Let parent be the result of invoking target's get the parent with
         * event.
         */ let touchTargets = [];
        for (const touchTarget of event._touchTargetList){
            touchTargets.push(TreeAlgorithm_1.tree_retarget(touchTarget, target));
        }
        event_appendToAnEventPath(event, target, targetOverride, relatedTarget, touchTargets, false);
        const isActivationEvent = util_1.Guard.isMouseEvent(event) && event._type === "click";
        if (isActivationEvent && target._activationBehavior !== undefined) {
            activationTarget = target;
        }
        let slotable = util_1.Guard.isSlotable(target) && ShadowTreeAlgorithm_1.shadowTree_isAssigned(target) ? target : null;
        let slotInClosedTree = false;
        let parent = target._getTheParent(event);
        /**
         * 5.9. While parent is non-null:
         */ while(parent !== null && util_1.Guard.isNode(parent)){
            /**
             * 5.9.1 If slotable is non-null:
             * 5.9.1.1. Assert: parent is a slot.
             * 5.9.1.2. Set slotable to null.
             * 5.9.1.3. If parent's root is a shadow root whose mode is "closed",
             * then set slot-in-closed-tree to true.
             */ if (slotable !== null) {
                if (!util_1.Guard.isSlot(parent)) {
                    throw new Error("Parent node of a slotable should be a slot.");
                }
                slotable = null;
                const root = TreeAlgorithm_1.tree_rootNode(parent, true);
                if (util_1.Guard.isShadowRoot(root) && root._mode === "closed") {
                    slotInClosedTree = true;
                }
            }
            /**
             * 5.9.2 If parent is a slotable and is assigned, then set slotable to
             * parent.
             * 5.9.3. Let relatedTarget be the result of retargeting event's
             * relatedTarget against parent.
             * 5.9.4. Let touchTargets be a new list.
             * 5.9.4. For each touchTarget of event's touch target list, append the
             * result of retargeting touchTarget against parent to touchTargets.
             */ if (util_1.Guard.isSlotable(parent) && ShadowTreeAlgorithm_1.shadowTree_isAssigned(parent)) {
                slotable = parent;
            }
            relatedTarget = TreeAlgorithm_1.tree_retarget(event._relatedTarget, parent);
            touchTargets = [];
            for (const touchTarget of event._touchTargetList){
                touchTargets.push(TreeAlgorithm_1.tree_retarget(touchTarget, parent));
            }
            /**
             * 5.9.6. If parent is a Window object, or parent is a node and target's
             * root is a shadow-including inclusive ancestor of parent, then:
             */ if (util_1.Guard.isWindow(parent) || util_1.Guard.isNode(parent) && util_1.Guard.isNode(target) && TreeAlgorithm_1.tree_isAncestorOf(TreeAlgorithm_1.tree_rootNode(target, true), parent, true, true)) {
                /**
                 * 5.9.6.1. If isActivationEvent is true, event's bubbles attribute
                 * is true, activationTarget is null, and parent has activation
                 * behavior, then set activationTarget to parent.
                 * 5.9.6.2. Append to an event path with event, parent, null,
                 * relatedTarget, touchTargets, and slot-in-closed-tree.
                 */ if (isActivationEvent && event._bubbles && activationTarget === null && parent._activationBehavior) {
                    activationTarget = parent;
                }
                event_appendToAnEventPath(event, parent, null, relatedTarget, touchTargets, slotInClosedTree);
            } else if (parent === relatedTarget) {
                /**
                 * 5.9.7. Otherwise, if parent is relatedTarget,
                 * then set parent to null.
                 */ parent = null;
            } else {
                /**
                 * 5.9.8. Otherwise, set target to parent and then:
                 * 5.9.8.1. If isActivationEvent is true, activationTarget is null,
                 * and target has activation behavior, then set activationTarget
                 * to target.
                 * 5.9.8.2. Append to an event path with event, parent, target,
                 * relatedTarget, touchTargets, and slot-in-closed-tree.
                 */ target = parent;
                if (isActivationEvent && activationTarget === null && target._activationBehavior) {
                    activationTarget = target;
                }
                event_appendToAnEventPath(event, parent, target, relatedTarget, touchTargets, slotInClosedTree);
            }
            /**
             * 5.9.9. If parent is non-null, then set parent to the result of
             * invoking parent's get the parent with event.
             * 5.9.10. Set slot-in-closed-tree to false.
             */ if (parent !== null) {
                parent = parent._getTheParent(event);
            }
            slotInClosedTree = false;
        }
        /**
         * 5.10. Let clearTargetsStruct be the last struct in event's path whose
         * shadow-adjusted target is non-null.
         */ let clearTargetsStruct = null;
        const path = event._path;
        for(let i = path.length - 1; i >= 0; i--){
            const struct = path[i];
            if (struct.shadowAdjustedTarget !== null) {
                clearTargetsStruct = struct;
                break;
            }
        }
        /**
         * 5.11. Let clearTargets be true if clearTargetsStruct's shadow-adjusted
         * target, clearTargetsStruct's relatedTarget, or an EventTarget object
         * in clearTargetsStruct's touch target list is a node and its root is
         * a shadow root, and false otherwise.
         */ if (clearTargetsStruct !== null) {
            if (util_1.Guard.isNode(clearTargetsStruct.shadowAdjustedTarget) && util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(clearTargetsStruct.shadowAdjustedTarget, true))) {
                clearTargets = true;
            } else if (util_1.Guard.isNode(clearTargetsStruct.relatedTarget) && util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(clearTargetsStruct.relatedTarget, true))) {
                clearTargets = true;
            } else {
                for(let j = 0; j < clearTargetsStruct.touchTargetList.length; j++){
                    const struct = clearTargetsStruct.touchTargetList[j];
                    if (util_1.Guard.isNode(struct) && util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(struct, true))) {
                        clearTargets = true;
                        break;
                    }
                }
            }
        }
        /**
         * 5.12. If activationTarget is non-null and activationTarget has
         * legacy-pre-activation behavior, then run activationTarget's
         * legacy-pre-activation behavior.
         */ if (activationTarget !== null && activationTarget._legacyPreActivationBehavior !== undefined) {
            activationTarget._legacyPreActivationBehavior(event);
        }
        /**
         * 5.13. For each struct in event's path, in reverse order:
         */ for(let i = path.length - 1; i >= 0; i--){
            const struct = path[i];
            /**
             * 5.13.1. If struct's shadow-adjusted target is non-null, then set
             * event's eventPhase attribute to AT_TARGET.
             * 5.13.2. Otherwise, set event's eventPhase attribute to
             * CAPTURING_PHASE.
             * 5.13.3. Invoke with struct, event, "capturing", and
             * legacyOutputDidListenersThrowFlag if given.
             */ if (struct.shadowAdjustedTarget !== null) {
                event._eventPhase = interfaces_1.EventPhase.AtTarget;
            } else {
                event._eventPhase = interfaces_1.EventPhase.Capturing;
            }
            event_invoke(struct, event, "capturing", legacyOutputDidListenersThrowFlag);
        }
        /**
         * 5.14. For each struct in event's path
         */ for(let i = 0; i < path.length; i++){
            const struct = path[i];
            /**
             * 5.14.1. If struct's shadow-adjusted target is non-null, then set
             * event's eventPhase attribute to AT_TARGET.
             * 5.14.2. Otherwise:
             * 5.14.2.1. If event's bubbles attribute is false, then continue.
             * 5.14.2.2. Set event's eventPhase attribute to BUBBLING_PHASE.
             * 5.14.3. Invoke with struct, event, "bubbling", and
             * legacyOutputDidListenersThrowFlag if given.
             */ if (struct.shadowAdjustedTarget !== null) {
                event._eventPhase = interfaces_1.EventPhase.AtTarget;
            } else {
                if (!event._bubbles) continue;
                event._eventPhase = interfaces_1.EventPhase.Bubbling;
            }
            event_invoke(struct, event, "bubbling", legacyOutputDidListenersThrowFlag);
        }
    }
    /**
     * 6. Set event's eventPhase attribute to NONE.
     * 7. Set event's currentTarget attribute to null.
     * 8. Set event's path to the empty list.
     * 9. Unset event's dispatch flag, stop propagation flag, and stop
     * immediate propagation flag.
     */ event._eventPhase = interfaces_1.EventPhase.None;
    event._currentTarget = null;
    event._path = [];
    event._dispatchFlag = false;
    event._stopPropagationFlag = false;
    event._stopImmediatePropagationFlag = false;
    /**
     * 10. If clearTargets, then:
     * 10.1. Set event's target to null.
     * 10.2. Set event's relatedTarget to null.
     * 10.3. Set event's touch target list to the empty list.
     */ if (clearTargets) {
        event._target = null;
        event._relatedTarget = null;
        event._touchTargetList = [];
    }
    /**
     * 11. If activationTarget is non-null, then:
     * 11.1. If event's canceled flag is unset, then run activationTarget's
     * activation behavior with event.
     * 11.2. Otherwise, if activationTarget has legacy-canceled-activation
     * behavior, then run activationTarget's legacy-canceled-activation
     * behavior.
     */ if (activationTarget !== null) {
        if (!event._canceledFlag && activationTarget._activationBehavior !== undefined) {
            activationTarget._activationBehavior(event);
        } else if (activationTarget._legacyCanceledActivationBehavior !== undefined) {
            activationTarget._legacyCanceledActivationBehavior(event);
        }
    }
    /**
     * 12. Return false if event's canceled flag is set, and true otherwise.
     */ return !event._canceledFlag;
}
exports.event_dispatch = event_dispatch;
/**
 * Appends a new struct to an event's path.
 *
 * @param event - an event
 * @param invocationTarget - the target of the invocation
 * @param shadowAdjustedTarget - shadow-root adjusted event target
 * @param relatedTarget - related event target
 * @param touchTargets - a list of touch targets
 * @param slotInClosedTree - if the target's parent is a closed shadow root
 */ function event_appendToAnEventPath(event, invocationTarget, shadowAdjustedTarget, relatedTarget, touchTargets, slotInClosedTree) {
    /**
     * 1. Let invocationTargetInShadowTree be false.
     * 2. If invocationTarget is a node and its root is a shadow root, then
     * set invocationTargetInShadowTree to true.
     */ let invocationTargetInShadowTree = false;
    if (util_1.Guard.isNode(invocationTarget) && util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(invocationTarget))) {
        invocationTargetInShadowTree = true;
    }
    /**
     * 3. Let root-of-closed-tree be false.
     * 4. If invocationTarget is a shadow root whose mode is "closed", then
     * set root-of-closed-tree to true.
     */ let rootOfClosedTree = false;
    if (util_1.Guard.isShadowRoot(invocationTarget) && invocationTarget._mode === "closed") {
        rootOfClosedTree = true;
    }
    /**
     * 5. Append a new struct to event's path whose invocation target is
     * invocationTarget, invocation-target-in-shadow-tree is
     * invocationTargetInShadowTree, shadow-adjusted target is
     * shadowAdjustedTarget, relatedTarget is relatedTarget,
     * touch target list is touchTargets, root-of-closed-tree is
     * root-of-closed-tree, and slot-in-closed-tree is slot-in-closed-tree.
     */ event._path.push({
        invocationTarget: invocationTarget,
        invocationTargetInShadowTree: invocationTargetInShadowTree,
        shadowAdjustedTarget: shadowAdjustedTarget,
        relatedTarget: relatedTarget,
        touchTargetList: touchTargets,
        rootOfClosedTree: rootOfClosedTree,
        slotInClosedTree: slotInClosedTree
    });
}
exports.event_appendToAnEventPath = event_appendToAnEventPath;
/**
 * Invokes an event.
 *
 * @param struct - a struct defining event's path
 * @param event - the event to invoke
 * @param phase - event phase
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */ function event_invoke(struct, event, phase, legacyOutputDidListenersThrowFlag = {
    value: false
}) {
    /**
     * 1. Set event's target to the shadow-adjusted target of the last struct
     * in event's path, that is either struct or preceding struct, whose
     * shadow-adjusted target is non-null.
     */ const path = event._path;
    let index = -1;
    for(let i = 0; i < path.length; i++){
        if (path[i] === struct) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        let item = path[index];
        if (item.shadowAdjustedTarget !== null) {
            event._target = item.shadowAdjustedTarget;
        } else if (index > 0) {
            item = path[index - 1];
            if (item.shadowAdjustedTarget !== null) {
                event._target = item.shadowAdjustedTarget;
            }
        }
    }
    /**
     * 2. Set event's relatedTarget to struct's relatedTarget.
     * 3. Set event's touch target list to struct's touch target list.
     * 4. If event's stop propagation flag is set, then return.
     * 5. Initialize event's currentTarget attribute to struct's invocation
     * target.
     * 6. Let listeners be a clone of event's currentTarget attribute value's
     * event listener list.
     *
     * _Note:_ This avoids event listeners added after this point from being
     * run. Note that removal still has an effect due to the removed field.
     */ event._relatedTarget = struct.relatedTarget;
    event._touchTargetList = struct.touchTargetList;
    if (event._stopPropagationFlag) return;
    event._currentTarget = struct.invocationTarget;
    const currentTarget = event._currentTarget;
    const targetListeners = currentTarget._eventListenerList;
    let listeners = new Array(...targetListeners);
    /**
     * 7. Let found be the result of running inner invoke with event, listeners,
     * phase, and legacyOutputDidListenersThrowFlag if given.
     */ const found = event_innerInvoke(event, listeners, phase, struct, legacyOutputDidListenersThrowFlag);
    /**
     * 8. If found is false and event's isTrusted attribute is true, then:
     */ if (!found && event._isTrusted) {
        /**
         * 8.1. Let originalEventType be event's type attribute value.
         * 8.2. If event's type attribute value is a match for any of the strings
         * in the first column in the following table, set event's type attribute
         * value to the string in the second column on the same row as the matching
         * string, and return otherwise.
         *
         * Event type           | Legacy event type
         * -------------------------------------------------
         * "animationend"       | "webkitAnimationEnd"
         * "animationiteration" | "webkitAnimationIteration"
         * "animationstart"     | "webkitAnimationStart"
         * "transitionend"      | "webkitTransitionEnd"
         */ const originalEventType = event._type;
        if (originalEventType === "animationend") {
            event._type = "webkitAnimationEnd";
        } else if (originalEventType === "animationiteration") {
            event._type = "webkitAnimationIteration";
        } else if (originalEventType === "animationstart") {
            event._type = "webkitAnimationStart";
        } else if (originalEventType === "transitionend") {
            event._type = "webkitTransitionEnd";
        }
        /**
         * 8.3. Inner invoke with event, listeners, phase, and
         * legacyOutputDidListenersThrowFlag if given.
         * 8.4. Set event's type attribute value to originalEventType.
         */ event_innerInvoke(event, listeners, phase, struct, legacyOutputDidListenersThrowFlag);
        event._type = originalEventType;
    }
}
exports.event_invoke = event_invoke;
/**
 * Invokes an event.
 *
 * @param event - the event to invoke
 * @param listeners - event listeners
 * @param phase - event phase
 * @param struct - a struct defining event's path
 * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
 * whether the event listener's callback threw an exception
 */ function event_innerInvoke(event, listeners, phase, struct, legacyOutputDidListenersThrowFlag = {
    value: false
}) {
    /**
     * 1. Let found be false.
     * 2. For each listener in listeners, whose removed is false:
     */ let found = false;
    for(let i = 0; i < listeners.length; i++){
        const listener = listeners[i];
        if (!listener.removed) {
            /**
             * 2.1. If event's type attribute value is not listener's type, then
             * continue.
             * 2.2. Set found to true.
             * 2.3. If phase is "capturing" and listener's capture is false, then
             * continue.
             * 2.4. If phase is "bubbling" and listener's capture is true, then
             * continue.
             */ if (event._type !== listener.type) continue;
            found = true;
            if (phase === "capturing" && !listener.capture) continue;
            if (phase === "bubbling" && listener.capture) continue;
            /**
             * 2.5. If listener's once is true, then remove listener from event's
             * currentTarget attribute value's event listener list.
             */ if (listener.once && event._currentTarget !== null) {
                const impl = event._currentTarget;
                let index = -1;
                for(let i = 0; i < impl._eventListenerList.length; i++){
                    if (impl._eventListenerList[i] === listener) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1) {
                    impl._eventListenerList.splice(index, 1);
                }
            }
            /**
             * TODO: Implement realms
             *
             * 2.6. Let global be listener callback's associated Realm's global
             * object.
             */ const globalObject = undefined;
            /**
             * 2.7. Let currentEvent be undefined.
             * 2.8. If global is a Window object, then:
             * 2.8.1. Set currentEvent to global's current event.
             * 2.8.2. If struct's invocation-target-in-shadow-tree is false, then
             * set global's current event to event.
             */ let currentEvent = undefined;
            if (util_1.Guard.isWindow(globalObject)) {
                currentEvent = globalObject._currentEvent;
                if (struct.invocationTargetInShadowTree === false) {
                    globalObject._currentEvent = event;
                }
            }
            /**
             * 2.9. If listener's passive is true, then set event's in passive
             * listener flag.
             * 2.10. Call a user object's operation with listener's callback,
             * "handleEvent", « event », and event's currentTarget attribute value.
             */ if (listener.passive) event._inPassiveListenerFlag = true;
            try {
                listener.callback.handleEvent.call(event._currentTarget, event);
            } catch (err) {
                /**
                 * If this throws an exception, then:
                 * 2.10.1. Report the exception.
                 * 2.10.2. Set legacyOutputDidListenersThrowFlag if given.
                 *
                 * _Note:_ The legacyOutputDidListenersThrowFlag is only used by
                 * Indexed Database API.
                 * TODO: Report the exception
                 * See: https://html.spec.whatwg.org/multipage/webappapis.html#runtime-script-errors-in-documents
                 */ legacyOutputDidListenersThrowFlag.value = true;
            }
            /**
             * 2.11. Unset event's in passive listener flag.
             */ if (listener.passive) event._inPassiveListenerFlag = false;
            /**
             * 2.12. If global is a Window object, then set global's current event
             * to currentEvent.
             */ if (util_1.Guard.isWindow(globalObject)) {
                globalObject._currentEvent = currentEvent;
            }
            /**
             * 2.13. If event's stop immediate propagation flag is set, then return
             * found.
             */ if (event._stopImmediatePropagationFlag) return found;
        }
    }
    /**
     * 3. Return found.
     */ return found;
}
exports.event_innerInvoke = event_innerInvoke;
/**
 * Fires an event at target.
 * @param e - event name
 * @param target - event target
 * @param eventConstructor - an event constructor, with a description of how
 * IDL attributes are to be initialized
 * @param idlAttributes - a dictionary describing how IDL attributes are
 * to be initialized
 * @param legacyTargetOverrideFlag - legacy target override flag
 */ function event_fireAnEvent(e, target, eventConstructor, idlAttributes, legacyTargetOverrideFlag) {
    /**
     * 1. If eventConstructor is not given, then let eventConstructor be Event.
     */ if (eventConstructor === undefined) {
        eventConstructor = EventImpl_1.EventImpl;
    }
    /**
     * 2. Let event be the result of creating an event given eventConstructor,
     * in the relevant Realm of target.
     */ const event = event_createAnEvent(eventConstructor);
    /**
     * 3. Initialize event’s type attribute to e.
     */ event._type = e;
    /**
     * 4. Initialize any other IDL attributes of event as described in the
     * invocation of this algorithm.
     * _Note:_ This also allows for the isTrusted attribute to be set to false.
     */ if (idlAttributes) {
        for(const key in idlAttributes){
            const idlObj = event;
            idlObj[key] = idlAttributes[key];
        }
    }
    /**
     * 5. Return the result of dispatching event at target, with legacy target
     * override flag set if set.
     */ return event_dispatch(event, target, legacyTargetOverrideFlag);
}
exports.event_fireAnEvent = event_fireAnEvent;
/**
 * Creates an event.
 *
 * @param eventInterface - the name of the event interface
 */ function event_createLegacyEvent(eventInterface) {
    /**
     * 1. Let constructor be null.
     */ let constructor = null;
    /**
     * TODO: Implement in HTML DOM
     * 2. If interface is an ASCII case-insensitive match for any of the strings
     * in the first column in the following table, then set constructor to the
     * interface in the second column on the same row as the matching string:
     *
     * String | Interface
     * -------|----------
     * "beforeunloadevent" | BeforeUnloadEvent
     * "compositionevent" | CompositionEvent
     * "customevent" | CustomEvent
     * "devicemotionevent" | DeviceMotionEvent
     * "deviceorientationevent" | DeviceOrientationEvent
     * "dragevent" | DragEvent
     * "event" | Event
     * "events" | Event
     * "focusevent" | FocusEvent
     * "hashchangeevent" | HashChangeEvent
     * "htmlevents" | Event
     * "keyboardevent" | KeyboardEvent
     * "messageevent" | MessageEvent
     * "mouseevent" | MouseEvent
     * "mouseevents" |
     * "storageevent" | StorageEvent
     * "svgevents" | Event
     * "textevent" | CompositionEvent
     * "touchevent" | TouchEvent
     * "uievent" | UIEvent
     * "uievents" | UIEvent
     */ switch(eventInterface.toLowerCase()){
        case "beforeunloadevent":
            break;
        case "compositionevent":
            break;
        case "customevent":
            constructor = CustomEventImpl_1.CustomEventImpl;
            break;
        case "devicemotionevent":
            break;
        case "deviceorientationevent":
            break;
        case "dragevent":
            break;
        case "event":
        case "events":
            constructor = EventImpl_1.EventImpl;
            break;
        case "focusevent":
            break;
        case "hashchangeevent":
            break;
        case "htmlevents":
            break;
        case "keyboardevent":
            break;
        case "messageevent":
            break;
        case "mouseevent":
            break;
        case "mouseevents":
            break;
        case "storageevent":
            break;
        case "svgevents":
            break;
        case "textevent":
            break;
        case "touchevent":
            break;
        case "uievent":
            break;
        case "uievents":
            break;
    }
    /**
     * 3. If constructor is null, then throw a "NotSupportedError" DOMException.
     */ if (constructor === null) {
        throw new DOMException_1.NotSupportedError(`Event constructor not found for interface ${eventInterface}.`);
    }
    /**
     * 4. If the interface indicated by constructor is not exposed on the
     * relevant global object of the context object, then throw a
     * "NotSupportedError" DOMException.
     * _Note:_ Typically user agents disable support for touch events in some
     * configurations, in which case this clause would be triggered for the
     * interface TouchEvent.
     */ // TODO: Implement realms
    /**
     * 5. Let event be the result of creating an event given constructor.
     * 6. Initialize event’s type attribute to the empty string.
     * 7. Initialize event’s timeStamp attribute to a DOMHighResTimeStamp
     * representing the high resolution time from the time origin to now.
     * 8. Initialize event’s isTrusted attribute to false.
     * 9. Unset event’s initialized flag.
     */ const event = new constructor("");
    event._type = "";
    event._timeStamp = new Date().getTime();
    event._isTrusted = false;
    event._initializedFlag = false;
    /**
     * 10. Return event.
     */ return event;
}
exports.event_createLegacyEvent = event_createLegacyEvent;
/**
 * Getter of an event handler IDL attribute.
 *
 * @param eventTarget - event target
 * @param name - event name
 */ function event_getterEventHandlerIDLAttribute(thisObj, name) {
    /**
     * 1. Let eventTarget be the result of determining the target of an event
     * handler given this object and name.
     * 2. If eventTarget is null, then return null.
     * 3. Return the result of getting the current value of the event handler
     * given eventTarget and name.
     */ const eventTarget = event_determineTheTargetOfAnEventHandler(thisObj, name);
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
exports.event_getterEventHandlerIDLAttribute = event_getterEventHandlerIDLAttribute;
/**
 * Setter of an event handler IDL attribute.
 *
 * @param eventTarget - event target
 * @param name - event name
 * @param value - event handler
 */ function event_setterEventHandlerIDLAttribute(thisObj, name, value) {
    /**
     * 1. Let eventTarget be the result of determining the target of an event
     * handler given this object and name.
     * 2. If eventTarget is null, then return.
     * 3. If the given value is null, then deactivate an event handler given
     * eventTarget and name.
     * 4. Otherwise:
     * 4.1. Let handlerMap be eventTarget's event handler map.
     * 4.2. Let eventHandler be handlerMap[name].
     * 4.3. Set eventHandler's value to the given value.
     * 4.4. Activate an event handler given eventTarget and name.
     */ const eventTarget = event_determineTheTargetOfAnEventHandler(thisObj, name);
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
exports.event_setterEventHandlerIDLAttribute = event_setterEventHandlerIDLAttribute;
/**
 * Determines the target of an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */ function event_determineTheTargetOfAnEventHandler(eventTarget, name) {
    // TODO: Implement in HTML DOM
    return null;
}
exports.event_determineTheTargetOfAnEventHandler = event_determineTheTargetOfAnEventHandler;
/**
 * Gets the current value of an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */ function event_getTheCurrentValueOfAnEventHandler(eventTarget, name) {
    // TODO: Implement in HTML DOM
    return null;
}
exports.event_getTheCurrentValueOfAnEventHandler = event_getTheCurrentValueOfAnEventHandler;
/**
 * Activates an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */ function event_activateAnEventHandler(eventTarget, name) {
// TODO: Implement in HTML DOM
}
exports.event_activateAnEventHandler = event_activateAnEventHandler;
/**
 * Deactivates an event handler.
 *
 * @param eventTarget - event target
 * @param name - event name
 */ function event_deactivateAnEventHandler(eventTarget, name) {
// TODO: Implement in HTML DOM
}
exports.event_deactivateAnEventHandler = event_deactivateAnEventHandler;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/AbortAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const EventAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/EventAlgorithm.js [app-route] (ecmascript)");
/**
 * Adds an algorithm to the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */ function abort_add(algorithm, signal) {
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Append algorithm to signal’s abort algorithms.
     */ if (signal._abortedFlag) return;
    signal._abortAlgorithms.add(algorithm);
}
exports.abort_add = abort_add;
/**
 * Removes an algorithm from the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */ function abort_remove(algorithm, signal) {
    /**
     * To remove an algorithm algorithm from an AbortSignal signal, remove
     * algorithm from signal’s abort algorithms.
     */ signal._abortAlgorithms.delete(algorithm);
}
exports.abort_remove = abort_remove;
/**
 * Signals abort on the given abort signal.
 *
 * @param signal - abort signal
 */ function abort_signalAbort(signal) {
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Set signal’s aborted flag.
     * 3. For each algorithm in signal’s abort algorithms: run algorithm.
     * 4. Empty signal’s abort algorithms.
     * 5. Fire an event named abort at signal.
     */ if (signal._abortedFlag) return;
    signal._abortedFlag = true;
    for (const algorithm of signal._abortAlgorithms){
        algorithm.call(signal);
    }
    signal._abortAlgorithms.clear();
    EventAlgorithm_1.event_fireAnEvent("abort", signal);
}
exports.abort_signalAbort = abort_signalAbort;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CustomElementAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const PotentialCustomElementName = /[a-z]([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*/;
const NamesWithHyphen = new Set([
    'annotation-xml',
    'color-profile',
    'font-face',
    'font-face-src',
    'font-face-uri',
    'font-face-format',
    'font-face-name',
    'missing-glyph'
]);
const ElementNames = new Set([
    'article',
    'aside',
    'blockquote',
    'body',
    'div',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'main',
    'nav',
    'p',
    'section',
    'span'
]);
const VoidElementNames = new Set([
    'area',
    'base',
    'basefont',
    'bgsound',
    'br',
    'col',
    'embed',
    'frame',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
]);
const ShadowHostNames = new Set([
    'article',
    'aside',
    'blockquote',
    'body',
    'div',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'main',
    'nav',
    'p',
    'section',
    'span'
]);
/**
 * Determines if the given string is a valid custom element name.
 *
 * @param name - a name string
 */ function customElement_isValidCustomElementName(name) {
    if (!PotentialCustomElementName.test(name)) return false;
    if (NamesWithHyphen.has(name)) return false;
    return true;
}
exports.customElement_isValidCustomElementName = customElement_isValidCustomElementName;
/**
 * Determines if the given string is a valid element name.
 *
 * @param name - a name string
 */ function customElement_isValidElementName(name) {
    return ElementNames.has(name);
}
exports.customElement_isValidElementName = customElement_isValidElementName;
/**
 * Determines if the given string is a void element name.
 *
 * @param name - a name string
 */ function customElement_isVoidElementName(name) {
    return VoidElementNames.has(name);
}
exports.customElement_isVoidElementName = customElement_isVoidElementName;
/**
 * Determines if the given string is a valid shadow host element name.
 *
 * @param name - a name string
 */ function customElement_isValidShadowHostName(name) {
    return ShadowHostNames.has(name);
}
exports.customElement_isValidShadowHostName = customElement_isValidShadowHostName;
/**
 * Enqueues an upgrade reaction for a custom element.
 *
 * @param element - a custom element
 * @param definition - a custom element definition
 */ function customElement_enqueueACustomElementUpgradeReaction(element, definition) {
// TODO: Implement in HTML DOM
}
exports.customElement_enqueueACustomElementUpgradeReaction = customElement_enqueueACustomElementUpgradeReaction;
/**
 * Enqueues a callback reaction for a custom element.
 *
 * @param element - a custom element
 * @param callbackName - name of the callback
 * @param args - callback arguments
 */ function customElement_enqueueACustomElementCallbackReaction(element, callbackName, args) {
// TODO: Implement in HTML DOM
}
exports.customElement_enqueueACustomElementCallbackReaction = customElement_enqueueACustomElementCallbackReaction;
/**
 * Upgrade a custom element.
 *
 * @param element - a custom element
 */ function customElement_upgrade(definition, element) {
// TODO: Implement in HTML DOM
}
exports.customElement_upgrade = customElement_upgrade;
/**
 * Tries to upgrade a custom element.
 *
 * @param element - a custom element
 */ function customElement_tryToUpgrade(element) {
// TODO: Implement in HTML DOM
}
exports.customElement_tryToUpgrade = customElement_tryToUpgrade;
/**
 * Looks up a custom element definition.
 *
 * @param document - a document
 * @param namespace - element namespace
 * @param localName - element local name
 * @param is - an `is` value
 */ function customElement_lookUpACustomElementDefinition(document, namespace, localName, is) {
    // TODO: Implement in HTML DOM
    return null;
}
exports.customElement_lookUpACustomElementDefinition = customElement_lookUpACustomElementDefinition;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TraversalAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
/**
 * Applies the filter to the given node and returns the result.
 *
 * @param traverser - the `NodeIterator` or `TreeWalker` instance
 * @param node - the node to filter
 */ function traversal_filter(traverser, node) {
    /**
     * 1. If traverser’s active flag is set, then throw an "InvalidStateError"
     * DOMException.
     */ if (traverser._activeFlag) {
        throw new DOMException_1.InvalidStateError();
    }
    /**
     * 2. Let n be node’s nodeType attribute value − 1.
     */ const n = node._nodeType - 1;
    /**
     * 3. If the nth bit (where 0 is the least significant bit) of traverser’s
     * whatToShow is not set, then return FILTER_SKIP.
     */ const mask = 1 << n;
    if ((traverser.whatToShow & mask) === 0) {
        return interfaces_1.FilterResult.Skip;
    }
    /**
     * 4. If traverser’s filter is null, then return FILTER_ACCEPT.
     */ if (!traverser.filter) {
        return interfaces_1.FilterResult.Accept;
    }
    /**
     * 5. Set traverser’s active flag.
     */ traverser._activeFlag = true;
    /**
     * 6. Let result be the return value of call a user object’s operation with
     * traverser’s filter, "acceptNode", and « node ». If this throws an
     * exception, then unset traverser’s active flag and rethrow the exception.
     */ let result = interfaces_1.FilterResult.Reject;
    try {
        result = traverser.filter.acceptNode(node);
    } catch (err) {
        traverser._activeFlag = false;
        throw err;
    }
    /**
     * 7. Unset traverser’s active flag.
     * 8. Return result.
     */ traverser._activeFlag = false;
    return result;
}
exports.traversal_filter = traversal_filter;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NodeIteratorAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const TraversalAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TraversalAlgorithm.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
/**
 * Returns the next or previous node in the subtree, or `null` if
 * there are none.
 *
 * @param iterator - the `NodeIterator` instance
 * @param forward- `true` to return the next node, or `false` to
 * return the previous node.
 */ function nodeIterator_traverse(iterator, forward) {
    /**
     * 1. Let node be iterator’s reference.
     * 2. Let beforeNode be iterator’s pointer before reference.
     */ let node = iterator._reference;
    let beforeNode = iterator._pointerBeforeReference;
    /**
     * 3. While true:
     */ while(true){
        /**
         * 3.1. Branch on direction:
         */ if (forward) {
            /**
             * - next
             */ if (!beforeNode) {
                /**
                 * If beforeNode is false, then set node to the first node following
                 * node in iterator’s iterator collection. If there is no such node,
                 * then return null.
                 */ const nextNode = TreeAlgorithm_1.tree_getFollowingNode(iterator._root, node);
                if (nextNode) {
                    node = nextNode;
                } else {
                    return null;
                }
            } else {
                /**
                 * If beforeNode is true, then set it to false.
                 */ beforeNode = false;
            }
        } else {
            /**
             * - previous
             */ if (beforeNode) {
                /**
                 * If beforeNode is true, then set node to the first node preceding
                 * node in iterator’s iterator collection. If there is no such node,
                 * then return null.
                 */ const prevNode = TreeAlgorithm_1.tree_getPrecedingNode(iterator.root, node);
                if (prevNode) {
                    node = prevNode;
                } else {
                    return null;
                }
            } else {
                /**
                 * If beforeNode is false, then set it to true.
                 */ beforeNode = true;
            }
        }
        /**
         * 3.2. Let result be the result of filtering node within iterator.
         * 3.3. If result is FILTER_ACCEPT, then break.
         */ const result = TraversalAlgorithm_1.traversal_filter(iterator, node);
        if (result === interfaces_1.FilterResult.Accept) {
            break;
        }
    }
    /**
     * 4. Set iterator’s reference to node.
     * 5. Set iterator’s pointer before reference to beforeNode.
     * 6. Return node.
     */ iterator._reference = node;
    iterator._pointerBeforeReference = beforeNode;
    return node;
}
exports.nodeIterator_traverse = nodeIterator_traverse;
/**
 * Gets the global iterator list.
 */ function nodeIterator_iteratorList() {
    return dom_1.dom.window._iteratorList;
}
exports.nodeIterator_iteratorList = nodeIterator_iteratorList;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/XMLAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Determines if the given string is valid for a `"Name"` construct.
 *
 * @param name - name string to test
 */ function xml_isName(name) {
    for(let i = 0; i < name.length; i++){
        let n = name.charCodeAt(i);
        // NameStartChar
        if (n >= 97 && n <= 122 || n >= 65 && n <= 90 || // [A-Z]
        n === 58 || n === 95 || n >= 0xC0 && n <= 0xD6 || n >= 0xD8 && n <= 0xF6 || n >= 0xF8 && n <= 0x2FF || n >= 0x370 && n <= 0x37D || n >= 0x37F && n <= 0x1FFF || n >= 0x200C && n <= 0x200D || n >= 0x2070 && n <= 0x218F || n >= 0x2C00 && n <= 0x2FEF || n >= 0x3001 && n <= 0xD7FF || n >= 0xF900 && n <= 0xFDCF || n >= 0xFDF0 && n <= 0xFFFD) {
            continue;
        } else if (i !== 0 && (n === 45 || n === 46 || n >= 48 && n <= 57 || n === 0xB7 || n >= 0x0300 && n <= 0x036F || n >= 0x203F && n <= 0x2040)) {
            continue;
        }
        if (n >= 0xD800 && n <= 0xDBFF && i < name.length - 1) {
            const n2 = name.charCodeAt(i + 1);
            if (n2 >= 0xDC00 && n2 <= 0xDFFF) {
                n = (n - 0xD800) * 0x400 + n2 - 0xDC00 + 0x10000;
                i++;
                if (n >= 0x10000 && n <= 0xEFFFF) {
                    continue;
                }
            }
        }
        return false;
    }
    return true;
}
exports.xml_isName = xml_isName;
/**
 * Determines if the given string is valid for a `"QName"` construct.
 *
 * @param name - name string to test
 */ function xml_isQName(name) {
    let colonFound = false;
    for(let i = 0; i < name.length; i++){
        let n = name.charCodeAt(i);
        // NameStartChar
        if (n >= 97 && n <= 122 || n >= 65 && n <= 90 || // [A-Z]
        n === 95 || n >= 0xC0 && n <= 0xD6 || n >= 0xD8 && n <= 0xF6 || n >= 0xF8 && n <= 0x2FF || n >= 0x370 && n <= 0x37D || n >= 0x37F && n <= 0x1FFF || n >= 0x200C && n <= 0x200D || n >= 0x2070 && n <= 0x218F || n >= 0x2C00 && n <= 0x2FEF || n >= 0x3001 && n <= 0xD7FF || n >= 0xF900 && n <= 0xFDCF || n >= 0xFDF0 && n <= 0xFFFD) {
            continue;
        } else if (i !== 0 && (n === 45 || n === 46 || n >= 48 && n <= 57 || n === 0xB7 || n >= 0x0300 && n <= 0x036F || n >= 0x203F && n <= 0x2040)) {
            continue;
        } else if (i !== 0 && n === 58) {
            if (colonFound) return false; // multiple colons in qname
            if (i === name.length - 1) return false; // colon at the end of qname
            colonFound = true;
            continue;
        }
        if (n >= 0xD800 && n <= 0xDBFF && i < name.length - 1) {
            const n2 = name.charCodeAt(i + 1);
            if (n2 >= 0xDC00 && n2 <= 0xDFFF) {
                n = (n - 0xD800) * 0x400 + n2 - 0xDC00 + 0x10000;
                i++;
                if (n >= 0x10000 && n <= 0xEFFFF) {
                    continue;
                }
            }
        }
        return false;
    }
    return true;
}
exports.xml_isQName = xml_isQName;
/**
 * Determines if the given string contains legal characters.
 *
 * @param chars - sequence of characters to test
 */ function xml_isLegalChar(chars) {
    for(let i = 0; i < chars.length; i++){
        let n = chars.charCodeAt(i);
        // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
        if (n === 0x9 || n === 0xA || n === 0xD || n >= 0x20 && n <= 0xD7FF || n >= 0xE000 && n <= 0xFFFD) {
            continue;
        }
        if (n >= 0xD800 && n <= 0xDBFF && i < chars.length - 1) {
            const n2 = chars.charCodeAt(i + 1);
            if (n2 >= 0xDC00 && n2 <= 0xDFFF) {
                n = (n - 0xD800) * 0x400 + n2 - 0xDC00 + 0x10000;
                i++;
                if (n >= 0x10000 && n <= 0x10FFFF) {
                    continue;
                }
            }
        }
        return false;
    }
    return true;
}
exports.xml_isLegalChar = xml_isLegalChar;
/**
 * Determines if the given string contains legal characters for a public
 * identifier.
 *
 * @param chars - sequence of characters to test
 */ function xml_isPubidChar(chars) {
    for(let i = 0; i < chars.length; i++){
        // PubId chars are all in the ASCII range, no need to check surrogates
        const n = chars.charCodeAt(i);
        // #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]
        if (n >= 97 && n <= 122 || n >= 65 && n <= 90 || n >= 39 && n <= 59 || // ['()*+,-./] | [0-9] | [:;]
        n === 0x20 || n === 0xD || n === 0xA || n >= 35 && n <= 37 || // [#$%]
        n === 33 || // !
        n === 61 || n === 63 || n === 64 || n === 95) {
            continue;
        } else {
            return false;
        }
    }
    return true;
}
exports.xml_isPubidChar = xml_isPubidChar;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NamespaceAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const XMLAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/XMLAlgorithm.js [app-route] (ecmascript)");
/**
 * Validates the given qualified name.
 *
 * @param qualifiedName - qualified name
 */ function namespace_validate(qualifiedName) {
    /**
     * To validate a qualifiedName, throw an "InvalidCharacterError"
     * DOMException if qualifiedName does not match the Name or QName
     * production.
     */ if (!XMLAlgorithm_1.xml_isName(qualifiedName)) throw new DOMException_1.InvalidCharacterError(`Invalid XML name: ${qualifiedName}`);
    if (!XMLAlgorithm_1.xml_isQName(qualifiedName)) throw new DOMException_1.InvalidCharacterError(`Invalid XML qualified name: ${qualifiedName}.`);
}
exports.namespace_validate = namespace_validate;
/**
 * Validates and extracts a namespace, prefix and localName from the
 * given namespace and qualified name.
 * See: https://dom.spec.whatwg.org/#validate-and-extract.
 *
 * @param namespace - namespace
 * @param qualifiedName - qualified name
 *
 * @returns a tuple with `namespace`, `prefix` and `localName`.
 */ function namespace_validateAndExtract(namespace, qualifiedName) {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. Validate qualifiedName.
     * 3. Let prefix be null.
     * 4. Let localName be qualifiedName.
     * 5. If qualifiedName contains a ":" (U+003E), then split the string on it
     * and set prefix to the part before and localName to the part after.
     * 6. If prefix is non-null and namespace is null, then throw a
     * "NamespaceError" DOMException.
     * 7. If prefix is "xml" and namespace is not the XML namespace, then throw
     * a "NamespaceError" DOMException.
     * 8. If either qualifiedName or prefix is "xmlns" and namespace is not the
     * XMLNS namespace, then throw a "NamespaceError" DOMException.
     * 9. If namespace is the XMLNS namespace and neither qualifiedName nor
     * prefix is "xmlns", then throw a "NamespaceError" DOMException.
     * 10. Return namespace, prefix, and localName.
     */ if (!namespace) namespace = null;
    namespace_validate(qualifiedName);
    const parts = qualifiedName.split(':');
    const prefix = parts.length === 2 ? parts[0] : null;
    const localName = parts.length === 2 ? parts[1] : qualifiedName;
    if (prefix && namespace === null) throw new DOMException_1.NamespaceError("Qualified name includes a prefix but the namespace is null.");
    if (prefix === "xml" && namespace !== infra_1.namespace.XML) throw new DOMException_1.NamespaceError(`Qualified name includes the "xml" prefix but the namespace is not the XML namespace.`);
    if (namespace !== infra_1.namespace.XMLNS && (prefix === "xmlns" || qualifiedName === "xmlns")) throw new DOMException_1.NamespaceError(`Qualified name includes the "xmlns" prefix but the namespace is not the XMLNS namespace.`);
    if (namespace === infra_1.namespace.XMLNS && prefix !== "xmlns" && qualifiedName !== "xmlns") throw new DOMException_1.NamespaceError(`Qualified name does not include the "xmlns" prefix but the namespace is the XMLNS namespace.`);
    return [
        namespace,
        prefix,
        localName
    ];
}
exports.namespace_validateAndExtract = namespace_validateAndExtract;
/**
 * Extracts a prefix and localName from the given qualified name.
 *
 * @param qualifiedName - qualified name
 *
 * @returns an tuple with `prefix` and `localName`.
 */ function namespace_extractQName(qualifiedName) {
    namespace_validate(qualifiedName);
    const parts = qualifiedName.split(':');
    const prefix = parts.length === 2 ? parts[0] : null;
    const localName = parts.length === 2 ? parts[1] : qualifiedName;
    return [
        prefix,
        localName
    ];
}
exports.namespace_extractQName = namespace_extractQName;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DocumentAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const util_2 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const ElementImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/ElementImpl.js [app-route] (ecmascript)");
const CustomElementAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CustomElementAlgorithm.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const NamespaceAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NamespaceAlgorithm.js [app-route] (ecmascript)");
const DOMAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)");
const ElementAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ElementAlgorithm.js [app-route] (ecmascript)");
const MutationAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationAlgorithm.js [app-route] (ecmascript)");
/**
 * Returns an element interface for the given name and namespace.
 *
 * @param name - element name
 * @param namespace - namespace
 */ function document_elementInterface(name, namespace) {
    return ElementImpl_1.ElementImpl;
}
exports.document_elementInterface = document_elementInterface;
/**
 * Creates a new element node.
 * See: https://dom.spec.whatwg.org/#internal-createelementns-steps
 *
 * @param document - owner document
 * @param namespace - element namespace
 * @param qualifiedName - qualified name
 * @param options - element options
 */ function document_internalCreateElementNS(document, namespace, qualifiedName, options) {
    /**
     * 1. Let namespace, prefix, and localName be the result of passing
     * namespace and qualifiedName to validate and extract.
     * 2. Let is be null.
     * 3. If options is a dictionary and options’s is is present, then set
     * is to it.
     * 4. Return the result of creating an element given document, localName,
     * namespace, prefix, is, and with the synchronous custom elements flag set.
     */ const [ns, prefix, localName] = NamespaceAlgorithm_1.namespace_validateAndExtract(namespace, qualifiedName);
    let is = null;
    if (options !== undefined) {
        if (util_2.isString(options)) {
            is = options;
        } else {
            is = options.is;
        }
    }
    return ElementAlgorithm_1.element_createAnElement(document, localName, ns, prefix, is, true);
}
exports.document_internalCreateElementNS = document_internalCreateElementNS;
/**
 * Removes `node` and its subtree from its document and changes
 * its owner document to `document` so that it can be inserted
 * into `document`.
 *
 * @param node - the node to move
 * @param document - document to receive the node and its subtree
 */ function document_adopt(node, document) {
    // Optimize for common case of inserting a fresh node
    if (node._nodeDocument === document && node._parent === null) {
        return;
    }
    /**
     * 1. Let oldDocument be node’s node document.
     * 2. If node’s parent is not null, remove node from its parent.
     */ const oldDocument = node._nodeDocument;
    if (node._parent) MutationAlgorithm_1.mutation_remove(node, node._parent);
    /**
     * 3. If document is not oldDocument, then:
     */ if (document !== oldDocument) {
        /**
         * 3.1. For each inclusiveDescendant in node’s shadow-including inclusive
         * descendants:
         */ let inclusiveDescendant = TreeAlgorithm_1.tree_getFirstDescendantNode(node, true, true);
        while(inclusiveDescendant !== null){
            /**
             * 3.1.1. Set inclusiveDescendant’s node document to document.
             * 3.1.2. If inclusiveDescendant is an element, then set the node
             * document of each attribute in inclusiveDescendant’s attribute list
             * to document.
             */ inclusiveDescendant._nodeDocument = document;
            if (util_1.Guard.isElementNode(inclusiveDescendant)) {
                for (const attr of inclusiveDescendant._attributeList._asArray()){
                    attr._nodeDocument = document;
                }
            }
            /**
             * 3.2. For each inclusiveDescendant in node's shadow-including
             * inclusive descendants that is custom, enqueue a custom
             * element callback reaction with inclusiveDescendant,
             * callback name "adoptedCallback", and an argument list
             * containing oldDocument and document.
             */ if (dom_1.dom.features.customElements) {
                if (util_1.Guard.isElementNode(inclusiveDescendant) && inclusiveDescendant._customElementState === "custom") {
                    CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(inclusiveDescendant, "adoptedCallback", [
                        oldDocument,
                        document
                    ]);
                }
            }
            /**
             * 3.3. For each inclusiveDescendant in node’s shadow-including
             * inclusive descendants, in shadow-including tree order, run the
             * adopting steps with inclusiveDescendant and oldDocument.
             */ if (dom_1.dom.features.steps) {
                DOMAlgorithm_1.dom_runAdoptingSteps(inclusiveDescendant, oldDocument);
            }
            inclusiveDescendant = TreeAlgorithm_1.tree_getNextDescendantNode(node, inclusiveDescendant, true, true);
        }
    }
}
exports.document_adopt = document_adopt;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const util_2 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const CustomElementAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CustomElementAlgorithm.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const NodeIteratorAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NodeIteratorAlgorithm.js [app-route] (ecmascript)");
const ShadowTreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ShadowTreeAlgorithm.js [app-route] (ecmascript)");
const MutationObserverAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationObserverAlgorithm.js [app-route] (ecmascript)");
const DOMAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)");
const DocumentAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DocumentAlgorithm.js [app-route] (ecmascript)");
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */ function mutation_ensurePreInsertionValidity(node, parent, child) {
    const parentNodeType = parent._nodeType;
    const nodeNodeType = node._nodeType;
    const childNodeType = child ? child._nodeType : null;
    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */ if (parentNodeType !== interfaces_1.NodeType.Document && parentNodeType !== interfaces_1.NodeType.DocumentFragment && parentNodeType !== interfaces_1.NodeType.Element) throw new DOMException_1.HierarchyRequestError(`Only document, document fragment and element nodes can contain child nodes. Parent node is ${parent.nodeName}.`);
    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a
     * "HierarchyRequestError" DOMException.
     */ if (TreeAlgorithm_1.tree_isHostIncludingAncestorOf(parent, node, true)) throw new DOMException_1.HierarchyRequestError(`The node to be inserted cannot be an inclusive ancestor of parent node. Node is ${node.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 3. If child is not null and its parent is not parent, then throw a
     * "NotFoundError" DOMException.
     */ if (child !== null && child._parent !== parent) throw new DOMException_1.NotFoundError(`The reference child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 4. If node is not a DocumentFragment, DocumentType, Element, Text,
     * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError"
     * DOMException.
     */ if (nodeNodeType !== interfaces_1.NodeType.DocumentFragment && nodeNodeType !== interfaces_1.NodeType.DocumentType && nodeNodeType !== interfaces_1.NodeType.Element && nodeNodeType !== interfaces_1.NodeType.Text && nodeNodeType !== interfaces_1.NodeType.ProcessingInstruction && nodeNodeType !== interfaces_1.NodeType.CData && nodeNodeType !== interfaces_1.NodeType.Comment) throw new DOMException_1.HierarchyRequestError(`Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is ${node.nodeName}.`);
    /**
     * 5. If either node is a Text node and parent is a document, or node is a
     * doctype and parent is not a document, throw a "HierarchyRequestError"
     * DOMException.
     */ if (nodeNodeType === interfaces_1.NodeType.Text && parentNodeType === interfaces_1.NodeType.Document) throw new DOMException_1.HierarchyRequestError(`Cannot insert a text node as a child of a document node. Node is ${node.nodeName}.`);
    if (nodeNodeType === interfaces_1.NodeType.DocumentType && parentNodeType !== interfaces_1.NodeType.Document) throw new DOMException_1.HierarchyRequestError(`A document type node can only be inserted under a document node. Parent node is ${parent.nodeName}.`);
    /**
     * 6. If parent is a document, and any of the statements below, switched on
     * node, are true, throw a "HierarchyRequestError" DOMException.
     * - DocumentFragment node
     * If node has more than one element child or has a Text node child.
     * Otherwise, if node has one element child and either parent has an element
     * child, child is a doctype, or child is not null and a doctype is
     * following child.
     * - element
     * parent has an element child, child is a doctype, or child is not null and
     * a doctype is following child.
     * - doctype
     * parent has a doctype child, child is non-null and an element is preceding
     * child, or child is null and parent has an element child.
     */ if (parentNodeType === interfaces_1.NodeType.Document) {
        if (nodeNodeType === interfaces_1.NodeType.DocumentFragment) {
            let eleCount = 0;
            for (const childNode of node._children){
                if (childNode._nodeType === interfaces_1.NodeType.Element) eleCount++;
                else if (childNode._nodeType === interfaces_1.NodeType.Text) throw new DOMException_1.HierarchyRequestError(`Cannot insert text a node as a child of a document node. Node is ${childNode.nodeName}.`);
            }
            if (eleCount > 1) {
                throw new DOMException_1.HierarchyRequestError(`A document node can only have one document element node. Document fragment to be inserted has ${eleCount} element nodes.`);
            } else if (eleCount === 1) {
                for (const ele of parent._children){
                    if (ele._nodeType === interfaces_1.NodeType.Element) throw new DOMException_1.HierarchyRequestError(`The document node already has a document element node.`);
                }
                if (child) {
                    if (childNodeType === interfaces_1.NodeType.DocumentType) throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node.`);
                    let doctypeChild = child._nextSibling;
                    while(doctypeChild){
                        if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType) throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node.`);
                        doctypeChild = doctypeChild._nextSibling;
                    }
                }
            }
        } else if (nodeNodeType === interfaces_1.NodeType.Element) {
            for (const ele of parent._children){
                if (ele._nodeType === interfaces_1.NodeType.Element) throw new DOMException_1.HierarchyRequestError(`Document already has a document element node. Node is ${node.nodeName}.`);
            }
            if (child) {
                if (childNodeType === interfaces_1.NodeType.DocumentType) throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`);
                let doctypeChild = child._nextSibling;
                while(doctypeChild){
                    if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType) throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`);
                    doctypeChild = doctypeChild._nextSibling;
                }
            }
        } else if (nodeNodeType === interfaces_1.NodeType.DocumentType) {
            for (const ele of parent._children){
                if (ele._nodeType === interfaces_1.NodeType.DocumentType) throw new DOMException_1.HierarchyRequestError(`Document already has a document type node. Node is ${node.nodeName}.`);
            }
            if (child) {
                let elementChild = child._previousSibling;
                while(elementChild){
                    if (elementChild._nodeType === interfaces_1.NodeType.Element) throw new DOMException_1.HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`);
                    elementChild = elementChild._previousSibling;
                }
            } else {
                let elementChild = parent._firstChild;
                while(elementChild){
                    if (elementChild._nodeType === interfaces_1.NodeType.Element) throw new DOMException_1.HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`);
                    elementChild = elementChild._nextSibling;
                }
            }
        }
    }
}
exports.mutation_ensurePreInsertionValidity = mutation_ensurePreInsertionValidity;
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child, then adopts the node to the tree and inserts it.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */ function mutation_preInsert(node, parent, child) {
    /**
     * 1. Ensure pre-insertion validity of node into parent before child.
     * 2. Let reference child be child.
     * 3. If reference child is node, set it to node’s next sibling.
     * 4. Adopt node into parent’s node document.
     * 5. Insert node into parent before reference child.
     * 6. Return node.
     */ mutation_ensurePreInsertionValidity(node, parent, child);
    let referenceChild = child;
    if (referenceChild === node) referenceChild = node._nextSibling;
    DocumentAlgorithm_1.document_adopt(node, parent._nodeDocument);
    mutation_insert(node, parent, referenceChild);
    return node;
}
exports.mutation_preInsert = mutation_preInsert;
/**
 * Inserts a node into a parent node before the given child node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 * @param suppressObservers - whether to notify observers
 */ function mutation_insert(node, parent, child, suppressObservers) {
    // Optimized common case
    if (child === null && node._nodeType !== interfaces_1.NodeType.DocumentFragment) {
        mutation_insert_single(node, parent, suppressObservers);
        return;
    }
    /**
     * 1. Let count be the number of children of node if it is a
     * DocumentFragment node, and one otherwise.
     */ const count = node._nodeType === interfaces_1.NodeType.DocumentFragment ? node._children.size : 1;
    /**
     * 2. If child is non-null, then:
     */ if (child !== null) {
        /**
         * 2.1. For each live range whose start node is parent and start
         * offset is greater than child's index, increase its start
         * offset by count.
         * 2.2. For each live range whose end node is parent and end
         * offset is greater than child's index, increase its end
         * offset by count.
         */ if (dom_1.dom.rangeList.size !== 0) {
            const index = TreeAlgorithm_1.tree_index(child);
            for (const range of dom_1.dom.rangeList){
                if (range._start[0] === parent && range._start[1] > index) {
                    range._start[1] += count;
                }
                if (range._end[0] === parent && range._end[1] > index) {
                    range._end[1] += count;
                }
            }
        }
    }
    /**
     * 3. Let nodes be node’s children, if node is a DocumentFragment node;
     * otherwise « node ».
     */ const nodes = node._nodeType === interfaces_1.NodeType.DocumentFragment ? new Array(...node._children) : [
        node
    ];
    /**
     * 4. If node is a DocumentFragment node, remove its children with the
     * suppress observers flag set.
     */ if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        while(node._firstChild){
            mutation_remove(node._firstChild, node, true);
        }
    }
    /**
     * 5. If node is a DocumentFragment node, then queue a tree mutation record
     * for node with « », nodes, null, and null.
     */ if (dom_1.dom.features.mutationObservers) {
        if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(node, [], nodes, null, null);
        }
    }
    /**
     * 6. Let previousSibling be child’s previous sibling or parent’s last
     * child if child is null.
     */ const previousSibling = child ? child._previousSibling : parent._lastChild;
    let index = child === null ? -1 : TreeAlgorithm_1.tree_index(child);
    /**
     * 7. For each node in nodes, in tree order:
     */ for(let i = 0; i < nodes.length; i++){
        const node = nodes[i];
        if (util_1.Guard.isElementNode(node)) {
            // set document element node
            if (util_1.Guard.isDocumentNode(parent)) {
                parent._documentElement = node;
            }
            // mark that the document has namespaces
            if (!node._nodeDocument._hasNamespaces && (node._namespace !== null || node._namespacePrefix !== null)) {
                node._nodeDocument._hasNamespaces = true;
            }
        }
        /**
         * 7.1. If child is null, then append node to parent’s children.
         * 7.2. Otherwise, insert node into parent’s children before child’s
         * index.
         */ node._parent = parent;
        if (child === null) {
            infra_1.set.append(parent._children, node);
        } else {
            infra_1.set.insert(parent._children, node, index);
            index++;
        }
        // assign siblings and children for quick lookups
        if (parent._firstChild === null) {
            node._previousSibling = null;
            node._nextSibling = null;
            parent._firstChild = node;
            parent._lastChild = node;
        } else {
            const prev = child ? child._previousSibling : parent._lastChild;
            const next = child ? child : null;
            node._previousSibling = prev;
            node._nextSibling = next;
            if (prev) prev._nextSibling = node;
            if (next) next._previousSibling = node;
            if (!prev) parent._firstChild = node;
            if (!next) parent._lastChild = node;
        }
        /**
         * 7.3. If parent is a shadow host and node is a slotable, then
         * assign a slot for node.
         */ if (dom_1.dom.features.slots) {
            if (parent._shadowRoot !== null && util_1.Guard.isSlotable(node)) {
                ShadowTreeAlgorithm_1.shadowTree_assignASlot(node);
            }
        }
        /**
         * 7.4. If node is a Text node, run the child text content change
         * steps for parent.
         */ if (dom_1.dom.features.steps) {
            if (util_1.Guard.isTextNode(node)) {
                DOMAlgorithm_1.dom_runChildTextContentChangeSteps(parent);
            }
        }
        /**
         * 7.5. If parent's root is a shadow root, and parent is a slot
         * whose assigned nodes is the empty list, then run signal
         * a slot change for parent.
         */ if (dom_1.dom.features.slots) {
            if (util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(parent)) && util_1.Guard.isSlot(parent) && util_2.isEmpty(parent._assignedNodes)) {
                ShadowTreeAlgorithm_1.shadowTree_signalASlotChange(parent);
            }
        }
        /**
         * 7.6. Run assign slotables for a tree with node's root.
         */ if (dom_1.dom.features.slots) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(node));
        }
        /**
         * 7.7. For each shadow-including inclusive descendant
         * inclusiveDescendant of node, in shadow-including tree
         * order:
         */ let inclusiveDescendant = TreeAlgorithm_1.tree_getFirstDescendantNode(node, true, true);
        while(inclusiveDescendant !== null){
            /**
             * 7.7.1. Run the insertion steps with inclusiveDescendant.
             */ if (dom_1.dom.features.steps) {
                DOMAlgorithm_1.dom_runInsertionSteps(inclusiveDescendant);
            }
            if (dom_1.dom.features.customElements) {
                /**
                 * 7.7.2. If inclusiveDescendant is connected, then:
                 */ if (util_1.Guard.isElementNode(inclusiveDescendant) && ShadowTreeAlgorithm_1.shadowTree_isConnected(inclusiveDescendant)) {
                    if (util_1.Guard.isCustomElementNode(inclusiveDescendant)) {
                        /**
                         * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
                         * element callback reaction with inclusiveDescendant, callback name
                         * "connectedCallback", and an empty argument list.
                         */ CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(inclusiveDescendant, "connectedCallback", []);
                    } else {
                        /**
                         * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
                         */ CustomElementAlgorithm_1.customElement_tryToUpgrade(inclusiveDescendant);
                    }
                }
            }
            inclusiveDescendant = TreeAlgorithm_1.tree_getNextDescendantNode(node, inclusiveDescendant, true, true);
        }
    }
    /**
     * 8. If suppress observers flag is unset, then queue a tree mutation record
     * for parent with nodes, « », previousSibling, and child.
     */ if (dom_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, nodes, [], previousSibling, child);
        }
    }
}
exports.mutation_insert = mutation_insert;
/**
 * Inserts a node into a parent node. Optimized routine for the common case where
 * node is not a document fragment node and it has no child nodes.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param suppressObservers - whether to notify observers
 */ function mutation_insert_single(node, parent, suppressObservers) {
    /**
     * 1. Let count be the number of children of node if it is a
     * DocumentFragment node, and one otherwise.
     * 2. If child is non-null, then:
     * 2.1. For each live range whose start node is parent and start
     * offset is greater than child's index, increase its start
     * offset by count.
     * 2.2. For each live range whose end node is parent and end
     * offset is greater than child's index, increase its end
     * offset by count.
     * 3. Let nodes be node’s children, if node is a DocumentFragment node;
     * otherwise « node ».
     * 4. If node is a DocumentFragment node, remove its children with the
     * suppress observers flag set.
     * 5. If node is a DocumentFragment node, then queue a tree mutation record
     * for node with « », nodes, null, and null.
     */ /**
     * 6. Let previousSibling be child’s previous sibling or parent’s last
     * child if child is null.
     */ const previousSibling = parent._lastChild;
    // set document element node
    if (util_1.Guard.isElementNode(node)) {
        // set document element node
        if (util_1.Guard.isDocumentNode(parent)) {
            parent._documentElement = node;
        }
        // mark that the document has namespaces
        if (!node._nodeDocument._hasNamespaces && (node._namespace !== null || node._namespacePrefix !== null)) {
            node._nodeDocument._hasNamespaces = true;
        }
    }
    /**
     * 7. For each node in nodes, in tree order:
     * 7.1. If child is null, then append node to parent’s children.
     * 7.2. Otherwise, insert node into parent’s children before child’s
     * index.
     */ node._parent = parent;
    parent._children.add(node);
    // assign siblings and children for quick lookups
    if (parent._firstChild === null) {
        node._previousSibling = null;
        node._nextSibling = null;
        parent._firstChild = node;
        parent._lastChild = node;
    } else {
        const prev = parent._lastChild;
        node._previousSibling = prev;
        node._nextSibling = null;
        if (prev) prev._nextSibling = node;
        if (!prev) parent._firstChild = node;
        parent._lastChild = node;
    }
    /**
     * 7.3. If parent is a shadow host and node is a slotable, then
     * assign a slot for node.
     */ if (dom_1.dom.features.slots) {
        if (parent._shadowRoot !== null && util_1.Guard.isSlotable(node)) {
            ShadowTreeAlgorithm_1.shadowTree_assignASlot(node);
        }
    }
    /**
     * 7.4. If node is a Text node, run the child text content change
     * steps for parent.
     */ if (dom_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node)) {
            DOMAlgorithm_1.dom_runChildTextContentChangeSteps(parent);
        }
    }
    /**
     * 7.5. If parent's root is a shadow root, and parent is a slot
     * whose assigned nodes is the empty list, then run signal
     * a slot change for parent.
     */ if (dom_1.dom.features.slots) {
        if (util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(parent)) && util_1.Guard.isSlot(parent) && util_2.isEmpty(parent._assignedNodes)) {
            ShadowTreeAlgorithm_1.shadowTree_signalASlotChange(parent);
        }
    }
    /**
     * 7.6. Run assign slotables for a tree with node's root.
     */ if (dom_1.dom.features.slots) {
        ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(node));
    }
    /**
     * 7.7. For each shadow-including inclusive descendant
     * inclusiveDescendant of node, in shadow-including tree
     * order:
     * 7.7.1. Run the insertion steps with inclusiveDescendant.
     */ if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runInsertionSteps(node);
    }
    if (dom_1.dom.features.customElements) {
        /**
         * 7.7.2. If inclusiveDescendant is connected, then:
         */ if (util_1.Guard.isElementNode(node) && ShadowTreeAlgorithm_1.shadowTree_isConnected(node)) {
            if (util_1.Guard.isCustomElementNode(node)) {
                /**
                 * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
                 * element callback reaction with inclusiveDescendant, callback name
                 * "connectedCallback", and an empty argument list.
                 */ CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(node, "connectedCallback", []);
            } else {
                /**
                 * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
                 */ CustomElementAlgorithm_1.customElement_tryToUpgrade(node);
            }
        }
    }
    /**
     * 8. If suppress observers flag is unset, then queue a tree mutation record
     * for parent with nodes, « », previousSibling, and child.
     */ if (dom_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, [
                node
            ], [], previousSibling, null);
        }
    }
}
/**
 * Appends a node to the children of a parent node.
 *
 * @param node - a node
 * @param parent - the parent to receive node
 */ function mutation_append(node, parent) {
    /**
     * To append a node to a parent, pre-insert node into parent before null.
     */ return mutation_preInsert(node, parent, null);
}
exports.mutation_append = mutation_append;
/**
 * Replaces a node with another node.
 *
 * @param child - child node to remove
 * @param node - node to insert
 * @param parent - parent node to receive node
 */ function mutation_replace(child, node, parent) {
    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */ if (parent._nodeType !== interfaces_1.NodeType.Document && parent._nodeType !== interfaces_1.NodeType.DocumentFragment && parent._nodeType !== interfaces_1.NodeType.Element) throw new DOMException_1.HierarchyRequestError(`Only document, document fragment and element nodes can contain child nodes. Parent node is ${parent.nodeName}.`);
    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a
     * "HierarchyRequestError" DOMException.
     */ if (TreeAlgorithm_1.tree_isHostIncludingAncestorOf(parent, node, true)) throw new DOMException_1.HierarchyRequestError(`The node to be inserted cannot be an ancestor of parent node. Node is ${node.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 3. If child’s parent is not parent, then throw a "NotFoundError"
     * DOMException.
     */ if (child._parent !== parent) throw new DOMException_1.NotFoundError(`The reference child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 4. If node is not a DocumentFragment, DocumentType, Element, Text,
     * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError"
     * DOMException.
     */ if (node._nodeType !== interfaces_1.NodeType.DocumentFragment && node._nodeType !== interfaces_1.NodeType.DocumentType && node._nodeType !== interfaces_1.NodeType.Element && node._nodeType !== interfaces_1.NodeType.Text && node._nodeType !== interfaces_1.NodeType.ProcessingInstruction && node._nodeType !== interfaces_1.NodeType.CData && node._nodeType !== interfaces_1.NodeType.Comment) throw new DOMException_1.HierarchyRequestError(`Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is ${node.nodeName}.`);
    /**
     * 5. If either node is a Text node and parent is a document, or node is a
     * doctype and parent is not a document, throw a "HierarchyRequestError"
     * DOMException.
     */ if (node._nodeType === interfaces_1.NodeType.Text && parent._nodeType === interfaces_1.NodeType.Document) throw new DOMException_1.HierarchyRequestError(`Cannot insert a text node as a child of a document node. Node is ${node.nodeName}.`);
    if (node._nodeType === interfaces_1.NodeType.DocumentType && parent._nodeType !== interfaces_1.NodeType.Document) throw new DOMException_1.HierarchyRequestError(`A document type node can only be inserted under a document node. Parent node is ${parent.nodeName}.`);
    /**
     * 6. If parent is a document, and any of the statements below, switched on
     * node, are true, throw a "HierarchyRequestError" DOMException.
     * - DocumentFragment node
     * If node has more than one element child or has a Text node child.
     * Otherwise, if node has one element child and either parent has an element
     * child that is not child or a doctype is following child.
     * - element
     * parent has an element child that is not child or a doctype is
     * following child.
     * - doctype
     * parent has a doctype child that is not child, or an element is
     * preceding child.
     */ if (parent._nodeType === interfaces_1.NodeType.Document) {
        if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
            let eleCount = 0;
            for (const childNode of node._children){
                if (childNode._nodeType === interfaces_1.NodeType.Element) eleCount++;
                else if (childNode._nodeType === interfaces_1.NodeType.Text) throw new DOMException_1.HierarchyRequestError(`Cannot insert text a node as a child of a document node. Node is ${childNode.nodeName}.`);
            }
            if (eleCount > 1) {
                throw new DOMException_1.HierarchyRequestError(`A document node can only have one document element node. Document fragment to be inserted has ${eleCount} element nodes.`);
            } else if (eleCount === 1) {
                for (const ele of parent._children){
                    if (ele._nodeType === interfaces_1.NodeType.Element && ele !== child) throw new DOMException_1.HierarchyRequestError(`The document node already has a document element node.`);
                }
                let doctypeChild = child._nextSibling;
                while(doctypeChild){
                    if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType) throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node.`);
                    doctypeChild = doctypeChild._nextSibling;
                }
            }
        } else if (node._nodeType === interfaces_1.NodeType.Element) {
            for (const ele of parent._children){
                if (ele._nodeType === interfaces_1.NodeType.Element && ele !== child) throw new DOMException_1.HierarchyRequestError(`Document already has a document element node. Node is ${node.nodeName}.`);
            }
            let doctypeChild = child._nextSibling;
            while(doctypeChild){
                if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType) throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`);
                doctypeChild = doctypeChild._nextSibling;
            }
        } else if (node._nodeType === interfaces_1.NodeType.DocumentType) {
            for (const ele of parent._children){
                if (ele._nodeType === interfaces_1.NodeType.DocumentType && ele !== child) throw new DOMException_1.HierarchyRequestError(`Document already has a document type node. Node is ${node.nodeName}.`);
            }
            let elementChild = child._previousSibling;
            while(elementChild){
                if (elementChild._nodeType === interfaces_1.NodeType.Element) throw new DOMException_1.HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`);
                elementChild = elementChild._previousSibling;
            }
        }
    }
    /**
     * 7. Let reference child be child’s next sibling.
     * 8. If reference child is node, set it to node’s next sibling.
     * 8. Let previousSibling be child’s previous sibling.
     */ let referenceChild = child._nextSibling;
    if (referenceChild === node) referenceChild = node._nextSibling;
    let previousSibling = child._previousSibling;
    /**
     * 10. Adopt node into parent’s node document.
     * 11. Let removedNodes be the empty list.
     */ DocumentAlgorithm_1.document_adopt(node, parent._nodeDocument);
    const removedNodes = [];
    /**
     * 12. If child’s parent is not null, then:
     */ if (child._parent !== null) {
        /**
         * 12.1. Set removedNodes to [child].
         * 12.2. Remove child from its parent with the suppress observers flag
         * set.
         */ removedNodes.push(child);
        mutation_remove(child, child._parent, true);
    }
    /**
     * 13. Let nodes be node’s children if node is a DocumentFragment node;
     * otherwise [node].
     */ let nodes = [];
    if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        nodes = Array.from(node._children);
    } else {
        nodes.push(node);
    }
    /**
     * 14. Insert node into parent before reference child with the suppress
     * observers flag set.
     */ mutation_insert(node, parent, referenceChild, true);
    /**
     * 15. Queue a tree mutation record for parent with nodes, removedNodes,
     * previousSibling, and reference child.
     */ if (dom_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, nodes, removedNodes, previousSibling, referenceChild);
    }
    /**
     * 16. Return child.
     */ return child;
}
exports.mutation_replace = mutation_replace;
/**
 * Replaces all nodes of a parent with the given node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 */ function mutation_replaceAll(node, parent) {
    /**
     * 1. If node is not null, adopt node into parent’s node document.
     */ if (node !== null) {
        DocumentAlgorithm_1.document_adopt(node, parent._nodeDocument);
    }
    /**
     * 2. Let removedNodes be parent’s children.
     */ const removedNodes = Array.from(parent._children);
    /**
     * 3. Let addedNodes be the empty list.
     * 4. If node is DocumentFragment node, then set addedNodes to node’s
     * children.
     * 5. Otherwise, if node is non-null, set addedNodes to [node].
     */ let addedNodes = [];
    if (node && node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        addedNodes = Array.from(node._children);
    } else if (node !== null) {
        addedNodes.push(node);
    }
    /**
     * 6. Remove all parent’s children, in tree order, with the suppress
     * observers flag set.
     */ for (const childNode of removedNodes){
        mutation_remove(childNode, parent, true);
    }
    /**
     * 7. If node is not null, then insert node into parent before null with the
     * suppress observers flag set.
     */ if (node !== null) {
        mutation_insert(node, parent, null, true);
    }
    /**
     * 8. Queue a tree mutation record for parent with addedNodes, removedNodes,
     * null, and null.
     */ if (dom_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, addedNodes, removedNodes, null, null);
    }
}
exports.mutation_replaceAll = mutation_replaceAll;
/**
 * Ensures pre-removal validity of a child node from a parent, then
 * removes it.
 *
 * @param child - child node to remove
 * @param parent - parent node
 */ function mutation_preRemove(child, parent) {
    /**
     * 1. If child’s parent is not parent, then throw a "NotFoundError"
     * DOMException.
     * 2. Remove child from parent.
     * 3. Return child.
     */ if (child._parent !== parent) throw new DOMException_1.NotFoundError(`The child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`);
    mutation_remove(child, parent);
    return child;
}
exports.mutation_preRemove = mutation_preRemove;
/**
 * Removes a child node from its parent.
 *
 * @param node - node to remove
 * @param parent - parent node
 * @param suppressObservers - whether to notify observers
 */ function mutation_remove(node, parent, suppressObservers) {
    if (dom_1.dom.rangeList.size !== 0) {
        /**
         * 1. Let index be node’s index.
         */ const index = TreeAlgorithm_1.tree_index(node);
        /**
         * 2. For each live range whose start node is an inclusive descendant of
         * node, set its start to (parent, index).
         * 3. For each live range whose end node is an inclusive descendant of
         * node, set its end to (parent, index).
         */ for (const range of dom_1.dom.rangeList){
            if (TreeAlgorithm_1.tree_isDescendantOf(node, range._start[0], true)) {
                range._start = [
                    parent,
                    index
                ];
            }
            if (TreeAlgorithm_1.tree_isDescendantOf(node, range._end[0], true)) {
                range._end = [
                    parent,
                    index
                ];
            }
            if (range._start[0] === parent && range._start[1] > index) {
                range._start[1]--;
            }
            if (range._end[0] === parent && range._end[1] > index) {
                range._end[1]--;
            }
        }
        /**
         * 4. For each live range whose start node is parent and start offset is
         * greater than index, decrease its start offset by 1.
         * 5. For each live range whose end node is parent and end offset is greater
         * than index, decrease its end offset by 1.
         */ for (const range of dom_1.dom.rangeList){
            if (range._start[0] === parent && range._start[1] > index) {
                range._start[1] -= 1;
            }
            if (range._end[0] === parent && range._end[1] > index) {
                range._end[1] -= 1;
            }
        }
    }
    /**
     * 6. For each NodeIterator object iterator whose root’s node document is
     * node’s node document, run the NodeIterator pre-removing steps given node
     * and iterator.
     */ if (dom_1.dom.features.steps) {
        for (const iterator of NodeIteratorAlgorithm_1.nodeIterator_iteratorList()){
            if (iterator._root._nodeDocument === node._nodeDocument) {
                DOMAlgorithm_1.dom_runNodeIteratorPreRemovingSteps(iterator, node);
            }
        }
    }
    /**
     * 7. Let oldPreviousSibling be node’s previous sibling.
     * 8. Let oldNextSibling be node’s next sibling.
     */ const oldPreviousSibling = node._previousSibling;
    const oldNextSibling = node._nextSibling;
    // set document element node
    if (util_1.Guard.isDocumentNode(parent) && util_1.Guard.isElementNode(node)) {
        parent._documentElement = null;
    }
    /**
     * 9. Remove node from its parent’s children.
     */ node._parent = null;
    parent._children.delete(node);
    // assign siblings and children for quick lookups
    const prev = node._previousSibling;
    const next = node._nextSibling;
    node._previousSibling = null;
    node._nextSibling = null;
    if (prev) prev._nextSibling = next;
    if (next) next._previousSibling = prev;
    if (!prev) parent._firstChild = next;
    if (!next) parent._lastChild = prev;
    /**
     * 10. If node is assigned, then run assign slotables for node’s assigned
     * slot.
     */ if (dom_1.dom.features.slots) {
        if (util_1.Guard.isSlotable(node) && node._assignedSlot !== null && ShadowTreeAlgorithm_1.shadowTree_isAssigned(node)) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotables(node._assignedSlot);
        }
    }
    /**
     * 11. If parent’s root is a shadow root, and parent is a slot whose
     * assigned nodes is the empty list, then run signal a slot change for
     * parent.
     */ if (dom_1.dom.features.slots) {
        if (util_1.Guard.isShadowRoot(TreeAlgorithm_1.tree_rootNode(parent)) && util_1.Guard.isSlot(parent) && util_2.isEmpty(parent._assignedNodes)) {
            ShadowTreeAlgorithm_1.shadowTree_signalASlotChange(parent);
        }
    }
    /**
     * 12. If node has an inclusive descendant that is a slot, then:
     * 12.1. Run assign slotables for a tree with parent's root.
     * 12.2. Run assign slotables for a tree with node.
     */ if (dom_1.dom.features.slots) {
        const descendant = TreeAlgorithm_1.tree_getFirstDescendantNode(node, true, false, (e)=>util_1.Guard.isSlot(e));
        if (descendant !== null) {
            ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(TreeAlgorithm_1.tree_rootNode(parent));
            ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree(node);
        }
    }
    /**
     * 13. Run the removing steps with node and parent.
     */ if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runRemovingSteps(node, parent);
    }
    /**
     * 14. If node is custom, then enqueue a custom element callback
     * reaction with node, callback name "disconnectedCallback",
     * and an empty argument list.
     */ if (dom_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(node)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(node, "disconnectedCallback", []);
        }
    }
    /**
     * 15. For each shadow-including descendant descendant of node,
     * in shadow-including tree order, then:
     */ let descendant = TreeAlgorithm_1.tree_getFirstDescendantNode(node, false, true);
    while(descendant !== null){
        /**
         * 15.1. Run the removing steps with descendant.
         */ if (dom_1.dom.features.steps) {
            DOMAlgorithm_1.dom_runRemovingSteps(descendant, node);
        }
        /**
         * 15.2. If descendant is custom, then enqueue a custom element
         * callback reaction with descendant, callback name
         * "disconnectedCallback", and an empty argument list.
         */ if (dom_1.dom.features.customElements) {
            if (util_1.Guard.isCustomElementNode(descendant)) {
                CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(descendant, "disconnectedCallback", []);
            }
        }
        descendant = TreeAlgorithm_1.tree_getNextDescendantNode(node, descendant, false, true);
    }
    /**
     * 16. For each inclusive ancestor inclusiveAncestor of parent, and
     * then for each registered of inclusiveAncestor's registered
     * observer list, if registered's options's subtree is true,
     * then append a new transient registered observer whose
     * observer is registered's observer, options is registered's
     * options, and source is registered to node's registered
     * observer list.
     */ if (dom_1.dom.features.mutationObservers) {
        let inclusiveAncestor = TreeAlgorithm_1.tree_getFirstAncestorNode(parent, true);
        while(inclusiveAncestor !== null){
            for (const registered of inclusiveAncestor._registeredObserverList){
                if (registered.options.subtree) {
                    node._registeredObserverList.push({
                        observer: registered.observer,
                        options: registered.options,
                        source: registered
                    });
                }
            }
            inclusiveAncestor = TreeAlgorithm_1.tree_getNextAncestorNode(parent, inclusiveAncestor, true);
        }
    }
    /**
     * 17. If suppress observers flag is unset, then queue a tree mutation
     * record for parent with « », « node », oldPreviousSibling, and
     * oldNextSibling.
     */ if (dom_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            MutationObserverAlgorithm_1.observer_queueTreeMutationRecord(parent, [], [
                node
            ], oldPreviousSibling, oldNextSibling);
        }
    }
    /**
     * 18. If node is a Text node, then run the child text content change steps
     * for parent.
     */ if (dom_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node)) {
            DOMAlgorithm_1.dom_runChildTextContentChangeSteps(parent);
        }
    }
}
exports.mutation_remove = mutation_remove;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ElementAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const CreateAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)");
const CustomElementAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CustomElementAlgorithm.js [app-route] (ecmascript)");
const MutationObserverAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationObserverAlgorithm.js [app-route] (ecmascript)");
const DOMAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)");
const MutationAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationAlgorithm.js [app-route] (ecmascript)");
const DocumentAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DocumentAlgorithm.js [app-route] (ecmascript)");
/**
 * Determines whether the element's attribute list contains the given
 * attribute.
 *
 * @param attribute - an attribute node
 * @param element - an element node
 */ function element_has(attribute, element) {
    /**
     * An element has an attribute A if its attribute list contains A.
     */ return element._attributeList._asArray().indexOf(attribute) !== -1;
}
exports.element_has = element_has;
/**
 * Changes the value of an attribute node.
 *
 * @param attribute - an attribute node
 * @param element - an element node
 * @param value - attribute value
 */ function element_change(attribute, element, value) {
    /**
     * 1. Queue an attribute mutation record for element with attribute’s
     * local name, attribute’s namespace, and attribute’s value.
     */ if (dom_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, attribute._localName, attribute._namespace, attribute._value);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing attribute’s local name, attribute’s value, value, and
     * attribute’s namespace.
     */ if (dom_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [
                attribute._localName,
                attribute._value,
                value,
                attribute._namespace
            ]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, attribute’s local name,
     * attribute’s value, value, and attribute’s namespace.
     * 4. Set attribute’s value to value.
     */ if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, attribute._localName, attribute._value, value, attribute._namespace);
    }
    attribute._value = value;
}
exports.element_change = element_change;
/**
 * Appends an attribute to an element node.
 *
 * @param attribute - an attribute
 * @param element - an element to receive the attribute
 */ function element_append(attribute, element) {
    /**
     * 1. Queue an attribute mutation record for element with attribute’s
     * local name, attribute’s namespace, and null.
     */ if (dom_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, attribute._localName, attribute._namespace, null);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing attribute’s local name, null, attribute’s value, and
     * attribute’s namespace.
     */ if (dom_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [
                attribute._localName,
                null,
                attribute._value,
                attribute._namespace
            ]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, attribute’s local name,
     * null, attribute’s value, and attribute’s namespace.
     */ if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, attribute._localName, null, attribute._value, attribute._namespace);
    }
    /**
     * 4. Append attribute to element’s attribute list.
     * 5. Set attribute’s element to element.
     */ element._attributeList._asArray().push(attribute);
    attribute._element = element;
    // mark that the document has namespaces
    if (!element._nodeDocument._hasNamespaces && (attribute._namespace !== null || attribute._namespacePrefix !== null || attribute._localName === "xmlns")) {
        element._nodeDocument._hasNamespaces = true;
    }
}
exports.element_append = element_append;
/**
 * Removes an attribute from an element node.
 *
 * @param attribute - an attribute
 * @param element - an element to receive the attribute
 */ function element_remove(attribute, element) {
    /**
     * 1. Queue an attribute mutation record for element with attribute’s
     * local name, attribute’s namespace, and attribute’s value.
     */ if (dom_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, attribute._localName, attribute._namespace, attribute._value);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing attribute’s local name, attribute’s value, null,
     * and attribute’s namespace.
     */ if (dom_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [
                attribute._localName,
                attribute._value,
                null,
                attribute._namespace
            ]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, attribute’s local name,
     * attribute’s value, null, and attribute’s namespace.
     */ if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, attribute._localName, attribute._value, null, attribute._namespace);
    }
    /**
     * 3. Remove attribute from element’s attribute list.
     * 5. Set attribute’s element to null.
     */ const index = element._attributeList._asArray().indexOf(attribute);
    element._attributeList._asArray().splice(index, 1);
    attribute._element = null;
}
exports.element_remove = element_remove;
/**
 * Replaces an attribute with another of an element node.
 *
 * @param oldAttr - old attribute
 * @param newAttr - new attribute
 * @param element - an element to receive the attribute
 */ function element_replace(oldAttr, newAttr, element) {
    /**
     * 1. Queue an attribute mutation record for element with oldAttr’s
     * local name, oldAttr’s namespace, and oldAttr’s value.
     */ if (dom_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueAttributeMutationRecord(element, oldAttr._localName, oldAttr._namespace, oldAttr._value);
    }
    /**
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing oldAttr’s local name, oldAttr’s value, newAttr’s value,
     * and oldAttr’s namespace.
     */ if (dom_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(element)) {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction(element, "attributeChangedCallback", [
                oldAttr._localName,
                oldAttr._value,
                newAttr._value,
                oldAttr._namespace
            ]);
        }
    }
    /**
     * 3. Run the attribute change steps with element, oldAttr’s local name,
     * oldAttr’s value, newAttr’s value, and oldAttr’s namespace.
     */ if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runAttributeChangeSteps(element, oldAttr._localName, oldAttr._value, newAttr._value, oldAttr._namespace);
    }
    /**
     * 4. Replace oldAttr by newAttr in element’s attribute list.
     * 5. Set oldAttr’s element to null.
     * 6. Set newAttr’s element to element.
     */ const index = element._attributeList._asArray().indexOf(oldAttr);
    if (index !== -1) {
        element._attributeList._asArray()[index] = newAttr;
    }
    oldAttr._element = null;
    newAttr._element = element;
    // mark that the document has namespaces
    if (!element._nodeDocument._hasNamespaces && (newAttr._namespace !== null || newAttr._namespacePrefix !== null || newAttr._localName === "xmlns")) {
        element._nodeDocument._hasNamespaces = true;
    }
}
exports.element_replace = element_replace;
/**
 * Retrieves an attribute with the given name from an element node.
 *
 * @param qualifiedName - an attribute name
 * @param element - an element to receive the attribute
 */ function element_getAnAttributeByName(qualifiedName, element) {
    /**
     * 1. If element is in the HTML namespace and its node document is an HTML
     * document, then set qualifiedName to qualifiedName in ASCII lowercase.
     * 2. Return the first attribute in element’s attribute list whose qualified
     * name is qualifiedName, and null otherwise.
     */ if (element._namespace === infra_1.namespace.HTML && element._nodeDocument._type === "html") {
        qualifiedName = qualifiedName.toLowerCase();
    }
    return element._attributeList._asArray().find((attr)=>attr._qualifiedName === qualifiedName) || null;
}
exports.element_getAnAttributeByName = element_getAnAttributeByName;
/**
 * Retrieves an attribute with the given namespace and local name from an
 * element node.
 *
 * @param namespace - an attribute namespace
 * @param localName - an attribute local name
 * @param element - an element to receive the attribute
 */ function element_getAnAttributeByNamespaceAndLocalName(namespace, localName, element) {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. Return the attribute in element’s attribute list whose namespace is
     * namespace and local name is localName, if any, and null otherwise.
     */ const ns = namespace || null;
    return element._attributeList._asArray().find((attr)=>attr._namespace === ns && attr._localName === localName) || null;
}
exports.element_getAnAttributeByNamespaceAndLocalName = element_getAnAttributeByNamespaceAndLocalName;
/**
 * Retrieves an attribute's value with the given name namespace and local
 * name from an element node.
 *
 * @param element - an element to receive the attribute
 * @param localName - an attribute local name
 * @param namespace - an attribute namespace
 */ function element_getAnAttributeValue(element, localName, namespace = '') {
    /**
     * 1. Let attr be the result of getting an attribute given namespace,
     * localName, and element.
     * 2. If attr is null, then return the empty string.
     * 3. Return attr’s value.
     */ const attr = element_getAnAttributeByNamespaceAndLocalName(namespace, localName, element);
    if (attr === null) return '';
    else return attr._value;
}
exports.element_getAnAttributeValue = element_getAnAttributeValue;
/**
 * Sets an attribute of an element node.
 *
 * @param attr - an attribute
 * @param element - an element to receive the attribute
 */ function element_setAnAttribute(attr, element) {
    /**
     * 1. If attr’s element is neither null nor element, throw an
     * "InUseAttributeError" DOMException.
     * 2. Let oldAttr be the result of getting an attribute given attr’s
     * namespace, attr’s local name, and element.
     * 3. If oldAttr is attr, return attr.
     * 4. If oldAttr is non-null, replace it by attr in element.
     * 5. Otherwise, append attr to element.
     * 6. Return oldAttr.
     */ if (attr._element !== null && attr._element !== element) throw new DOMException_1.InUseAttributeError(`This attribute already exists in the document: ${attr._qualifiedName} as a child of ${attr._element._qualifiedName}.`);
    const oldAttr = element_getAnAttributeByNamespaceAndLocalName(attr._namespace || '', attr._localName, element);
    if (oldAttr === attr) return attr;
    if (oldAttr !== null) {
        element_replace(oldAttr, attr, element);
    } else {
        element_append(attr, element);
    }
    return oldAttr;
}
exports.element_setAnAttribute = element_setAnAttribute;
/**
 * Sets an attribute's value of an element node.
 *
 * @param element - an element to receive the attribute
 * @param localName - an attribute local name
 * @param value - an attribute value
 * @param prefix - an attribute prefix
 * @param namespace - an attribute namespace
 */ function element_setAnAttributeValue(element, localName, value, prefix = null, namespace = null) {
    /**
     * 1. If prefix is not given, set it to null.
     * 2. If namespace is not given, set it to null.
     * 3. Let attribute be the result of getting an attribute given namespace,
     * localName, and element.
     * 4. If attribute is null, create an attribute whose namespace is
     * namespace, namespace prefix is prefix, local name is localName, value
     * is value, and node document is element’s node document, then append this
     * attribute to element, and then return.
     * 5. Change attribute from element to value.
     */ const attribute = element_getAnAttributeByNamespaceAndLocalName(namespace || '', localName, element);
    if (attribute === null) {
        const newAttr = CreateAlgorithm_1.create_attr(element._nodeDocument, localName);
        newAttr._namespace = namespace;
        newAttr._namespacePrefix = prefix;
        newAttr._value = value;
        element_append(newAttr, element);
        return;
    }
    element_change(attribute, element, value);
}
exports.element_setAnAttributeValue = element_setAnAttributeValue;
/**
 * Removes an attribute with the given name from an element node.
 *
 * @param qualifiedName - an attribute name
 * @param element - an element to receive the attribute
 */ function element_removeAnAttributeByName(qualifiedName, element) {
    /**
     * 1. Let attr be the result of getting an attribute given qualifiedName
     * and element.
     * 2. If attr is non-null, remove it from element.
     * 3. Return attr.
     */ const attr = element_getAnAttributeByName(qualifiedName, element);
    if (attr !== null) {
        element_remove(attr, element);
    }
    return attr;
}
exports.element_removeAnAttributeByName = element_removeAnAttributeByName;
/**
 * Removes an attribute with the given namespace and local name from an
 * element node.
 *
 * @param namespace - an attribute namespace
 * @param localName - an attribute local name
 * @param element - an element to receive the attribute
 */ function element_removeAnAttributeByNamespaceAndLocalName(namespace, localName, element) {
    /**
     * 1. Let attr be the result of getting an attribute given namespace, localName, and element.
     * 2. If attr is non-null, remove it from element.
     * 3. Return attr.
     */ const attr = element_getAnAttributeByNamespaceAndLocalName(namespace, localName, element);
    if (attr !== null) {
        element_remove(attr, element);
    }
    return attr;
}
exports.element_removeAnAttributeByNamespaceAndLocalName = element_removeAnAttributeByNamespaceAndLocalName;
/**
 * Creates an element node.
 * See: https://dom.spec.whatwg.org/#concept-create-element.
 *
 * @param document - the document owning the element
 * @param localName - local name
 * @param namespace - element namespace
 * @param prefix - namespace prefix
 * @param is - the "is" value
 * @param synchronousCustomElementsFlag - synchronous custom elements flag
 */ function element_createAnElement(document, localName, namespace, prefix = null, is = null, synchronousCustomElementsFlag = false) {
    /**
     * 1. If prefix was not given, let prefix be null.
     * 2. If is was not given, let is be null.
     * 3. Let result be null.
     */ let result = null;
    if (!dom_1.dom.features.customElements) {
        result = CreateAlgorithm_1.create_element(document, localName, namespace, prefix);
        result._customElementState = "uncustomized";
        result._customElementDefinition = null;
        result._is = is;
        return result;
    }
    /**
     * 4. Let definition be the result of looking up a custom element definition
     * given document, namespace, localName, and is.
     */ const definition = CustomElementAlgorithm_1.customElement_lookUpACustomElementDefinition(document, namespace, localName, is);
    if (definition !== null && definition.name !== definition.localName) {
        /**
        * 5. If definition is non-null, and definition’s name is not equal to
        * its local name (i.e., definition represents a customized built-in
        * element), then:
          * 5.1. Let interface be the element interface for localName and the HTML
          * namespace.
          * 5.2. Set result to a new element that implements interface, with no
          * attributes, namespace set to the HTML namespace, namespace prefix
          * set to prefix, local name set to localName, custom element state set
          * to "undefined", custom element definition set to null, is value set
          * to is, and node document set to document.
          * 5.3. If the synchronous custom elements flag is set, upgrade element
          * using definition.
          * 5.4. Otherwise, enqueue a custom element upgrade reaction given result
          * and definition.
          */ const elemenInterface = DocumentAlgorithm_1.document_elementInterface(localName, infra_1.namespace.HTML);
        result = new elemenInterface();
        result._localName = localName;
        result._namespace = infra_1.namespace.HTML;
        result._namespacePrefix = prefix;
        result._customElementState = "undefined";
        result._customElementDefinition = null;
        result._is = is;
        result._nodeDocument = document;
        if (synchronousCustomElementsFlag) {
            CustomElementAlgorithm_1.customElement_upgrade(definition, result);
        } else {
            CustomElementAlgorithm_1.customElement_enqueueACustomElementUpgradeReaction(result, definition);
        }
    } else if (definition !== null) {
        /**
         * 6. Otherwise, if definition is non-null, then:
         */ if (synchronousCustomElementsFlag) {
            /**
             * 6.1. If the synchronous custom elements flag is set, then run these
             * steps while catching any exceptions:
             */ try {
                /**
                 * 6.1.1. Let C be definition’s constructor.
                 * 6.1.2. Set result to the result of constructing C, with no arguments.
                 * 6.1.3. Assert: result’s custom element state and custom element definition
                 * are initialized.
                 * 6.1.4. Assert: result’s namespace is the HTML namespace.
                 * _Note:_ IDL enforces that result is an HTMLElement object, which all
                 * use the HTML namespace.
                 */ const C = definition.constructor;
                const result = new C();
                console.assert(result._customElementState !== undefined);
                console.assert(result._customElementDefinition !== undefined);
                console.assert(result._namespace === infra_1.namespace.HTML);
                /**
                 * 6.1.5. If result’s attribute list is not empty, then throw a
                 * "NotSupportedError" DOMException.
                 * 6.1.6. If result has children, then throw a "NotSupportedError"
                 * DOMException.
                 * 6.1.7. If result’s parent is not null, then throw a
                 * "NotSupportedError" DOMException.
                 * 6.1.8. If result’s node document is not document, then throw a
                 * "NotSupportedError" DOMException.
                 * 6.1.9. If result’s local name is not equal to localName, then throw
                 * a "NotSupportedError" DOMException.
                 */ if (result._attributeList.length !== 0) throw new DOMException_1.NotSupportedError("Custom element already has attributes.");
                if (result._children.size !== 0) throw new DOMException_1.NotSupportedError("Custom element already has child nodes.");
                if (result._parent !== null) throw new DOMException_1.NotSupportedError("Custom element already has a parent node.");
                if (result._nodeDocument !== document) throw new DOMException_1.NotSupportedError("Custom element is already in a document.");
                if (result._localName !== localName) throw new DOMException_1.NotSupportedError("Custom element has a different local name.");
                /**
                 * 6.1.10. Set result’s namespace prefix to prefix.
                 * 6.1.11. Set result’s is value to null.
                 */ result._namespacePrefix = prefix;
                result._is = null;
            } catch (e) {
                /**
                 * If any of these steps threw an exception, then:
                 * - Report the exception.
                 * - Set result to a new element that implements the HTMLUnknownElement
                 * interface, with no attributes, namespace set to the HTML namespace,
                 * namespace prefix set to prefix, local name set to localName, custom
                 * element state set to "failed", custom element definition set to null,
                 * is value set to null, and node document set to document.
                 */ // TODO: Report the exception
                result = CreateAlgorithm_1.create_htmlUnknownElement(document, localName, infra_1.namespace.HTML, prefix);
                result._customElementState = "failed";
                result._customElementDefinition = null;
                result._is = null;
            }
        } else {
            /**
             * 6.2. Otherwise:
             * 6.2.1. Set result to a new element that implements the HTMLElement
             * interface, with no attributes, namespace set to the HTML namespace,
             * namespace prefix set to prefix, local name set to localName, custom
             * element state set to "undefined", custom element definition set to
             * null, is value set to null, and node document set to document.
             * 6.2.2. Enqueue a custom element upgrade reaction given result and
             * definition.
             */ result = CreateAlgorithm_1.create_htmlElement(document, localName, infra_1.namespace.HTML, prefix);
            result._customElementState = "undefined";
            result._customElementDefinition = null;
            result._is = null;
            CustomElementAlgorithm_1.customElement_enqueueACustomElementUpgradeReaction(result, definition);
        }
    } else {
        /**
         * 7. Otherwise:
         * 7.1. Let interface be the element interface for localName and
         * namespace.
         * 7.2. Set result to a new element that implements interface, with no
         * attributes, namespace set to namespace, namespace prefix set to prefix,
         * local name set to localName, custom element state set to
         * "uncustomized", custom element definition set to null, is value set to
         * is, and node document set to document.
         */ const elementInterface = DocumentAlgorithm_1.document_elementInterface(localName, namespace);
        result = new elementInterface();
        result._localName = localName;
        result._namespace = namespace;
        result._namespacePrefix = prefix;
        result._customElementState = "uncustomized";
        result._customElementDefinition = null;
        result._is = is;
        result._nodeDocument = document;
        /**
         * 7.3. If namespace is the HTML namespace, and either localName is a
         * valid custom element name or is is non-null, then set result’s
         * custom element state to "undefined".
         */ if (namespace === infra_1.namespace.HTML && (is !== null || CustomElementAlgorithm_1.customElement_isValidCustomElementName(localName))) {
            result._customElementState = "undefined";
        }
    }
    /* istanbul ignore next */ if (result === null) {
        throw new Error("Unable to create element.");
    }
    /**
     * 8. Returns result
     */ return result;
}
exports.element_createAnElement = element_createAnElement;
/**
 * Inserts a new node adjacent to this element.
 *
 * @param element - a reference element
 * @param where - a string defining where to insert the element node.
 *   - `beforebegin` before this element itself.
 *   - `afterbegin` before the first child.
 *   - `beforeend` after the last child.
 *   - `afterend` after this element itself.
 * @param node - node to insert
 */ function element_insertAdjacent(element, where, node) {
    /**
     * - "beforebegin"
     * If element’s parent is null, return null.
     * Return the result of pre-inserting node into element’s parent before
     * element.
     * - "afterbegin"
     * Return the result of pre-inserting node into element before element’s
     * first child.
     * - "beforeend"
     * Return the result of pre-inserting node into element before null.
     * - "afterend"
     * If element’s parent is null, return null.
     * Return the result of pre-inserting node into element’s parent before element’s next sibling.
     * - Otherwise
     * Throw a "SyntaxError" DOMException.
     */ switch(where.toLowerCase()){
        case 'beforebegin':
            if (element._parent === null) return null;
            return MutationAlgorithm_1.mutation_preInsert(node, element._parent, element);
        case 'afterbegin':
            return MutationAlgorithm_1.mutation_preInsert(node, element, element._firstChild);
        case 'beforeend':
            return MutationAlgorithm_1.mutation_preInsert(node, element, null);
        case 'afterend':
            if (element._parent === null) return null;
            return MutationAlgorithm_1.mutation_preInsert(node, element._parent, element._nextSibling);
        default:
            throw new DOMException_1.SyntaxError(`Invalid 'where' argument. "beforebegin", "afterbegin", "beforeend" or "afterend" expected`);
    }
}
exports.element_insertAdjacent = element_insertAdjacent;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/AttrAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const ElementAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ElementAlgorithm.js [app-route] (ecmascript)");
/**
 * Changes the value of an existing attribute.
 *
 * @param attribute - an attribute node
 * @param value - attribute value
 */ function attr_setAnExistingAttributeValue(attribute, value) {
    /**
     * 1. If attribute’s element is null, then set attribute’s value to value.
     * 2. Otherwise, change attribute from attribute’s element to value.
     */ if (attribute._element === null) {
        attribute._value = value;
    } else {
        ElementAlgorithm_1.element_change(attribute, attribute._element, value);
    }
}
exports.attr_setAnExistingAttributeValue = attr_setAnExistingAttributeValue;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/BoundaryPointAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
/**
 * Defines the position of a boundary point relative to another.
 *
 * @param bp - a boundary point
 * @param relativeTo - a boundary point to compare to
 */ function boundaryPoint_position(bp, relativeTo) {
    const nodeA = bp[0];
    const offsetA = bp[1];
    const nodeB = relativeTo[0];
    const offsetB = relativeTo[1];
    /**
     * 1. Assert: nodeA and nodeB have the same root.
     */ console.assert(TreeAlgorithm_1.tree_rootNode(nodeA) === TreeAlgorithm_1.tree_rootNode(nodeB), "Boundary points must share the same root node.");
    /**
     * 2. If nodeA is nodeB, then return equal if offsetA is offsetB, before
     * if offsetA is less than offsetB, and after if offsetA is greater than
     * offsetB.
     */ if (nodeA === nodeB) {
        if (offsetA === offsetB) {
            return interfaces_1.BoundaryPosition.Equal;
        } else if (offsetA < offsetB) {
            return interfaces_1.BoundaryPosition.Before;
        } else {
            return interfaces_1.BoundaryPosition.After;
        }
    }
    /**
     * 3. If nodeA is following nodeB, then if the position of (nodeB, offsetB)
     * relative to (nodeA, offsetA) is before, return after, and if it is after,
     * return before.
     */ if (TreeAlgorithm_1.tree_isFollowing(nodeB, nodeA)) {
        const pos = boundaryPoint_position([
            nodeB,
            offsetB
        ], [
            nodeA,
            offsetA
        ]);
        if (pos === interfaces_1.BoundaryPosition.Before) {
            return interfaces_1.BoundaryPosition.After;
        } else if (pos === interfaces_1.BoundaryPosition.After) {
            return interfaces_1.BoundaryPosition.Before;
        }
    }
    /**
     * 4. If nodeA is an ancestor of nodeB:
     */ if (TreeAlgorithm_1.tree_isAncestorOf(nodeB, nodeA)) {
        /**
         * 4.1. Let child be nodeB.
         * 4.2. While child is not a child of nodeA, set child to its parent.
         * 4.3. If child’s index is less than offsetA, then return after.
         */ let child = nodeB;
        while(!TreeAlgorithm_1.tree_isChildOf(nodeA, child)){
            /* istanbul ignore else */ if (child._parent !== null) {
                child = child._parent;
            }
        }
        if (TreeAlgorithm_1.tree_index(child) < offsetA) {
            return interfaces_1.BoundaryPosition.After;
        }
    }
    /**
     * 5. Return before.
     */ return interfaces_1.BoundaryPosition.Before;
}
exports.boundaryPoint_position = boundaryPoint_position;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CharacterDataAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const MutationObserverAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationObserverAlgorithm.js [app-route] (ecmascript)");
const DOMAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)");
/**
 * Replaces character data.
 *
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to replace
 * @param data - new data
 */ function characterData_replaceData(node, offset, count, data) {
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError"
     * DOMException.
     * 3. If offset plus count is greater than length, then set count to length
     * minus offset.
     */ const length = TreeAlgorithm_1.tree_nodeLength(node);
    if (offset > length) {
        throw new DOMException_1.IndexSizeError(`Offset exceeds character data length. Offset: ${offset}, Length: ${length}, Node is ${node.nodeName}.`);
    }
    if (offset + count > length) {
        count = length - offset;
    }
    /**
     * 4. Queue a mutation record of "characterData" for node with null, null,
     * node’s data, « », « », null, and null.
     */ if (dom_1.dom.features.mutationObservers) {
        MutationObserverAlgorithm_1.observer_queueMutationRecord("characterData", node, null, null, node._data, [], [], null, null);
    }
    /**
     * 5. Insert data into node’s data after offset code units.
     * 6. Let delete offset be offset + data’s length.
     * 7. Starting from delete offset code units, remove count code units from
     * node’s data.
     */ const newData = node._data.substring(0, offset) + data + node._data.substring(offset + count);
    node._data = newData;
    /**
     * 8. For each live range whose start node is node and start offset is
     * greater than offset but less than or equal to offset plus count, set its
     * start offset to offset.
     * 9. For each live range whose end node is node and end offset is greater
     * than offset but less than or equal to offset plus count, set its end
     * offset to offset.
     * 10. For each live range whose start node is node and start offset is
     * greater than offset plus count, increase its start offset by data’s
     * length and decrease it by count.
     * 11. For each live range whose end node is node and end offset is greater
     * than offset plus count, increase its end offset by data’s length and
     * decrease it by count.
     */ for (const range of dom_1.dom.rangeList){
        if (range._start[0] === node && range._start[1] > offset && range._start[1] <= offset + count) {
            range._start[1] = offset;
        }
        if (range._end[0] === node && range._end[1] > offset && range._end[1] <= offset + count) {
            range._end[1] = offset;
        }
        if (range._start[0] === node && range._start[1] > offset + count) {
            range._start[1] += data.length - count;
        }
        if (range._end[0] === node && range._end[1] > offset + count) {
            range._end[1] += data.length - count;
        }
    }
    /**
     * 12. If node is a Text node and its parent is not null, run the child
     * text content change steps for node’s parent.
     */ if (dom_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node) && node._parent !== null) {
            DOMAlgorithm_1.dom_runChildTextContentChangeSteps(node._parent);
        }
    }
}
exports.characterData_replaceData = characterData_replaceData;
/**
 * Returns `count` number of characters from `node`'s data starting at
 * the given `offset`.
 *
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to return
 */ function characterData_substringData(node, offset, count) {
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError"
     * DOMException.
     * 3. If offset plus count is greater than length, return a string whose
     * value is the code units from the offsetth code unit to the end of node’s
     * data, and then return.
     * 4. Return a string whose value is the code units from the offsetth code
     * unit to the offset+countth code unit in node’s data.
     */ const length = TreeAlgorithm_1.tree_nodeLength(node);
    if (offset > length) {
        throw new DOMException_1.IndexSizeError(`Offset exceeds character data length. Offset: ${offset}, Length: ${length}, Node is ${node.nodeName}.`);
    }
    if (offset + count > length) {
        return node._data.substr(offset);
    } else {
        return node._data.substr(offset, count);
    }
}
exports.characterData_substringData = characterData_substringData;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/OrderedSetAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
/**
 * Converts a whitespace separated string into an array of tokens.
 *
 * @param value - a string of whitespace separated tokens
 */ function orderedSet_parse(value) {
    /**
     * 1. Let inputTokens be the result of splitting input on ASCII whitespace.
     * 2. Let tokens be a new ordered set.
     * 3. For each token in inputTokens, append token to tokens.
     * 4. Return tokens.
     */ const inputTokens = infra_1.string.splitAStringOnASCIIWhitespace(value);
    return new Set(inputTokens);
}
exports.orderedSet_parse = orderedSet_parse;
/**
 * Converts an array of tokens into a space separated string.
 *
 * @param tokens - an array of token strings
 */ function orderedSet_serialize(tokens) {
    /**
     * The ordered set serializer takes a set and returns the concatenation of
     * set using U+0020 SPACE.
     */ return [
        ...tokens
    ].join(' ');
}
exports.orderedSet_serialize = orderedSet_serialize;
/**
 * Removes duplicate tokens and convert all whitespace characters
 * to space.
 *
 * @param value - a string of whitespace separated tokens
 */ function orderedSet_sanitize(value) {
    return orderedSet_serialize(orderedSet_parse(value));
}
exports.orderedSet_sanitize = orderedSet_sanitize;
/**
 * Determines whether a set contains the other.
 *
 * @param set1 - a set
 * @param set1 - a set that is contained in set1
 * @param caseSensitive - whether matches are case-sensitive
 */ function orderedSet_contains(set1, set2, caseSensitive) {
    for (const val2 of set2){
        let found = false;
        for (const val1 of set1){
            if (caseSensitive) {
                if (val1 === val2) {
                    found = true;
                    break;
                }
            } else {
                if (val1.toUpperCase() === val2.toUpperCase()) {
                    found = true;
                    break;
                }
            }
        }
        if (!found) return false;
    }
    return true;
}
exports.orderedSet_contains = orderedSet_contains;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMTokenListAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const OrderedSetAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/OrderedSetAlgorithm.js [app-route] (ecmascript)");
const DOMAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)");
const ElementAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ElementAlgorithm.js [app-route] (ecmascript)");
/**
 * Validates a given token against the supported tokens defined for the given
 * token lists' associated attribute.
 *
 * @param tokenList - a token list
 * @param token - a token
 */ function tokenList_validationSteps(tokenList, token) {
    /**
     * 1. If the associated attribute’s local name does not define supported
     * tokens, throw a TypeError.
     * 2. Let lowercase token be a copy of token, in ASCII lowercase.
     * 3. If lowercase token is present in supported tokens, return true.
     * 4. Return false.
     */ if (!DOMAlgorithm_1.dom_hasSupportedTokens(tokenList._attribute._localName)) {
        throw new TypeError(`There are no supported tokens defined for attribute name: '${tokenList._attribute._localName}'.`);
    }
    return DOMAlgorithm_1.dom_getSupportedTokens(tokenList._attribute._localName).has(token.toLowerCase());
}
exports.tokenList_validationSteps = tokenList_validationSteps;
/**
 * Updates the value of the token lists' associated attribute.
 *
 * @param tokenList - a token list
 */ function tokenList_updateSteps(tokenList) {
    /**
     * 1. If the associated element does not have an associated attribute and
     * token set is empty, then return.
     * 2. Set an attribute value for the associated element using associated
     * attribute’s local name and the result of running the ordered set
     * serializer for token set.
     */ if (!tokenList._element.hasAttribute(tokenList._attribute._localName) && tokenList._tokenSet.size === 0) {
        return;
    }
    ElementAlgorithm_1.element_setAnAttributeValue(tokenList._element, tokenList._attribute._localName, OrderedSetAlgorithm_1.orderedSet_serialize(tokenList._tokenSet));
}
exports.tokenList_updateSteps = tokenList_updateSteps;
/**
 * Gets the value of the token lists' associated attribute.
 *
 * @param tokenList - a token list
 */ function tokenList_serializeSteps(tokenList) {
    /**
     * A DOMTokenList object’s serialize steps are to return the result of
     * running get an attribute value given the associated element and the
     * associated attribute’s local name.
     */ return ElementAlgorithm_1.element_getAnAttributeValue(tokenList._element, tokenList._attribute._localName);
}
exports.tokenList_serializeSteps = tokenList_serializeSteps;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/EventTargetAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */ function eventTarget_flatten(options) {
    /**
     * 1. If options is a boolean, then return options.
     * 2. Return options’s capture.
     */ if (util_1.isBoolean(options)) {
        return options;
    } else {
        return options.capture || false;
    }
}
exports.eventTarget_flatten = eventTarget_flatten;
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */ function eventTarget_flattenMore(options) {
    /**
     * 1. Let capture be the result of flattening options.
     * 2. Let once and passive be false.
     * 3. If options is a dictionary, then set passive to options’s passive and
     * once to options’s once.
     * 4. Return capture, passive, and once.
     */ const capture = eventTarget_flatten(options);
    let once = false;
    let passive = false;
    if (!util_1.isBoolean(options)) {
        once = options.once || false;
        passive = options.passive || false;
    }
    return [
        capture,
        passive,
        once
    ];
}
exports.eventTarget_flattenMore = eventTarget_flattenMore;
/**
 * Adds a new event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */ function eventTarget_addEventListener(eventTarget, listener) {
    /**
     * 1. If eventTarget is a ServiceWorkerGlobalScope object, its service
     * worker’s script resource’s has ever been evaluated flag is set, and
     * listener’s type matches the type attribute value of any of the service
     * worker events, then report a warning to the console that this might not
     * give the expected results. [SERVICE-WORKERS]
     */ // TODO: service worker
    /**
     * 2. If listener’s callback is null, then return.
     */ if (listener.callback === null) return;
    /**
     * 3. If eventTarget’s event listener list does not contain an event listener
     * whose type is listener’s type, callback is listener’s callback, and capture
     * is listener’s capture, then append listener to eventTarget’s event listener
     * list.
     */ for(let i = 0; i < eventTarget._eventListenerList.length; i++){
        const entry = eventTarget._eventListenerList[i];
        if (entry.type === listener.type && entry.callback.handleEvent === listener.callback.handleEvent && entry.capture === listener.capture) {
            return;
        }
    }
    eventTarget._eventListenerList.push(listener);
}
exports.eventTarget_addEventListener = eventTarget_addEventListener;
/**
 * Removes an event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */ function eventTarget_removeEventListener(eventTarget, listener, index) {
    /**
     * 1. If eventTarget is a ServiceWorkerGlobalScope object and its service
     * worker’s set of event types to handle contains type, then report a
     * warning to the console that this might not give the expected results.
     * [SERVICE-WORKERS]
     */ // TODO: service worker
    /**
     * 2. Set listener’s removed to true and remove listener from eventTarget’s
     * event listener list.
     */ listener.removed = true;
    eventTarget._eventListenerList.splice(index, 1);
}
exports.eventTarget_removeEventListener = eventTarget_removeEventListener;
/**
 * Removes all event listeners.
 *
 * @param eventTarget - event target
 */ function eventTarget_removeAllEventListeners(eventTarget) {
    /**
     * To remove all event listeners, given an EventTarget object eventTarget,
     * for each listener of eventTarget’s event listener list, remove an event
     * listener with eventTarget and listener.
     */ for (const e of eventTarget._eventListenerList){
        e.removed = true;
    }
    eventTarget._eventListenerList.length = 0;
}
exports.eventTarget_removeAllEventListeners = eventTarget_removeAllEventListeners;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NodeAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const CreateAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)");
const OrderedSetAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/OrderedSetAlgorithm.js [app-route] (ecmascript)");
const DOMAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)");
const MutationAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationAlgorithm.js [app-route] (ecmascript)");
const ElementAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ElementAlgorithm.js [app-route] (ecmascript)");
/**
 * Replaces the contents of the given node with a single text node.
 *
 * @param string - node contents
 * @param parent - a node
 */ function node_stringReplaceAll(str, parent) {
    /**
     * 1. Let node be null.
     * 2. If string is not the empty string, then set node to a new Text node
     * whose data is string and node document is parent’s node document.
     * 3. Replace all with node within parent.
     */ let node = null;
    if (str !== '') {
        node = CreateAlgorithm_1.create_text(parent._nodeDocument, str);
    }
    MutationAlgorithm_1.mutation_replaceAll(node, parent);
}
exports.node_stringReplaceAll = node_stringReplaceAll;
/**
 * Clones a node.
 *
 * @param node - a node to clone
 * @param document - the document to own the cloned node
 * @param cloneChildrenFlag - whether to clone node's children
 */ function node_clone(node, document = null, cloneChildrenFlag = false) {
    /**
     * 1. If document is not given, let document be node’s node document.
     */ if (document === null) document = node._nodeDocument;
    let copy;
    if (util_1.Guard.isElementNode(node)) {
        /**
         * 2. If node is an element, then:
         * 2.1. Let copy be the result of creating an element, given document,
         * node’s local name, node’s namespace, node’s namespace prefix,
         * and node’s is value, with the synchronous custom elements flag unset.
         * 2.2. For each attribute in node’s attribute list:
         * 2.2.1. Let copyAttribute be a clone of attribute.
         * 2.2.2. Append copyAttribute to copy.
         */ copy = ElementAlgorithm_1.element_createAnElement(document, node._localName, node._namespace, node._namespacePrefix, node._is, false);
        for (const attribute of node._attributeList){
            const copyAttribute = node_clone(attribute, document);
            ElementAlgorithm_1.element_append(copyAttribute, copy);
        }
    } else {
        /**
         * 3. Otherwise, let copy be a node that implements the same interfaces as
         * node, and fulfills these additional requirements, switching on node:
         * - Document
         * Set copy’s encoding, content type, URL, origin, type, and mode, to those
         * of node.
         * - DocumentType
         * Set copy’s name, public ID, and system ID, to those of node.
         * - Attr
         * Set copy’s namespace, namespace prefix, local name, and value, to
         * those of node.
         * - Text
         * - Comment
         * Set copy’s data, to that of node.
         * - ProcessingInstruction
         * Set copy’s target and data to those of node.
         * - Any other node
         */ if (util_1.Guard.isDocumentNode(node)) {
            const doc = CreateAlgorithm_1.create_document();
            doc._encoding = node._encoding;
            doc._contentType = node._contentType;
            doc._URL = node._URL;
            doc._origin = node._origin;
            doc._type = node._type;
            doc._mode = node._mode;
            copy = doc;
        } else if (util_1.Guard.isDocumentTypeNode(node)) {
            const doctype = CreateAlgorithm_1.create_documentType(document, node._name, node._publicId, node._systemId);
            copy = doctype;
        } else if (util_1.Guard.isAttrNode(node)) {
            const attr = CreateAlgorithm_1.create_attr(document, node.localName);
            attr._namespace = node._namespace;
            attr._namespacePrefix = node._namespacePrefix;
            attr._value = node._value;
            copy = attr;
        } else if (util_1.Guard.isExclusiveTextNode(node)) {
            copy = CreateAlgorithm_1.create_text(document, node._data);
        } else if (util_1.Guard.isCDATASectionNode(node)) {
            copy = CreateAlgorithm_1.create_cdataSection(document, node._data);
        } else if (util_1.Guard.isCommentNode(node)) {
            copy = CreateAlgorithm_1.create_comment(document, node._data);
        } else if (util_1.Guard.isProcessingInstructionNode(node)) {
            copy = CreateAlgorithm_1.create_processingInstruction(document, node._target, node._data);
        } else if (util_1.Guard.isDocumentFragmentNode(node)) {
            copy = CreateAlgorithm_1.create_documentFragment(document);
        } else {
            copy = Object.create(node);
        }
    }
    /**
     * 4. Set copy’s node document and document to copy, if copy is a document,
     * and set copy’s node document to document otherwise.
     */ if (util_1.Guard.isDocumentNode(copy)) {
        copy._nodeDocument = copy;
        document = copy;
    } else {
        copy._nodeDocument = document;
    }
    /**
     * 5. Run any cloning steps defined for node in other applicable
     * specifications and pass copy, node, document and the clone children flag
     * if set, as parameters.
     */ if (dom_1.dom.features.steps) {
        DOMAlgorithm_1.dom_runCloningSteps(copy, node, document, cloneChildrenFlag);
    }
    /**
     * 6. If the clone children flag is set, clone all the children of node and
     * append them to copy, with document as specified and the clone children
     * flag being set.
     */ if (cloneChildrenFlag) {
        for (const child of node._children){
            const childCopy = node_clone(child, document, true);
            MutationAlgorithm_1.mutation_append(childCopy, copy);
        }
    }
    /**
     * 7. Return copy.
     */ return copy;
}
exports.node_clone = node_clone;
/**
 * Determines if two nodes can be considered equal.
 *
 * @param a - node to compare
 * @param b - node to compare
 */ function node_equals(a, b) {
    /**
     * 1. A and B’s nodeType attribute value is identical.
     */ if (a._nodeType !== b._nodeType) return false;
    /**
     * 2. The following are also equal, depending on A:
     * - DocumentType
     * Its name, public ID, and system ID.
     * - Element
     * Its namespace, namespace prefix, local name, and its attribute list’s size.
     * - Attr
     * Its namespace, local name, and value.
     * - ProcessingInstruction
     * Its target and data.
     * - Text
     * - Comment
     * Its data.
     */ if (util_1.Guard.isDocumentTypeNode(a) && util_1.Guard.isDocumentTypeNode(b)) {
        if (a._name !== b._name || a._publicId !== b._publicId || a._systemId !== b._systemId) return false;
    } else if (util_1.Guard.isElementNode(a) && util_1.Guard.isElementNode(b)) {
        if (a._namespace !== b._namespace || a._namespacePrefix !== b._namespacePrefix || a._localName !== b._localName || a._attributeList.length !== b._attributeList.length) return false;
    } else if (util_1.Guard.isAttrNode(a) && util_1.Guard.isAttrNode(b)) {
        if (a._namespace !== b._namespace || a._localName !== b._localName || a._value !== b._value) return false;
    } else if (util_1.Guard.isProcessingInstructionNode(a) && util_1.Guard.isProcessingInstructionNode(b)) {
        if (a._target !== b._target || a._data !== b._data) return false;
    } else if (util_1.Guard.isCharacterDataNode(a) && util_1.Guard.isCharacterDataNode(b)) {
        if (a._data !== b._data) return false;
    }
    /**
     * 3. If A is an element, each attribute in its attribute list has an attribute
     * that equals an attribute in B’s attribute list.
     */ if (util_1.Guard.isElementNode(a) && util_1.Guard.isElementNode(b)) {
        const attrMap = {};
        for (const attrA of a._attributeList){
            attrMap[attrA._localName] = attrA;
        }
        for (const attrB of b._attributeList){
            const attrA = attrMap[attrB._localName];
            if (!attrA) return false;
            if (!node_equals(attrA, attrB)) return false;
        }
    }
    /**
     * 4. A and B have the same number of children.
     * 5. Each child of A equals the child of B at the identical index.
     */ if (a._children.size !== b._children.size) return false;
    const itA = a._children[Symbol.iterator]();
    const itB = b._children[Symbol.iterator]();
    let resultA = itA.next();
    let resultB = itB.next();
    while(!resultA.done && !resultB.done){
        const child1 = resultA.value;
        const child2 = resultB.value;
        if (!node_equals(child1, child2)) return false;
        resultA = itA.next();
        resultB = itB.next();
    }
    return true;
}
exports.node_equals = node_equals;
/**
 * Returns a collection of elements with the given qualified name which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbytagname
 *
 * @param qualifiedName - qualified name
 * @param root - root node
 */ function node_listOfElementsWithQualifiedName(qualifiedName, root) {
    /**
     * 1. If qualifiedName is "*" (U+002A), return a HTMLCollection rooted at
     * root, whose filter matches only descendant elements.
     * 2. Otherwise, if root’s node document is an HTML document, return a
     * HTMLCollection rooted at root, whose filter matches the following
     * descendant elements:
     * 2.1. Whose namespace is the HTML namespace and whose qualified name is
     * qualifiedName, in ASCII lowercase.
     * 2.2. Whose namespace is not the HTML namespace and whose qualified name
     * is qualifiedName.
     * 3. Otherwise, return a HTMLCollection rooted at root, whose filter
     * matches descendant elements whose qualified name is qualifiedName.
     */ if (qualifiedName === "*") {
        return CreateAlgorithm_1.create_htmlCollection(root);
    } else if (root._nodeDocument._type === "html") {
        return CreateAlgorithm_1.create_htmlCollection(root, function(ele) {
            if (ele._namespace === infra_1.namespace.HTML && ele._qualifiedName === qualifiedName.toLowerCase()) {
                return true;
            } else if (ele._namespace !== infra_1.namespace.HTML && ele._qualifiedName === qualifiedName) {
                return true;
            } else {
                return false;
            }
        });
    } else {
        return CreateAlgorithm_1.create_htmlCollection(root, function(ele) {
            return ele._qualifiedName === qualifiedName;
        });
    }
}
exports.node_listOfElementsWithQualifiedName = node_listOfElementsWithQualifiedName;
/**
 * Returns a collection of elements with the given namespace which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
 *
 * @param namespace - element namespace
 * @param localName - local name
 * @param root - root node
 */ function node_listOfElementsWithNamespace(namespace, localName, root) {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. If both namespace and localName are "*" (U+002A), return a
     * HTMLCollection rooted at root, whose filter matches descendant elements.
     * 3. Otherwise, if namespace is "*" (U+002A), return a HTMLCollection
     * rooted at root, whose filter matches descendant elements whose local
     * name is localName.
     * 4. Otherwise, if localName is "*" (U+002A), return a HTMLCollection
     * rooted at root, whose filter matches descendant elements whose
     * namespace is namespace.
     * 5. Otherwise, return a HTMLCollection rooted at root, whose filter
     * matches descendant elements whose namespace is namespace and local
     * name is localName.
     */ if (namespace === '') namespace = null;
    if (namespace === "*" && localName === "*") {
        return CreateAlgorithm_1.create_htmlCollection(root);
    } else if (namespace === "*") {
        return CreateAlgorithm_1.create_htmlCollection(root, function(ele) {
            return ele._localName === localName;
        });
    } else if (localName === "*") {
        return CreateAlgorithm_1.create_htmlCollection(root, function(ele) {
            return ele._namespace === namespace;
        });
    } else {
        return CreateAlgorithm_1.create_htmlCollection(root, function(ele) {
            return ele._localName === localName && ele._namespace === namespace;
        });
    }
}
exports.node_listOfElementsWithNamespace = node_listOfElementsWithNamespace;
/**
 * Returns a collection of elements with the given class names which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbyclassname
 *
 * @param namespace - element namespace
 * @param localName - local name
 * @param root - root node
 */ function node_listOfElementsWithClassNames(classNames, root) {
    /**
     * 1. Let classes be the result of running the ordered set parser
     * on classNames.
     * 2. If classes is the empty set, return an empty HTMLCollection.
     * 3. Return a HTMLCollection rooted at root, whose filter matches
     * descendant elements that have all their classes in classes.
     * The comparisons for the classes must be done in an ASCII case-insensitive
     * manner if root’s node document’s mode is "quirks", and in a
     * case-sensitive manner otherwise.
     */ const classes = OrderedSetAlgorithm_1.orderedSet_parse(classNames);
    if (classes.size === 0) {
        return CreateAlgorithm_1.create_htmlCollection(root, ()=>false);
    }
    const caseSensitive = root._nodeDocument._mode !== "quirks";
    return CreateAlgorithm_1.create_htmlCollection(root, function(ele) {
        const eleClasses = ele.classList;
        return OrderedSetAlgorithm_1.orderedSet_contains(eleClasses._tokenSet, classes, caseSensitive);
    });
}
exports.node_listOfElementsWithClassNames = node_listOfElementsWithClassNames;
/**
 * Searches for a namespace prefix associated with the given namespace
 * starting from the given element through its ancestors.
 *
 * @param element - an element node to start searching at
 * @param namespace - namespace to search for
 */ function node_locateANamespacePrefix(element, namespace) {
    /**
     * 1. If element’s namespace is namespace and its namespace prefix is not
     * null, then return its namespace prefix.
     */ if (element._namespace === namespace && element._namespacePrefix !== null) {
        return element._namespacePrefix;
    }
    /**
     * 2. If element has an attribute whose namespace prefix is "xmlns" and
     * value is namespace, then return element’s first such attribute’s
     * local name.
     */ for(let i = 0; i < element._attributeList.length; i++){
        const attr = element._attributeList[i];
        if (attr._namespacePrefix === "xmlns" && attr._value === namespace) {
            return attr._localName;
        }
    }
    /**
     * 3. If element’s parent element is not null, then return the result of
     * running locate a namespace prefix on that element using namespace.
     */ if (element._parent && util_1.Guard.isElementNode(element._parent)) {
        return node_locateANamespacePrefix(element._parent, namespace);
    }
    /**
     * 4. Return null.
     */ return null;
}
exports.node_locateANamespacePrefix = node_locateANamespacePrefix;
/**
 * Searches for a namespace associated with the given namespace prefix
 * starting from the given node through its ancestors.
 *
 * @param node - a node to start searching at
 * @param prefix - namespace prefix to search for
 */ function node_locateANamespace(node, prefix) {
    if (util_1.Guard.isElementNode(node)) {
        /**
         * 1. If its namespace is not null and its namespace prefix is prefix,
         * then return namespace.
         */ if (node._namespace !== null && node._namespacePrefix === prefix) {
            return node._namespace;
        }
        /**
         * 2. If it has an attribute whose namespace is the XMLNS namespace,
         * namespace prefix is "xmlns", and local name is prefix, or if prefix
         * is null and it has an attribute whose namespace is the XMLNS namespace,
         * namespace prefix is null, and local name is "xmlns", then return its
         * value if it is not the empty string, and null otherwise.
         */ for(let i = 0; i < node._attributeList.length; i++){
            const attr = node._attributeList[i];
            if (attr._namespace === infra_1.namespace.XMLNS && attr._namespacePrefix === "xmlns" && attr._localName === prefix) {
                return attr._value || null;
            }
            if (prefix === null && attr._namespace === infra_1.namespace.XMLNS && attr._namespacePrefix === null && attr._localName === "xmlns") {
                return attr._value || null;
            }
        }
        /**
         * 3. If its parent element is null, then return null.
         */ if (node.parentElement === null) return null;
        /**
         * 4. Return the result of running locate a namespace on its parent
         * element using prefix.
         */ return node_locateANamespace(node.parentElement, prefix);
    } else if (util_1.Guard.isDocumentNode(node)) {
        /**
         * 1. If its document element is null, then return null.
         * 2. Return the result of running locate a namespace on its document
         * element using prefix.
         */ if (node.documentElement === null) return null;
        return node_locateANamespace(node.documentElement, prefix);
    } else if (util_1.Guard.isDocumentTypeNode(node) || util_1.Guard.isDocumentFragmentNode(node)) {
        return null;
    } else if (util_1.Guard.isAttrNode(node)) {
        /**
         * 1. If its element is null, then return null.
         * 2. Return the result of running locate a namespace on its element
         * using prefix.
         */ if (node._element === null) return null;
        return node_locateANamespace(node._element, prefix);
    } else {
        /**
         * 1. If its parent element is null, then return null.
         * 2. Return the result of running locate a namespace on its parent
         * element using prefix.
         */ if (!node._parent || !util_1.Guard.isElementNode(node._parent)) return null;
        return node_locateANamespace(node._parent, prefix);
    }
}
exports.node_locateANamespace = node_locateANamespace;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ParentNodeAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/node_modules/@oozcitak/util/lib/index.js [app-route] (ecmascript)");
const CreateAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)");
/**
 * Converts the given nodes or strings into a node (if `nodes` has
 * only one element) or a document fragment.
 *
 * @param nodes - the array of nodes or strings,
 * @param document - owner document
 */ function parentNode_convertNodesIntoANode(nodes, document) {
    /**
     * 1. Let node be null.
     * 2. Replace each string in nodes with a new Text node whose data is the
     * string and node document is document.
     */ let node = null;
    for(let i = 0; i < nodes.length; i++){
        const item = nodes[i];
        if (util_1.isString(item)) {
            const text = CreateAlgorithm_1.create_text(document, item);
            nodes[i] = text;
        }
    }
    /**
     * 3. If nodes contains one node, set node to that node.
     * 4. Otherwise, set node to a new DocumentFragment whose node document is
     * document, and then append each node in nodes, if any, to it.
     */ if (nodes.length === 1) {
        node = nodes[0];
    } else {
        node = CreateAlgorithm_1.create_documentFragment(document);
        const ns = node;
        for (const item of nodes){
            ns.appendChild(item);
        }
    }
    /**
     * 5. Return node.
     */ return node;
}
exports.parentNode_convertNodesIntoANode = parentNode_convertNodesIntoANode;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TextAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const CreateAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const CharacterDataAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CharacterDataAlgorithm.js [app-route] (ecmascript)");
const MutationAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationAlgorithm.js [app-route] (ecmascript)");
/**
 * Returns node with its adjacent text and cdata node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */ function text_contiguousTextNodes(node, self = false) {
    /**
     * The contiguous Text nodes of a node node are node, node’s previous
     * sibling Text node, if any, and its contiguous Text nodes, and node’s next
     * sibling Text node, if any, and its contiguous Text nodes, avoiding any
     * duplicates.
     */ return {
        [Symbol.iterator] () {
            let currentNode = node;
            while(currentNode && util_1.Guard.isTextNode(currentNode._previousSibling)){
                currentNode = currentNode._previousSibling;
            }
            return {
                next () {
                    if (currentNode && !self && currentNode === node) {
                        if (util_1.Guard.isTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        } else {
                            currentNode = null;
                        }
                    }
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        if (util_1.Guard.isTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        } else {
                            currentNode = null;
                        }
                        return result;
                    }
                }
            };
        }
    };
}
exports.text_contiguousTextNodes = text_contiguousTextNodes;
/**
 * Returns node with its adjacent text node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */ function text_contiguousExclusiveTextNodes(node, self = false) {
    /**
     * The contiguous exclusive Text nodes of a node node are node, node’s
     * previous sibling exclusive Text node, if any, and its contiguous
     * exclusive Text nodes, and node’s next sibling exclusive Text node,
     * if any, and its contiguous exclusive Text nodes, avoiding any duplicates.
     */ return {
        [Symbol.iterator] () {
            let currentNode = node;
            while(currentNode && util_1.Guard.isExclusiveTextNode(currentNode._previousSibling)){
                currentNode = currentNode._previousSibling;
            }
            return {
                next () {
                    if (currentNode && !self && currentNode === node) {
                        if (util_1.Guard.isExclusiveTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        } else {
                            currentNode = null;
                        }
                    }
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        if (util_1.Guard.isExclusiveTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        } else {
                            currentNode = null;
                        }
                        return result;
                    }
                }
            };
        }
    };
}
exports.text_contiguousExclusiveTextNodes = text_contiguousExclusiveTextNodes;
/**
 * Returns the concatenation of the data of all the Text node descendants of
 * node, in tree order.
 *
 * @param node - a node
 */ function text_descendantTextContent(node) {
    /**
     * The descendant text content of a node node is the concatenation of the
     * data of all the Text node descendants of node, in tree order.
     */ let contents = '';
    let text = TreeAlgorithm_1.tree_getFirstDescendantNode(node, false, false, (e)=>util_1.Guard.isTextNode(e));
    while(text !== null){
        contents += text._data;
        text = TreeAlgorithm_1.tree_getNextDescendantNode(node, text, false, false, (e)=>util_1.Guard.isTextNode(e));
    }
    return contents;
}
exports.text_descendantTextContent = text_descendantTextContent;
/**
 * Splits data at the given offset and returns the remainder as a text
 * node.
 *
 * @param node - a text node
 * @param offset - the offset at which to split the nodes.
 */ function text_split(node, offset) {
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError"
     * DOMException.
     */ const length = node._data.length;
    if (offset > length) {
        throw new DOMException_1.IndexSizeError();
    }
    /**
     * 3. Let count be length minus offset.
     * 4. Let new data be the result of substringing data with node node,
     * offset offset, and count count.
     * 5. Let new node be a new Text node, with the same node document as node.
     * Set new node’s data to new data.
     * 6. Let parent be node’s parent.
     * 7. If parent is not null, then:
     */ const count = length - offset;
    const newData = CharacterDataAlgorithm_1.characterData_substringData(node, offset, count);
    const newNode = CreateAlgorithm_1.create_text(node._nodeDocument, newData);
    const parent = node._parent;
    if (parent !== null) {
        /**
         * 7.1. Insert new node into parent before node’s next sibling.
         */ MutationAlgorithm_1.mutation_insert(newNode, parent, node._nextSibling);
        /**
         * 7.2. For each live range whose start node is node and start offset is
         * greater than offset, set its start node to new node and decrease its
         * start offset by offset.
         * 7.3. For each live range whose end node is node and end offset is greater
         * than offset, set its end node to new node and decrease its end offset
         * by offset.
         * 7.4. For each live range whose start node is parent and start offset is
         * equal to the index of node plus 1, increase its start offset by 1.
         * 7.5. For each live range whose end node is parent and end offset is equal
         * to the index of node plus 1, increase its end offset by 1.
         */ for (const range of dom_1.dom.rangeList){
            if (range._start[0] === node && range._start[1] > offset) {
                range._start[0] = newNode;
                range._start[1] -= offset;
            }
            if (range._end[0] === node && range._end[1] > offset) {
                range._end[0] = newNode;
                range._end[1] -= offset;
            }
            const index = TreeAlgorithm_1.tree_index(node);
            if (range._start[0] === parent && range._start[1] === index + 1) {
                range._start[1]++;
            }
            if (range._end[0] === parent && range._end[1] === index + 1) {
                range._end[1]++;
            }
        }
    }
    /**
     * 8. Replace data with node node, offset offset, count count, and data
     * the empty string.
     * 9. Return new node.
     */ CharacterDataAlgorithm_1.characterData_replaceData(node, offset, count, '');
    return newNode;
}
exports.text_split = text_split;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/RangeAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/util/index.js [app-route] (ecmascript)");
const CreateAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)");
const TreeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)");
const BoundaryPointAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/BoundaryPointAlgorithm.js [app-route] (ecmascript)");
const CharacterDataAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CharacterDataAlgorithm.js [app-route] (ecmascript)");
const NodeAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NodeAlgorithm.js [app-route] (ecmascript)");
const MutationAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationAlgorithm.js [app-route] (ecmascript)");
const TextAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TextAlgorithm.js [app-route] (ecmascript)");
/**
 * Determines if the node's start boundary point is at its end boundary
 * point.
 *
 * @param range - a range
 */ function range_collapsed(range) {
    /**
     * A range is collapsed if its start node is its end node and its start offset is its end offset.
     */ return range._startNode === range._endNode && range._startOffset === range._endOffset;
}
exports.range_collapsed = range_collapsed;
/**
 * Gets the root node of a range.
 *
 * @param range - a range
 */ function range_root(range) {
    /**
     * The root of a live range is the root of its start node.
     */ return TreeAlgorithm_1.tree_rootNode(range._startNode);
}
exports.range_root = range_root;
/**
 * Determines if a node is fully contained in a range.
 *
 * @param node - a node
 * @param range - a range
 */ function range_isContained(node, range) {
    /**
     * A node node is contained in a live range range if node’s root is range’s
     * root, and (node, 0) is after range’s start, and (node, node’s length) is
     * before range’s end.
     */ return TreeAlgorithm_1.tree_rootNode(node) === range_root(range) && BoundaryPointAlgorithm_1.boundaryPoint_position([
        node,
        0
    ], range._start) === interfaces_1.BoundaryPosition.After && BoundaryPointAlgorithm_1.boundaryPoint_position([
        node,
        TreeAlgorithm_1.tree_nodeLength(node)
    ], range._end) === interfaces_1.BoundaryPosition.Before;
}
exports.range_isContained = range_isContained;
/**
 * Determines if a node is partially contained in a range.
 *
 * @param node - a node
 * @param range - a range
 */ function range_isPartiallyContained(node, range) {
    /**
     * A node is partially contained in a live range if it’s an inclusive
     * ancestor of the live range’s start node but not its end node,
     * or vice versa.
     */ const startCheck = TreeAlgorithm_1.tree_isAncestorOf(range._startNode, node, true);
    const endCheck = TreeAlgorithm_1.tree_isAncestorOf(range._endNode, node, true);
    return startCheck && !endCheck || !startCheck && endCheck;
}
exports.range_isPartiallyContained = range_isPartiallyContained;
/**
 * Sets the start boundary point of a range.
 *
 * @param range - a range
 * @param node - a node
 * @param offset - an offset into node
 */ function range_setTheStart(range, node, offset) {
    /**
     * 1. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
     * 2. If offset is greater than node’s length, then throw an "IndexSizeError"
     * DOMException.
     * 3. Let bp be the boundary point (node, offset).
     * 4. If these steps were invoked as "set the start"
     * 4.1. If bp is after the range’s end, or if range’s root is not equal to
     * node’s root, set range’s end to bp.
     * 4.2. Set range’s start to bp.
     */ if (util_1.Guard.isDocumentTypeNode(node)) {
        throw new DOMException_1.InvalidNodeTypeError();
    }
    if (offset > TreeAlgorithm_1.tree_nodeLength(node)) {
        throw new DOMException_1.IndexSizeError();
    }
    const bp = [
        node,
        offset
    ];
    if (range_root(range) !== TreeAlgorithm_1.tree_rootNode(node) || BoundaryPointAlgorithm_1.boundaryPoint_position(bp, range._end) === interfaces_1.BoundaryPosition.After) {
        range._end = bp;
    }
    range._start = bp;
}
exports.range_setTheStart = range_setTheStart;
/**
 * Sets the end boundary point of a range.
 *
 * @param range - a range
 * @param node - a node
 * @param offset - an offset into node
 */ function range_setTheEnd(range, node, offset) {
    /**
     * 1. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
     * 2. If offset is greater than node’s length, then throw an "IndexSizeError"
     * DOMException.
     * 3. Let bp be the boundary point (node, offset).
     * 4. If these steps were invoked as "set the end"
     * 4.1. If bp is before the range’s start, or if range’s root is not equal
     * to node’s root, set range’s start to bp.
     * 4.2. Set range’s end to bp.
     */ if (util_1.Guard.isDocumentTypeNode(node)) {
        throw new DOMException_1.InvalidNodeTypeError();
    }
    if (offset > TreeAlgorithm_1.tree_nodeLength(node)) {
        throw new DOMException_1.IndexSizeError();
    }
    const bp = [
        node,
        offset
    ];
    if (range_root(range) !== TreeAlgorithm_1.tree_rootNode(node) || BoundaryPointAlgorithm_1.boundaryPoint_position(bp, range._start) === interfaces_1.BoundaryPosition.Before) {
        range._start = bp;
    }
    range._end = bp;
}
exports.range_setTheEnd = range_setTheEnd;
/**
 * Selects a node.
 *
 * @param range - a range
 * @param node - a node
 */ function range_select(node, range) {
    /**
     * 1. Let parent be node’s parent.
     * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
     */ const parent = node._parent;
    if (parent === null) throw new DOMException_1.InvalidNodeTypeError();
    /**
     * 3. Let index be node’s index.
     * 4. Set range’s start to boundary point (parent, index).
     * 5. Set range’s end to boundary point (parent, index plus 1).
     */ const index = TreeAlgorithm_1.tree_index(node);
    range._start = [
        parent,
        index
    ];
    range._end = [
        parent,
        index + 1
    ];
}
exports.range_select = range_select;
/**
 * EXtracts the contents of range as a document fragment.
 *
 * @param range - a range
 */ function range_extract(range) {
    /**
     * 1. Let fragment be a new DocumentFragment node whose node document is
     * range’s start node’s node document.
     * 2. If range is collapsed, then return fragment.
     */ const fragment = CreateAlgorithm_1.create_documentFragment(range._startNode._nodeDocument);
    if (range_collapsed(range)) return fragment;
    /**
     * 3. Let original start node, original start offset, original end node,
     * and original end offset be range’s start node, start offset, end node,
     * and end offset, respectively.
     */ const originalStartNode = range._startNode;
    const originalStartOffset = range._startOffset;
    const originalEndNode = range._endNode;
    const originalEndOffset = range._endOffset;
    /**
     * 4. If original start node is original end node, and they are a Text,
     * ProcessingInstruction, or Comment node:
     * 4.1. Let clone be a clone of original start node.
     * 4.2. Set the data of clone to the result of substringing data with node
     * original start node, offset original start offset, and count original end
     * offset minus original start offset.
     * 4.3. Append clone to fragment.
     * 4.4. Replace data with node original start node, offset original start
     * offset, count original end offset minus original start offset, and data
     * the empty string.
     * 4.5. Return fragment.
     */ if (originalStartNode === originalEndNode && util_1.Guard.isCharacterDataNode(originalStartNode)) {
        const clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        CharacterDataAlgorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset, '');
        return fragment;
    }
    /**
     * 5. Let common ancestor be original start node.
     * 6. While common ancestor is not an inclusive ancestor of original end
     * node, set common ancestor to its own parent.
     */ let commonAncestor = originalStartNode;
    while(!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, commonAncestor, true)){
        if (commonAncestor._parent === null) {
            throw new Error("Parent node  is null.");
        }
        commonAncestor = commonAncestor._parent;
    }
    /**
     * 7. Let first partially contained child be null.
     * 8. If original start node is not an inclusive ancestor of original end
     * node, set first partially contained child to the first child of common
     * ancestor that is partially contained in range.
     */ let firstPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
        for (const node of commonAncestor._children){
            if (range_isPartiallyContained(node, range)) {
                firstPartiallyContainedChild = node;
                break;
            }
        }
    }
    /**
     * 9. Let last partially contained child be null.
     * 10. If original end node is not an inclusive ancestor of original start
     * node, set last partially contained child to the last child of common
     * ancestor that is partially contained in range.
     */ let lastPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalStartNode, originalEndNode, true)) {
        const children = [
            ...commonAncestor._children
        ];
        for(let i = children.length - 1; i > 0; i--){
            const node = children[i];
            if (range_isPartiallyContained(node, range)) {
                lastPartiallyContainedChild = node;
                break;
            }
        }
    }
    /**
     * 11. Let contained children be a list of all children of common ancestor
     * that are contained in range, in tree order.
     * 12. If any member of contained children is a doctype, then throw a
     * "HierarchyRequestError" DOMException.
     */ const containedChildren = [];
    for (const child of commonAncestor._children){
        if (range_isContained(child, range)) {
            if (util_1.Guard.isDocumentTypeNode(child)) {
                throw new DOMException_1.HierarchyRequestError();
            }
            containedChildren.push(child);
        }
    }
    let newNode;
    let newOffset;
    if (TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
        /**
         * 13. If original start node is an inclusive ancestor of original end node,
         * set new node to original start node and new offset to original start
         * offset.
         */ newNode = originalStartNode;
        newOffset = originalStartOffset;
    } else {
        /**
         * 14. Otherwise:
         * 14.1. Let reference node equal original start node.
         * 14.2. While reference node’s parent is not null and is not an inclusive
         * ancestor of original end node, set reference node to its parent.
         * 14.3. Set new node to the parent of reference node, and new offset to
         * one plus reference node’s index.
         */ let referenceNode = originalStartNode;
        while(referenceNode._parent !== null && !TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, referenceNode._parent)){
            referenceNode = referenceNode._parent;
        }
        /* istanbul ignore next */ if (referenceNode._parent === null) {
            /**
             * If reference node’s parent is null, it would be the root of range,
             * so would be an inclusive ancestor of original end node, and we could
             * not reach this point.
             */ throw new Error("Parent node is null.");
        }
        newNode = referenceNode._parent;
        newOffset = 1 + TreeAlgorithm_1.tree_index(referenceNode);
    }
    if (util_1.Guard.isCharacterDataNode(firstPartiallyContainedChild)) {
        /**
         * 15. If first partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 15.1. Let clone be a clone of original start node.
         * 15.2. Set the data of clone to the result of substringing data with
         * node original start node, offset original start offset, and count
         * original start node’s length minus original start offset.
         * 15.3. Append clone to fragment.
         * 15.4. Replace data with node original start node, offset original
         * start offset, count original start node’s length minus original start
         * offset, and data the empty string.
         */ const clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, TreeAlgorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        CharacterDataAlgorithm_1.characterData_replaceData(originalStartNode, originalStartOffset, TreeAlgorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset, '');
    } else if (firstPartiallyContainedChild !== null) {
        /**
         * 16. Otherwise, if first partially contained child is not null:
         * 16.1. Let clone be a clone of first partially contained child.
         * 16.2. Append clone to fragment.
         * 16.3. Let subrange be a new live range whose start is (original start
         * node, original start offset) and whose end is (first partially
         * contained child, first partially contained child’s length).
         * 16.4. Let subfragment be the result of extracting subrange.
         * 16.5. Append subfragment to clone.
         */ const clone = NodeAlgorithm_1.node_clone(firstPartiallyContainedChild);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        const subrange = CreateAlgorithm_1.create_range([
            originalStartNode,
            originalStartOffset
        ], [
            firstPartiallyContainedChild,
            TreeAlgorithm_1.tree_nodeLength(firstPartiallyContainedChild)
        ]);
        const subfragment = range_extract(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    /**
     * 17. For each contained child in contained children, append contained
     * child to fragment.
     */ for (const child of containedChildren){
        MutationAlgorithm_1.mutation_append(child, fragment);
    }
    if (util_1.Guard.isCharacterDataNode(lastPartiallyContainedChild)) {
        /**
         * 18. If last partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 18.1. Let clone be a clone of original end node.
         * 18.2. Set the data of clone to the result of substringing data with
         * node original end node, offset 0, and count original end offset.
         * 18.3. Append clone to fragment.
         * 18.4. Replace data with node original end node, offset 0, count
         * original end offset, and data the empty string.
         */ const clone = NodeAlgorithm_1.node_clone(originalEndNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalEndNode, 0, originalEndOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        CharacterDataAlgorithm_1.characterData_replaceData(originalEndNode, 0, originalEndOffset, '');
    } else if (lastPartiallyContainedChild !== null) {
        /**
         * 19. Otherwise, if last partially contained child is not null:
         * 19.1. Let clone be a clone of last partially contained child.
         * 19.2. Append clone to fragment.
         * 19.3. Let subrange be a new live range whose start is (last partially
         * contained child, 0) and whose end is (original end node, original
         * end offset).
         * 19.4. Let subfragment be the result of extracting subrange.
         * 19.5. Append subfragment to clone.
         */ const clone = NodeAlgorithm_1.node_clone(lastPartiallyContainedChild);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        const subrange = CreateAlgorithm_1.create_range([
            lastPartiallyContainedChild,
            0
        ], [
            originalEndNode,
            originalEndOffset
        ]);
        const subfragment = range_extract(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    /**
     * 20. Set range’s start and end to (new node, new offset).
     */ range._start = [
        newNode,
        newOffset
    ];
    range._end = [
        newNode,
        newOffset
    ];
    /**
     * 21. Return fragment.
     */ return fragment;
}
exports.range_extract = range_extract;
/**
 * Clones the contents of range as a document fragment.
 *
 * @param range - a range
 */ function range_cloneTheContents(range) {
    /**
     * 1. Let fragment be a new DocumentFragment node whose node document
     * is range’s start node’s node document.
     * 2. If range is collapsed, then return fragment.
     */ const fragment = CreateAlgorithm_1.create_documentFragment(range._startNode._nodeDocument);
    if (range_collapsed(range)) return fragment;
    /**
     * 3. Let original start node, original start offset, original end node,
     * and original end offset be range’s start node, start offset, end node,
     * and end offset, respectively.
     * 4. If original start node is original end node, and they are a Text,
     * ProcessingInstruction, or Comment node:
     * 4.1. Let clone be a clone of original start node.
     * 4.2. Set the data of clone to the result of substringing data with node
     * original start node, offset original start offset, and count original end
     * offset minus original start offset.
     * 4.3. Append clone to fragment.
     * 4.5. Return fragment.
     */ const originalStartNode = range._startNode;
    const originalStartOffset = range._startOffset;
    const originalEndNode = range._endNode;
    const originalEndOffset = range._endOffset;
    if (originalStartNode === originalEndNode && util_1.Guard.isCharacterDataNode(originalStartNode)) {
        const clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, originalEndOffset - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
    }
    /**
     * 5. Let common ancestor be original start node.
     * 6. While common ancestor is not an inclusive ancestor of original end
     * node, set common ancestor to its own parent.
     */ let commonAncestor = originalStartNode;
    while(!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, commonAncestor, true)){
        if (commonAncestor._parent === null) {
            throw new Error("Parent node  is null.");
        }
        commonAncestor = commonAncestor._parent;
    }
    /**
     * 7. Let first partially contained child be null.
     * 8. If original start node is not an inclusive ancestor of original end
     * node, set first partially contained child to the first child of common
     * ancestor that is partially contained in range.
     */ let firstPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalEndNode, originalStartNode, true)) {
        for (const node of commonAncestor._children){
            if (range_isPartiallyContained(node, range)) {
                firstPartiallyContainedChild = node;
                break;
            }
        }
    }
    /**
     * 9. Let last partially contained child be null.
     * 10. If original end node is not an inclusive ancestor of original start
     * node, set last partially contained child to the last child of common
     * ancestor that is partially contained in range.
     */ let lastPartiallyContainedChild = null;
    if (!TreeAlgorithm_1.tree_isAncestorOf(originalStartNode, originalEndNode, true)) {
        const children = [
            ...commonAncestor._children
        ];
        for(let i = children.length - 1; i > 0; i--){
            const node = children[i];
            if (range_isPartiallyContained(node, range)) {
                lastPartiallyContainedChild = node;
                break;
            }
        }
    }
    /**
     * 11. Let contained children be a list of all children of common ancestor
     * that are contained in range, in tree order.
     * 12. If any member of contained children is a doctype, then throw a
     * "HierarchyRequestError" DOMException.
     */ const containedChildren = [];
    for (const child of commonAncestor._children){
        if (range_isContained(child, range)) {
            if (util_1.Guard.isDocumentTypeNode(child)) {
                throw new DOMException_1.HierarchyRequestError();
            }
            containedChildren.push(child);
        }
    }
    if (util_1.Guard.isCharacterDataNode(firstPartiallyContainedChild)) {
        /**
         * 13. If first partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 13.1. Let clone be a clone of original start node.
         * 13.2. Set the data of clone to the result of substringing data with
         * node original start node, offset original start offset, and count
         * original start node’s length minus original start offset.
         * 13.3. Append clone to fragment.
         */ const clone = NodeAlgorithm_1.node_clone(originalStartNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalStartNode, originalStartOffset, TreeAlgorithm_1.tree_nodeLength(originalStartNode) - originalStartOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
    } else if (firstPartiallyContainedChild !== null) {
        /**
         * 14. Otherwise, if first partially contained child is not null:
         * 14.1. Let clone be a clone of first partially contained child.
         * 14.2. Append clone to fragment.
         * 14.3. Let subrange be a new live range whose start is (original start
         * node, original start offset) and whose end is (first partially
         * contained child, first partially contained child’s length).
         * 14.4. Let subfragment be the result of cloning the contents of
         * subrange.
         * 14.5. Append subfragment to clone.
         */ const clone = NodeAlgorithm_1.node_clone(firstPartiallyContainedChild);
        MutationAlgorithm_1.mutation_append(clone, fragment);
        const subrange = CreateAlgorithm_1.create_range([
            originalStartNode,
            originalStartOffset
        ], [
            firstPartiallyContainedChild,
            TreeAlgorithm_1.tree_nodeLength(firstPartiallyContainedChild)
        ]);
        const subfragment = range_cloneTheContents(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    /**
     * 15. For each contained child in contained children, append contained
     * child to fragment.
     * 15.1. Let clone be a clone of contained child with the clone children
     * flag set.
     * 15.2. Append clone to fragment.
     */ for (const child of containedChildren){
        const clone = NodeAlgorithm_1.node_clone(child);
        MutationAlgorithm_1.mutation_append(clone, fragment);
    }
    if (util_1.Guard.isCharacterDataNode(lastPartiallyContainedChild)) {
        /**
         * 16. If last partially contained child is a Text, ProcessingInstruction,
         * or Comment node:
         * 16.1. Let clone be a clone of original end node.
         * 16.2. Set the data of clone to the result of substringing data with
         * node original end node, offset 0, and count original end offset.
         * 16.3. Append clone to fragment.
         */ const clone = NodeAlgorithm_1.node_clone(originalEndNode);
        clone._data = CharacterDataAlgorithm_1.characterData_substringData(originalEndNode, 0, originalEndOffset);
        MutationAlgorithm_1.mutation_append(clone, fragment);
    } else if (lastPartiallyContainedChild !== null) {
        /**
         * 17. Otherwise, if last partially contained child is not null:
         * 17.1. Let clone be a clone of last partially contained child.
         * 17.2. Append clone to fragment.
         * 17.3. Let subrange be a new live range whose start is (last partially
         * contained child, 0) and whose end is (original end node, original
         * end offset).
         * 17.4. Let subfragment be the result of cloning the contents of subrange.
         * 17.5. Append subfragment to clone.
         */ const clone = NodeAlgorithm_1.node_clone(lastPartiallyContainedChild);
        fragment.append(clone);
        const subrange = CreateAlgorithm_1.create_range([
            lastPartiallyContainedChild,
            0
        ], [
            originalEndNode,
            originalEndOffset
        ]);
        const subfragment = range_extract(subrange);
        MutationAlgorithm_1.mutation_append(subfragment, clone);
    }
    /**
     * 18. Return fragment.
     */ return fragment;
}
exports.range_cloneTheContents = range_cloneTheContents;
/**
 * Inserts a node into a range at the start boundary point.
 *
 * @param node - node to insert
 * @param range - a range
 */ function range_insert(node, range) {
    /**
     * 1. If range’s start node is a ProcessingInstruction or Comment node, is a
     * Text node whose parent is null, or is node, then throw a
     * "HierarchyRequestError" DOMException.
     */ if (util_1.Guard.isProcessingInstructionNode(range._startNode) || util_1.Guard.isCommentNode(range._startNode) || util_1.Guard.isTextNode(range._startNode) && range._startNode._parent === null || range._startNode === node) {
        throw new DOMException_1.HierarchyRequestError();
    }
    /**
     * 2. Let referenceNode be null.
     * 3. If range’s start node is a Text node, set referenceNode to that Text
     * node.
     * 4. Otherwise, set referenceNode to the child of start node whose index is
     * start offset, and null if there is no such child.
     */ let referenceNode = null;
    if (util_1.Guard.isTextNode(range._startNode)) {
        referenceNode = range._startNode;
    } else {
        let index = 0;
        for (const child of range._startNode._children){
            if (index === range._startOffset) {
                referenceNode = child;
                break;
            }
            index++;
        }
    }
    /**
     * 5. Let parent be range’s start node if referenceNode is null, and
     * referenceNode’s parent otherwise.
     */ let parent;
    if (referenceNode === null) {
        parent = range._startNode;
    } else {
        if (referenceNode._parent === null) {
            throw new Error("Parent node is null.");
        }
        parent = referenceNode._parent;
    }
    /**
     * 6. Ensure pre-insertion validity of node into parent before referenceNode.
     */ MutationAlgorithm_1.mutation_ensurePreInsertionValidity(node, parent, referenceNode);
    /**
     * 7. If range’s start node is a Text node, set referenceNode to the result
     * of splitting it with offset range’s start offset.
     */ if (util_1.Guard.isTextNode(range._startNode)) {
        referenceNode = TextAlgorithm_1.text_split(range._startNode, range._startOffset);
    }
    /**
     * 8. If node is referenceNode, set referenceNode to its next sibling.
     */ if (node === referenceNode) {
        referenceNode = node._nextSibling;
    }
    /**
     * 9. If node’s parent is not null, remove node from its parent.
     */ if (node._parent !== null) {
        MutationAlgorithm_1.mutation_remove(node, node._parent);
    }
    /**
     * 10. Let newOffset be parent’s length if referenceNode is null, and
     * referenceNode’s index otherwise.
     */ let newOffset = referenceNode === null ? TreeAlgorithm_1.tree_nodeLength(parent) : TreeAlgorithm_1.tree_index(referenceNode);
    /**
     * 11. Increase newOffset by node’s length if node is a DocumentFragment
     * node, and one otherwise.
     */ if (util_1.Guard.isDocumentFragmentNode(node)) {
        newOffset += TreeAlgorithm_1.tree_nodeLength(node);
    } else {
        newOffset++;
    }
    /**
     * 12. Pre-insert node into parent before referenceNode.
     */ MutationAlgorithm_1.mutation_preInsert(node, parent, referenceNode);
    /**
     * 13. If range is collapsed, then set range’s end to (parent, newOffset).
     */ if (range_collapsed(range)) {
        range._end = [
            parent,
            newOffset
        ];
    }
}
exports.range_insert = range_insert;
/**
 * Traverses through all contained nodes of a range.
 *
 * @param range - a range
 */ function range_getContainedNodes(range) {
    return {
        [Symbol.iterator]: ()=>{
            const container = range.commonAncestorContainer;
            let currentNode = TreeAlgorithm_1.tree_getFirstDescendantNode(container);
            return {
                next: ()=>{
                    while(currentNode && !range_isContained(currentNode, range)){
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                    }
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                        return result;
                    }
                }
            };
        }
    };
}
exports.range_getContainedNodes = range_getContainedNodes;
/**
 * Traverses through all partially contained nodes of a range.
 *
 * @param range - a range
 */ function range_getPartiallyContainedNodes(range) {
    return {
        [Symbol.iterator]: ()=>{
            const container = range.commonAncestorContainer;
            let currentNode = TreeAlgorithm_1.tree_getFirstDescendantNode(container);
            return {
                next: ()=>{
                    while(currentNode && !range_isPartiallyContained(currentNode, range)){
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                    }
                    if (currentNode === null) {
                        return {
                            done: true,
                            value: null
                        };
                    } else {
                        const result = {
                            done: false,
                            value: currentNode
                        };
                        currentNode = TreeAlgorithm_1.tree_getNextDescendantNode(container, currentNode);
                        return result;
                    }
                }
            };
        }
    };
}
exports.range_getPartiallyContainedNodes = range_getPartiallyContainedNodes;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/SelectorsAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
/**
 * Matches elements with the given selectors.
 *
 * @param selectors - selectors
 * @param node - the node to match against
 */ function selectors_scopeMatchASelectorsString(selectors, node) {
    /**
     * TODO: Selectors
     * 1. Let s be the result of parse a selector selectors. [SELECTORS4]
     * 2. If s is failure, then throw a "SyntaxError" DOMException.
     * 3. Return the result of match a selector against a tree with s and node’s
     * root using scoping root node. [SELECTORS4].
     */ throw new DOMException_1.NotSupportedError();
}
exports.selectors_scopeMatchASelectorsString = selectors_scopeMatchASelectorsString;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeWalkerAlgorithm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const TraversalAlgorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TraversalAlgorithm.js [app-route] (ecmascript)");
/**
 * Returns the first or last child node, or `null` if there are none.
 *
 * @param walker - the `TreeWalker` instance
 * @param first - `true` to return the first child node, or `false` to
 * return the last child node.
 */ function treeWalker_traverseChildren(walker, first) {
    /**
     * 1. Let node be walker’s current.
     * 2. Set node to node’s first child if type is first, and node’s last child
     * if type is last.
     * 3. While node is non-null:
     */ let node = first ? walker._current._firstChild : walker._current._lastChild;
    while(node !== null){
        /**
         * 3.1. Let result be the result of filtering node within walker.
         */ const result = TraversalAlgorithm_1.traversal_filter(walker, node);
        if (result === interfaces_1.FilterResult.Accept) {
            /**
             * 3.2. If result is FILTER_ACCEPT, then set walker’s current to node and
             * return node.
             */ walker._current = node;
            return node;
        } else if (result === interfaces_1.FilterResult.Skip) {
            /**
             * 3.3. If result is FILTER_SKIP, then:
             * 3.3.1. Let child be node’s first child if type is first, and node’s
             * last child if type is last.
             * 3.3.2. If child is non-null, then set node to child and continue.
             */ const child = first ? node._firstChild : node._lastChild;
            if (child !== null) {
                node = child;
                continue;
            }
        }
        /**
         * 3.4. While node is non-null:
         */ while(node !== null){
            /**
             * 3.4.1. Let sibling be node’s next sibling if type is first, and
             * node’s previous sibling if type is last.
             * 3.4.2. If sibling is non-null, then set node to sibling and break.
             */ const sibling = first ? node._nextSibling : node._previousSibling;
            if (sibling !== null) {
                node = sibling;
                break;
            }
            /**
             * 3.4.3. Let parent be node’s parent.
             * 3.4.4. If parent is null, walker’s root, or walker’s current, then
             * return null.
             */ const parent = node._parent;
            if (parent === null || parent === walker._root || parent === walker._current) {
                return null;
            }
            /**
             * 3.4.5. Set node to parent.
             */ node = parent;
        }
    }
    /**
     * 5. Return null
     */ return null;
}
exports.treeWalker_traverseChildren = treeWalker_traverseChildren;
/**
 * Returns the next or previous sibling node, or `null` if there are none.
 *
 * @param walker - the `TreeWalker` instance
 * @param next - `true` to return the next sibling node, or `false` to
 * return the previous sibling node.
 */ function treeWalker_traverseSiblings(walker, next) {
    /**
     * 1. Let node be walker’s current.
     * 2. If node is root, then return null.
     * 3. While node is non-null:
     */ let node = walker._current;
    if (node === walker._root) return null;
    while(true){
        /**
         * 3.1. Let sibling be node’s next sibling if type is next, and node’s
         * previous sibling if type is previous.
         * 3.2. While sibling is non-null:
         */ let sibling = next ? node._nextSibling : node._previousSibling;
        while(sibling !== null){
            /**
             * 3.2.1. Set node to sibling.
             * 3.2.2. Let result be the result of filtering node within walker.
             * 3.2.3. If result is FILTER_ACCEPT, then set walker’s current to node
             * and return node.
             */ node = sibling;
            const result = TraversalAlgorithm_1.traversal_filter(walker, node);
            if (result === interfaces_1.FilterResult.Accept) {
                walker._current = node;
                return node;
            }
            /**
             * 3.2.4. Set sibling to node’s first child if type is next, and node’s
             * last child if type is previous.
             * 3.2.5. If result is FILTER_REJECT or sibling is null, then set
             * sibling to node’s next sibling if type is next, and node’s previous
             * sibling if type is previous.
             */ sibling = next ? node._firstChild : node._lastChild;
            if (result === interfaces_1.FilterResult.Reject || sibling === null) {
                sibling = next ? node._nextSibling : node._previousSibling;
            }
        }
        /**
         * 3.3. Set node to node’s parent.
         * 3.4. If node is null or walker’s root, then return null.
         */ node = node._parent;
        if (node === null || node === walker._root) {
            return null;
        }
        /**
         * 3.5. If the return value of filtering node within walker is FILTER_ACCEPT,
         * then return null.
         */ if (TraversalAlgorithm_1.traversal_filter(walker, node) === interfaces_1.FilterResult.Accept) {
            return null;
        }
    }
}
exports.treeWalker_traverseSiblings = treeWalker_traverseSiblings;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function __export(m) {
    for(var p in m)if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", {
    value: true
});
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/AbortAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/AttrAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/BoundaryPointAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CharacterDataAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CreateAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/CustomElementAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DocumentAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/DOMTokenListAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ElementAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/EventAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/EventTargetAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/MutationObserverAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NamespaceAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NodeAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/NodeIteratorAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/OrderedSetAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ParentNodeAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/RangeAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/SelectorsAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/ShadowTreeAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TextAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TraversalAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/TreeWalkerAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/WebIDLAlgorithm.js [app-route] (ecmascript)"));
__export(__turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/XMLAlgorithm.js [app-route] (ecmascript)"));
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/interfaces.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Defines the type of a token.
 */ var TokenType;
(function(TokenType) {
    TokenType[TokenType["EOF"] = 0] = "EOF";
    TokenType[TokenType["Declaration"] = 1] = "Declaration";
    TokenType[TokenType["DocType"] = 2] = "DocType";
    TokenType[TokenType["Element"] = 3] = "Element";
    TokenType[TokenType["Text"] = 4] = "Text";
    TokenType[TokenType["CDATA"] = 5] = "CDATA";
    TokenType[TokenType["PI"] = 6] = "PI";
    TokenType[TokenType["Comment"] = 7] = "Comment";
    TokenType[TokenType["ClosingTag"] = 8] = "ClosingTag";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/XMLStringLexer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/interfaces.js [app-route] (ecmascript)");
/**
 * Represents a lexer for XML content in a string.
 */ class XMLStringLexer {
    /**
     * Initializes a new instance of `XMLStringLexer`.
     *
     * @param str - the string to tokenize and lex
     * @param options - lexer options
     */ constructor(str, options){
        this._options = {
            skipWhitespaceOnlyText: false
        };
        this.err = {
            line: -1,
            col: -1,
            index: -1,
            str: ""
        };
        this._str = str;
        this._index = 0;
        this._length = str.length;
        if (options) {
            this._options.skipWhitespaceOnlyText = options.skipWhitespaceOnlyText || false;
        }
    }
    /**
     * Returns the next token.
     */ nextToken() {
        if (this.eof()) {
            return {
                type: interfaces_1.TokenType.EOF
            };
        }
        let token = this.skipIfStartsWith('<') ? this.openBracket() : this.text();
        if (this._options.skipWhitespaceOnlyText) {
            if (token.type === interfaces_1.TokenType.Text && XMLStringLexer.isWhiteSpaceToken(token)) {
                token = this.nextToken();
            }
        }
        return token;
    }
    /**
     * Branches from an opening bracket (`<`).
     */ openBracket() {
        if (this.skipIfStartsWith('?')) {
            if (this.skipIfStartsWith('xml')) {
                if (XMLStringLexer.isSpace(this._str[this._index])) {
                    return this.declaration();
                } else {
                    // a processing instruction starting with xml. e.g. <?xml-stylesheet href="doc.xsl" type="text/xsl"?>
                    this.seek(-3);
                    return this.pi();
                }
            } else {
                return this.pi();
            }
        } else if (this.skipIfStartsWith('!')) {
            if (this.skipIfStartsWith('--')) {
                return this.comment();
            } else if (this.skipIfStartsWith('[CDATA[')) {
                return this.cdata();
            } else if (this.skipIfStartsWith('DOCTYPE')) {
                return this.doctype();
            } else {
                this.throwError("Invalid '!' in opening tag.");
            }
        } else if (this.skipIfStartsWith('/')) {
            return this.closeTag();
        } else {
            return this.openTag();
        }
    }
    /**
     * Produces an XML declaration token.
     */ declaration() {
        let version = '';
        let encoding = '';
        let standalone = '';
        while(!this.eof()){
            this.skipSpace();
            if (this.skipIfStartsWith('?>')) {
                return {
                    type: interfaces_1.TokenType.Declaration,
                    version: version,
                    encoding: encoding,
                    standalone: standalone
                };
            } else {
                // attribute name
                const [attName, attValue] = this.attribute();
                if (attName === 'version') version = attValue;
                else if (attName === 'encoding') encoding = attValue;
                else if (attName === 'standalone') standalone = attValue;
                else this.throwError('Invalid attribute name: ' + attName);
            }
        }
        this.throwError('Missing declaration end symbol `?>`');
    }
    /**
     * Produces a doc type token.
     */ doctype() {
        let pubId = '';
        let sysId = '';
        // name
        this.skipSpace();
        const name = this.takeUntil2('[', '>', true);
        this.skipSpace();
        if (this.skipIfStartsWith('PUBLIC')) {
            pubId = this.quotedString();
            sysId = this.quotedString();
        } else if (this.skipIfStartsWith('SYSTEM')) {
            sysId = this.quotedString();
        }
        // skip internal subset
        this.skipSpace();
        if (this.skipIfStartsWith('[')) {
            // skip internal subset nodes
            this.skipUntil(']');
            if (!this.skipIfStartsWith(']')) {
                this.throwError('Missing end bracket of DTD internal subset');
            }
        }
        this.skipSpace();
        if (!this.skipIfStartsWith('>')) {
            this.throwError('Missing doctype end symbol `>`');
        }
        return {
            type: interfaces_1.TokenType.DocType,
            name: name,
            pubId: pubId,
            sysId: sysId
        };
    }
    /**
     * Produces a processing instruction token.
     */ pi() {
        const target = this.takeUntilStartsWith('?>', true);
        if (this.eof()) {
            this.throwError('Missing processing instruction end symbol `?>`');
        }
        this.skipSpace();
        if (this.skipIfStartsWith('?>')) {
            return {
                type: interfaces_1.TokenType.PI,
                target: target,
                data: ''
            };
        }
        const data = this.takeUntilStartsWith('?>');
        if (this.eof()) {
            this.throwError('Missing processing instruction end symbol `?>`');
        }
        this.seek(2);
        return {
            type: interfaces_1.TokenType.PI,
            target: target,
            data: data
        };
    }
    /**
     * Produces a text token.
     *
     */ text() {
        const data = this.takeUntil('<');
        return {
            type: interfaces_1.TokenType.Text,
            data: data
        };
    }
    /**
     * Produces a comment token.
     *
     */ comment() {
        const data = this.takeUntilStartsWith('-->');
        if (this.eof()) {
            this.throwError('Missing comment end symbol `-->`');
        }
        this.seek(3);
        return {
            type: interfaces_1.TokenType.Comment,
            data: data
        };
    }
    /**
     * Produces a CDATA token.
     *
     */ cdata() {
        const data = this.takeUntilStartsWith(']]>');
        if (this.eof()) {
            this.throwError('Missing CDATA end symbol `]>`');
        }
        this.seek(3);
        return {
            type: interfaces_1.TokenType.CDATA,
            data: data
        };
    }
    /**
     * Produces an element token.
     */ openTag() {
        // element name
        this.skipSpace();
        const name = this.takeUntil2('>', '/', true);
        this.skipSpace();
        if (this.skipIfStartsWith('>')) {
            return {
                type: interfaces_1.TokenType.Element,
                name: name,
                attributes: [],
                selfClosing: false
            };
        } else if (this.skipIfStartsWith('/>')) {
            return {
                type: interfaces_1.TokenType.Element,
                name: name,
                attributes: [],
                selfClosing: true
            };
        }
        // attributes
        const attributes = [];
        while(!this.eof()){
            // end tag
            this.skipSpace();
            if (this.skipIfStartsWith('>')) {
                return {
                    type: interfaces_1.TokenType.Element,
                    name: name,
                    attributes: attributes,
                    selfClosing: false
                };
            } else if (this.skipIfStartsWith('/>')) {
                return {
                    type: interfaces_1.TokenType.Element,
                    name: name,
                    attributes: attributes,
                    selfClosing: true
                };
            }
            const attr = this.attribute();
            attributes.push(attr);
        }
        this.throwError('Missing opening element tag end symbol `>`');
    }
    /**
     * Produces a closing tag token.
     *
     */ closeTag() {
        this.skipSpace();
        const name = this.takeUntil('>', true);
        this.skipSpace();
        if (!this.skipIfStartsWith('>')) {
            this.throwError('Missing closing element tag end symbol `>`');
        }
        return {
            type: interfaces_1.TokenType.ClosingTag,
            name: name
        };
    }
    /**
     * Reads an attribute name, value pair
     */ attribute() {
        // attribute name
        this.skipSpace();
        const name = this.takeUntil('=', true);
        this.skipSpace();
        if (!this.skipIfStartsWith('=')) {
            this.throwError('Missing equals sign before attribute value');
        }
        // attribute value
        const value = this.quotedString();
        return [
            name,
            value
        ];
    }
    /**
     * Reads a string between double or single quotes.
     */ quotedString() {
        this.skipSpace();
        const startQuote = this.take(1);
        if (!XMLStringLexer.isQuote(startQuote)) {
            this.throwError('Missing start quote character before quoted value');
        }
        const value = this.takeUntil(startQuote);
        if (!this.skipIfStartsWith(startQuote)) {
            this.throwError('Missing end quote character after quoted value');
        }
        return value;
    }
    /**
     * Determines if the current index is at or past the end of input string.
     */ eof() {
        return this._index >= this._length;
    }
    /**
     * Skips the length of the given string if the string from current position
     * starts with the given string.
     *
     * @param str - the string to match
     */ skipIfStartsWith(str) {
        const strLength = str.length;
        if (strLength === 1) {
            if (this._str[this._index] === str) {
                this._index++;
                return true;
            } else {
                return false;
            }
        }
        for(let i = 0; i < strLength; i++){
            if (this._str[this._index + i] !== str[i]) return false;
        }
        this._index += strLength;
        return true;
    }
    /**
     * Seeks a number of character codes.
     *
     * @param count - number of characters to skip
     */ seek(count) {
        this._index += count;
        if (this._index < 0) this._index = 0;
        if (this._index > this._length) this._index = this._length;
    }
    /**
     * Skips space characters.
     */ skipSpace() {
        while(!this.eof() && XMLStringLexer.isSpace(this._str[this._index])){
            this._index++;
        }
    }
    /**
     * Takes a given number of characters.
     *
     * @param count - character count
     */ take(count) {
        if (count === 1) {
            return this._str[this._index++];
        }
        const startIndex = this._index;
        this.seek(count);
        return this._str.slice(startIndex, this._index);
    }
    /**
     * Takes characters until the next character matches `char`.
     *
     * @param char - a character to match
     * @param space - whether a space character stops iteration
     */ takeUntil(char, space = false) {
        const startIndex = this._index;
        while(this._index < this._length){
            const c = this._str[this._index];
            if (c !== char && (!space || !XMLStringLexer.isSpace(c))) {
                this._index++;
            } else {
                break;
            }
        }
        return this._str.slice(startIndex, this._index);
    }
    /**
     * Takes characters until the next character matches `char1` or `char1`.
     *
     * @param char1 - a character to match
     * @param char2 - a character to match
     * @param space - whether a space character stops iteration
     */ takeUntil2(char1, char2, space = false) {
        const startIndex = this._index;
        while(this._index < this._length){
            const c = this._str[this._index];
            if (c !== char1 && c !== char2 && (!space || !XMLStringLexer.isSpace(c))) {
                this._index++;
            } else {
                break;
            }
        }
        return this._str.slice(startIndex, this._index);
    }
    /**
     * Takes characters until the next characters matches `str`.
     *
     * @param str - a string to match
     * @param space - whether a space character stops iteration
     */ takeUntilStartsWith(str, space = false) {
        const startIndex = this._index;
        const strLength = str.length;
        while(this._index < this._length){
            let match = true;
            for(let i = 0; i < strLength; i++){
                const c = this._str[this._index + i];
                const char = str[i];
                if (space && XMLStringLexer.isSpace(c)) {
                    return this._str.slice(startIndex, this._index);
                } else if (c !== char) {
                    this._index++;
                    match = false;
                    break;
                }
            }
            if (match) return this._str.slice(startIndex, this._index);
        }
        this._index = this._length;
        return this._str.slice(startIndex);
    }
    /**
     * Skips characters until the next character matches `char`.
     *
     * @param char - a character to match
     */ skipUntil(char) {
        while(this._index < this._length){
            const c = this._str[this._index];
            if (c !== char) {
                this._index++;
            } else {
                break;
            }
        }
    }
    /**
     * Determines if the given token is entirely whitespace.
     *
     * @param token - the token to check
     */ static isWhiteSpaceToken(token) {
        const str = token.data;
        for(let i = 0; i < str.length; i++){
            const c = str[i];
            if (c !== ' ' && c !== '\n' && c !== '\r' && c !== '\t' && c !== '\f') return false;
        }
        return true;
    }
    /**
     * Determines if the given character is whitespace.
     *
     * @param char - the character to check
     */ static isSpace(char) {
        return char === ' ' || char === '\n' || char === '\r' || char === '\t';
    }
    /**
     * Determines if the given character is a quote character.
     *
     * @param char - the character to check
     */ static isQuote(char) {
        return char === '"' || char === '\'';
    }
    /**
     * Throws a parser error and records the line and column numbers in the parsed
     * string.
     *
     * @param msg - error message
     */ throwError(msg) {
        const regexp = /\r\n|\r|\n/g;
        let match = null;
        let line = 0;
        let firstNewLineIndex = 0;
        let lastNewlineIndex = this._str.length;
        while((match = regexp.exec(this._str)) !== null){
            if (match === null) break;
            line++;
            if (match.index < this._index) firstNewLineIndex = regexp.lastIndex;
            if (match.index > this._index) {
                lastNewlineIndex = match.index;
                break;
            }
        }
        this.err = {
            line: line,
            col: this._index - firstNewLineIndex,
            index: this._index,
            str: this._str.substring(firstNewLineIndex, lastNewlineIndex)
        };
        throw new Error(msg + "\nIndex: " + this.err.index + "\nLn: " + this.err.line + ", Col: " + this.err.col + "\nInput: " + this.err.str);
    }
    /**
     * Returns an iterator for the lexer.
     */ [Symbol.iterator]() {
        this._index = 0;
        return {
            next: (function() {
                const token = this.nextToken();
                if (token.type === interfaces_1.TokenType.EOF) {
                    return {
                        done: true,
                        value: null
                    };
                } else {
                    return {
                        done: false,
                        value: token
                    };
                }
            }).bind(this)
        };
    }
}
exports.XMLStringLexer = XMLStringLexer;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/XMLParserImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const XMLStringLexer_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/XMLStringLexer.js [app-route] (ecmascript)");
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/interfaces.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const LocalNameSet_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/LocalNameSet.js [app-route] (ecmascript)");
/**
 * Represents a parser for XML content.
 *
 * See: https://html.spec.whatwg.org/#xml-parser
 */ class XMLParserImpl {
    /**
     * Parses XML content.
     *
     * @param source - a string containing XML content
     */ parse(source) {
        const lexer = new XMLStringLexer_1.XMLStringLexer(source, {
            skipWhitespaceOnlyText: true
        });
        const doc = algorithm_1.create_document();
        let context = doc;
        let token = lexer.nextToken();
        while(token.type !== interfaces_1.TokenType.EOF){
            switch(token.type){
                case interfaces_1.TokenType.Declaration:
                    const declaration = token;
                    if (declaration.version !== "1.0") {
                        throw new Error("Invalid xml version: " + declaration.version);
                    }
                    break;
                case interfaces_1.TokenType.DocType:
                    const doctype = token;
                    if (!algorithm_1.xml_isPubidChar(doctype.pubId)) {
                        throw new Error("DocType public identifier does not match PubidChar construct.");
                    }
                    if (!algorithm_1.xml_isLegalChar(doctype.sysId) || doctype.sysId.indexOf('"') !== -1 && doctype.sysId.indexOf("'") !== -1) {
                        throw new Error("DocType system identifier contains invalid characters.");
                    }
                    context.appendChild(doc.implementation.createDocumentType(doctype.name, doctype.pubId, doctype.sysId));
                    break;
                case interfaces_1.TokenType.CDATA:
                    const cdata = token;
                    if (!algorithm_1.xml_isLegalChar(cdata.data) || cdata.data.indexOf("]]>") !== -1) {
                        throw new Error("CDATA contains invalid characters.");
                    }
                    context.appendChild(doc.createCDATASection(cdata.data));
                    break;
                case interfaces_1.TokenType.Comment:
                    const comment = token;
                    if (!algorithm_1.xml_isLegalChar(comment.data) || comment.data.indexOf("--") !== -1 || comment.data.endsWith("-")) {
                        throw new Error("Comment data contains invalid characters.");
                    }
                    context.appendChild(doc.createComment(comment.data));
                    break;
                case interfaces_1.TokenType.PI:
                    const pi = token;
                    if (pi.target.indexOf(":") !== -1 || /^xml$/i.test(pi.target)) {
                        throw new Error("Processing instruction target contains invalid characters.");
                    }
                    if (!algorithm_1.xml_isLegalChar(pi.data) || pi.data.indexOf("?>") !== -1) {
                        throw new Error("Processing instruction data contains invalid characters.");
                    }
                    context.appendChild(doc.createProcessingInstruction(pi.target, pi.data));
                    break;
                case interfaces_1.TokenType.Text:
                    const text = token;
                    if (!algorithm_1.xml_isLegalChar(text.data)) {
                        throw new Error("Text data contains invalid characters.");
                    }
                    context.appendChild(doc.createTextNode(text.data));
                    break;
                case interfaces_1.TokenType.Element:
                    const element = token;
                    // inherit namespace from parent
                    const [prefix, localName] = algorithm_1.namespace_extractQName(element.name);
                    if (localName.indexOf(":") !== -1 || !algorithm_1.xml_isName(localName)) {
                        throw new Error("Node local name contains invalid characters.");
                    }
                    if (prefix === "xmlns") {
                        throw new Error("An element cannot have the 'xmlns' prefix.");
                    }
                    let namespace = context.lookupNamespaceURI(prefix);
                    // override namespace if there is a namespace declaration
                    // attribute
                    // also lookup namespace declaration attributes
                    const nsDeclarations = {};
                    for (const [attName, attValue] of element.attributes){
                        if (attName === "xmlns") {
                            namespace = attValue;
                        } else {
                            const [attPrefix, attLocalName] = algorithm_1.namespace_extractQName(attName);
                            if (attPrefix === "xmlns") {
                                if (attLocalName === prefix) {
                                    namespace = attValue;
                                }
                                nsDeclarations[attLocalName] = attValue;
                            }
                        }
                    }
                    // create the DOM element node
                    const elementNode = namespace !== null ? doc.createElementNS(namespace, element.name) : doc.createElement(element.name);
                    context.appendChild(elementNode);
                    // assign attributes
                    const localNameSet = new LocalNameSet_1.LocalNameSet();
                    for (const [attName, attValue] of element.attributes){
                        const [attPrefix, attLocalName] = algorithm_1.namespace_extractQName(attName);
                        let attNamespace = null;
                        if (attPrefix === "xmlns" || attPrefix === null && attLocalName === "xmlns") {
                            // namespace declaration attribute
                            attNamespace = infra_1.namespace.XMLNS;
                        } else {
                            attNamespace = elementNode.lookupNamespaceURI(attPrefix);
                            if (attNamespace !== null && elementNode.isDefaultNamespace(attNamespace)) {
                                attNamespace = null;
                            } else if (attNamespace === null && attPrefix !== null) {
                                attNamespace = nsDeclarations[attPrefix] || null;
                            }
                        }
                        if (localNameSet.has(attNamespace, attLocalName)) {
                            throw new Error("Element contains duplicate attributes.");
                        }
                        localNameSet.set(attNamespace, attLocalName);
                        if (attNamespace === infra_1.namespace.XMLNS) {
                            if (attValue === infra_1.namespace.XMLNS) {
                                throw new Error("XMLNS namespace is reserved.");
                            }
                        }
                        if (attLocalName.indexOf(":") !== -1 || !algorithm_1.xml_isName(attLocalName)) {
                            throw new Error("Attribute local name contains invalid characters.");
                        }
                        if (attPrefix === "xmlns" && attValue === "") {
                            throw new Error("Empty XML namespace is not allowed.");
                        }
                        if (attNamespace !== null) elementNode.setAttributeNS(attNamespace, attName, attValue);
                        else elementNode.setAttribute(attName, attValue);
                    }
                    if (!element.selfClosing) {
                        context = elementNode;
                    }
                    break;
                case interfaces_1.TokenType.ClosingTag:
                    const closingTag = token;
                    if (closingTag.name !== context.nodeName) {
                        throw new Error('Closing tag name does not match opening tag name.');
                    }
                    /* istanbul ignore else */ if (context._parent) {
                        context = context._parent;
                    }
                    break;
            }
            token = lexer.nextToken();
        }
        return doc;
    }
}
exports.XMLParserImpl = XMLParserImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/DOMParserImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
const XMLParserImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/XMLParserImpl.js [app-route] (ecmascript)");
/**
 * Represents a parser for XML and HTML content.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-domparser-interface
 */ class DOMParserImpl {
    /** @inheritdoc */ parseFromString(source, mimeType) {
        if (mimeType === "text/html") throw new Error('HTML parser not implemented.');
        try {
            const parser = new XMLParserImpl_1.XMLParserImpl();
            const doc = parser.parse(source);
            doc._contentType = mimeType;
            return doc;
        } catch (e) {
            const errorNS = "http://www.mozilla.org/newlayout/xml/parsererror.xml";
            const doc = algorithm_1.create_xmlDocument();
            const root = doc.createElementNS(errorNS, "parsererror");
            const ele = doc.createElementNS(errorNS, "error");
            ele.setAttribute("message", e.message);
            root.appendChild(ele);
            doc.appendChild(root);
            return doc;
        }
    }
}
exports.DOMParserImpl = DOMParserImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Export classes
var DOMParserImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/DOMParserImpl.js [app-route] (ecmascript)");
exports.DOMParser = DOMParserImpl_1.DOMParserImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/XMLSerializerImpl.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const interfaces_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/interfaces.js [app-route] (ecmascript)");
const LocalNameSet_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/LocalNameSet.js [app-route] (ecmascript)");
const NamespacePrefixMap_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/NamespacePrefixMap.js [app-route] (ecmascript)");
const DOMException_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/DOMException.js [app-route] (ecmascript)");
const infra_1 = __turbopack_context__.r("[project]/node_modules/@oozcitak/infra/lib/index.js [app-route] (ecmascript)");
const algorithm_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/algorithm/index.js [app-route] (ecmascript)");
/**
 * Represents an XML serializer.
 *
 * Implements: https://www.w3.org/TR/DOM-Parsing/#serializing
 */ class XMLSerializerImpl {
    /** @inheritdoc */ serializeToString(root) {
        /**
         * The serializeToString(root) method must produce an XML serialization
         * of root passing a value of false for the require well-formed parameter,
         * and return the result.
         */ return this._xmlSerialization(root, false);
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _xmlSerialization(node, requireWellFormed) {
        // To increase performance, use a namespace-aware serializer only if the
        // document has namespaced elements
        if (node._nodeDocument === undefined || node._nodeDocument._hasNamespaces) {
            /** From: https://w3c.github.io/DOM-Parsing/#xml-serialization
             *
             * 1. Let namespace be a context namespace with value null.
             * The context namespace tracks the XML serialization algorithm's current
             * default namespace. The context namespace is changed when either an Element
             * Node has a default namespace declaration, or the algorithm generates a
             * default namespace declaration for the Element Node to match its own
             * namespace. The algorithm assumes no namespace (null) to start.
             * 2. Let prefix map be a new namespace prefix map.
             * 3. Add the XML namespace with prefix value "xml" to prefix map.
             * 4. Let prefix index be a generated namespace prefix index with value 1.
             * The generated namespace prefix index is used to generate a new unique
             * prefix value when no suitable existing namespace prefix is available to
             * serialize a node's namespaceURI (or the namespaceURI of one of node's
             * attributes). See the generate a prefix algorithm.
             */ const namespace = null;
            const prefixMap = new NamespacePrefixMap_1.NamespacePrefixMap();
            prefixMap.set("xml", infra_1.namespace.XML);
            const prefixIndex = {
                value: 1
            };
            /**
             * 5. Return the result of running the XML serialization algorithm on node
             * passing the context namespace namespace, namespace prefix map prefix map,
             * generated namespace prefix index reference to prefix index, and the
             * flag require well-formed. If an exception occurs during the execution
             * of the algorithm, then catch that exception and throw an
             * "InvalidStateError" DOMException.
             */ try {
                return this._serializeNodeNS(node, namespace, prefixMap, prefixIndex, requireWellFormed);
            } catch (_a) {
                throw new DOMException_1.InvalidStateError();
            }
        } else {
            try {
                return this._serializeNode(node, requireWellFormed);
            } catch (_b) {
                throw new DOMException_1.InvalidStateError();
            }
        }
    }
    /**
     * Produces an XML serialization of a node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */ _serializeNodeNS(node, namespace, prefixMap, prefixIndex, requireWellFormed) {
        switch(node.nodeType){
            case interfaces_1.NodeType.Element:
                return this._serializeElementNS(node, namespace, prefixMap, prefixIndex, requireWellFormed);
            case interfaces_1.NodeType.Document:
                return this._serializeDocumentNS(node, namespace, prefixMap, prefixIndex, requireWellFormed);
            case interfaces_1.NodeType.Comment:
                return this._serializeComment(node, requireWellFormed);
            case interfaces_1.NodeType.Text:
                return this._serializeText(node, requireWellFormed);
            case interfaces_1.NodeType.DocumentFragment:
                return this._serializeDocumentFragmentNS(node, namespace, prefixMap, prefixIndex, requireWellFormed);
            case interfaces_1.NodeType.DocumentType:
                return this._serializeDocumentType(node, requireWellFormed);
            case interfaces_1.NodeType.ProcessingInstruction:
                return this._serializeProcessingInstruction(node, requireWellFormed);
            case interfaces_1.NodeType.CData:
                return this._serializeCData(node, requireWellFormed);
            default:
                throw new Error(`Unknown node type: ${node.nodeType}`);
        }
    }
    /**
     * Produces an XML serialization of a node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeNode(node, requireWellFormed) {
        switch(node.nodeType){
            case interfaces_1.NodeType.Element:
                return this._serializeElement(node, requireWellFormed);
            case interfaces_1.NodeType.Document:
                return this._serializeDocument(node, requireWellFormed);
            case interfaces_1.NodeType.Comment:
                return this._serializeComment(node, requireWellFormed);
            case interfaces_1.NodeType.Text:
                return this._serializeText(node, requireWellFormed);
            case interfaces_1.NodeType.DocumentFragment:
                return this._serializeDocumentFragment(node, requireWellFormed);
            case interfaces_1.NodeType.DocumentType:
                return this._serializeDocumentType(node, requireWellFormed);
            case interfaces_1.NodeType.ProcessingInstruction:
                return this._serializeProcessingInstruction(node, requireWellFormed);
            case interfaces_1.NodeType.CData:
                return this._serializeCData(node, requireWellFormed);
            default:
                throw new Error(`Unknown node type: ${node.nodeType}`);
        }
    }
    /**
     * Produces an XML serialization of an element node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */ _serializeElementNS(node, namespace, prefixMap, prefixIndex, requireWellFormed) {
        /**
         * From: https://w3c.github.io/DOM-Parsing/#xml-serializing-an-element-node
         *
         * 1. If the require well-formed flag is set (its value is true), and this
         * node's localName attribute contains the character ":" (U+003A COLON) or
         * does not match the XML Name production, then throw an exception; the
         * serialization of this node would not be a well-formed element.
         */ if (requireWellFormed && (node.localName.indexOf(":") !== -1 || !algorithm_1.xml_isName(node.localName))) {
            throw new Error("Node local name contains invalid characters (well-formed required).");
        }
        /**
         * 2. Let markup be the string "<" (U+003C LESS-THAN SIGN).
         * 3. Let qualified name be an empty string.
         * 4. Let skip end tag be a boolean flag with value false.
         * 5. Let ignore namespace definition attribute be a boolean flag with value
         * false.
         * 6. Given prefix map, copy a namespace prefix map and let map be the
         * result.
         * 7. Let local prefixes map be an empty map. The map has unique Node prefix
         * strings as its keys, with corresponding namespaceURI Node values as the
         * map's key values (in this map, the null namespace is represented by the
         * empty string).
         *
         * _Note:_ This map is local to each element. It is used to ensure there
         * are no conflicting prefixes should a new namespace prefix attribute need
         * to be generated. It is also used to enable skipping of duplicate prefix
         * definitions when writing an element's attributes: the map allows the
         * algorithm to distinguish between a prefix in the namespace prefix map
         * that might be locally-defined (to the current Element) and one that is
         * not.
         * 8. Let local default namespace be the result of recording the namespace
         * information for node given map and local prefixes map.
         *
         * _Note:_ The above step will update map with any found namespace prefix
         * definitions, add the found prefix definitions to the local prefixes map
         * and return a local default namespace value defined by a default namespace
         * attribute if one exists. Otherwise it returns null.
         * 9. Let inherited ns be a copy of namespace.
         * 10. Let ns be the value of node's namespaceURI attribute.
         */ let markup = "<";
        let qualifiedName = '';
        let skipEndTag = false;
        let ignoreNamespaceDefinitionAttribute = false;
        let map = prefixMap.copy();
        let localPrefixesMap = {};
        let localDefaultNamespace = this._recordNamespaceInformation(node, map, localPrefixesMap);
        let inheritedNS = namespace;
        let ns = node.namespaceURI;
        /** 11. If inherited ns is equal to ns, then: */ if (inheritedNS === ns) {
            /**
             * 11.1. If local default namespace is not null, then set ignore
             * namespace definition attribute to true.
             */ if (localDefaultNamespace !== null) {
                ignoreNamespaceDefinitionAttribute = true;
            }
            /**
             * 11.2. If ns is the XML namespace, then append to qualified name the
             * concatenation of the string "xml:" and the value of node's localName.
             * 11.3. Otherwise, append to qualified name the value of node's
             * localName. The node's prefix if it exists, is dropped.
             */ if (ns === infra_1.namespace.XML) {
                qualifiedName = 'xml:' + node.localName;
            } else {
                qualifiedName = node.localName;
            }
            /** 11.4. Append the value of qualified name to markup. */ markup += qualifiedName;
        } else {
            /**
             * 12. Otherwise, inherited ns is not equal to ns (the node's own
             * namespace is different from the context namespace of its parent).
             * Run these sub-steps:
             *
             * 12.1. Let prefix be the value of node's prefix attribute.
             * 12.2. Let candidate prefix be the result of retrieving a preferred
             * prefix string prefix from map given namespace ns. The above may return
             * null if no namespace key ns exists in map.
             */ let prefix = node.prefix;
            /**
             * We don't need to run "retrieving a preferred prefix string" algorithm if
             * the element has no prefix and its namespace matches to the default
             * namespace.
             * See: https://github.com/web-platform-tests/wpt/pull/16703
             */ let candidatePrefix = null;
            if (prefix !== null || ns !== localDefaultNamespace) {
                candidatePrefix = map.get(prefix, ns);
            }
            /**
             * 12.3. If the value of prefix matches "xmlns", then run the following
             * steps:
             */ if (prefix === "xmlns") {
                /**
                 * 12.3.1. If the require well-formed flag is set, then throw an error.
                 * An Element with prefix "xmlns" will not legally round-trip in a
                 * conforming XML parser.
                 */ if (requireWellFormed) {
                    throw new Error("An element cannot have the 'xmlns' prefix (well-formed required).");
                }
                /**
                 * 12.3.2. Let candidate prefix be the value of prefix.
                 */ candidatePrefix = prefix;
            }
            /**
             * 12.4.Found a suitable namespace prefix: if candidate prefix is not
             * null (a namespace prefix is defined which maps to ns), then:
             */ if (candidatePrefix !== null) {
                /**
                 * The following may serialize a different prefix than the Element's
                 * existing prefix if it already had one. However, the retrieving a
                 * preferred prefix string algorithm already tried to match the
                 * existing prefix if possible.
                 *
                 * 12.4.1. Append to qualified name the concatenation of candidate
                 * prefix, ":" (U+003A COLON), and node's localName. There exists on
                 * this node or the node's ancestry a namespace prefix definition that
                 * defines the node's namespace.
                 * 12.4.2. If the local default namespace is not null (there exists a
                 * locally-defined default namespace declaration attribute) and its
                 * value is not the XML namespace, then let inherited ns get the value
                 * of local default namespace unless the local default namespace is the
                 * empty string in which case let it get null (the context namespace
                 * is changed to the declared default, rather than this node's own
                 * namespace).
                 *
                 * _Note:_ Any default namespace definitions or namespace prefixes that
                 * define the XML namespace are omitted when serializing this node's
                 * attributes.
                 */ qualifiedName = candidatePrefix + ':' + node.localName;
                if (localDefaultNamespace !== null && localDefaultNamespace !== infra_1.namespace.XML) {
                    inheritedNS = localDefaultNamespace || null;
                }
                /**
                 * 12.4.3. Append the value of qualified name to markup.
                 */ markup += qualifiedName;
            /** 12.5. Otherwise, if prefix is not null, then: */ } else if (prefix !== null) {
                /**
                 * _Note:_ By this step, there is no namespace or prefix mapping
                 * declaration in this node (or any parent node visited by this
                 * algorithm) that defines prefix otherwise the step labelled Found
                 * a suitable namespace prefix would have been followed. The sub-steps
                 * that follow will create a new namespace prefix declaration for prefix
                 * and ensure that prefix does not conflict with an existing namespace
                 * prefix declaration of the same localName in node's attribute list.
                 *
                 * 12.5.1. If the local prefixes map contains a key matching prefix,
                 * then let prefix be the result of generating a prefix providing as
                 * input map, ns, and prefix index.
                 */ if (prefix in localPrefixesMap) {
                    prefix = this._generatePrefix(ns, map, prefixIndex);
                }
                /**
                 * 12.5.2. Add prefix to map given namespace ns.
                 * 12.5.3. Append to qualified name the concatenation of prefix, ":"
                 * (U+003A COLON), and node's localName.
                 * 12.5.4. Append the value of qualified name to markup.
                 */ map.set(prefix, ns);
                qualifiedName += prefix + ':' + node.localName;
                markup += qualifiedName;
                /**
                 * 12.5.5. Append the following to markup, in the order listed:
                 *
                 * _Note:_ The following serializes a namespace prefix declaration for
                 * prefix which was just added to the map.
                 *
                 * 12.5.5.1. " " (U+0020 SPACE);
                 * 12.5.5.2. The string "xmlns:";
                 * 12.5.5.3. The value of prefix;
                 * 12.5.5.4. "="" (U+003D EQUALS SIGN, U+0022 QUOTATION MARK);
                 * 12.5.5.5. The result of serializing an attribute value given ns and
                 * the require well-formed flag as input;
                 * 12.5.5.6. """ (U+0022 QUOTATION MARK).
                 */ markup += " xmlns:" + prefix + "=\"" + this._serializeAttributeValue(ns, requireWellFormed) + "\"";
                /**
                 * 12.5.5.7. If local default namespace is not null (there exists a
                 * locally-defined default namespace declaration attribute), then
                 * let inherited ns get the value of local default namespace unless the
                 * local default namespace is the empty string in which case let it get
                 * null.
                 */ if (localDefaultNamespace !== null) {
                    inheritedNS = localDefaultNamespace || null;
                }
            /**
                 * 12.6. Otherwise, if local default namespace is null, or local
                 * default namespace is not null and its value is not equal to ns, then:
                 */ } else if (localDefaultNamespace === null || localDefaultNamespace !== null && localDefaultNamespace !== ns) {
                /**
                 * _Note:_ At this point, the namespace for this node still needs to be
                 * serialized, but there's no prefix (or candidate prefix) available; the
                 * following uses the default namespace declaration to define the
                 * namespace--optionally replacing an existing default declaration
                 * if present.
                 *
                 * 12.6.1. Set the ignore namespace definition attribute flag to true.
                 * 12.6.2. Append to qualified name the value of node's localName.
                 * 12.6.3. Let the value of inherited ns be ns.
                 *
                 * _Note:_ The new default namespace will be used in the serialization
                 * to define this node's namespace and act as the context namespace for
                 * its children.
                 */ ignoreNamespaceDefinitionAttribute = true;
                qualifiedName += node.localName;
                inheritedNS = ns;
                /**
                 * 12.6.4. Append the value of qualified name to markup.
                 */ markup += qualifiedName;
                /**
                 * 12.6.5. Append the following to markup, in the order listed:
                 *
                 * _Note:_ The following serializes the new (or replacement) default
                 * namespace definition.
                 *
                 * 12.6.5.1. " " (U+0020 SPACE);
                 * 12.6.5.2. The string "xmlns";
                 * 12.6.5.3. "="" (U+003D EQUALS SIGN, U+0022 QUOTATION MARK);
                 * 12.6.5.4. The result of serializing an attribute value given ns
                 * and the require well-formed flag as input;
                 * 12.6.5.5. """ (U+0022 QUOTATION MARK).
                 */ markup += " xmlns" + "=\"" + this._serializeAttributeValue(ns, requireWellFormed) + "\"";
            /**
                 * 12.7. Otherwise, the node has a local default namespace that matches
                 * ns. Append to qualified name the value of node's localName, let the
                 * value of inherited ns be ns, and append the value of qualified name
                 * to markup.
                 */ } else {
                qualifiedName += node.localName;
                inheritedNS = ns;
                markup += qualifiedName;
            }
        }
        /**
         * 13. Append to markup the result of the XML serialization of node's
         * attributes given map, prefix index, local prefixes map, ignore namespace
         * definition attribute flag, and require well-formed flag.
         */ markup += this._serializeAttributesNS(node, map, prefixIndex, localPrefixesMap, ignoreNamespaceDefinitionAttribute, requireWellFormed);
        /**
         * 14. If ns is the HTML namespace, and the node's list of children is
         * empty, and the node's localName matches any one of the following void
         * elements: "area", "base", "basefont", "bgsound", "br", "col", "embed",
         * "frame", "hr", "img", "input", "keygen", "link", "menuitem", "meta",
         * "param", "source", "track", "wbr"; then append the following to markup,
         * in the order listed:
         * 14.1. " " (U+0020 SPACE);
         * 14.2. "/" (U+002F SOLIDUS).
         * and set the skip end tag flag to true.
         * 15. If ns is not the HTML namespace, and the node's list of children is
         * empty, then append "/" (U+002F SOLIDUS) to markup and set the skip end
         * tag flag to true.
         * 16. Append ">" (U+003E GREATER-THAN SIGN) to markup.
         */ const isHTML = ns === infra_1.namespace.HTML;
        if (isHTML && node.childNodes.length === 0 && XMLSerializerImpl._VoidElementNames.has(node.localName)) {
            markup += " /";
            skipEndTag = true;
        } else if (!isHTML && node.childNodes.length === 0) {
            markup += "/";
            skipEndTag = true;
        }
        markup += ">";
        /**
         * 17. If the value of skip end tag is true, then return the value of markup
         * and skip the remaining steps. The node is a leaf-node.
         */ if (skipEndTag) return markup;
        /**
         * 18. If ns is the HTML namespace, and the node's localName matches the
         * string "template", then this is a template element. Append to markup the
         * result of XML serializing a DocumentFragment node given the template
         * element's template contents (a DocumentFragment), providing inherited
         * ns, map, prefix index, and the require well-formed flag.
         *
         * _Note:_ This allows template content to round-trip, given the rules for
         * parsing XHTML documents.
         *
         * 19. Otherwise, append to markup the result of running the XML
         * serialization algorithm on each of node's children, in tree order,
         * providing inherited ns, map, prefix index, and the require well-formed
         * flag.
         */ if (isHTML && node.localName === "template") {
        // TODO: serialize template contents
        } else {
            for (const childNode of node._children || node.childNodes){
                markup += this._serializeNodeNS(childNode, inheritedNS, map, prefixIndex, requireWellFormed);
            }
        }
        /**
         * 20. Append the following to markup, in the order listed:
         * 20.1. "</" (U+003C LESS-THAN SIGN, U+002F SOLIDUS);
         * 20.2. The value of qualified name;
         * 20.3. ">" (U+003E GREATER-THAN SIGN).
         */ markup += "</" + qualifiedName + ">";
        /**
         * 21. Return the value of markup.
         */ return markup;
    }
    /**
     * Produces an XML serialization of a document node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */ _serializeDocumentNS(node, namespace, prefixMap, prefixIndex, requireWellFormed) {
        /**
         * If the require well-formed flag is set (its value is true), and this node
         * has no documentElement (the documentElement attribute's value is null),
         * then throw an exception; the serialization of this node would not be a
         * well-formed document.
         */ if (requireWellFormed && node.documentElement === null) {
            throw new Error("Missing document element (well-formed required).");
        }
        /**
         * Otherwise, run the following steps:
         * 1. Let serialized document be an empty string.
         * 2. For each child child of node, in tree order, run the XML
         * serialization algorithm on the child passing along the provided
         * arguments, and append the result to serialized document.
         *
         * _Note:_ This will serialize any number of ProcessingInstruction and
         * Comment nodes both before and after the Document's documentElement node,
         * including at most one DocumentType node. (Text nodes are not allowed as
         * children of the Document.)
         *
         * 3. Return the value of serialized document.
        */ let serializedDocument = "";
        for (const childNode of node._children || node.childNodes){
            serializedDocument += this._serializeNodeNS(childNode, namespace, prefixMap, prefixIndex, requireWellFormed);
        }
        return serializedDocument;
    }
    /**
     * Produces an XML serialization of a comment node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeComment(node, requireWellFormed) {
        /**
         * If the require well-formed flag is set (its value is true), and node's
         * data contains characters that are not matched by the XML Char production
         * or contains "--" (two adjacent U+002D HYPHEN-MINUS characters) or that
         * ends with a "-" (U+002D HYPHEN-MINUS) character, then throw an exception;
         * the serialization of this node's data would not be well-formed.
         */ if (requireWellFormed && (!algorithm_1.xml_isLegalChar(node.data) || node.data.indexOf("--") !== -1 || node.data.endsWith("-"))) {
            throw new Error("Comment data contains invalid characters (well-formed required).");
        }
        /**
         * Otherwise, return the concatenation of "<!--", node's data, and "-->".
         */ return "<!--" + node.data + "-->";
    }
    /**
     * Produces an XML serialization of a text node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     * @param level - current depth of the XML tree
     */ _serializeText(node, requireWellFormed) {
        /**
         * 1. If the require well-formed flag is set (its value is true), and
         * node's data contains characters that are not matched by the XML Char
         * production, then throw an exception; the serialization of this node's
         * data would not be well-formed.
         */ if (requireWellFormed && !algorithm_1.xml_isLegalChar(node.data)) {
            throw new Error("Text data contains invalid characters (well-formed required).");
        }
        /**
         * 2. Let markup be the value of node's data.
         * 3. Replace any occurrences of "&" in markup by "&amp;".
         * 4. Replace any occurrences of "<" in markup by "&lt;".
         * 5. Replace any occurrences of ">" in markup by "&gt;".
         * 6. Return the value of markup.
         */ let result = "";
        for(let i = 0; i < node.data.length; i++){
            const c = node.data[i];
            if (c === "&") result += "&amp;";
            else if (c === "<") result += "&lt;";
            else if (c === ">") result += "&gt;";
            else result += c;
        }
        return result;
    }
    /**
     * Produces an XML serialization of a document fragment node.
     *
     * @param node - node to serialize
     * @param namespace - context namespace
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param requireWellFormed - whether to check conformance
     */ _serializeDocumentFragmentNS(node, namespace, prefixMap, prefixIndex, requireWellFormed) {
        /**
         * 1. Let markup the empty string.
         * 2. For each child child of node, in tree order, run the XML serialization
         * algorithm on the child given namespace, prefix map, a reference to prefix
         * index, and flag require well-formed. Concatenate the result to markup.
         * 3. Return the value of markup.
         */ let markup = "";
        for (const childNode of node._children || node.childNodes){
            markup += this._serializeNodeNS(childNode, namespace, prefixMap, prefixIndex, requireWellFormed);
        }
        return markup;
    }
    /**
     * Produces an XML serialization of a document type node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeDocumentType(node, requireWellFormed) {
        /**
         * 1. If the require well-formed flag is true and the node's publicId
         * attribute contains characters that are not matched by the XML PubidChar
         *  production, then throw an exception; the serialization of this node
         * would not be a well-formed document type declaration.
         */ if (requireWellFormed && !algorithm_1.xml_isPubidChar(node.publicId)) {
            throw new Error("DocType public identifier does not match PubidChar construct (well-formed required).");
        }
        /**
         * 2. If the require well-formed flag is true and the node's systemId
         * attribute contains characters that are not matched by the XML Char
         * production or that contains both a """ (U+0022 QUOTATION MARK) and a
         * "'" (U+0027 APOSTROPHE), then throw an exception; the serialization
         * of this node would not be a well-formed document type declaration.
         */ if (requireWellFormed && (!algorithm_1.xml_isLegalChar(node.systemId) || node.systemId.indexOf('"') !== -1 && node.systemId.indexOf("'") !== -1)) {
            throw new Error("DocType system identifier contains invalid characters (well-formed required).");
        }
        /**
         * 3. Let markup be an empty string.
         * 4. Append the string "<!DOCTYPE" to markup.
         * 5. Append " " (U+0020 SPACE) to markup.
         * 6. Append the value of the node's name attribute to markup. For a node
         * belonging to an HTML document, the value will be all lowercase.
         * 7. If the node's publicId is not the empty string then append the
         * following, in the order listed, to markup:
         * 7.1. " " (U+0020 SPACE);
         * 7.2. The string "PUBLIC";
         * 7.3. " " (U+0020 SPACE);
         * 7.4. """ (U+0022 QUOTATION MARK);
         * 7.5. The value of the node's publicId attribute;
         * 7.6. """ (U+0022 QUOTATION MARK).
         * 8. If the node's systemId is not the empty string and the node's publicId
         * is set to the empty string, then append the following, in the order
         * listed, to markup:
         * 8.1. " " (U+0020 SPACE);
         * 8.2. The string "SYSTEM".
         * 9. If the node's systemId is not the empty string then append the
         * following, in the order listed, to markup:
         * 9.2. " " (U+0020 SPACE);
         * 9.3. """ (U+0022 QUOTATION MARK);
         * 9.3. The value of the node's systemId attribute;
         * 9.4. """ (U+0022 QUOTATION MARK).
         * 10. Append ">" (U+003E GREATER-THAN SIGN) to markup.
         * 11. Return the value of markup.
         */ return node.publicId && node.systemId ? "<!DOCTYPE " + node.name + " PUBLIC \"" + node.publicId + "\" \"" + node.systemId + "\">" : node.publicId ? "<!DOCTYPE " + node.name + " PUBLIC \"" + node.publicId + "\">" : node.systemId ? "<!DOCTYPE " + node.name + " SYSTEM \"" + node.systemId + "\">" : "<!DOCTYPE " + node.name + ">";
    }
    /**
     * Produces an XML serialization of a processing instruction node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeProcessingInstruction(node, requireWellFormed) {
        /**
         * 1. If the require well-formed flag is set (its value is true), and node's
         * target contains a ":" (U+003A COLON) character or is an ASCII
         * case-insensitive match for the string "xml", then throw an exception;
         * the serialization of this node's target would not be well-formed.
         */ if (requireWellFormed && (node.target.indexOf(":") !== -1 || /^xml$/i.test(node.target))) {
            throw new Error("Processing instruction target contains invalid characters (well-formed required).");
        }
        /**
         * 2. If the require well-formed flag is set (its value is true), and node's
         * data contains characters that are not matched by the XML Char production
         * or contains the string "?>" (U+003F QUESTION MARK,
         * U+003E GREATER-THAN SIGN), then throw an exception; the serialization of
         * this node's data would not be well-formed.
         */ if (requireWellFormed && (!algorithm_1.xml_isLegalChar(node.data) || node.data.indexOf("?>") !== -1)) {
            throw new Error("Processing instruction data contains invalid characters (well-formed required).");
        }
        /**
         * 3. Let markup be the concatenation of the following, in the order listed:
         * 3.1. "<?" (U+003C LESS-THAN SIGN, U+003F QUESTION MARK);
         * 3.2. The value of node's target;
         * 3.3. " " (U+0020 SPACE);
         * 3.4. The value of node's data;
         * 3.5. "?>" (U+003F QUESTION MARK, U+003E GREATER-THAN SIGN).
         * 4. Return the value of markup.
         */ return "<?" + (node.data === "" ? node.target : node.target + " " + node.data) + "?>";
    }
    /**
     * Produces an XML serialization of a CDATA node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeCData(node, requireWellFormed) {
        if (requireWellFormed && node.data.indexOf("]]>") !== -1) {
            throw new Error("CDATA contains invalid characters (well-formed required).");
        }
        return "<![CDATA[" + node.data + "]]>";
    }
    /**
    * Produces an XML serialization of the attributes of an element node.
    *
     * @param node - node to serialize
     * @param map - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param localPrefixesMap - local prefixes map
     * @param ignoreNamespaceDefinitionAttribute - whether to ignore namespace
     * attributes
     * @param requireWellFormed - whether to check conformance
    */ _serializeAttributesNS(node, map, prefixIndex, localPrefixesMap, ignoreNamespaceDefinitionAttribute, requireWellFormed) {
        /**
         * 1. Let result be the empty string.
         * 2. Let localname set be a new empty namespace localname set. This
         * localname set will contain tuples of unique attribute namespaceURI and
         * localName pairs, and is populated as each attr is processed. This set is
         * used to [optionally] enforce the well-formed constraint that an element
         * cannot have two attributes with the same namespaceURI and localName.
         * This can occur when two otherwise identical attributes on the same
         * element differ only by their prefix values.
         */ let result = "";
        const localNameSet = requireWellFormed ? new LocalNameSet_1.LocalNameSet() : undefined;
        /**
         * 3. Loop: For each attribute attr in element's attributes, in the order
         * they are specified in the element's attribute list:
         */ for (const attr of node.attributes){
            // Optimize common case
            if (!ignoreNamespaceDefinitionAttribute && !requireWellFormed && attr.namespaceURI === null) {
                result += " " + attr.localName + "=\"" + this._serializeAttributeValue(attr.value, requireWellFormed) + "\"";
                continue;
            }
            /**
             * 3.1. If the require well-formed flag is set (its value is true), and the
             * localname set contains a tuple whose values match those of a new tuple
             * consisting of attr's namespaceURI attribute and localName attribute,
             * then throw an exception; the serialization of this attr would fail to
             * produce a well-formed element serialization.
             */ if (requireWellFormed && localNameSet && localNameSet.has(attr.namespaceURI, attr.localName)) {
                throw new Error("Element contains duplicate attributes (well-formed required).");
            }
            /**
             * 3.2. Create a new tuple consisting of attr's namespaceURI attribute and
             * localName attribute, and add it to the localname set.
             * 3.3. Let attribute namespace be the value of attr's namespaceURI value.
             * 3.4. Let candidate prefix be null.
             */ if (requireWellFormed && localNameSet) localNameSet.set(attr.namespaceURI, attr.localName);
            let attributeNamespace = attr.namespaceURI;
            let candidatePrefix = null;
            /** 3.5. If attribute namespace is not null, then run these sub-steps: */ if (attributeNamespace !== null) {
                /**
                 * 3.5.1. Let candidate prefix be the result of retrieving a preferred
                 * prefix string from map given namespace attribute namespace with
                 * preferred prefix being attr's prefix value.
                 */ candidatePrefix = map.get(attr.prefix, attributeNamespace);
                /**
                 * 3.5.2. If the value of attribute namespace is the XMLNS namespace,
                 * then run these steps:
                 */ if (attributeNamespace === infra_1.namespace.XMLNS) {
                    /**
                     * 3.5.2.1. If any of the following are true, then stop running these
                     * steps and goto Loop to visit the next attribute:
                     * - the attr's value is the XML namespace;
                     * _Note:_ The XML namespace cannot be redeclared and survive
                     * round-tripping (unless it defines the prefix "xml"). To avoid this
                     * problem, this algorithm always prefixes elements in the XML
                     * namespace with "xml" and drops any related definitions as seen
                     * in the above condition.
                     * - the attr's prefix is null and the ignore namespace definition
                     * attribute flag is true (the Element's default namespace attribute
                     * should be skipped);
                     * - the attr's prefix is not null and either
                     *   * the attr's localName is not a key contained in the local
                     *     prefixes map, or
                     *   * the attr's localName is present in the local prefixes map but
                     *     the value of the key does not match attr's value
                     * and furthermore that the attr's localName (as the prefix to find)
                     * is found in the namespace prefix map given the namespace consisting
                     * of the attr's value (the current namespace prefix definition was
                     * exactly defined previously--on an ancestor element not the current
                     * element whose attributes are being processed).
                     */ if (attr.value === infra_1.namespace.XML || attr.prefix === null && ignoreNamespaceDefinitionAttribute || attr.prefix !== null && (!(attr.localName in localPrefixesMap) || localPrefixesMap[attr.localName] !== attr.value) && map.has(attr.localName, attr.value)) continue;
                    /**
                     * 3.5.2.2. If the require well-formed flag is set (its value is true),
                     * and the value of attr's value attribute matches the XMLNS
                     * namespace, then throw an exception; the serialization of this
                     * attribute would produce invalid XML because the XMLNS namespace
                     * is reserved and cannot be applied as an element's namespace via
                     * XML parsing.
                     *
                     * _Note:_ DOM APIs do allow creation of elements in the XMLNS
                     * namespace but with strict qualifications.
                     */ if (requireWellFormed && attr.value === infra_1.namespace.XMLNS) {
                        throw new Error("XMLNS namespace is reserved (well-formed required).");
                    }
                    /**
                     * 3.5.2.3. If the require well-formed flag is set (its value is true),
                     * and the value of attr's value attribute is the empty string, then
                     * throw an exception; namespace prefix declarations cannot be used
                     * to undeclare a namespace (use a default namespace declaration
                     * instead).
                     */ if (requireWellFormed && attr.value === '') {
                        throw new Error("Namespace prefix declarations cannot be used to undeclare a namespace (well-formed required).");
                    }
                    /**
                     * 3.5.2.4. the attr's prefix matches the string "xmlns", then let
                     * candidate prefix be the string "xmlns".
                     */ if (attr.prefix === 'xmlns') candidatePrefix = 'xmlns';
                /**
                     * 3.5.3. Otherwise, the attribute namespace is not the XMLNS namespace.
                     * Run these steps:
                     *
                     * _Note:_ The (candidatePrefix === null) check is not in the spec.
                     * We deviate from the spec here. Otherwise a prefix is generated for
                     * all attributes with namespaces.
                     */ } else if (candidatePrefix === null) {
                    if (attr.prefix !== null && (!map.hasPrefix(attr.prefix) || map.has(attr.prefix, attributeNamespace))) {
                        /**
                         * Check if we can use the attribute's own prefix.
                         * We deviate from the spec here.
                         * TODO: This is not an efficient way of searching for prefixes.
                         * Follow developments to the spec.
                         */ candidatePrefix = attr.prefix;
                    } else {
                        /**
                         * 3.5.3.1. Let candidate prefix be the result of generating a prefix
                         * providing map, attribute namespace, and prefix index as input.
                         */ candidatePrefix = this._generatePrefix(attributeNamespace, map, prefixIndex);
                    }
                    /**
                     * 3.5.3.2. Append the following to result, in the order listed:
                     * 3.5.3.2.1. " " (U+0020 SPACE);
                     * 3.5.3.2.2. The string "xmlns:";
                     * 3.5.3.2.3. The value of candidate prefix;
                     * 3.5.3.2.4. "="" (U+003D EQUALS SIGN, U+0022 QUOTATION MARK);
                     * 3.5.3.2.5. The result of serializing an attribute value given
                     * attribute namespace and the require well-formed flag as input;
                     * 3.5.3.2.6. """ (U+0022 QUOTATION MARK).
                    */ result += " xmlns:" + candidatePrefix + "=\"" + this._serializeAttributeValue(attributeNamespace, requireWellFormed) + "\"";
                }
            }
            /**
             * 3.6. Append a " " (U+0020 SPACE) to result.
             * 3.7. If candidate prefix is not null, then append to result the
             * concatenation of candidate prefix with ":" (U+003A COLON).
             */ result += " ";
            if (candidatePrefix !== null) {
                result += candidatePrefix + ':';
            }
            /**
             * 3.8. If the require well-formed flag is set (its value is true), and
             * this attr's localName attribute contains the character
             * ":" (U+003A COLON) or does not match the XML Name production or
             * equals "xmlns" and attribute namespace is null, then throw an
             * exception; the serialization of this attr would not be a
             * well-formed attribute.
             */ if (requireWellFormed && (attr.localName.indexOf(":") !== -1 || !algorithm_1.xml_isName(attr.localName) || attr.localName === "xmlns" && attributeNamespace === null)) {
                throw new Error("Attribute local name contains invalid characters (well-formed required).");
            }
            /**
             * 3.9. Append the following strings to result, in the order listed:
             * 3.9.1. The value of attr's localName;
             * 3.9.2. "="" (U+003D EQUALS SIGN, U+0022 QUOTATION MARK);
             * 3.9.3. The result of serializing an attribute value given attr's value
             * attribute and the require well-formed flag as input;
             * 3.9.4. """ (U+0022 QUOTATION MARK).
             */ result += attr.localName + "=\"" + this._serializeAttributeValue(attr.value, requireWellFormed) + "\"";
        }
        /**
         * 4. Return the value of result.
         */ return result;
    }
    /**
    * Records namespace information for the given element and returns the
    * default namespace attribute value.
    *
    * @param node - element node to process
    * @param map - namespace prefix map
    * @param localPrefixesMap - local prefixes map
    */ _recordNamespaceInformation(node, map, localPrefixesMap) {
        /**
         * 1. Let default namespace attr value be null.
         */ let defaultNamespaceAttrValue = null;
        /**
         * 2. Main: For each attribute attr in element's attributes, in the order
         * they are specified in the element's attribute list:
         */ for (const attr of node.attributes){
            /**
             * _Note:_ The following conditional steps find namespace prefixes. Only
             * attributes in the XMLNS namespace are considered (e.g., attributes made
             * to look like namespace declarations via
             * setAttribute("xmlns:pretend-prefix", "pretend-namespace") are not
             * included).
             */ /** 2.1. Let attribute namespace be the value of attr's namespaceURI value. */ let attributeNamespace = attr.namespaceURI;
            /** 2.2. Let attribute prefix be the value of attr's prefix. */ let attributePrefix = attr.prefix;
            /** 2.3. If the attribute namespace is the XMLNS namespace, then: */ if (attributeNamespace === infra_1.namespace.XMLNS) {
                /**
                 * 2.3.1. If attribute prefix is null, then attr is a default namespace
                 * declaration. Set the default namespace attr value to attr's value and
                 * stop running these steps, returning to Main to visit the next
                 * attribute.
                 */ if (attributePrefix === null) {
                    defaultNamespaceAttrValue = attr.value;
                    continue;
                /**
                     * 2.3.2. Otherwise, the attribute prefix is not null and attr is a
                     * namespace prefix definition. Run the following steps:
                     */ } else {
                    /** 2.3.2.1. Let prefix definition be the value of attr's localName. */ let prefixDefinition = attr.localName;
                    /** 2.3.2.2. Let namespace definition be the value of attr's value. */ let namespaceDefinition = attr.value;
                    /**
                     * 2.3.2.3. If namespace definition is the XML namespace, then stop
                     * running these steps, and return to Main to visit the next
                     * attribute.
                     *
                     * _Note:_ XML namespace definitions in prefixes are completely
                     * ignored (in order to avoid unnecessary work when there might be
                     * prefix conflicts). XML namespaced elements are always handled
                     * uniformly by prefixing (and overriding if necessary) the element's
                     * localname with the reserved "xml" prefix.
                     */ if (namespaceDefinition === infra_1.namespace.XML) {
                        continue;
                    }
                    /**
                     * 2.3.2.4. If namespace definition is the empty string (the
                     * declarative form of having no namespace), then let namespace
                     * definition be null instead.
                     */ if (namespaceDefinition === '') {
                        namespaceDefinition = null;
                    }
                    /**
                     * 2.3.2.5. If prefix definition is found in map given the namespace
                     * namespace definition, then stop running these steps, and return to
                     * Main to visit the next attribute.
                     *
                     * _Note:_ This step avoids adding duplicate prefix definitions for
                     * the same namespace in the map. This has the side-effect of avoiding
                     * later serialization of duplicate namespace prefix declarations in
                     * any descendant nodes.
                     */ if (map.has(prefixDefinition, namespaceDefinition)) {
                        continue;
                    }
                    /**
                     * 2.3.2.6. Add the prefix prefix definition to map given namespace
                     * namespace definition.
                     */ map.set(prefixDefinition, namespaceDefinition);
                    /**
                     * 2.3.2.7. Add the value of prefix definition as a new key to the
                     * local prefixes map, with the namespace definition as the key's
                     * value replacing the value of null with the empty string if
                     * applicable.
                     */ localPrefixesMap[prefixDefinition] = namespaceDefinition || '';
                }
            }
        }
        /**
         * 3. Return the value of default namespace attr value.
         *
         * _Note:_ The empty string is a legitimate return value and is not
         * converted to null.
         */ return defaultNamespaceAttrValue;
    }
    /**
    * Generates a new prefix for the given namespace.
    *
    * @param newNamespace - a namespace to generate prefix for
    * @param prefixMap - namespace prefix map
    * @param prefixIndex - generated namespace prefix index
    */ _generatePrefix(newNamespace, prefixMap, prefixIndex) {
        /**
         * 1. Let generated prefix be the concatenation of the string "ns" and the
         * current numerical value of prefix index.
         * 2. Let the value of prefix index be incremented by one.
         * 3. Add to map the generated prefix given the new namespace namespace.
         * 4. Return the value of generated prefix.
         */ let generatedPrefix = "ns" + prefixIndex.value;
        prefixIndex.value++;
        prefixMap.set(generatedPrefix, newNamespace);
        return generatedPrefix;
    }
    /**
     * Produces an XML serialization of an attribute value.
     *
     * @param value - attribute value
     * @param requireWellFormed - whether to check conformance
     */ _serializeAttributeValue(value, requireWellFormed) {
        /**
         * From: https://w3c.github.io/DOM-Parsing/#dfn-serializing-an-attribute-value
         *
         * 1. If the require well-formed flag is set (its value is true), and
         * attribute value contains characters that are not matched by the XML Char
         * production, then throw an exception; the serialization of this attribute
         * value would fail to produce a well-formed element serialization.
         */ if (requireWellFormed && value !== null && !algorithm_1.xml_isLegalChar(value)) {
            throw new Error("Invalid characters in attribute value.");
        }
        /**
         * 2. If attribute value is null, then return the empty string.
         */ if (value === null) return "";
        /**
         * 3. Otherwise, attribute value is a string. Return the value of attribute
         * value, first replacing any occurrences of the following:
         * - "&" with "&amp;"
         * - """ with "&quot;"
         * - "<" with "&lt;"
         * - ">" with "&gt;"
         * NOTE
         * This matches behavior present in browsers, and goes above and beyond the
         * grammar requirement in the XML specification's AttValue production by
         * also replacing ">" characters.
         */ let result = "";
        for(let i = 0; i < value.length; i++){
            const c = value[i];
            if (c === "\"") result += "&quot;";
            else if (c === "&") result += "&amp;";
            else if (c === "<") result += "&lt;";
            else if (c === ">") result += "&gt;";
            else result += c;
        }
        return result;
    }
    /**
     * Produces an XML serialization of an element node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeElement(node, requireWellFormed) {
        /**
         * From: https://w3c.github.io/DOM-Parsing/#xml-serializing-an-element-node
         *
         * 1. If the require well-formed flag is set (its value is true), and this
         * node's localName attribute contains the character ":" (U+003A COLON) or
         * does not match the XML Name production, then throw an exception; the
         * serialization of this node would not be a well-formed element.
         */ if (requireWellFormed && (node.localName.indexOf(":") !== -1 || !algorithm_1.xml_isName(node.localName))) {
            throw new Error("Node local name contains invalid characters (well-formed required).");
        }
        /**
         * 2. Let markup be the string "<" (U+003C LESS-THAN SIGN).
         * 3. Let qualified name be an empty string.
         * 4. Let skip end tag be a boolean flag with value false.
         * 5. Let ignore namespace definition attribute be a boolean flag with value
         * false.
         * 6. Given prefix map, copy a namespace prefix map and let map be the
         * result.
         * 7. Let local prefixes map be an empty map. The map has unique Node prefix
         * strings as its keys, with corresponding namespaceURI Node values as the
         * map's key values (in this map, the null namespace is represented by the
         * empty string).
         *
         * _Note:_ This map is local to each element. It is used to ensure there
         * are no conflicting prefixes should a new namespace prefix attribute need
         * to be generated. It is also used to enable skipping of duplicate prefix
         * definitions when writing an element's attributes: the map allows the
         * algorithm to distinguish between a prefix in the namespace prefix map
         * that might be locally-defined (to the current Element) and one that is
         * not.
         * 8. Let local default namespace be the result of recording the namespace
         * information for node given map and local prefixes map.
         *
         * _Note:_ The above step will update map with any found namespace prefix
         * definitions, add the found prefix definitions to the local prefixes map
         * and return a local default namespace value defined by a default namespace
         * attribute if one exists. Otherwise it returns null.
         * 9. Let inherited ns be a copy of namespace.
         * 10. Let ns be the value of node's namespaceURI attribute.
         */ let skipEndTag = false;
        /** 11. If inherited ns is equal to ns, then: */ /**
         * 11.1. If local default namespace is not null, then set ignore
         * namespace definition attribute to true.
         * 11.2. If ns is the XML namespace, then append to qualified name the
         * concatenation of the string "xml:" and the value of node's localName.
         * 11.3. Otherwise, append to qualified name the value of node's
         * localName. The node's prefix if it exists, is dropped.
         */ const qualifiedName = node.localName;
        /** 11.4. Append the value of qualified name to markup. */ let markup = "<" + qualifiedName;
        /**
         * 13. Append to markup the result of the XML serialization of node's
         * attributes given map, prefix index, local prefixes map, ignore namespace
         * definition attribute flag, and require well-formed flag.
         */ markup += this._serializeAttributes(node, requireWellFormed);
        /**
         * 14. If ns is the HTML namespace, and the node's list of children is
         * empty, and the node's localName matches any one of the following void
         * elements: "area", "base", "basefont", "bgsound", "br", "col", "embed",
         * "frame", "hr", "img", "input", "keygen", "link", "menuitem", "meta",
         * "param", "source", "track", "wbr"; then append the following to markup,
         * in the order listed:
         * 14.1. " " (U+0020 SPACE);
         * 14.2. "/" (U+002F SOLIDUS).
         * and set the skip end tag flag to true.
         * 15. If ns is not the HTML namespace, and the node's list of children is
         * empty, then append "/" (U+002F SOLIDUS) to markup and set the skip end
         * tag flag to true.
         * 16. Append ">" (U+003E GREATER-THAN SIGN) to markup.
         */ if (node._children.size === 0) {
            markup += "/";
            skipEndTag = true;
        }
        markup += ">";
        /**
         * 17. If the value of skip end tag is true, then return the value of markup
         * and skip the remaining steps. The node is a leaf-node.
         */ if (skipEndTag) return markup;
        /**
         * 18. If ns is the HTML namespace, and the node's localName matches the
         * string "template", then this is a template element. Append to markup the
         * result of XML serializing a DocumentFragment node given the template
         * element's template contents (a DocumentFragment), providing inherited
         * ns, map, prefix index, and the require well-formed flag.
         *
         * _Note:_ This allows template content to round-trip, given the rules for
         * parsing XHTML documents.
         *
         * 19. Otherwise, append to markup the result of running the XML
         * serialization algorithm on each of node's children, in tree order,
         * providing inherited ns, map, prefix index, and the require well-formed
         * flag.
         */ for (const childNode of node._children){
            markup += this._serializeNode(childNode, requireWellFormed);
        }
        /**
         * 20. Append the following to markup, in the order listed:
         * 20.1. "</" (U+003C LESS-THAN SIGN, U+002F SOLIDUS);
         * 20.2. The value of qualified name;
         * 20.3. ">" (U+003E GREATER-THAN SIGN).
         */ markup += "</" + qualifiedName + ">";
        /**
         * 21. Return the value of markup.
         */ return markup;
    }
    /**
     * Produces an XML serialization of a document node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeDocument(node, requireWellFormed) {
        /**
         * If the require well-formed flag is set (its value is true), and this node
         * has no documentElement (the documentElement attribute's value is null),
         * then throw an exception; the serialization of this node would not be a
         * well-formed document.
         */ if (requireWellFormed && node.documentElement === null) {
            throw new Error("Missing document element (well-formed required).");
        }
        /**
         * Otherwise, run the following steps:
         * 1. Let serialized document be an empty string.
         * 2. For each child child of node, in tree order, run the XML
         * serialization algorithm on the child passing along the provided
         * arguments, and append the result to serialized document.
         *
         * _Note:_ This will serialize any number of ProcessingInstruction and
         * Comment nodes both before and after the Document's documentElement node,
         * including at most one DocumentType node. (Text nodes are not allowed as
         * children of the Document.)
         *
         * 3. Return the value of serialized document.
        */ let serializedDocument = "";
        for (const childNode of node._children){
            serializedDocument += this._serializeNode(childNode, requireWellFormed);
        }
        return serializedDocument;
    }
    /**
     * Produces an XML serialization of a document fragment node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeDocumentFragment(node, requireWellFormed) {
        /**
         * 1. Let markup the empty string.
         * 2. For each child child of node, in tree order, run the XML serialization
         * algorithm on the child given namespace, prefix map, a reference to prefix
         * index, and flag require well-formed. Concatenate the result to markup.
         * 3. Return the value of markup.
         */ let markup = "";
        for (const childNode of node._children){
            markup += this._serializeNode(childNode, requireWellFormed);
        }
        return markup;
    }
    /**
     * Produces an XML serialization of the attributes of an element node.
     *
     * @param node - node to serialize
     * @param requireWellFormed - whether to check conformance
     */ _serializeAttributes(node, requireWellFormed) {
        /**
         * 1. Let result be the empty string.
         * 2. Let localname set be a new empty namespace localname set. This
         * localname set will contain tuples of unique attribute namespaceURI and
         * localName pairs, and is populated as each attr is processed. This set is
         * used to [optionally] enforce the well-formed constraint that an element
         * cannot have two attributes with the same namespaceURI and localName.
         * This can occur when two otherwise identical attributes on the same
         * element differ only by their prefix values.
         */ let result = "";
        const localNameSet = requireWellFormed ? {} : undefined;
        /**
         * 3. Loop: For each attribute attr in element's attributes, in the order
         * they are specified in the element's attribute list:
         */ for (const attr of node.attributes){
            /**
             * 3.1. If the require well-formed flag is set (its value is true), and the
             * localname set contains a tuple whose values match those of a new tuple
             * consisting of attr's namespaceURI attribute and localName attribute,
             * then throw an exception; the serialization of this attr would fail to
             * produce a well-formed element serialization.
             */ if (requireWellFormed && localNameSet && attr.localName in localNameSet) {
                throw new Error("Element contains duplicate attributes (well-formed required).");
            }
            /**
             * 3.2. Create a new tuple consisting of attr's namespaceURI attribute and
             * localName attribute, and add it to the localname set.
             * 3.3. Let attribute namespace be the value of attr's namespaceURI value.
             * 3.4. Let candidate prefix be null.
             */ if (requireWellFormed && localNameSet) localNameSet[attr.localName] = true;
            /** 3.5. If attribute namespace is not null, then run these sub-steps: */ /**
             * 3.6. Append a " " (U+0020 SPACE) to result.
             * 3.7. If candidate prefix is not null, then append to result the
             * concatenation of candidate prefix with ":" (U+003A COLON).
             */ /**
             * 3.8. If the require well-formed flag is set (its value is true), and
             * this attr's localName attribute contains the character
             * ":" (U+003A COLON) or does not match the XML Name production or
             * equals "xmlns" and attribute namespace is null, then throw an
             * exception; the serialization of this attr would not be a
             * well-formed attribute.
             */ if (requireWellFormed && (attr.localName.indexOf(":") !== -1 || !algorithm_1.xml_isName(attr.localName))) {
                throw new Error("Attribute local name contains invalid characters (well-formed required).");
            }
            /**
             * 3.9. Append the following strings to result, in the order listed:
             * 3.9.1. The value of attr's localName;
             * 3.9.2. "="" (U+003D EQUALS SIGN, U+0022 QUOTATION MARK);
             * 3.9.3. The result of serializing an attribute value given attr's value
             * attribute and the require well-formed flag as input;
             * 3.9.4. """ (U+0022 QUOTATION MARK).
             */ result += " " + attr.localName + "=\"" + this._serializeAttributeValue(attr.value, requireWellFormed) + "\"";
        }
        /**
         * 4. Return the value of result.
         */ return result;
    }
}
exports.XMLSerializerImpl = XMLSerializerImpl;
XMLSerializerImpl._VoidElementNames = new Set([
    'area',
    'base',
    'basefont',
    'bgsound',
    'br',
    'col',
    'embed',
    'frame',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
]);
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Export classes
var XMLSerializerImpl_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/XMLSerializerImpl.js [app-route] (ecmascript)");
exports.XMLSerializer = XMLSerializerImpl_1.XMLSerializerImpl;
}),
"[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const dom_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
dom_1.dom.setFeatures(true);
var dom_2 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/dom/index.js [app-route] (ecmascript)");
exports.DOMImplementation = dom_2.DOMImplementation;
var parser_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/parser/index.js [app-route] (ecmascript)");
exports.DOMParser = parser_1.DOMParser;
var serializer_1 = __turbopack_context__.r("[project]/node_modules/xmlbuilder2/node_modules/@oozcitak/dom/lib/serializer/index.js [app-route] (ecmascript)");
exports.XMLSerializer = serializer_1.XMLSerializer;
}),
];

//# sourceMappingURL=0lyi_%40oozcitak_dom_lib_1osd91w._.js.map