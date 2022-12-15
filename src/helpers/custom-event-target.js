class CustomEventTarget extends EventTarget {
    
    handlerReferences = {};

    uid = null;

    static idCounter = 0;

    constructor() {
        super();
    }

    addEventListener( type, handler ) {
        const handlerReference = handler;
        let typeWithoutNamespace = type;

        if ( this.uid === null ) {
            this.uid = CustomEventTarget.idCounter++;
        }

        if ( type.indexOf( '.' ) !== -1 ) {
            const typeArray = type.split( '.' );
            typeWithoutNamespace = typeArray[0];
        }

        this.handlerReferences[ type + '.' + this.uid ] = handlerReference;

        super.addEventListener( typeWithoutNamespace, handlerReference );
    }

    removeEventListener( type ) {
        let typeWithoutNamespace = type;
        const handlerReference = this.handlerReferences[ type + '.' + this.uid ];

        if ( type.indexOf( '.' ) !== -1 ) {
            const typeArray = type.split( '.' );
            typeWithoutNamespace = typeArray[0];
        }

        super.removeEventListener( typeWithoutNamespace, handlerReference );

        delete this.handlerReferences[ type + '.' + this.uid ];
    }

    dispatchEvent( type, data = null, options = null ) {
        const eventOptions = options || {};

        const event = new CustomEvent( type, {
            ...eventOptions,
            detail: data || {}
        });

        super.dispatchEvent( event );
    }

    on( type, handler ) {
        this.addEventListener( type, handler );
    }

    off( type ) {
        this.removeEventListener( type ); 
    }

    trigger( eventObject ) {
        const { type, detail } = eventObject;

        this.dispatchEvent( type, detail );
    }
}

export default CustomEventTarget;