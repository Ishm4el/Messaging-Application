import { envGenerator, clientEnvGenerator } from "./utility/initiaterUtility.js";

const main = async () => {
  await envGenerator();
  console.log();
  await clientEnvGenerator();
};

main();
