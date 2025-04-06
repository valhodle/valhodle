# Valhodle

Este projeto contém o backend e o frontend do Valhodle.

## Como rodar o Frontend

O frontend está localizado na pasta `valhodle/frontend` e usa React.

### 1. Instalar dependências
Antes de rodar o frontend, instale as dependências:
```sh
cd valhodle/frontend
npm install
```
### 2. Rode a build do frontend
```sh
npm run build
```

### 3. Rode o servidor de desenvolvimento
Para iniciar o frontend, execute:
```sh
npm start
```
O aplicativo estará disponível em `http://localhost:3000/`.

---

## Como rodar o Backend

O backend está localizado na pasta `valhodle/backend` e usa Django.

### 1. Instalar dependências
Antes de rodar o backend, certifique-se de ter o Python instalado e, se necessário, crie um ambiente virtual:
```sh
cd valhodle/backend
python -m venv venv
source venv/bin/activate  # No Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Criar e atualizar o banco de dados
Antes de rodar o servidor, o banco de dados precisa estar configurado corretamente:
```sh
python manage.py makemigrations core  
python manage.py migrate             
```
Esses comandos garantem que a estrutura do banco esteja atualizada com os modelos do Django.

### 3. Rodar o servidor
Para iniciar o backend, execute:
```sh
python manage.py runserver
```
O servidor estará disponível em `http://127.0.0.1:8000/`.

### 4. Atualizar o banco de dados

#### Exportar dados do banco de dados para JSON:
Se precisar atualizar os dados de pessoas.json a partir do servidor Django, use:
```sh
python manage.py dumpdata core.Pessoa --indent 4 > core/fixtures/pessoas.json
```

#### Carregar dados do arquivo JSON no banco:
Se precisar atualizar os dados do servidor Django a partir do pessoas.json salvo, use:
```sh
python manage.py loaddata core/fixtures/pessoas.json
```

#### Atualizar o banco de dados com dados do Google Sheets:
Se precisar atualizar o banco de dados com os dados do Google Sheets, siga os passos:
1. Navegue até a pasta correta:
```sh
cd Valhodle/backend/core/fixtures
```
2. Execute o script `pessoas.py` para atualizar `pessoas.json`:
```sh
python pessoas.py
```
3. Carregue os novos dados no banco em `/backend`:
```sh
cd ../..
python manage.py loaddata core/fixtures/pessoas.json
```

Lembre-se de rodar as migrações novamente:
```sh
python manage.py makemigrations core
python manage.py migrate
python manage.py runserver
```

### 5. Testar Endpoints
Para testar o backend, envie requisições para os endpoints da API no site do Django:

#### Iniciar um jogo
Endpoint: `POST /api/jogo/iniciar`
```json
{
  "jogador": "Sabrina",
  "modo": "normal"
}
```

#### Verificar uma tentativa
Endpoint: `POST /api/jogo/tentar`
```json
{
  "jogo_id": 72,
  "tentativa": "Sabrina"
}
```

#### As respostas podem ser

```json
{
    "mensagem": "Amigo não encontrado!",
    "acertou": false,
    "tentativas": 1
}


{
    "mensagem": "Parabéns! Você acertou!",
    "acertou": true,
    "feedback": {
        "nome": {
            "valor": "Timtim",
            "correto": true
        },
        "ano": {
            "valor": 2002,
            "correto": true
        },
        "oculos": {
            "valor": "Usa",
            "correto": true
        }
    },
    "tentativas": 4
}
```
---

## Para adicionar uma nova categoria
1. Vá até `C:\Projetos\Valhodle\backend\core\models.py` e adicione a categoria na classe `Pessoa`.
2. Atualize o nome do atributo em `C:\Projetos\Valhodle\frontend\src\components\feedback.js`.
3. Rode os seguintes comandos para adicionar o atributo ao banco de dados:
```sh
python manage.py makemigrations core
python manage.py migrate
```
4. Adicione essa nova coluna com o nome do modelo na planilha do Google Sheets, caso ela ainda não esteja lá.
5. Atualize o script `pessoas.py` com a nova categoria.
6. Rode o script `pessoas.py` em `C:\Projetos\Valhodle\backend\core\fixtures\pessoas.py`.
6. Atualize o banco de dados com:
```sh
python manage.py loaddata core/fixtures/pessoas.json
```
7. Rode o server  com:
```sh
python manage.py runserver
```

---

## Notas adicionais
- Certifique-se de que o backend esteja rodando antes de iniciar o frontend para garantir que as requisições funcionem corretamente.
- Caso precise modificar configurações do Django, edite o arquivo `settings.py` em `valhodle/backend/`.
- Para configurar variáveis de ambiente no frontend, crie um arquivo `.env` na pasta `valhodle/frontend/` e adicione as configurações necessárias.

---


