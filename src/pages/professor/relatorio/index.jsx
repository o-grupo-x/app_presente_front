// pages/professor/relatorio/index.jsx
"use client";
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Cabecalho from '../../../components/Cabecalho/cabecalho';
import Navbar from '../../../components/Navbar/navbar';
import Footer from '../../../components/Footer/footer';
import { Fundo } from '../../../components/Fundo/fundo';
import CalendarView from '../../../components/CalendarView/CalendarView'; 
import AttendanceList from '../../../components/AttendanceList/AttendanceList';
import { fetchPresencaRelatorio } from '../../../client/api';
import styles from './style.module.css';

export default function RelatorioPresenca() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [presencaData, setPresencaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [turmas, setTurmas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  
  // Fetch attendance data when selected date changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const userData = localStorage.getItem('user'); // Get user data
        if (!userData) {
          throw new Error('Por favor, faça login para acessar os dados.');
        }
        const user = JSON.parse(userData);
        const jwt = user.JWT; // Extract JWT
        if (!jwt) {
          throw new Error('Token de autenticação não encontrado.');
        }
        console.log("Fetching with date:", formattedDate, "JWT:", jwt); // Debug
        const data = await fetchPresencaRelatorio(formattedDate, jwt); // Pass JWT
        setPresencaData(data);

        const uniqueTurmas = [...new Set(data.map(item => item.turma_nome))];
        setTurmas(uniqueTurmas);

        if (uniqueTurmas.length > 0 && !selectedTurma) {
          setSelectedTurma(uniqueTurmas[0]);
          const turmaData = data.filter(item => item.turma_nome === uniqueTurmas[0]);
          const uniqueMaterias = [...new Set(turmaData.map(item => item.materia_nome))];
          setMaterias(uniqueMaterias);
          if (uniqueMaterias.length > 0 && !selectedMateria) {
            setSelectedMateria(uniqueMaterias[0]);
          }
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Erro ao carregar dados de presença. Por favor, tente novamente.');
        setLoading(false);
        console.error("Fetch error:", err.response ? err.response.data : err.message);
      }
    };
    fetchData();
  }, [selectedDate]);
  
  // Update materias when turma changes
  useEffect(() => {
    if (!selectedTurma || !presencaData.length) return;
    
    // Filter materias by selected turma
    const turmaData = presencaData.filter(item => item.turma_nome === selectedTurma);
    const uniqueMaterias = [...new Set(turmaData.map(item => item.materia_nome))];
    setMaterias(uniqueMaterias);
    
    // Reset selected materia or set to first option
    if (uniqueMaterias.length > 0) {
      if (!uniqueMaterias.includes(selectedMateria)) {
        setSelectedMateria(uniqueMaterias[0]);
      }
    } else {
      setSelectedMateria('');
    }
  }, [selectedTurma, presencaData]);
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  // Handle turma change
  const handleTurmaChange = (e) => {
    setSelectedTurma(e.target.value);
  };
  
  // Handle materia change
  const handleMateriaChange = (e) => {
    setSelectedMateria(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Cabecalho />
      <Navbar />
      <Fundo>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Relatório de Presença</h1>
          
          <div className={styles.grid}>
            <div className={styles.calendarSection}>
              <CalendarView 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
              
              <div className={styles.filters}>
                <div className={styles.formGroup}>
                  <label htmlFor="turma">Turma:</label>
                  <select 
                    id="turma" 
                    value={selectedTurma} 
                    onChange={handleTurmaChange}
                    className={styles.select}
                    disabled={loading || turmas.length === 0}
                  >
                    {turmas.length > 0 ? (
                      turmas.map(turma => (
                        <option key={turma} value={turma}>{turma}</option>
                      ))
                    ) : (
                      <option value="">Nenhuma turma disponível</option>
                    )}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="materia">Matéria:</label>
                  <select 
                    id="materia" 
                    value={selectedMateria} 
                    onChange={handleMateriaChange}
                    className={styles.select}
                    disabled={loading || materias.length === 0}
                  >
                    {materias.length > 0 ? (
                      materias.map(materia => (
                        <option key={materia} value={materia}>{materia}</option>
                      ))
                    ) : (
                      <option value="">Nenhuma matéria disponível</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            
            <div className={styles.attendanceSection}>
              {loading ? (
                <div className={styles.loading}>Carregando dados de presença...</div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : (
                <AttendanceList 
                  presencaData={presencaData}
                  selectedDate={selectedDate}
                  turma={selectedTurma}
                  materia={selectedMateria}
                />
              )}
            </div>
          </div>
          
          {/* AttendanceTable Component for Weekly/Monthly View */}
          {selectedTurma && selectedMateria && (
            <div className={styles.attendanceTable}>
              <h2 className={styles.tableTitle}>
                Visão {viewMode === 'week' ? 'Semanal' : 'Mensal'} de Presença
              </h2>
              
              <div className={styles.tableWrapper}>
                {/* Import the component below */}
                <AttendanceTable 
                  presencaData={presencaData}
                  selectedDate={selectedDate}
                  turma={selectedTurma}
                  materia={selectedMateria}
                  viewMode={viewMode}
                />
              </div>
            </div>
          )}
        </div>
      </Fundo>
      <Footer />
    </div>
  );
}

// This component renders the attendance table with students as rows and days as columns
function AttendanceTable({ presencaData, selectedDate, turma, materia, viewMode }) {
  const [students, setStudents] = useState([]);
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Generate calendar days
  useEffect(() => {
    if (!selectedDate) return;
    
    const days = [];
    
    if (viewMode === 'week') {
      // Get week days (starting Sunday)
      const startDay = new Date(selectedDate);
      startDay.setDate(selectedDate.getDate() - selectedDate.getDay()); // Start from Sunday
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDay);
        day.setDate(startDay.getDate() + i);
        days.push(day);
      }
    } else {
      // Get month days
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Start from the previous Sunday if the month doesn't start on Sunday
      const startDay = new Date(firstDay);
      startDay.setDate(firstDay.getDate() - firstDay.getDay());
      
      // Continue until the last day of month is included
      let currentDay = new Date(startDay);
      while (currentDay <= lastDay || currentDay.getDay() !== 6) { // Continue until Saturday
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
    }
    
    setCalendarDays(days);
  }, [selectedDate, viewMode]);
  
  // Extract unique students
  useEffect(() => {
    if (!presencaData.length || !turma || !materia) return;
    
    // Filter data by turma and materia
    const filteredData = presencaData.filter(
      item => item.turma_nome === turma && item.materia_nome === materia
    );
    
    // Extract unique students
    const uniqueStudents = [];
    const studentIds = new Set();
    
    filteredData.forEach(item => {
      if (!studentIds.has(item.id_aluno)) {
        studentIds.add(item.id_aluno);
        uniqueStudents.push({
          id: item.id_aluno,
          nome: item.aluno_nome
        });
      }
    });
    
    // Sort by name
    uniqueStudents.sort((a, b) => a.nome.localeCompare(b.nome));
    
    setStudents(uniqueStudents);
  }, [presencaData, turma, materia]);
  
  // Function to check attendance status for a student on a specific day
  const getAttendanceStatus = (studentId, date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const attendance = presencaData.find(
      item => item.id_aluno === studentId && 
             format(new Date(item.chamada_abertura), 'yyyy-MM-dd') === formattedDate &&
             item.turma_nome === turma &&
             item.materia_nome === materia
    );
    
    if (!attendance) return 'inactive'; // No data
    return attendance.presenca_status ? 'present' : 'absent';
  };
  
  if (students.length === 0 || calendarDays.length === 0) {
    return <div className={styles.noData}>Nenhum dado disponível para exibição.</div>;
  }
  
  return (
    <div className={styles.attendanceTableContainer}>
      <table className={styles.attendanceTable}>
        <thead>
          <tr>
            <th className={styles.nameHeader}>Aluno</th>
            {calendarDays.map(day => (
              <th key={day.toISOString()} className={styles.dayHeader}>
                <div className={styles.dayCol}>
                  <span className={styles.dayName}>{format(day, 'EEE', { locale: ptBR })}</span>
                  <span className={styles.dayNumber}>{format(day, 'dd')}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td className={styles.studentName}>{student.nome}</td>
              {calendarDays.map(day => (
                <td key={day.toISOString()} className={styles.dayCell}>
                  <div className={`${styles.attendanceMarker} ${styles[getAttendanceStatus(student.id, day)]}`}>
                    {getAttendanceStatus(student.id, day) === 'present' ? '✓' : 
                     getAttendanceStatus(student.id, day) === 'absent' ? '✗' : ''}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}