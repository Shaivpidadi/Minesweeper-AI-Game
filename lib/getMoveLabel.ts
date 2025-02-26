// function getMoveLabel(event) {
//     const gridSize = 5;  // Example: 10x10 grid
//     const cellWidth = gameGrid.clientWidth / gridSize;
//     const cellHeight = gameGrid.clientHeight / gridSize;

//     // Compute row & column
//     const col = Math.floor(event.offsetX / cellWidth);
//     const row = Math.floor(event.offsetY / cellHeight);

//     // Convert (row, col) to a 1D index (if using a flat array)
//     return row * gridSize + col;  // Returns a number between 0 and (gridSize * gridSize - 1)
// }



export const getMoveLabel = (event) => {
    console.log(event)
    if (event.target && event.target.dataset.index) {
        return parseInt(event.target.dataset.index, 10); // Use the button's index as the label
    }

    // Fallback: Convert (x, y) position into a label
    return `${event.clientX}-${event.clientY}`; // Less structured, but useful
}