# Sistema de Feed de Vídeos

Sistema completo para upload, armazenamento e exibição de vídeos com múltiplos servidores.

## 📁 Estrutura do Projeto

### Cliente (Frontend)
- `index.html` - Página principal
- `style.css` - Estilos da aplicação
- `script.js` - Lógica do cliente

### Servidor (Backend - PHP)
- `upload.php` - API para upload de vídeos
- `videos.php` - API para listar vídeos
- `videos/` - Diretório onde os vídeos são armazenados (criado automaticamente)
- `videos.json` - Banco de dados JSON com metadados dos vídeos

## 🚀 Instalação

### Requisitos
- Servidor web com PHP 7.0 ou superior
- Apache/Nginx configurado
- Permissões de escrita no diretório

### Configuração do Servidor

1. **Copie os arquivos PHP para seu servidor:**
```bash
- upload.php
- videos.php
```

2. **Configure as permissões:**
```bash
chmod 755 upload.php videos.php
chmod 777 videos/ (este diretório será criado automaticamente)
```

3. **Configure o PHP.ini (opcional, para vídeos maiores):**
```ini
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
```

### Configuração do Cliente

1. **Abra o arquivo `index.html` em um navegador**

2. **Adicione o endereço do seu servidor:**
   - Clique em "Adicionar Servidor"
   - Digite o endereço completo: `http://seudominio.com/api`
   - Clique em "Adicionar Servidor"

## 📖 Como Usar

### Adicionar um Servidor
1. Na seção "Gerenciar Servidores"
2. Digite o endereço completo do servidor (ex: `http://exemplo.com`)
3. Clique em "Adicionar Servidor"
4. O servidor aparecerá na lista abaixo

### Remover um Servidor
1. Na lista de servidores
2. Clique no botão "Remover" ao lado do servidor desejado
3. Confirme a remoção

### Fazer Upload de Vídeo
1. Na seção "Upload de Vídeo"
2. Clique em "Escolher arquivo" e selecione um vídeo
3. Digite um título para o vídeo
4. Clique em "Enviar Vídeo"
5. Aguarde a confirmação do upload

### Visualizar Vídeos
- Os vídeos aparecem automaticamente no feed
- Clique no player para reproduzir
- Os vídeos são carregados de todos os servidores configurados

## 🔧 Funcionalidades

### Cliente
✅ Upload de vídeos com título  
✅ Gerenciamento de múltiplos servidores  
✅ Feed de vídeos com player integrado  
✅ Armazenamento local da lista de servidores  
✅ Interface responsiva  
✅ Feedback visual de operações  

### Servidor
✅ Recebe e armazena vídeos  
✅ Validação de tipo de arquivo  
✅ Limite de tamanho (100MB padrão)  
✅ Metadados em JSON  
✅ API RESTful  
✅ CORS habilitado  

## 🎨 Tipos de Vídeo Suportados
- MP4 (video/mp4)
- MPEG (video/mpeg)
- QuickTime (video/quicktime)
- AVI (video/x-msvideo)
- WebM (video/webm)

## 🔒 Segurança

### Validações Implementadas
- Verificação de tipo MIME
- Limite de tamanho de arquivo
- Validação de título
- Nomes únicos de arquivo
- Proteção contra path traversal

### Recomendações Adicionais
- Use HTTPS em produção
- Implemente autenticação
- Configure rate limiting
- Faça backup regular dos vídeos
- Monitore o espaço em disco

## 📊 API Endpoints

### POST /upload.php
Faz upload de um vídeo

**Parâmetros:**
- `video` (file) - Arquivo de vídeo
- `title` (string) - Título do vídeo

**Resposta de sucesso (201):**
```json
{
  "success": true,
  "message": "Vídeo enviado com sucesso",
  "video": {
    "id": "unique_id",
    "title": "Título do vídeo",
    "filename": "video_xyz.mp4",
    "path": "videos/video_xyz.mp4",
    "size": 1024000,
    "mime_type": "video/mp4",
    "uploaded_at": "2026-01-28 10:30:00",
    "original_name": "meu_video.mp4"
  }
}
```

### GET /videos.php
Lista todos os vídeos

**Resposta de sucesso (200):**
```json
[
  {
    "id": "unique_id",
    "title": "Título do vídeo",
    "filename": "video_xyz.mp4",
    "path": "videos/video_xyz.mp4",
    "size": 1024000,
    "mime_type": "video/mp4",
    "uploaded_at": "2026-01-28 10:30:00",
    "original_name": "meu_video.mp4"
  }
]
```

## 🐛 Solução de Problemas

### Erro: "Nenhum servidor configurado"
- Adicione pelo menos um servidor na seção "Gerenciar Servidores"

### Erro: "Arquivo muito grande"
- Verifique o limite no PHP.ini
- Redimensione o vídeo antes do upload

### Vídeos não aparecem no feed
- Verifique se o servidor está acessível
- Confirme que o CORS está habilitado
- Verifique o console do navegador para erros

### Erro 500 no upload
- Verifique as permissões do diretório
- Confirme que o PHP tem permissão de escrita
- Verifique os logs do servidor

## 📝 Licença

Projeto livre para uso educacional e comercial.

## 👨‍💻 Desenvolvimento

Desenvolvido com:
- HTML5
- CSS3
- JavaScript (ES6+)
- PHP 7+
- LocalStorage API
- Fetch API
