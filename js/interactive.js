document.addEventListener('DOMContentLoaded', () => {
    // TASK 0
    const playerNameInput = document.getElementById('playerNameInput');
    const greetBtn = document.querySelector('#greetBtn');
    const greetingOutput = document.getElementById('greetingOutput');

    greetBtn.addEventListener('click', () => {
        const rawName = playerNameInput.value;
        const trimmedName = rawName.trim();

        if (trimmedName.length === 0) {
            greetingOutput.textContent = 'Please enter a valid player name or gamertag.';
            greetingOutput.className = 'alert alert-warning mb-0';
        } else {
            greetingOutput.textContent = `Welcome to the tournament arena, ${trimmedName}! Ready up for your match.`;
            greetingOutput.className = 'alert alert-success mb-0';
        }
    });

    // TASK 1
    const themeBtnNav = document.getElementById('themeToggleBtn');
    const themeBtnBody = document.getElementById('themeToggleBodyBtn');
    const htmlRoot = document.getElementById('htmlRoot');

    function toggleTheme() {
        const isLight = document.body.classList.toggle('light-theme');

        if (isLight) {
            htmlRoot.setAttribute('data-bs-theme', 'light');
            const nextText = 'Switch to Dark Theme';
            themeBtnNav.textContent = nextText;
            themeBtnBody.textContent = nextText;
            themeBtnNav.className = 'btn btn-outline-dark btn-sm fw-bold';
            themeBtnBody.className = 'btn btn-outline-dark fw-bold';
        } else {
            htmlRoot.setAttribute('data-bs-theme', 'dark');
            const nextText = 'Switch to Light Theme';
            themeBtnNav.textContent = nextText;
            themeBtnBody.textContent = nextText;
            themeBtnNav.className = 'btn btn-outline-warning btn-sm fw-bold';
            themeBtnBody.className = 'btn btn-outline-warning fw-bold';
        }
    }

    themeBtnNav.addEventListener('click', toggleTheme);
    themeBtnBody.addEventListener('click', toggleTheme);

    // TASK 2
    const faqButtons = document.querySelectorAll('.faq-toggle');

    faqButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const answerId = btn.getAttribute('aria-controls');
            const answerPanel = document.getElementById(answerId);
            const icon = btn.querySelector('.faq-icon');

            const isCurrentlyHidden = answerPanel.hidden;

            answerPanel.hidden = !isCurrentlyHidden;

            btn.setAttribute('aria-expanded', String(isCurrentlyHidden));

            if (icon) {
                icon.textContent = isCurrentlyHidden ? '−' : '+';
            }
        });
    });

    // TASK 3
    const filterInput = document.getElementById('filterInput');
    const filterItems = document.querySelectorAll('.filter-item');
    const filterCount = document.getElementById('filterCount');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const totalItems = filterItems.length;

    filterInput.addEventListener('input', () => {
        const searchTerm = filterInput.value.trim().toLowerCase();
        let matchesCount = 0;

        filterItems.forEach((item) => {
            const cardTitle = item.querySelector('.card-title').textContent.toLowerCase();

            if (cardTitle.includes(searchTerm)) {
                item.classList.remove('d-none');
                matchesCount++;
            } else {
                item.classList.add('d-none');
            }
        });

        filterCount.textContent = `Showing ${matchesCount} of ${totalItems} items`;

        if (matchesCount === 0) {
            noResultsMsg.classList.remove('d-none');
        } else {
            noResultsMsg.classList.add('d-none');
        }
    });

    // TASK 4
    const rosterForm = document.getElementById('rosterForm');
    const rosterInput = document.getElementById('rosterInput');
    const rosterList = document.getElementById('rosterList');
    const rosterCount = document.getElementById('rosterCount');
    const rosterError = document.getElementById('rosterError');

    function updateRosterCount() {
        const currentCount = rosterList.children.length;
        rosterCount.textContent = `Total: ${currentCount}`;
    }

    rosterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const textValue = rosterInput.value.trim();

        if (textValue.length === 0) {
            rosterError.classList.remove('d-none');
            rosterInput.focus();
            return;
        }

        rosterError.classList.add('d-none');

        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center';

        const textSpan = document.createElement('span');
        textSpan.textContent = textValue;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-outline-danger btn-sm fw-bold';
        removeBtn.textContent = 'Remove';

        removeBtn.addEventListener('click', () => {
            li.remove();
            updateRosterCount();
        });

        li.append(textSpan, removeBtn);
        rosterList.append(li);

        rosterInput.value = '';
        rosterInput.focus();
        updateRosterCount();
    });

    updateRosterCount();
});
