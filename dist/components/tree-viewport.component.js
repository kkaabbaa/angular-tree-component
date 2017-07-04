import { Component, ElementRef, HostListener } from '@angular/core';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { deprecatedSelector } from '../deprecated-selector';
import { TREE_EVENTS } from '../constants/events';
var TreeViewportComponent = (function () {
    function TreeViewportComponent(elementRef, virtualScroll) {
        this.elementRef = elementRef;
        this.virtualScroll = virtualScroll;
        deprecatedSelector('TreeNode', 'tree-node', elementRef);
    }
    TreeViewportComponent.prototype.ngOnInit = function () {
        this.virtualScroll.init();
    };
    TreeViewportComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.setViewport();
            _this.virtualScroll.fireEvent({ eventName: TREE_EVENTS.onInitialized });
        });
    };
    TreeViewportComponent.prototype.ngOnDestroy = function () {
        this.virtualScroll.clear();
    };
    TreeViewportComponent.prototype.onScroll = function (e) {
        this._onWheel(e);
    };
    TreeViewportComponent.prototype.getTotalHeight = function () {
        return this.virtualScroll.isEnabled() && this.virtualScroll.totalHeight + 'px' || 'auto';
    };
    TreeViewportComponent.prototype._onWheel = function (e) {
        this.setViewport();
    };
    TreeViewportComponent.prototype.setViewport = function () {
        this.virtualScroll.setViewport(this.elementRef.nativeElement);
    };
    TreeViewportComponent.decorators = [
        { type: Component, args: [{
                    selector: 'TreeViewport, tree-viewport',
                    styles: [
                        ":host {\n      height: 100%;\n      overflow: auto;\n      display: block;\n    }"
                    ],
                    providers: [TreeVirtualScroll],
                    template: "\n    <ng-container *mobxAutorun>\n      <div [style.height]=\"getTotalHeight()\">\n        <ng-content></ng-content>\n      </div>\n    </ng-container>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeViewportComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: TreeVirtualScroll, },
    ]; };
    TreeViewportComponent.propDecorators = {
        'onScroll': [{ type: HostListener, args: ['scroll', ['$event'],] },],
    };
    return TreeViewportComponent;
}());
export { TreeViewportComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtdmlld3BvcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsVUFBQSxFQUErQixZQUFBLEVBQzNDLE1BQU0sZUFBQSxDQUFnQjtBQUN2QixPQUFPLEVBQUUsaUJBQUEsRUFBa0IsTUFBTyxxQ0FBQSxDQUFzQztBQUN4RSxPQUFPLEVBQUUsa0JBQUEsRUFBbUIsTUFBTyx3QkFBQSxDQUF5QjtBQUM1RCxPQUFPLEVBQUUsV0FBQSxFQUFZLE1BQU8scUJBQUEsQ0FBc0I7QUFHbEQ7SUFDRSwrQkFDVSxVQUFzQixFQUN2QixhQUFnQztRQUQvQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUV2QyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCx3Q0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsK0NBQWUsR0FBZjtRQUFBLGlCQUtDO1FBSkMsVUFBVSxDQUFDO1lBQ1QsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFHRCx3Q0FBUSxHQUFSLFVBQVMsQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELDhDQUFjLEdBQWQ7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDO0lBQzNGLENBQUM7SUFFRCx3Q0FBUSxHQUFSLFVBQVMsQ0FBQztRQUNSLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsMkNBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNJLGdDQUFVLEdBQTBCO1FBQzNDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDeEIsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsTUFBTSxFQUFFO3dCQUNOLG1GQUlFO3FCQUNIO29CQUNELFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUM5QixRQUFRLEVBQUUsOEpBTVQ7aUJBQ0YsRUFBRyxFQUFFO0tBQ0wsQ0FBQztJQUNGLGtCQUFrQjtJQUNYLG9DQUFjLEdBQW1FLGNBQU0sT0FBQTtRQUM5RixFQUFDLElBQUksRUFBRSxVQUFVLEdBQUc7UUFDcEIsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEdBQUc7S0FDMUIsRUFINkYsQ0FHN0YsQ0FBQztJQUNLLG9DQUFjLEdBQTJDO1FBQ2hFLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRyxFQUFFLEVBQUU7S0FDcEUsQ0FBQztJQUNGLDRCQUFDO0NBbkVELEFBbUVDLElBQUE7U0FuRVkscUJBQXFCIiwiZmlsZSI6InRyZWUtdmlld3BvcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgRWxlbWVudFJlZiwgVmlld0VuY2Fwc3VsYXRpb24sIEhvc3RMaXN0ZW5lciwgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0LCBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUcmVlVmlydHVhbFNjcm9sbCB9IGZyb20gJy4uL21vZGVscy90cmVlLXZpcnR1YWwtc2Nyb2xsLm1vZGVsJztcbmltcG9ydCB7IGRlcHJlY2F0ZWRTZWxlY3RvciB9IGZyb20gJy4uL2RlcHJlY2F0ZWQtc2VsZWN0b3InO1xuaW1wb3J0IHsgVFJFRV9FVkVOVFMgfSBmcm9tICcuLi9jb25zdGFudHMvZXZlbnRzJztcblxuXG5leHBvcnQgY2xhc3MgVHJlZVZpZXdwb3J0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHZpcnR1YWxTY3JvbGw6IFRyZWVWaXJ0dWFsU2Nyb2xsKSB7XG5cbiAgICBkZXByZWNhdGVkU2VsZWN0b3IoJ1RyZWVOb2RlJywgJ3RyZWUtbm9kZScsIGVsZW1lbnRSZWYpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsLmluaXQoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0Vmlld3BvcnQoKTtcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbC5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uSW5pdGlhbGl6ZWQgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnZpcnR1YWxTY3JvbGwuY2xlYXIoKTtcbiAgfVxuXG4gIFxuICBvblNjcm9sbChlKSB7XG4gICAgdGhpcy5fb25XaGVlbChlKTtcbiAgfVxuXG4gIGdldFRvdGFsSGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLnZpcnR1YWxTY3JvbGwuaXNFbmFibGVkKCkgJiYgdGhpcy52aXJ0dWFsU2Nyb2xsLnRvdGFsSGVpZ2h0ICsgJ3B4JyB8fCAnYXV0byc7XG4gIH1cblxuICBfb25XaGVlbChlKSB7XG4gICAgdGhpcy5zZXRWaWV3cG9ydCgpO1xuICB9XG5cbiAgc2V0Vmlld3BvcnQoKSB7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsLnNldFZpZXdwb3J0KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICBzZWxlY3RvcjogJ1RyZWVWaWV3cG9ydCwgdHJlZS12aWV3cG9ydCcsXG4gIHN0eWxlczogW1xuICAgIGA6aG9zdCB7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBvdmVyZmxvdzogYXV0bztcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1gXG4gIF0sXG4gIHByb3ZpZGVyczogW1RyZWVWaXJ0dWFsU2Nyb2xsXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICptb2J4QXV0b3J1bj5cbiAgICAgIDxkaXYgW3N0eWxlLmhlaWdodF09XCJnZXRUb3RhbEhlaWdodCgpXCI+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICBgXG59LCBdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5zdGF0aWMgY3RvclBhcmFtZXRlcnM6ICgpID0+ICh7dHlwZTogYW55LCBkZWNvcmF0b3JzPzogRGVjb3JhdG9ySW52b2NhdGlvbltdfXxudWxsKVtdID0gKCkgPT4gW1xue3R5cGU6IEVsZW1lbnRSZWYsIH0sXG57dHlwZTogVHJlZVZpcnR1YWxTY3JvbGwsIH0sXG5dO1xuc3RhdGljIHByb3BEZWNvcmF0b3JzOiB7W2tleTogc3RyaW5nXTogRGVjb3JhdG9ySW52b2NhdGlvbltdfSA9IHtcbidvblNjcm9sbCc6IFt7IHR5cGU6IEhvc3RMaXN0ZW5lciwgYXJnczogWydzY3JvbGwnLCBbJyRldmVudCddLCBdIH0sXSxcbn07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==