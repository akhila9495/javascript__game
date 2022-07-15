class Sprite {//image Drawing class
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,

        rotation = 0,

    }) {
        this.position = position
        this.image = new Image()
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1

        this.rotation = rotation

    }
    draw() {
        context.save()
        context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        context.rotate(this.rotation)
        context.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
        context.globalAlpha = this.opacity

        context.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height

        )
        context.restore()
        if (!this.animate) return
        if (this.frames.max > 1) {
            this.frames.elapsed += 1
        }
        if (this.frames.elapsed % this.frames.hold === 0) { //speed of animations
            if (this.frames.val < (this.frames.max - 1)) {
                this.frames.val += 1
            }
            else {
                this.frames.val = 0
            }

        }

    }



}


class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        context.fillStyle = 'rgba(0,0,0,0)'//color of boundary and battlezones
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}


class Monsters extends Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        rotation = 0,
        name,
        isEnemy = false,
        attacks,
        
    }) {
        super({
            position,
            image,
            frames,
            sprites,
            animate,
            rotation,

        })
        this.name = name
        this.isEnemy = isEnemy
        this.health = 100
        this.attacks = attacks

    }
    faint(){
        
        document.getElementById('dialogueBox').innerHTML = this.name + ' fainted!'
        gsap.to(this.position,{
            y: this.position.y +20
        })
        gsap.to(this,{
            opacity: 0
        })
        audio.victory.play()
        
        
    }


    attack({ attack, recipient, renderedSprites }) {
        document.getElementById('dialogueBox').style.display = 'block'
        document.getElementById('dialogueBox').innerHTML = this.name + ' used ' + attack.name


        let movementDistance = 20
        let rotation = 1
        if (this.isEnemy) {

            movementDistance = -20
            rotation = -2.4
        }
        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) { healthBar = '#playerHealthBar' }
        switch (attack.name) {

            case 'Fireball': {
                const fireballImage = new Image()
                fireballImage.src = './Game_asset/attacks/fireball.png'

                const fireballAttack = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation: rotation

                })
                audio.intiateFireball.play()
                renderedSprites.splice(2, 0, fireballAttack)
                gsap.to(fireballAttack.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    duration: 0.7,
                    onComplete: () => {
                        renderedSprites.splice(2, 1)
                        audio.intiateFireball.stop()
                        audio.hitFireball.play()
                        recipient.health = recipient.health - attack.damage
                        gsap.to(healthBar, {
                            width: (recipient.health) + '%',
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 8,
                            yoyo: true,
                            duration: 0.06,
                            onComplete: () => {
                                audio.hitFireball.stop()
                                gsap.to(recipient, {
                                    opacity: 1

                                })

                            }
                        })


                    }

                })



                break;
            }

            case 'Tackle': {
                const tl = gsap.timeline()

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        audio.hitTackle.play()
                        recipient.health = recipient.health - attack.damage
                        gsap.to(healthBar, {
                            width: (recipient.health) + '%',
                        })
                        gsap.to(recipient.position,
                            {
                                x: recipient.position.x + 10,
                                yoyo: true,
                                repeat: 8,
                                duration: 0.06

                            })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 8,
                            yoyo: true,
                            duration: 0.06,
                            onComplete: () => {
                                audio.hitTackle.stop()
                                gsap.to(recipient, {
                                    opacity: 1

                                })
                            }
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break;
            }




        }

    }

}