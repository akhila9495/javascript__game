const monsters = {
    Emby: {


        position: {
            x: 280,
            y: 325
        },
        image: {src:'../Game_asset/img/embySprite.png'},
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        name: 'Emby',
        attacks: [attacks.Fireball, attacks.Tackle],
        

    },
    Draggle: {
        position: {
            x: 800,
            y: 100
        },
        image: {src:'../Game_asset/img/draggleSprite.png'},
        frames: {
            max: 4,
            hold: 25
        },
        animate: true,
        isEnemy: true,
        name: 'Draggle',
        attacks: [attacks.Tackle,attacks.Fireball],
        


    }



}