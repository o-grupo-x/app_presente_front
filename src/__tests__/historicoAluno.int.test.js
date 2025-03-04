import React from 'react';
import { render, screen } from '@testing-library/react';
import HistoricoAluno from '@/pages/aluno/historico';
import { useUser } from '@/contexts/UserContext';
import api from '@/client/api';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('@/contexts/UserContext');
jest.mock('@/client/api');

describe('Página de Histórico do Aluno', () => {
  const userMock = { id_aluno: '1' };
  const presencasMock = [
    { id_presenca: '1', nome: 'Matemática', horario: '08:00', status: true, tipo_presenca: 'Presença' },
    { id_presenca: '2', nome: 'História', horario: '09:00', status: true, tipo_presenca: 'Presença' },
  ];

  beforeEach(() => {
    useUser.mockReturnValue({ user: userMock });
    api.aluno.findChamadaByAluno.mockResolvedValue({ data: presencasMock });
    api.aluno.presencasFaltas.mockResolvedValue({ data: { presencas: 20, faltas: 5, nome: 'Aluno Teste' } });
  });

  test('exibe dados do aluno', async () => {
    render(<HistoricoAluno />);
    // Espera que os dados do aluno sejam exibidos após a resolução das promessas da API
    expect(await screen.findByText('Presencas')).toBeInTheDocument();
    expect(await screen.findByText('Faltas')).toBeInTheDocument();
    expect(await screen.findByText('Aluno Teste')).toBeInTheDocument();
  });



  
});
