const path = require("path");
require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Adiciona rewrites para redirecionar chamadas de API
  async rewrites() {
    const backendHost = process.env.BACKEND_API_HOST || "http://localhost:8000"; // fallback local
    return [
      {
        source: "/api/:path*",
        destination: backendHost,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Adicionando aliases para simplificar os imports
    config.resolve.alias["@"] = path.join(__dirname, "src"); // Alias para a pasta src
    config.resolve.alias["@components"] = path.join(
      __dirname,
      "src",
      "components"
    ); // Alias para componentes
    config.resolve.alias["@contexts"] = path.join(__dirname, "src", "contexts"); // Alias para contextos
    config.resolve.alias["@utils"] = path.join(__dirname, "src", "utils"); // Alias para utilitários
    config.resolve.alias["@client"] = path.join(__dirname, "src", "client"); // Alias para a camada de client API

    // Configurações para fallback de módulos não disponíveis no servidor
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
