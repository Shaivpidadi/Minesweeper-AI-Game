export const extractFeaturesFromEvent = (event) => {
    return [
        event.clientX, event.clientY, // Click position
        event.offsetX, event.offsetY, // Relative position
        event.screenX, event.screenY, // Screen position
        event.pageX, event.pageY,     // Page position
        event.movementX || 0, event.movementY || 0, // Movement before click
        event.pressure || 0,           // Pressure (0 for mouse)
        event.pointerType === "mouse" ? 0 : event.pointerType === "touch" ? 1 : 2, // Pointer type
        event.timeStamp % 100000 // Reduce timestamp size for normalization
    ];
}
