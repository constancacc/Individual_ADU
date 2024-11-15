function lerTextoCard() {
    if ('speechSynthesis' in window) {
        const section = document.querySelector('.reader');
        const textos = section.querySelectorAll('.card-text');
        const linkText = document.getElementById('link-text');

        let currentIndex = 0;
        let isPlaying = false;

        const playPauseButton = document.querySelector('.play-pause img');
        const nextButton = document.querySelector('.next');
        const previousButton = document.querySelector('.previous');

        // Esconde todos os textos inicialmente
        function hideAllTexts() {
            textos.forEach(texto => texto.style.display = 'none');
            linkText.style.display = 'none';
        }

        // Função que lê o texto atual
        function readCurrentText() {
            if (currentIndex < textos.length) {
                hideAllTexts();
                textos[currentIndex].style.display = 'block';

                const utterance = new SpeechSynthesisUtterance(textos[currentIndex].textContent);
                utterance.lang = 'en-US';
                utterance.rate = 1;

                utterance.onend = () => {
                    textos[currentIndex].style.display = 'none';
                    currentIndex++;
                    
                    // Só avança automaticamente se estiver no modo "Play"
                    if (isPlaying && currentIndex < textos.length) {
                        readCurrentText();
                    } else if (currentIndex >= textos.length) {
                        showFinalLink(); // Mostra o link no final
                    }
                };

                window.speechSynthesis.speak(utterance);
            }
        }

        // Função para mostrar o link final
        function showFinalLink() {
            stopReading();
            linkText.style.display = 'block';
        }

        // Avança para o próximo texto e pausa
        function nextText() {
            stopReading();
            if (currentIndex < textos.length - 1) {
                textos[currentIndex].style.display = 'none';
                currentIndex++;
                textos[currentIndex].style.display = 'block';
            }
        }

        // Volta para o texto anterior e pausa
        function previousText() {
            stopReading();
            if (currentIndex > 0) {
                textos[currentIndex].style.display = 'none';
                currentIndex--;
                textos[currentIndex].style.display = 'block';
            }
        }

        // Alterna entre Play e Pause
        function togglePlayPause() {
            if (isPlaying) {
                stopReading();
                playPauseButton.src = "../img/play.png";
                playPauseButton.alt = "Play";
            } else {
                isPlaying = true;
                playPauseButton.src = "../img/pause.png";
                playPauseButton.alt = "Pause";
                readCurrentText();
            }
        }

        // Para a leitura em andamento
        function stopReading() {
            window.speechSynthesis.cancel();
            isPlaying = false;
            playPauseButton.src = "../img/play.png";
            playPauseButton.alt = "Play";
        }

        // Função para ativar o clique nos botões usando Enter ou Espaço
        function handleKeyboardEvent(event, action) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                action();
            }
        }

        // Eventos de clique e teclado para acessibilidade
        playPauseButton.parentNode.addEventListener('click', togglePlayPause);
        playPauseButton.parentNode.addEventListener('keydown', (event) => handleKeyboardEvent(event, togglePlayPause));

        nextButton.addEventListener('click', nextText);
        nextButton.addEventListener('keydown', (event) => handleKeyboardEvent(event, nextText));

        previousButton.addEventListener('click', previousText);
        previousButton.addEventListener('keydown', (event) => handleKeyboardEvent(event, previousText));

        hideAllTexts();
        textos[currentIndex].style.display = 'block';
    } else {
        alert("Desculpe, seu navegador não suporta leitura de texto.");
    }
}

// Inicializa a função quando a página for carregada
document.addEventListener('DOMContentLoaded', lerTextoCard);


/*--------- botões das settings-----------------*/

// Selecionar os botões
const increaseButton = document.querySelector('#mais-tamanho');
const decreaseButton = document.querySelector('#menos-tamanho');

// Selecionar os textos da seção "reader"
const textElements = document.querySelectorAll('.reader .card-text');

// Definir tamanho inicial e limites
let currentFontSize = 19; // Tamanho padrão (em px)
const minFontSize = 16; // Tamanho mínimo permitido
const maxFontSize = 32; // Tamanho máximo permitido

// Função para ajustar o tamanho da fonte
function adjustFontSize(change) {
    currentFontSize += change;

    // Garantir que o tamanho esteja dentro dos limites
    if (currentFontSize < minFontSize) currentFontSize = minFontSize;
    if (currentFontSize > maxFontSize) currentFontSize = maxFontSize;

    // Aplicar o novo tamanho aos elementos de texto
    textElements.forEach((element) => {
        element.style.fontSize = `${currentFontSize}px`;
    });
}

// Adicionar eventos de clique aos botões
increaseButton.addEventListener('click', () => adjustFontSize(2)); // Aumentar tamanho
decreaseButton.addEventListener('click', () => adjustFontSize(-2)); // Diminuir tamanho

/*------ MUDAR A FONTE -----------*/
const changeFontButton = document.querySelector('.double-width');
const fontNameElement = document.querySelector('#font-name');


// Lista de fontes
const fonts = ['Tahoma', 'Calibri', 'Helvetica', 'Arial', 'Verdana', 'Times New Roman'];

// Índice atual
let currentFontIndex = 0;

// Função para mudar a fonte
function changeFont() {
    // Atualizar o índice da fonte
    currentFontIndex = (currentFontIndex + 1) % fonts.length; // Alterna entre 0 e o tamanho da lista

    // Aplicar a nova fonte nos elementos de texto
    textElements.forEach((element) => {
        element.style.fontFamily = fonts[currentFontIndex];
    });

    // Atualizar o nome da fonte no elemento abaixo do botão
    fontNameElement.textContent = `Current font: ${fonts[currentFontIndex]}`;
}

// Adicionar o evento de clique ao botão
changeFontButton.addEventListener('click', changeFont);
