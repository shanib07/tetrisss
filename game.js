const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const streakElement = document.getElementById('streak');
const gameOverElement = document.getElementById('gameOver');
const mathOverlay = document.getElementById('mathOverlay');
const mathProblem = document.getElementById('mathProblem');
const mathInput = document.getElementById('mathInput');
const mathTimer = document.getElementById('mathTimer');
const mathFeedback = document.getElementById('mathFeedback');

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 40;

// Game state
let gameState = {
    board: Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    streak: 0,
    mathSolved: 0,
    isGameOver: false,
    isPaused: false,
    dropTimer: 0,
    dropInterval: 800, // Start faster
    currentMathProblem: null,
    mathTimeLeft: 10,
    mathTimerInterval: null,
    waitingForMath: false
};

// Tetris pieces
const PIECES = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[1,0,0],[1,1,1]], // L
    [[0,0,1],[1,1,1]], // J
    [[0,1,1],[1,1,0]], // S
    [[1,1,0],[0,1,1]] // Z
];

const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2'  // Sky Blue
];

class Piece {
    constructor() {
        const pieceIndex = Math.floor(Math.random() * PIECES.length);
        this.shape = PIECES[pieceIndex];
        this.color = pieceIndex + 1;
        this.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }
    
    rotate() {
        const rotated = this.shape[0].map((_, index) =>
            this.shape.map(row => row[index]).reverse()
        );
        
        const oldShape = this.shape;
        this.shape = rotated;
        
        if (this.collision()) {
            this.shape = oldShape;
        }
    }
    
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        
        if (this.collision()) {
            this.x -= dx;
            this.y -= dy;
            return false;
        }
        return true;
    }
    
    collision() {
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    const boardX = this.x + x;
                    const boardY = this.y + y;
                    
                    if (boardX < 0 || boardX >= BOARD_WIDTH || 
                        boardY >= BOARD_HEIGHT ||
                        (boardY >= 0 && gameState.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    place() {
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                if (this.shape[y][x]) {
                    const boardX = this.x + x;
                    const boardY = this.y + y;
                    
                    if (boardY >= 0) {
                        gameState.board[boardY][boardX] = this.color;
                    }
                }
            }
        }
    }
}

