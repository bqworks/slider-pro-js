class AddOnsManager {

    // Reference to the base slider instance
    slider;

    // Stores the add-on classes
    static addOns = [];

    // Stores instances of the add-ons
    addOnsInstances = [];

    activeAddOns = null;

    constructor( slider, activeAddOns = null ) {
        this.slider = slider;
        this.activeAddOns = activeAddOns;
    }

    init() {
        this.slider.addOns = this.slider.addOns || {};

        const addOnsToInstantiate = this.activeAddOns.length === 0 ? AddOnsManager.addOns : this.activeAddOns;

        addOnsToInstantiate.forEach( ( addOn ) => {
            let addOnInstance = new addOn( this.slider );
            this.addOnsInstances.push( addOnInstance );
            this.slider.addOns[ addOn.name ] = addOnInstance;
        });
    }

    static add( addOns ) {
        if ( typeof addOns === 'object' ) {
            AddOnsManager.addOns = [ ...AddOnsManager.addOns, ...addOns ];
        } else if ( typeof addOns === 'function' ) {
            AddOnsManager.addOns.push( addOns );
        }
    }

    destroyAll() {
        this.addOnsInstances.forEach( ( addOn ) => {
            addOn.destroy();
        });
    }
}

export default AddOnsManager;