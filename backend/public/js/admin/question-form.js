/**
 * SATELITE.UZ - Admin Question Form (Create & Edit with Live Preview)
 */
let isEditMode = false;
let editingQuestionId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  editingQuestionId = urlParams.get('id');
  isEditMode = !!editingQuestionId;

  if (document.getElementById('admin-sidebar-nav')) {
    document.getElementById('admin-sidebar-nav').innerHTML = 
      getSidebarHtml(isEditMode ? 'questions' : 'question-create');
  }

  await loadSubjects();
  setupLivePreviewListeners();
  setupFormSubmit();

  if (isEditMode) {
    document.getElementById('form-heading').textContent = 'Edit Question';
    document.getElementById('form-submit-btn').textContent = 'Save Changes';
    await loadQuestionForEdit(editingQuestionId);
  } else {
    updateLivePreview();
  }
});

async function loadSubjects() {
  try {
    const res = await API.get('/subjects');
    const subjects = res.data || [];
    const select = document.getElementById('form-subject');

    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      loadTopicsForSubject(select.value);
      updateLivePreview();
    });
  } catch (err) {
    Toast.error('Failed to load subjects.');
  }
}

async function loadTopicsForSubject(subjectId, preselectedTopicId = null) {
  const topicSelect = document.getElementById('form-topic');
  topicSelect.innerHTML = '<option value="">Select Topic</option>';
  if (!subjectId) return;

  try {
    const res = await API.get(`/topics?subjectId=${subjectId}`);
    const topics = res.data || [];

    topics.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name;
      if (preselectedTopicId && t.id === preselectedTopicId) {
        opt.selected = true;
      }
      topicSelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Failed to load topics:', err);
  }
}

async function loadQuestionForEdit(id) {
  try {
    const res = await API.get(`/questions/${id}`);
    const q = res.data;

    document.getElementById('form-subject').value = q.subjectId;
    await loadTopicsForSubject(q.subjectId, q.topicId);

    document.getElementById('form-difficulty').value = q.difficulty;
    document.getElementById('form-type').value = q.questionType;
    document.getElementById('form-text').value = q.questionText;
    document.getElementById('form-explanation').value = q.explanation || '';
    document.getElementById('form-published').checked = q.isPublished;

    const calcAllowedEl = document.getElementById('form-calc-allowed');
    const refAllowedEl = document.getElementById('form-ref-allowed');
    if (calcAllowedEl) calcAllowedEl.checked = q.calculatorAllowed !== false;
    if (refAllowedEl) refAllowedEl.checked = q.referenceSheetAllowed !== false;

    if (q.imageUrl) {
      const prevWrap = document.getElementById('current-image-preview');
      const prevImg = document.getElementById('current-img-tag');
      if (prevWrap && prevImg) {
        prevImg.src = q.imageUrl;
        prevWrap.style.display = 'block';
      }
    }

    // Populate options
    if (q.options && q.options.length > 0) {
      q.options.forEach(opt => {
        const input = document.querySelector(`.opt-input[data-label="${opt.optionLabel}"]`);
        if (input) input.value = opt.optionText;

        if (opt.isCorrect) {
          const radio = document.getElementById(`correct-${opt.optionLabel}`);
          if (radio) radio.checked = true;
        }
      });
    }

    updateLivePreview();
  } catch (err) {
    Toast.error('Failed to load question details.');
  }
}

function setupLivePreviewListeners() {
  const textInput = document.getElementById('form-text');
  const diffInput = document.getElementById('form-difficulty');
  const explInput = document.getElementById('form-explanation');
  const topicSelect = document.getElementById('form-topic');
  const optInputs = document.querySelectorAll('.opt-input');
  const radios = document.querySelectorAll('input[name="correctChoice"]');

  textInput.addEventListener('input', updateLivePreview);
  diffInput.addEventListener('change', updateLivePreview);
  explInput.addEventListener('input', updateLivePreview);
  topicSelect.addEventListener('change', updateLivePreview);

  optInputs.forEach(i => i.addEventListener('input', updateLivePreview));
  radios.forEach(r => r.addEventListener('change', updateLivePreview));
}

