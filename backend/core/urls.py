from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FeiraViewSet,
    ExpositorViewSet,
    ProdutoViewSet,
    IngressoViewSet,
    api_root,
)

router = DefaultRouter()
router.register(r"feiras", FeiraViewSet)
router.register(r"expositores", ExpositorViewSet)
router.register(r"produtos", ProdutoViewSet)
router.register(r"ingressos", IngressoViewSet)

urlpatterns = [
    path("", api_root, name="api-root"),
    path("api/", include(router.urls)),
]
