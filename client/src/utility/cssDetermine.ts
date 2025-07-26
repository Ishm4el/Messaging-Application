const setting: string = "backgroundColorSettings";
const selectedStyle: string = localStorage.getItem(setting) || "";

const mainStyle: string = selectedStyle ? `main-${selectedStyle}` : "main";

const sectionStyle: string = selectedStyle
  ? `section-${selectedStyle}`
  : "section";

const cardStyle: string = selectedStyle ? `card-${selectedStyle}` : "card";

const genericStyle: string = selectedStyle ? `-${selectedStyle}` : "";

export { mainStyle, sectionStyle, cardStyle, genericStyle };