function updateLivePreview() {
  const text = document.getElementById('form-text').value.trim();
  const diff = document.getElementById('form-difficulty').value;
  const expl = document.getElementById('form-explanation').value.trim();
  const subSelect = document.getElementById('form-subject');
  const topicSelect = document.getElementById('form-topic');

  const subName = subSelect.options[subSelect.selectedIndex]?.text || 'Subject';
  const topicName = topicSelect.options[topicSelect.selectedIndex]?.text || 'Topic';

  document.getElementById('preview-diff-badge').textContent = diff;
  document.getElementById('preview-diff-badge').className = `badge badge-${diff.toLowerCase()}`;
  document.getElementById('preview-sub-badge').textContent = subName === 'Select Subject' ? 'Subject' : subName;
  document.getElementById('preview-topic-badge').textContent = topicName === 'Select Topic' ? 'Topic' : topicName;

  document.getElementById('preview-question-text').textContent = 
    text || 'Your question prompt will appear here in real-time as you type...';

  document.getElementById('preview-explanation').textContent = 
    expl || 'Explanation will appear here...';

  const correctChoice = document.querySelector('input[name="correctChoice"]:checked')?.value || 'A';
  const previewOptions = document.getElementById('preview-options-list');

  const optInputs = document.querySelectorAll('.opt-input');
  previewOptions.innerHTML = Array.from(optInputs).map(i => {
    const label = i.dataset.label;
    const val = i.value.trim() || `Option ${label}`;
    const isCorrect = label === correctChoice;

    return `
      <div class="option-choice ${isCorrect ? 'correct' : ''}">
        <span class="option-badge">${label}</span>
        <span class="option-text">${escapeHtml(val)}</span>
        ${isCorrect ? '<span style="color: #10b981; font-weight:700; font-size:0.8rem; margin-left:auto;">✔ Correct Answer</span>' : ''}
      </div>
    `;
  }).join('');
}

function setupFormSubmit() {
  const form = document.getElementById('question-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('form-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const subjectId = document.getElementById('form-subject').value;
    const topicId = document.getElementById('form-topic').value;
    const difficulty = document.getElementById('form-difficulty').value;
    const questionType = document.getElementById('form-type').value;
    const questionText = document.getElementById('form-text').value.trim();
    const explanation = document.getElementById('form-explanation').value.trim();
    const isPublished = document.getElementById('form-published').checked;
    const calculatorAllowed = document.getElementById('form-calc-allowed') ? document.getElementById('form-calc-allowed').checked : true;
    const referenceSheetAllowed = document.getElementById('form-ref-allowed') ? document.getElementById('form-ref-allowed').checked : true;
    const correctChoice = document.querySelector('input[name="correctChoice"]:checked')?.value || 'A';

    const options = [];
    document.querySelectorAll('.opt-input').forEach(input => {
      const label = input.dataset.label;
      options.push({
        optionLabel: label,
        optionText: input.value.trim(),
        isCorrect: label === correctChoice
      });
    });

    const formData = new FormData();
    formData.append('subjectId', subjectId);
    formData.append('topicId', topicId);
    formData.append('difficulty', difficulty);
    formData.append('questionType', questionType);
    formData.append('questionText', questionText);
    formData.append('explanation', explanation);
    formData.append('isPublished', isPublished);
    formData.append('calculatorAllowed', calculatorAllowed);
    formData.append('referenceSheetAllowed', referenceSheetAllowed);
    formData.append('options', JSON.stringify(options));

    const imageFile = document.getElementById('form-image').files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (isEditMode) {
        await API.patch(`/questions/${editingQuestionId}`, formData);
        Toast.success('Question updated successfully.');
      } else {
        await API.post('/questions', formData);
        Toast.success('Question created and stored in database.');
      }

      setTimeout(() => {
        window.location.href = '/admin/questions.html';
      }, 700);
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = isEditMode ? 'Save Changes' : 'Create Question';
      Toast.error(err.message || 'Operation failed.');
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
