import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const documents = [
  {
    file: 'public/downloads/lehrgang-hochburg-ach-de.pdf',
    title: 'Lehrgang Hochburg-Ach',
    lines: [
      'Ausschreibung',
      '12.-13. September 2026',
      'Mehrzweckhalle der neuen Mittelschule, Duttendorf',
      'Leitung: Daniel und Sonia Toutain',
      'Samstag: 10:00 bis 17:30',
      'Sonntag: 09:30 bis 13:00',
      'Kontakt: dojo@aikido-hochburg-ach.at',
    ],
  },
  {
    file: 'public/downloads/lehrgang-hochburg-ach-en.pdf',
    title: 'Seminar Hochburg-Ach',
    lines: [
      'Information sheet',
      'September 12-13, 2026',
      'Multi-purpose hall, Duttendorf',
      'Teachers: Daniel and Sonia Toutain',
      'Saturday: 10:00 to 17:30',
      'Sunday: 09:30 to 13:00',
      'Contact: dojo@aikido-hochburg-ach.at',
    ],
  },
  {
    file: 'public/downloads/ushi-deshi-birach-de.pdf',
    title: 'Ushi Deshi Birach',
    lines: [
      'Ausschreibung',
      '14.-18. September 2026',
      'Birach',
      'Leitung: Daniel und Sonia Toutain',
      'Intensivwoche mit taeglichem Training',
      'Unterkunft nach Absprache',
      'Kontakt: dojo@aikido-hochburg-ach.at',
    ],
  },
  {
    file: 'public/downloads/ushi-deshi-birach-en.pdf',
    title: 'Ushi Deshi Birach',
    lines: [
      'Information sheet',
      'September 14-18, 2026',
      'Birach',
      'Teachers: Daniel and Sonia Toutain',
      'Intensive week with daily training',
      'Accommodation on request',
      'Contact: dojo@aikido-hochburg-ach.at',
    ],
  },
];

function escapePdfText(value) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function createPdf({ title, lines }) {
  const textLines = [title, '', ...lines];
  const commands = [
    'BT',
    '/F1 22 Tf',
    '54 790 Td',
    `(${escapePdfText(textLines[0])}) Tj`,
    '0 -34 Td',
    '/F1 12 Tf',
  ];

  for (const line of textLines.slice(1)) {
    commands.push(`(${escapePdfText(line)}) Tj`);
    commands.push('0 -20 Td');
  }

  commands.push('ET');

  const stream = `${commands.join('\n')}\n`;

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += object;
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return pdf;
}

for (const document of documents) {
  const target = resolve(document.file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, createPdf(document), 'utf8');
}
