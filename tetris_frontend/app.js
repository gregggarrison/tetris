
document.addEventListener('DOMContentLoaded', () => {

    const url = "http://localhost:3000/scores"

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))

    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const savedScores = document.querySelector('.saved-scores')
    const levelDisplay = document.querySelector('#level')
    const plusButton = document.getElementById('plus')
    const minusButton = document.getElementById('minus')
    const flipCard = document.querySelector('.flip-card-inner')
    const abort = document.getElementById('toggle-button')
    const back = document.querySelector('.back-image')

    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    let speed = 1000

    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    const lShape = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zShape = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tShape = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oShape = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iShape = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const jShape = [
        [0, 1, width + 1, width * 2 + 1],
        [width, width + 1, width + 2, 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, 0, 1, 2]
    ]
    
    const sShape = [
        [2, width + 1, width * 2 + 1, width + 2],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width * 2, width + 1, 1],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
    ]
    
    const theShapes = [lShape, zShape, tShape, oShape, iShape, jShape, sShape]
    
    let currentPosition = 4
    let currentRotation = 0
    
    let random = Math.floor(Math.random() * theShapes.length)
    
    let current = theShapes[random][currentRotation]
    levelDisplay.innerHTML = 1
    
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0


    abort.addEventListener('click', () => {
        flipCard.classList.toggle('is-flipped')
    })

    back.addEventListener('click', () => {
        flipCard.classList.toggle('is-flipped')
    })

    plusButton.addEventListener('click', () => {
        levelDisplay.innerHTML++
        speed -= 250
    })

    minusButton.addEventListener('click', () => {
        levelDisplay.innerHTML--
        speed += 250
    })

    draw()

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ""
        })
    }

    function control(e) {
        e.preventDefault()
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }

    document.addEventListener('keyup', control)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theShapes.length)
            current = theShapes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theShapes[random][currentRotation]
        draw()
    }

    const upNextShapes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
        [0, 1, displayWidth + 1, displayWidth * 2 + 1],
        [2, displayWidth + 1, displayWidth * 2 + 1, displayWidth + 2]
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ""
        })
        upNextShapes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            startButton.innerText = "Start"
            minusButton.hidden = false
            plusButton.hidden = false
            timerId = null

        } else {
            draw()
            timerId = setInterval(moveDown, speed)
            nextRandom = Math.floor(Math.random() * theShapes.length)
            startButton.innerText = "Pause"
            minusButton.hidden = true
            plusButton.hidden = true
            displayShape()
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += (10 * levelDisplay.innerHTML)
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ""
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))

            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = score
            const name = prompt(`GameOver! your score was ${score}! Enter name and submit to save!`)

            fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    score: score
                })
            })
            clearInterval(timerId)
            location.reload()
        }
    }

    async function showScores() {
        let response = await fetch(url);
        let scores = await response.json();
        scores = scores.sort(function (a, b) {
            return b.score - a.score
        })

        scores.splice(10)
        scores.forEach(score => {
            let savedScore = document.createElement('li')
            savedScore.innerHTML = ` ${score.name}:   ${score.score}`
            savedScores.append(savedScore)
        })
    }

    showScores()
})

