const audio = {
    Map: new Howl({
        src: 'Game_asset/audio/map.wav',
        html:true

    }),
    initBattle: new Howl({
        src: 'Game_asset/audio/initBattle.wav',
        html:true,volume:0.1
    }),
    battle: new Howl({
        src: 'Game_asset/audio/battle.mp3',
        html:true,
        volume:0.1
    }),
    intiateFireball:new Howl ({
        src: 'Game_asset/audio/initFireball.wav',
        html:true
    }),
    hitTackle: new Howl({
        src: 'Game_asset/audio/tackleHit.wav',
        html:true

    }),
    hitFireball: new Howl({
        src: 'Game_asset/audio/fireballHit.wav',
        html:true

    }),
    victory: new Howl({
        src: 'Game_asset/audio/victory.wav',
        html:true
    }),

}