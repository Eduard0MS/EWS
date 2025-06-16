from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Feira, Expositor, Produto, Ingresso
from .serializers import (
    FeiraListSerializer,
    FeiraDetailSerializer,
    FeiraCreateUpdateSerializer,
    ExpositorListSerializer,
    ExpositorDetailSerializer,
    ExpositorCreateUpdateSerializer,
    ProdutoListSerializer,
    ProdutoDetailSerializer,
    ProdutoCreateUpdateSerializer,
    IngressoDetailSerializer,
    IngressoCreateSerializer,
)
from .permissions import IsOwnerOrReadOnly


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def api_root(request):
    """API root endpoint com informações sobre o sistema"""
    # Se o request aceita HTML, renderiza o template
    if "text/html" in request.META.get("HTTP_ACCEPT", ""):
        return render(request, "api_root.html")

    # Senão, retorna JSON para clientes da API
    return Response(
        {
            "message": "Bem-vindo ao Sistema de Gestão de Feiras!",
            "version": "1.0.0",
            "endpoints": {
                "feiras": "/api/feiras/",
                "expositores": "/api/expositores/",
                "produtos": "/api/produtos/",
                "ingressos": "/api/ingressos/",
                "auth": {
                    "login": "/auth/login/",
                    "register": "/auth/register/",
                    "profile": "/auth/profile/",
                    "logout": "/auth/logout/",
                },
                "admin": "/admin/",
            },
            "documentation": {
                "feiras": "Gerenciar feiras - CRUD completo",
                "expositores": "Gerenciar expositores por feira",
                "produtos": "Gerenciar produtos por expositor",
                "ingressos": "Gerenciar ingressos (apenas usuários autenticados)",
            },
        }
    )


class FeiraViewSet(viewsets.ModelViewSet):
    """ViewSet para operações CRUD de feiras"""

    queryset = Feira.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["cidade", "estado"]
    search_fields = ["nome", "descricao", "cidade", "estado"]
    ordering_fields = ["nome", "data_inicio", "data_termino", "criado_em"]
    ordering = ["-criado_em"]

    def get_serializer_class(self):
        if self.action == "list":
            return FeiraListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return FeiraCreateUpdateSerializer
        return FeiraDetailSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions for this view.
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

    def perform_update(self, serializer):
        # Não alterar o criado_por durante update
        serializer.save()

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def expositores(self, request, pk=None):
        """Retorna os expositores de uma feira específica"""
        feira = self.get_object()
        expositores = feira.expositores.all()
        serializer = ExpositorListSerializer(expositores, many=True)
        return Response(serializer.data)


class ExpositorViewSet(viewsets.ModelViewSet):
    """ViewSet para operações CRUD de expositores"""

    queryset = Expositor.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["feira"]
    search_fields = ["nome", "descricao"]
    ordering_fields = ["nome", "criado_em"]
    ordering = ["-criado_em"]

    def get_serializer_class(self):
        if self.action == "list":
            return ExpositorListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return ExpositorCreateUpdateSerializer
        return ExpositorDetailSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions for this view.
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

    @action(detail=True, methods=["get"], permission_classes=[permissions.AllowAny])
    def produtos(self, request, pk=None):
        """Retorna os produtos de um expositor específico"""
        expositor = self.get_object()
        produtos = expositor.produtos.all()
        serializer = ProdutoListSerializer(produtos, many=True)
        return Response(serializer.data)


class ProdutoViewSet(viewsets.ModelViewSet):
    """ViewSet para operações CRUD de produtos"""

    queryset = Produto.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["expositor", "expositor__feira"]
    search_fields = ["nome", "descricao"]
    ordering_fields = ["nome", "preco", "criado_em"]
    ordering = ["-criado_em"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProdutoListSerializer
        elif self.action in ["create", "update", "partial_update"]:
            return ProdutoCreateUpdateSerializer
        return ProdutoDetailSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions for this view.
        """
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)


class IngressoViewSet(viewsets.ModelViewSet):
    """ViewSet para operações de ingressos"""

    queryset = Ingresso.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["feira"]
    search_fields = ["numero_ingresso", "feira__nome"]
    ordering_fields = ["data_emissao", "criado_em"]
    ordering = ["-criado_em"]
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.action == "create":
            return IngressoCreateSerializer
        return IngressoDetailSerializer

    def get_queryset(self):
        """Retorna apenas os ingressos do usuário autenticado"""
        return Ingresso.objects.filter(criado_por=self.request.user)

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Override para permitir apenas exclusão"""
        instance = self.get_object()
        if instance.criado_por != request.user:
            return Response(
                {"error": "Você só pode excluir seus próprios ingressos."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    # Não permitir updates em ingressos
    def update(self, request, *args, **kwargs):
        return Response(
            {"error": "Ingressos não podem ser editados."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def partial_update(self, request, *args, **kwargs):
        return Response(
            {"error": "Ingressos não podem ser editados."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )
