# Especificar a imagem base
FROM node:18-alpine

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar os arquivos do projeto para o diretório de trabalho
COPY . .

# Construir a aplicação Next.js
RUN npm run build

# Expor a porta que o Next.js vai rodar (normalmente 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm","start"]

