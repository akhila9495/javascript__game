const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576



const offest = {
    x: -735,
    y: -620
}


const collisionsMap = []

for (let index = 0; index < collisions.length; index += 70) {
    collisionsMap.push(collisions.slice(index, index + 70))

}
const battleZoneMap = []

for (let index = 0; index < battleZoneData.length; index += 70) {
    battleZoneMap.push(battleZoneData.slice(index, index + 70))

}
//boundary funtion start


const boundaries = []


collisionsMap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            boundaries.push(new Boundary(
                {
                    position: {
                        x: (j * Boundary.width) + offest.x,
                        y: (i * Boundary.height) + offest.y
                    }
                })
            )
    })

})
const battleZones = []


battleZoneMap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            battleZones.push(new Boundary(
                {
                    position: {
                        x: (j * Boundary.width) + offest.x,
                        y: (i * Boundary.height) + offest.y
                    }
                })
            )
    })

})

const playerDown = new Image()
playerDown.src = './Game_asset/player/playerDown.png'
const playerUp = new Image()
playerUp.src = './Game_asset/player/playerUp.png'
const playerLeft = new Image()
playerLeft.src = './Game_asset/player/playerLeft.png'
const playerRight = new Image()
playerRight.src = './Game_asset/player/playerRight.png'
//background
const backgroundImage = new Image()
backgroundImage.src = './Game_asset/img/Pellet _Town.png'
//foreground
const foregroundImage = new Image()
foregroundImage.src = './Game_asset/img/Pellet_Town_foreground.png'




const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 8,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDown,
    frames: {
        max: 4,
        hold: 8
    },
    sprites: {
        up: playerUp,
        left: playerLeft,
        right: playerRight,
        down: playerDown
    }
}
)

const background = new Sprite({
    position: {
        x: offest.x,
        y: offest.y
    },
    image: backgroundImage

})
const foreground = new Sprite({
    position: {
        x: offest.x,
        y: offest.y
    },
    image: foregroundImage

})
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },

}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}
const battle = {
    intiated: false
}
function animation() {
    document.querySelector('#userInterface').style.display = 'none'
    const animationID = window.requestAnimationFrame(animation)
    background.draw()//background



    boundaries.forEach((Boundary) => {//boundary
        Boundary.draw()
    })
    battleZones.forEach((battleZone) => {//battlezones
        battleZone.draw()
    })

    player.draw() //player
    foreground.draw() //foreground
    let moving_status = true
    player.animate = false //moving_status to class
    if (battle.intiated) return
    if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {//batle activation on entering the ground
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = (
                (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width)
                    - Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height)
                    - Math.max(player.position.y, battleZone.position.y))) //calculation of overlapping between player and battle zone            
            if (rectangularCollision(
                {
                    rectangle1: player,
                    rectangle2: battleZone
                }
            ) && overlappingArea > (player.width * player.height) / 1.8 && Math.random() < 0.04)//possibility of battle control variables
            {
                
                
                console.log("activate battle ")
                window.cancelAnimationFrame(animationID) //deactivates current animationID
                battle.intiated = true
                audio.Map.stop()
                audio.initBattle.play()
                gsap.to('#battleOverlap', {//battle flash screen 
                    opacity: 1,
                    duration: 3,
                    ease: Elastic.easeOut,
                    onComplete() {
                        gsap.to('#battleOverlap', {//battle flash screen
                            opacity: 1,
                            duration: 0.2,
                            onComplete: () => {
                                audio.initBattle.stop()
                                audio.battle.play()
                                intiateBattle() //intiated battle vatiables
                                animationBattle() //activate a new animation loop for the battle
                                gsap.to('#battleOverlap', {//battle flash screen
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })


                    }
                })
                break
            }
        }
    }

    player.image = player.sprites.down
    if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision(
                {
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })) {

                moving_status = false
                break
            }
        }

        if (moving_status) {
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision(
                {
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })) {
                moving_status = false
                break
            }
        }
        if (moving_status) {
            movables.forEach((movable) => {
                movable.position.x += 3
            })
        }

    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision(
                {
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })) {
                moving_status = false
                break
            }
        }
        if (moving_status) {
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
        }
    }
    else if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision(
                {
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })) {
                moving_status = false
                break
            }
        }
        if (moving_status) {
            movables.forEach((movable) => {
                movable.position.y += 3
            })
        }


    }

}
animation()


let lastKey = ''
window.addEventListener('keydown', (input) => {


    switch (input.key) {
        case "w" || "W":
            keys.w.pressed = true
            lastKey = 'w'
            break
        case "s" || "S":
            keys.s.pressed = true
            lastKey = 's'
            break
        case "a" || "A":
            keys.a.pressed = true
            lastKey = 'a'
            break
        case "d" || "D":
            keys.d.pressed = true
            lastKey = 'd'
            break

    }
})
window.addEventListener('keyup', (input) => {


    switch (input.key) {
        case "w" || "W":
            keys.w.pressed = false
            break
        case "s" || "S":
            keys.s.pressed = false
            break
        case "a" || "A":
            keys.a.pressed = false
            break
        case "d" || "D":
            keys.d.pressed = false
            break

    }
})
let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true 
    }
})


