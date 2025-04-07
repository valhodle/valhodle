from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Pessoa, Jogo
from django.shortcuts import render
from django.db.models import Avg, Count
import random
from datetime import datetime, timedelta
import hashlib
import traceback
from django.http import JsonResponse
from django.utils.timezone import now
from zoneinfo import ZoneInfo

def escolher_alvo_diario():
    pessoas = list(Pessoa.objects.only('id', 'nome'))

    if not pessoas:
        return None

    agora_br = datetime.now(ZoneInfo("America/Sao_Paulo"))
    hoje = agora_br.strftime("%Y%m%d")
    seed = int(hashlib.sha256(hoje.encode()).hexdigest(), 16)
    random.seed(seed)

    return random.choice(pessoas)

def listar_nomes_pessoas(request):
    if request.method == "GET":
        nomes = list(Pessoa.objects.values_list('nome', flat=True))
        return JsonResponse(nomes, safe=False)

@api_view(['POST'])
def iniciar_jogo(request):
    try:
        jogador = request.data.get('jogador', '').strip()
        if jogador == "jogador_anonimo":
            is_anonimo = True
        else:
            is_anonimo = False
        
        modo = request.data.get('modo', 'normal')

        print("Requisição recebida para iniciar jogo")
        print("Jogador:", jogador)
        print("Modo:", modo)

        if modo not in ['normal', 'frase']:
            print("Erro: Modo inválido. Escolha normal ou frase.")
            return Response({'erro': 'Modo inválido. Escolha \"normal\" ou \"frase\".'}, status=400)

        alvo = escolher_alvo_diario()
        print("Alvo escolhido:", alvo)

        if not alvo:
            print("Erro: Nenhuma pessoa cadastrada como alvo.")
            return Response({'erro': 'Nenhuma pessoa cadastrada como alvo.'}, status=500)

        if not is_anonimo:
            hoje = now().date()
            jogo_existente = Jogo.objects.filter(
                jogador__iexact=jogador,
                alvo=alvo,
                concluido=True,
                data__date=hoje
            ).first()
            
            print(is_anonimo)
            print(hoje)
            print(jogo_existente)  
        else:
            jogo_existente = None  
        
        agora = datetime.now()
        meia_noite = (agora + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        segundos_restantes = int((meia_noite - agora).total_seconds())

        if jogo_existente:
            feedback = {}
            if modo == "normal":
                for field in Pessoa._meta.fields:
                    if field.name not in ["id"]:
                        valor_alvo = getattr(alvo, field.name)
                        feedback[field.name] = {
                            "valor": valor_alvo,
                            "correto": "certo",
                            "valorCorreto": valor_alvo
                        }
            elif modo == "frase":
                feedback = {
                    "frase": {
                        "valor": alvo.frase,
                        "correto": True
                    }
                }
            print(feedback)
            print("Jogador já jogou hoje.")
            return Response({
                'mensagem': 'Você já jogou hoje! Aqui está sua jogada registrada.',
                'jogo_id': jogo_existente.id, 
                'acertou': True,
                'feedback': feedback,
                'tentativas': jogo_existente.tentativas,
                'tempo_restante': segundos_restantes
            })

        jogo = Jogo.objects.create(jogador=jogador, alvo=alvo, modo=modo)
        print("Novo jogo criado:", jogo.id)

        return Response({
            'mensagem': 'Jogo iniciado!',
            'jogo_id': jogo.id,
            'modo': modo,
            'tempo_restante': segundos_restantes 
        })

    except Exception as e:
        print("Erro ao iniciar o jogo:", e)
        print(traceback.format_exc()) 
        return Response({'erro': 'Erro ao iniciar o jogo'}, status=500)

@api_view(['POST'])
def verificar_tentativa(request):
    jogo_id = request.data.get('jogo_id')
    tentativa_nome = request.data.get('tentativa')

    if not jogo_id or not tentativa_nome:
        print('ID do jogo e nome do amigo são obrigatórios')
        return Response({'erro': 'ID do jogo e nome do amigo são obrigatórios'}, status=400)

    try:
        jogo = Jogo.objects.get(id=jogo_id, concluido=False)
    except Jogo.DoesNotExist:
        print('Jogo não encontrado ou já finalizado')
        return Response({'erro': 'Jogo não encontrado ou já finalizado'}, status=404)

    tentativa = Pessoa.objects.filter(nome__iexact=tentativa_nome).first()

    if not tentativa:
        print('Amigo não encontrado!')
        return Response({
            'mensagem': 'Amigo não encontrado!',
            'acertou': False,
            'tentativas': jogo.tentativas
        })

    
    jogo.tentativas += 1
    print(jogo.tentativas)
    jogo.save()

    alvo = jogo.alvo

    feedback = {}
    if jogo.modo == "normal":
        for field in Pessoa._meta.fields:
            if field.name not in ["id"]:
                valor_tentativa = getattr(tentativa, field.name)
                valor_alvo = getattr(alvo, field.name)

                if isinstance(valor_tentativa, list) and isinstance(valor_alvo, list):
                    intersecao = set(valor_tentativa) & set(valor_alvo)
                    if intersecao:
                        correto = "certo" if set(valor_tentativa) == set(valor_alvo) else "meio"
                    else:
                        correto = "errado"
                elif isinstance(valor_alvo, list):
                    correto = "meio" if valor_tentativa in valor_alvo else "errado"
                elif isinstance(valor_tentativa, list):
                    correto = "meio" if valor_alvo in valor_tentativa else "errado"
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

    print(tentativa)
    if tentativa == alvo:
        jogo.concluido = True
        jogo.save()

        for key in feedback:
            feedback[key]["correto"] = "certo"

        print('Parabéns! Você acertou!')
        return Response({
            'mensagem': 'Parabéns! Você acertou!', 
            'acertou': True, 
            'feedback': feedback, 
            'tentativas': jogo.tentativas
        })

    print('Tente novamente!')
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
