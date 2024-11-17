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
    const fontesDisponiveis = ['Verdana', 'Tahoma', 'Calibri', 'Helvetica', 'Times New Roman'];

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
        if (tamanhoFonteAtual > 14) { // Impede que o tamanho da fonte fique abaixo de 14px
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

    // ============================================
    // CONTROLE DE VELOCIDADE
    // ============================================
    let speechRate = 1; // Velocidade inicial da leitura (1 é a velocidade normal)

    // Cria e exibe a velocidade atual na página
    const speedDisplay = document.createElement('p');
    speedDisplay.id = "speed-display";
    speedDisplay.textContent = `Speed: ${speechRate.toFixed(1)}x`;
    document.querySelector('.reader-settings').appendChild(speedDisplay);

    // Função para ajustar a velocidade de leitura
    function adjustSpeechRate(change) {
        speechRate += change;

        // Garantir que a velocidade esteja dentro dos limites
        if (speechRate < 0.5) speechRate = 0.5;
        if (speechRate > 3) speechRate = 3;

        // Atualizar o texto de exibição da velocidade
        speedDisplay.textContent = `Speed: ${speechRate.toFixed(1)}x`;
    }

    // Função para diminuir a velocidade da leitura
    document.getElementById('menos-speed').addEventListener('click', function() {
        if (speechRate > 0.5) { // Impede que a velocidade seja menor que 0.5
            adjustSpeechRate(-0.1); // Diminui 0.1 na velocidade
        }
    });

    // Função para aumentar a velocidade da leitura
    document.getElementById('mais-speed').addEventListener('click', function() {
        if (speechRate < 3) { // Impede que a velocidade seja maior que 3
            adjustSpeechRate(0.1); // Aumenta 0.1 na velocidade
        }
    });

    // Função para iniciar a leitura do conteúdo
    function lerTextoCard() {
        if ('speechSynthesis' in window) {
            const section = document.querySelector('.full-card-content');
            const textos = section.querySelectorAll('.card-text'); // Seleciona os elementos <p> da descrição

            const utterances = Array.from(textos).map(texto => {
                const utterance = new SpeechSynthesisUtterance(texto.textContent);
                utterance.lang = 'en-US'; // Define o idioma para inglês
                utterance.rate = speechRate; // Define a velocidade da fala para a primeira frase
                return utterance;
            });

            let currentIndex = 0;
            let isPlaying = false;

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
                    utterance.rate = speechRate; // Garante que a velocidade será atualizada para cada frase
                    window.speechSynthesis.speak(utterance);

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
                            isPlaying = false;
                            togglePlayPauseButton(false);
                        }
                    };
                }
            }

            // Função para alternar entre play/pause
            function togglePlayPause() {
                if (isPlaying) {
                    stopReading();
                } else {
                    if (currentIndex >= utterances.length) {
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
                textos.forEach(removeHighlight);
            }

            // Atualiza o ícone do botão Play/Pause
            function togglePlayPauseButton(isPlaying) {
                const playPauseButton = document.querySelector('.play-pause img');
                if (isPlaying) {
                    playPauseButton.src = "../img/Pause.png";
                    playPauseButton.alt = "Pause";
                } else {
                    playPauseButton.src = "../img/Play.png";
                    playPauseButton.alt = "Play";
                }
            }

            // Função para avançar para o próximo elemento
            function nextElement() {
                if (currentIndex < utterances.length - 1) {
                    stopReading();
                    currentIndex++;
                    if (isPlaying) {
                        startReadingCurrent();
                    }
                }
            }

            // Função para voltar ao elemento anterior
            function previousElement() {
                if (currentIndex > 0) {
                    stopReading();
                    currentIndex--;
                    if (isPlaying) {
                        startReadingCurrent();
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
});
