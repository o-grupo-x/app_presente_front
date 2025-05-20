// pages/SignIn.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import logo from '../../img/logo-removebg.png';
import Image from "next/image";
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
// // import sendLog from '@/utils/logHelper';
import useLogin from '@/hooks/useLogin'; // << novo hook
import { jwtDecode } from 'jwt-decode';

export default function SignIn() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();  // "user" não é muito usado aqui
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  const { loginRequest, loading, error } = useLogin();

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // //sendLog('Formulário de login submetido', 'info');
    setButtonClicked(true);

    try {
      const { decoded, rawData } = await loginRequest({ login, senha: password });
      // Salva no localStorage
      localStorage.setItem('user', JSON.stringify(rawData));
      localStorage.setItem('token', rawData.JWT);
      // Seta no contexto
      setUser(decoded);
      // Redireciona
      router.push(`/${decoded.sub.cargo.toLowerCase()}/home`);
    } catch (err) {
      // tratar erro
      console.error(err);
      setServerResponse(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatar_center}>
          <Image src={logo} className={styles.avatar} alt="Logo do APP PRESENTE" />
          <h1 className={styles.title}>Bem Vindo ao Stage</h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Login:</label>
            <input
              className={styles.input}
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Senha:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.showButton}
              onClick={handleShowClick}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            className={styles.loginButton}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Acessar'}
          </motion.button>
          {error && <p style={{ color: 'red' }}>Erro: {error.message}</p>}
          {serverResponse && <p>{serverResponse}</p>}

          <p className={styles.helperText}>Forgot password?</p>
        </form>
      </div>
    </div>
  );
}
