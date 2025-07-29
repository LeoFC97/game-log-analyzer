# 🧠 Game Log Analyzer

Este projeto é uma API desenvolvida com **NestJS**, responsável por processar logs de partidas de um jogo de tiro em primeira pessoa. O sistema analisa o conteúdo do log, persiste os dados em um banco SQLite e fornece estatísticas relevantes, como o ranking de jogadores, a arma preferida do vencedor, entre outros.

## 🚀 Tecnologias utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [SQLite](https://www.sqlite.org/)
- [Swagger (OpenAPI)](https://swagger.io/)
- [Jest](https://jestjs.io/) (para testes)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/LeoFC97/game-log-analyzer.git
cd game-log-analyzer
```
# Instale as dependências
```bash
npm install
```

## 🛠️ Rodando o projeto

# Ambiente de desenvolvimento com hot-reload
```bash
npm run start:dev
```
## 📄 Documentação da API (Swagger)
Acesse a interface interativa da documentação em:

http://localhost:3000/api


## 🗃️ Banco de Dados
O projeto utiliza SQLite, e o banco de dados é salvo localmente como game-log.db.

Para apagar os dados (sem excluir as tabelas), execute:

```sql
DELETE FROM kill;
DELETE FROM match;
```

### 🧪 Testes

# Executa os testes unitários
```bash 
npm run test
```


### 📥 Upload de Log
Endpoint:
```bash 
POST /log/upload
```

Exemplo no Swagger:
Faça upload de um arquivo de texto com o seguinte conteúdo de exemplo:
```bash
23/04/2019 15:34:22 - New match 11348965 has started
23/04/2019 15:34:25 - Roman killed Nick using M16
23/04/2019 15:36:04 - <WORLD> killed Nick by DROWN
23/04/2019 15:36:33 - Roman killed Nick using M16
23/04/2019 15:39:22 - Match 11348965 has ended
```


### 🧠 Funcionalidades implementadas
 Processar logs de partidas e persistir dados

 Impedir arquivos com mais de 20 jogadores

 Não Persistência de kills com origem <WORLD>

 Arma preferida do vencedor da partida


 ## 📈 Pontos de Melhoria

Aqui estão algumas ideias para evolução futura do projeto:

- 🔄 **Reprocessamento inteligente**: permitir reprocessar uma partida finalizada caso seja explicitamente autorizado.
- 🧠 **Análise estatística avançada**:
  - Kill/death ratio por jogador
  - Duração média das partidas
  - Armas mais letais por partida e no geral
- 📊 **Dashboard visual**: criação de uma interface frontend para visualizar partidas, gráficos e rankings.
- 🔐 **Autenticação e autorização**: proteger endpoints com autenticação via JWT.
- 🧪 **Testes E2E mais robustos**: validar upload de arquivos e respostas completas.
- 🗃️ **Suporte a múltiplos bancos**: configurar PostgreSQL e MySQL além do SQLite.
- 📁 **Armazenamento de arquivos**: guardar os arquivos originais de log no sistema de arquivos ou em cloud (ex: S3).
- 🌐 **Processamento assíncrono**: utilizar filas (ex: BullMQ) para processar logs pesados fora da th