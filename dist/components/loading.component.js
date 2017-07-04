import { Component, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import { deprecatedSelector } from '../deprecated-selector';
var LoadingComponent = (function () {
    function LoadingComponent(elementRef) {
        this.elementRef = elementRef;
        deprecatedSelector('LoadingComponent', 'tree-loading-component', elementRef);
    }
    return LoadingComponent;
}());
export { LoadingComponent };
LoadingComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                selector: 'LoadingComponent, tree-loading-component',
                template: "\n    <span *ngIf=\"!template\">loading...</span>\n    <ng-container\n      [ngTemplateOutlet]=\"template\"\n      [ngOutletContext]=\"{ $implicit: node }\">\n    </ng-container>\n  ",
            },] },
];
/** @nocollapse */
LoadingComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
LoadingComponent.propDecorators = {
    'template': [{ type: Input },],
    'node': [{ type: Input },],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL2xvYWRpbmcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFBLEVBQVcsS0FBQSxFQUFvQixVQUFBLEVBQVksaUJBQUEsRUFBa0IsTUFBTyxlQUFBLENBQWdCO0FBRTdGLE9BQU8sRUFBRSxrQkFBQSxFQUFtQixNQUFPLHdCQUFBLENBQXlCO0FBRzVEO0lBSUUsMEJBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDeEMsa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsd0JBQXdCLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQXNCSCx1QkFBQztBQUFELENBNUJBLEFBNEJDOztBQXJCTSwyQkFBVSxHQUEwQjtJQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUUsMENBQTBDO2dCQUNwRCxRQUFRLEVBQUUsd0xBTVQ7YUFDRixFQUFHLEVBQUU7Q0FDTCxDQUFDO0FBQ0Ysa0JBQWtCO0FBQ1gsK0JBQWMsR0FBbUUsY0FBTSxPQUFBO0lBQzlGLEVBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRztDQUNuQixFQUY2RixDQUU3RixDQUFDO0FBQ0ssK0JBQWMsR0FBMkM7SUFDaEUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDOUIsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Q0FDekIsQ0FBQyIsImZpbGUiOiJsb2FkaW5nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBUZW1wbGF0ZVJlZiwgRWxlbWVudFJlZiwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUtbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBkZXByZWNhdGVkU2VsZWN0b3IgfSBmcm9tICcuLi9kZXByZWNhdGVkLXNlbGVjdG9yJztcblxuXG5leHBvcnQgY2xhc3MgTG9hZGluZ0NvbXBvbmVudCB7XG4gICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgIG5vZGU6IFRyZWVOb2RlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIGRlcHJlY2F0ZWRTZWxlY3RvcignTG9hZGluZ0NvbXBvbmVudCcsICd0cmVlLWxvYWRpbmctY29tcG9uZW50JywgZWxlbWVudFJlZik7XG4gIH1cbnN0YXRpYyBkZWNvcmF0b3JzOiBEZWNvcmF0b3JJbnZvY2F0aW9uW10gPSBbXG57IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICdMb2FkaW5nQ29tcG9uZW50LCB0cmVlLWxvYWRpbmctY29tcG9uZW50JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiAqbmdJZj1cIiF0ZW1wbGF0ZVwiPmxvYWRpbmcuLi48L3NwYW4+XG4gICAgPG5nLWNvbnRhaW5lclxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVcIlxuICAgICAgW25nT3V0bGV0Q29udGV4dF09XCJ7ICRpbXBsaWNpdDogbm9kZSB9XCI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGAsXG59LCBdIH0sXG5dO1xuLyoqIEBub2NvbGxhcHNlICovXG5zdGF0aWMgY3RvclBhcmFtZXRlcnM6ICgpID0+ICh7dHlwZTogYW55LCBkZWNvcmF0b3JzPzogRGVjb3JhdG9ySW52b2NhdGlvbltdfXxudWxsKVtdID0gKCkgPT4gW1xue3R5cGU6IEVsZW1lbnRSZWYsIH0sXG5dO1xuc3RhdGljIHByb3BEZWNvcmF0b3JzOiB7W2tleTogc3RyaW5nXTogRGVjb3JhdG9ySW52b2NhdGlvbltdfSA9IHtcbid0ZW1wbGF0ZSc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidub2RlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19