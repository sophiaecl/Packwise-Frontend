import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>PackWise</h1>
      <div className={styles.profileImage} role="img" aria-label="Profile" />
    </header>
  );
}

export default Header;