#!/usr/bin/env python3
"""
CRUD de Documentação - Feira Virtual
Sistema completo para Create, Read, Update, Delete da documentação
"""

import os
import sys
import shutil
import subprocess
import webbrowser
from pathlib import Path
import time
from datetime import datetime


class DocumentationCRUD:
    """Sistema CRUD para gerenciamento da documentação"""

    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.docs_dir = self.base_dir / "backend" / "docs"
        self.source_dir = self.docs_dir / "source"
        self.build_dir = self.docs_dir / "build"
        self.html_dir = self.build_dir / "html"

    def banner(self):
        """Exibe banner do sistema"""
        print("=" * 60)
        print("         FEIRA VIRTUAL - CRUD DE DOCUMENTAÇÃO")
        print("=" * 60)
        print()

    # CREATE - Criar nova documentação
    def create_docs(self, module_name=None):
        """Criar documentação para novos módulos"""
        print("🔨 CREATE: Gerando nova documentação...")

        if module_name:
            self._create_module_docs(module_name)
        else:
            self._create_all_docs()

    def _create_module_docs(self, module_name):
        """Criar documentação para módulo específico"""
        rst_content = f"""
{module_name}
{"=" * len(module_name)}

.. automodule:: {module_name}
   :members:
   :undoc-members:
   :show-inheritance:
"""

        module_file = self.source_dir / f"{module_name}.rst"
        with open(module_file, "w", encoding="utf-8") as f:
            f.write(rst_content)

        print(f"✅ Documentação criada para módulo: {module_name}")

    def _create_all_docs(self):
        """Gerar toda a documentação"""
        self._run_sphinx_build()

    # READ - Ler/visualizar documentação
    def read_docs(self, open_browser=True):
        """Visualizar documentação existente"""
        print("📖 READ: Abrindo documentação...")

        if not self.html_dir.exists():
            print("❌ Documentação não encontrada! Execute 'create' primeiro.")
            return False

        index_file = self.html_dir / "index.html"
        if not index_file.exists():
            print("❌ Arquivo index.html não encontrado!")
            return False

        if open_browser:
            webbrowser.open(f"file://{index_file.absolute()}")
            print(f"🌐 Documentação aberta no navegador: {index_file}")
        else:
            print(f"📄 Documentação disponível em: {index_file}")

        return True

    # UPDATE - Atualizar documentação
    def update_docs(self, force=False):
        """Atualizar documentação existente"""
        print("🔄 UPDATE: Atualizando documentação...")

        if force or self._docs_need_update():
            print("🔨 Regenerando documentação...")
            self.delete_docs(confirm=False)  # Limpar antes
            self.create_docs()
            print("✅ Documentação atualizada com sucesso!")
        else:
            print("ℹ️ Documentação já está atualizada.")

    def _docs_need_update(self):
        """Verifica se a documentação precisa ser atualizada"""
        if not self.html_dir.exists():
            return True

        # Verificar se arquivos fonte são mais novos que HTML
        source_files = list(self.source_dir.glob("*.rst")) + list(
            self.source_dir.glob("*.py")
        )
        if not source_files:
            return True

        newest_source = max(f.stat().st_mtime for f in source_files)

        try:
            html_time = (self.html_dir / "index.html").stat().st_mtime
            return newest_source > html_time
        except FileNotFoundError:
            return True

    # DELETE - Deletar documentação
    def delete_docs(self, confirm=True):
        """Deletar documentação gerada"""
        print("🗑️ DELETE: Removendo documentação...")

        if confirm:
            response = input("⚠️ Confirma exclusão da documentação? (s/N): ")
            if response.lower() != "s":
                print("❌ Operação cancelada.")
                return False

        if self.build_dir.exists():
            shutil.rmtree(self.build_dir)
            print("✅ Documentação removida com sucesso!")
        else:
            print("ℹ️ Nenhuma documentação encontrada para remover.")

        return True

    def delete_module_docs(self, module_name):
        """Deletar documentação de módulo específico"""
        module_file = self.source_dir / f"{module_name}.rst"
        if module_file.exists():
            module_file.unlink()
            print(f"✅ Documentação do módulo {module_name} removida.")
            # Regenerar documentação
            self.update_docs(force=True)
        else:
            print(f"❌ Documentação do módulo {module_name} não encontrada.")

    # Operações auxiliares
    def _run_sphinx_build(self):
        """Executar build do Sphinx"""
        os.chdir(self.docs_dir)

        try:
            if os.name == "nt":  # Windows
                result = subprocess.run(
                    ["make.bat", "html"], capture_output=True, text=True
                )
            else:  # Linux/Mac
                result = subprocess.run(
                    ["make", "html"], capture_output=True, text=True
                )

            if result.returncode == 0:
                print("✅ Documentação gerada com sucesso!")
                return True
            else:
                print(f"❌ Erro ao gerar documentação: {result.stderr}")
                return False

        except FileNotFoundError:
            print("❌ Comando make não encontrado!")
            return False
        finally:
            os.chdir(self.base_dir)

    def list_modules(self):
        """Listar módulos disponíveis para documentação"""
        print("📋 Módulos Python disponíveis:")

        backend_dir = self.base_dir / "backend"
        modules = []

        for py_file in backend_dir.rglob("*.py"):
            if "__pycache__" in str(py_file) or py_file.name.startswith("__"):
                continue

            relative_path = py_file.relative_to(backend_dir)
            module_path = str(relative_path.with_suffix("")).replace(os.sep, ".")
            modules.append(module_path)

        for i, module in enumerate(sorted(modules), 1):
            print(f"  {i:2d}. {module}")

        return modules

    def status(self):
        """Mostrar status da documentação"""
        print("📊 STATUS da Documentação:")
        print(f"  📁 Diretório docs: {self.docs_dir}")
        print(
            f"  📄 Arquivos fonte: {len(list(self.source_dir.glob('*.rst')))} arquivos RST"
        )

        if self.html_dir.exists():
            html_files = len(list(self.html_dir.rglob("*.html")))
            print(f"  🌐 Documentação HTML: {html_files} arquivos")

            try:
                mtime = (self.html_dir / "index.html").stat().st_mtime
                last_build = datetime.fromtimestamp(mtime).strftime("%d/%m/%Y %H:%M:%S")
                print(f"  ⏰ Última atualização: {last_build}")
            except FileNotFoundError:
                print("  ⏰ Última atualização: Nunca")
        else:
            print("  🌐 Documentação HTML: Não gerada")

    def watch_and_update(self):
        """Monitorar arquivos e atualizar automaticamente"""
        print("👀 WATCH: Monitorando alterações nos arquivos...")
        print("         Pressione Ctrl+C para parar")

        last_check = {}

        try:
            while True:
                updated = False

                # Verificar arquivos Python
                for py_file in (self.base_dir / "backend").rglob("*.py"):
                    if "__pycache__" in str(py_file):
                        continue

                    try:
                        mtime = py_file.stat().st_mtime
                        if py_file not in last_check or mtime > last_check[py_file]:
                            last_check[py_file] = mtime
                            updated = True
                    except FileNotFoundError:
                        continue

                if updated:
                    print(
                        f"🔄 Alteração detectada - {datetime.now().strftime('%H:%M:%S')}"
                    )
                    self.update_docs(force=True)

                time.sleep(2)  # Verificar a cada 2 segundos

        except KeyboardInterrupt:
            print("\n👋 Monitoramento interrompido.")


