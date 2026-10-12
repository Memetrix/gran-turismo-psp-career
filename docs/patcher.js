(() => {
  const input = document.getElementById('iso');
  const progress = document.getElementById('progress');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const title = document.getElementById('result-title');
  const description = document.getElementById('result-text');
  const save = document.getElementById('save-iso');
  const cancel = document.getElementById('cancel');
  let worker = null;
  let outputUrl = null;

  function stop(resetInput = true) {
    if (worker) worker.terminate();
    worker = null;
    input.disabled = false;
    cancel.hidden = true;
    progress.hidden = true;
    if (resetInput) input.value = '';
  }

  function clearDownload() {
    save.hidden = true;
    save.removeAttribute('href');
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = null;
  }

  function showResult(heading, message) {
    title.textContent = heading;
    description.textContent = message;
    result.hidden = false;
  }

  function fail(message) {
    stop();
    clearDownload();
    status.textContent = 'Installation stopped.';
    showResult('Could not finish', message);
  }

  cancel.addEventListener('click', () => {
    stop();
    clearDownload();
    result.hidden = true;
    status.textContent = 'Cancelled. You can choose an ISO to try again.';
  });

  function startSelectedFile() {
    if (worker) return;
    const file = input.files && input.files[0];
    if (!file) return;
    stop(false);
    clearDownload();
    result.hidden = true;
    if (file.size !== CAREER_PATCH.inputBytes && file.size !== CAREER_PATCH.outputBytes) {
      status.textContent = 'This ISO is not supported.';
      showResult('Choose an original USA ISO', 'Use an unmodified Gran Turismo PSP USA ISO. Extract CHD, CSO or ZIP files to a plain ISO first.');
      return;
    }
    if (typeof Worker !== 'function' || !window.crypto || !window.crypto.subtle) {
      fail('This browser does not support the installer. Update your browser or use the manual installation guide below.');
      return;
    }
    input.disabled = true;
    cancel.hidden = false;
    progress.hidden = false;
    progress.value = 0;
    status.textContent = 'Checking your ISO…';
    let current;
    try {
      current = new Worker('patch-worker.js?v=20261012-1');
    } catch (error) {
      fail('This browser could not start the installer. Try another browser or use the manual installation guide.');
      return;
    }
    worker = current;
    current.onmessage = ({ data }) => {
      if (worker !== current) return;
      if (data.type === 'progress') {
        status.textContent = data.message;
        if (typeof data.percent === 'number') progress.value = data.percent;
        else progress.removeAttribute('value');
      } else if (data.type === 'already-patched') {
        stop(false);
        status.textContent = 'Check complete.';
        showResult('This is the finished 1.1 ISO', 'Your file is ready to play. Open it in PPSSPP or copy it to your PSP’s ISO folder.');
      } else if (data.type === 'ready') {
        // The transferred buffer belongs to this page; stop releases the source ISO.
        stop(false);
        try {
          outputUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'application/octet-stream' }));
          save.href = outputUrl;
          save.download = CAREER_PATCH.outputName;
          save.hidden = false;
          status.textContent = 'Patch applied and checked.';
          showResult('Your career ISO is ready', 'Save the ISO below, then open it in PPSSPP or copy it to your PSP’s ISO folder.');
        } catch (error) {
          fail('The browser could not prepare the download. Close other apps and try again, or use the manual installation guide.');
        }
      } else if (data.type === 'error') {
        fail(data.message);
      }
    };
    current.onerror = (event) => {
      event.preventDefault();
      if (worker === current) fail('The browser could not finish the patch. Close other apps and try again, or use the manual installation guide.');
    };
    try {
      current.postMessage({ file });
    } catch (error) {
      fail('Could not read this ISO. Select a file from your device’s storage and try again.');
    }
  }

  if (typeof CAREER_PATCH === 'undefined') {
    fail('The installer could not load. Reload this page or use the manual installation guide below.');
    input.disabled = true;
    return;
  }
  input.addEventListener('change', startSelectedFile);
  // Mobile browsers can restore a selection without firing another change event.
  window.addEventListener('pageshow', () => {
    if (!worker && result.hidden) startSelectedFile();
  });
  status.textContent = 'No file selected.';
  input.disabled = false;
  startSelectedFile();
})();
