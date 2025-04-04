from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Pessoa, Jogo
from django.shortcuts import render
from django.db.models import Avg, Count
import random

# Cria um novo jogo e escolhe um amigo aleatório como alvo
@api_view(['POST'])
def iniciar_jogo(request):
    jogador = request.data.get('jogador')
    modo = request.data.get('modo', 'normal')  # Padrão: modo normal

    if not jogador:
        return Response({'erro': 'Nome do jogador é obrigatório'}, status=400)
    
    if modo not in ['normal', 'frase']:
        return Response({'erro': 'Modo inválido. Escolha "normal" ou "frase".'}, status=400)

    alvo = random.choice(Pessoa.objects.all())  # Escolhe uma pessoa aleatória
    jogo = Jogo.objects.create(jogador=jogador, alvo=alvo, modo=modo)

    return Response({'mensagem': 'Jogo iniciado!', 'jogo_id': jogo.id, 'modo': modo})

# Verifica a tentativa do jogador e retorna as dicas
@api_view(['POST'])
def verificar_tentativa(request):
    jogo_id = request.data.get('jogo_id')
    tentativa_nome = request.data.get('tentativa')

    if not jogo_id or not tentativa_nome:
        return Response({'erro': 'ID do jogo e nome do amigo são obrigatórios'}, status=400)

    try:
        jogo = Jogo.objects.get(id=jogo_id, concluido=False)
    except Jogo.DoesNotExist:
        return Response({'erro': 'Jogo não encontrado ou já finalizado'}, status=404)


    tentativa = Pessoa.objects.filter(nome__iexact=tentativa_nome).first()

    if not tentativa:
        return Response({
            'mensagem': 'Amigo não encontrado!',
            'acertou': False,
            'tentativas': jogo.tentativas
        })

    jogo.tentativas += 1
    jogo.save()


    alvo = jogo.alvo

    feedback = {}
    if jogo.modo == "normal":
        for field in Pessoa._meta.fields:
            if field.name not in ["id"]:
                valor_tentativa = getattr(tentativa, field.name)
                valor_alvo = getattr(alvo, field.name)

                # Se ambos forem listas
                if isinstance(valor_tentativa, list) and isinstance(valor_alvo, list):
                    intersecao = set(valor_tentativa) & set(valor_alvo)
                    if intersecao:
                        correto = "certo" if set(valor_tentativa) == set(valor_alvo) else "meio"
                    else:
                        correto = "errado"
                
                # Se apenas o valor do alvo for lista
                elif isinstance(valor_alvo, list):
                    correto = "meio" if valor_tentativa in valor_alvo else "errado"

                # Se apenas o valor da tentativa for lista
                elif isinstance(valor_tentativa, list):
                    correto = "meio" if valor_alvo in valor_tentativa else "errado"

                # Ambos são valores simples
                else:
                    correto = "certo" if valor_tentativa == valor_alvo else "errado"

                feedback[field.name] = {
                    "valor": valor_tentativa,
                    "correto": correto,
                    "valorCorreto": valor_alvo
                }
    
    elif jogo.modo == "frase":
        feedback = {
            "frase": {
                "valor": tentativa.frase,
                "correto": tentativa.frase == alvo.frase
            }
        }

    if tentativa == alvo:
        jogo.concluido = True
        jogo.save()

        for key in feedback:
           feedback[key]["correto"] = "certo"

        return Response({
            'mensagem': 'Parabéns! Você acertou!', 
            'acertou': True, 
            'feedback': feedback, 
            'tentativas': jogo.tentativas
        })

    return Response({
        'mensagem': 'Tente novamente!', 
        'acertou': False, 
        'feedback': feedback, 
        'tentativas': jogo.tentativas
    })

@api_view(['GET'])
def ranking(request):
    stats = (
        Jogo.objects.filter(concluido=True)
        .values('jogador')
        .annotate(
            jogos=Count('id'),
            media_tentativas=Avg('tentativas')
        )
        .order_by('media_tentativas')[:10]
    )

    return Response(stats)

def pessoas_view(request):
    pessoas = Pessoa.objects.all()
    campos = [field.name for field in Pessoa._meta.get_fields() if field.name != "id"] 
    
    return render(request, 'pessoas.html', {'pessoas': pessoas, 'campos': campos})