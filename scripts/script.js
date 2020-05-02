document.querySelector("main").appendChild(getTemplate("start_screen_template"))

function game_screen() {
    let path = document.querySelectorAll(".path")
    let home = document.querySelectorAll(".home")
    let count = 5

    home.forEach((e, i) => {
        let inner = getTemplate("home_template")
        inner.querySelector(".position").classList.add(e.classList[0])
        e.appendChild(inner)

    })

    function safe_tiles(tile, index) {
        tile.classList.add("border")
        tile.classList.add("safe")
        tile.innerHTML = `<span class="material-icons md-light">
    grade
    </span>`
        if (index > 1) {
            tile.style.transform = 'rotate(-180deg)'

        }
    }

    path.forEach((e, index) => {
        for (let i = 1; i <= 18; i++) {
            let tile = document.createElement("div")
            tile.classList.add("tile")
            if (index == 0 || index == 3) {
                if (i == 6 || i == 7) {
                    safe_tiles(tile, index)
                }
            } else {
                if (i == 4 || i == 9) {
                    safe_tiles(tile, index)
                }
            }

            if (i == count) {
                tile.classList.add("border")
                count += 3
            }
            e.appendChild(tile)
        }

        count = 5

        if (index > 1) {
            e.style.transform = 'rotate(180deg)'
        }
    })
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