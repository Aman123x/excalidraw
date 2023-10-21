const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearCanvas');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');

let drawing = false;
let actions = [];
let currentAction = -1;

// Set up drawing styles
ctx.strokeStyle = '#000'; // Initial stroke color
ctx.lineWidth = 2; // Initial line width
ctx.lineCap = 'round';

// Get the canvas offset position
const canvasOffsetX = canvas.getBoundingClientRect().left;
const canvasOffsetY = canvas.getBoundingClientRect().top;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    actions.splice(currentAction + 1);
    currentAction++;
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.closePath();
    saveAction();
});

canvas.addEventListener('mouseout', () => {
    if (drawing) {
        drawing = false;
        ctx.closePath();
        saveAction();
    }
});

// Function to change the stroke color
function changeStrokeColor(color) {
    ctx.strokeStyle = color;
}

// Function to change the line width
function changeLineWidth(width) {
    ctx.lineWidth = width;
}

// Save the current drawing action
function saveAction() {
    if (currentAction < actions.length - 1) {
        actions.splice(currentAction + 1);
    }
    actions.push(canvas.toDataURL());
    currentAction++;
}

// Undo the last drawing action
undoButton.addEventListener('click', () => {
    if (currentAction > 0) {
        currentAction--;
        const image = new Image();
        image.src = actions[currentAction];
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        };
    }
});

// Redo the last undone drawing action
redoButton.addEventListener('click', () => {
    if (currentAction < actions.length - 1) {
        currentAction++;
        const image = new Image();
        image.src = actions[currentAction];
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        };
    }
});

// Clear the canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    actions = [];
    currentAction = -1;
});
