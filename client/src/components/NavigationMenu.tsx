import { Link } from "react-router-dom";
import styles from "./NavigationMenu.module.css";

function PrintLink({ title, address }: { title: string; address: string }) {
  return (
    <Link to={address} className={styles["navigation-link"]}>
      {title}
    </Link>
  );
}

export default function NavigationBar({
  addresses,
}: {
  addresses: { title: string; address: string }[];
}) {
  return (
    <nav className={styles["nav"]}>
      <div className={styles["left"]}>
        <p className={styles["icon"]}>ICON</p>
        <p className={styles["title"]}>Braid</p>
      </div>
      <div className={styles["right"]}>
        {addresses.map((link) => (
          <PrintLink title={link.title} address={link.address} />
        ))}
      </div>
    </nav>
  );
}
