from rest_framework import serializers
from .models import Pessoa
from .models import Animal

# transforma objetos python em JSON

class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = "__all__"

