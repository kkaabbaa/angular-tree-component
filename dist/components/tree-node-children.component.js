import { Component, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import { deprecatedSelector } from '../deprecated-selector';
var TreeNodeChildrenComponent = (function () {
    function TreeNodeChildrenComponent(elementRef) {
        this.elementRef = elementRef;
        deprecatedSelector('TreeNodeChildren', 'tree-node-children', elementRef);
    }
    TreeNodeChildrenComponent.decorators = [
        { type: Component, args: [{
                    selector: 'TreeNodeChildren, tree-node-children',
                    encapsulation: ViewEncapsulation.None,
                    styles: [
                        '.tree-children.tree-children-no-padding { padding-left: 0 }',
                        '.tree-children { padding-left: 20px; overflow: hidden }'
                    ],
                    template: "\n    <ng-container *mobxAutorun>\n      <div [class.tree-children]=\"true\"\n          [class.tree-children-no-padding]=\"node.options.levelPadding\"\n          *treeAnimateOpen=\"\n            node.isExpanded;\n            speed:node.options.animateExpand;\n            acceleration:node.options.animateAcceleration;\n            enabled:node.options.animateExpand\">\n        <tree-node-collection\n          *ngIf=\"node.children\"\n          [nodes]=\"node.children\"\n          [templates]=\"templates\"\n          [treeModel]=\"node.treeModel\">\n        </tree-node-collection>\n        <tree-loading-component\n          [style.padding-left]=\"node.getNodePadding()\"\n          class=\"tree-node-loading\"\n          *ngIf=\"!node.children\"\n          [template]=\"templates.loadingTemplate\"\n          [node]=\"node\"\n        ></tree-loading-component>\n      </div>\n    </ng-container>\n  "
                },] },
    ];
    /** @nocollapse */
    TreeNodeChildrenComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    TreeNodeChildrenComponent.propDecorators = {
        'node': [{ type: Input },],
        'templates': [{ type: Input },],
    };
    return TreeNodeChildrenComponent;
}());
export { TreeNodeChildrenComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS1jaGlsZHJlbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxLQUFBLEVBQU8saUJBQUEsRUFBbUIsVUFBQSxFQUFXLE1BQU8sZUFBQSxDQUFnQjtBQUVoRixPQUFPLEVBQUUsa0JBQUEsRUFBbUIsTUFBTyx3QkFBQSxDQUF5QjtBQUc1RDtJQUlFLG1DQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3hDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDSSxvQ0FBVSxHQUEwQjtRQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3hCLFFBQVEsRUFBRSxzQ0FBc0M7b0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxNQUFNLEVBQUU7d0JBQ04sNkRBQTZEO3dCQUM3RCx5REFBeUQ7cUJBQzFEO29CQUNELFFBQVEsRUFBRSwyNEJBd0JUO2lCQUNGLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCx3Q0FBYyxHQUFtRSxjQUFNLE9BQUE7UUFDOUYsRUFBQyxJQUFJLEVBQUUsVUFBVSxHQUFHO0tBQ25CLEVBRjZGLENBRTdGLENBQUM7SUFDSyx3Q0FBYyxHQUEyQztRQUNoRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMxQixXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtLQUM5QixDQUFDO0lBQ0YsZ0NBQUM7Q0FsREQsQUFrREMsSUFBQTtTQWxEWSx5QkFBeUIiLCJmaWxlIjoidHJlZS1ub2RlLWNoaWxkcmVuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS1ub2RlLm1vZGVsJztcbmltcG9ydCB7IGRlcHJlY2F0ZWRTZWxlY3RvciB9IGZyb20gJy4uL2RlcHJlY2F0ZWQtc2VsZWN0b3InO1xuXG5cbmV4cG9ydCBjbGFzcyBUcmVlTm9kZUNoaWxkcmVuQ29tcG9uZW50IHtcbiAgIG5vZGU6IFRyZWVOb2RlO1xuICAgdGVtcGxhdGVzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgZGVwcmVjYXRlZFNlbGVjdG9yKCdUcmVlTm9kZUNoaWxkcmVuJywgJ3RyZWUtbm9kZS1jaGlsZHJlbicsIGVsZW1lbnRSZWYpO1xuICB9XG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gIHNlbGVjdG9yOiAnVHJlZU5vZGVDaGlsZHJlbiwgdHJlZS1ub2RlLWNoaWxkcmVuJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc3R5bGVzOiBbXG4gICAgJy50cmVlLWNoaWxkcmVuLnRyZWUtY2hpbGRyZW4tbm8tcGFkZGluZyB7IHBhZGRpbmctbGVmdDogMCB9JyxcbiAgICAnLnRyZWUtY2hpbGRyZW4geyBwYWRkaW5nLWxlZnQ6IDIwcHg7IG92ZXJmbG93OiBoaWRkZW4gfSdcbiAgXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICptb2J4QXV0b3J1bj5cbiAgICAgIDxkaXYgW2NsYXNzLnRyZWUtY2hpbGRyZW5dPVwidHJ1ZVwiXG4gICAgICAgICAgW2NsYXNzLnRyZWUtY2hpbGRyZW4tbm8tcGFkZGluZ109XCJub2RlLm9wdGlvbnMubGV2ZWxQYWRkaW5nXCJcbiAgICAgICAgICAqdHJlZUFuaW1hdGVPcGVuPVwiXG4gICAgICAgICAgICBub2RlLmlzRXhwYW5kZWQ7XG4gICAgICAgICAgICBzcGVlZDpub2RlLm9wdGlvbnMuYW5pbWF0ZUV4cGFuZDtcbiAgICAgICAgICAgIGFjY2VsZXJhdGlvbjpub2RlLm9wdGlvbnMuYW5pbWF0ZUFjY2VsZXJhdGlvbjtcbiAgICAgICAgICAgIGVuYWJsZWQ6bm9kZS5vcHRpb25zLmFuaW1hdGVFeHBhbmRcIj5cbiAgICAgICAgPHRyZWUtbm9kZS1jb2xsZWN0aW9uXG4gICAgICAgICAgKm5nSWY9XCJub2RlLmNoaWxkcmVuXCJcbiAgICAgICAgICBbbm9kZXNdPVwibm9kZS5jaGlsZHJlblwiXG4gICAgICAgICAgW3RlbXBsYXRlc109XCJ0ZW1wbGF0ZXNcIlxuICAgICAgICAgIFt0cmVlTW9kZWxdPVwibm9kZS50cmVlTW9kZWxcIj5cbiAgICAgICAgPC90cmVlLW5vZGUtY29sbGVjdGlvbj5cbiAgICAgICAgPHRyZWUtbG9hZGluZy1jb21wb25lbnRcbiAgICAgICAgICBbc3R5bGUucGFkZGluZy1sZWZ0XT1cIm5vZGUuZ2V0Tm9kZVBhZGRpbmcoKVwiXG4gICAgICAgICAgY2xhc3M9XCJ0cmVlLW5vZGUtbG9hZGluZ1wiXG4gICAgICAgICAgKm5nSWY9XCIhbm9kZS5jaGlsZHJlblwiXG4gICAgICAgICAgW3RlbXBsYXRlXT1cInRlbXBsYXRlcy5sb2FkaW5nVGVtcGxhdGVcIlxuICAgICAgICAgIFtub2RlXT1cIm5vZGVcIlxuICAgICAgICA+PC90cmVlLWxvYWRpbmctY29tcG9uZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGBcbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKCkgPT4gKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSAoKSA9PiBbXG57dHlwZTogRWxlbWVudFJlZiwgfSxcbl07XG5zdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBEZWNvcmF0b3JJbnZvY2F0aW9uW119ID0ge1xuJ25vZGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4ndGVtcGxhdGVzJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19