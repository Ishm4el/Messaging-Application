import readline from "readline/promises";
import stream from "stream";
import { writeFile } from "fs/promises";

const SQL_APPLICATION = "messaging_application";

export const envGenerator = async () => {
  console.log("Setting up the server");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const corsOrigin = await rl.question(
    "Enter the CORS Origin (enter blank for http://localhost:5173): "
  );
  const port = await rl.question("Enter Port (enter blank for 3000): ");
  // const jwtSecretKey = await rl.question(
  //   "Enter Secret Key (enter blank for 'secret'): "
  // );
  const dbDomainHost = await rl.question(
    "Enter your database domain address (leave blank for 'localhost:5432'): "
  );
  const dbUsername = await rl.question(
    "Enter your database username (enter blank for 'postgres'): "
  );
  rl.close();

  const mutableStdout = new stream.Writable({
    write: function (chunk, encoding, callback) {
      if (!this.muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });

  mutableStdout.muted = true;

  const rlPassword = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true,
  });

  process.stdout.write("Enter database password: ");
  const dbPassword = await rlPassword.question("");
  console.log();

  process.stdout.write("Enter jwt secret key (leave blank for 'secret'): ");
  const jwtSecretKey = await rlPassword.question("");
  console.log();

  mutableStdout.muted = false;
  rlPassword.close();

  const corsOriginString = `ORIGIN="${
    corsOrigin === "" ? "http://localhost:5173" : corsOrigin
  }"`;
  const portString = `PORT=${port === "" ? 3000 : port}`;
  const jwtSecretKeyString = `JWT_SECRET_KEY="${
    jwtSecretKey === "" ? "secret" : jwtSecretKey
  }"`;
  const dbA = `${
    dbDomainHost === "" ? "localhost:5432" : dbDomainHost
  }/${SQL_APPLICATION}`;
  const dbURLString = `DATABASE_URL="postgresql://${
    dbUsername === "" ? "postgres" : dbUsername
  }:${dbPassword}@${dbA}"`;

  await writeFile(
    "./server/.env",
    `${corsOriginString}\n${portString}\n${jwtSecretKeyString}\n${dbURLString}`
  );
};

export const clientEnvGenerator = async () => {
  console.log("Setting up the Client");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const apiLink = await rl.question(
    "Enter the API link (leave blank for 'http://localhost:3000/'): "
  );

  rl.close();

  const apiURLString = `VITE_APP_API_URL=${
    apiLink === "" ? "http://localhost:3000/" : apiLink
  }`;
  await writeFile("./client/.env", `${apiURLString}\n`);
};
