#!/usr/bin/env python3
"""
Instagram Comments Extractor
Extrai comentários de posts do Instagram para uso no sistema de sorteio.
"""

import instaloader
import json
import sys
import os
from datetime import datetime
import argparse

class InstagramCommentsExtractor:
    def __init__(self):
        self.loader = instaloader.Instaloader()
        
    def extract_shortcode_from_url(self, url):
        """Extrai o shortcode do post a partir da URL do Instagram."""
        try:
            # Formatos possíveis:
            # https://www.instagram.com/p/SHORTCODE/
            # https://instagram.com/p/SHORTCODE/
            if '/p/' in url:
                shortcode = url.split('/p/')[1].split('/')[0]
                return shortcode
            elif '/reel/' in url:
                shortcode = url.split('/reel/')[1].split('/')[0]
                return shortcode
            else:
                print("❌ URL inválida. Use uma URL no formato: https://www.instagram.com/p/SHORTCODE/")
                return None
        except Exception as e:
            print(f"❌ Erro ao processar URL: {e}")
            return None
    
    def extract_comments(self, post_url, max_comments=None, login_user=None, login_password=None):
        """
        Extrai comentários de um post do Instagram.
        
        Args:
            post_url (str): URL do post do Instagram
            max_comments (int): Número máximo de comentários (None = todos)
            login_user (str): Usuário para login (opcional)
            login_password (str): Senha para login (opcional)
        
        Returns:
            dict: Dados dos comentários extraídos
        """
        shortcode = self.extract_shortcode_from_url(post_url)
        if not shortcode:
            return None
        
        try:
            # Login se credenciais fornecidas
            if login_user and login_password:
                print(f"🔐 Fazendo login como {login_user}...")
                self.loader.login(login_user, login_password)
                print("✅ Login realizado com sucesso!")
            
            # Carregar post
            print(f"📥 Carregando post: {shortcode}")
            post = instaloader.Post.from_shortcode(self.loader.context, shortcode)
            
            # Extrair informações do post
            post_info = {
                'url': post_url,
                'shortcode': shortcode,
                'owner': post.owner_username,
                'caption': post.caption[:100] + '...' if post.caption and len(post.caption) > 100 else post.caption,
                'likes': post.likes,
                'comment_count': post.comments,
                'extracted_at': datetime.now().isoformat(),
                'comments': []
            }
            
            print(f"📊 Post de @{post.owner_username}")
            print(f"❤️ {post.likes} curtidas, 💬 {post.comments} comentários")
            print(f"📝 Extraindo comentários...")
            
            # Extrair comentários
            comment_count = 0
            for comment in post.get_comments():
                if max_comments and comment_count >= max_comments:
                    break
                
                comment_data = {
                    'username': comment.owner.username,
                    'text': comment.text,
                    'created_at': comment.created_at_utc.isoformat(),
                    'likes': comment.likes_count if hasattr(comment, 'likes_count') else 0
                }
                
                post_info['comments'].append(comment_data)
                comment_count += 1
                
                # Mostrar progresso
                if comment_count % 50 == 0:
                    print(f"📥 {comment_count} comentários extraídos...")
            
            print(f"✅ {comment_count} comentários extraídos com sucesso!")
            return post_info
            
        except instaloader.exceptions.LoginRequiredException:
            print("❌ Login necessário para acessar este post.")
            print("💡 Use: python extractor.py URL_DO_POST --login SEU_USUARIO")
            return None
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            print("❌ Perfil privado - você precisa seguir este usuário.")
            return None
        except Exception as e:
            print(f"❌ Erro ao extrair comentários: {e}")
            return None
    
    def save_to_file(self, data, filename=None):
        """Salva os dados extraídos em arquivo JSON."""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"instagram_comments_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"💾 Dados salvos em: {filename}")
            return filename
        except Exception as e:
            print(f"❌ Erro ao salvar arquivo: {e}")
            return None
    
    def create_sorteio_format(self, data, output_file=None):
        """Cria arquivo formatado para o sistema de sorteio."""
        if not data or not data.get('comments'):
            return None
        
        # Extrair apenas usernames únicos
        usernames = []
        for comment in data['comments']:
            username = comment['username']
            text = comment['text']
            usernames.append(f"@{username} {text}")
        
        # Criar conteúdo formatado
        content = "\n".join(usernames)
        
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"sorteio_comments_{timestamp}.txt"
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"🎯 Arquivo para sorteio criado: {output_file}")
            print(f"📊 {len(usernames)} comentários formatados")
            return output_file
        except Exception as e:
            print(f"❌ Erro ao criar arquivo de sorteio: {e}")
            return None

def main():
    parser = argparse.ArgumentParser(description='Extrator de Comentários do Instagram')
    parser.add_argument('url', help='URL do post do Instagram')
    parser.add_argument('--max-comments', type=int, help='Número máximo de comentários para extrair')
    parser.add_argument('--login', help='Usuário do Instagram para login')
    parser.add_argument('--password', help='Senha do Instagram')
    parser.add_argument('--output', help='Nome do arquivo de saída')
    parser.add_argument('--json-only', action='store_true', help='Salvar apenas JSON (não criar arquivo de sorteio)')
    
    args = parser.parse_args()
    
    print("🎯 Instagram Comments Extractor")
    print("=" * 50)
    
    extractor = InstagramCommentsExtractor()
    
    # Extrair comentários
    data = extractor.extract_comments(
        args.url, 
        max_comments=args.max_comments,
        login_user=args.login,
        login_password=args.password
    )
    
    if not data:
        sys.exit(1)
    
    # Salvar JSON completo
    json_file = extractor.save_to_file(data, args.output)
    
    # Criar arquivo para sorteio (se não for apenas JSON)
    if not args.json_only:
        sorteio_file = extractor.create_sorteio_format(data)
        
        print("\n🎉 Extração concluída!")
        print(f"📁 Arquivo JSON: {json_file}")
        print(f"🎯 Arquivo para sorteio: {sorteio_file}")
        print("\n💡 Agora você pode:")
        print("   1. Copiar o conteúdo do arquivo .txt")
        print("   2. Colar no sistema de sorteio web")
        print("   3. Realizar o sorteio!")

if __name__ == "__main__":
    main()