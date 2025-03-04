// src/pages/unauthorized.js
import React from 'react';
import { useRouter } from 'next/router';

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <button onClick={() => router.push('/')}>Voltar para a Página Inicial</button>
    </div>
  );
};

export default Unauthorized;
