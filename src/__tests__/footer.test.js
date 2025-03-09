import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer/footer";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />, // Mock da importação do `next/image` para evitar erros no teste.
}));

describe("Footer", () => {
  it("Renderiza corretamente", () => {
    render(<Footer />);

    // Verifica se o texto "copyright by" está presente no rodapé
    expect(screen.getByText("copyright by")).toBeInTheDocument();

    // Verifica se a imagem está presente no rodapé
    expect(screen.getByAltText("App Logo")).toBeInTheDocument();
  });
});
