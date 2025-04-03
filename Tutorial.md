## Comandos

```sh
Valhodle\Scripts\activate

python manage.py makemigrations core
python manage.py migrate
python core/populate.py
python manage.py runserver
```
🔗 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

Atualizar o banco de dados com o site do Django

python manage.py dumpdata core.Pessoa --indent 4 > core/fixtures/pessoas.json

Atualizar o banco de dados apenas com os dados do pessoas.json

python manage.py loaddata core/fixtures/pessoas.json

## Jogo Django


{
  "jogador": "Sabrina",
  "modo": "normal"
}


{
  "jogo_id": 72,
  "tentativa": "Sabrina"
}


## Respostas

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