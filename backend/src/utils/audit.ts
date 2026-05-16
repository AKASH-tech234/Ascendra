import { prisma } from "../db";

export type AuditEntry = {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function writeAuditLog(entry: AuditEntry) {
  await prisma.auditLog.create({
    data: {
      actorId: entry.actorId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? undefined,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
    },
  });
}
