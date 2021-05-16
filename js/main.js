const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 640;
canvas.style.width = 480;
canvas.style.height = 640;

////////////////////////////////////////////////
const startEl = document.getElementById('start');
const scoreEl = document.getElementById('score');
const textEl = document.querySelector('.text');
const textGameOver = document.querySelector('.gameOver');
/////////////

let gravity = 3;
let velocity = 2;
let gap = 150;
let obstacles = [];
let birdFrames = 0;
const birdImage = [
    '../img/bird1.png',
    '../img/bird2.png',
    '../img/bird3.png',
];
let score = 0;

let imgBird = new Image();
setInterval(() => {
    imgBird.src = birdImage[birdFrames];
    birdFrames === 2 ? (birdFrames = 0) : birdFrames++;
}, 100);

class Bird {
    constructor(x, y, radius) {
        this.x = x - 22;
        this.y = y - 17;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.drawImage(imgBird, this.x, this.y, 44, 34);
        ctx.closePath();
    }

    update() {
        this.draw();
        this.y += gravity;
    }
}

const bird = new Bird(canvas.width / 2, canvas.height / 2, 20);

/// Flooor

let imgFloor = new Image();

class Floor {
    constructor(x, y, width, height, velocity) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        imgFloor.src = '../img/base.png';
        ctx.drawImage(
            imgFloor,
            this.velocity,
            canvas.height - 100,
            canvas.width * 2,
            100
        );
        ctx.closePath();
    }
}

const floor = new Floor(0, canvas.height - 100, canvas.width, 100, 0);

/////  Obstacles

class Obstacles {
    constructor(x) {
        this.x = x;
        this.randomHeight =
            Math.random() * (canvas.height / 2 - 80) + 80;
    }

    draw() {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x + 55, 0);
        ctx.rotate(Math.PI);
        let img = new Image();
        img.src = '../img/pipe.png';

        ctx.drawImage(
            img,
            0,
            0,
            55,
            this.randomHeight,
            0,
            -this.randomHeight,
            55,
            this.randomHeight
        );
        ctx.restore();

        ctx.drawImage(
            img,
            0,
            0,
            55,
            canvas.height - (this.randomHeight + gap),
            this.x,
            this.randomHeight + gap,
            55,
            canvas.height - (this.randomHeight + gap)
        );
        ctx.closePath();
    }

    update() {
        this.draw();
        this.x -= velocity;
    }
}
function spawnObstacles() {
    obstacles.push(new Obstacles(canvas.width));
}

/////////  Clean after lose

let animationId;

function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(animation);
    bird.update();

    /// Obstacles create

    obstacles.map((obst, item) => {
        obst.update();

        /// Colision
        if (
            obst.x <= bird.x + 40 &&
            obst.x + 50 >= bird.x &&
            (bird.y <= obst.randomHeight ||
                bird.y + 30 >= obst.randomHeight + gap)
        ) {
            clearEnd();
            cancelAnimationFrame(animationId);
        }
        /// Score
        if (obst.x + 1 <= bird.x + 40 && obst.x >= bird.x + 38) {
            score += 1;
            scoreEl.innerHTML = score;
        }

        /// Delete offscene obstacle
        if (obst.x + 50 <= 0) {
            setTimeout(() => {
                obstacles.splice(item, 1);
            });
        }
    });

    // floor velocity
    floor.draw();

    if (floor.velocity >= -canvas.width) {
        floor.velocity -= velocity;
    } else {
        floor.velocity = 0;
    }

    /////
    if (floor.y <= bird.y + bird.radius) {
        cancelAnimationFrame(animationId);
        clearEnd();
    }
}

////// Clear Start
function clearStart() {
    /// Hidde text and button
    startEl.style.display = 'none';
    textEl.style.display = 'none';
}

/// End

function clearEnd() {
    scoreEl.style.display = 'none';
    textGameOver.style.display = 'block';
}

/////////// Events

addEventListener('DOMContentLoaded', () => {
    animation();
    gravity = 0;
    startEl.addEventListener('click', () => {
        //
        setTimeout(() => {
            addEventListener('keydown', event => {
                const { key } = event;
                if (key === ' ') {
                    bird.y -= 50;
                }
            });

            addEventListener('click', () => {
                bird.y -= 50;
            });
        }, 0);

        setInterval(() => {
            spawnObstacles();
        }, 4000);

        gravity = 1;

        clearStart();
    });
});
