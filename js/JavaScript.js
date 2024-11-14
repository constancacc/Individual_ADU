function lerTextoCard() {
    if ('speechSynthesis' in window) {
        const section = document.querySelector('.reader');
        const textos = section.querySelectorAll('.card-text'); // Seleciona todos os elementos com a classe 'card-text'

        let currentIndex = 0; // Inicia com o primeiro parágrafo
        let isPlaying = false; // Controla se está tocando ou pausado
        const playPauseButton = document.querySelector('.play-pause');

        // Função para exibir o próximo parágrafo
        function showNextText() {
            if (currentIndex < textos.length) {
                // Mostra o texto atual
                textos[currentIndex].style.display = 'block';

                // Cria a "utterance" para a fala
                const utterance = new SpeechSynthesisUtterance(textos[currentIndex].textContent);
                utterance.lang = 'en-US'; // Define o idioma para inglês
                utterance.rate = 1; // Velocidade da fala

                // Quando terminar de ler o parágrafo, oculta o texto e avança para o próximo
                utterance.onend = () => {
                    textos[currentIndex].style.display = 'none'; // Oculta o texto lido
                    currentIndex++; // Avança para o próximo índice
                    showNextText(); // Continua com a leitura do próximo parágrafo
                };

                // Inicia a leitura do próximo parágrafo
                window.speechSynthesis.speak(utterance);
            } else {
                // Se acabou os textos, define o botão de Play/Pause como "Play"
                playPauseButton.textContent = "Play"; 
                isPlaying = false;
            }
        }

        // Função para alternar play/pause
        function togglePlayPause() {
            if (isPlaying) {
                stopReading();
                playPauseButton.textContent = "Play";
            } else {
                showNextText(); // Começa a ler os parágrafos
                isPlaying = true;
                playPauseButton.textContent = "Pause";
            }
        }

        // Função para parar a leitura
        function stopReading() {
            window.speechSynthesis.cancel(); // Cancela a leitura em andamento
            isPlaying = false;
            playPauseButton.textContent = "Play"; // Reverte para "Play" após parar
        }

        // Inicializa a leitura quando o botão de play/pause for clicado
        playPauseButton.addEventListener('click', togglePlayPause);
    } else {
        alert("Desculpe, seu navegador não suporta leitura de texto.");
    }
}

// Inicializa a função quando a página for carregada
document.addEventListener('DOMContentLoaded', lerTextoCard);
