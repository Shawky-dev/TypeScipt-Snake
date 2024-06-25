"use strict";
let canvas = document.getElementById("myCanvas");
let ScoreTag = document.getElementById("score");
let GameOverTag = document.getElementById("gameover");
let Score = 0;
canvas.height = window.innerHeight * 0.6;
canvas.width = window.innerWidth * 0.6;
let ctx = canvas.getContext("2d");
const cellSize = 20;
const cellBorders = 1;
class Player {
    constructor() {
        this.Score = -3;
        this.bodyParts = [new BodyPart(200, 200)];
        this.direction = "d";
    }
    draw() {
        let size = this.bodyParts.length;
        for (let i = 0; i < this.bodyParts.length; i++) {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "#edf1d6";
            ctx.fillRect(this.bodyParts[i].x, this.bodyParts[i].y, cellSize, cellSize);
            ctx.strokeRect(this.bodyParts[i].x, this.bodyParts[i].y, cellSize, cellSize);
        }
    }
    advanceSnake() {
        let head = new BodyPart(this.bodyParts[0].x + cellSize * this.getDirectionX(), this.bodyParts[0].y + cellSize * this.getDirectionY());
        this.bodyParts.unshift(head);
        this.bodyParts.pop();
    }
    getDirectionX() {
        if (this.direction === "w" || this.direction === "s") {
            return 0;
        }
        if (this.direction === "a") {
            return -1;
        }
        if (this.direction === "d") {
            return 1;
        }
        else {
            console.log("invalid direction Charcter");
            return 0;
        }
    }
    getDirectionY() {
        if (this.direction === "a" || this.direction === "d") {
            return 0;
        }
        if (this.direction === "s") {
            return 1;
        }
        if (this.direction === "w") {
            return -1;
        }
        else {
            console.log("invalid direction Charcter");
            return 0;
        }
    }
    addPart() {
        let head = new BodyPart(this.bodyParts[0].x + cellSize * this.getDirectionX(), this.bodyParts[0].y + cellSize * this.getDirectionY());
        this.Score++;
        this.bodyParts.unshift(head);
    }
}
class BodyPart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Food {
    random_food(min, max) {
        return Math.floor(Math.random() * ((max - min) / cellSize)) * cellSize + min;
    }
    gen_food() {
        this.food_x = this.random_food(0, canvas.width - cellSize);
        this.food_y = this.random_food(0, canvas.height - cellSize);
    }
    has_eaten_food(player) {
        player.bodyParts.forEach((part) => {
            const has_eaten = part.x == this.food_x && part.y == this.food_y;
            if (has_eaten) {
                this.gen_food();
                player.addPart();
            }
        });
    }
    drawFood() {
        ctx.fillStyle = "lightgreen";
        ctx.strokeStyle = "darkgreen";
        ctx.fillRect(this.food_x, this.food_y, cellSize, cellSize);
        ctx.strokeRect(this.food_x, this.food_y, cellSize, cellSize);
    }
}
let player1 = new Player();
let food1 = new Food();
food1.gen_food();
let has_game_ended = () => {
    for (let i = 4; i < player1.bodyParts.length; i++) {
        if (player1.bodyParts[i].x === player1.bodyParts[0].x &&
            player1.bodyParts[i].y === player1.bodyParts[0].y)
            return true;
    }
    const hitLeftWall = player1.bodyParts[0].x < 0;
    const hitRightWall = player1.bodyParts[0].x > canvas.width - cellSize;
    const hitTopWall = player1.bodyParts[0].y < 0;
    const hitBottomWall = player1.bodyParts[0].y > canvas.height - cellSize;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
};
let areRectsColliding = (player, food) => {
    const size = cellSize;
    return !(player.bodyParts[0].x + size <= food.food_x ||
        food.food_x + size <= player.bodyParts[0].x ||
        player.bodyParts[0].y + size <= food.food_y ||
        food.food_y + size <= player.bodyParts[0].y);
};
player1.addPart();
player1.addPart();
player1.addPart();
function main() {
    ScoreTag.innerText = "Score:" + player1.Score;
    if (areRectsColliding(player1, food1)) {
        food1.gen_food();
        player1.addPart();
    }
    setTimeout(function onTick() {
        player1.advanceSnake();
        if (has_game_ended()) {
            GameOverTag.style.visibility = "visible";
            console.log("Game Ended!");
            return;
        }
        food1.has_eaten_food(player1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        food1.drawFood();
        player1.draw();
        main();
    }, 100);
}
document.addEventListener("keydown", (e) => {
    if ((e.key === "w" || e.key === "W") && player1.direction != "s") {
        player1.direction = "w";
    }
    if ((e.key === "a" || e.key === "A") && player1.direction != "d") {
        player1.direction = "a";
    }
    if ((e.key === "s" || e.key === "S") && player1.direction != "w") {
        player1.direction = "s";
    }
    if ((e.key === "d" || e.key === "D") && player1.direction != "a") {
        player1.direction = "d";
    }
    if (e.key === "n" || e.key === "N") {
        player1.addPart();
    }
    if (e.key === "r" || e.key === "R") {
        if (has_game_ended()) {
            GameOverTag.style.visibility = "hidden";
            player1 = new Player();
            player1.addPart();
            player1.addPart();
            player1.addPart();
            food1.gen_food();
            main();
        }
        else {
            player1 = new Player();
            GameOverTag.style.visibility = "hidden";
            player1.addPart();
            player1.addPart();
            player1.addPart();
            food1.gen_food();
        }
        console.log("12");
    }
});
main();
