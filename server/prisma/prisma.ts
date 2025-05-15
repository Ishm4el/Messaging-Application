import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: { user: { password: true, email: true, id: true } },
});

export { PrismaClient };

export default prisma;
