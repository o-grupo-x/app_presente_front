import Link from "next/link";
import styles from "./navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faUserCheck,
  faChalkboardTeacher,
  faBell,
  faTachometerAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("");
  const { user } = useUser();
  const [userType, setUserType] = useState("");
  const [userCurso, setUserCurso] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserType(user.sub.cargo);
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", user.sub);
      if (user.sub.nome) {
        const updatedCourse = user.sub.nome.replace(/_/g, " ");
        setUserCurso(updatedCourse);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && user.sub.cargo === "Professor") {
      const restrictedRoutes = ["/admin", "/aluno"];
      if (restrictedRoutes.some((route) => router.pathname.startsWith(route))) {
        router.push("/home");
      }
    }
  }, [router.pathname,user,router]);

  const getMenuItems = () => {
    if (userType === "Aluno") {
      return [
        { name: "Histórico", icon: faHistory, link: "/aluno/historico" },
        { name: "Presença", icon: faUserCheck, link: "/aluno/home" },
      ];
    }

    if (userType === "Professor") {
      return [
        { name: "Chamada", icon: faUserCheck, link: "/professor/home" },
        { name: "Frequência", icon: faHistory, link: "/professor/frequencia" },
        { name: "Presença", icon: faChalkboardTeacher, link: "/professor/presenca" },
      ];
    }

    if (userType === "Secretaria") {
      return [
        { name: "Dashboard", icon: faTachometerAlt, link: "/secretaria/home" },
        { name: "Chamada", icon: faUserCheck, link: "/secretaria/chamada" },
        { name: "Cadastrar", icon: faUserPlus, link: "/secretaria/cadastrar" },
        { name: "Presença", icon: faChalkboardTeacher, link: "/secretaria/presenca" },
        { name: "Aluno", icon: faUserPlus, link: "/secretaria/aluno" },
        { name: "Lembrete", icon: faBell, link: "/secretaria/lembrete" },
      ];
    }
    return [];
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.userInfo}>
          <div className={styles.userText}>
            <span className={styles.userName}>{user ? user.sub.nome : ""}</span>
            <span className={styles.userCourse}>
              {user
                ? user.sub.cargo === "Professor" || user.sub.cargo === "Secretaria"
                  ? user.sub.cargo
                  : userCurso
                : ""}
            </span>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.adminMenu}>
            {getMenuItems().map((item) => (
              <li key={item.name} onClick={() => setActiveItem(item.name)}>
                <Link href={item.link}>
                  <span
                    className={`${styles.iconTextContainer} ${
                      router.pathname === item.link ? styles.active : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} size="1x" />
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
