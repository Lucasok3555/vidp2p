// Gerenciamento de Servidores
class ServerManager {
    constructor() {
        this.servers = this.loadServers();
        this.activeServer = this.servers[0] || null;
    }

    loadServers() {
        const saved = localStorage.getItem('videoServers');
        return saved ? JSON.parse(saved) : [];
    }

    saveServers() {
        localStorage.setItem('videoServers', JSON.stringify(this.servers));
    }

    addServer(address) {
        if (!address.trim()) {
            alert('Digite um endereço válido!');
            return false;
        }
        
        // Verifica se o servidor já existe
        if (this.servers.includes(address)) {
            alert('Este servidor já está na lista!');
            return false;
        }

        this.servers.push(address);
        this.saveServers();
        
        if (!this.activeServer) {
            this.activeServer = address;
        }
        
        return true;
    }

    removeServer(address) {
        const index = this.servers.indexOf(address);
        if (index > -1) {
            this.servers.splice(index, 1);
            this.saveServers();
            
            // Se removeu o servidor ativo, seleciona outro
            if (this.activeServer === address) {
                this.activeServer = this.servers[0] || null;
            }
            
            return true;
        }
        return false;
    }

    getActiveServer() {
        return this.activeServer;
    }

    getAllServers() {
        return this.servers;
    }
}

// Gerenciamento de Vídeos
class VideoManager {
    constructor(serverManager) {
        this.serverManager = serverManager;
    }

    async uploadVideo(file, title) {
        const server = this.serverManager.getActiveServer();
        
        if (!server) {
            throw new Error('Nenhum servidor configurado!');
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);

        try {
            const response = await fetch(`${server}/upload.php`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro no upload');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error(`Erro ao fazer upload: ${error.message}`);
        }
    }

    async loadVideos() {
        const videos = [];
        const servers = this.serverManager.getAllServers();

        for (const server of servers) {
            try {
                const response = await fetch(`${server}/videos.php`);
                if (response.ok) {
                    const serverVideos = await response.json();
                    videos.push(...serverVideos.map(v => ({...v, server})));
                }
            } catch (error) {
                console.error(`Erro ao carregar vídeos de ${server}:`, error);
            }
        }

        return videos;
    }
}

// UI Manager
class UIManager {
    constructor(serverManager, videoManager) {
        this.serverManager = serverManager;
        this.videoManager = videoManager;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderServersList();
        this.loadAndDisplayVideos();
    }

    setupEventListeners() {
        // Upload de vídeo
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleVideoUpload();
        });

        // Adicionar servidor
        document.getElementById('addServerBtn').addEventListener('click', () => {
            this.handleAddServer();
        });

        // Enter no campo de servidor
        document.getElementById('serverAddress').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddServer();
            }
        });
    }

    handleAddServer() {
        const input = document.getElementById('serverAddress');
        const address = input.value.trim();

        if (this.serverManager.addServer(address)) {
            input.value = '';
            this.renderServersList();
            this.showMessage('uploadStatus', 'Servidor adicionado com sucesso!', 'success');
            setTimeout(() => this.showMessage('uploadStatus', '', ''), 3000);
        }
    }

    renderServersList() {
        const list = document.getElementById('serversList');
        const servers = this.serverManager.getAllServers();

        if (servers.length === 0) {
            list.innerHTML = '<li class="empty-message">Nenhum servidor configurado</li>';
            return;
        }

        list.innerHTML = servers.map(server => `
            <li>
                <span>${server}</span>
                <button onclick="app.ui.removeServer('${server}')">Remover</button>
            </li>
        `).join('');
    }

    removeServer(address) {
        if (confirm(`Deseja realmente remover o servidor ${address}?`)) {
            this.serverManager.removeServer(address);
            this.renderServersList();
            this.loadAndDisplayVideos();
        }
    }

    async handleVideoUpload() {
        const fileInput = document.getElementById('videoFile');
        const titleInput = document.getElementById('videoTitle');
        const file = fileInput.files[0];
        const title = titleInput.value.trim();

        if (!file || !title) {
            this.showMessage('uploadStatus', 'Preencha todos os campos!', 'error');
            return;
        }

        this.showMessage('uploadStatus', 'Enviando vídeo...', '');

        try {
            await this.videoManager.uploadVideo(file, title);
            this.showMessage('uploadStatus', 'Vídeo enviado com sucesso!', 'success');
            
            // Limpa o formulário
            fileInput.value = '';
            titleInput.value = '';
            
            // Recarrega os vídeos
            setTimeout(() => {
                this.loadAndDisplayVideos();
            }, 1000);
            
        } catch (error) {
            this.showMessage('uploadStatus', error.message, 'error');
        }
    }

    async loadAndDisplayVideos() {
        const feedDiv = document.getElementById('videoFeed');
        feedDiv.innerHTML = '<div class="empty-message">Carregando vídeos...</div>';

        try {
            const videos = await this.videoManager.loadVideos();
            
            if (videos.length === 0) {
                feedDiv.innerHTML = '<div class="empty-message">Nenhum vídeo disponível</div>';
                return;
            }

            feedDiv.innerHTML = videos.map(video => `
                <div class="video-item">
                    <video controls>
                        <source src="${video.server}/${video.path}" type="video/mp4">
                        Seu navegador não suporta vídeos.
                    </video>
                    <div class="video-info">
                        <h4>${video.title}</h4>
                        <p>Enviado em: ${new Date(video.uploaded_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            feedDiv.innerHTML = '<div class="empty-message">Erro ao carregar vídeos</div>';
            console.error(error);
        }
    }

    showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = type;
    }
}

// Inicialização da aplicação
const app = {
    serverManager: null,
    videoManager: null,
    ui: null
};

document.addEventListener('DOMContentLoaded', () => {
    app.serverManager = new ServerManager();
    app.videoManager = new VideoManager(app.serverManager);
    app.ui = new UIManager(app.serverManager, app.videoManager);
});
