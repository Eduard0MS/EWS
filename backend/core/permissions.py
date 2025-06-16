from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permissão personalizada para permitir que apenas o proprietário de um objeto
    possa editá-lo ou excluí-lo.
    """

    def has_object_permission(self, request, view, obj):
        # Permissões de leitura são permitidas para qualquer request,
        # então sempre permitimos requests GET, HEAD ou OPTIONS.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Permissões de escrita são apenas permitidas para o proprietário do objeto.
        return obj.criado_por == request.user


class IsOwnerOnly(permissions.BasePermission):
    """
    Permissão personalizada para permitir acesso apenas ao proprietário do objeto.
    """

    def has_object_permission(self, request, view, obj):
        # Permissões são apenas permitidas para o proprietário do objeto.
        return obj.criado_por == request.user
