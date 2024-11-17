document.addEventListener('DOMContentLoaded', function () {
    // Botão de configurações e o aside das configurações
    const settingsButton = document.getElementById('settings');
    const settingsAside = document.querySelector('.reader-settings');

    // Adiciona evento de clique ao botão de configurações
    settingsButton.addEventListener('click', () => {
        settingsAside.classList.toggle('active');
        settingsButton.classList.toggle('btn-pressed');
    });

    // Referências para os botões de aumentar e diminuir o tamanho do texto
    const btnAumentar = document.getElementById('botao-menos-tamanho');
    const btnDiminuir = document.getElementById('botao-mais-tamanho');
    const pontos = document.getElementById('points'); // Mostra o tamanho atual da fonte
    const textosCard = document.querySelectorAll('.card-text'); // Seleciona todos os textos do card

    let tamanhoFonteAtual = 16; // Tamanho inicial da fonte (em px), você pode ajustar este valor se necessário
    let familiaFonteAtual = 'Verdana'; // Família de fonte inicial

    // Array de fontes disponíveis
    const fontesDisponiveis = ['Verdana', 'Tahoma', 'Calibri', 'Helvetica', 'Arial', 'Times New Roman'];

    // Função para atualizar o tamanho da fonte e a família de fontes
    function atualizarFonte() {
        // Atualiza o tamanho de cada texto no card
        textosCard.forEach(texto => {
            texto.style.fontSize = `${tamanhoFonteAtual}px`;
            texto.style.fontFamily = familiaFonteAtual; // Aplica a família de fonte
        });
        // Atualiza o texto que exibe o tamanho atual da fonte
        pontos.textContent = `Size: ${tamanhoFonteAtual}px`;

        if(tamanhoFonteAtual === 14){
            pontos.textContent = `Size: ${tamanhoFonteAtual}px (min size)`;
        }

        if(tamanhoFonteAtual === 20){
            pontos.textContent = `Size: ${tamanhoFonteAtual}px (max size)`;
        }
        // Atualiza a exibição do nome da fonte
        document.getElementById('font-name').textContent = `Current font: ${familiaFonteAtual}`;
    }

    // Função para aumentar o tamanho da fonte
    btnAumentar.addEventListener('click', function() {
        if (tamanhoFonteAtual < 20) { // Impede que o tamanho da fonte ultrapasse 20px
            tamanhoFonteAtual += 1; // Aumenta 1px no tamanho
            atualizarFonte(); // Atualiza o tamanho da fonte
        }
    });

    // Função para diminuir o tamanho da fonte
    btnDiminuir.addEventListener('click', function() {
        if (tamanhoFonteAtual > 14) { // Impede que o tamanho da fonte fique abaixo de 12px
            tamanhoFonteAtual -= 1; // Diminui 1px no tamanho
            atualizarFonte(); // Atualiza o tamanho da fonte
        }
    });

    // Função para alternar a família de fontes
    const btnTrocarFonte = document.querySelector('.double-width'); // Botão para trocar a fonte
    btnTrocarFonte.addEventListener('click', function() {
        // Encontrar o índice atual da fonte no array
        let indiceFonteAtual = fontesDisponiveis.indexOf(familiaFonteAtual);
        // Avança para a próxima fonte no array, e volta ao início quando atingir o final
        indiceFonteAtual = (indiceFonteAtual + 1) % fontesDisponiveis.length;
        familiaFonteAtual = fontesDisponiveis[indiceFonteAtual]; // Atualiza a família de fonte
        atualizarFonte(); // Atualiza o tamanho da fonte e a família de fontes
    });

    // Atualiza o tamanho inicial da fonte ao carregar a página
    atualizarFonte();
});

function lerTextoCard() {
    // Verifica se o navegador suporta Speech Synthesis
    if ('speechSynthesis' in window) {
        // Seleciona os elementos de texto que irão ser lidos
        const section = document.querySelector('.full-card-content');
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
        let currentUtterance = null; // Referência à utterance atual

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
                currentUtterance = utterance;

                // Remove qualquer destaque anterior
                textos.forEach(removeHighlight);

                // Destaca o texto atual
                highlightElement(textos[currentIndex]);

                // Quando terminar de ler, avança para o próximo texto
                utterance.onend = () => {
                    removeHighlight(textos[currentIndex]); // Remove o destaque ao terminar
                    currentIndex++;
                    if (currentIndex < utterances.length && isPlaying) {
                        startReadingCurrent();
                    } else if (currentIndex >= utterances.length) {
                        // Finaliza a leitura e prepara para reiniciar
                        isPlaying = false;
                        togglePlayPauseButton(false);
                        currentIndex = utterances.length; // Mantém o índice no fim
                    }
                };

                // Inicia a leitura do utterance atual
                window.speechSynthesis.speak(utterance);
            }
        }

        // Função para alternar entre play/pause
        function togglePlayPause() {
            if (isPlaying) {
                // Pausa a leitura
                stopReading();
            } else {
                // Retoma ou reinicia a leitura
                if (currentIndex >= utterances.length) {
                    // Reinicia do início se todas as frases já foram lidas
                    currentIndex = 0;
                }
                startReadingCurrent();
            }
            isPlaying = !isPlaying;
            togglePlayPauseButton(isPlaying);
        }

        // Função para parar a leitura
        function stopReading() {
            window.speechSynthesis.cancel();
            textos.forEach(removeHighlight); // Remove todos os destaques
        }

        // Atualiza o ícone do botão Play/Pause
        function togglePlayPauseButton(isPlaying) {
            const playPauseButton = document.querySelector('.play-pause img');
            if (isPlaying) {
                playPauseButton.src = "../img/Pause.png"; // Troca a imagem para "Pause"
                playPauseButton.alt = "Pause"; // Troca o alt para "Pause"
            } else {
                playPauseButton.src = "../img/Play.png"; // Troca a imagem para "Play"
                playPauseButton.alt = "Play"; // Troca o alt para "Play"
            }
        }

        // Função para avançar para o próximo elemento
        function nextElement() {
            if (currentIndex < utterances.length - 1) {
                stopReading(); // Para a leitura atual
                currentIndex++; // Avança para o próximo índice
                if (isPlaying) {
                    startReadingCurrent(); // Reinicia a leitura
                }
            }
        }

        // Função para voltar ao elemento anterior
        function previousElement() {
            if (currentIndex > 0) {
                stopReading(); // Para a leitura atual
                currentIndex--; // Volta para o índice anterior
                if (isPlaying) {
                    startReadingCurrent(); // Reinicia a leitura
                }
            }
        }

        // Seleciona os botões existentes
        const playPauseButton = document.querySelector('.play-pause img');
        const btnNext = document.querySelector('.next');
        const btnPrevious = document.querySelector('.previous');

        // Associa as funções aos botões
        playPauseButton.parentNode.onclick = togglePlayPause; // Play/Pause
        btnNext.onclick = nextElement; // Avançar
        btnPrevious.onclick = previousElement; // Retroceder
    } else {
        alert("Desculpe, seu navegador não suporta leitura de texto.");
    }
}

// Chama a função de leitura quando a página carrega
window.onload = lerTextoCard;
