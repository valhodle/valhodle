from django.urls import path
from .views import iniciar_jogo, verificar_tentativa

urlpatterns = [
    path('jogo/iniciar/', iniciar_jogo, name='iniciar_jogo'),
    path('jogo/tentar/', verificar_tentativa, name='verificar_tentativa'),
]
