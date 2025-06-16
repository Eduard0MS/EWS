from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
import uuid


class Feira(models.Model):
    """Modelo para representar uma feira"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200, verbose_name="Nome")
    descricao = models.TextField(verbose_name="Descrição")
    data_inicio = models.DateField(verbose_name="Data de Início")
    data_termino = models.DateField(verbose_name="Data de Término")
    local = models.CharField(max_length=300, verbose_name="Local")
    cidade = models.CharField(max_length=100, verbose_name="Cidade")
    estado = models.CharField(max_length=2, verbose_name="Estado")
    preco_ingresso = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name="Preço do Ingresso",
        default=10.00,
    )
    criado_por = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Criado por"
    )
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Feira"
        verbose_name_plural = "Feiras"
        ordering = ["-criado_em"]

    def __str__(self):
        return self.nome

    def clean(self):
        from django.core.exceptions import ValidationError

        if (
            self.data_inicio
            and self.data_termino
            and self.data_inicio > self.data_termino
        ):
            raise ValidationError(
                "A data de início não pode ser posterior à data de término."
            )


class Expositor(models.Model):
    """Modelo para representar um expositor"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200, verbose_name="Nome")
    descricao = models.TextField(verbose_name="Descrição")
    contato = models.CharField(max_length=300, verbose_name="Contato")
    feira = models.ForeignKey(
        Feira,
        on_delete=models.CASCADE,
        related_name="expositores",
        verbose_name="Feira",
    )
    criado_por = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Criado por"
    )
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Expositor"
        verbose_name_plural = "Expositores"
        ordering = ["-criado_em"]
        unique_together = ["nome", "feira"]

    def __str__(self):
        return f"{self.nome} - {self.feira.nome}"


class Produto(models.Model):
    """Modelo para representar um produto"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200, verbose_name="Nome")
    descricao = models.TextField(verbose_name="Descrição")
    preco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name="Preço",
    )
    expositor = models.ForeignKey(
        Expositor,
        on_delete=models.CASCADE,
        related_name="produtos",
        verbose_name="Expositor",
    )
    criado_por = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Criado por"
    )
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        ordering = ["-criado_em"]

    def __str__(self):
        return f"{self.nome} - R$ {self.preco}"


class Ingresso(models.Model):
    """Modelo para representar um ingresso"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero_ingresso = models.CharField(
        max_length=50, unique=True, verbose_name="Número do Ingresso"
    )
    feira = models.ForeignKey(
        Feira, on_delete=models.CASCADE, related_name="ingressos", verbose_name="Feira"
    )
    data_emissao = models.DateField(auto_now_add=True, verbose_name="Data de Emissão")
    criado_por = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Criado por"
    )
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")

    class Meta:
        verbose_name = "Ingresso"
        verbose_name_plural = "Ingressos"
        ordering = ["-criado_em"]

    def __str__(self):
        return f"Ingresso {self.numero_ingresso} - {self.feira.nome}"

    def save(self, *args, **kwargs):
        if not self.numero_ingresso:
            # Gerar número único do ingresso
            import random
            import string

            self.numero_ingresso = f"ING-{''.join(random.choices(string.ascii_uppercase + string.digits, k=8))}"
        super().save(*args, **kwargs)
