$(function () {
    'use strict';

    // TASK 1
    const $themeToggleBtn = $('#themeToggleBtn');
    const $htmlRoot = $('html');
    const $body = $('body');

    $themeToggleBtn.on('click', function () {
        const isLight = $body.toggleClass('light-theme').hasClass('light-theme');

        if (isLight) {
            $htmlRoot.attr('data-bs-theme', 'light');
            $(this).text('Switch to Dark Theme')
                   .removeClass('btn-outline-warning')
                   .addClass('btn-outline-dark');
        } else {
            $htmlRoot.attr('data-bs-theme', 'dark');
            $(this).text('Switch to Light Theme')
                   .removeClass('btn-outline-dark')
                   .addClass('btn-outline-warning');
        }
    });

    const $greetInput = $('#gamerTagInput');
    const $greetBtn = $('#greetSubmitBtn');
    const $greetOutput = $('#greetOutput');

    $greetBtn.on('click', function () {
        const rawTag = $greetInput.val();
        const cleanedTag = $.trim(rawTag);

        if (cleanedTag.length === 0) {
            $greetOutput.stop(true, true)
                        .removeClass('alert-success')
                        .addClass('alert-warning')
                        .text('Please enter a valid gamertag before joining the lobby.')
                        .fadeIn(250);
        } else {
            $greetOutput.stop(true, true)
                        .removeClass('alert-warning')
                        .addClass('alert-success')
                        .text('Welcome back, Operative [' + cleanedTag + ']! Roster verified.')
                        .fadeIn(250);
        }
    });


    // TASK 2
    $('.faq-toggle').on('click', function () {
        const $button = $(this);
        const targetId = $button.attr('aria-controls');
        const $targetAnswer = $('#' + targetId);
        const $icon = $button.find('.faq-icon');
        const isExpanded = $button.attr('aria-expanded') === 'true';

        $targetAnswer.stop(true, true).slideToggle(200, function () {
            const nowOpen = $(this).is(':visible');
            $button.attr('aria-expanded', nowOpen ? 'true' : 'false');
            $icon.text(nowOpen ? '−' : '+');
        });
    });


    // TASK 3
    const $tournamentSearch = $('#tournamentSearchInput');
    const $categoryButtons = $('.category-filter-btn');
    const $tournamentCards = $('.tournament-filter-item');
    const $matchCountBadge = $('#matchCountBadge');
    const $noResultsAlert = $('#noResultsAlert');

    let currentCategory = 'all';

    function executeTournamentFilter() {
        const searchQuery = $.trim($tournamentSearch.val()).toLowerCase();
        let visibleCount = 0;

        $tournamentCards.each(function () {
            const $card = $(this);
            const cardTitle = $card.find('.tournament-title').text().toLowerCase();
            const cardCategory = $card.attr('data-category');

            const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory);
            const matchesSearch = (searchQuery === '') || (cardTitle.indexOf(searchQuery) !== -1);

            if (matchesCategory && matchesSearch) {
                $card.stop(true, true).fadeIn(180);
                visibleCount++;
            } else {
                $card.stop(true, true).fadeOut(180);
            }
        });

        $matchCountBadge.text('Showing ' + visibleCount + ' of ' + $tournamentCards.length + ' events');

        if (visibleCount === 0) {
            $noResultsAlert.stop(true, true).fadeIn(200);
        } else {
            $noResultsAlert.stop(true, true).fadeOut(200);
        }
    }

    $tournamentSearch.on('input', function () {
        executeTournamentFilter();
    });

    $categoryButtons.on('click', function () {
        $categoryButtons.removeClass('active btn-primary').addClass('btn-outline-secondary');
        $(this).addClass('active btn-primary').removeClass('btn-outline-secondary');

        currentCategory = $(this).attr('data-category');
        executeTournamentFilter();
    });

    $('#clearFiltersBtn').on('click', function () {
        $tournamentSearch.val('');
        currentCategory = 'all';
        $categoryButtons.removeClass('active btn-primary').addClass('btn-outline-secondary');
        $('.category-filter-btn[data-category="all"]').addClass('active btn-primary').removeClass('btn-outline-secondary');
        executeTournamentFilter();
    });

    // TASK 4
    const $bookmarkForm = $('#bookmarkForm');
    const $bookmarkInput = $('#bookmarkInput');
    const $bookmarkList = $('#bookmarkList');
    const $bookmarkCountBadge = $('#bookmarkCountBadge');
    const $bookmarkEmptyState = $('#bookmarkEmptyState');
    const $bookmarkError = $('#bookmarkError');

    function refreshBookmarkStats() {
        const total = $bookmarkList.children('li').length;
        $bookmarkCountBadge.text('Tracked Teams: ' + total);

        if (total === 0) {
            $bookmarkEmptyState.stop(true, true).fadeIn(150);
        } else {
            $bookmarkEmptyState.stop(true, true).fadeOut(150);
        }
    }

    $bookmarkForm.on('submit', function (event) {
        event.preventDefault();

        const enteredTeam = $.trim($bookmarkInput.val());

        if (enteredTeam.length === 0) {
            $bookmarkError.stop(true, true).slideDown(150);
            $bookmarkInput.focus();
            return;
        }

        $bookmarkError.stop(true, true).slideUp(150);

        const $li = $('<li></li>')
            .addClass('list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center py-2 px-3');

        const $teamTitle = $('<span></span>').text(enteredTeam);

        const $removeButton = $('<button></button>')
            .attr('type', 'button')
            .addClass('btn btn-outline-danger btn-sm fw-bold btn-remove-item')
            .text('Remove');

        $li.append($teamTitle).append($removeButton);
        $bookmarkList.append($li);

        $bookmarkInput.val('').focus();
        refreshBookmarkStats();
    });

    $bookmarkList.on('click', '.btn-remove-item', function () {
        $(this).closest('li').remove();
        refreshBookmarkStats();
    });

    // TASK 5
    const $contactForm = $('#validatedContactForm');
    const $formSuccessBox = $('#formSuccessBox');

    $contactForm.on('submit', function (event) {
        event.preventDefault();

        let isFormValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const $nameInput = $('#contactFullName');
        const nameVal = $.trim($nameInput.val());
        if (nameVal.length < 2) {
            $nameInput.addClass('is-invalid').removeClass('is-valid');
            $nameInput.siblings('.invalid-feedback').text('Name must be at least 2 characters long.');
            isFormValid = false;
        } else {
            $nameInput.addClass('is-valid').removeClass('is-invalid');
        }

        const $emailInput = $('#contactEmailAddr');
        const emailVal = $.trim($emailInput.val());
        if (!emailRegex.test(emailVal)) {
            $emailInput.addClass('is-invalid').removeClass('is-valid');
            $emailInput.siblings('.invalid-feedback').text('Please provide a valid email format (e.g., user@domain.com).');
            isFormValid = false;
        } else {
            $emailInput.addClass('is-valid').removeClass('is-invalid');
        }

        const $subjectSelect = $('#contactSubjectSelect');
        if (!$subjectSelect.val() || $subjectSelect.val() === '') {
            $subjectSelect.addClass('is-invalid').removeClass('is-valid');
            isFormValid = false;
        } else {
            $subjectSelect.addClass('is-valid').removeClass('is-invalid');
        }

        const $messageInput = $('#contactMessageText');
        const msgVal = $.trim($messageInput.val());
        if (msgVal.length < 10 || msgVal.length > 500) {
            $messageInput.addClass('is-invalid').removeClass('is-valid');
            $messageInput.siblings('.invalid-feedback').text('Your inquiry must be between 10 and 500 characters.');
            isFormValid = false;
        } else {
            $messageInput.addClass('is-valid').removeClass('is-invalid');
        }

        if (!isFormValid) {
            $formSuccessBox.stop(true, true).slideUp(150);
        } else {
            $formSuccessBox.stop(true, true).slideDown(250);

            $contactForm[0].reset();
            $contactForm.find('.is-valid').removeClass('is-valid');
            $contactForm.find('.is-invalid').removeClass('is-invalid');
        }
    });

    $contactForm.find('input, select, textarea').on('input change', function () {
        if ($(this).hasClass('is-invalid')) {
            $(this).removeClass('is-invalid');
        }
    });
});
