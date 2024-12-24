import Logo from './Logo';
import styles from './Navigation.module.css';
import NavLinks from './Navlinks';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Logo/>
          <NavLinks/>
        </div>
      </div>
    </nav>
  );
}
