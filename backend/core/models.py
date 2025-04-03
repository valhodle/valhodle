from django.db import models

# Define as tabelas do banco de dados
class Pessoa(models.Model):

    nome = models.CharField(max_length=100)
    ano = models.IntegerField(default=0)
    oculos = models.BooleanField(default=False)


    def __str__(self):
        return self.nome

    def get_oculos_display(self):
        return "Usa" if self.oculos else "Não usa"

    def get_feedback(self):
        feedback = {}
        for field in self._meta.fields:
            if field.name not in ["id"]:
                valor = getattr(self, field.name)

                if isinstance(valor, bool):
                    valor = getattr(self, f'get_{field.name}_display')()

                feedback[field] = valor 

        return feedback


class Jogo(models.Model):
    MODOS = {
        ('normal', 'Normal'),
        ('frase', 'Frase'),
    }

    jogador = models.CharField(max_length=100)
    alvo = models.ForeignKey(Pessoa, on_delete=models.CASCADE, related_name='jogos_como_alvo')
    tentativas = models.IntegerField(default=0)
    concluido = models.BooleanField(default=False)
    data = models.DateTimeField(auto_now_add=True)
    modo = models.CharField(max_length=10, choices=MODOS, default='normal')

    def __str__(self):
        return f"{self.jogador} ({self.modo}) tentando {self.alvo.nome}"
