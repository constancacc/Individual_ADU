function lerTextoCard() {
    // Verifica se o navegador suporta Speech Synthesis
    if ('speechSynthesis' in window) {
        // Seleciona os elementos de texto que irão ser lidos
        const section = document.querySelector('#text-box');
        const textos = section.querySelectorAll('.card-text'); // Seleciona os elementos <p> da descrição

        // Cria uma lista de utterances com cada frase da descrição
        const utterances = Array.from(textos).map(texto => {
            return new SpeechSynthesisUtterance(texto.textContent);
        });

        // Configurações para cada utterance
        utterances.forEach(utterance => {
            utterance.lang = 'en-US'; // Define o idioma para inglês
            utterance.rate = 1; // Velocidade da fala
        });

        let currentIndex = 0; // Índice atual da leitura
        let isPlaying = false; // Controla o estado de leitura

        // Função para adicionar o destaque ao texto
        function highlightElement(element) {
            element.classList.add('highlight');
        }

        // Função para remover o destaque do texto
        function removeHighlight(element) {
            element.classList.remove('highlight');
        }

        // Função para iniciar a leitura do elemento atual
        function startReadingCurrent() {
            if (currentIndex >= 0 && currentIndex < utterances.length) {
                const utterance = utterances[currentIndex];
                const element = textos[currentIndex];

                // Adiciona destaque no início
                highlightElement(element);

                // Quando terminar de ler, remove o destaque e avança para o próximo texto
                utterance.onend = () => {
                    removeHighlight(element);
                    currentIndex++;
                    // Continua automaticamente para o próximo elemento, se houver
                    if (currentIndex < utterances.length && isPlaying) {
                        startReadingCurrent();
                    } else {
                        togglePlayPause(); // Muda o botão para "Play" quando terminar
                    }
                };

                // Inicia a leitura do utterance atual
                window.speechSynthesis.speak(utterance);
            }
        }

        // Função para alternar entre play/pause
        function togglePlayPause() {
            const playPauseButton = document.querySelector('.play-pause img');
            if (isPlaying) {
                stopReading(); // Pausa a leitura
                playPauseButton.src = "../img/Play.png"; // Troca a imagem para "Play"
                playPauseButton.alt = "Play"; // Troca o alt para "Play"
            } else {
                startReadingCurrent(); // Retoma a leitura
                playPauseButton.src = "../img/Pause.png"; // Troca a imagem para "Pause"
                playPauseButton.alt = "Pause"; // Troca o alt para "Pause"
            }
            isPlaying = !isPlaying;
        }

        // Função para parar a leitura
        function stopReading() {
            window.speechSynthesis.cancel();
            if (currentIndex >= 0 && currentIndex < utterances.length) {
                removeHighlight(textos[currentIndex]); // Remove o highlight da frase atual
            }
            isPlaying = false;
            const playPauseButton = document.querySelector('.play-pause img');
            playPauseButton.src = "../img/Play.png"; // Troca a imagem de volta para "Play"
            playPauseButton.alt = "Play"; // Troca o alt para "Play"
        }

        // Função para avançar para o próximo elemento
        function nextElement() {
            stopReading();
            currentIndex = Math.min(currentIndex + 1, utterances.length - 1);
            if (isPlaying) startReadingCurrent();
        }

        // Função para voltar ao elemento anterior
        function previousElement() {
            stopReading();
            currentIndex = Math.max(currentIndex - 1, 0);
            if (isPlaying) startReadingCurrent();
        }

        // Seleciona os botões existentes
        const playPauseButton = document.querySelector('.play-pause img');
        const btnNext = document.querySelector('.next');
        const btnPrevious = document.querySelector('.previous');

        // Associa as funções aos botões
        playPauseButton.parentNode.onclick = togglePlayPause; // Play/Pause
        btnNext.onclick = nextElement; // Next
        btnPrevious.onclick = previousElement; // Previous
    } else {
        alert("Desculpe, seu navegador não suporta leitura de texto.");
    }
}

// Chama a função de leitura quando a página carrega
window.onload = lerTextoCard;
