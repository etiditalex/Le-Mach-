import { randomBytes } from "crypto";

export function newReceiptKey(): string {
  return randomBytes(16).toString("hex");
}
