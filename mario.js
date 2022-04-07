import kaboom from '../node_modules/kaboom/dist/kaboom.mjs';


kaboom({
    global: true,
    fullscreen: true,
    scale: 1, 
    debug: true,
    background: [0, 0, 0, 1],
});

//sprites, blocks to build world
loadSprite('coin', 'assets/coin.png');
loadSprite('brick', 'assets/brick.png');
loadSprite('block', 'assets/box.png');
loadSprite('mario', 'assets/mario.png');
loadSprite('mushroom', 'assets/mushroom.png');
loadSprite('evil-mushroom', 'assets/evil-mushroom.png');
loadSprite('surprise-box', 'assets/surprise-box.png');
loadSprite('pipe', 'assets/pipe.png');

//sounds to play during gameplay
// loadRoot('https://dazzling-vacherin-8cb912.netlify.app/assets/');
// loadRoot('http://localhost:5501/assets/');
// loadSound('jump', 'marioJump.mp3');
// loadSound('theme', 'mainTheme.mp3');



scene('game', ({ score, count }) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const player = add([
        sprite('mario'), solid(), area(),
        pos(30, 0),
        body(),
        origin('bot')
    ]);

    const marioSpeed = 120;
    const marioJumpHeight = 500;
    const coinScore = 200;
    const mushroomMove = 20;

    onKeyDown('left', () => {
        player.move(-marioSpeed, 0);
    });

    onKeyDown('right', () => {
        player.move(marioSpeed, 0);
    });

    onKeyPress('space', () => {
        if (player.isGrounded()) {
            player.jump(marioJumpHeight);
            // play('jump');
        }
    });

    player.on('headbump', (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('*', obj.gridPos.sub(0, 1));
            gameLevel.spawn('+', obj.gridPos.sub(0, 0));
            destroy(obj);
        }
        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('@', obj.gridPos.sub(0, 1));
            gameLevel.spawn('+', obj.gridPos.sub(0, 0));
            destroy(obj);
        }
    });

    on('evil-mushroom', () => {
        move((-1, 0), mushroomMove);
    });

    on('evil-mushroom', () => {
        move((-1, 0), mushroomMove);
    });

    player.onCollide('mushroom', (e) => {
        destroy(e);
        player.biggify(10);
    });

    player.onCollide('coin', (e) => {
        destroy(e);
        scoreLabel.value += coinScore;
        scoreLabel.text = scoreLabel.value;
        console.log(score);
    });

    // play('theme');

    const username = add([
        text('MARIO'),
        pos(30, 6),
    ]);
    const scoreLabel = add([
        text(score),
        pos(60, 20),
        layer('ui'),
        {
            value: score
        }
    ]);
    const coinCount = add([
        text(sprite('coin') + 'x' + count),
        pos(100, 20),
        layer('ui'),
        {
            value: count
        }
    ]);

    const gameLevel = addLevel([
        '                                     ',
        '                                     ',
        '        ***                          ',
        '                                     ',
        '                                     ',
        '                 ****                ',
        '                                     ',
        '                                     ',
        '                 ++++                ',
        '                                     ',
        '                                     ',
        '     **  +$+#+                       ',
        '                                     ',
        '                         ?           ',
        '                    ^  ^             ',
        '===========================    ======',
    ], {
        // define the size of each block
        width: 20,
        height: 20,
        // define what each symbol means, by a function returning a component list (what will be passed to add())
        '=': () => [sprite('brick'), area(), solid()],
        '*': () => [sprite('coin'), 'coin'],
        '$': () => [sprite('surprise-box'), solid(), area(), 'coin-surprise'],
        '#': () => [sprite('surprise-box'), solid(), area(), 'mushroom-surprise'],
        '^': () => [sprite('evil-mushroom'), solid(), area(), 'evil-mushroom', body()],
        '?': () => [sprite('pipe'), solid(), area()],
        '+': () => [sprite('block'), solid(), area()],
        '@': () => [sprite('mushroom'), solid(), area(), 'mushroom', body()],
    });

    player.onUpdate(() => {
        camPos(player.pos);
    });
});

go('game', { score: 0, count: 0 });
