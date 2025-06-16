from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Feira, Expositor, Produto, Ingresso


class UserSerializer(serializers.ModelSerializer):
    """Serializer para o modelo User"""

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class FeiraListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de feiras"""

    criado_por = UserSerializer(read_only=True)

    class Meta:
        model = Feira
        fields = [
            "id",
            "nome",
            "descricao",
            "data_inicio",
            "data_termino",
            "local",
            "cidade",
            "estado",
            "preco_ingresso",
            "criado_por",
        ]


class FeiraDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para feiras"""

    criado_por = UserSerializer(read_only=True)

    class Meta:
        model = Feira
        fields = [
            "id",
            "nome",
            "descricao",
            "data_inicio",
            "data_termino",
            "local",
            "cidade",
            "estado",
            "preco_ingresso",
            "criado_por",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_por", "criado_em", "atualizado_em"]

    def validate(self, data):
        if data.get("data_inicio") and data.get("data_termino"):
            if data["data_inicio"] > data["data_termino"]:
                raise serializers.ValidationError(
                    "A data de início não pode ser posterior à data de término."
                )
        return data


class FeiraCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação e atualização de feiras"""

    class Meta:
        model = Feira
        fields = [
            "nome",
            "descricao",
            "data_inicio",
            "data_termino",
            "local",
            "cidade",
            "estado",
            "preco_ingresso",
        ]

    def validate(self, data):
        if data.get("data_inicio") and data.get("data_termino"):
            if data["data_inicio"] > data["data_termino"]:
                raise serializers.ValidationError(
                    "A data de início não pode ser posterior à data de término."
                )
        return data


class ExpositorListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de expositores"""

    criado_por = UserSerializer(read_only=True)
    feira_nome = serializers.CharField(source="feira.nome", read_only=True)

    class Meta:
        model = Expositor
        fields = [
            "id",
            "nome",
            "descricao",
            "contato",
            "feira",
            "feira_nome",
            "criado_por",
        ]


class ExpositorDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para expositores"""

    criado_por = UserSerializer(read_only=True)
    feira_nome = serializers.CharField(source="feira.nome", read_only=True)

    class Meta:
        model = Expositor
        fields = [
            "id",
            "nome",
            "descricao",
            "contato",
            "feira",
            "feira_nome",
            "criado_por",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "criado_por",
            "criado_em",
            "atualizado_em",
            "feira_nome",
        ]


class ExpositorCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação e atualização de expositores"""

    class Meta:
        model = Expositor
        fields = ["nome", "descricao", "contato", "feira"]


class ProdutoListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de produtos"""

    criado_por = UserSerializer(read_only=True)
    expositor_nome = serializers.CharField(source="expositor.nome", read_only=True)
    feira_nome = serializers.CharField(source="expositor.feira.nome", read_only=True)

    class Meta:
        model = Produto
        fields = [
            "id",
            "nome",
            "descricao",
            "preco",
            "expositor",
            "expositor_nome",
            "feira_nome",
            "criado_por",
        ]


class ProdutoDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para produtos"""

    criado_por = UserSerializer(read_only=True)
    expositor_nome = serializers.CharField(source="expositor.nome", read_only=True)
    feira_nome = serializers.CharField(source="expositor.feira.nome", read_only=True)

    class Meta:
        model = Produto
        fields = [
            "id",
            "nome",
            "descricao",
            "preco",
            "expositor",
            "expositor_nome",
            "feira_nome",
            "criado_por",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "criado_por",
            "criado_em",
            "atualizado_em",
            "expositor_nome",
            "feira_nome",
        ]


class ProdutoCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criação e atualização de produtos"""

    class Meta:
        model = Produto
        fields = ["nome", "descricao", "preco", "expositor"]

    def validate_preco(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value


class IngressoDetailSerializer(serializers.ModelSerializer):
    """Serializer para ingressos"""

    criado_por = UserSerializer(read_only=True)
    feira_nome = serializers.CharField(source="feira.nome", read_only=True)
    preco = serializers.DecimalField(
        source="feira.preco_ingresso", max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Ingresso
        fields = [
            "id",
            "numero_ingresso",
            "feira",
            "feira_nome",
            "preco",
            "data_emissao",
            "criado_por",
            "criado_em",
        ]
        read_only_fields = [
            "id",
            "numero_ingresso",
            "data_emissao",
            "criado_por",
            "criado_em",
            "feira_nome",
            "preco",
        ]


class IngressoCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de ingressos"""

    class Meta:
        model = Ingresso
        fields = ["feira"]
