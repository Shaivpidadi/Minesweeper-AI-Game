export const getMoveLabel = (event) => {
    let targetElement = event.target;

    while (targetElement && !targetElement.dataset.index) {
        targetElement = targetElement.parentElement;
    }

    if (targetElement && targetElement.dataset.index) {
        const tileIndex = parseInt(targetElement.dataset.index, 10);
        if (!isNaN(tileIndex) && tileIndex >= 0 && tileIndex < 25) {
            return tileIndex;
        }
    }

    console.warn("Could not determine tile index from event:", event);
    return 0;
};
