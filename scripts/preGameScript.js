// document.querySelector("main").appendChild(getTemplate("start_screen_template"))
display_start()
let saved_friends = []

let remotePeerId = [],
    connections = []

let peer

peering()

function peering() {
    peer = localStorage.getItem("User Name") != null ? new Peer(localStorage.getItem("User Name")) : null;

    if (peer != null) {
        console.log("connected")
        console.log(peer.id)
        saved_friends = JSON.parse(localStorage.getItem("Friends"))

        peer.on('open', function(id) {

            console.log('My peer ID is: ' + id);
        });

        peer.on("error", e => {
            console.log(e.type)
        })

        peer.on('connection', function(conn) {
            console.log(conn.peer+" requested")
            manageConnections(conn);
        });

    } else(
        console.log("error")
    )
}

function getConnected(peerId) {
    console.log(peerId)
    if (!remotePeerId.includes(peerId) && peerId != localStorage.getItem("User Name") && remotePeerId.length <= 3) {
        let conn = peer.connect(peerId)
        manageConnections(conn)
        console.log(conn)
    }
}

function manageConnections(conn) {
    // console.log("2 "+conn.peer)
    if (!remotePeerId.includes(conn.peer) && conn.peer != localStorage.getItem("User Name")) {

        // console.log("1 "+conn.peer)

        conn.on("open", () => {
            remotePeerId.push(conn.peer)

            console.log("connected to " + conn.peer)

            if (saved_friends != null) {
                if (!saved_friends.includes(conn.peer)) {
                    saved_friends.push(conn.peer)
                }
                localStorage.setItem("Friends", JSON.stringify(saved_friends))
            } else {
                saved_friends = [conn.peer]
                localStorage.setItem("Friends", JSON.stringify(saved_friends))
            }

            conn.on('data', function(data) {
                // You can do whatever you want with the data from this connection - this is also the main part
                // dataHandler(conn,data);
                let message = JSON.parse(data)
                if (message.type == "initial") {
                    // console.log(JSON.parse(data).data)
                    message.data.forEach((e, i) => {
                        if (!remotePeerId.includes(e) && e != localStorage.getItem("User Name")) {
                            getConnected(e)
                        }
                    })
                } else if (message.type == "color") {
                    localStorage.removeItem("Color")
                    localStorage.setItem("Color", message.value)
                    localStorage.setItem("Turn", message.turn)
                    game_changer()
                } else if(message.type == "roll"){
                    dice_roller(message.value)
                } else if(message.type == "home out"){
                    other_out(message)
                } else if(message.type == "move other"){
                    move_other(message)
                }
                else {
                    console.log("diff")
                }
            });
            conn.on('error', function(e) {
                // handle error 
                //    connectionError(conn);
                console.log(e)
                
            });

            conn.on('close', function(e) {
                // Handle connection closed
                //    connectionClose(conn);
                console.log(e)
                remotePeerId.splice(remotePeerId.indexOf(conn.peer),1)
            });

            connections.push(conn);

            let member_check = {
                'type': 'initial',
                'data': remotePeerId
            }
            conn.send(JSON.stringify(member_check))

        })
    }
}

function display_start() {
    let start_screen = document.querySelector("main>.start-screen")
    start_screen.appendChild(getTemplate("player_name_template"))
    let player_name = start_screen.querySelector(".player-name")
    let name = player_name.querySelector(".player-name>.name")
    if (localStorage.getItem("User Name") == null) {
        let name_form = getTemplate("name_form_template")
        player_name.insertBefore(name_form, name)
        name.remove()

    } else {
        let name = player_name.querySelector(".name>h1")
        name.innerHTML = localStorage.getItem("User Name")
    }
    settings_button_init()
    play_button_init()
}

function settings_button_init() {
    document.querySelector(".settings-button").addEventListener("click", e => {
        let start_screen = document.querySelector("main>.start-screen")
        let player_name = start_screen.querySelector(".player-name")

        start_screen.replaceChild(getTemplate("settings_template"), player_name)
        document.querySelector("#change_name_form>input").value = localStorage.getItem("User Name")
    })
}

function play_button_init() {
    document.querySelector(".play-button").addEventListener("click", e => {
        if (localStorage.getItem("User Name") != null) {
            if (!document.querySelector("main").contains(document.querySelector(".network"))) {
                document.querySelector("main").appendChild(getTemplate("network_template"))

                if (localStorage.getItem("Friends") != null) {
                    saved_friends = JSON.parse(localStorage.getItem("Friends"))
                    saved_friends.forEach(element => {

                        let friend = getTemplate("friends_list_template")

                        friend.querySelector("h1").innerHTML = element

                        document.querySelector(".friends").insertBefore(friend, document.querySelector(".network>.friends>.start"))

                    });
                }

                document.querySelector(".play-button>.material-icons").innerHTML = "close"
                if (localStorage.getItem("Friends") !== null) {

                }
            } else {
                document.querySelector(".network").remove()
                document.querySelector(".play-button>.material-icons").innerHTML = "play_arrow"
            }
        }
    })
}

