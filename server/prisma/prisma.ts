import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      email: true,
      id: true,
      messageRecipientId: true,
      settings: true,
    },
  },
});

export { PrismaClient };

export default prisma;
