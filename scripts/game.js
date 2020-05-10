let move_used = false

function broadcastRoll(message) {
    for (var i = 0; i < connections.length; i++) {
        connections[i].send(message);
    }
}

function dice_roller(rand) {
    // rand = 6

    move_used = false
        // console.log(rand)
        // let multi = localStorage.getItem("Multi") !== null ? JSON.parse(localStorage.getItem("Multi")).multi : []
        ani_randomer(rand)
    if (rand != localStorage.getItem("Last Roll")) {
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
            }, 1100);
        } else if (rand == 2) {
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(-90deg)"
            }, 1100);
        } else if (rand == 3) {
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(180deg)"
            }, 1100);
        } else if (rand == 4) {
            document.querySelector(".dice").style.transform = 'rotateX(450deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateY(90deg)"
            }, 1100);
        } else if (rand == 5) {
            document.querySelector(".dice").style.transform = 'rotateX(360deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateX(-90deg)"
            }, 1100);
        } else if (rand == 6) {
            document.querySelector(".dice").style.transform = 'rotateX(360deg)'
            setTimeout(() => {
                document.querySelector(".dice").style.transform = "rotateX(90deg)"
            }, 1100);
        }
    }
    localStorage.setItem('Previous Roll', rand)
    localStorage.setItem('Last Roll', rand)
}


function mover(e) {

    if (localStorage.getItem("Color") == localStorage.getItem('Turn')) {
        if (localStorage.getItem("Previous Roll") != null) {

            let send_others = {
                'type': "move other",
                'from': "",
                'to': "",
                'completion': false,
                'color': localStorage.getItem("Color"),
                'safe': false,
                'safest': false
            }

            if (e.target.parentElement.hasAttribute("this-path")) {
                let my_tile = (e.target.parentElement.getAttribute("this-path") | 0)
                let new_tile = (my_tile + (localStorage.getItem("Previous Roll") | 0))

                if (new_tile <= 51) {

                    ani_remover(e.target)
                    document.querySelector("[this-path='" + new_tile + "']").appendChild(out_piece_fun(localStorage.getItem("Color")))
                    localStorage.removeItem("Previous Roll")
                    send_others.from = document.querySelector("[this-path='" + my_tile + "']").getAttribute("uni-path")
                    send_others.to = document.querySelector("[this-path='" + new_tile + "']").getAttribute("uni-path")
                    broadcastRoll(JSON.stringify(send_others))
                    document.querySelector(".current-moves>h1").innerHTML = "No Moves"
                } else {

                    new_tile = new_tile - 51
                    if (new_tile == 6) {
                        send_others.from = document.querySelector("[this-path='" + my_tile + "']").getAttribute("uni-path")
                        completion(new_tile, e, my_tile, send_others, false, false)
                    } else {
                        completion(new_tile, e, my_tile, send_others, true, false)
                    }

                }

            } else if (e.target.parentElement.hasAttribute("safe-path")) {
                let my_tile = (e.target.parentElement.getAttribute("safe-path") | 0)
                let new_tile = (my_tile + (localStorage.getItem("Previous Roll") | 0))
                completion(new_tile, e, my_tile, send_others, true, true)
            }

            // if(localStorage.getItem("Previous Roll") == 6){
            document.querySelector(".roll>button").disabled = false
            e.target.disabled = false
        }
    }
}



function completion(new_tile, e, my_tile, send, safe, safest) {

    if (safe) {
        send.safe = safe
        send.from = document.querySelector("[this-path='" + my_tile + "']").getAttribute("uni-path")
        send.to = new_tile
        if (safest) {
            send.safest = safest
            send.from = my_tile
        }
    }

    if (new_tile == 6) {
        ani_remover(e.target)
        localStorage.removeItem("Previous Roll")
        send.completion = true
        document.querySelector(".current-moves>h1").innerHTML = "No Moves"
    } else if (new_tile < 6) {
        ani_remover(e.target)
        document.querySelector("." + localStorage.getItem("Color") + "_safe[safe-path='" + new_tile + "']").appendChild(out_piece_fun(localStorage.getItem("Color")))
        localStorage.removeItem("Previous Roll")
        document.querySelector(".current-moves>h1").innerHTML = "No Moves"
    } else if (new_tile > 6) {

    }
    broadcastRoll(JSON.stringify(send))
}


function move_other(response) {
    let cur_tile = response.from
    let next_tile = response.to
    let color = response.color
    if (response.completion) {
        console.log(response)
        if (!response.safe) {
            ani_remover(document.querySelector("[uni-path='" + cur_tile + "']>." + color + "_piece"))
        } else {
            ani_remover(document.querySelector("[safe-path='" + cur_tile + "']>." + color + "_piece"))
        }

    } else {
        if (response.safe) {
            if (next_tile < 6) {
                if (response.safest) {
                    ani_remover(document.querySelector("[safe-path='" + cur_tile + "']." + color + "_safe >." + color + "_piece"))
                } else {
                    ani_remover(document.querySelector("[uni-path='" + cur_tile + "'] >." + color + "_piece"))
                }
                document.querySelector("[safe-path='" + next_tile + "']." + color + "_safe ").appendChild(out_piece_fun(color))
            }

        } else {
            document.querySelector("[uni-path='" + next_tile + "']").appendChild(out_piece_fun(color))
            ani_remover(document.querySelector("[uni-path='" + cur_tile + "'] > ." + color + "_piece"))
        }

    }
}

function ani_randomer( val ){
    let iid = setInterval(() => {
        document.querySelector(".current-moves>h1").innerHTML = Math.floor(Math.random() * (6)+1)
    }, 100);
    setTimeout(() => {
        clearInterval(iid)
        document.querySelector(".current-moves>h1").innerHTML = val
    }, 1000);
}

function ani_remover(el) {
    el.classList.add("zoomOut")
    setTimeout(() => {
        el.remove()
    }, 300)
}

function out_piece_fun(color) {
    let op = getTemplate("out_piece_template")
    op.querySelector("button").classList.add(color + "_piece")
    op.querySelector("button").classList.add("zoomIn")
    setTimeout(() => {
        op.classList.remove("zoomIn")
    }, 400)
    return op
}

function other_out(response) {
    let from = response.from
    let to = response.to
    console.log(document.querySelectorAll(from))
    document.querySelector("#" + from).disabled = true
    document.querySelector("[uni-path='" + to + "']").appendChild(out_piece_fun(response.color))
}