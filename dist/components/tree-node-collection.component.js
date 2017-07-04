var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import { reaction } from 'mobx';
import { observable, computed, action } from 'mobx-angular';
import { deprecatedSelector } from '../deprecated-selector';
var TreeNodeCollectionComponent = (function () {
    function TreeNodeCollectionComponent(elementRef) {
        this.elementRef = elementRef;
        this._dispose = [];
        deprecatedSelector('TreeNodeCollection', 'tree-node-collection', elementRef);
    }
    Object.defineProperty(TreeNodeCollectionComponent.prototype, "nodes", {
        get: function () { return this._nodes; },
        set: function (nodes) { this.setNodes(nodes); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNodeCollectionComponent.prototype, "marginTop", {
        get: function () {
            var firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0];
            var relativePosition = firstNode ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight() : 0;
            return relativePosition + "px";
        },
        enumerable: true,
        configurable: true
    });
    TreeNodeCollectionComponent.prototype.setNodes = function (nodes) {
        this._nodes = nodes;
    };
    TreeNodeCollectionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.virtualScroll = this.treeModel.virtualScroll;
        this._dispose = [
            // return node indexes so we can compare structurally,
            reaction(function () {
                return _this.virtualScroll.getViewportNodes(_this.nodes).map(function (n) { return n.index; });
            }, function (nodeIndexes) {
                _this.viewportNodes = nodeIndexes.map(function (i) { return _this.nodes[i]; });
            }, { compareStructural: true, fireImmediately: true }),
            reaction(function () { return _this.nodes; }, function (nodes) {
                _this.viewportNodes = _this.virtualScroll.getViewportNodes(nodes);
            })
        ];
    };
    TreeNodeCollectionComponent.prototype.ngOnDestroy = function () {
        this._dispose.forEach(function (d) { return d(); });
    };
    TreeNodeCollectionComponent.prototype.trackNode = function (index, node) {
        return node.id;
    };
    return TreeNodeCollectionComponent;
}());
export { TreeNodeCollectionComponent };
TreeNodeCollectionComponent.decorators = [
    { type: Component, args: [{
                selector: 'tree-node-collection, TreeNodeCollection',
                encapsulation: ViewEncapsulation.None,
                template: "\n    <ng-container *mobxAutorun>\n      <div\n        [style.margin-top]=\"marginTop\">\n        <tree-node\n          *ngFor=\"let node of viewportNodes; let i = index; trackBy: trackNode\"\n          [node]=\"node\"\n          [index]=\"i\"\n          [templates]=\"templates\">\n        </tree-node>\n      </div>\n    </ng-container>\n  "
            },] },
];
/** @nocollapse */
TreeNodeCollectionComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
TreeNodeCollectionComponent.propDecorators = {
    'nodes': [{ type: Input },],
    'treeModel': [{ type: Input },],
    'templates': [{ type: Input },],
};
__decorate([
    observable,
    __metadata("design:type", Object)
], TreeNodeCollectionComponent.prototype, "_nodes", void 0);
__decorate([
    observable,
    __metadata("design:type", Array)
], TreeNodeCollectionComponent.prototype, "viewportNodes", void 0);
__decorate([
    computed,
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], TreeNodeCollectionComponent.prototype, "marginTop", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeNodeCollectionComponent.prototype, "setNodes", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS1jb2xsZWN0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUFFLEtBQUEsRUFBTyxpQkFBQSxFQUFzQyxVQUFBLEVBQ3pELE1BQU0sZUFBQSxDQUFnQjtBQUN2QixPQUFPLEVBQUUsUUFBQSxFQUFrQixNQUFPLE1BQUEsQ0FBTztBQUN6QyxPQUFPLEVBQUUsVUFBQSxFQUFZLFFBQUEsRUFBVSxNQUFBLEVBQU8sTUFBTyxjQUFBLENBQWU7QUFJNUQsT0FBTyxFQUFFLGtCQUFBLEVBQW1CLE1BQU8sd0JBQUEsQ0FBeUI7QUFHNUQ7SUFzQkUscUNBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFGMUMsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUdaLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFLHNCQUFzQixFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUF0QkQsc0JBQUksOENBQUs7YUFBVCxjQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUNuQyxVQUFVLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BRFA7SUFXekIsc0JBQUksa0RBQVM7YUFBYjtZQUNSLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRixJQUFNLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTNILE1BQU0sQ0FBSSxnQkFBZ0IsT0FBSSxDQUFDO1FBQ2pDLENBQUM7OztPQUFBO0lBUU8sOENBQVEsR0FBUixVQUFTLEtBQUs7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELDhDQUFRLEdBQVI7UUFBQSxpQkFjQztRQWJDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLHNEQUFzRDtZQUN0RCxRQUFRLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxLQUFLLEVBQVAsQ0FBTyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxFQUFFLFVBQUMsV0FBVztnQkFDWCxLQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFiLENBQWEsQ0FBQyxDQUFDO1lBQzdELENBQUMsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQ3REO1lBQ0QsUUFBUSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxFQUFWLENBQVUsRUFBRSxVQUFDLEtBQUs7Z0JBQy9CLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELGlEQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsRUFBRSxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCwrQ0FBUyxHQUFULFVBQVUsS0FBSyxFQUFFLElBQUk7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQThCSCxrQ0FBQztBQUFELENBbEZBLEFBa0ZDOztBQTVCTSxzQ0FBVSxHQUEwQjtJQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSwwQ0FBMEM7Z0JBQ3BELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUUsd1ZBWVQ7YUFDRixFQUFHLEVBQUU7Q0FDTCxDQUFDO0FBQ0Ysa0JBQWtCO0FBQ1gsMENBQWMsR0FBbUUsY0FBTSxPQUFBO0lBQzlGLEVBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRztDQUNuQixFQUY2RixDQUU3RixDQUFDO0FBQ0ssMENBQWMsR0FBMkM7SUFDaEUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDM0IsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDL0IsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Q0FDOUIsQ0FBQztBQTFFWTtJQUFYLFVBQVU7OzJEQUFRO0FBSVA7SUFBWCxVQUFVOztrRUFBMkI7QUFFNUI7SUFBVCxRQUFROzs7NERBS1I7QUFRTztJQUFQLE1BQU07Ozs7MkRBRU4iLCJmaWxlIjoidHJlZS1ub2RlLWNvbGxlY3Rpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBPbkluaXQsIE9uRGVzdHJveSwgRWxlbWVudFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHJlYWN0aW9uLCBhdXRvcnVuIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgeyBvYnNlcnZhYmxlLCBjb21wdXRlZCwgYWN0aW9uIH0gZnJvbSAnbW9ieC1hbmd1bGFyJztcbmltcG9ydCB7IFRyZWVWaXJ0dWFsU2Nyb2xsIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtdmlydHVhbC1zY3JvbGwubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS1ub2RlLm1vZGVsJztcbmltcG9ydCB7IFRyZWVNb2RlbCB9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcbmltcG9ydCB7IGRlcHJlY2F0ZWRTZWxlY3RvciB9IGZyb20gJy4uL2RlcHJlY2F0ZWQtc2VsZWN0b3InO1xuXG5cbmV4cG9ydCBjbGFzcyBUcmVlTm9kZUNvbGxlY3Rpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIFxuICBnZXQgbm9kZXMoKSB7IHJldHVybiB0aGlzLl9ub2RlczsgfVxuICBzZXQgbm9kZXMobm9kZXMpIHsgdGhpcy5zZXROb2Rlcyhub2Rlcyk7IH1cblxuICAgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XG5cbiAgQG9ic2VydmFibGUgX25vZGVzO1xuICBwcml2YXRlIHZpcnR1YWxTY3JvbGw6IFRyZWVWaXJ0dWFsU2Nyb2xsOyAvLyBDYW5ub3QgaW5qZWN0IHRoaXMsIGJlY2F1c2Ugd2UgbWlnaHQgYmUgaW5zaWRlIHRyZWVOb2RlVGVtcGxhdGVGdWxsXG4gICB0ZW1wbGF0ZXM7XG5cbiAgQG9ic2VydmFibGUgdmlld3BvcnROb2RlczogVHJlZU5vZGVbXTtcblxuICBAY29tcHV0ZWQgZ2V0IG1hcmdpblRvcCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGZpcnN0Tm9kZSA9IHRoaXMudmlld3BvcnROb2RlcyAmJiB0aGlzLnZpZXdwb3J0Tm9kZXMubGVuZ3RoICYmIHRoaXMudmlld3BvcnROb2Rlc1swXTtcbiAgICBjb25zdCByZWxhdGl2ZVBvc2l0aW9uID0gZmlyc3ROb2RlID8gZmlyc3ROb2RlLnBvc2l0aW9uIC0gZmlyc3ROb2RlLnBhcmVudC5wb3NpdGlvbiAtIGZpcnN0Tm9kZS5wYXJlbnQuZ2V0U2VsZkhlaWdodCgpIDogMDtcblxuICAgIHJldHVybiBgJHtyZWxhdGl2ZVBvc2l0aW9ufXB4YDtcbiAgfVxuXG4gIF9kaXNwb3NlID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgZGVwcmVjYXRlZFNlbGVjdG9yKCdUcmVlTm9kZUNvbGxlY3Rpb24nLCAndHJlZS1ub2RlLWNvbGxlY3Rpb24nLCBlbGVtZW50UmVmKTtcbiAgfVxuXG4gIEBhY3Rpb24gc2V0Tm9kZXMobm9kZXMpIHtcbiAgICB0aGlzLl9ub2RlcyA9IG5vZGVzO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsID0gdGhpcy50cmVlTW9kZWwudmlydHVhbFNjcm9sbDtcbiAgICB0aGlzLl9kaXNwb3NlID0gW1xuICAgICAgLy8gcmV0dXJuIG5vZGUgaW5kZXhlcyBzbyB3ZSBjYW4gY29tcGFyZSBzdHJ1Y3R1cmFsbHksXG4gICAgICByZWFjdGlvbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnZpcnR1YWxTY3JvbGwuZ2V0Vmlld3BvcnROb2Rlcyh0aGlzLm5vZGVzKS5tYXAobiA9PiBuLmluZGV4KTtcbiAgICAgIH0sIChub2RlSW5kZXhlcykgPT4ge1xuICAgICAgICAgIHRoaXMudmlld3BvcnROb2RlcyA9IG5vZGVJbmRleGVzLm1hcCgoaSkgPT4gdGhpcy5ub2Rlc1tpXSk7XG4gICAgICAgIH0sIHsgY29tcGFyZVN0cnVjdHVyYWw6IHRydWUsIGZpcmVJbW1lZGlhdGVseTogdHJ1ZSB9XG4gICAgICApLFxuICAgICAgcmVhY3Rpb24oKCkgPT4gdGhpcy5ub2RlcywgKG5vZGVzKSA9PiB7XG4gICAgICAgIHRoaXMudmlld3BvcnROb2RlcyA9IHRoaXMudmlydHVhbFNjcm9sbC5nZXRWaWV3cG9ydE5vZGVzKG5vZGVzKTtcbiAgICAgIH0pXG4gICAgXTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rpc3Bvc2UuZm9yRWFjaChkID0+IGQoKSk7XG4gIH1cblxuICB0cmFja05vZGUoaW5kZXgsIG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5pZDtcbiAgfVxuXG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gIHNlbGVjdG9yOiAndHJlZS1ub2RlLWNvbGxlY3Rpb24sIFRyZWVOb2RlQ29sbGVjdGlvbicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRhaW5lciAqbW9ieEF1dG9ydW4+XG4gICAgICA8ZGl2XG4gICAgICAgIFtzdHlsZS5tYXJnaW4tdG9wXT1cIm1hcmdpblRvcFwiPlxuICAgICAgICA8dHJlZS1ub2RlXG4gICAgICAgICAgKm5nRm9yPVwibGV0IG5vZGUgb2Ygdmlld3BvcnROb2RlczsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogdHJhY2tOb2RlXCJcbiAgICAgICAgICBbbm9kZV09XCJub2RlXCJcbiAgICAgICAgICBbaW5kZXhdPVwiaVwiXG4gICAgICAgICAgW3RlbXBsYXRlc109XCJ0ZW1wbGF0ZXNcIj5cbiAgICAgICAgPC90cmVlLW5vZGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgYFxufSwgXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9ICgpID0+IFtcbnt0eXBlOiBFbGVtZW50UmVmLCB9LFxuXTtcbnN0YXRpYyBwcm9wRGVjb3JhdG9yczoge1trZXk6IHN0cmluZ106IERlY29yYXRvckludm9jYXRpb25bXX0gPSB7XG4nbm9kZXMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4ndHJlZU1vZGVsJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ3RlbXBsYXRlcyc6IFt7IHR5cGU6IElucHV0IH0sXSxcbn07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==