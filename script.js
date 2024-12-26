const board = document.getElementById('board');
        const levelElement = document.getElementById('level');
        const scoreElement = document.getElementById('score');
        const timerElement = document.getElementById('timer');
        const progressElement = document.getElementById('progress');
        const messageElement = document.getElementById('message');
        const pausedMessage = document.getElementById('paused-message');
        const pauseBtn = document.getElementById('pause-btn');
        const playBtn = document.getElementById('play-btn');
        const restartBtn = document.getElementById('restart-btn');

        let flippedCards = [];
        let matchedCards = 0;
        let score = 0;
        let level = 1;
        let timeLeft = 30;
        let timerInterval;
        let isPaused = false;

        const images = ['🍎', '🍌', '🍒', '🍍', '🍓', '🍊', '🍉', '🍇', '🥝', '🍋', '🍑', '🥭', '🍈', '🍏', '🥥', '🍐', '🍅', '🍆'];

        function shuffleCards() {
            const levelImages = images.slice(0, level + 2);
            const cardImages = [...levelImages, ...levelImages];
            cardImages.sort(() => Math.random() - 0.5);
            return cardImages;
        }

        function createCard(image) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        }

        function initializeGame() {
            board.innerHTML = '';
            let rows = level;
            let cols = 4;
            if (level >= 5) {
                cols = level;
            }
            const totalCards = rows * cols;
            const levelImages = images.slice(0, totalCards / 2);
            const cardImages = [...levelImages, ...levelImages];
            cardImages.sort(() => Math.random() - 0.5);
        
            
            board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        
            
            cardImages.forEach(createCard);
        
            matchedCards = 0;
            progressElement.style.width = '0%';
            resetTimer();
            startTimer();
        }
        
        function levelUp() {
            level++;
            levelElement.textContent = level;
            initializeGame();
        }
        

        function flipCard() {
            if (isPaused || flippedCards.length >= 2 || this.classList.contains('flipped')) return;

            this.classList.add('flipped');
            this.textContent = this.dataset.image;
            flippedCards.push(this);

            if (flippedCards.length === 2) setTimeout(checkMatch, 800);
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;

            if (card1.dataset.image === card2.dataset.image) {
                matchedCards += 2;
                score += 10;
                scoreElement.textContent = score;
                progressElement.style.width = `${(matchedCards / board.children.length) * 100}%`;

                if (matchedCards === board.children.length) levelUp();
            } else {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                    card.textContent = '';
                });
            }

            flippedCards = [];
        }

        function levelUp() {
            level++;
            levelElement.textContent = level;
            initializeGame();
        }

        function startTimer() {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    if (timeLeft > 0) {
                        timeLeft--;
                        timerElement.textContent = timeLeft;
                    } else {
                        clearInterval(timerInterval); 
                        endGame();
                    }
                }
            }, 1000);
        }
        

        function resetTimer() {
            clearInterval(timerInterval);
            timeLeft = 30;
            timerElement.textContent = timeLeft;
        }

        function endGame() {
            messageElement.textContent = 'Game Over! Try Again.';
            board.innerHTML = '';
        }

        function togglePause() {
            isPaused = !isPaused;
            if (isPaused) {
                clearInterval(timerInterval);
                pausedMessage.style.display = 'block';
                pauseBtn.disabled = true;
                playBtn.disabled = false;
            }
        }

        function togglePlay() {
            isPaused = false;
            pausedMessage.style.display = 'none';
            pauseBtn.disabled = false;
            playBtn.disabled = true;
            startTimer();
        }

        pauseBtn.addEventListener('click', togglePause);
        playBtn.addEventListener('click', togglePlay);

        restartBtn.addEventListener('click', () => {
            level = 1;
            score = 0;
            levelElement.textContent = level;
            scoreElement.textContent = score;
            messageElement.textContent = '';
            pausedMessage.style.display = 'none';
            initializeGame();
        });

        initializeGame();