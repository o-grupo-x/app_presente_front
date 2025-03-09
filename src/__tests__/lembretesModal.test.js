import { act, render, screen, fireEvent } from "@testing-library/react";
import LembretesModal from "@/components/lembretesModal/index";
import api from "@/client/api";

jest.mock("@/client/api", () => ({
  aluno: {
    vizualizar: jest.fn().mockResolvedValue({}), // Mock da chamada à API
  },
}));

describe("LembretesModal", () => {
  const mockOnClose = jest.fn();
  const mockLembretes = [
    { id: 1, Titulo: "Lembrete 1", mensagem: "Mensagem do lembrete 1" },
    { id: 2, Titulo: "Lembrete 2", mensagem: "Mensagem do lembrete 2" },
  ];

  it("Renderiza corretamente os lembretes", () => {
    render(<LembretesModal lembretes={mockLembretes} onClose={mockOnClose} />);

    expect(screen.getByText("Lembretes")).toBeInTheDocument();
    expect(screen.getByText("Título: Lembrete 1")).toBeInTheDocument();
    expect(screen.getByText("Mensagem do lembrete 1")).toBeInTheDocument();
    expect(screen.getByText("Título: Lembrete 2")).toBeInTheDocument();
    expect(screen.getByText("Mensagem do lembrete 2")).toBeInTheDocument();
  });

  it("Chama a função onClose ao clicar no botão FECHAR", () => {
    render(<LembretesModal lembretes={mockLembretes} onClose={mockOnClose} />);

    const closeButton = screen.getByText("FECHAR");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("Marca um lembrete como visualizado ao clicar no ícone", async () => {
    render(<LembretesModal lembretes={mockLembretes} onClose={mockOnClose} />);

    const eyeIcons = screen.getAllByTestId(/^eye-icon-/);// Obtém os ícones de olho
    await act(async () => {
        fireEvent.click(eyeIcons[0]); // Simula clique no primeiro lembrete
    });

    expect(api.aluno.vizualizar).toHaveBeenCalledWith(1); // Verifica se a API foi chamada com o ID correto
  });
});
