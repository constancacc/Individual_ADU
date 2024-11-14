// Função para ler o texto da seção com destaque dinâmico
function lerTextoCard() {
    // Verifica se o navegador suporta Speech Synthesis
    if ('speechSynthesis' in window) {
        // Seleciona o elemento da seção
        const section = document.querySelector('.reader');
        const textos = section.querySelectorAll('.card-text'); // Seleciona todos os elementos <p> da descrição

        // Cria uma lista de utterances com cada frase da descrição
        const utterances = Array.from(textos).map(texto => {
            return new SpeechSynthesisUtterance(texto.textContent);
        });

        // Configurações para cada utterance
        utterances.forEach(utterance => {
            utterance.lang = 'en-US'; // Define o idioma para inglês
            utterance.rate = 1; // Velocidade da fala
        });

        let currentIndex = 0;
        let isPlaying = false; // Controla o estado de leitura

        // Função para adicionar e remover destaque
        function highlightElement(element) {
            element.classList.add('highlight');
        }

        function removeHighlight(element) {
            element.classList.remove('highlight');
        }

        // Função para iniciar a leitura do elemento atual
        function startReadingCurrent() {
            if (currentIndex >= 0 && currentIndex < utterances.length) {
                const utterance = utterances[currentIndex];
                const element = textos[currentIndex];

                // Adiciona destaque no início e remove no final
                utterance.onstart = () => highlightElement(element);
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
            if (isPlaying) {
                stopReading(); // Pausa a leitura
                playPauseButton.textContent = "Play";
            } else {
                startReadingCurrent(); // Retoma a leitura
                playPauseButton.textContent = "Pause";
            }
            isPlaying = !isPlaying;
        }

        // Função para parar a leitura
        function stopReading() {
            window.speechSynthesis.cancel();
            if (currentIndex >= 0 && currentIndex < utterances.length) {
                removeHighlight(textos[currentIndex]);
            }
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
        const playPauseButton = document.querySelector('.play-pause');
        const btnNext = document.querySelector('.next');
        const btnPrevious = document.querySelector('.previous');

        // Associa as funções aos botões
        playPauseButton.onclick = togglePlayPause;
        btnNext.onclick = nextElement;
        btnPrevious.onclick = previousElement;
    } else {
        alert("Desculpe, seu navegador não suporta leitura de texto.");
    }
}

// Chama a função de leitura quando a página carrega
window.onload = lerTextoCard;
