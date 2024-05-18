#!/bin/sh

# Espera o MySQL estar disponível
/usr/local/bin/wait-for-it.sh mysql:3306 --timeout=60 --strict -- echo "MySQL is up"

# Espera o RabbitMQ estar disponível
/usr/local/bin/wait-for-it.sh rabbitmq:5672 --timeout=60 --strict -- echo "RabbitMQ is up"

# Executa migrações
pnpm db:migrate

# Executa seeds
pnpm db:seed

# Inicia a aplicação
exec node index.js