function generateMathProblem() {
    const difficulty = Math.min(gameState.level, 10);
    let a, b, c, d, answer, problemText;
    
    if (difficulty <= 2) {
        // Level 1-2: Two-digit addition/subtraction
        a = Math.floor(Math.random() * 40) + 20;
        b = Math.floor(Math.random() * 30) + 10;
        const operation = Math.random() < 0.6 ? '+' : '-';
        
        if (operation === '-' && a < b) {
            [a, b] = [b, a];
        }
        
        answer = operation === '+' ? a + b : a - b;
        problemText = `${a} ${operation} ${b} = ?`;
    } else if (difficulty <= 4) {
        // Level 3-4: Simple multiplication or three numbers
        if (Math.random() < 0.5) {
            a = Math.floor(Math.random() * 12) + 3;
            b = Math.floor(Math.random() * 12) + 3;
            answer = a * b;
            problemText = `${a} × ${b} = ?`;
        } else {
            a = Math.floor(Math.random() * 30) + 15;
            b = Math.floor(Math.random() * 25) + 10;
            c = Math.floor(Math.random() * 20) + 5;
            answer = a + b - c;
            problemText = `${a} + ${b} - ${c} = ?`;
        }
    } else if (difficulty === 5) {
        // Level 5: Introduction to BODMAS
        const problemType = Math.floor(Math.random() * 3);
        if (problemType === 0) {
            a = Math.floor(Math.random() * 10) + 5;
            b = Math.floor(Math.random() * 8) + 2;
            c = Math.floor(Math.random() * 15) + 10;
            answer = a * b + c;
            problemText = `${a} × ${b} + ${c} = ?`;
        } else if (problemType === 1) {
            a = Math.floor(Math.random() * 30) + 20;
            b = Math.floor(Math.random() * 10) + 5;
            c = Math.floor(Math.random() * 6) + 2;
            answer = a + b * c;
            problemText = `${a} + ${b} × ${c} = ?`;
        } else {
            a = Math.floor(Math.random() * 40) + 30;
            b = Math.floor(Math.random() * 8) + 2;
            c = Math.floor(Math.random() * 5) + 2;
            answer = a - b * c;
            problemText = `${a} - ${b} × ${c} = ?`;
        }
    } else if (difficulty === 6) {
        // Level 6: Harder BODMAS with division
        const problemType = Math.floor(Math.random() * 3);
        if (problemType === 0) {
            b = Math.floor(Math.random() * 8) + 2;
            c = Math.floor(Math.random() * 10) + 5;
            a = b * c; // Ensure clean division
            d = Math.floor(Math.random() * 20) + 10;
            answer = (a / b) + d;
            problemText = `${a} ÷ ${b} + ${d} = ?`;
        } else if (problemType === 1) {
            a = Math.floor(Math.random() * 15) + 5;
            b = Math.floor(Math.random() * 7) + 3;
            c = Math.floor(Math.random() * 4) + 2;
            answer = (a + b) * c;
            problemText = `(${a} + ${b}) × ${c} = ?`;
        } else {
            a = Math.floor(Math.random() * 50) + 30;
            b = Math.floor(Math.random() * 15) + 10;
            c = Math.floor(Math.random() * 5) + 2;
            answer = a - (b + c);
            problemText = `${a} - (${b} + ${c}) = ?`;
        }
    } else if (difficulty === 7) {
        // Level 7: Complex BODMAS
        const problemType = Math.floor(Math.random() * 3);
        if (problemType === 0) {
            a = Math.floor(Math.random() * 8) + 3;
            b = Math.floor(Math.random() * 6) + 2;
            c = Math.floor(Math.random() * 10) + 5;
            d = Math.floor(Math.random() * 15) + 10;
            answer = a * b + c * d;
            problemText = `${a} × ${b} + ${c} × ${d} = ?`;
        } else if (problemType === 1) {
            a = Math.floor(Math.random() * 100) + 50;
            b = Math.floor(Math.random() * 20) + 10;
            c = Math.floor(Math.random() * 5) + 2;
            answer = a - b * c;
            problemText = `${a} - ${b} × ${c} = ?`;
        } else {
            // Harder percentage
            a = Math.floor(Math.random() * 80) + 40;
            b = [15, 30, 35, 40, 45, 60, 75][Math.floor(Math.random() * 7)];
            answer = Math.floor((a * b) / 100);
            problemText = `${b}% of ${a} = ?`;
        }
    } else if (difficulty === 8) {
        // Level 8: More complex calculations
        const problemType = Math.floor(Math.random() * 3);
        if (problemType === 0) {
            // Two-step percentage
            a = Math.floor(Math.random() * 100) + 100;
            b = [20, 25, 30, 40][Math.floor(Math.random() * 4)];
            c = Math.floor(Math.random() * 30) + 20;
            answer = Math.floor((a * b) / 100) + c;
            problemText = `${b}% of ${a} + ${c} = ?`;
        } else if (problemType === 1) {
            // Complex BODMAS
            a = Math.floor(Math.random() * 12) + 5;
            b = Math.floor(Math.random() * 8) + 3;
            c = Math.floor(Math.random() * 6) + 2;
            answer = a * (b + c);
            problemText = `${a} × (${b} + ${c}) = ?`;
        } else {
            // Division with addition/subtraction
            c = Math.floor(Math.random() * 10) + 5;
            b = Math.floor(Math.random() * 8) + 2;
            a = b * c;
            d = Math.floor(Math.random() * 25) + 15;
            answer = (a / b) * d / c;
            problemText = `(${a} ÷ ${b}) × ${d} ÷ ${c} = ?`;
        }
    } else if (difficulty === 9) {
        // Level 9: Very challenging
        const problemType = Math.floor(Math.random() * 4);
        if (problemType === 0) {
            // Square roots in calculations
            const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
            a = squares[Math.floor(Math.random() * squares.length)];
            b = Math.floor(Math.random() * 15) + 10;
            c = Math.floor(Math.random() * 8) + 2;
            answer = Math.sqrt(a) * c + b;
            problemText = `√${a} × ${c} + ${b} = ?`;
        } else if (problemType === 1) {
            // Percentage of percentage
            a = 200;
            b = 50;
            c = 20;
            answer = Math.floor((a * b / 100) * c / 100);
            problemText = `${c}% of ${b}% of ${a} = ?`;
        } else if (problemType === 2) {
            // Complex nested operations
            a = Math.floor(Math.random() * 15) + 10;
            b = Math.floor(Math.random() * 8) + 2;
            c = Math.floor(Math.random() * 6) + 3;
            d = Math.floor(Math.random() * 10) + 5;
            answer = (a - b) * c + d;
            problemText = `(${a} - ${b}) × ${c} + ${d} = ?`;
        } else {
            // Harder mixed operations
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 12) + 5;
            c = Math.floor(Math.random() * 4) + 2;
            answer = a * b / c;
            problemText = `${a} × ${b} ÷ ${c} = ?`;
        }
    } else {
        // Level 10: Final boss level
        const problemType = Math.floor(Math.random() * 4);
        if (problemType === 0) {
            // Complex BODMAS with all operations
            a = Math.floor(Math.random() * 20) + 15;
            b = Math.floor(Math.random() * 10) + 5;
            c = Math.floor(Math.random() * 8) + 2;
            d = Math.floor(Math.random() * 5) + 2;
            answer = a + b * c - d * d;
            problemText = `${a} + ${b} × ${c} - ${d}² = ?`;
        } else if (problemType === 1) {
            // Percentage with subtraction
            a = Math.floor(Math.random() * 150) + 100;
            b = [15, 25, 35, 45][Math.floor(Math.random() * 4)];
            answer = a - Math.floor((a * b) / 100);
            problemText = `${a} - ${b}% of ${a} = ?`;
        } else if (problemType === 2) {
            // Multiple brackets
            a = Math.floor(Math.random() * 12) + 8;
            b = Math.floor(Math.random() * 6) + 3;
            c = Math.floor(Math.random() * 5) + 2;
            d = Math.floor(Math.random() * 4) + 2;
            answer = (a + b) * (c + d);
            problemText = `(${a} + ${b}) × (${c} + ${d}) = ?`;
        } else {
            // Final calculation
            a = Math.floor(Math.random() * 100) + 50;
            b = Math.floor(Math.random() * 20) + 10;
            c = Math.floor(Math.random() * 8) + 2;
            answer = Math.floor((a + b) / c);
            problemText = `(${a} + ${b}) ÷ ${c} = ?`;
        }
    }
    
    return { problemText, answer };
}

