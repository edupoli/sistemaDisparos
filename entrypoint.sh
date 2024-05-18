#!/bin/sh

# Verificar e criar diretórios se não existirem
mkdir -p $HOME/logs
mkdir -p $HOME/tokens

# Espera o MySQL estar disponível
echo "Esperando o MySQL estar disponível..."
/usr/local/bin/wait-for-it.sh mysql:3306 --timeout=60 --strict -- echo "MySQL está disponível"

# Espera o RabbitMQ estar disponível
echo "Esperando o RabbitMQ estar disponível..."
/usr/local/bin/wait-for-it.sh rabbitmq:5672 --timeout=240 --strict -- echo "RabbitMQ está disponível"

# Executa migrações
echo "Executando migrações..."
pnpm db:migrate

# Executa seeds
echo "Executando seeds..."
pnpm db:seed

# Inicia a aplicação
echo "Iniciando a aplicação..."
exec node index.js