def show_help():
    """Exibe ajuda do sistema"""
    print("📖 USO: python crud_docs.py [comando] [opções]")
    print()
    print("📋 COMANDOS DISPONÍVEIS:")
    print("  create [módulo]     - Criar documentação (geral ou módulo específico)")
    print("  read               - Abrir documentação no navegador")
    print("  update             - Atualizar documentação existente")
    print("  delete [módulo]    - Deletar documentação (geral ou módulo específico)")
    print("  list               - Listar módulos disponíveis")
    print("  status             - Mostrar status da documentação")
    print("  watch              - Monitorar e atualizar automaticamente")
    print()
    print("💡 EXEMPLOS:")
    print("  python crud_docs.py create")
    print("  python crud_docs.py create core.models")
    print("  python crud_docs.py read")
    print("  python crud_docs.py update")
    print("  python crud_docs.py delete")
    print("  python crud_docs.py delete core.models")


def main():
    """Interface principal do CRUD"""
    crud = DocumentationCRUD()
    crud.banner()

    if len(sys.argv) < 2:
        show_help()
        return

    command = sys.argv[1].lower()

    if command == "create":
        module = sys.argv[2] if len(sys.argv) > 2 else None
        crud.create_docs(module)

    elif command == "read":
        crud.read_docs()

    elif command == "update":
        crud.update_docs()

    elif command == "delete":
        if len(sys.argv) > 2:
            crud.delete_module_docs(sys.argv[2])
        else:
            crud.delete_docs()

    elif command == "list":
        crud.list_modules()

    elif command == "status":
        crud.status()

    elif command == "watch":
        crud.watch_and_update()

    else:
        print(f"❌ Comando inválido: {command}")
        print()
        show_help()


if __name__ == "__main__":
    main()
