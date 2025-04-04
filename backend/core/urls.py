from django.urls import path
from . import views

urlpatterns = [
    path('jogo/iniciar/', views.iniciar_jogo, name='iniciar_jogo'),
    path('jogo/tentar/', views.verificar_tentativa, name='verificar_tentativa'),
    path('jogo/ranking/', views.ranking),
]