function add_friend(name) {
    // console.log(friend.id)
    if (saved_friends == null) {
        saved_friends = [name]
    } else {
        saved_friends.push(name)
    }
    localStorage.setItem("Friends", JSON.stringify(saved_friends))
    let new_friend = getTemplate("friends_list_template")
    new_friend.querySelector("h1").innerHTML = name
    document.querySelector(".friends").insertBefore(new_friend, document.querySelector(".network>.friends>.start"))
}

function add_to_game(e) {
    getConnected(e.target.parentElement.parentElement.parentElement.querySelector("h1").innerHTML)
}

function remove_friend(e){
    let val = e.target.parentElement.parentElement.parentElement.querySelector("h1").innerHTML
    e.target.parentElement.parentElement.parentElement.remove()
    saved_friends.splice(saved_friends.indexOf(val),1)
    remotePeerId.splice(remotePeerId.indexOf(val),1)
    if(saved_friends.length != 0 ){
        localStorage.setItem("Friends", saved_friends)
    } else {
        localStorage.removeItem("Friends")
    }
    connections.forEach((e,i)=>{
        if(e.peer == val){
            e.close()
            console.log(e.peer+" close")
        }
        
    })
}

function colouring() {
    localStorage.removeItem("Color")
    let rand = []
    let temp
    let color = ['red', 'green', 'yellow', 'blue']
    for (let i = 0; i < 4; ++i) {
        temp = Math.floor(Math.random() * (3 - 0 + 1))
        if (!rand.includes(temp)) {
            rand.push(temp)
                // console.log(rand)
        } else(
            i--
        )
    }
    // console.log(color[rand.pop()])
    localStorage.setItem("Color", color[rand.pop()])
    let turn = localStorage.getItem("Color")
    localStorage.setItem("Turn", turn)

    connections.forEach(conn => {
        let color_boj = {
            'type': 'color',
            'value': color[rand.pop()],
            'turn': turn
        }
        conn.send(JSON.stringify(color_boj))
    })
    game_changer()

}

function game_changer() {
    let my_color = localStorage.getItem("Color")
    let color = ['red', 'green', 'blue', 'yellow']
    color = color_repositioning(my_color, color)
    // console.log(color)

    let screen_template = getTemplate("game_template")
    let screen = `
        <div id="${color[0]}" class="${color[0]} home player pos_1"></div>
        <div class="${color[1]} ${color[1]}-move path path-v path_2"></div>
        <div id="${color[1]}" class="${color[1]} home pos_2"></div>
        <div class="${color[0]} ${color[0]}-move path path-h path_1"></div>
        <div class="center">
            <div class="lines">
                <div class="line1"></div>
                <div class="line2"></div>
            </div>
        </div>
        <div class="${color[2]} ${color[2]}-move path path-h path_3"></div>
        <div id="${color[3]}" class="${color[3]} home pos_4"></div>
        <div class="${color[3]} ${color[3]}-move path path-v path_4"></div>
        <div id="${color[2]}" class="${color[2]} home pos_3"></div>
    `
    // console.log('.board>.home.'+localStorage.getItem("Turn"))
    screen_template.querySelector(".board").innerHTML = screen
    document.querySelector("main").replaceChild(screen_template, document.querySelector(".start-screen"))
    document.getElementById(localStorage.getItem("Turn")).classList.add("turn")
    game_screen()
    if(document.querySelector(".network") !== null){
        document.querySelector(".network").remove()
    }

    document.querySelectorAll("."+localStorage.getItem("Color")+".home_piece").forEach((e,i)=>{
        e.setAttribute('id',localStorage.getItem("Color")+"_inside_"+i)
        e.addEventListener("click",ev=>{
            // console.log(ev.target.parentElement)
            if(localStorage.getItem("Color") == localStorage.getItem('Turn')){
                if(localStorage.getItem("Previous Roll") == 6){
                    localStorage.removeItem("Previous Roll")
                    ev.target.disabled = true
                    let op =getTemplate("out_piece_template")
                    // console.log(op.querySelector("button"))
                    op.querySelector("button").classList.add(localStorage.getItem("Color")+"_piece")
                    document.querySelector("[this-path='1']").appendChild(op)

                    let send_move = {
                        'type':'home out',
                        'from': e.getAttribute('id'),
                        'to': document.querySelector("[this-path='1']").getAttribute('uni-path'),
                        'color': localStorage.getItem("Color")
                    }
                    broadcastRoll(JSON.stringify(send_move))
                    document.querySelector(".roll>button").disabled = false
                    console.log(send_move)
                    // document.querySelectorAll(".out_piece")
                } 
            }
        })
    })
    
}




function color_repositioning(my_color, color) {
    while (color[0] != my_color) {
        let temp = color.pop()
        color.unshift(temp)
    }
    return color
}