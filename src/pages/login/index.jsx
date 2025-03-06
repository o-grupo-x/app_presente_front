// pages/SignIn.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import logo from '../../img/logo-removebg.png'
import Image from "next/image";
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import sendLog from '@/utils/logHelper';
import api from '@/client/api';
import { jwtDecode } from 'jwt-decode';

const SignIn = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);


  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLog('Formulário de login submetido', 'info');
    Login();
}


  const Login = () => {
    const payload = {
      login: login,
      senha: password
    }
    
    sendLog(`Tentativa de login com usuário: ${payload}`, 'info');

    console.log("Payload:" , payload);

    api.usuario.login(payload)
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        const {JWT, ...user} = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token',JWT);
        const decoded = jwtDecode(JWT);
        console.log("Decoded JWT:", decoded);
        setUser(decoded);
        sendLog(`Login bem-sucedido: ${JSON.stringify(decoded)}`, 'success');
        router.push(`/${decoded.sub.cargo.toLowerCase()}/home`);
      } else {
        sendLog(`Resposta inesperada do servidor: ${JSON.stringify(response.data)}`, 'warn');
        //console.log(response.data ? response.data.message : "Resposta inesperada do servidor.");
      }
    })
    .catch((error) => {
      sendLog(`Erro de login: ${error.message}`, 'error');
      console.error(error);
    });
};

 
  return (
    <>
   
    <div className={styles.container}>
      <div className={styles.card}>
      {/* <div className={styles.serverResponse}>{renderResponse()}</div> */}
      <div className={styles.avatar_center}>
            <Image src={logo} className={styles.avatar} alt="Logo do APP PRESENTE"/>
        <h1 className={styles.title}>Bem Vindo</h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Login:</label>
            <input 
              // type="email" 
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
            <button type="button" className={styles.showButton} onClick={handleShowClick}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.1 }}
        className={styles.loginButton}
        onClick={Login}
      >
        Acessar
      </motion.button>
          <p className={styles.helperText}>Forgote password?</p>
        </form>
      </div>
    </div>
    </>
  );
};

export default SignIn;