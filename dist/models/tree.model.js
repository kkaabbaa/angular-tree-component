var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { observable, computed, action } from 'mobx';
import { TreeNode } from './tree-node.model';
import { TreeOptions } from './tree-options.model';
import { TREE_EVENTS, newName } from '../constants/events';
import * as _ from 'lodash';
var first = _.first, last = _.last, compact = _.compact, find = _.find, includes = _.includes, remove = _.remove, indexOf = _.indexOf, pullAt = _.pullAt, isString = _.isString, isFunction = _.isFunction;
var TreeModel = (function () {
    function TreeModel() {
        this.options = new TreeOptions();
        this.eventNames = Object.keys(TREE_EVENTS);
        this.expandedNodeIds = {};
        this.activeNodeIds = {};
        this.hiddenNodeIds = {};
        this.focusedNodeId = null;
        this.firstUpdate = true;
    }
    // events
    TreeModel.prototype.fireEvent = function (event) {
        event.treeModel = this;
        var newEventName = newName(event.eventName);
        var deprecatedEvent = Object.assign({}, event, {
            deprecated: "This event is deprecated, please use " + newEventName + " instead"
        });
        event.eventName = newEventName;
        this.events[deprecatedEvent.eventName].emit(deprecatedEvent);
        this.events[event.eventName].emit(event);
        this.events.onEvent.emit(deprecatedEvent);
        this.events.event.emit(event);
    };
    TreeModel.prototype.subscribe = function (eventName, fn) {
        this.events[eventName].subscribe(fn);
    };
    // getters
    TreeModel.prototype.getFocusedNode = function () {
        return this.focusedNode;
    };
    TreeModel.prototype.getActiveNode = function () {
        return this.activeNodes[0];
    };
    TreeModel.prototype.getActiveNodes = function () {
        return this.activeNodes;
    };
    TreeModel.prototype.getVisibleRoots = function () {
        return this.virtualRoot.visibleChildren;
    };
    TreeModel.prototype.getFirstRoot = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return first(skipHidden ? this.getVisibleRoots() : this.roots);
    };
    TreeModel.prototype.getLastRoot = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return last(skipHidden ? this.getVisibleRoots() : this.roots);
    };
    Object.defineProperty(TreeModel.prototype, "isFocused", {
        get: function () {
            return TreeModel.focusedTree === this;
        },
        enumerable: true,
        configurable: true
    });
    TreeModel.prototype.isNodeFocused = function (node) {
        return this.focusedNode === node;
    };
    TreeModel.prototype.isEmptyTree = function () {
        return this.roots && this.roots.length === 0;
    };
    Object.defineProperty(TreeModel.prototype, "focusedNode", {
        get: function () {
            return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "expandedNodes", {
        get: function () {
            var _this = this;
            var nodes = Object.keys(this.expandedNodeIds)
                .filter(function (id) { return _this.expandedNodeIds[id]; })
                .map(function (id) { return _this.getNodeById(id); });
            return compact(nodes);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "activeNodes", {
        get: function () {
            var _this = this;
            var nodes = Object.keys(this.activeNodeIds)
                .filter(function (id) { return _this.activeNodeIds[id]; })
                .map(function (id) { return _this.getNodeById(id); });
            return compact(nodes);
        },
        enumerable: true,
        configurable: true
    });
    // locating nodes
    TreeModel.prototype.getNodeByPath = function (path, startNode) {
        if (startNode === void 0) { startNode = null; }
        if (!path)
            return null;
        startNode = startNode || this.virtualRoot;
        if (path.length === 0)
            return startNode;
        if (!startNode.children)
            return null;
        var childId = path.shift();
        var childNode = find(startNode.children, { id: childId });
        if (!childNode)
            return null;
        return this.getNodeByPath(path, childNode);
    };
    TreeModel.prototype.getNodeById = function (id) {
        var idStr = id.toString();
        return this.getNodeBy(function (node) { return node.id.toString() === idStr; });
    };
    TreeModel.prototype.getNodeBy = function (predicate, startNode) {
        if (startNode === void 0) { startNode = null; }
        startNode = startNode || this.virtualRoot;
        if (!startNode.children)
            return null;
        var found = find(startNode.children, predicate);
        if (found) {
            return found;
        }
        else {
            for (var _i = 0, _a = startNode.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var foundInChildren = this.getNodeBy(predicate, child);
                if (foundInChildren)
                    return foundInChildren;
            }
        }
    };
    TreeModel.prototype.isExpanded = function (node) {
        return this.expandedNodeIds[node.id];
    };
    TreeModel.prototype.isHidden = function (node) {
        return this.hiddenNodeIds[node.id];
    };
    TreeModel.prototype.isActive = function (node) {
        return this.activeNodeIds[node.id];
    };
    // actions
    TreeModel.prototype.setData = function (_a) {
        var nodes = _a.nodes, _b = _a.options, options = _b === void 0 ? null : _b, _c = _a.events, events = _c === void 0 ? null : _c;
        if (options) {
            this.options = new TreeOptions(options);
        }
        if (events) {
            this.events = events;
        }
        if (nodes) {
            this.nodes = nodes;
        }
        this.update();
    };
    TreeModel.prototype.update = function () {
        // Rebuild tree:
        var virtualRootConfig = (_a = {
                virtual: true
            },
            _a[this.options.childrenField] = this.nodes,
            _a);
        this.virtualRoot = new TreeNode(virtualRootConfig, null, this, 0);
        this.roots = this.virtualRoot.children;
        // Fire event:
        if (this.firstUpdate) {
            if (this.roots) {
                this.firstUpdate = false;
                this._calculateExpandedNodes();
            }
        }
        else {
            this.fireEvent({ eventName: TREE_EVENTS.onUpdateData });
        }
        var _a;
    };
    TreeModel.prototype.setFocusedNode = function (node) {
        this.focusedNodeId = node ? node.id : null;
    };
    TreeModel.prototype.setFocus = function (value) {
        TreeModel.focusedTree = value ? this : null;
    };
    TreeModel.prototype.doForAll = function (fn) {
        this.roots.forEach(function (root) { return root.doForAll(fn); });
    };
    TreeModel.prototype.focusNextNode = function () {
        var previousNode = this.getFocusedNode();
        var nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true);
        if (nextNode)
            nextNode.focus();
    };
    TreeModel.prototype.focusPreviousNode = function () {
        var previousNode = this.getFocusedNode();
        var nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true);
        if (nextNode)
            nextNode.focus();
    };
    TreeModel.prototype.focusDrillDown = function () {
        var previousNode = this.getFocusedNode();
        if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
            previousNode.toggleExpanded();
        }
        else {
            var nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true);
            if (nextNode)
                nextNode.focus();
        }
    };
    TreeModel.prototype.focusDrillUp = function () {
        var previousNode = this.getFocusedNode();
        if (!previousNode)
            return;
        if (previousNode.isExpanded) {
            previousNode.toggleExpanded();
        }
        else {
            var nextNode = previousNode.realParent;
            if (nextNode)
                nextNode.focus();
        }
    };
    TreeModel.prototype.setActiveNode = function (node, value, multi) {
        if (multi === void 0) { multi = false; }
        if (multi) {
            this._setActiveNodeMulti(node, value);
        }
        else {
            this._setActiveNodeSingle(node, value);
        }
        if (value) {
            node.focus();
            this.fireEvent({ eventName: TREE_EVENTS.onActivate, node: node });
        }
        else {
            this.fireEvent({ eventName: TREE_EVENTS.onDeactivate, node: node });
        }
    };
    TreeModel.prototype.setExpandedNode = function (node, value) {
        this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, (_a = {}, _a[node.id] = value, _a));
        this.fireEvent({ eventName: TREE_EVENTS.onToggleExpanded, node: node, isExpanded: value });
        var _a;
    };
    TreeModel.prototype.expandAll = function () {
        this.roots.forEach(function (root) { return root.expandAll(); });
    };
    TreeModel.prototype.collapseAll = function () {
        this.roots.forEach(function (root) { return root.collapseAll(); });
    };
    TreeModel.prototype.setIsHidden = function (node, value) {
        this.hiddenNodeIds = Object.assign({}, this.hiddenNodeIds, (_a = {}, _a[node.id] = value, _a));
        var _a;
    };
    TreeModel.prototype.performKeyAction = function (node, $event) {
        var action = this.options.actionMapping.keys[$event.keyCode];
        if (action) {
            $event.preventDefault();
            action(this, node, $event);
            return true;
        }
        else {
            return false;
        }
    };
    TreeModel.prototype.filterNodes = function (filter, autoShow) {
        var _this = this;
        if (autoShow === void 0) { autoShow = true; }
        var filterFn;
        if (!filter) {
            return this.clearFilter();
        }
        // support function and string filter
        if (isString(filter)) {
            filterFn = function (node) { return node.displayField.toLowerCase().indexOf(filter.toLowerCase()) !== -1; };
        }
        else if (isFunction(filter)) {
            filterFn = filter;
        }
        else {
            console.error('Don\'t know what to do with filter', filter);
            console.error('Should be either a string or function');
            return;
        }
        var ids = {};
        this.roots.forEach(function (node) { return _this._filterNode(ids, node, filterFn, autoShow); });
        this.hiddenNodeIds = ids;
        this.fireEvent({ eventName: TREE_EVENTS.onChangeFilter });
    };
    TreeModel.prototype.clearFilter = function () {
        this.hiddenNodeIds = {};
        this.fireEvent({ eventName: TREE_EVENTS.onChangeFilter });
    };
    TreeModel.prototype.moveNode = function (node, to) {
        var fromIndex = node.getIndexInParent();
        var fromParent = node.parent;
        if (!this._canMoveNode(node, fromIndex, to))
            return;
        var fromChildren = fromParent.getField('children');
        // If node doesn't have children - create children array
        if (!to.parent.getField('children')) {
            to.parent.setField('children', []);
        }
        var toChildren = to.parent.getField('children');
        var originalNode = fromChildren.splice(fromIndex, 1)[0];
        // Compensate for index if already removed from parent:
        var toIndex = (fromParent === to.parent && to.index > fromIndex) ? to.index - 1 : to.index;
        toChildren.splice(toIndex, 0, originalNode);
        fromParent.treeModel.update();
        if (to.parent.treeModel !== fromParent.treeModel) {
            to.parent.treeModel.update();
        }
        this.fireEvent({ eventName: TREE_EVENTS.onMoveNode, node: originalNode, to: { parent: to.parent.data, index: toIndex } });
    };
    // private methods
    TreeModel.prototype._canMoveNode = function (node, fromIndex, to) {
        // same node:
        if (node.parent === to.parent && fromIndex === to.index) {
            return false;
        }
        return !to.parent.isDescendantOf(node);
    };
    TreeModel.prototype._filterNode = function (ids, node, filterFn, autoShow) {
        var _this = this;
        // if node passes function then it's visible
        var isVisible = filterFn(node);
        if (node.children) {
            // if one of node's children passes filter then this node is also visible
            node.children.forEach(function (child) {
                if (_this._filterNode(ids, child, filterFn, autoShow)) {
                    isVisible = true;
                }
            });
        }
        // mark node as hidden
        if (!isVisible) {
            ids[node.id] = true;
        }
        // auto expand parents to make sure the filtered nodes are visible
        if (autoShow && isVisible) {
            node.ensureVisible();
        }
        return isVisible;
    };
    TreeModel.prototype._calculateExpandedNodes = function (startNode) {
        var _this = this;
        if (startNode === void 0) { startNode = null; }
        startNode = startNode || this.virtualRoot;
        if (startNode.data[this.options.isExpandedField]) {
            this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, (_a = {}, _a[startNode.id] = true, _a));
        }
        if (startNode.children) {
            startNode.children.forEach(function (child) { return _this._calculateExpandedNodes(child); });
        }
        var _a;
    };
    TreeModel.prototype._setActiveNodeSingle = function (node, value) {
        var _this = this;
        // Deactivate all other nodes:
        this.activeNodes
            .filter(function (activeNode) { return activeNode !== node; })
            .forEach(function (activeNode) {
            _this.fireEvent({ eventName: TREE_EVENTS.onDeactivate, node: activeNode });
        });
        if (value) {
            this.activeNodeIds = (_a = {}, _a[node.id] = true, _a);
        }
        else {
            this.activeNodeIds = {};
        }
        var _a;
    };
    TreeModel.prototype._setActiveNodeMulti = function (node, value) {
        this.activeNodeIds = Object.assign({}, this.activeNodeIds, (_a = {}, _a[node.id] = value, _a));
        var _a;
    };
    return TreeModel;
}());
export { TreeModel };
TreeModel.focusedTree = null;
TreeModel.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TreeModel.ctorParameters = function () { return []; };
__decorate([
    observable,
    __metadata("design:type", Array)
], TreeModel.prototype, "roots", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], TreeModel.prototype, "expandedNodeIds", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], TreeModel.prototype, "activeNodeIds", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], TreeModel.prototype, "hiddenNodeIds", void 0);
__decorate([
    observable,
    __metadata("design:type", String)
], TreeModel.prototype, "focusedNodeId", void 0);
__decorate([
    observable,
    __metadata("design:type", TreeNode)
], TreeModel.prototype, "virtualRoot", void 0);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TreeModel.prototype, "focusedNode", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TreeModel.prototype, "expandedNodes", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TreeModel.prototype, "activeNodes", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setData", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "update", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setFocusedNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setFocus", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "doForAll", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusNextNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusPreviousNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusDrillDown", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusDrillUp", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setActiveNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setExpandedNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "expandAll", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "collapseAll", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setIsHidden", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "filterNodes", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "clearFilter", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "moveNode", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvdHJlZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBQSxFQUF5QixNQUFPLGVBQUEsQ0FBZ0I7QUFDekQsT0FBTyxFQUFFLFVBQUEsRUFBWSxRQUFBLEVBQVUsTUFBQSxFQUFPLE1BQU8sTUFBQSxDQUFPO0FBQ3BELE9BQU8sRUFBRSxRQUFBLEVBQVMsTUFBTyxtQkFBQSxDQUFvQjtBQUM3QyxPQUFPLEVBQUUsV0FBQSxFQUFZLE1BQU8sc0JBQUEsQ0FBdUI7QUFHbkQsT0FBTyxFQUFFLFdBQUEsRUFBYSxPQUFBLEVBQVEsTUFBTyxxQkFBQSxDQUFzQjtBQUUzRCxPQUFPLEtBQUssQ0FBQSxNQUFPLFFBQUEsQ0FBUztBQUVwQixJQUFBLGVBQUEsRUFBTyxhQUFBLEVBQU0sbUJBQUEsRUFBUyxhQUFBLEVBQU0scUJBQUEsRUFDbEMsaUJBQU0sRUFBRSxtQkFBQSxFQUFTLGlCQUFBLEVBQVEscUJBQUEsRUFBVSx5QkFBQSxDQUFpQjtBQUd0RDtJQWtCRTtRQWZBLFlBQU8sR0FBZ0IsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUV6QyxlQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUkxQixvQkFBZSxHQUE4QixFQUFFLENBQUM7UUFDaEQsa0JBQWEsR0FBOEIsRUFBRSxDQUFDO1FBQzlDLGtCQUFhLEdBQThCLEVBQUUsQ0FBQztRQUM5QyxrQkFBYSxHQUFXLElBQUksQ0FBQztRQUdqQyxnQkFBVyxHQUFHLElBQUksQ0FBQztJQUkzQixDQUFDO0lBRUQsU0FBUztJQUNULDZCQUFTLEdBQVQsVUFBVSxLQUFLO1FBQ2IsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxJQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxD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QztJQUM1RCxDQUFDO0lBRU8sNEJBQVEsR0FBUixVQUFTLElBQUksRUFBRSxFQUFFO1FBQ3ZCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzFDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUcsRUFBRSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUM7UUFFckQsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyRCx3REFBd0Q7UUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVsRCxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxRCx1REFBdUQ7UUFDdkQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFFM0YsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTVDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxT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VTs4QkFBYyxRQUFROzhDQUFDO0FBa0V4QjtJQUFULFFBQVE7Ozs0Q0FFUjtBQUVTO0lBQVQsUUFBUTs7OzhDQU1SO0FBRVM7SUFBVCxRQUFROzs7NENBTVI7QUF1RE87SUFBUCxNQUFNOzs7O3dDQVlOO0FBRU87SUFBUCxNQUFNOzs7O3VDQW9CTjtBQUdPO0lBQVAsTUFBTTs7OzsrQ0FFTjtBQUVPO0lBQVAsTUFBTTs7Ozt5Q0FFTjtBQUVPO0lBQVAsTUFBTTs7Ozt5Q0FFTjtBQUVPO0lBQVAsTUFBTTs7Ozs4Q0FJTjtBQUVPO0lBQVAsTUFBTTs7OztrREFJTjtBQUVPO0lBQVAsTUFBTTs7OzsrQ0FTTjtBQUVPO0lBQVAsTUFBTTs7Ozs2Q0FVTjtBQUVPO0lBQVAsTUFBTTs7Ozs4Q0FjTjtBQUVPO0lBQVAsTUFBTTs7OztnREFHTjtBQUVPO0lBQVAsTUFBTTs7OzswQ0FFTjtBQUVPO0lBQVAsTUFBTTs7Ozs0Q0FFTjtBQUVPO0lBQVAsTUFBTTs7Ozs0Q0FFTjtBQWFPO0lBQVAsTUFBTTs7Ozs0Q0F3Qk47QUFFTztJQUFQLE1BQU07Ozs7NENBR047QUFFTztJQUFQLE1BQU07Ozs7eUNBMkJOIiwiZmlsZSI6InRyZWUubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBvYnNlcnZhYmxlLCBjb21wdXRlZCwgYWN0aW9uIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgeyBUcmVlTm9kZSB9IGZyb20gJy4vdHJlZS1ub2RlLm1vZGVsJztcbmltcG9ydCB7IFRyZWVPcHRpb25zIH0gZnJvbSAnLi90cmVlLW9wdGlvbnMubW9kZWwnO1xuaW1wb3J0IHsgVHJlZVZpcnR1YWxTY3JvbGwgfSBmcm9tICcuL3RyZWUtdmlydHVhbC1zY3JvbGwubW9kZWwnO1xuaW1wb3J0IHsgSVRyZWVNb2RlbCB9IGZyb20gJy4uL2RlZnMvYXBpJztcbmltcG9ydCB7IFRSRUVfRVZFTlRTLCBuZXdOYW1lIH0gZnJvbSAnLi4vY29uc3RhbnRzL2V2ZW50cyc7XG5cbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuY29uc3QgeyBmaXJzdCwgbGFzdCwgY29tcGFjdCwgZmluZCwgaW5jbHVkZXMsXG4gIHJlbW92ZSwgaW5kZXhPZiwgcHVsbEF0LCBpc1N0cmluZywgaXNGdW5jdGlvbiB9ID0gXztcblxuXG5leHBvcnQgY2xhc3MgVHJlZU1vZGVsIGltcGxlbWVudHMgSVRyZWVNb2RlbCB7XG4gIHN0YXRpYyBmb2N1c2VkVHJlZSA9IG51bGw7XG5cbiAgb3B0aW9uczogVHJlZU9wdGlvbnMgPSBuZXcgVHJlZU9wdGlvbnMoKTtcbiAgbm9kZXM6IGFueVtdO1xuICBldmVudE5hbWVzID0gT2JqZWN0LmtleXMoVFJFRV9FVkVOVFMpO1xuICB2aXJ0dWFsU2Nyb2xsOiBUcmVlVmlydHVhbFNjcm9sbDtcblxuICBAb2JzZXJ2YWJsZSByb290czogVHJlZU5vZGVbXTtcbiAgQG9ic2VydmFibGUgZXhwYW5kZWROb2RlSWRzOiB7IFtpZDogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XG4gIEBvYnNlcnZhYmxlIGFjdGl2ZU5vZGVJZHM6IHsgW2lkOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcbiAgQG9ic2VydmFibGUgaGlkZGVuTm9kZUlkczogeyBbaWQ6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xuICBAb2JzZXJ2YWJsZSBmb2N1c2VkTm9kZUlkOiBzdHJpbmcgPSBudWxsO1xuICBAb2JzZXJ2YWJsZSB2aXJ0dWFsUm9vdDogVHJlZU5vZGU7XG5cbiAgcHJpdmF0ZSBmaXJzdFVwZGF0ZSA9IHRydWU7XG4gIHByaXZhdGUgZXZlbnRzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvLyBldmVudHNcbiAgZmlyZUV2ZW50KGV2ZW50KSB7XG4gICAgZXZlbnQudHJlZU1vZGVsID0gdGhpcztcbiAgICBjb25zdCBuZXdFdmVudE5hbWUgPSBuZXdOYW1lKGV2ZW50LmV2ZW50TmFtZSk7XG4gICAgY29uc3QgZGVwcmVjYXRlZEV2ZW50ID0gT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHtcbiAgICAgIGRlcHJlY2F0ZWQ6IGBUaGlzIGV2ZW50IGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgJHtuZXdFdmVudE5hbWV9IGluc3RlYWRgXG4gICAgfSk7XG4gICAgZXZlbnQuZXZlbnROYW1lID0gbmV3RXZlbnROYW1lO1xuXG4gICAgdGhpcy5ldmVudHNbZGVwcmVjYXRlZEV2ZW50LmV2ZW50TmFtZV0uZW1pdChkZXByZWNhdGVkRXZlbnQpO1xuICAgIHRoaXMuZXZlbnRzW2V2ZW50LmV2ZW50TmFtZV0uZW1pdChldmVudCk7XG4gICAgdGhpcy5ldmVudHMub25FdmVudC5lbWl0KGRlcHJlY2F0ZWRFdmVudCk7XG4gICAgdGhpcy5ldmVudHMuZXZlbnQuZW1pdChldmVudCk7XG4gIH1cblxuICBzdWJzY3JpYmUoZXZlbnROYW1lLCBmbikge1xuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3Vic2NyaWJlKGZuKTtcbiAgfVxuXG5cbiAgLy8gZ2V0dGVyc1xuICBnZXRGb2N1c2VkTm9kZSgpOiBUcmVlTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZE5vZGU7XG4gIH1cblxuXG4gIGdldEFjdGl2ZU5vZGUoKTogVHJlZU5vZGUge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZU5vZGVzWzBdO1xuICB9XG5cbiAgZ2V0QWN0aXZlTm9kZXMoKTogVHJlZU5vZGVbXSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlTm9kZXM7XG4gIH1cblxuICBnZXRWaXNpYmxlUm9vdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlydHVhbFJvb3QudmlzaWJsZUNoaWxkcmVuO1xuICB9XG5cbiAgZ2V0Rmlyc3RSb290KHNraXBIaWRkZW4gPSBmYWxzZSkge1xuICAgIHJldHVybiBmaXJzdChza2lwSGlkZGVuID8gdGhpcy5nZXRWaXNpYmxlUm9vdHMoKSA6IHRoaXMucm9vdHMpO1xuICB9XG5cbiAgZ2V0TGFzdFJvb3Qoc2tpcEhpZGRlbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIGxhc3Qoc2tpcEhpZGRlbiA/IHRoaXMuZ2V0VmlzaWJsZVJvb3RzKCkgOiB0aGlzLnJvb3RzKTtcbiAgfVxuXG4gIGdldCBpc0ZvY3VzZWQoKSB7XG4gICAgcmV0dXJuIFRyZWVNb2RlbC5mb2N1c2VkVHJlZSA9PT0gdGhpcztcbiAgfVxuXG4gIGlzTm9kZUZvY3VzZWQobm9kZSkge1xuICAgIHJldHVybiB0aGlzLmZvY3VzZWROb2RlID09PSBub2RlO1xuICB9XG5cbiAgaXNFbXB0eVRyZWUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucm9vdHMgJiYgdGhpcy5yb290cy5sZW5ndGggPT09IDA7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IGZvY3VzZWROb2RlKCkge1xuICAgIHJldHVybiB0aGlzLmZvY3VzZWROb2RlSWQgPyB0aGlzLmdldE5vZGVCeUlkKHRoaXMuZm9jdXNlZE5vZGVJZCkgOiBudWxsO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBleHBhbmRlZE5vZGVzKCkge1xuICAgIGNvbnN0IG5vZGVzID0gT2JqZWN0LmtleXModGhpcy5leHBhbmRlZE5vZGVJZHMpXG4gICAgICAuZmlsdGVyKChpZCkgPT4gdGhpcy5leHBhbmRlZE5vZGVJZHNbaWRdKVxuICAgICAgLm1hcCgoaWQpID0+IHRoaXMuZ2V0Tm9kZUJ5SWQoaWQpKTtcblxuICAgIHJldHVybiBjb21wYWN0KG5vZGVzKTtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgYWN0aXZlTm9kZXMoKSB7XG4gICAgY29uc3Qgbm9kZXMgPSBPYmplY3Qua2V5cyh0aGlzLmFjdGl2ZU5vZGVJZHMpXG4gICAgICAuZmlsdGVyKChpZCkgPT4gdGhpcy5hY3RpdmVOb2RlSWRzW2lkXSlcbiAgICAgIC5tYXAoKGlkKSA9PiB0aGlzLmdldE5vZGVCeUlkKGlkKSk7XG5cbiAgICByZXR1cm4gY29tcGFjdChub2Rlcyk7XG4gIH1cblxuICAvLyBsb2NhdGluZyBub2Rlc1xuICBnZXROb2RlQnlQYXRoKHBhdGg6IGFueVtdLCBzdGFydE5vZGU9IG51bGwpOiBUcmVlTm9kZSB7XG4gICAgaWYgKCFwYXRoKSByZXR1cm4gbnVsbDtcblxuICAgIHN0YXJ0Tm9kZSA9IHN0YXJ0Tm9kZSB8fCB0aGlzLnZpcnR1YWxSb290O1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHN0YXJ0Tm9kZTtcblxuICAgIGlmICghc3RhcnROb2RlLmNoaWxkcmVuKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGNoaWxkSWQgPSBwYXRoLnNoaWZ0KCk7XG4gICAgY29uc3QgY2hpbGROb2RlID0gZmluZChzdGFydE5vZGUuY2hpbGRyZW4sIHsgaWQ6IGNoaWxkSWQgfSk7XG5cbiAgICBpZiAoIWNoaWxkTm9kZSkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5nZXROb2RlQnlQYXRoKHBhdGgsIGNoaWxkTm9kZSk7XG4gIH1cblxuICBnZXROb2RlQnlJZChpZCkge1xuICAgIGNvbnN0IGlkU3RyID0gaWQudG9TdHJpbmcoKTtcblxuICAgIHJldHVybiB0aGlzLmdldE5vZGVCeSgobm9kZSkgPT4gbm9kZS5pZC50b1N0cmluZygpID09PSBpZFN0cik7XG4gIH1cblxuICBnZXROb2RlQnkocHJlZGljYXRlLCBzdGFydE5vZGUgPSBudWxsKSB7XG4gICAgc3RhcnROb2RlID0gc3RhcnROb2RlIHx8IHRoaXMudmlydHVhbFJvb3Q7XG5cbiAgICBpZiAoIXN0YXJ0Tm9kZS5jaGlsZHJlbikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBmb3VuZCA9IGZpbmQoc3RhcnROb2RlLmNoaWxkcmVuLCBwcmVkaWNhdGUpO1xuXG4gICAgaWYgKGZvdW5kKSB7IC8vIGZvdW5kIGluIGNoaWxkcmVuXG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfSBlbHNlIHsgLy8gbG9vayBpbiBjaGlsZHJlbidzIGNoaWxkcmVuXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBzdGFydE5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc3QgZm91bmRJbkNoaWxkcmVuID0gdGhpcy5nZXROb2RlQnkocHJlZGljYXRlLCBjaGlsZCk7XG4gICAgICAgIGlmIChmb3VuZEluQ2hpbGRyZW4pIHJldHVybiBmb3VuZEluQ2hpbGRyZW47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNFeHBhbmRlZChub2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kZWROb2RlSWRzW25vZGUuaWRdO1xuICB9XG5cbiAgaXNIaWRkZW4obm9kZSkge1xuICAgIHJldHVybiB0aGlzLmhpZGRlbk5vZGVJZHNbbm9kZS5pZF07XG4gIH1cblxuICBpc0FjdGl2ZShub2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlTm9kZUlkc1tub2RlLmlkXTtcbiAgfVxuXG4gIC8vIGFjdGlvbnNcbiAgQGFjdGlvbiBzZXREYXRhKHsgbm9kZXMsIG9wdGlvbnMgPSBudWxsLCBldmVudHMgPSBudWxsIH06IHtub2RlczogYW55LCBvcHRpb25zOiBhbnksIGV2ZW50czogYW55fSkge1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgVHJlZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChldmVudHMpIHtcbiAgICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuICAgIH1cbiAgICBpZiAobm9kZXMpIHtcbiAgICAgIHRoaXMubm9kZXMgPSBub2RlcztcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgQGFjdGlvbiB1cGRhdGUoKSB7XG4gICAgLy8gUmVidWlsZCB0cmVlOlxuICAgIGxldCB2aXJ0dWFsUm9vdENvbmZpZyA9IHtcbiAgICAgIHZpcnR1YWw6IHRydWUsXG4gICAgICBbdGhpcy5vcHRpb25zLmNoaWxkcmVuRmllbGRdOiB0aGlzLm5vZGVzXG4gICAgfTtcblxuICAgIHRoaXMudmlydHVhbFJvb3QgPSBuZXcgVHJlZU5vZGUodmlydHVhbFJvb3RDb25maWcsIG51bGwsIHRoaXMsIDApO1xuXG4gICAgdGhpcy5yb290cyA9IHRoaXMudmlydHVhbFJvb3QuY2hpbGRyZW47XG5cbiAgICAvLyBGaXJlIGV2ZW50OlxuICAgIGlmICh0aGlzLmZpcnN0VXBkYXRlKSB7XG4gICAgICBpZiAodGhpcy5yb290cykge1xuICAgICAgICB0aGlzLmZpcnN0VXBkYXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUV4cGFuZGVkTm9kZXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uVXBkYXRlRGF0YSB9KTtcbiAgICB9XG4gIH1cblxuXG4gIEBhY3Rpb24gc2V0Rm9jdXNlZE5vZGUobm9kZSkge1xuICAgIHRoaXMuZm9jdXNlZE5vZGVJZCA9IG5vZGUgPyBub2RlLmlkIDogbnVsbDtcbiAgfVxuXG4gIEBhY3Rpb24gc2V0Rm9jdXModmFsdWUpIHtcbiAgICBUcmVlTW9kZWwuZm9jdXNlZFRyZWUgPSB2YWx1ZSA/IHRoaXMgOiBudWxsO1xuICB9XG5cbiAgQGFjdGlvbiBkb0ZvckFsbChmbikge1xuICAgIHRoaXMucm9vdHMuZm9yRWFjaCgocm9vdCkgPT4gcm9vdC5kb0ZvckFsbChmbikpO1xuICB9XG5cbiAgQGFjdGlvbiBmb2N1c05leHROb2RlKCkge1xuICAgIGxldCBwcmV2aW91c05vZGUgPSB0aGlzLmdldEZvY3VzZWROb2RlKCk7XG4gICAgbGV0IG5leHROb2RlID0gcHJldmlvdXNOb2RlID8gcHJldmlvdXNOb2RlLmZpbmROZXh0Tm9kZSh0cnVlLCB0cnVlKSA6IHRoaXMuZ2V0Rmlyc3RSb290KHRydWUpO1xuICAgIGlmIChuZXh0Tm9kZSkgbmV4dE5vZGUuZm9jdXMoKTtcbiAgfVxuXG4gIEBhY3Rpb24gZm9jdXNQcmV2aW91c05vZGUoKSB7XG4gICAgbGV0IHByZXZpb3VzTm9kZSA9IHRoaXMuZ2V0Rm9jdXNlZE5vZGUoKTtcbiAgICBsZXQgbmV4dE5vZGUgPSBwcmV2aW91c05vZGUgPyBwcmV2aW91c05vZGUuZmluZFByZXZpb3VzTm9kZSh0cnVlKSA6IHRoaXMuZ2V0TGFzdFJvb3QodHJ1ZSk7XG4gICAgaWYgKG5leHROb2RlKSBuZXh0Tm9kZS5mb2N1cygpO1xuICB9XG5cbiAgQGFjdGlvbiBmb2N1c0RyaWxsRG93bigpIHtcbiAgICBsZXQgcHJldmlvdXNOb2RlID0gdGhpcy5nZXRGb2N1c2VkTm9kZSgpO1xuICAgIGlmIChwcmV2aW91c05vZGUgJiYgcHJldmlvdXNOb2RlLmlzQ29sbGFwc2VkICYmIHByZXZpb3VzTm9kZS5oYXNDaGlsZHJlbikge1xuICAgICAgcHJldmlvdXNOb2RlLnRvZ2dsZUV4cGFuZGVkKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IG5leHROb2RlID0gcHJldmlvdXNOb2RlID8gcHJldmlvdXNOb2RlLmdldEZpcnN0Q2hpbGQodHJ1ZSkgOiB0aGlzLmdldEZpcnN0Um9vdCh0cnVlKTtcbiAgICAgIGlmIChuZXh0Tm9kZSkgbmV4dE5vZGUuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBAYWN0aW9uIGZvY3VzRHJpbGxVcCgpIHtcbiAgICBsZXQgcHJldmlvdXNOb2RlID0gdGhpcy5nZXRGb2N1c2VkTm9kZSgpO1xuICAgIGlmICghcHJldmlvdXNOb2RlKSByZXR1cm47XG4gICAgaWYgKHByZXZpb3VzTm9kZS5pc0V4cGFuZGVkKSB7XG4gICAgICBwcmV2aW91c05vZGUudG9nZ2xlRXhwYW5kZWQoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgbmV4dE5vZGUgPSBwcmV2aW91c05vZGUucmVhbFBhcmVudDtcbiAgICAgIGlmIChuZXh0Tm9kZSkgbmV4dE5vZGUuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBAYWN0aW9uIHNldEFjdGl2ZU5vZGUobm9kZSwgdmFsdWUsIG11bHRpID0gZmFsc2UpIHtcbiAgICBpZiAobXVsdGkpIHtcbiAgICAgIHRoaXMuX3NldEFjdGl2ZU5vZGVNdWx0aShub2RlLCB2YWx1ZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5fc2V0QWN0aXZlTm9kZVNpbmdsZShub2RlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBub2RlLmZvY3VzKCk7XG4gICAgICB0aGlzLmZpcmVFdmVudCh7IGV2ZW50TmFtZTogVFJFRV9FVkVOVFMub25BY3RpdmF0ZSwgbm9kZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uRGVhY3RpdmF0ZSwgbm9kZSB9KTtcbiAgICB9XG4gIH1cblxuICBAYWN0aW9uIHNldEV4cGFuZGVkTm9kZShub2RlLCB2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kZWROb2RlSWRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5leHBhbmRlZE5vZGVJZHMsIHtbbm9kZS5pZF06IHZhbHVlfSk7XG4gICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uVG9nZ2xlRXhwYW5kZWQsIG5vZGUsIGlzRXhwYW5kZWQ6IHZhbHVlIH0pO1xuICB9XG5cbiAgQGFjdGlvbiBleHBhbmRBbGwoKSB7XG4gICAgdGhpcy5yb290cy5mb3JFYWNoKChyb290KSA9PiByb290LmV4cGFuZEFsbCgpKTtcbiAgfVxuXG4gIEBhY3Rpb24gY29sbGFwc2VBbGwoKSB7XG4gICAgdGhpcy5yb290cy5mb3JFYWNoKChyb290KSA9PiByb290LmNvbGxhcHNlQWxsKCkpO1xuICB9XG5cbiAgQGFjdGlvbiBzZXRJc0hpZGRlbihub2RlLCB2YWx1ZSkge1xuICAgIHRoaXMuaGlkZGVuTm9kZUlkcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGlkZGVuTm9kZUlkcywge1tub2RlLmlkXTogdmFsdWV9KTtcbiAgfVxuXG4gIHBlcmZvcm1LZXlBY3Rpb24obm9kZSwgJGV2ZW50KSB7XG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5vcHRpb25zLmFjdGlvbk1hcHBpbmcua2V5c1skZXZlbnQua2V5Q29kZV07XG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBhY3Rpb24odGhpcywgbm9kZSwgJGV2ZW50KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQGFjdGlvbiBmaWx0ZXJOb2RlcyhmaWx0ZXIsIGF1dG9TaG93ID0gdHJ1ZSkge1xuICAgIGxldCBmaWx0ZXJGbjtcblxuICAgIGlmICghZmlsdGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhckZpbHRlcigpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnQgZnVuY3Rpb24gYW5kIHN0cmluZyBmaWx0ZXJcbiAgICBpZiAoaXNTdHJpbmcoZmlsdGVyKSkge1xuICAgICAgZmlsdGVyRm4gPSAobm9kZSkgPT4gbm9kZS5kaXNwbGF5RmllbGQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlci50b0xvd2VyQ2FzZSgpKSAhPT0gLTE7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24oZmlsdGVyKSkge1xuICAgICAgIGZpbHRlckZuID0gZmlsdGVyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0RvblxcJ3Qga25vdyB3aGF0IHRvIGRvIHdpdGggZmlsdGVyJywgZmlsdGVyKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Nob3VsZCBiZSBlaXRoZXIgYSBzdHJpbmcgb3IgZnVuY3Rpb24nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpZHMgPSB7fTtcbiAgICB0aGlzLnJvb3RzLmZvckVhY2goKG5vZGUpID0+IHRoaXMuX2ZpbHRlck5vZGUoaWRzLCBub2RlLCBmaWx0ZXJGbiwgYXV0b1Nob3cpKTtcbiAgICB0aGlzLmhpZGRlbk5vZGVJZHMgPSBpZHM7XG4gICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uQ2hhbmdlRmlsdGVyIH0pO1xuICB9XG5cbiAgQGFjdGlvbiBjbGVhckZpbHRlcigpIHtcbiAgICB0aGlzLmhpZGRlbk5vZGVJZHMgPSB7fTtcbiAgICB0aGlzLmZpcmVFdmVudCh7IGV2ZW50TmFtZTogVFJFRV9FVkVOVFMub25DaGFuZ2VGaWx0ZXIgfSk7XG4gIH1cblxuICBAYWN0aW9uIG1vdmVOb2RlKG5vZGUsIHRvKSB7XG4gICAgY29uc3QgZnJvbUluZGV4ID0gbm9kZS5nZXRJbmRleEluUGFyZW50KCk7XG4gICAgY29uc3QgZnJvbVBhcmVudCA9IG5vZGUucGFyZW50O1xuXG4gICAgaWYgKCF0aGlzLl9jYW5Nb3ZlTm9kZShub2RlLCBmcm9tSW5kZXggLCB0bykpIHJldHVybjtcblxuICAgIGNvbnN0IGZyb21DaGlsZHJlbiA9IGZyb21QYXJlbnQuZ2V0RmllbGQoJ2NoaWxkcmVuJyk7XG5cbiAgICAvLyBJZiBub2RlIGRvZXNuJ3QgaGF2ZSBjaGlsZHJlbiAtIGNyZWF0ZSBjaGlsZHJlbiBhcnJheVxuICAgIGlmICghdG8ucGFyZW50LmdldEZpZWxkKCdjaGlsZHJlbicpKSB7XG4gICAgICB0by5wYXJlbnQuc2V0RmllbGQoJ2NoaWxkcmVuJywgW10pO1xuICAgIH1cbiAgICBjb25zdCB0b0NoaWxkcmVuID0gdG8ucGFyZW50LmdldEZpZWxkKCdjaGlsZHJlbicpO1xuXG4gICAgY29uc3Qgb3JpZ2luYWxOb2RlID0gZnJvbUNoaWxkcmVuLnNwbGljZShmcm9tSW5kZXgsIDEpWzBdO1xuXG4gICAgLy8gQ29tcGVuc2F0ZSBmb3IgaW5kZXggaWYgYWxyZWFkeSByZW1vdmVkIGZyb20gcGFyZW50OlxuICAgIGxldCB0b0luZGV4ID0gKGZyb21QYXJlbnQgPT09IHRvLnBhcmVudCAmJiB0by5pbmRleCA+IGZyb21JbmRleCkgPyB0by5pbmRleCAtIDEgOiB0by5pbmRleDtcblxuICAgIHRvQ2hpbGRyZW4uc3BsaWNlKHRvSW5kZXgsIDAsIG9yaWdpbmFsTm9kZSk7XG5cbiAgICBmcm9tUGFyZW50LnRyZWVNb2RlbC51cGRhdGUoKTtcbiAgICBpZiAodG8ucGFyZW50LnRyZWVNb2RlbCAhPT0gZnJvbVBhcmVudC50cmVlTW9kZWwpIHtcbiAgICAgIHRvLnBhcmVudC50cmVlTW9kZWwudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uTW92ZU5vZGUsIG5vZGU6IG9yaWdpbmFsTm9kZSwgdG86IHsgcGFyZW50OiB0by5wYXJlbnQuZGF0YSwgaW5kZXg6IHRvSW5kZXggfSB9KTtcbiAgfVxuXG4gIC8vIHByaXZhdGUgbWV0aG9kc1xuICBwcml2YXRlIF9jYW5Nb3ZlTm9kZShub2RlLCBmcm9tSW5kZXgsIHRvKSB7XG4gICAgLy8gc2FtZSBub2RlOlxuICAgIGlmIChub2RlLnBhcmVudCA9PT0gdG8ucGFyZW50ICYmIGZyb21JbmRleCA9PT0gdG8uaW5kZXgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRvLnBhcmVudC5pc0Rlc2NlbmRhbnRPZihub2RlKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfZmlsdGVyTm9kZShpZHMsIG5vZGUsIGZpbHRlckZuLCBhdXRvU2hvdykge1xuICAgIC8vIGlmIG5vZGUgcGFzc2VzIGZ1bmN0aW9uIHRoZW4gaXQncyB2aXNpYmxlXG4gICAgbGV0IGlzVmlzaWJsZSA9IGZpbHRlckZuKG5vZGUpO1xuXG4gICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIC8vIGlmIG9uZSBvZiBub2RlJ3MgY2hpbGRyZW4gcGFzc2VzIGZpbHRlciB0aGVuIHRoaXMgbm9kZSBpcyBhbHNvIHZpc2libGVcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2ZpbHRlck5vZGUoaWRzLCBjaGlsZCwgZmlsdGVyRm4sIGF1dG9TaG93KSkge1xuICAgICAgICAgIGlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIG1hcmsgbm9kZSBhcyBoaWRkZW5cbiAgICBpZiAoIWlzVmlzaWJsZSkge1xuICAgICAgaWRzW25vZGUuaWRdID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gYXV0byBleHBhbmQgcGFyZW50cyB0byBtYWtlIHN1cmUgdGhlIGZpbHRlcmVkIG5vZGVzIGFyZSB2aXNpYmxlXG4gICAgaWYgKGF1dG9TaG93ICYmIGlzVmlzaWJsZSkge1xuICAgICAgbm9kZS5lbnN1cmVWaXNpYmxlKCk7XG4gICAgfVxuICAgIHJldHVybiBpc1Zpc2libGU7XG4gIH1cblxuICBwcml2YXRlIF9jYWxjdWxhdGVFeHBhbmRlZE5vZGVzKHN0YXJ0Tm9kZSA9IG51bGwpIHtcbiAgICBzdGFydE5vZGUgPSBzdGFydE5vZGUgfHwgdGhpcy52aXJ0dWFsUm9vdDtcblxuICAgIGlmIChzdGFydE5vZGUuZGF0YVt0aGlzLm9wdGlvbnMuaXNFeHBhbmRlZEZpZWxkXSkge1xuICAgICAgdGhpcy5leHBhbmRlZE5vZGVJZHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmV4cGFuZGVkTm9kZUlkcywge1tzdGFydE5vZGUuaWRdOiB0cnVlfSk7XG4gICAgfVxuICAgIGlmIChzdGFydE5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIHN0YXJ0Tm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4gdGhpcy5fY2FsY3VsYXRlRXhwYW5kZWROb2RlcyhjaGlsZCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldEFjdGl2ZU5vZGVTaW5nbGUobm9kZSwgdmFsdWUpIHtcbiAgICAvLyBEZWFjdGl2YXRlIGFsbCBvdGhlciBub2RlczpcbiAgICB0aGlzLmFjdGl2ZU5vZGVzXG4gICAgICAuZmlsdGVyKChhY3RpdmVOb2RlKSA9PiBhY3RpdmVOb2RlICE9PSBub2RlKVxuICAgICAgLmZvckVhY2goKGFjdGl2ZU5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uRGVhY3RpdmF0ZSwgbm9kZTogYWN0aXZlTm9kZSB9KTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmFjdGl2ZU5vZGVJZHMgPSB7W25vZGUuaWRdOiB0cnVlfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZU5vZGVJZHMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRBY3RpdmVOb2RlTXVsdGkobm9kZSwgdmFsdWUpIHtcbiAgICB0aGlzLmFjdGl2ZU5vZGVJZHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmFjdGl2ZU5vZGVJZHMsIHtbbm9kZS5pZF06IHZhbHVlfSk7XG4gIH1cblxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogSW5qZWN0YWJsZSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9ICgpID0+IFtcbl07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==