// Array para armazenar os participantes do sorteio
let participants = [];

// Função para extrair @usernames dos comentários
function extractUsernames(text) {
    // Regex para encontrar @usernames (Instagram permite letras, números, pontos e underscores)
    const usernameRegex = /@([a-zA-Z0-9._]+)/g;
    const matches = text.match(usernameRegex);

    if (!matches) return [];

    // Remove o @ e converte para lowercase para evitar duplicatas por case
    return matches.map(match => match.substring(1).toLowerCase());
}

// Função para atualizar a lista de participantes na interface
function updateParticipantsList() {
    const participantsList = document.getElementById('participantsList');
    const allowDuplicates = document.getElementById('allowDuplicates').checked;

    if (participants.length === 0) {
        participantsList.innerHTML = '<p class="placeholder">Nenhum comentário analisado ainda...</p>';
        return;
    }

    // Se não permitir duplicatas, usar Set para remover duplicados
    const displayParticipants = allowDuplicates ? participants : [...new Set(participants)];

    // Contar quantas vezes cada usuário aparece (apenas se permitir duplicatas)
    const userCounts = {};
    if (allowDuplicates) {
        participants.forEach(user => {
            userCounts[user] = (userCounts[user] || 0) + 1;
        });
    }

    // Criar HTML da lista
    const listHTML = displayParticipants.map(username => {
        const countText = allowDuplicates && userCounts[username] > 1
            ? ` <span class="count">(${userCounts[username]}x)</span>`
            : '';
        return `<div class="participant">@${username}${countText}</div>`;
    }).join('');

    participantsList.innerHTML = `
        <div class="participants-count">
            <strong>${displayParticipants.length} participante(s) encontrado(s)</strong>
            ${allowDuplicates && participants.length !== displayParticipants.length ?
            `<br><small>${participants.length} comentários totais</small>` : ''}
        </div>
        <div class="participants-grid">${listHTML}</div>
    `;
}

// Função para analisar comentários em tempo real
function analyzeComments() {
    const commentsText = document.getElementById('commentsInput').value;
    participants = extractUsernames(commentsText);
    updateParticipantsList();

    // Esconder resultado anterior se existir
    document.getElementById('resultSection').style.display = 'none';
}

// Função para realizar o sorteio
function performDraw() {
    const commentsText = document.getElementById('commentsInput').value.trim();

    if (!commentsText) {
        alert('⚠️ Por favor, cole os comentários do Instagram antes de realizar o sorteio!');
        return;
    }

    // Atualizar participantes
    participants = extractUsernames(commentsText);

    if (participants.length === 0) {
        alert('⚠️ Nenhum @username encontrado nos comentários. Verifique se os comentários estão no formato correto com @usuario.');
        return;
    }

    // Definir lista de participantes para o sorteio
    const allowDuplicates = document.getElementById('allowDuplicates').checked;
    const drawParticipants = allowDuplicates ? participants : [...new Set(participants)];

    // Realizar sorteio
    const randomIndex = Math.floor(Math.random() * drawParticipants.length);
    const winner = drawParticipants[randomIndex];

    // Mostrar resultado
    showResult(winner, drawParticipants.length);

    // Atualizar lista de participantes
    updateParticipantsList();
}

// Função para mostrar o resultado do sorteio
function showResult(winner, totalParticipants) {
    const resultSection = document.getElementById('resultSection');
    const winnerUsername = document.getElementById('winnerUsername');

    winnerUsername.textContent = `@${winner}`;
    resultSection.style.display = 'block';

    // Adicionar botão de copiar se não existir
    addCopyButtonToResult();

    // Scroll suave para o resultado
    resultSection.scrollIntoView({ behavior: 'smooth' });

    // Efeito de animação
    winnerUsername.style.transform = 'scale(0.8)';
    winnerUsername.style.opacity = '0';

    setTimeout(() => {
        winnerUsername.style.transform = 'scale(1)';
        winnerUsername.style.opacity = '1';
    }, 100);

    // Log para histórico (opcional)
    console.log(`🎉 Sorteio realizado! Vencedor: @${winner} (entre ${totalParticipants} participantes)`);
}

