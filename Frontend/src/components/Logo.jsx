import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <svg 
        viewBox="0 0 24 24" 
        className={styles.logoIcon}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M5 17h14m-3 3v-6.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V20m3 0v-6m3 6v-6m3 6v-6M3 9l3-6h12l3 6m-3 3V9H6v3" />
      </svg>
      <span className={styles.logoText}>LogisticPro</span>
    </div>
  );
}
