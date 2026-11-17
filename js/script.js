const THEME_KEY = 'cybercup_theme';
const USERS_KEY = 'cybercup_users';
const SESSION_KEY = 'cybercup_session';
const WATCHLIST_KEY = 'cybercup_watchlist';
const FILTER_KEY = 'cybercup_filter';

(function initThemeImmediately() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    function updateThemeUI(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        if (!themeToggleBtn) return;

        if (theme === 'light') {
            themeIcon.className = 'bi bi-moon-stars-fill theme-icon me-1';
            themeLabel.textContent = 'Dark';
        } else {
            themeIcon.className = 'bi bi-sun-fill theme-icon me-1';
            themeLabel.textContent = 'Light';
        }
    }

    updateThemeUI(localStorage.getItem(THEME_KEY) || 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-bs-theme');
            const nextTheme = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, nextTheme);
            updateThemeUI(nextTheme);
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#mainNavbar .nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const navLoginLink = document.getElementById('navLoginLink');
    const navRegisterLink = document.getElementById('navRegisterLink');
    const currentSession = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

    if (navLoginLink && currentSession) {
        navLoginLink.href = 'profile.html';
        navLoginLink.innerHTML = `<i class="bi bi-person-fill me-1"></i>${escapeHTML(currentSession.fullName.split(' ')[0])}`;
        if (currentPage === 'profile.html') {
            navLoginLink.classList.remove('btn-cc-outline');
            navLoginLink.classList.add('btn-cc-solid');
        }
        if (navRegisterLink) {
            navRegisterLink.classList.add('d-none');
        }
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const PHONE_REGEX = /^\+?[0-9\s\-\(\)]{10,16}$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._\-]).{8,}$/;

    function setFieldError(inputEl, errorEl, message) {
        inputEl.classList.add('is-invalid');
        inputEl.classList.remove('is-valid');
        if (errorEl) errorEl.textContent = message;
    }

    function setFieldValid(inputEl) {
        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
    }

    const searchInput = document.getElementById('tournamentSearchInput');
    const categoryBtns = document.querySelectorAll('.category-filter-btn');
    const tournamentCards = document.querySelectorAll('.tournament-filter-item');
    const matchCountText = document.getElementById('matchCountText');
    const noResultsAlert = document.getElementById('noResultsAlert');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    if (searchInput && tournamentCards.length > 0) {
        const savedFilter = JSON.parse(localStorage.getItem(FILTER_KEY) || '{"query":"","category":"all"}');
        let activeCategory = savedFilter.category || 'all';
        searchInput.value = savedFilter.query || '';

        function updateCategoryButtonsUI() {
            categoryBtns.forEach((btn) => {
                if (btn.dataset.category === activeCategory) {
                    btn.classList.add('active', 'btn-cc-solid');
                    btn.classList.remove('btn-cc-outline');
                } else {
                    btn.classList.remove('active', 'btn-cc-solid');
                    btn.classList.add('btn-cc-outline');
                }
            });
        }

        function applyTournamentFilters() {
            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            localStorage.setItem(FILTER_KEY, JSON.stringify({ query: searchInput.value, category: activeCategory }));

            tournamentCards.forEach((card) => {
                const title = card.querySelector('.tournament-title').textContent.toLowerCase();
                const category = card.dataset.category;

                const matchesCat = activeCategory === 'all' || category === activeCategory;
                const matchesText = query === '' || title.includes(query);

                if (matchesCat && matchesText) {
                    card.classList.remove('d-none');
                    visibleCount++;
                } else {
                    card.classList.add('d-none');
                }
            });

            if (matchCountText) {
                matchCountText.textContent = `${visibleCount} of ${tournamentCards.length} tournaments`;
            }
            if (noResultsAlert) {
                noResultsAlert.classList.toggle('d-none', visibleCount > 0);
            }
        }

        updateCategoryButtonsUI();
        applyTournamentFilters();

        searchInput.addEventListener('input', applyTournamentFilters);

        categoryBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.category;
                updateCategoryButtonsUI();
                applyTournamentFilters();
            });
        });

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                searchInput.value = '';
                activeCategory = 'all';
                updateCategoryButtonsUI();
                applyTournamentFilters();
            });
        }
    }

    const countryApiButtons = document.querySelectorAll('.fetch-country-btn');
    const apiResultBox = document.getElementById('apiCountryResult');

    const hostCityMap = {
        'Denmark': 'Copenhagen',
        'Germany': 'Cologne',
        'Singapore': 'Singapore',
        'Malta': 'Valletta',
        'Kazakhstan': 'Almaty',
        'United Arab Emirates': 'Abu Dhabi'
    };

    async function fetchHostCountryInfo(countryName) {
        if (!apiResultBox) return;

        const cityName = hostCityMap[countryName] || countryName;

        apiResultBox.classList.remove('d-none');
        apiResultBox.innerHTML = `
            <div class="d-flex align-items-center justify-content-center py-3">
                <div class="spinner-border me-3" role="status"></div>
                <span>Fetching live venue & weather data for <strong>${escapeHTML(cityName)}</strong>...</span>
            </div>
        `;

        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
            const geoResponse = await fetch(geoUrl);
            if (!geoResponse.ok) throw new Error(`Geocoding API status ${geoResponse.status}`);
            const geoData = await geoResponse.json();
            if (!geoData.results || geoData.results.length === 0) throw new Error('Location not found');

            const place = geoData.results[0];
            const countryCode = (place.country_code || '').toLowerCase();
            const flagUrl = countryCode ? `https://flagcdn.com/w160/${countryCode}.png` : '';

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`;
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) throw new Error(`Weather API status ${weatherResponse.status}`);
            const weatherData = await weatherResponse.json();
            const currentWeather = weatherData.current_weather;

            const population = place.population ? place.population.toLocaleString() : 'N/A';
            const timezone = place.timezone || 'UTC';
            const temp = currentWeather ? `${currentWeather.temperature}°C` : 'N/A';
            const wind = currentWeather ? `${currentWeather.windspeed} km/h` : 'N/A';

            apiResultBox.innerHTML = `
                <div class="row align-items-center g-3 fade-in-up">
                    <div class="col-12 col-sm-3 text-center">
                        ${flagUrl ? `<img src="${flagUrl}" alt="Flag of ${escapeHTML(place.country || countryName)}" class="img-fluid border" style="max-height: 85px;">` : ''}
                    </div>
                    <div class="col-12 col-sm-9">
                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-1">
                            <h3 class="h5 fw-bold mb-0">HOST VENUE: ${escapeHTML(place.name)}, ${escapeHTML(place.country || countryName)}</h3>
                        </div>
                        <p class="mb-1 small"><strong>Population:</strong> ${escapeHTML(population)} &nbsp;|&nbsp; <strong>Timezone:</strong> ${escapeHTML(timezone)}</p>
                        <p class="mb-0 small"><strong>Arena Weather:</strong> <strong>${escapeHTML(temp)}</strong> (Wind: ${escapeHTML(wind)})</p>
                    </div>
                </div>
            `;
            apiResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
            apiResultBox.innerHTML = `
                <div class="text-danger mb-0">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Unable to load live venue data (${escapeHTML(error.message)}).
                </div>
            `;
        }
    }

    countryApiButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            fetchHostCountryInfo(btn.dataset.country);
        });
    });

    const watchlistForm = document.getElementById('watchlistForm');
    const watchlistInput = document.getElementById('watchlistInput');
    const watchlistContainer = document.getElementById('watchlistContainer');
    const watchlistCountText = document.getElementById('watchlistCountText');
    const watchlistEmpty = document.getElementById('watchlistEmpty');
    const watchlistError = document.getElementById('watchlistError');
    const quickTrackButtons = document.querySelectorAll('.quick-track-btn');

    if (watchlistContainer) {
        let trackedTeams = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '["Dragon Esports", "Team Alpha"]');

        function saveAndRenderWatchlist() {
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(trackedTeams));
            watchlistContainer.innerHTML = '';

            trackedTeams.forEach((teamName, idx) => {
                const li = document.createElement('li');
                li.className = 'list-group-item cc-card d-flex justify-content-between align-items-center py-2 px-3 fade-in-up';

                const span = document.createElement('span');
                span.innerHTML = `<i class="bi bi-bookmark-fill me-2"></i>`;
                span.appendChild(document.createTextNode(teamName));

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'btn btn-cc-outline btn-sm fw-semibold btn-animated';
                removeBtn.textContent = 'Remove';
                removeBtn.addEventListener('click', () => {
                    trackedTeams.splice(idx, 1);
                    saveAndRenderWatchlist();
                });

                li.append(span, removeBtn);
                watchlistContainer.appendChild(li);
            });

            if (watchlistCountText) watchlistCountText.textContent = `Tracked: ${trackedTeams.length}`;
            if (watchlistEmpty) watchlistEmpty.classList.toggle('d-none', trackedTeams.length > 0);
        }

        saveAndRenderWatchlist();

        if (watchlistForm) {
            watchlistForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = watchlistInput.value.trim();

                if (name.length < 2) {
                    watchlistError.textContent = 'Please enter a valid team name (at least 2 characters).';
                    watchlistError.classList.remove('d-none');
                    watchlistInput.focus();
                    return;
                }
                if (trackedTeams.some((t) => t.toLowerCase() === name.toLowerCase())) {
                    watchlistError.textContent = 'This team is already in your watchlist.';
                    watchlistError.classList.remove('d-none');
                    return;
                }

                watchlistError.classList.add('d-none');
                trackedTeams.push(name);
                watchlistInput.value = '';
                saveAndRenderWatchlist();
            });
        }

        quickTrackButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const teamName = btn.dataset.team;
                if (!trackedTeams.includes(teamName)) {
                    trackedTeams.push(teamName);
                    saveAndRenderWatchlist();
                }
                btn.textContent = 'Tracked ✓';
                btn.classList.remove('btn-cc-outline');
                btn.classList.add('btn-cc-solid');
            });
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const cName = document.getElementById('contactName');
        const cEmail = document.getElementById('contactEmail');
        const cPhone = document.getElementById('contactPhone');
        const cSubject = document.getElementById('contactSubject');
        const cMessage = document.getElementById('contactMessage');
        const cSuccess = document.getElementById('contactSuccessAlert');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            if (cName.value.trim().length < 2) {
                setFieldError(cName, document.getElementById('contactNameErr'), 'Full name must be at least 2 characters.');
                valid = false;
            } else setFieldValid(cName);

            if (!EMAIL_REGEX.test(cEmail.value.trim())) {
                setFieldError(cEmail, document.getElementById('contactEmailErr'), 'Enter a valid email address (e.g., player@domain.com).');
                valid = false;
            } else setFieldValid(cEmail);

            if (!PHONE_REGEX.test(cPhone.value.trim())) {
                setFieldError(cPhone, document.getElementById('contactPhoneErr'), 'Enter a valid phone number (10–16 digits, e.g., +7 700 123 4567).');
                valid = false;
            } else setFieldValid(cPhone);

            if (!cSubject.value) {
                setFieldError(cSubject, document.getElementById('contactSubjectErr'), 'Please select an inquiry subject.');
                valid = false;
            } else setFieldValid(cSubject);

            const msgLen = cMessage.value.trim().length;
            if (msgLen < 10 || msgLen > 500) {
                setFieldError(cMessage, document.getElementById('contactMsgErr'), 'Message must be between 10 and 500 characters.');
                valid = false;
            } else setFieldValid(cMessage);

            if (valid) {
                cSuccess.classList.remove('d-none');
                contactForm.reset();
                contactForm.querySelectorAll('.is-valid').forEach((el) => el.classList.remove('is-valid'));
            } else {
                cSuccess.classList.add('d-none');
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        const sName = document.getElementById('signupName');
        const sEmail = document.getElementById('signupEmail');
        const sPhone = document.getElementById('signupPhone');
        const sCountry = document.getElementById('signupCountry');
        const sPass = document.getElementById('signupPassword');
        const sConfirm = document.getElementById('signupConfirmPassword');
        const sErrorBanner = document.getElementById('signupGlobalError');

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sErrorBanner.classList.add('d-none');
            let valid = true;

            if (sName.value.trim().length < 2) {
                setFieldError(sName, document.getElementById('signupNameErr'), 'Full name must be at least 2 characters.');
                valid = false;
            } else setFieldValid(sName);

            if (!EMAIL_REGEX.test(sEmail.value.trim())) {
                setFieldError(sEmail, document.getElementById('signupEmailErr'), 'Please enter a valid email address.');
                valid = false;
            } else setFieldValid(sEmail);

            if (!PHONE_REGEX.test(sPhone.value.trim())) {
                setFieldError(sPhone, document.getElementById('signupPhoneErr'), 'Enter a valid phone number (e.g. +7 701 555 1234).');
                valid = false;
            } else setFieldValid(sPhone);

            if (!sCountry.value) {
                setFieldError(sCountry, document.getElementById('signupCountryErr'), 'Please select your country.');
                valid = false;
            } else setFieldValid(sCountry);

            if (!PASSWORD_REGEX.test(sPass.value)) {
                setFieldError(
                    sPass,
                    document.getElementById('signupPassErr'),
                    'Password must be 8+ chars with uppercase, lowercase, number, and special symbol (@$!%*?&#).'
                );
                valid = false;
            } else setFieldValid(sPass);

            if (sConfirm.value !== sPass.value || sConfirm.value.length === 0) {
                setFieldError(sConfirm, document.getElementById('signupConfirmErr'), 'Passwords do not match.');
                valid = false;
            } else setFieldValid(sConfirm);

            if (!valid) return;

            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const emailNormalized = sEmail.value.trim().toLowerCase();

            if (users.some((u) => u.email.toLowerCase() === emailNormalized)) {
                sErrorBanner.textContent = 'An account with this email already exists. Please Log In.';
                sErrorBanner.classList.remove('d-none');
                return;
            }

            const newUser = {
                fullName: sName.value.trim(),
                email: emailNormalized,
                phone: sPhone.value.trim(),
                country: sCountry.options[sCountry.selectedIndex].text,
                password: sPass.value,
                joinedAt: new Date().toLocaleDateString()
            };

            users.push(newUser);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

            window.location.href = 'profile.html';
        });
    }

    if (loginForm) {
        const lEmail = document.getElementById('loginEmail');
        const lPass = document.getElementById('loginPassword');
        const lErrorBanner = document.getElementById('loginGlobalError');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            lErrorBanner.classList.add('d-none');
            let valid = true;

            if (!EMAIL_REGEX.test(lEmail.value.trim())) {
                setFieldError(lEmail, document.getElementById('loginEmailErr'), 'Enter a valid email address.');
                valid = false;
            } else setFieldValid(lEmail);

            if (lPass.value.length < 8) {
                setFieldError(lPass, document.getElementById('loginPassErr'), 'Password must be at least 8 characters.');
                valid = false;
            } else setFieldValid(lPass);

            if (!valid) return;

            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const matchedUser = users.find(
                (u) => u.email.toLowerCase() === lEmail.value.trim().toLowerCase() && u.password === lPass.value
            );

            if (!matchedUser) {
                lErrorBanner.textContent = 'Invalid email or password. Please check your credentials or Sign Up first.';
                lErrorBanner.classList.remove('d-none');
                return;
            }

            localStorage.setItem(SESSION_KEY, JSON.stringify(matchedUser));
            window.location.href = 'profile.html';
        });
    }

    const profileDetailsCard = document.getElementById('profileDetailsCard');
    const profileUnauthorized = document.getElementById('profileUnauthorized');

    if (profileDetailsCard && profileUnauthorized) {
        const sessionUser = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

        if (!sessionUser) {
            profileDetailsCard.classList.add('d-none');
            profileUnauthorized.classList.remove('d-none');
        } else {
            profileDetailsCard.classList.remove('d-none');
            profileUnauthorized.classList.add('d-none');

            document.getElementById('profName').textContent = sessionUser.fullName;
            document.getElementById('profEmail').textContent = sessionUser.email;
            document.getElementById('profPhone').textContent = sessionUser.phone;
            document.getElementById('profCountry').textContent = sessionUser.country;
            document.getElementById('profJoined').textContent = sessionUser.joinedAt || 'Today';

            const profWatchlist = document.getElementById('profWatchlist');
            const savedTeams = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]');
            if (profWatchlist) {
                if (savedTeams.length === 0) {
                    profWatchlist.innerHTML = '<li class="list-group-item cc-card text-secondary">No teams tracked yet. Visit the Teams page to add some!</li>';
                } else {
                    profWatchlist.innerHTML = savedTeams
                        .map((team) => `<li class="list-group-item cc-card"><i class="bi bi-bookmark-fill me-2"></i>${escapeHTML(team)}</li>`)
                        .join('');
                }
            }

            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem(SESSION_KEY);
                    window.location.href = 'auth.html';
                });
            }
        }
    }
});
