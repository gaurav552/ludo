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
        inner.querySelectorAll(".position>.piece").forEach((el, no) => {
            el.setAttribute('id',e.classList[0]+"_inside_"+no)
            el.classList.add(e.classList[0])
                if (e.classList[0] == 'red') {
                    
                    // el.innerHTML = `<span class="material-icons">change_history</span>`
                } else if (e.classList[0] == 'green') {
                    // el.innerHTML = `<span class="material-icons">favorite_border</span>`
                } else if (e.classList[0] == 'yellow') {
                    // el.innerHTML = `<span class="material-icons">add</span>`
                } else if (e.classList[0] == 'blue') {
                    // el.innerHTML = `<span class="material-icons">crop_free</span>`
                }
        })
        e.appendChild(inner)
    })

    let my_color = localStorage.getItem("Color")
    let color = ['red', 'green', 'blue', 'yellow']
    color = color_repositioning(my_color, color)

    color.forEach((e, i) => {
        let color_path = document.querySelector("." + e + "-move")

        if (color_path.classList.contains("path_2") || color_path.classList.contains("path_3")) {
            color_path.appendChild(getTemplate("path_template"))
        } else {
            color_path.appendChild(getTemplate("path_template_inverse"))
        }

        color_path.querySelectorAll("[safe-path]").forEach(ele=>{
            ele.classList.add("border")
            ele.classList.add(e+"_safe")
        })


        pather_returns(color_path,(i))

        if (e == "green") {
            pather(color_path, 39, 13)
        } 
        else if (e == "blue") {
            pather(color_path, 26, 26)
        }

        else if (e == "yellow") {
            pather(color_path, 13, 39)
        } else{
            pather(color_path)
        }
        // else{
        //     color_path.querySelectorAll(".path").forEach(path => {
        //         path.innerHTML= path.getAttribute('uni-path')
        //     })
        // }
    })
}

function pather_returns(color_path, i){
    let num1 = (4-i)*13
    let num2 = i*13
    color_path.querySelectorAll(".path").forEach(path => {
        if(i!=0){
            if (path.getAttribute('uni-path') > 5) {
                path.setAttribute("this-path", ((path.getAttribute('uni-path') | 0) - num1))
            } else {
                path.setAttribute("this-path", ((path.getAttribute('uni-path') | 0) + num2))
            }
        } else{
            path.setAttribute("this-path", ((path.getAttribute('uni-path') | 0)))
        }
        // path.innerHTML= path.getAttribute('this-path')
    })

}

function pather(color_path, num1=0, num2=0){

    color_path.querySelectorAll(".path").forEach(path => {

        if(path.getAttribute('uni-path') == 48 || path.getAttribute('uni-path') == 1){
            safe_tiles(path)
        }

        if (path.getAttribute('uni-path') > 5) {
            path.setAttribute("uni-path", ((path.getAttribute('uni-path') | 0) - num1))
        } else {
            path.setAttribute("uni-path", ((path.getAttribute('uni-path') | 0) + num2))
        }
        // path.innerHTML= path.getAttribute('uni-path')
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