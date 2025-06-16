.. Feira Virtual documentation master file, created by
   sphinx-quickstart on Sun Jun 15 22:09:44 2025.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Feira Virtual - Sistema de Gestão de Feiras
==========================================

Bem-vindo à documentação do **Feira Virtual**, um sistema completo para gestão de feiras, expositores, produtos e ingressos.

Este sistema foi desenvolvido com Django REST Framework no backend e React no frontend, oferecendo uma solução completa para organização e participação em feiras virtuais.

Visão Geral
-----------

O sistema permite:

- **Gestão de Feiras**: Criar, editar e gerenciar feiras com preços de ingresso
- **Expositores**: Cadastro e gerenciamento de expositores por feira  
- **Produtos**: Gerenciamento de produtos por expositor
- **Ingressos**: Sistema de compra e gestão de ingressos
- **Autenticação**: Sistema completo de login/registro

Tecnologias
-----------

- **Backend**: Django 5.1 + Django REST Framework
- **Frontend**: React 18 + TailwindCSS
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: JWT

Documentação da API
-------------------

.. toctree::
   :maxdepth: 2
   :caption: Módulos:

   models
   serializers  
   views
   authentication
   permissions

Módulos do Sistema
==================

Models
------

.. automodule:: core.models
   :members:
   :undoc-members:
   :show-inheritance:

Serializers
-----------

.. automodule:: core.serializers
   :members:
   :undoc-members:
   :show-inheritance:

Views
-----

.. automodule:: core.views
   :members:
   :undoc-members:
   :show-inheritance:

Autenticação
------------

.. automodule:: authentication.views
   :members:
   :undoc-members:
   :show-inheritance:

.. automodule:: authentication.serializers
   :members:
   :undoc-members:
   :show-inheritance:

Permissões
----------

.. automodule:: core.permissions
   :members:
   :undoc-members:
   :show-inheritance:

Índices e Tabelas
=================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

