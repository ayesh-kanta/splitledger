/**
 * utils/export.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Helpers for exporting transaction data as CSV or PDF.
 */

import Papa       from 'papaparse';
import jsPDF      from 'jspdf';
import autoTable  from 'jspdf-autotable';
import { fmt }    from './calculations';

/**
 * Format a Firestore Timestamp or ISO string to a readable date.
 */
const fmtDate = (d) => {
  if (!d) return '';
  const date = d?.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString('en-IN');
};

/**
 * Build a flat row array from transactions + lookup maps.
 */
function buildRows(transactions, friendsMap, accountsMap) {
  return transactions.map((tx) => ({
    Date:    fmtDate(tx.date),
    Type:    tx.type === 'expense' ? 'Lent' : 'Received',
    Friend:  friendsMap[tx.friendId]  || tx.friendId  || '—',
    Account: accountsMap[tx.accountId] || tx.accountId || '—',
    Amount:  tx.amount,
    Notes:   tx.notes || '',
  }));
}

/**
 * Export transactions to a CSV file and trigger download.
 */
export function exportCSV(transactions, friendsMap, accountsMap) {
  const rows  = buildRows(transactions, friendsMap, accountsMap);
  const csv   = Papa.unparse(rows);
  const blob  = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url   = URL.createObjectURL(blob);
  const link  = document.createElement('a');
  link.href        = url;
  link.download    = `splitledger_export_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to a styled PDF file and trigger download.
 */
export function exportPDF(transactions, friendsMap, accountsMap, totals) {
  const doc  = new jsPDF({ orientation: 'landscape' });
  const rows = buildRows(transactions, friendsMap, accountsMap);

  // Title
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('SplitLedger — Transaction Report', 14, 16);

  // Summary line
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-IN')}  |  Total Lent: ${fmt(totals.totalLent)}  |  Total Received: ${fmt(totals.totalReceived)}  |  Net Pending: ${fmt(totals.netPending)}`,
    14,
    24,
  );

  // Table
  autoTable(doc, {
    startY: 30,
    head:   [['Date', 'Type', 'Friend', 'Account', 'Amount (₹)', 'Notes']],
    body:   rows.map((r) => [r.Date, r.Type, r.Friend, r.Account, r.Amount.toLocaleString('en-IN'), r.Notes]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles:    { fillColor: [14, 165, 233], textColor: 255 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: { 4: { halign: 'right' } },
  });

  doc.save(`splitledger_report_${Date.now()}.pdf`);
}
