import { Component, Input, Output, EventEmitter, Renderer, ElementRef, ViewEncapsulation, ContentChild, HostListener, ViewChild } from '@angular/core';
import { TreeModel } from '../models/tree.model';
import { TreeDraggedElement } from '../models/tree-dragged-element.model';
import { deprecatedSelector } from '../deprecated-selector';
import * as _ from 'lodash';
var includes = _.includes, pick = _.pick;
var TreeComponent = (function () {
    function TreeComponent(treeModel, treeDraggedElement, renderer, elementRef) {
        var _this = this;
        this.treeModel = treeModel;
        this.treeDraggedElement = treeDraggedElement;
        this.renderer = renderer;
        this.elementRef = elementRef;
        deprecatedSelector('Tree', 'tree-root', elementRef);
        treeModel.eventNames.forEach(function (name) { return _this[name] = new EventEmitter(); });
    }
    Object.defineProperty(TreeComponent.prototype, "nodes", {
        // Will be handled in ngOnChanges
        set: function (nodes) { },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(TreeComponent.prototype, "options", {
        set: function (options) { },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(TreeComponent.prototype, "focused", {
        set: function (value) {
            this.treeModel.setFocus(value);
        },
        enumerable: true,
        configurable: true
    });
    TreeComponent.prototype.onKeydown = function ($event) {
        if (!this.treeModel.isFocused)
            return;
        if (includes(['input', 'textarea'], document.activeElement.tagName.toLowerCase()))
            return;
        var focusedNode = this.treeModel.getFocusedNode();
        this.treeModel.performKeyAction(focusedNode, $event);
    };
    TreeComponent.prototype.onMousedown = function ($event) {
        var insideClick = this.renderer.invokeElementMethod($event.target, 'closest', ['Tree']);
        if (!insideClick) {
            this.treeModel.setFocus(false);
        }
    };
    TreeComponent.prototype.ngOnChanges = function (changes) {
        this.treeModel.setData({
            options: changes.options && changes.options.currentValue,
            nodes: changes.nodes && changes.nodes.currentValue,
            events: pick(this, this.treeModel.eventNames)
        });
    };
    TreeComponent.prototype.sizeChanged = function () {
        this.viewportComponent.setViewport();
    };
    return TreeComponent;
}());
export { TreeComponent };
TreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'Tree, tree-root',
                encapsulation: ViewEncapsulation.None,
                providers: [TreeModel],
                styles: [
                    '.tree-children { padding-left: 20px }',
                    '.empty-tree-drop-slot .node-drop-slot { height: 20px; min-width: 100px }',
                    ".tree {\n      width: 100%;\n      position:relative;\n      display: inline-block;\n      cursor: pointer;\n      -webkit-touch-callout: none; /* iOS Safari */\n      -webkit-user-select: none;   /* Chrome/Safari/Opera */\n      -khtml-user-select: none;    /* Konqueror */\n      -moz-user-select: none;      /* Firefox */\n      -ms-user-select: none;       /* IE/Edge */\n      user-select: none;           /* non-prefixed version, currently not supported by any browser */\n    }"
                ],
                template: "\n    <tree-viewport #viewport>\n      <div\n        class=\"tree\"\n        [class.node-dragging]=\"treeDraggedElement.isDragging()\">\n        <tree-node-collection\n          *ngIf=\"treeModel.roots\"\n          [nodes]=\"treeModel.roots\"\n          [treeModel]=\"treeModel\"\n          [templates]=\"{\n            loadingTemplate: loadingTemplate,\n            treeNodeTemplate: treeNodeTemplate,\n            treeNodeWrapperTemplate: treeNodeWrapperTemplate,\n            treeNodeFullTemplate: treeNodeFullTemplate\n          }\">\n        </tree-node-collection>\n        <tree-node-drop-slot\n          class=\"empty-tree-drop-slot\"\n          *ngIf=\"treeModel.isEmptyTree()\"\n          [dropIndex]=\"0\"\n          [node]=\"treeModel.virtualRoot\">\n        </tree-node-drop-slot>\n      </div>\n    </tree-viewport>\n  "
            },] },
];
/** @nocollapse */
TreeComponent.ctorParameters = function () { return [
    { type: TreeModel, },
    { type: TreeDraggedElement, },
    { type: Renderer, },
    { type: ElementRef, },
]; };
TreeComponent.propDecorators = {
    'loadingTemplate': [{ type: ContentChild, args: ['loadingTemplate',] },],
    'treeNodeTemplate': [{ type: ContentChild, args: ['treeNodeTemplate',] },],
    'treeNodeWrapperTemplate': [{ type: ContentChild, args: ['treeNodeWrapperTemplate',] },],
    'treeNodeFullTemplate': [{ type: ContentChild, args: ['treeNodeFullTemplate',] },],
    'viewportComponent': [{ type: ViewChild, args: ['viewport',] },],
    'nodes': [{ type: Input },],
    'options': [{ type: Input },],
    'focused': [{ type: Input },],
    'onToggleExpanded': [{ type: Output },],
    'onActivate': [{ type: Output },],
    'onDeactivate': [{ type: Output },],
    'onFocus': [{ type: Output },],
    'onBlur': [{ type: Output },],
    'onUpdateData': [{ type: Output },],
    'onInitialized': [{ type: Output },],
    'onMoveNode': [{ type: Output },],
    'onLoadChildren': [{ type: Output },],
    'onChangeFilter': [{ type: Output },],
    'onEvent': [{ type: Output },],
    'toggleExpanded': [{ type: Output },],
    'activate': [{ type: Output },],
    'deactivate': [{ type: Output },],
    'focus': [{ type: Output },],
    'blur': [{ type: Output },],
    'updateData': [{ type: Output },],
    'initialized': [{ type: Output },],
    'moveNode': [{ type: Output },],
    'loadChildren': [{ type: Output },],
    'changeFilter': [{ type: Output },],
    'event': [{ type: Output },],
    'onKeydown': [{ type: HostListener, args: ['body: keydown', ['$event'],] },],
    'onMousedown': [{ type: HostListener, args: ['body: mousedown', ['$event'],] },],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBQSxFQUFPLE1BQUEsRUFBbUIsWUFBQSxFQUFjLFFBQUEsRUFBVSxVQUFBLEVBQzdELGlCQUFpQixFQUFFLFlBQUEsRUFBMkIsWUFBQSxFQUFjLFNBQUEsRUFDN0QsTUFBTSxlQUFBLENBQWdCO0FBQ3ZCLE9BQU8sRUFBRSxTQUFBLEVBQVUsTUFBTyxzQkFBQSxDQUF1QjtBQUVqRCxPQUFPLEVBQUUsa0JBQUEsRUFBbUIsTUFBTyxzQ0FBQSxDQUF1QztBQUcxRSxPQUFPLEVBQUUsa0JBQUEsRUFBbUIsTUFBTyx3QkFBQSxDQUF5QjtBQUU1RCxPQUFPLEtBQUssQ0FBQSxNQUFPLFFBQUEsQ0FBUztBQUNwQixJQUFBLHFCQUFBLEVBQVUsYUFBQSxDQUFZO0FBRzlCO0lBMkNFLHVCQUNTLFNBQW9CLEVBQ3BCLGtCQUFzQyxFQUNyQyxRQUFrQixFQUNsQixVQUFzQjtRQUpoQyxpQkFRQztRQVBRLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUNyQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFFNUIsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNwRCxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLFlBQVksRUFBRSxFQUEvQixDQUErQixDQUFDLENBQUM7SUFDNUUsQ0FBQztJQXZDQSxzQkFBSSxnQ0FBSztRQURWLGlDQUFpQzthQUNoQyxVQUFVLEtBQVksSUFBSSxDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFDNUIsc0JBQUksa0NBQU87YUFBWCxVQUFZLE9BQW9CLElB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SSxFQUFFLE1BQU0sRUFBRSxFQUFFO0lBQzlCLGdCQUFnQixFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDckMsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDL0IsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDakMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDNUIsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDM0IsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDakMsYUFBYSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDbEMsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDL0IsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDbkMsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDbkMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDNUIsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFHLEVBQUUsRUFBRTtJQUM3RSxhQUFhLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUU7Q0FDaEYsQ0FBQyIsImZpbGUiOiJ0cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIE9uQ2hhbmdlcywgRXZlbnRFbWl0dGVyLCBSZW5kZXJlciwgRWxlbWVudFJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sIENvbnRlbnRDaGlsZCwgVGVtcGxhdGVSZWYsIEhvc3RMaXN0ZW5lciwgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJlZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS1ub2RlLm1vZGVsJztcbmltcG9ydCB7IFRyZWVEcmFnZ2VkRWxlbWVudCB9IGZyb20gJy4uL21vZGVscy90cmVlLWRyYWdnZWQtZWxlbWVudC5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlT3B0aW9ucyB9IGZyb20gJy4uL21vZGVscy90cmVlLW9wdGlvbnMubW9kZWwnO1xuaW1wb3J0IHsgVHJlZVZpZXdwb3J0Q29tcG9uZW50IH0gZnJvbSAnLi90cmVlLXZpZXdwb3J0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBkZXByZWNhdGVkU2VsZWN0b3IgfSBmcm9tICcuLi9kZXByZWNhdGVkLXNlbGVjdG9yJztcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuY29uc3QgeyBpbmNsdWRlcywgcGljayB9ICA9IF87XG5cblxuZXhwb3J0IGNsYXNzIFRyZWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBfbm9kZXM6IGFueVtdO1xuICBfb3B0aW9uczogVHJlZU9wdGlvbnM7XG5cbiAgIGxvYWRpbmdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgIHRyZWVOb2RlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gICB0cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgIHRyZWVOb2RlRnVsbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICB2aWV3cG9ydENvbXBvbmVudDogVHJlZVZpZXdwb3J0Q29tcG9uZW50O1xuXG4gIC8vIFdpbGwgYmUgaGFuZGxlZCBpbiBuZ09uQ2hhbmdlc1xuICAgc2V0IG5vZGVzKG5vZGVzOiBhbnlbXSkgeyB9O1xuICAgc2V0IG9wdGlvbnMob3B0aW9uczogVHJlZU9wdGlvbnMpIHsgfTtcblxuICAgc2V0IGZvY3VzZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnRyZWVNb2RlbC5zZXRGb2N1cyh2YWx1ZSk7XG4gIH1cblxuICAgb25Ub2dnbGVFeHBhbmRlZDtcbiAgIG9uQWN0aXZhdGU7XG4gICBvbkRlYWN0aXZhdGU7XG4gICBvbkZvY3VzO1xuICAgb25CbHVyO1xuICAgb25VcGRhdGVEYXRhO1xuICAgb25Jbml0aWFsaXplZDtcbiAgIG9uTW92ZU5vZGU7XG4gICBvbkxvYWRDaGlsZHJlbjtcbiAgIG9uQ2hhbmdlRmlsdGVyO1xuICAgb25FdmVudDtcblxuICAgdG9nZ2xlRXhwYW5kZWQ7XG4gICBhY3RpdmF0ZTtcbiAgIGRlYWN0aXZhdGU7XG4gICBmb2N1cztcbiAgIGJsdXI7XG4gICB1cGRhdGVEYXRhO1xuICAgaW5pdGlhbGl6ZWQ7XG4gICBtb3ZlTm9kZTtcbiAgIGxvYWRDaGlsZHJlbjtcbiAgIGNoYW5nZUZpbHRlcjtcbiAgIGV2ZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB0cmVlTW9kZWw6IFRyZWVNb2RlbCxcbiAgICBwdWJsaWMgdHJlZURyYWdnZWRFbGVtZW50OiBUcmVlRHJhZ2dlZEVsZW1lbnQsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG5cbiAgICAgIGRlcHJlY2F0ZWRTZWxlY3RvcignVHJlZScsICd0cmVlLXJvb3QnLCBlbGVtZW50UmVmKTtcbiAgICAgIHRyZWVNb2RlbC5ldmVudE5hbWVzLmZvckVhY2goKG5hbWUpID0+IHRoaXNbbmFtZV0gPSBuZXcgRXZlbnRFbWl0dGVyKCkpO1xuICB9XG5cbiAgXG4gIG9uS2V5ZG93bigkZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMudHJlZU1vZGVsLmlzRm9jdXNlZCkgcmV0dXJuO1xuICAgIGlmIChpbmNsdWRlcyhbJ2lucHV0JywgJ3RleHRhcmVhJ10sXG4gICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZm9jdXNlZE5vZGUgPSB0aGlzLnRyZWVNb2RlbC5nZXRGb2N1c2VkTm9kZSgpO1xuXG4gICAgdGhpcy50cmVlTW9kZWwucGVyZm9ybUtleUFjdGlvbihmb2N1c2VkTm9kZSwgJGV2ZW50KTtcbiAgfVxuXG4gIFxuICBvbk1vdXNlZG93bigkZXZlbnQpIHtcbiAgICBjb25zdCBpbnNpZGVDbGljayA9IHRoaXMucmVuZGVyZXIuaW52b2tlRWxlbWVudE1ldGhvZCgkZXZlbnQudGFyZ2V0LCAnY2xvc2VzdCcsIFsnVHJlZSddKTtcblxuICAgIGlmICghaW5zaWRlQ2xpY2spIHtcbiAgICAgIHRoaXMudHJlZU1vZGVsLnNldEZvY3VzKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgdGhpcy50cmVlTW9kZWwuc2V0RGF0YSh7XG4gICAgICBvcHRpb25zOiBjaGFuZ2VzLm9wdGlvbnMgJiYgY2hhbmdlcy5vcHRpb25zLmN1cnJlbnRWYWx1ZSxcbiAgICAgIG5vZGVzOiBjaGFuZ2VzLm5vZGVzICYmIGNoYW5nZXMubm9kZXMuY3VycmVudFZhbHVlLFxuICAgICAgZXZlbnRzOiBwaWNrKHRoaXMsIHRoaXMudHJlZU1vZGVsLmV2ZW50TmFtZXMpXG4gICAgfSk7XG4gIH1cblxuICBzaXplQ2hhbmdlZCgpIHtcbiAgICB0aGlzLnZpZXdwb3J0Q29tcG9uZW50LnNldFZpZXdwb3J0KCk7XG4gIH1cbnN0YXRpYyBkZWNvcmF0b3JzOiBEZWNvcmF0b3JJbnZvY2F0aW9uW10gPSBbXG57IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgc2VsZWN0b3I6ICdUcmVlLCB0cmVlLXJvb3QnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtUcmVlTW9kZWxdLFxuICBzdHlsZXM6IFtcbiAgICAnLnRyZWUtY2hpbGRyZW4geyBwYWRkaW5nLWxlZnQ6IDIwcHggfScsXG4gICAgJy5lbXB0eS10cmVlLWRyb3Atc2xvdCAubm9kZS1kcm9wLXNsb3QgeyBoZWlnaHQ6IDIwcHg7IG1pbi13aWR0aDogMTAwcHggfScsXG4gICAgYC50cmVlIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgcG9zaXRpb246cmVsYXRpdmU7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7IC8qIGlPUyBTYWZhcmkgKi9cbiAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7ICAgLyogQ2hyb21lL1NhZmFyaS9PcGVyYSAqL1xuICAgICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lOyAgICAvKiBLb25xdWVyb3IgKi9cbiAgICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7ICAgICAgLyogRmlyZWZveCAqL1xuICAgICAgLW1zLXVzZXItc2VsZWN0OiBub25lOyAgICAgICAvKiBJRS9FZGdlICovXG4gICAgICB1c2VyLXNlbGVjdDogbm9uZTsgICAgICAgICAgIC8qIG5vbi1wcmVmaXhlZCB2ZXJzaW9uLCBjdXJyZW50bHkgbm90IHN1cHBvcnRlZCBieSBhbnkgYnJvd3NlciAqL1xuICAgIH1gXG4gIF0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHRyZWUtdmlld3BvcnQgI3ZpZXdwb3J0PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cInRyZWVcIlxuICAgICAgICBbY2xhc3Mubm9kZS1kcmFnZ2luZ109XCJ0cmVlRHJhZ2dlZEVsZW1lbnQuaXNEcmFnZ2luZygpXCI+XG4gICAgICAgIDx0cmVlLW5vZGUtY29sbGVjdGlvblxuICAgICAgICAgICpuZ0lmPVwidHJlZU1vZGVsLnJvb3RzXCJcbiAgICAgICAgICBbbm9kZXNdPVwidHJlZU1vZGVsLnJvb3RzXCJcbiAgICAgICAgICBbdHJlZU1vZGVsXT1cInRyZWVNb2RlbFwiXG4gICAgICAgICAgW3RlbXBsYXRlc109XCJ7XG4gICAgICAgICAgICBsb2FkaW5nVGVtcGxhdGU6IGxvYWRpbmdUZW1wbGF0ZSxcbiAgICAgICAgICAgIHRyZWVOb2RlVGVtcGxhdGU6IHRyZWVOb2RlVGVtcGxhdGUsXG4gICAgICAgICAgICB0cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZTogdHJlZU5vZGVXcmFwcGVyVGVtcGxhdGUsXG4gICAgICAgICAgICB0cmVlTm9kZUZ1bGxUZW1wbGF0ZTogdHJlZU5vZGVGdWxsVGVtcGxhdGVcbiAgICAgICAgICB9XCI+XG4gICAgICAgIDwvdHJlZS1ub2RlLWNvbGxlY3Rpb24+XG4gICAgICAgIDx0cmVlLW5vZGUtZHJvcC1zbG90XG4gICAgICAgICAgY2xhc3M9XCJlbXB0eS10cmVlLWRyb3Atc2xvdFwiXG4gICAgICAgICAgKm5nSWY9XCJ0cmVlTW9kZWwuaXNFbXB0eVRyZWUoKVwiXG4gICAgICAgICAgW2Ryb3BJbmRleF09XCIwXCJcbiAgICAgICAgICBbbm9kZV09XCJ0cmVlTW9kZWwudmlydHVhbFJvb3RcIj5cbiAgICAgICAgPC90cmVlLW5vZGUtZHJvcC1zbG90PlxuICAgICAgPC9kaXY+XG4gICAgPC90cmVlLXZpZXdwb3J0PlxuICBgXG59LCBdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5zdGF0aWMgY3RvclBhcmFtZXRlcnM6ICgpID0+ICh7dHlwZTogYW55LCBkZWNvcmF0b3JzPzogRGVjb3JhdG9ySW52b2NhdGlvbltdfXxudWxsKVtdID0gKCkgPT4gW1xue3R5cGU6IFRyZWVNb2RlbCwgfSxcbnt0eXBlOiBUcmVlRHJhZ2dlZEVsZW1lbnQsIH0sXG57dHlwZTogUmVuZGVyZXIsIH0sXG57dHlwZTogRWxlbWVudFJlZiwgfSxcbl07XG5zdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBEZWNvcmF0b3JJbnZvY2F0aW9uW119ID0ge1xuJ2xvYWRpbmdUZW1wbGF0ZSc6IFt7IHR5cGU6IENvbnRlbnRDaGlsZCwgYXJnczogWydsb2FkaW5nVGVtcGxhdGUnLCBdIH0sXSxcbid0cmVlTm9kZVRlbXBsYXRlJzogW3sgdHlwZTogQ29udGVudENoaWxkLCBhcmdzOiBbJ3RyZWVOb2RlVGVtcGxhdGUnLCBdIH0sXSxcbid0cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZSc6IFt7IHR5cGU6IENvbnRlbnRDaGlsZCwgYXJnczogWyd0cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZScsIF0gfSxdLFxuJ3RyZWVOb2RlRnVsbFRlbXBsYXRlJzogW3sgdHlwZTogQ29udGVudENoaWxkLCBhcmdzOiBbJ3RyZWVOb2RlRnVsbFRlbXBsYXRlJywgXSB9LF0sXG4ndmlld3BvcnRDb21wb25lbnQnOiBbeyB0eXBlOiBWaWV3Q2hpbGQsIGFyZ3M6IFsndmlld3BvcnQnLCBdIH0sXSxcbidub2Rlcyc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidvcHRpb25zJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ2ZvY3VzZWQnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nb25Ub2dnbGVFeHBhbmRlZCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nb25BY3RpdmF0ZSc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nb25EZWFjdGl2YXRlJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidvbkZvY3VzJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidvbkJsdXInOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ29uVXBkYXRlRGF0YSc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nb25Jbml0aWFsaXplZCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nb25Nb3ZlTm9kZSc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nb25Mb2FkQ2hpbGRyZW4nOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ29uQ2hhbmdlRmlsdGVyJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidvbkV2ZW50JzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbid0b2dnbGVFeHBhbmRlZCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nYWN0aXZhdGUnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2RlYWN0aXZhdGUnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2ZvY3VzJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidibHVyJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbid1cGRhdGVEYXRhJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidpbml0aWFsaXplZCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nbW92ZU5vZGUnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ2xvYWRDaGlsZHJlbic6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nY2hhbmdlRmlsdGVyJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidldmVudCc6IFt7IHR5cGU6IE91dHB1dCB9LF0sXG4nb25LZXlkb3duJzogW3sgdHlwZTogSG9zdExpc3RlbmVyLCBhcmdzOiBbJ2JvZHk6IGtleWRvd24nLCBbJyRldmVudCddLCBdIH0sXSxcbidvbk1vdXNlZG93bic6IFt7IHR5cGU6IEhvc3RMaXN0ZW5lciwgYXJnczogWydib2R5OiBtb3VzZWRvd24nLCBbJyRldmVudCddLCBdIH0sXSxcbn07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==