document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const topScores = document.querySelector('.top-scores')
    const savedScores = document.querySelector('.saved-scores')
    const saveForm = document.getElementById('save-form')
    const saveScore = document.getElementById('save-score')

    const submitButton = document.getElementById('save-submit')
    submitButton.disabled = true;
    saveForm.hidden = true
    


    const url = "http://localhost:3000/scores"





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

    const theShapes = [lShape, zShape, tShape, oShape, iShape]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select a Shape and its first rotation
    let random = Math.floor(Math.random() * theShapes.length)
    console.log(random)

    let current = theShapes[random][currentRotation]
    draw()

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ""
        })
    }

    //make the tetromino move down every second
    // timerId = setInterval(moveDown, 1000)

    //assign funtions to keyCodes
    function control(e) {
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
            //start a new teromino falling
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

    //move left until it hits the wall
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    //move right until it hits the wall
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
        if (currentRotation === current.length) { //if current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theShapes[random][currentRotation]
        draw()
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    //the shapes without rotations
    const upNextShapes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],  //  lTetro
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetro
        [1, displayWidth, displayWidth + 1, displayWidth + 2],   // tTetro
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ]

    //display the shape in mini-grid
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
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
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theShapes.length)
            displayShape()
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                console.log("score", score)
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
            topScores.innerHTML = score

            saveScore.value = score

          
            submitButton.disabled = false
            // endGameAlert()

            saveForm.hidden = false;

            scoreDisplay.innerHTML = score + "\n GameOver! click submit to save score"

            clearInterval(timerId)
        }
    }


    fetch("http://localhost:3000/scores")
        .then(response => response.json())
        .then(scores => scores.forEach(showScores))

    function showScores(score) {
        let savedScore = document.createElement('li')
        savedScore.innerHTML = ` ${score.name}:   ${score.score}`
        savedScores.append(savedScore)
    }



    saveForm.addEventListener("submit", function () {
        // event.preventDefault()
        const formData = new FormData(saveForm)
        const name = formData.get("save-name")
        // const score = formData.get("save-score")
        const newScore = { name, score }
        console.log("name", name.value)
        console.log("score", score)

            


        showScores(newScore)

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
        saveForm.reset()
    })


})

