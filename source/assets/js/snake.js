/**
 * Snake Game
 * Version: 1.0.1
 * Author: Paul Anderson
 * Website: https://www.asyncfunction.com
 * Created on: 2/28/2025
 * 
 * Description:
 * This Snake game was a fun project developed as part of a team-building exercise where
 * everyone on the team spent 2-3 hours creating something new and different from 
 * their usual work. It was a refreshing change of pace and allowed us to explore new ideas
 * in a fun and engaging way. P.S. - The ASCII art was the hardest part. Enjoy.
 *
 * License: MIT
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var jsSnake = jsSnake || {};

(function (ns) {

    let canvas, ctx;
    let gridSize = 20;
    let tileCountX, tileCountY;
    let snakeX = 10;
    let snakeY = 10;
    let velocityX = 0;
    let velocityY = 0;
    let snakeParts = [];
    let tailLength = 2;
    let appleX, appleY;
    let score = 0;
    let gameRunning = false;

    ns.initialize = function (canvasId) {
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext('2d');
        tileCountX = canvas.width / gridSize;
        tileCountY = canvas.height / gridSize;
        appleX = Math.floor(Math.random() * tileCountX);
        appleY = Math.floor(Math.random() * tileCountY);
        document.addEventListener("keydown", keyPush);
        showInitialMessage();
    };

    function drawGame() {
        changeSnakePosition();
        let gameOver = isGameOver();
        if (gameOver) {
            showGameOverScreen();
            return;
        }

        clearScreen();
        checkAppleCollision();
        drawApple();
        drawSnake();
        drawScore();

        if (gameRunning) {
            setTimeout(drawGame, 1000 / 10); // Adjust game speed here
        }
    }

    function isGameOver() {
        if (velocityX === 0 && velocityY === 0) {
            return false;
        }

        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            if (part.x === snakeX && part.y === snakeY) {
                gameRunning = false; // Stop the game loop on collision
                return true;
            }
        }

        if (snakeX < 0 || snakeX >= tileCountX || snakeY < 0 || snakeY >= tileCountY) {
            gameRunning = false; // Stop the game loop on hitting the wall
            return true;
        }

        return false;
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.fillText("Score: " + score, canvas.width - 60, 10);
    }

    function clearScreen() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = 'rgb(249, 115, 22)';
        for (let part of snakeParts) {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
        }
        snakeParts.push({ x: snakeX, y: snakeY });
        while (snakeParts.length > tailLength) {
            snakeParts.shift();
        }
    }

    function changeSnakePosition() {
        snakeX += velocityX;
        snakeY += velocityY;
    }

    function drawApple() {
        ctx.fillStyle = 'rgb(164, 164, 164)';
        ctx.fillRect(appleX * gridSize, appleY * gridSize, gridSize - 1, gridSize - 1);
    }

    function checkAppleCollision() {
        if (appleX === snakeX && appleY === snakeY) {
            tailLength++;
            score++;
            appleX = Math.floor(Math.random() * tileCountX);
            appleY = Math.floor(Math.random() * tileCountY);
        }
    }

    function keyPush(event) {
        if (event.keyCode === 13) { // Enter key
            if (!gameRunning) {
                resetGame();
                gameRunning = true;
                drawGame();
            }
        } else if (gameRunning) {
            switch (event.keyCode) {
                case 37: // Left
                    if (velocityX != 1) {
                        velocityX = -1; velocityY = 0;
                    }
                    break;
                case 38: // Up
                    if (velocityY != 1) {
                        velocityY = -1; velocityX = 0;
                    }
                    break;
                case 39: // Right
                    if (velocityX != -1) {
                        velocityX = 1; velocityY = 0;
                    }
                    break;
                case 40: // Down
                    if (velocityY != -1) {
                        velocityY = 1; velocityX = 0;
                    }
                    break;
            }
        }
    }

    function resetGame() {
        snakeX = 10;
        snakeY = 10;
        velocityX = 0;
        velocityY = 0;
        snakeParts = [];
        tailLength = 2;
        score = 0;
        appleX = Math.floor(Math.random() * tileCountX);
        appleY = Math.floor(Math.random() * tileCountY);
        showInitialMessage();
    }

    function showGameOverScreen() {
        clearScreen();
        ctx.font = "16px 'Cascadia Code', monospace";
        ctx.fillStyle = "white";
        ctx.fillText(" ▄████   ▄▄▄      ███▄ ▄███▓ ▓█████     ▒█████   ██▒   █▓▓█████  ██▀███", 50, 100);
        ctx.fillText(" ██▒ ▀█▒▒████▄    ▓██▒▀█▀ ██▒▓█   ▀    ▒██▒  ██▒▓██░   █▒▓█   ▀ ▓██ ▒ ██▒", 50, 120);
        ctx.fillText("▒██░▄▄▄░▒██  ▀█▄  ▓██    ▓██░▒███      ▒██░  ██▒ ▓██  █▒░▒███   ▓██ ░▄█ ▒", 50, 140);
        ctx.fillText("░▓█  ██▓░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄    ▒██   ██░  ▒██ █░░▒▓█  ▄ ▒██▀▀█▄", 50, 160);
        ctx.fillText("░▒▓███▀▒ ▓█   ▓██▒▒██▒   ░██▒░▒████▒   ░ ████▓▒░   ▒▀█░  ░▒████▒░██▓ ▒██▒", 50, 180);
        ctx.fillText("Score: " + score, 340, 220);
        ctx.fillText("Press Enter to play again.", 270, 260);
    }

    function showInitialMessage() {
        clearScreen();
        ctx.fillStyle = "white";
        ctx.font = "14px 'Cascadia Code', monospace"; 
        ctx.fillStyle = "white";
        ctx.fillText(" ██████   ███▄    █  ▄▄▄       ██ ▄█▀▓█████ ", canvas.width / 4, canvas.height / 2 - 80);
        ctx.fillText("▒██    ▒  ██ ▀█   █ ▒████▄     ██▄█▒ ▓█   ▀ ", canvas.width / 4, canvas.height / 2 - 60);
        ctx.fillText("░ ▓██▄   ▓██  ▀█ ██▒▒██  ▀█▄  ▓███▄░ ▒███   ", canvas.width / 4, canvas.height / 2 - 40);
        ctx.fillText("  ▒   ██▒▓██▒  ▐▌██▒░██▄▄▄▄██ ▓██ █▄ ▒██  ▄ ", canvas.width / 4, canvas.height / 2 - 20);
        ctx.fillText("▒██████▒▒▒██░   ▓██░ ▓█   ▓██▒▒██▒ █▄░█████▒", canvas.width / 4, canvas.height / 2);
        ctx.fillText("▒ ▒▓▒ ▒ ░░ ▒░   ▒ ▒  ▒▒   ▓▒█░▒ ▒▒ ▓▒░░ ▒░ ░", canvas.width / 4, canvas.height / 2 + 20);
        ctx.fillText("░ ░▒  ░ ░░ ░░   ░ ▒░  ▒   ▒▒ ░░ ░▒ ▒░ ░ ░  ░", canvas.width / 4, canvas.height / 2 + 40);
        ctx.fillText("░  ░  ░     ░   ░ ░   ░   ▒   ░ ░░ ░    ░   ", canvas.width / 4, canvas.height / 2 + 60);
        ctx.fillText("      ░           ░       ░  ░░  ░      ░  ░", canvas.width / 4, canvas.height / 2 + 80);
        ctx.font = "20px Arial";
        ctx.fillText("Press Enter to play. Use arrow keys.", canvas.width / 2 - 180, canvas.height / 2 + 140);
        ctx.font = "10px Arial";
        ctx.fillText("v1.0.1 Developed by Paul Anderson, 2025.", canvas.width / 2 - 100, canvas.height / 2 + 165);
    }

})(jsSnake);