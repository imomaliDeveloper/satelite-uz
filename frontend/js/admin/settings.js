/**
 * SATELITE.UZ - Admin Import & Settings Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('admin-sidebar-nav').innerHTML = getSidebarHtml('settings');

  setupImportLogic();
});

function setupImportLogic() {
  const fileInput = document.getElementById('import-file');
  const rawInput = document.getElementById('import-raw');
  const runBtn = document.getElementById('run-import-btn');

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      rawInput.value = event.target.result;
    };
    reader.readAsText(file);
  });

  runBtn.addEventListener('click', async () => {
    const raw = rawInput.value.trim();
    if (!raw) {
      Toast.error('Please upload a file or paste data into the text box.');
      return;
    }

    runBtn.disabled = true;
    runBtn.textContent = 'Parsing & Importing...';

    let questions = [];

    try {
      if (raw.startsWith('[') || raw.startsWith('{')) {
        // Parse JSON
        const parsed = JSON.parse(raw);
        questions = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // Parse CSV
        questions = parseCsv(raw);
      }

      if (questions.length === 0) {
        throw new Error('No valid question records could be parsed.');
      }

      const res = await API.post('/import/questions', { questions });
      const data = res.data;

      const resultsDiv = document.getElementById('import-results');
      resultsDiv.style.display = 'block';

      let errorListHtml = '';
      if (data.errors && data.errors.length > 0) {
        errorListHtml = `
          <div style="margin-top: 12px; color: var(--danger); font-size: 0.85rem;">
            <strong>Errors encountered:</strong>
            <ul style="margin-left: 20px; margin-top: 4px;">
              ${data.errors.map(err => `<li>Row ${err.row}: ${err.error}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      resultsDiv.innerHTML = `
        <div class="card" style="background: var(--bg-surface-elevated); border-color: ${data.errorsCount > 0 ? 'var(--warning)' : 'var(--success)'}; padding: 20px;">
          <h4 style="color: ${data.errorsCount > 0 ? '#f59e0b' : '#10b981'}; margin-bottom: 6px;">
            ${data.importedCount} Question(s) Successfully Imported!
          </h4>
          <p class="text-secondary" style="font-size: 0.9rem;">
            Failed rows: ${data.errorsCount}
          </p>
          ${errorListHtml}
        </div>
      `;

      Toast.success(`Imported ${data.importedCount} questions.`);
      rawInput.value = '';
    } catch (err) {
      Toast.error(err.message || 'Failed to process import.');
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = 'Process & Import Questions';
    }
  });
}

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = splitCsvLine(lines[0]).map(h => h.trim());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    if (values.length < headers.length) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx];
    });

    records.push({
      subjectName: rowObj.subject || rowObj.subjectName,
      topicName: rowObj.topic || rowObj.topicName,
      questionText: rowObj.question || rowObj.questionText,
      optionA: rowObj.optionA,
      optionB: rowObj.optionB,
      optionC: rowObj.optionC,
      optionD: rowObj.optionD,
      correctAnswer: rowObj.correctAnswer || 'A',
      difficulty: rowObj.difficulty || 'MEDIUM',
      explanation: rowObj.explanation || ''
    });
  }

  return records;
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}
