function broadcastRoll(message){
    for(var i=0;i<connections.length;i++){
        connections[i].send(message);
    }
}

function dice_roller(rand){
    // rand = 5
    // console.log(rand)
    if(rand != localStorage.getItem("Previous Roll")){
        if( rand == 1){
            document.querySelector(".dice").style.transform = 'rotateY(360deg)'
        } else if(rand == 2){
            document.querySelector(".dice").style.transform =  "rotateY(-90deg)"
        } else if(rand == 3){
            document.querySelector(".dice").style.transform =  "rotateY(180deg)"
        } else if(rand == 4){
            document.querySelector(".dice").style.transform =  "rotateY(90deg)"
        } else if(rand == 5){
            document.querySelector(".dice").style.transform = "rotateX(-90deg)"
        } else if(rand == 6){
            document.querySelector(".dice").style.transform = "rotateX(90deg)"
        }
    } else {
       
        if( rand == 1){
            document.querySelector(".dice").style.transform = 'rotateX(0deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(360deg)"
            }, 1000);
        } else if(rand == 2){
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(-90deg)"
            }, 1000);
        } else if(rand == 3){
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            // document.querySelector(".dice").style.transform =  "rotateY(-180deg)"
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(180deg)"
            }, 1000);
        } else if(rand == 4){
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            // document.querySelector(".dice").style.transform =  "rotateY(-90deg)"
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(90deg)"
            }, 1000);
        } else if(rand == 5){
            document.querySelector(".dice").style.transform = 'rotateX(360deg)'
            // document.querySelector(".dice").style.transform = "rotateX(90deg)"
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateX(-90deg)"
            }, 1000);
        } else if(rand == 6){
            document.querySelector(".dice").style.transform = 'rotateX(360deg)'
            // document.querySelector(".dice").style.transform = "rotateX(-90deg)"
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateX(90deg)"
            }, 1000);
        }

    }

    localStorage.setItem('Previous Roll', rand)
}