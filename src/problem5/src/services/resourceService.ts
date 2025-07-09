import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Filter = { name?: string };

export async function create(data: { name: string; value?: string }) {
  return prisma.resource.create({ data });
}

export async function list(filter: Filter) {
  return prisma.resource.findMany({
    where: {
      name: filter.name
        ? { equals: String(filter.name) }
        : undefined,
    },
  });
}

export async function getById(id: number) {
  return prisma.resource.findUniqueOrThrow({ where: { id } });
}

export async function update(id: number, data: { name?: string; value?: string }) {
  return prisma.resource.update({ where: { id }, data });
}

export async function remove(id: number) {
  return prisma.resource.delete({ where: { id } });
}