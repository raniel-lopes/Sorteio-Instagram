const https = require('https');
const fs = require('fs');

/**
 * Extrator de comentários do Instagram usando Node.js
 * Como alternativa ao Python quando não está disponível
 */

async function extractInstagramComments(url) {
    console.log('🎯 Instagram Comments Extractor (Node.js)');
    console.log('='.repeat(50));

    try {
        // Extrair shortcode da URL
        const shortcode = extractShortcode(url);
        if (!shortcode) {
            throw new Error('URL inválida. Use o formato: https://www.instagram.com/p/SHORTCODE/');
        }

        console.log(`📥 Extraindo post: ${shortcode}`);

        // Fazer requisição para o Instagram
        const postData = await fetchInstagramPost(shortcode);

        if (!postData) {
            throw new Error('Não foi possível acessar o post. Verifique se o post é público.');
        }

        // Processar comentários
        const comments = processComments(postData);

        // Salvar arquivos
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const txtFile = `sorteio_comments_${timestamp}.txt`;
        const jsonFile = `instagram_comments_${timestamp}.json`;

        // Salvar arquivo para sorteio (.txt)
        const commentsText = comments.map(c => `@${c.username} ${c.text}`).join('\n');
        fs.writeFileSync(txtFile, commentsText, 'utf8');

        // Salvar dados completos (.json)
        const fullData = {
            url: url,
            shortcode: shortcode,
            extracted_at: new Date().toISOString(),
            comment_count: comments.length,
            comments: comments
        };
        fs.writeFileSync(jsonFile, JSON.stringify(fullData, null, 2), 'utf8');

        console.log(`✅ ${comments.length} comentários extraídos!`);
        console.log(`📁 Arquivo para sorteio: ${txtFile}`);
        console.log(`📁 Dados completos: ${jsonFile}`);
        console.log('\n🎉 Agora você pode:');
        console.log('   1. Abrir http://localhost:3000');
        console.log(`   2. Importar o arquivo: ${txtFile}`);
        console.log('   3. Realizar o sorteio!');

        return { txtFile, jsonFile, comments };

    } catch (error) {
        console.error(`❌ Erro: ${error.message}`);
        console.log('\n💡 Alternativa: Copie os comentários manualmente do Instagram');
        console.log('   e cole no sistema web em http://localhost:3000');
        return null;
    }
}

function extractShortcode(url) {
    const match = url.match(/\/p\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

async function fetchInstagramPost(shortcode) {
    return new Promise((resolve, reject) => {
        // URL pública do Instagram para posts
        const url = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        };

        https.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode === 200) {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            resolve(null);
        });
    });
}

function processComments(postData) {
    const comments = [];

    try {
        // Tentar diferentes estruturas de dados do Instagram
        const media = postData?.graphql?.shortcode_media ||
            postData?.items?.[0] ||
            postData;

        if (!media) return comments;

        // Extrair comentários da estrutura
        const commentsData = media?.edge_media_to_comment?.edges ||
            media?.comments?.data ||
            [];

        commentsData.forEach(edge => {
            const comment = edge?.node || edge;
            if (comment?.owner?.username && comment?.text) {
                comments.push({
                    username: comment.owner.username,
                    text: comment.text,
                    created_at: comment.created_at || new Date().toISOString(),
                    likes: comment.edge_liked_by?.count || 0
                });
            }
        });

    } catch (error) {
        console.log('⚠️ Estrutura de dados não reconhecida, tentando extração simples...');
    }

    return comments;
}

// Função principal
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('❌ Por favor, forneça a URL do post do Instagram');
        console.log('💡 Uso: node extractor.js https://www.instagram.com/p/SHORTCODE/');
        process.exit(1);
    }

    const url = args[0];
    await extractInstagramComments(url);
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { extractInstagramComments };