// components/AttendanceList/AttendanceList.jsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './AttendanceList.module.css';

export default function AttendanceList({ presencaData, selectedDate, turma, materia }) {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!presencaData || !selectedDate || !turma || !materia) return;
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Filter data by date, turma, and materia
    const filteredData = presencaData.filter(item => {
      const itemDate = format(new Date(item.chamada_abertura), 'yyyy-MM-dd');
      return itemDate === formattedDate && 
             item.turma_nome === turma && 
             item.materia_nome === materia;
    });
    
    // Get unique students
    const studentsMap = new Map();
    filteredData.forEach(item => {
      studentsMap.set(item.id_aluno, {
        id: item.id_aluno,
        nome: item.aluno_nome,
        presenca: item.presenca_status,
        horario: item.presenca_horario,
        tipo: item.tipo_presenca
      });
    });
    
    const students = Array.from(studentsMap.values());
    
    // Apply search filter if needed
    const searchResults = searchTerm.trim() 
      ? students.filter(student => 
          student.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : students;
    
    setFilteredStudents(searchResults);
  }, [presencaData, selectedDate, turma, materia, searchTerm]);
  
  return (
    <div className={styles.attendanceList}>
      <div className={styles.header}>
        <h2 className={styles.title}>Lista de Presença</h2>
        <div className={styles.details}>
          <p><strong>Turma:</strong> {turma}</p>
          <p><strong>Matéria:</strong> {materia}</p>
          <p><strong>Data:</strong> {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
        </div>
      </div>
      
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Buscar aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>
          <img src="/icons/lupa.svg" alt="Buscar" width={16} height={16} />
        </span>
      </div>
      
      <div className={styles.listContainer}>
        {filteredStudents.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Status</th>
                <th>Horário</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.nome}</td>
                  <td>
                    <span className={`${styles.status} ${student.presenca ? styles.present : styles.absent}`}>
                      {student.presenca ? 'Presente' : 'Ausente'}
                    </span>
                  </td>
                  <td>{student.horario ? format(new Date(student.horario), 'HH:mm') : '-'}</td>
                  <td>{student.tipo || 'Regular'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noData}>
            {searchTerm ? 'Nenhum aluno encontrado para a busca.' : 'Nenhum registro de presença para esta data.'}
          </div>
        )}
      </div>
      
      <div className={styles.summary}>
        <p><strong>Total de alunos:</strong> {filteredStudents.length}</p>
        <p>
          <strong>Presentes:</strong> {filteredStudents.filter(s => s.presenca).length} 
          ({filteredStudents.length > 0 
            ? Math.round((filteredStudents.filter(s => s.presenca).length / filteredStudents.length) * 100) 
            : 0}%)
        </p>
        <p>
          <strong>Ausentes:</strong> {filteredStudents.filter(s => !s.presenca).length}
          ({filteredStudents.length > 0 
            ? Math.round((filteredStudents.filter(s => !s.presenca).length / filteredStudents.length) * 100) 
            : 0}%)
        </p>
      </div>
    </div>
  );
}