
let intialPosition=null;

const history=[];
let historyIndex=-1;

//=================================

const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

const canvasStates = [];
let currentStateIndex = -1;

function pushCanvasState() {
  if (currentStateIndex < canvasStates.length - 1) {
    canvasStates.splice(currentStateIndex + 1);
  }
  canvasStates.push(canvas.toDataURL());
  currentStateIndex = canvasStates.length - 1;
}

function undo() {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    restoreCanvasState();
  }
}

function redo() {
  if (currentStateIndex < canvasStates.length - 1) {
    currentStateIndex++;
    restoreCanvasState();
  }
}

function restoreCanvasState() {
  const img = new Image();
  img.src = canvasStates[currentStateIndex];
  img.onload = function () {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(img, 0, 0);
  }
}

//================================

const clearButton = document.getElementById("clear");

clearButton.addEventListener("click", clearCanvas);

function clearCanvas() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  canvasStates.length = 0; // Clear the canvasStates array
  currentStateIndex = -1; // Reset the currentStateIndex
}

//==================================

function onMouseDown(e){
    if(!(actions.circle || actions.rectangle || actions.eraser || actions.freehand || actions.line)){
        return;
    }
    
    intialPosition={x:e.clientX,y:e.clientY};
    startIndex=history.length-1;
    c.beginPath();
    c.strokeStyle=formState.strokestyle;
    c.lineWidth=formState.strokewidth;

    canvas.addEventListener("mousemove",onMouseMove);
    canvas.addEventListener("mouseup",onMouseUp);
    pushCanvasState();
}

function onMouseMove(e){
    const currentPosition={x:e.clientX,y:e.clientY};
    if(actions.freehand){
        drawFreeHand(currentPosition);
    }
    else if(actions.eraser){
        handleErase(currentPosition);
    }
    else if(actions.circle){
        drawCircle(currentPosition);
    }
    else if(actions.rectangle){
        drawRectangle(currentPosition);
    }
    else if(actions.line){
        drawLine(currentPosition);
    }
}

function onMouseUp(){
    history.push(c.getImageData(0,0,canvas.width,canvas.height));
    historyIndex++;
    canvas.removeEventListener("mousemove",onMouseMove);
    canvas.removeEventListener("mouseup",onMouseUp);
}

canvas.addEventListener("mousedown",onMouseDown);

function drawFreeHand(currentPosition){
    c.beginPath();
    c.moveTo(intialPosition.x,intialPosition.y);
    c.lineTo(currentPosition.x,currentPosition.y);
    c.lineCap="round";
    c.lineJoin="round"; 
    c.stroke();
    c.closePath();
    intialPosition=currentPosition;
}

function handleErase(currentPosition){
    c.clearRect(currentPosition.x,currentPosition.y,20,20);
}

function drawCircle(currentPosition){
    if(startIndex!==-1){
        c.putImageData(history[startIndex],0,0);
    }
    else{
        c.clearRect(0,0,canvas.width,canvas.height);
    }

    if(startIndex!==history.length-1){
        history.pop();
    }

    c.beginPath();

    const radius= Math.sqrt((currentPosition.x-intialPosition.x)**2+(currentPosition.y-intialPosition.y)**2);

    c.arc(intialPosition.x,intialPosition.y,radius,0,2*Math.PI,true);

    c.stroke();
    // history.push(c.getImageData(0,0,canvas.width,canvas.height));
}

function drawRectangle(currentPosition){
    if(startIndex!==-1){
        c.putImageData(history[startIndex],0,0);
    }
    else{
        c.clearRect(0,0,canvas.width,canvas.height);
    }

    c.beginPath();
    let width=currentPosition.x-intialPosition.x;
    let height=currentPosition.y-intialPosition.y;
    c.strokeRect(intialPosition.x,intialPosition.y,width,height);
}

function drawLine(currentPosition){
    if(startIndex!==-1){
        c.putImageData(history[startIndex],0,0);
    }
    else{
        c.clearRect(0,0,canvas.width,canvas.height);
    }
    c.beginPath();
    c.moveTo(intialPosition.x,intialPosition.y);
    c.lineTo(currentPosition.x,currentPosition.y);
    c.stroke();
}