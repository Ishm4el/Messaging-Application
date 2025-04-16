import readline from "readline/promises";
import stream from "stream";
import { writeFile } from "fs/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const envGenerator = async () => {
  const port = await rl.question("Enter Port (enter blank for 3000): ");
  const jwtSecretKey = await rl.question(
    "Enter Secret Key (enter blank for 'secret'): "
  );
  const dbUsername = await rl.question("Enter your database username: ");
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

  console.log("Enter database password: ");

  const dbPassword = await rlPassword.question("");

  mutableStdout.muted = false;
  rlPassword.close();

  const portString = `PORT=${port === "" ? 3000 : port}`;
  const jwtSecretKeyString = `JWT_SECRET_KEY="${
    jwtSecretKey === "" ? "secret" : jwtSecretKey
  }"`;
  const dbA = `localhost:5432/tagging_game`;
  const dbURLString = `DATABASE_URL="postgresql://${dbUsername}:${dbPassword}@${dbA}"`;

  await writeFile(
    "./server/.env",
    `${portString}\n${jwtSecretKeyString}\n${dbURLString}`
  );
};

module.export = { envGenerator };
