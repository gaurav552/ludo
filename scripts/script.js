document.querySelector("main").appendChild(getTemplate("start_screen_template"))

function game_screen() {
    let path = document.querySelectorAll(".path")
    let path_red = document.querySelector(".path.red")
    let path_blue = document.querySelector(".path.blue")
    let path_green = document.querySelector(".path.green")
    let path_yellow = document.querySelector(".path.yellow")
    let home = document.querySelectorAll(".home")
    let count = 5

    home.forEach((e, i) => {
        let inner = getTemplate("home_template")
        inner.querySelector(".position").classList.add(e.classList[0])
        e.appendChild(inner)

    })

    for(let i = 1; i <= 72; i++){
        let tile = document.createElement("div")
        tile.classList.add("tile")
        tile.classList.add("no_"+i)
        if(i<= 18){
            path_red.appendChild(tile)
        } else if(i>18 && i<=36){
            path_green.appendChild(tile)
        } else if(i>36 && i<=54){
            path_blue.appendChild(tile)
        } else{
            path_yellow.appendChild(tile)
        }
    }

    path.forEach((e,i)=>{
        if(i == 0){
            safe_tiles(e.children.item(5))
            safe_tiles(e.children.item(6))
        } else if(i == 1){
            safe_tiles(e.children.item(3))
            safe_tiles(e.children.item(8))
        } else if(i == 2){
            safe_tiles(e.children.item(9))
            safe_tiles(e.children.item(14))
        } else if(i == 3){
            safe_tiles(e.children.item(11))
            safe_tiles(e.children.item(12))
        }
    })

}


function safe_tiles(tile) {
    tile.classList.add("border")
    tile.classList.add("safe")
    tile.innerHTML = `<span class="material-icons md-light">
grade
</span>`
}

function getTemplate(TId) {
    if (!window.templates) {
        window.templates = {}
    }

    if (!window.templates[TId]) {
        window.templates[TId] = document.querySelector(`template#${TId}`).content
    }
    return document.importNode(window.templates[TId], true)
}