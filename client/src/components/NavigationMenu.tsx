import { Link, useNavigate } from "react-router-dom";
import styles from "./NavigationMenu.module.css";

function WebsiteTitle({
  title,
  svgLink,
  homeRoute,
}: {
  title: string;
  svgLink: string;
  homeRoute: string;
}) {
  function returnHomeEvent(ev: React.MouseEvent | React.KeyboardEvent) {
    const navigate = useNavigate();
    if (
      (ev instanceof KeyboardEvent && (ev.key === " " || ev.key === "Enter")) ||
      ev instanceof MouseEvent
    ) {
      navigate(homeRoute);
    }
  }

  return (
    <>
      <img
        src={svgLink}
        alt="Braid"
        onClick={returnHomeEvent}
        onKeyDown={returnHomeEvent}
      />
      <span onClick={returnHomeEvent} onKeyDown={returnHomeEvent}>
        {title}
      </span>
    </>
  );
}

export default function NavigationMenu({
  addresses,
  websiteTitle,
}: {
  addresses: { title: string; address: string }[];
  websiteTitle: { title: string; svgLink: string; homeRoute: string };
}) {
  return (
    <nav className={styles["nav"]}>
      <div className={styles["left"]}>
        <WebsiteTitle
          homeRoute={websiteTitle.homeRoute}
          svgLink={websiteTitle.svgLink}
          title={websiteTitle.title}
        />
      </div>
      <div className={styles["right"]}>
        <ul>
          {addresses.map((link) => (
            <li key={link.title}>
              <Link to={link.address} className={styles["navigation-link"]}>
                {link.title}
              </Link>
            </li>
          ))}
          {localStorage.getItem("username") ? (
            <li className="username">
              <Link to={`/profile/${localStorage.getItem("username")}`}>
                {localStorage.getItem("username")}
              </Link>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </nav>
  );
}
