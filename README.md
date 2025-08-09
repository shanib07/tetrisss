# 🧮 Math Tetris: Educational Gaming Challenge

A unique fusion of classic Tetris gameplay with mental math challenges. Players must solve mathematical problems to progress through levels while managing falling blocks. Win by reaching Level 10!

## 🎮 Live Demo
[Play Math Tetris](#) *(Add your deployment URL here)*

## 🏆 Hackathon Submission
**Project Name:** Math Tetris  
**Category:** Educational Gaming / EdTech  
**Team:** Solo Developer  

## 📸 Screenshots
![Math Tetris Gameplay](screenshot.png) *(Add screenshot after deployment)*

## 🎯 Game Concept

Math Tetris combines the addictive gameplay of Tetris with educational value. Every time you place a Tetris piece, you must solve a math problem within 10 seconds to continue. The game progressively increases in difficulty, testing both your puzzle-solving skills and mathematical abilities.

### Win Condition
- **Objective:** Reach Level 10 by solving math problems correctly
- **Challenge:** Balance Tetris gameplay while solving increasingly complex math problems
- **Educational Value:** Improves mental math, BODMAS understanding, and quick thinking

## 🚀 Features

### Core Gameplay
- ✅ Classic Tetris mechanics with smooth controls
- ✅ Progressive difficulty system (Levels 1-10)
- ✅ Math problems appear after placing each piece
- ✅ 10-second timer for solving problems (decreases at higher levels)
- ✅ Victory screen upon reaching Level 10

### Math Challenges
- **Levels 1-2:** Basic addition/subtraction
- **Levels 3-4:** Multiplication tables
- **Level 5+:** BODMAS operations (Order of Operations)
- **Level 6+:** Complex calculations with brackets
- **Level 7+:** Percentage calculations
- **Level 8+:** Multi-step problems
- **Level 9-10:** Advanced mental math challenges

### Game Mechanics
- **Correct Answer:** Level up + continue playing
- **Wrong Answer:** 1 garbage line penalty
- **Streak System:** 5+ correct answers = bonus points
- **Ghost Piece:** Preview where your piece will land
- **Responsive Controls:** Smooth piece movement and rotation

## 🎮 How to Play

### Controls
- **← →** - Move piece left/right
- **↑** - Rotate clockwise
- **Z** - Rotate counterclockwise
- **↓** - Soft drop (faster fall)
- **Space** - Hard drop (instant placement)

### Gameplay Flow
1. Play Tetris normally - move and place blocks
2. When a piece is placed, a math problem appears
3. Solve the problem within the time limit
4. Correct answer = Level up & continue
5. Wrong answer = Garbage line added
6. Reach Level 10 to win!

## 🛠️ Tech Stack

- **Frontend:** Pure JavaScript, HTML5 Canvas
- **Styling:** CSS3 with gradient backgrounds
- **Server:** Node.js + Express
- **No external game libraries** - Built from scratch!

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Setup

1. Clone the repository
```bash
git clone https://github.com/[your-username]/math-tetris.git
cd math-tetris
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

4. Open your browser and navigate to
```
http://localhost:3000
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel
```

### Deploy to Netlify

1. Build the project
```bash
# No build step needed for this project
```

2. Drag and drop the project folder to Netlify

### Deploy to GitHub Pages

1. Create a `gh-pages` branch
2. Push the code
3. Enable GitHub Pages in repository settings

### Deploy to Heroku

1. Create a `Procfile`:
```
web: node server.js
```

2. Deploy to Heroku:
```bash
heroku create your-app-name
git push heroku main
```

## 📂 Project Structure

```
math-tetris/
│
├── index.html          # Main HTML file with game canvas
├── game.js            # Core game logic and mechanics
├── server.js          # Express server for local hosting
├── package.json       # Node.js dependencies
├── README.md          # Project documentation
└── .gitignore        # Git ignore file
```

## 🎯 Educational Benefits

1. **Mental Math Skills:** Improves calculation speed and accuracy
2. **BODMAS Understanding:** Teaches order of operations
3. **Problem Solving:** Combines spatial and mathematical reasoning
4. **Time Management:** Decisions under pressure
5. **Pattern Recognition:** Both in Tetris and mathematical patterns

## 🏗️ Architecture Decisions

- **No Framework:** Pure JavaScript for maximum performance and learning
- **Canvas API:** Direct rendering for smooth gameplay
- **Modular Design:** Separate concerns (rendering, game logic, math generation)
- **Progressive Difficulty:** Carefully balanced to maintain engagement

## 🔮 Future Enhancements

- [ ] Multiplayer mode with math battles
- [ ] Custom difficulty settings
- [ ] More problem types (fractions, algebra)
- [ ] Achievement system
- [ ] Global leaderboard
- [ ] Mobile responsive design
- [ ] Sound effects and music
- [ ] Practice mode for specific math topics
- [ ] Teacher dashboard for classroom use

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Tetris game
- Built for educational purposes
- Special thanks to the hackathon organizers

## 📊 Hackathon Metrics

- **Development Time:** 1 day
- **Lines of Code:** ~550
- **Educational Impact:** Combines entertainment with learning
- **Innovation:** Unique combination of classic gaming with education
- **Scalability:** Easy to add new math topics and difficulty levels

## 📞 Contact

**Developer:** [Your Name]  
**GitHub:** [@your-username](https://github.com/your-username)  
**Project Link:** [https://github.com/your-username/math-tetris](https://github.com/your-username/math-tetris)

---

<p align="center">Made with ❤️ for Hackathon 2024</p>
<p align="center">⭐ Star this repository if you find it helpful!</p>