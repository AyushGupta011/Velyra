import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";

declare module "@next-auth/prisma-adapter" {
    export function PrismaAdapter(p: PrismaClient): Adapter;
}
