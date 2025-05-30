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

#### Exportar dados do banco de dados do servidor Django para JSON local:
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
1. Navegue até a pasta fixtures:
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

## Deploy no Render

O projeto está hospedado no Render, com os seguintes serviços:

- Frontend: https://valhodle.onrender.com/

- Backend: https://valhodlebackend.onrender.com/

### Backend

Em ambiente de produção (Render), o backend utiliza um banco PostgreSQL fornecido pelo Neon (console.neon.tech), por meio de uma variável de ambiente DATABASE_URL configurada no Render.

Em ambiente de desenvolvimento local, o backend utiliza SQLite3 por padrão.

O arquivo db.sqlite3 não é commitado no repositório (está no .gitignore) para evitar conflitos de versão e preservar a consistência dos dados de ranking e jogos.

### Start Command no Render

O servidor executa automaticamente os seguintes comandos definidos no campo Start Command do Render:
```sh
python manage.py migrate && python core/fixtures/pessoas.py && python manage.py loaddata core/fixtures/pessoas.json && gunicorn backend.wsgi:application --bind 0.0.0.0:10000 --log-file -
```
Ou seja:

- As migrações versionadas (criadas com makemigrations e salvas no repositório) são aplicadas automaticamente no banco de dados do servidor.

- O script pessoas.py é executado em seguida. Ele é responsável por buscar os dados atualizados da planilha do Google Sheets e gerar o arquivo pessoas.json na pasta core/fixtures.

- O arquivo pessoas.json é carregado com o comando loaddata no banco sem apagar dados existentes (como os jogos e rankings), pois o arquivo db.sqlite3 não é enviado para o Git — ele está corretamente listado no .gitignore.
---

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

## Criação de Superusuário

### Ambiente local
Para criar um superusuário localmente, utilize o terminal com o comando padrão do Django:

```bash
python manage.py createsuperuser
```

Siga as instruções para informar nome de usuário, e-mail e senha.

### Ambiente de produção (Render)
Como o Render não possui acesso direto ao terminal, a criação do superusuário é feita automaticamente via script.

O script createsuperuser.py está localizado em:
backend/createsuperuser.py

Esse script é executado durante o processo de build e cria um superusuário apenas se ele ainda não existir.

Para rodar esse script vá em Settings > Start Command e adicione o comando ```&& python createsuperuser.py ``` para rodar esse comando de criação.

Lembre-se de configurar as variáveis no Render: 
- `DJANGO_SUPERUSER_USERNAME`
- `DJANGO_SUPERUSER_EMAIL`
- `DJANGO_SUPERUSER_PASSWORD`

---

## Notas adicionais
- Certifique-se de que o backend esteja rodando antes de iniciar o frontend para garantir que as requisições funcionem corretamente.
- Caso precise modificar configurações do Django, edite o arquivo `settings.py` em `valhodle/backend/`.
- Para configurar variáveis de ambiente no frontend, crie um arquivo `.env` na pasta `valhodle/frontend/` e adicione as configurações necessárias.

---