function showMathProblem() {
    gameState.isPaused = true;
    gameState.waitingForMath = true;
    gameState.currentMathProblem = generateMathProblem();
    // 10 seconds timer, slightly less at very high levels
    gameState.mathTimeLeft = Math.max(7, 10 - Math.floor(gameState.level / 5));
    
    mathProblem.textContent = gameState.currentMathProblem.problemText;
    mathInput.value = '';
    mathFeedback.textContent = '';
    mathTimer.textContent = gameState.mathTimeLeft;
    mathOverlay.style.display = 'block';
    
    setTimeout(() => mathInput.focus(), 100);
    
    gameState.mathTimerInterval = setInterval(() => {
        gameState.mathTimeLeft--;
        mathTimer.textContent = gameState.mathTimeLeft;
        
        if (gameState.mathTimeLeft <= 0) {
            handleWrongAnswer();
        }
    }, 1000);
}

function submitAnswer() {
    const answer = parseInt(mathInput.value);
    
    if (answer === gameState.currentMathProblem.answer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    clearInterval(gameState.mathTimerInterval);
    mathFeedback.textContent = '✓ Correct!';
    mathFeedback.style.color = '#4ade80';
    gameState.score += 50 * gameState.level;
    gameState.streak++;
    gameState.mathSolved++;
    
    // Level up on each correct answer
    gameState.level++;
    gameState.dropInterval = Math.max(50, 1000 - (gameState.level - 1) * 80);
    
    // Check for win condition
    if (gameState.level > 10) {
        gameWon();
        return;
    }
    
    if (gameState.streak >= 5) {
        gameState.score += 100;
        mathFeedback.textContent += ' Streak Bonus!';
    }
    
    mathFeedback.textContent += ` Level ${gameState.level}!`;
    
    setTimeout(() => {
        mathOverlay.style.display = 'none';
        gameState.isPaused = false;
        gameState.waitingForMath = false;
        spawnPiece();
    }, 1000);
}

function handleWrongAnswer() {
    clearInterval(gameState.mathTimerInterval);
    mathFeedback.textContent = `✗ Wrong! Answer: ${gameState.currentMathProblem.answer}`;
    mathFeedback.style.color = '#ef4444';
    gameState.streak = 0;
    
    // Only one garbage line as penalty
    addGarbageLines(1);
    
    setTimeout(() => {
        mathOverlay.style.display = 'none';
        gameState.isPaused = false;
        gameState.waitingForMath = false;
        spawnPiece();
    }, 1500);
}

function addGarbageLines(count) {
    for (let i = 0; i < count; i++) {
        gameState.board.shift();
        const garbageLine = Array(BOARD_WIDTH).fill(8);
        const hole = Math.floor(Math.random() * BOARD_WIDTH);
        garbageLine[hole] = 0;
        gameState.board.push(garbageLine);
    }
}

function spawnPiece() {
    gameState.currentPiece = new Piece();
    
    if (gameState.currentPiece.collision()) {
        gameOver();
    }
}

function checkLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (gameState.board[y].every(cell => cell !== 0)) {
            gameState.board.splice(y, 1);
            gameState.board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        gameState.lines += linesCleared;
        gameState.score += [0, 100, 300, 500, 800][linesCleared] * gameState.level;
        // No level up from clearing lines anymore - only from correct answers
    }
}

function gameOver() {
    gameState.isGameOver = true;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalLevel').textContent = gameState.level;
    document.getElementById('finalSolved').textContent = gameState.mathSolved;
    gameOverElement.style.display = 'block';
}

