# CyberCup Esports Portal — Assignment #6 Final Project

## 1. Project Overview & Launch
* **Live Website URL:** https://[your-team-username].github.io/cybercup/
* **Repository URL:** https://github.com/[your-team-username]/cybercup
* **Website Topic:** Professional Counter-Strike 2 (CS2) Circuit & Tournament Analytics Portal.
* **Launch Instructions:**
  1. Clone repository: `git clone https://github.com/[your-team-username]/cybercup.git`
  2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
  3. Ensure active internet connectivity to load jQuery 3.7.1 and Bootstrap 5.3.3 via CDN.

---

## 2. Part 1: jQuery Feature Map

| Task | Interaction | Page Location | jQuery Methods Employed |
| :--- | :--- | :--- | :--- |
| **Task 1** | Dynamic Theme Toggle & Player Roster Check-in | `index.html` | `.on('click')`, `.val()`, `.trim()`, `.text()`, `.toggleClass()`, `.removeClass()`, `.addClass()`, `.fadeIn()` |
| **Task 2** | Non-blocking Animated Rulebook Accordion | `index.html` | `.on('click')`, `.stop(true, true)`, `.slideToggle()`, `.attr('aria-expanded')`, `.is(':visible')` |
| **Task 3** | Combined Keyword Search & Category Filter | `tournaments.html` | `.on('input')`, `.on('click')`, `.each()`, `.attr('data-category')`, `.fadeIn()`, `.fadeOut()`, `.text()` |
| **Task 4** | Watchlist Manager with Delegated Deletion | `teams.html` | `$('<tag>')`, `.on('submit')`, `.on('click', '.btn-remove-item', ...)`, `.append()`, `.remove()`, `.fadeIn()` |
| **Task 5** | Client-Side Contact Validation & Simulation | `contact.html` | `.on('submit')`, `event.preventDefault()`, `.val()`, `.addClass('is-invalid')`, `.slideDown()`, `.reset()` |

---

## 3. Part 2: Comprehensive Test Matrix

Testing executed across Google Chrome (v124) and Mozilla Firefox (v125) across 375 px (Mobile), 768 px (Tablet), and 1440 px (Desktop) viewports:

| Test ID | Interaction Case | Execution Steps | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Gamertag Blank Input | Submit empty tag input on `index.html`. | Warning banner displays; input prevented from executing. | Displayed warning via `.fadeIn(250)`. | **PASS** |
| **TC-02** | Theme Switcher | Click theme toggle button twice. | Classes toggle between dark and light themes cleanly. | Styles update immediately without layout shift. | **PASS** |
| **TC-03** | Accordion Rapid Clicks | Rapidly click Rulebook buttons in succession. | `.stop(true, true)` aborts animation queue backlog. | Smooth expansion/collapse with zero lag. | **PASS** |
| **TC-04** | Case-Insensitive Search | Type "cologne" into tournament search. | Displays IEM Cologne Cathedral card only. | 1 card displayed; counter badge updates. | **PASS** |
| **TC-05** | Search + Category Combined | Select "Major" tier and type "cologne". | Zero cards match (Cologne is Pro League, not Major). | "No results found" warning appears. | **PASS** |
| **TC-06** | Reset Filters | Click "Reset Filters" after zero-result search. | All 6 cards restore; category returns to "All". | All 6 cards fade in cleanly; badge shows 6. | **PASS** |
| **TC-07** | Delegated Item Deletion | Add new team to watchlist, click dynamic "Remove". | Newly created row deleted; count decremented. | Delegated handler removes item correctly. | **PASS** |
| **TC-08** | Empty Watchlist State | Delete all items in tracked watchlist. | Watchlist empty-state alert appears. | Alert displays via `.fadeIn(150)`. | **PASS** |
| **TC-09** | Form Validation (Invalid Email) | Submit contact form with `test@invalid`. | Submission blocked; email flagged red with error. | Border turns red, `.invalid-feedback` shown. | **PASS** |
| **TC-10** | Responsive Viewports | Test at 375 px, 768 px, and 1440 px viewports. | No horizontal scrolling; components collapse neatly. | Tested in Chrome DevTools with no overflow. | **PASS** |
