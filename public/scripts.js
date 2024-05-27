document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const progress = document.getElementById('progress');
  const dataContainer = document.getElementById('dataContainer');
  const pagination = document.getElementById('pagination');
  const rowsPerPage = 100;
  let currentPage = 1;
  let data = [];

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    progress.innerHTML = 'Uploading...';

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    data = await response.json();
    currentPage = 1;
    displayData();
    setupPagination();
    progress.innerHTML = 'Upload complete!';
  });

  function displayData() {
    dataContainer.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach(row => {
      const tr = document.createElement('tr');
      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = row[header];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    dataContainer.appendChild(table);
  }

  function setupPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(data.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement('span');
      link.className = 'page-link';
      link.textContent = i;
      link.addEventListener('click', () => {
        currentPage = i;
        displayData();
      });
      pagination.appendChild(link);
    }
  }
});
