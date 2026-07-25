# 🎯 Sorteio Instagram

Sistema completo para realizar sorteios entre comentários do Instagram com extração automática!

## 🚀 Funcionalidades

### 🌐 Sistema Web
- ✅ Extração automática de @usernames dos comentários
- 🎲 Sorteio aleatório justo
- 🔄 Opção para permitir ou não usuários duplicados
- 📱 Interface responsiva e moderna
- 📋 Botão para copiar resultado
- ⚡ Análise em tempo real dos comentários
- 📁 **NOVO:** Importação de arquivos de comentários

### 🐍 Extrator Automático Python
- 🔍 **NOVO:** Extrai comentários automaticamente de posts do Instagram
- 📊 Salva dados completos em JSON
- � Gera arquivo formatado para o sistema de sorteio
- 🔐 Suporte a login para posts privados
- ⚡ Processamento rápido e eficiente

## 📦 Instalação e Uso

### Método 1: Extração Automática (Recomendado)

1. **Execute o setup automático:**
   ```bash
   # No Windows
   setup.bat
   
   # Ou manualmente
   pip install -r requirements.txt
   ```

2. **Extrair comentários de um post:**
   ```bash
   python instagram_extractor.py https://www.instagram.com/p/SHORTCODE/
   ```

3. **Usar o arquivo no sistema web:**
   - Abra `index.html` no navegador
   - Clique em "📁 Importar arquivo de comentários"
   - Selecione o arquivo `.txt` gerado
   - Realize o sorteio!

### Método 2: Manual (Tradicional)

1. **Abra o arquivo `index.html` no seu navegador**
2. **Cole os comentários** do seu post do Instagram no campo de texto
3. **Configure** se deseja permitir usuários duplicados
4. **Clique em "Realizar Sorteio"**
5. **Copie o resultado** e anuncie o ganhador!

## � Opções do Extrator Python

```bash
# Extração básica
python instagram_extractor.py URL_DO_POST

# Limitar número de comentários
python instagram_extractor.py URL_DO_POST --max-comments 100

# Com login (para posts privados)
python instagram_extractor.py URL_DO_POST --login seu_usuario --password sua_senha

# Salvar apenas JSON (sem arquivo de sorteio)
python instagram_extractor.py URL_DO_POST --json-only

# Especificar arquivo de saída
python instagram_extractor.py URL_DO_POST --output meus_comentarios.json
```

## 📋 Exemplos de uso

### URLs suportadas:
```
https://www.instagram.com/p/SHORTCODE/
https://instagram.com/p/SHORTCODE/
https://www.instagram.com/reel/SHORTCODE/
```

### Exemplo de comentários extraídos:
```
@joao123 Quero participar do sorteio!
@maria_silva Adorei o post! Participando 🎉
@carlos_01 Boa sorte galera!
@ana_123 Muito legal! Quero ganhar 😍
@joao123 Compartilhando nos stories também!
```

## 🛠️ Estrutura do projeto

```
📦 Sorteio-Instagram
├── 📄 index.html              # Interface principal do sistema web
├── 🎨 style.css               # Estilização responsiva
├── ⚙️ script.js               # Lógica do sorteio e importação
├── 🐍 instagram_extractor.py  # Extrator automático de comentários
├── 📋 requirements.txt        # Dependências Python
├── 🚀 setup.bat              # Script de instalação automática
├── 📊 exemplo_comentarios.json # Arquivo de exemplo para testes
└── 📖 README.md               # Esta documentação
```

## 💡 Dicas de uso

### Para o Sistema Web:
- **Copie diretamente** os comentários do Instagram
- O sistema identifica automaticamente todos os **@usernames**
- Use a opção de **"permitir duplicados"** se quiser dar mais chances para quem comentou várias vezes
- Você pode **sortear quantas vezes quiser** com o mesmo conjunto de comentários
- O resultado pode ser **copiado** facilmente para colar em outros lugares

### Para o Extrator Python:
- **Sem login**: Funciona apenas com posts públicos
- **Com login**: Acessa posts de perfis que você segue
- **Rate limiting**: O Instagram pode limitar requisições muito frequentes
- **Arquivos grandes**: Para posts com muitos comentários, use `--max-comments`

## 🔧 Funcionalidades técnicas

- Regex avançada para identificar usernames válidos do Instagram
- Validação de entrada de dados e URLs
- Interface responsiva para mobile e desktop
- Processamento de arquivos JSON e TXT
- Animações suaves e feedback visual
- Prevenção de erros com validações robustas
- Suporte a diferentes formatos de dados

## 📱 Compatibilidade

### Sistema Web:
- ✅ Chrome/Edge/Firefox/Safari
- ✅ Mobile (iOS/Android)
- ✅ Não requer instalação
- ✅ Funciona offline após o primeiro carregamento

### Extrator Python:
- ✅ Windows/Mac/Linux
- ✅ Python 3.7+
- ✅ Funciona com posts públicos e privados (com login)

## ⚠️ Avisos Importantes

- **Respeite os termos de uso** do Instagram
- **Use com moderação** para evitar rate limiting
- **Posts privados** requerem que você siga o usuário
- **Alguns posts** podem ter comentários desabilitados
- **Mantenha suas credenciais seguras** se usar login

## 🆘 Solução de Problemas

### "Login necessário"
- Use a opção `--login` com suas credenciais
- Certifique-se de seguir o perfil se for privado

### "Erro ao extrair comentários"
- Verifique se a URL está correta
- Teste com um post público primeiro
- Verifique sua conexão com a internet

### "Python não encontrado"
- Instale Python em https://python.org/downloads/
- Marque "Add Python to PATH" durante a instalação

---

**Desenvolvido para facilitar sorteios transparentes e justos no Instagram! 🎉**