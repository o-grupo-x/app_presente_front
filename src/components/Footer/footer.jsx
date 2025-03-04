// Footer.js
import Link from 'next/link';
import Image from 'next/image';
import logo from "../../img/logo-removebg.png";
import styles from './Footer.module.css';
import React from 'react';

function Footer() {
    return (
        <footer className={styles.page_footer}> 
            <span>copyright by </span>
            <a href="#" target="_blank">
              <Image src={logo} alt="App Logo" />
            </a>
        </footer>
    );
}

export default Footer;
