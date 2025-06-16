from django.contrib import admin
from .models import Feira, Expositor, Produto, Ingresso


@admin.register(Feira)
class FeiraAdmin(admin.ModelAdmin):
    list_display = [
        "nome",
        "cidade",
        "estado",
        "data_inicio",
        "data_termino",
        "criado_por",
        "criado_em",
    ]
    list_filter = ["cidade", "estado", "data_inicio", "data_termino", "criado_em"]
    search_fields = ["nome", "descricao", "cidade", "estado"]
    readonly_fields = ["id", "criado_em", "atualizado_em"]
    fieldsets = (
        ("Informações Básicas", {"fields": ("nome", "descricao")}),
        ("Localização", {"fields": ("local", "cidade", "estado")}),
        ("Datas", {"fields": ("data_inicio", "data_termino")}),
        ("Preços", {"fields": ("preco_ingresso",)}),
        (
            "Metadados",
            {
                "fields": ("id", "criado_por", "criado_em", "atualizado_em"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(Expositor)
class ExpositorAdmin(admin.ModelAdmin):
    list_display = ["nome", "feira", "contato", "criado_por", "criado_em"]
    list_filter = ["feira", "criado_em"]
    search_fields = ["nome", "descricao", "contato", "feira__nome"]
    readonly_fields = ["id", "criado_em", "atualizado_em"]
    fieldsets = (
        ("Informações Básicas", {"fields": ("nome", "descricao", "contato")}),
        ("Associação", {"fields": ("feira",)}),
        (
            "Metadados",
            {
                "fields": ("id", "criado_por", "criado_em", "atualizado_em"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ["nome", "expositor", "preco", "criado_por", "criado_em"]
    list_filter = ["expositor__feira", "expositor", "criado_em"]
    search_fields = ["nome", "descricao", "expositor__nome", "expositor__feira__nome"]
    readonly_fields = ["id", "criado_em", "atualizado_em"]
    fieldsets = (
        ("Informações Básicas", {"fields": ("nome", "descricao", "preco")}),
        ("Associação", {"fields": ("expositor",)}),
        (
            "Metadados",
            {
                "fields": ("id", "criado_por", "criado_em", "atualizado_em"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(Ingresso)
class IngressoAdmin(admin.ModelAdmin):
    list_display = [
        "numero_ingresso",
        "feira",
        "data_emissao",
        "criado_por",
        "criado_em",
    ]
    list_filter = ["feira", "data_emissao", "criado_em"]
    search_fields = ["numero_ingresso", "feira__nome", "criado_por__username"]
    readonly_fields = ["id", "numero_ingresso", "data_emissao", "criado_em"]
    fieldsets = (
        (
            "Informações do Ingresso",
            {"fields": ("numero_ingresso", "feira", "data_emissao")},
        ),
        (
            "Metadados",
            {"fields": ("id", "criado_por", "criado_em"), "classes": ("collapse",)},
        ),
    )
