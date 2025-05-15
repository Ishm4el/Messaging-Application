import styles from "./friendInterface.module.css";

function WaitingRequestListItem() {
  return <li className={styles["list-item"]}></li>;
}

function WaitingRequestList() {
  return <ul className={styles["list"]}></ul>;
}

export default function WaitingRequests() {
  return <section className={styles["section"]}></section>;
}
