import { render, screen } from "@testing-library/react";
// Importa as funções `render` e `screen` da biblioteca de testes React Testing Library.
// `render` permite renderizar o componente em um ambiente de teste.
// `screen` fornece utilitários para buscar elementos renderizados no DOM.

import Cabecalho from "@/components/Cabecalho/cabecalho";
// Importa o componente `Cabecalho` que será testado.

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(), // Mock da função `push`, usada para navegação.
    pathname: "/", // Define um valor fictício para `pathname`, simulando a rota atual.
  }),
}));
// Faz um mock do `useRouter` para evitar dependências reais da funcionalidade de roteamento do Next.js nos testes.

jest.mock("@/contexts/UserContext", () => ({
  useUser: () => ({
    user: { JWT: "mockToken", Cargo: "Aluno", id_aluno: 123 },
    // Mock do usuário autenticado, com propriedades fictícias.
    logout: jest.fn(),
    // Mock da função `logout`, usada para deslogar o usuário.
  }),
}));
// Faz um mock do `useUser` para evitar dependências de um contexto real nos testes.

describe("Cabecalho", () => {
  // Define um bloco de testes para o componente `Cabecalho`.

  it("Renderiza corretamente", () => {
    // Teste que verifica se o `Cabecalho` renderiza corretamente.

    render(<Cabecalho />);
    // Renderiza o componente `Cabecalho`.

    expect(screen.getByText("App Chamada")).toBeInTheDocument();
    // Verifica se o texto "App Chamada" está presente no DOM após a renderização.
  });
});
