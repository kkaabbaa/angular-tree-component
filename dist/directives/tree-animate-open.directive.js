import { Directive, Input, Renderer, TemplateRef, ViewContainerRef } from '@angular/core';
var EASE_ACCELERATION = 1.005;
var TreeAnimateOpenDirective = (function () {
    function TreeAnimateOpenDirective(renderer, templateRef, viewContainerRef) {
        this.renderer = renderer;
        this.templateRef = templateRef;
        this.viewContainerRef = viewContainerRef;
    }
    Object.defineProperty(TreeAnimateOpenDirective.prototype, "isOpen", {
        set: function (value) {
            if (value) {
                this._show();
                if (this.isEnabled && this._isOpen === false) {
                    this._animateOpen();
                }
            }
            else {
                this.isEnabled ? this._animateClose() : this._hide();
            }
            this._isOpen = !!value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    TreeAnimateOpenDirective.prototype._show = function () {
        if (this.innerElement)
            return;
        // create child view
        this.innerElement = this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];
    };
    TreeAnimateOpenDirective.prototype._hide = function () {
        this.viewContainerRef.clear();
        this.innerElement = null;
    };
    TreeAnimateOpenDirective.prototype._animateOpen = function () {
        var _this = this;
        var delta = this.animateSpeed;
        var ease = this.animateAcceleration;
        var maxHeight = 0;
        // set height to 0
        this.renderer.setElementStyle(this.innerElement, 'max-height', "0");
        // increase maxHeight until height doesn't change
        setTimeout(function () {
            var i = setInterval(function () {
                if (!_this._isOpen || !_this.innerElement)
                    return clearInterval(i);
                maxHeight += delta;
                var roundedMaxHeight = Math.round(maxHeight);
                _this.renderer.setElementStyle(_this.innerElement, 'max-height', roundedMaxHeight + "px");
                var height = _this.innerElement.getBoundingClientRect().height; // TBD use renderer
                delta *= ease;
                ease *= EASE_ACCELERATION;
                if (height < roundedMaxHeight) {
                    // Make maxHeight auto because animation finished and container might change height later on
                    _this.renderer.setElementStyle(_this.innerElement, 'max-height', null);
                    clearInterval(i);
                }
            }, 17);
        });
    };
    TreeAnimateOpenDirective.prototype._animateClose = function () {
        var _this = this;
        if (!this.innerElement)
            return;
        var delta = this.animateSpeed;
        var ease = this.animateAcceleration;
        var height = this.innerElement.getBoundingClientRect().height; // TBD use renderer
        // slowly decrease maxHeight to 0, starting from current height
        var i = setInterval(function () {
            if (_this._isOpen || !_this.innerElement)
                return clearInterval(i);
            height -= delta;
            _this.renderer.setElementStyle(_this.innerElement, 'max-height', height + "px");
            delta *= ease;
            ease *= EASE_ACCELERATION;
            if (height <= 0) {
                // after animation complete - remove child element
                _this.viewContainerRef.clear();
                _this.innerElement = null;
                clearInterval(i);
            }
        }, 17);
    };
    TreeAnimateOpenDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[treeAnimateOpen]'
                },] },
    ];
    /** @nocollapse */
    TreeAnimateOpenDirective.ctorParameters = function () { return [
        { type: Renderer, },
        { type: TemplateRef, },
        { type: ViewContainerRef, },
    ]; };
    TreeAnimateOpenDirective.propDecorators = {
        'animateSpeed': [{ type: Input, args: ['treeAnimateOpenSpeed',] },],
        'animateAcceleration': [{ type: Input, args: ['treeAnimateOpenAcceleration',] },],
        'isEnabled': [{ type: Input, args: ['treeAnimateOpenEnabled',] },],
        'isOpen': [{ type: Input, args: ['treeAnimateOpen',] },],
    };
    return TreeAnimateOpenDirective;
}());
export { TreeAnimateOpenDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9kaXJlY3RpdmVzL3RyZWUtYW5pbWF0ZS1vcGVuLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUFFLEtBQUEsRUFBcUIsUUFBQSxFQUN2QixXQUFBLEVBQWEsZ0JBQUEsRUFDdkIsTUFBTSxlQUFBLENBQWdCO0FBRXZCLElBQU0saUJBQUEsR0FBb0IsS0FBQSxDQUFNO0FBR2hDO0lBc0JFLGtDQUNVLFFBQWtCLEVBQ2xCLFdBQTZCLEVBQzdCLGdCQUFrQztRQUZsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM3QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO0lBQUcsQ0FBQztJQWpCaEQsc0JBQUksNENBQU07YUFBVixVQUFXLEtBQWM7WUFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkQsQ0FBQztZQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFTTSx3Q0FBSyxHQUFiO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUU5QixvQkFBb0I7UUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJ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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsIElucHV0LCBIb3N0TGlzdGVuZXIsIFJlbmRlcmVyLCBFbGVtZW50UmVmLFxuICBEb0NoZWNrLCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgRUFTRV9BQ0NFTEVSQVRJT04gPSAxLjAwNTtcblxuXG5leHBvcnQgY2xhc3MgVHJlZUFuaW1hdGVPcGVuRGlyZWN0aXZlIHtcbiAgcHJpdmF0ZSBfaXNPcGVuOiBib29sZWFuO1xuXG4gICBhbmltYXRlU3BlZWQ6IG51bWJlcjtcbiAgIGFuaW1hdGVBY2NlbGVyYXRpb246IG51bWJlcjtcbiAgIGlzRW5hYmxlZDogYm9vbGVhbjtcblxuICBcbiAgc2V0IGlzT3Blbih2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fc2hvdygpO1xuICAgICAgaWYgKHRoaXMuaXNFbmFibGVkICYmIHRoaXMuX2lzT3BlbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fYW5pbWF0ZU9wZW4oKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pc0VuYWJsZWQgPyB0aGlzLl9hbmltYXRlQ2xvc2UoKSA6IHRoaXMuX2hpZGUoKTtcbiAgICB9XG4gICAgdGhpcy5faXNPcGVuID0gISF2YWx1ZTtcbiAgfTtcblxuICBwcml2YXRlIGlubmVyRWxlbWVudDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyLFxuICAgIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7fVxuXG4gIHByaXZhdGUgX3Nob3coKSB7XG4gICAgaWYgKHRoaXMuaW5uZXJFbGVtZW50KSByZXR1cm47XG5cbiAgICAvLyBjcmVhdGUgY2hpbGQgdmlld1xuICAgIHRoaXMuaW5uZXJFbGVtZW50ID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKS5yb290Tm9kZXNbMF07XG4gIH1cblxuICBwcml2YXRlIF9oaWRlKCkge1xuICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuICAgIHRoaXMuaW5uZXJFbGVtZW50ID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2FuaW1hdGVPcGVuKCkge1xuICAgIGxldCBkZWx0YSA9IHRoaXMuYW5pbWF0ZVNwZWVkO1xuICAgIGxldCBlYXNlID0gdGhpcy5hbmltYXRlQWNjZWxlcmF0aW9uO1xuICAgIGxldCBtYXhIZWlnaHQgPSAwO1xuXG4gICAgLy8gc2V0IGhlaWdodCB0byAwXG4gICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5pbm5lckVsZW1lbnQsICdtYXgtaGVpZ2h0JywgYDBgKTtcblxuICAgIC8vIGluY3JlYXNlIG1heEhlaWdodCB1bnRpbCBoZWlnaHQgZG9lc24ndCBjaGFuZ2VcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgLy8gQWxsb3cgaW5uZXIgZWxlbWVudCB0byBjcmVhdGUgaXRzIGNvbnRlbnRcbiAgICAgIGNvbnN0IGkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5faXNPcGVuIHx8ICF0aGlzLmlubmVyRWxlbWVudCkgcmV0dXJuIGNsZWFySW50ZXJ2YWwoaSk7XG5cbiAgICAgICAgbWF4SGVpZ2h0ICs9IGRlbHRhO1xuICAgICAgICBjb25zdCByb3VuZGVkTWF4SGVpZ2h0ID0gTWF0aC5yb3VuZChtYXhIZWlnaHQpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuaW5uZXJFbGVtZW50LCAnbWF4LWhlaWdodCcsIGAke3JvdW5kZWRNYXhIZWlnaHR9cHhgKTtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5pbm5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0OyAvLyBUQkQgdXNlIHJlbmRlcmVyXG5cbiAgICAgICAgZGVsdGEgKj0gZWFzZTtcbiAgICAgICAgZWFzZSAqPSBFQVNFX0FDQ0VMRVJBVElPTjtcbiAgICAgICAgaWYgKGhlaWdodCA8IHJvdW5kZWRNYXhIZWlnaHQpIHtcbiAgICAgICAgICAvLyBNYWtlIG1heEhlaWdodCBhdXRvIGJlY2F1c2UgYW5pbWF0aW9uIGZpbmlzaGVkIGFuZCBjb250YWluZXIgbWlnaHQgY2hhbmdlIGhlaWdodCBsYXRlciBvblxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuaW5uZXJFbGVtZW50LCAnbWF4LWhlaWdodCcsIG51bGwpO1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDE3KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2FuaW1hdGVDbG9zZSgpIHtcbiAgICBpZiAoIXRoaXMuaW5uZXJFbGVtZW50KSByZXR1cm47XG5cbiAgICBsZXQgZGVsdGEgPSB0aGlzLmFuaW1hdGVTcGVlZDtcbiAgICBsZXQgZWFzZSA9IHRoaXMuYW5pbWF0ZUFjY2VsZXJhdGlvbjtcbiAgICBsZXQgaGVpZ2h0ID0gdGhpcy5pbm5lckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0OyAvLyBUQkQgdXNlIHJlbmRlcmVyXG5cbiAgICAvLyBzbG93bHkgZGVjcmVhc2UgbWF4SGVpZ2h0IHRvIDAsIHN0YXJ0aW5nIGZyb20gY3VycmVudCBoZWlnaHRcbiAgICBjb25zdCBpID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2lzT3BlbiB8fCAhdGhpcy5pbm5lckVsZW1lbnQpIHJldHVybiBjbGVhckludGVydmFsKGkpO1xuXG4gICAgICBoZWlnaHQgLT0gZGVsdGE7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLmlubmVyRWxlbWVudCwgJ21heC1oZWlnaHQnLCBgJHtoZWlnaHR9cHhgKTtcbiAgICAgIGRlbHRhICo9IGVhc2U7XG4gICAgICBlYXNlICo9IEVBU0VfQUNDRUxFUkFUSU9OO1xuXG4gICAgICBpZiAoaGVpZ2h0IDw9IDApIHtcbiAgICAgICAgLy8gYWZ0ZXIgYW5pbWF0aW9uIGNvbXBsZXRlIC0gcmVtb3ZlIGNoaWxkIGVsZW1lbnRcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuaW5uZXJFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgIH1cbiAgICB9LCAxNyk7XG4gIH1cbnN0YXRpYyBkZWNvcmF0b3JzOiBEZWNvcmF0b3JJbnZvY2F0aW9uW10gPSBbXG57IHR5cGU6IERpcmVjdGl2ZSwgYXJnczogW3tcbiAgc2VsZWN0b3I6ICdbdHJlZUFuaW1hdGVPcGVuXSdcbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKCkgPT4gKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSAoKSA9PiBbXG57dHlwZTogUmVuZGVyZXIsIH0sXG57dHlwZTogVGVtcGxhdGVSZWYsIH0sXG57dHlwZTogVmlld0NvbnRhaW5lclJlZiwgfSxcbl07XG5zdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBEZWNvcmF0b3JJbnZvY2F0aW9uW119ID0ge1xuJ2FuaW1hdGVTcGVlZCc6IFt7IHR5cGU6IElucHV0LCBhcmdzOiBbJ3RyZWVBbmltYXRlT3BlblNwZWVkJywgXSB9LF0sXG4nYW5pbWF0ZUFjY2VsZXJhdGlvbic6IFt7IHR5cGU6IElucHV0LCBhcmdzOiBbJ3RyZWVBbmltYXRlT3BlbkFjY2VsZXJhdGlvbicsIF0gfSxdLFxuJ2lzRW5hYmxlZCc6IFt7IHR5cGU6IElucHV0LCBhcmdzOiBbJ3RyZWVBbmltYXRlT3BlbkVuYWJsZWQnLCBdIH0sXSxcbidpc09wZW4nOiBbeyB0eXBlOiBJbnB1dCwgYXJnczogWyd0cmVlQW5pbWF0ZU9wZW4nLCBdIH0sXSxcbn07XG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==