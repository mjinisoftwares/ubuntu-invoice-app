"use server";

import fs from "fs/promises";
import path from "path";
import { InvoiceData } from "@/types/invoice";
import { QuotationData } from "@/types/quotation";

const DB_PATH = path.join(process.cwd(), "db.json");

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch (e) {
    // If not exists, create it
    await fs.writeFile(DB_PATH, JSON.stringify({ invoices: [], quotations: [] }, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(data:any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function saveInvoiceToHistory(invoice: InvoiceData) {
  const db = await readDb();
  const idx = db.invoices.findIndex((i: InvoiceData) => i.invoiceNumber === invoice.invoiceNumber);
  if (idx >= 0) {
    db.invoices[idx] = invoice;
  } else {
    db.invoices.push(invoice);
  }
  await writeDb(db);
}

export async function getInvoiceHistory(): Promise<InvoiceData[]> {
  const db = await readDb();
  return db.invoices;
}

export async function saveQuotationToHistory(quotation: QuotationData) {
  const db = await readDb();
  const idx = db.quotations.findIndex((q: QuotationData) => q.quotationNumber === quotation.quotationNumber);
  if (idx >= 0) {
    db.quotations[idx] = quotation;
  } else {
    db.quotations.push(quotation);
  }
  await writeDb(db);
}

export async function getQuotationHistory(): Promise<QuotationData[]> {
  const db = await readDb();
  return db.quotations;
}

export async function deleteInvoiceRecord(invoiceNumber: string) {
  const db = await readDb();
  db.invoices = db.invoices.filter((r: InvoiceData) => r.invoiceNumber !== invoiceNumber);
  await writeDb(db);
}

export async function deleteQuotationRecord(quotationNumber: string) {
  const db = await readDb();
  db.quotations = db.quotations.filter((r: QuotationData) => r.quotationNumber !== quotationNumber);
  await writeDb(db);
}
