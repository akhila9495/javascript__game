


const battleBackgroundImage = new Image()
battleBackgroundImage.src = '../Game_asset/img/battleBackground.png'

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let draggle
let emby

let renderedSprites
let queue

let animationBattleId
function switchToTown() {
    gsap.to('#battleOverlap', {
        opacity: 1,
        onComplete: () => {
            cancelAnimationFrame(animationBattleId)
            animation()
            clicked = false 
            document.querySelector('#userInterface').style.display = 'none'
            gsap.to('#battleOverlap', {
                opacity: 0,
            })

        }

    })
}
function intiateBattle() {
    draggle = new Monsters(monsters.Draggle)
    emby = new Monsters(monsters.Emby)
    renderedSprites = [battleBackground, draggle, emby]
    queue = []
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '242px'
    document.querySelector('#playerHealthBar').style.width = '242px'
    document.querySelector('#attacksBox').replaceChildren()
    battle.intiated = false 

    emby.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').appendChild(button)

    })

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (event) => {


            const selectedAttack = attacks[event.currentTarget.innerText]
            emby.attack(
                {
                    attack: selectedAttack,
                    recipient: draggle,
                    renderedSprites
                })

            if (draggle.health <= 0) {
                audio.battle.stop()
                audio.victory.play()
                queue.push(() => {
                    draggle.faint()
                })
                queue.push(() => {
                    switchToTown()
                })
            }
            //enemy attacks 
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]
            queue.push(() => {
                draggle.attack(
                    {
                        attack: randomAttack,
                        recipient: emby,
                        renderedSprites
                    })
                    

            })
            if (emby.health <= 0) {
                audio.battle.stop()
                queue.push(() => {
                    emby.faint()
                })
                queue.push(() => {
                    switchToTown()
                })

            }

        })
        button.addEventListener('mouseenter', (event) => {
            const selectedAttack = attacks[event.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color

        })
    })
}
function animationBattle() {
    animationBattleId = window.requestAnimationFrame(animationBattle)
    battleBackground.draw()

    console.log(animationBattleId)

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })

}
//intiateBattle()
//animationBattle()







document.querySelector('#dialogueBox').addEventListener('click', (event) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    }
    else {
        event.currentTarget.style.display = 'none'
    }



})