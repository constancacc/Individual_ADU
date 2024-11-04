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

        // Função para adicionar e remover destaque
        function highlightElement(element) {
            element.classList.add('highlight');
        }

        function removeHighlight(element) {
            element.classList.remove('highlight');
        }

        // Função para iniciar a leitura em sequência
        function startSequentialReading(index = 0) {
            if (index < utterances.length) {
                const { element, utterance } = utterances[index];

                // Adiciona destaque no início e remove no final
                utterance.onstart = () => highlightElement(element);
                utterance.onend = () => {
                    removeHighlight(element);
                    // Continua para o próximo item na sequência
                    startSequentialReading(index + 1);
                };

                // Inicia a leitura do utterance atual
                window.speechSynthesis.speak(utterance);
            }
        }

        // Inicia a leitura sequencial a partir do primeiro item
        startSequentialReading();

    } else {
        alert("Desculpe, seu navegador não suporta leitura de texto.");
    }
}
