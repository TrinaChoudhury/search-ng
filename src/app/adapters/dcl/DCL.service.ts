import {
    ViewContainerRef, ComponentFactoryResolver, ComponentRef,
    ComponentFactory, Injectable
} from '@angular/core';

/**
 * Dynamic component loader to render the components dynamically.
 *
 * @export
 * @class DCL
 */
@Injectable()
export class DCL {
    /**
     * @param {ComponentFactoryResolver}
     * @memberOf DCL
     */
    constructor(public factoryResolver: ComponentFactoryResolver) {}

    /**
     * Loads the component in a particular viewRef.
     *
     * @param {ViewContainerRef} viewRef
     * @param {string} selector
     *
     * @memberOf DCL
     */
    public load(viewRef: ViewContainerRef, selector: string,
        inputs: {[key: string] : string} = {}): ComponentRef<any> {

        let compRef: ComponentRef<any>,
            componentFactory: ComponentFactory<any>;

        componentFactory = this.getComponentFactory(selector);

        compRef = viewRef.createComponent(componentFactory);
        compRef.changeDetectorRef.detectChanges();

        Object.keys(inputs).forEach((key) => {
            compRef.instance[key] = inputs[key];
        });

        return compRef;
    }

    /**
     * Returns component factory for the component whose selector is passed
     * @param  {string} componentSelector       selector for Component
     * @return {ComponentFactory<T>}
     */
    public getComponentFactory(componentSelector: string): ComponentFactory<any>{
        return Array.from<ComponentFactory<any>>(this.factoryResolver['_factories'].values())
            .find((x: ComponentFactory<any>) => {
                return x.selector === componentSelector;
            });
    }
}