// Função para limpar tudo
function clearAll() {
    document.getElementById('commentsInput').value = '';
    participants = [];
    updateParticipantsList();
    document.getElementById('resultSection').style.display = 'none';
}

// Função para copiar resultado
function copyResult() {
    const winner = document.getElementById('winnerUsername').textContent;
    const text = `🏆 Vencedor do sorteio: ${winner}`;

    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Resultado copiado para a área de transferência!');
    }).catch(() => {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Resultado copiado para a área de transferência!');
    });
}

// Funções de importação de arquivo
function handleFileImport() {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        // Mostrar informações do arquivo
        fileInfo.style.display = 'block';
        fileInfo.className = 'file-info';
        fileInfo.innerHTML = `📄 Carregando: ${file.name}...`;

        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const content = e.target.result;
                let comments = '';

                // Verificar se é JSON ou TXT
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(content);
                    comments = processJsonFile(data);
                } else {
                    comments = content;
                }

                if (comments) {
                    // Inserir comentários no textarea
                    document.getElementById('commentsInput').value = comments;

                    // Analisar comentários
                    analyzeComments();

                    // Mostrar sucesso
                    fileInfo.className = 'file-info success';
                    fileInfo.innerHTML = `✅ Arquivo carregado: ${file.name}`;

                    // Esconder info após 3 segundos
                    setTimeout(() => {
                        fileInfo.style.display = 'none';
                    }, 3000);
                } else {
                    throw new Error('Nenhum comentário encontrado no arquivo');
                }

            } catch (error) {
                fileInfo.className = 'file-info error';
                fileInfo.innerHTML = `❌ Erro ao carregar arquivo: ${error.message}`;
            }
        };

        reader.onerror = function () {
            fileInfo.className = 'file-info error';
            fileInfo.innerHTML = '❌ Erro ao ler o arquivo';
        };

        reader.readAsText(file, 'utf-8');
    });
}

function processJsonFile(data) {
    // Processa arquivo JSON do extrator do Instagram
    try {
        // Formato do instagram_extractor.py
        if (data.comments && Array.isArray(data.comments)) {
            return data.comments.map(comment =>
                `@${comment.username} ${comment.text}`
            ).join('\n');
        }

        // Outros formatos possíveis
        if (Array.isArray(data)) {
            return data.map(item => {
                if (typeof item === 'string') return item;
                if (item.username && item.text) return `@${item.username} ${item.text}`;
                if (item.user && item.comment) return `@${item.user} ${item.comment}`;
                return JSON.stringify(item);
            }).join('\n');
        }

        // Se for string simples
        if (typeof data === 'string') {
            return data;
        }

        throw new Error('Formato JSON não reconhecido');

    } catch (error) {
        throw new Error(`Erro ao processar JSON: ${error.message}`);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Analisar comentários quando o texto mudar
    const commentsInput = document.getElementById('commentsInput');
    commentsInput.addEventListener('input', analyzeComments);

    // Atualizar lista quando a opção de duplicatas mudar
    const allowDuplicates = document.getElementById('allowDuplicates');
    allowDuplicates.addEventListener('change', updateParticipantsList);

    // Permitir Enter para realizar sorteio (Ctrl+Enter)
    commentsInput.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'Enter') {
            performDraw();
        }
    });

    // Configurar importação de arquivo
    handleFileImport();
});

// Funções utilitárias
function addCopyButtonToResult() {
    const resultSection = document.getElementById('resultSection');
    if (!resultSection.querySelector('.copy-button')) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 Copiar Resultado';
        copyButton.onclick = copyResult;

        const newDrawButton = document.getElementById('newDrawButton');
        resultSection.insertBefore(copyButton, newDrawButton);
    }
}