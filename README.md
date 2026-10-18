# Forms Testing & Validation

## 1. Overview
The CyberCup platform contains two validated Bootstrap 5 forms:
1. **Contact Form (`contact.html`)**: For inquiries, tournament applications, and organizer contacts.
2. **Registration Form (`register.html`)**: For competitor accounts, supporting custom password matching, fieldsets, and reset behaviors.

---

## 2. Test Cases and Execution Results

| Test ID | Form | Test Scenario / Input Values | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Contact | **Empty required fields**:<br>Submit clicked with all fields blank. | Submission blocked. Red outline on Name, Email, and Message. Shows `.invalid-feedback`. | Submission prevented, `.was-validated` added, invalid feedback rendered. | **PASS** |
| **TC-02** | Contact | **Invalid email format**:<br>`Name: Ame`, `Email: ame_not_an_email`, `Message: Hello team CyberCup!` | Form rejected due to HTML5 `type="email"`. Email flagged red with format guidance. | Email marked invalid, form submission blocked. | **PASS** |
| **TC-03** | Contact | **Message too short / too long**:<br>`Message: Hi` (<10 chars) or >500 characters. | Blocked by `minlength="10"`. Length warning appears. | Message field marked `:invalid`, prevented from submitting. | **PASS** |
| **TC-04** | Registration | **Password shorter than 8 characters**:<br>`Password: 12345` | HTML5 `minlength="8"` triggers. Feedback: "Password must be at least 8 characters long." | Submission blocked, password input highlighted red. | **PASS** |
| **TC-05** | Registration | **Passwords do not match**:<br>`Password: SecretPass123`, `Confirm: SecretPass456` | Custom JS `setCustomValidity` triggers on input. Error: "Passwords do not match." | Confirm field marked invalid, form blocked. Error clears immediately when corrected. | **PASS** |
| **TC-06** | Registration | **No country selected**:<br>Country left on default disabled option (`value=""`). | Select flagged as invalid by `required`. Guidance: "Please select your country". | Select field highlighted in red, form not submitted. | **PASS** |
| **TC-07** | Registration | **All required values valid**:<br>Valid Name, valid email, matching 8+ char passwords, selected country. | Form submits. `.was-validated` removed. Green `.alert-success` appears. Inputs reset. | Success alert displayed, form cleanly submitted. | **PASS** |
| **TC-08** | Registration | **Reset button after displaying errors**:<br>Form filled with invalid data, submit pressed (errors show), then "Reset Form" clicked. | All inputs emptied to defaults, `.was-validated` removed, custom errors cleared, alert hidden. | All fields reset, validation classes removed, zero lingering red/green borders. | **PASS** |
| **TC-09** | Both | **Responsive Layout Testing**:<br>Tested at 375px (mobile), 768px (tablet), 1200px (desktop). | Forms render cleanly in single columns on mobile, 2 columns for Name/Password on desktop. | No horizontal overflow, inputs and labels wrap seamlessly at all breakpoints. | **PASS** |

---
