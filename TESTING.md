# Testing Report

## Test Environment

- Date: 16 July 2026
- Browser engine: Chromium through Playwright
- Application: static HTML, CSS, and vanilla JavaScript served locally
- Viewports: 320px, 768px, 1024px, and 1440px wide
- Final automated result: **21 passed, 0 failed**

## Functional Tests

| Test | Expected | Actual | Status |
|---|---|---|---|
| Landing page and assets | Landing page, three links, CSS, scripts, and images load without failed responses | Page and all requested resources loaded successfully | Pass |
| Counter increment | Value increases by the active step and history updates | Value increased and history gained an entry | Pass |
| Counter decrement | Value decreases by the active step and status changes when needed | Value decreased and status matched its sign | Pass |
| Counter reset | Value returns to zero and reset history is accurate | Value became 0; history recorded “Reset” without a misleading step | Pass |
| Counter valid step | Whole number from 1 to 100 becomes active | Step 5 was applied and used by buttons and shortcuts | Pass |
| Counter invalid step | Invalid value is rejected and announced | Value 0 was rejected, focus returned to input, and `aria-invalid` was set | Pass |
| Counter keyboard shortcuts | Arrow Up increments, Arrow Down decrements, and R resets | All shortcuts worked outside the step input | Pass |
| Counter history limit | Most recent six actions remain visible | History stayed capped at six entries | Pass |
| To-do empty validation | Empty submission is blocked and announced | No task was added; feedback and `aria-invalid` appeared | Pass |
| To-do add | Task object is added, rendered, counted, and stored | Two tasks appeared and active count became 2 | Pass |
| To-do edit | Inline edit saves a non-empty title | Title changed to “Review JavaScript closures” | Pass |
| To-do complete | Checkbox toggles completion and summary | Task became completed and count changed | Pass |
| To-do filters | All, active, and completed display matching tasks | Each filter displayed the correct one or two tasks | Pass |
| To-do localStorage persistence | Tasks and completion state survive reload | Both tasks and completion state returned after reload | Pass |
| To-do clear completed | Only completed tasks are removed | Completed task was removed; active task remained | Pass |
| To-do delete | Selected task is removed from state, DOM, and storage | Final active task was deleted and empty state appeared | Pass |
| Quiz loading | Loading text appears and error simulation is temporarily disabled | Loading state appeared immediately | Pass |
| Quiz success | Questions render after the Promise resolves | First question, answers, score, and progress rendered | Pass |
| Quiz failure | Visible Simulate Error control triggers rejected Promise state | Error message and Retry loading quiz button appeared | Pass |
| Quiz retry | Retry starts loading and then restores the quiz | Questions loaded successfully after retry | Pass |
| Quiz answer selection | Selection locks all answers and shows correct/wrong feedback | Buttons disabled, correct answer highlighted, and status announced | Pass |
| Quiz duplicate prevention | Locked question cannot score twice | Disabled controls and state guard prevented another answer | Pass |
| Quiz score and progress | Correct answers update score; Next advances once | Question 2 displayed score 1 and progress advanced | Pass |
| Quiz completion | Final step displays score out of four | Final results screen displayed a valid score | Pass |
| Quiz restart | Restart resets question, score, and answer lock | Quiz returned to question 1 with score 0 | Pass |

## Accessibility and Quality Tests

| Test | Expected | Actual | Status |
|---|---|---|---|
| Semantic structure | Each page has landmarks and a logical heading structure | Header, nav, main, sections/articles/asides, and footer inspected | Pass |
| Labels and names | Inputs and buttons expose descriptive accessible names | Visible labels, described feedback, and task-specific button names verified | Pass |
| Live feedback | Dynamic statuses are announced without alerts | Counter, form, and quiz live regions update correctly | Pass |
| Keyboard focus | Tab focus is visible and dynamic quiz views manage focus | High-contrast outline and heading focus verified | Pass |
| Keyboard navigation | Controls work by keyboard in logical order | Links, forms, filters, task controls, quiz answers, and counter shortcuts worked | Pass |
| Quiz progress semantics | Assistive technology can identify current progress | Native `<progress>` has a descriptive accessible label | Pass |
| Contrast inspection | Text and control states remain legible | Normal, focus, success, error, and disabled states inspected | Pass |
| Browser console | No JavaScript exceptions or console errors in normal flows | No page errors or error-level console messages occurred | Pass |
| Source syntax | Every JavaScript file parses successfully | `node --check` passed for all three scripts | Pass |
| Source hygiene | No TODOs, fake URLs, inline CSS, inline JS, or dead override blocks | Source scan and manual inspection found none after fixes | Pass |

## Responsive Tests

Each page was loaded at every required viewport. The test compared document width with viewport width and inspected the visible main content.

| Width | Landing | Counter | To-do | Quiz | Result |
|---:|---|---|---|---|---|
| 320px | No overflow | Stacked controls and panels | Stacked tasks and controls | Full-width answer controls | Pass |
| 768px | Responsive single-column cards | Stacked app panels | Stacked app panels | Compact quiz panel | Pass |
| 1024px | Three-column cards | Two-column app layout | Two-column app layout | Centered quiz panel | Pass |
| 1440px | Balanced constrained layout | Balanced constrained layout | Balanced constrained layout | Balanced constrained layout | Pass |

## Fixes Applied During QA

- Consolidated shared visual rules and removed overridden legacy CSS from all demo stylesheets.
- Added metadata, shared stylesheets, described input feedback, and a labelled project section.
- Corrected reset-history wording so reset is not described as using a step.
- Added stored-task shape validation and guarded localStorage writes.
- Added reusable task-button creation and clearer task status announcements.
- Added stale-request protection and disabled loading controls to the quiz.
- Replaced a styled progress div with a semantic native progress element.
- Added quiz answer grouping, focus management, visible Simulate Error control, and retry focus.
- Corrected quiz answer contrast when disabled and removed transient feedback animation.
- Removed a screenshot rendering issue caused by header backdrop filtering.
- Captured and visually inspected four real screenshots in `assets/`.

## Final Result

All required functional, accessibility, responsive, source-quality, and console checks pass. No known submission-blocking defect remains.
