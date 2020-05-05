let move_used = false

function broadcastRoll(message) {
    for (var i = 0; i < connections.length; i++) {
        connections[i].send(message);
    }
}

function dice_roller(rand) {
    rand = 6

    move_used = false
        // console.log(rand)
        // let multi = localStorage.getItem("Multi") !== null ? JSON.parse(localStorage.getItem("Multi")).multi : []
    if (rand != localStorage.getItem("Previous Roll")) {
        if (rand == 1) {
            document.querySelector(".dice").style.transform = 'rotateY(360deg)'
        } else if (rand == 2) {
            document.querySelector(".dice").style.transform = "rotateY(-90deg)"
        } else if (rand == 3) {
            document.querySelector(".dice").style.transform = "rotateY(180deg)"
        } else if (rand == 4) {
            document.querySelector(".dice").style.transform = "rotateY(90deg)"
        } else if (rand == 5) {
            document.querySelector(".dice").style.transform = "rotateX(-90deg)"
        } else if (rand == 6) {
            document.querySelector(".dice").style.transform = "rotateX(90deg)"
        }
    } else {

        if (rand == 1) {
            document.querySelector(".dice").style.transform = 'rotateX(0deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(360deg)"
            }, 1000);
        } else if (rand == 2) {
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(-90deg)"
            }, 1000);
        } else if (rand == 3) {
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(180deg)"
            }, 1000);
        } else if (rand == 4) {
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(90deg)"
            }, 1000);
        } else if (rand == 5) {
            document.querySelector(".dice").style.transform = 'rotateX(360deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateX(-90deg)"
            }, 1000);
        } else if (rand == 6) {
            document.querySelector(".dice").style.transform = 'rotateX(360deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateX(90deg)"
            }, 1000);
        }
    }
    localStorage.setItem('Previous Roll', rand)
}



// document.querySelectorAll(".out_piece").forEach(e=>{
//     e.addEventListener("click", el=>{

//     })
// })

function mover(e){
    // console.log("appks")
    if (localStorage.getItem("Color") == localStorage.getItem('Turn')) {
        // console.log(localStorage.getItem("Previous Roll"))
        if (localStorage.getItem("Previous Roll") != null) {
            console.log(e.target.parentElement.getAttribute("this-path"))
            if(e.target.parentElement.hasAttribute("this-path")){
                let my_tile = (e.target.parentElement.getAttribute("this-path") | 0)
                let new_tile = (my_tile + (localStorage.getItem("Previous Roll") | 0) )

                let op =getTemplate("out_piece_template")
                op.querySelector("button").classList.add(localStorage.getItem("Color")+"_piece")

                if(new_tile <= 51){
                    document.querySelector("[this-path='"+ new_tile +"']").appendChild(op)
                } else{
                    new_tile = new_tile-51
                    document.querySelector("."+ localStorage.getItem("Color")+"_safe[safe-path='"+ new_tile +"']").appendChild(op)
                }

                e.target.remove()
            }
            e.target.disabled = false
        }
    }
}

function move_other(){

}

function other_out(response){
    let from = response.from
    let to = response.to
    document.querySelectorAll(from)[0].disabled = true
    let op =getTemplate("out_piece_template")
    op.querySelector("button").classList.add(response.color+"_piece")
    document.querySelector("[uni-path='"+ to+"']").appendChild(op)
    // console.log(response)
}