// Função para ler o texto do card com destaque dinâmico
function lerTextoCard(botao) {
    // Verifica se o navegador suporta Speech Synthesis
    if ('speechSynthesis' in window) {
        // Seleciona o elemento do card
        const card = botao.closest('main');
        const titulo = card.querySelector('.card-title');
        const textos = card.querySelectorAll('.card-text'); // Seleciona todos os elementos <p> da descrição

        // Cria uma lista de utterances com o título e cada frase da descrição
        const utterances = [
            { element: titulo, utterance: new SpeechSynthesisUtterance(titulo.textContent) }
        ];

        textos.forEach(texto => {
            utterances.push({ element: texto, utterance: new SpeechSynthesisUtterance(texto.textContent) });
        });

        // Configurações para cada utterance
        utterances.forEach(({ utterance }) => {
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
                const { element, utterance } = utterances[currentIndex];

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
                removeHighlight(utterances[currentIndex].element);
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

        // Cria o container e os botões de controle
        const controlContainer = document.createElement('div');
        controlContainer.className = "controls";

        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = "Play";
        playPauseButton.onclick = togglePlayPause;

        const btnNext = document.createElement('button');
        btnNext.textContent = "Next";
        btnNext.onclick = nextElement;

        const btnPrevious = document.createElement('button');
        btnPrevious.textContent = "Previous";
        btnPrevious.onclick = previousElement;

        // Adiciona os botões de controle ao container e ao card
        controlContainer.appendChild(btnPrevious);
        controlContainer.appendChild(playPauseButton);
        controlContainer.appendChild(btnNext);
        card.appendChild(controlContainer);
    } else {
        alert("Desculpe, seu navegador não suporta leitura de texto.");
    }
}
