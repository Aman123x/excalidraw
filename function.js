const canvas=document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c= canvas.getContext("2d");

const form=document.querySelector(".form");

const actionButtons = document.querySelectorAll("#actionbuttons>.btn");

const formState ={
    strokewidth:3,
    strokeStyle:"black"
}

function onMouseDown(e){
    previousPosition=[e.clientX,e.clientY];
    c.strokeStyle=drawingColor;
    c.lineWidth=2;
    canvas.addEventListener("mousemove",onMouseMove);
    canvas.addEventListener("mouseup",onMouseUp);
}

function toggleMenu(){
    form.classList.toggle("hide");
}

function onInput(element){
    const newValue=element.value;
    if(element.name==="strokewidth"){
        formState[element.name]=parseInt(newValue);
    }
    else{
        formState[element.name]=newValue;
    }
}

const actions={
    freehand:false,
    rectangle:false,
    eraser:false,
    circle:false,
    line:false
}

function onActionClick(element){
    const actionName=element.id;
    actionButtons.forEach(btn=>{
        if(btn.classList.contains("active") && btn.id !== actionName){
            btn.classList.remove("active");
        }
    })
    element.classList.toggle("active");

    actionButtons.forEach(btn=>{
        const isActive=btn.classList.contains("active");
        actions[btn.id]=isActive;
    })  
}