function gameWon() {
    gameState.isGameOver = true;
    gameState.isPaused = true;
    clearInterval(gameState.mathTimerInterval);
    
    // Hide math overlay if it's showing
    mathOverlay.style.display = 'none';
    
    // Show victory screen
    const victoryScreen = document.getElementById('victoryScreen');
    if (victoryScreen) {
        document.getElementById('victoryScore').textContent = gameState.score;
        document.getElementById('victorySolved').textContent = gameState.mathSolved;
        victoryScreen.style.display = 'block';
    }
}

function restartGame() {
    gameState = {
        board: Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)),
        currentPiece: null,
        score: 0,
        level: 1,
        lines: 0,
        streak: 0,
        mathSolved: 0,
        isGameOver: false,
        isPaused: false,
        dropTimer: 0,
        dropInterval: 800, // Start faster
        currentMathProblem: null,
        mathTimeLeft: 10,
        mathTimerInterval: null,
        waitingForMath: false
    };
    gameOverElement.style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
    mathOverlay.style.display = 'none';
    spawnPiece();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
        ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
    }
    
    // Draw placed pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (gameState.board[y][x]) {
                const color = gameState.board[y][x];
                ctx.fillStyle = color === 8 ? '#666' : COLORS[color - 1];
                ctx.fillRect(x * CELL_SIZE + 2, y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                
                // Add shine effect
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(x * CELL_SIZE + 2, y * CELL_SIZE + 2, CELL_SIZE - 4, 10);
            }
        }
    }
    
    // Draw current piece
    if (gameState.currentPiece && !gameState.waitingForMath) {
        const piece = gameState.currentPiece;
        ctx.fillStyle = COLORS[piece.color - 1];
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const drawX = (piece.x + x) * CELL_SIZE;
                    const drawY = (piece.y + y) * CELL_SIZE;
                    ctx.fillRect(drawX + 2, drawY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                    
                    // Add shine effect
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.fillRect(drawX + 2, drawY + 2, CELL_SIZE - 4, 10);
                    ctx.fillStyle = COLORS[piece.color - 1];
                }
            }
        }
        
        // Draw ghost piece
        const ghost = { ...piece };
        while (!collision(ghost.x, ghost.y + 1, ghost.shape)) {
            ghost.y++;
        }
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let y = 0; y < ghost.shape.length; y++) {
            for (let x = 0; x < ghost.shape[y].length; x++) {
                if (ghost.shape[y][x]) {
                    const drawX = (ghost.x + x) * CELL_SIZE;
                    const drawY = (ghost.y + y) * CELL_SIZE;
                    ctx.fillRect(drawX + 2, drawY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
                }
            }
        }
    }
}

function collision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const boardX = x + col;
                const boardY = y + row;
                
                if (boardX < 0 || boardX >= BOARD_WIDTH || 
                    boardY >= BOARD_HEIGHT ||
                    (boardY >= 0 && gameState.board[boardY][boardX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function update() {
    if (gameState.isGameOver || gameState.isPaused) return;
    
    // Update UI
    scoreElement.textContent = gameState.score;
    levelElement.textContent = gameState.level;
    linesElement.textContent = gameState.lines;
    streakElement.textContent = gameState.streak;
    
    // Handle piece dropping
    if (!gameState.waitingForMath) {
        gameState.dropTimer += 16; // 60 FPS
        if (gameState.dropTimer >= gameState.dropInterval) {
            if (gameState.currentPiece && !gameState.currentPiece.move(0, 1)) {
                gameState.currentPiece.place();
                checkLines();
                showMathProblem();
            }
            gameState.dropTimer = 0;
        }
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (e) => {
    if (gameState.isGameOver || !gameState.currentPiece || gameState.waitingForMath) return;
    
    switch(e.code) {
        case 'ArrowLeft':
            gameState.currentPiece.move(-1, 0);
            break;
        case 'ArrowRight':
            gameState.currentPiece.move(1, 0);
            break;
        case 'ArrowDown':
            if (gameState.currentPiece.move(0, 1)) {
                gameState.score++;
            }
            break;
        case 'ArrowUp':
            gameState.currentPiece.rotate();
            break;
        case 'KeyZ':
            // Rotate counterclockwise (3 clockwise rotations)
            gameState.currentPiece.rotate();
            gameState.currentPiece.rotate();
            gameState.currentPiece.rotate();
            break;
        case 'Space':
            e.preventDefault();
            let dropped = 0;
            while (gameState.currentPiece.move(0, 1)) {
                dropped++;
            }
            gameState.score += dropped * 2;
            break;
    }
});

// Math input handling
mathInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitAnswer();
    }
});

// Initialize game
spawnPiece();
gameLoop();