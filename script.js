/* =========================================================================
   script.js
   All interactive behavior for the portfolio:
   1. Project data + dynamic rendering
   2. Project filtering
   3. Case-study modal
   4. Sticky nav active-section highlighting + mobile hamburger menu
   5. Hero terminal "typing" animation
   6. Contact form validation (front-end only, no backend/paid API)
========================================================================= */

// Run everything only after the DOM is fully parsed
document.addEventListener('DOMContentLoaded', () => {

  /* =======================================================================
     1. PROJECT DATA
     Single source of truth for every project. Add/edit projects here only —
     the HTML grid and modal are both generated from this array, so nothing
     needs to be duplicated in index.html.
     NOTE: category values are used for filtering; keep them consistent with
     the data-filter values in index.html ("Data Analytics", "Data Science",
     "AI/ML", "Web Development").
  ======================================================================= */
  const projectData = [
    {
      id: 'ai-copilot',
      tier: 1, // Tier 1 = featured project, gets larger card + highlighted border
      featured: true,
      title: 'AI Data Analytics Copilot',
      categories: ['Data Analytics', 'AI/ML'],
      shortDesc: 'A web platform where users upload a dataset and get automated profiling, cleaning, EDA, visualization, and AI-generated insights — with a natural-language chat to query the data.',
      tech: ['Python', 'Flask', 'Pandas', 'Plotly', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
      problem: 'Analysts spend a large share of their time on repetitive first-pass work — checking for missing values, duplicates, and inconsistent types — before any real analysis can begin. This project automates that first pass.',
      dataset: 'Works with any CSV/Excel dataset a user uploads; the platform inspects structure (rows, columns, dtypes) at runtime rather than being built around one fixed dataset.',
      cleaning: [
        'Automated missing-value detection and handling',
        'Duplicate record detection',
        'Data type inspection and conversion',
        'Downloadable cleaned dataset output'
      ],
      eda: [
        'Automatic dataset profiling (shape, column types, summary statistics)',
        'Distribution and relationship checks across numeric/categorical columns',
        'Natural-language chat interface to ask questions about the uploaded data'
      ],
      visuals: 'Interactive Plotly charts generated dynamically based on the dataset\'s structure — chart types adapt to the columns present rather than being hardcoded.',
      insights: [
        'Removes the manual, repetitive first step of any analysis project, letting a user get to real analysis faster.',
        'Surfaces data-quality issues (missing values, duplicates) immediately instead of discovering them mid-analysis.'
      ],
      impact: 'Reduces the time between "I have a dataset" and "I understand my dataset" — useful for analysts, students, and small teams without dedicated data-engineering support.',
      conclusion: 'Currently a personal/academic project built to demonstrate an end-to-end automated analytics workflow, from upload to AI-generated insight.',
      github: 'https://github.com/subhadrabiswal/DA_Copilot.git',
    },
    
    {
      id: 'resume-analyzer',
      tier: 2,
      title: 'AI Resume Analyzer',
      categories: ['AI/ML', 'Data Science','Python'],
      shortDesc: 'An NLP-based application that analyzes resumes against job descriptions using text-similarity techniques.',
      tech: ['Python', 'Streamlit', 'NLTK', 'Scikit-learn', 'TF-IDF', 'Cosine Similarity', 'PostgreSQL', 'Supabase', 'Render'],
      problem: 'Parents/students who shift to a new city often need immediate education support and may not know how to find suitable tutors nearby.',
      dataset: 'Tutors register their profiles, including location and subjects taught. Students/parents can search for tutors based on their current city and subject requirements.',
      cleaning: [''],
      eda: ['Not a tabular-EDA project — the core "analysis" is NLP text-similarity scoring between resume and job description.'],
      visuals: 'Similarity scores and keyword-match feedback presented through a Streamlit interface.',
      insights: ['TF-IDF + cosine similarity gives an interpretable, lightweight way to score resume-to-job-description relevance without needing a large trained model.'],
      impact: 'Gives a candidate quick, concrete feedback on resume-language alignment before applying.',
      conclusion: 'Built and deployed as full-stack developer and team lead, covering both the NLP scoring logic and the surrounding web application.',
      github: 'https://github.com/subhadrabiswal/ResumeAnalyzer_.git',
    },
    // cmt: TutorBridge had the same id as the Resume Analyzer. Give it a unique id
    // so clicking the TutorBridge card opens the correct TutorBridge case study.
    {
      id: 'tutorbridge',
      tier: 3,
      title: 'TutorBridge',
      categories: ['Python'],
      shortDesc: 'TutorBridge is a location-based tutor search system designed for parents/students who shift to a new city and need immediate education support.',
      tech: ['Python', 'tkinter','MySQL','Github'],
      problem: 'Parents/students who shift to a new city often need immediate education support and may not know how to find suitable tutors nearby.',
      dataset: 'TutorBridge uses a MySQL database containing tutor, student, admin, and feedback data, including subjects, cities, qualifications, and ratings.',
      cleaning: ['The system validates user inputs during registration and maintains consistent data through validation rules, approved tutor filtering, and rating constraints'],
      eda: ['The Admin module analyzes tutor data based on subject, city, and ratings to understand tutor distribution and feedback.'],
      visuals: 'Reports provide summarized information about tutors across different subjects, cities, and rating categories for easier analysis.',
      insights: ['The analysis helps identify tutor availability by location and subject while using ratings and feedback to understand tutor performance.'],
      impact: 'TutorBridge reduces the effort required to find suitable tutors and provides students and parents with a more organized and reliable tutor-selection process.',
      conclusion: 'TutorBridge creates a centralized platform connecting students with suitable tutors while providing efficient tutor management, search, approval, and feedback features.',
      github: 'https://github.com/subhadrabiswal/Tutor_Bridge.git',

    },

    {
      id: 'cognifyz',
      tier: 4,
      title: 'Data Science Internship — Cognifyz',
      categories: ['Data Science'],
      shortDesc: 'Practical data science and analytics work completed during a one-month internship: preprocessing, EDA, visualization, and Python-based analysis on real datasets.',
      tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib/Seaborn'],
      problem: 'Applying data science fundamentals to real, unfiltered datasets under internship task requirements rather than curated classroom data.',
      dataset: 'Datasets provided as part of internship task assignments (specifics vary by task).',
      cleaning: ['Data preprocessing on raw task datasets', 'Handling inconsistent/missing data as part of each task'],
      eda: ['Exploratory data analysis to answer task-specific questions', 'Statistical and data-driven analysis using Python'],
      visuals: 'Task-specific charts built to communicate findings for each internship deliverable.',
      insights: ['Strengthened hands-on ability to go from a raw dataset to a working analysis independently, within internship deadlines.'],
      impact: 'Directly built the practical EDA and preprocessing muscle now used across my other analytics projects.',
      conclusion: 'A one-month internship (16 July – 16 August 2026) focused on applied data science tasks rather than a single company product — no company-specific outcomes are claimed here.',
      github: 'https://github.com/subhadrabiswal/cognifyz_data_science_intern.git',
    },
    
  ];

  /* =======================================================================
     2. RENDER PROJECT CARDS
     Builds the project grid HTML from projectData, respecting the current
     active filter. Called once on load, then again whenever a filter is clicked.
  ======================================================================= */
  const projectGrid = document.getElementById('projectGrid');

  function renderProjects(filter = 'All') {
    // Filter the data set: "All" shows everything, otherwise match category
    const visible = projectData.filter(p => filter === 'All' || p.categories.includes(filter));

    // Sort by tier so featured/higher-priority projects appear first
    visible.sort((a, b) => a.tier - b.tier);

    // cmt: The project's id is assigned to the article via data-id="${p.id}".
    // Changing a project's `id` in the `projectData` array will affect which case study
    // opens when a project card is clicked.
    projectGrid.innerHTML = visible.map(p => `
      <article class="project-card ${p.featured ? 'project-card--featured' : ''}" data-id="${p.id}" tabindex="0" role="button" aria-label="View case study: ${p.title}">
        ${p.featured ? '<p class="project-card__badge">Featured Project</p>' : ''}
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.shortDesc}</p>
        <div class="project-card__tags">
          ${p.tech.slice(0, 5).map(t => `<span>${t}</span>`).join('')}
        </div>
        <span class="project-card__cta">View Case Study →</span>
      </article>
    `).join('');
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => openProjectModal(card.dataset.id));
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openProjectModal(card.dataset.id);
      });
    });
  }

  /* =======================================================================
     3. PROJECT FILTERING
     Attaches click handlers to the filter buttons, toggles the active
     button style, and re-renders the grid for the chosen category.
  ======================================================================= */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update visual active state on buttons
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Re-render the grid for the selected category
      renderProjects(btn.dataset.filter);
    });
  });

  // Initial render on page load (shows all projects)
  renderProjects('All');

  /* =======================================================================
     4. PROJECT CASE-STUDY MODAL
     Builds detailed case-study content on demand from projectData and
     displays it in the shared modal markup already in index.html.
  ======================================================================= */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openProjectModal(id) {
    const p = projectData.find(proj => proj.id === id);
    if (!p) return;

    // Build the case-study HTML. Sections with "N/A" style content still show,
    // since honestly labeling "not applicable" is more truthful than omitting silently.
    modalContent.innerHTML = `
      <h2 id="modalTitle">${p.title}</h2>
      <p class="modal__subtitle">${p.tech.join(' · ')}</p>

      <h4>Problem Statement</h4>
      <p>${p.problem}</p>

      <h4>Dataset Overview</h4>
      <p>${p.dataset}</p>

      <h4>Data Cleaning &amp; Preprocessing</h4>
      <ul>${p.cleaning.map(c => `<li>${c}</li>`).join('')}</ul>

      <h4>Exploratory Data Analysis</h4>
      <ul>${p.eda.map(e => `<li>${e}</li>`).join('')}</ul>

      <h4>Visualizations</h4>
      <p>${p.visuals}</p>

      <h4>Key Insights</h4>
      ${p.insights.map(i => `<div class="insight-box">${i}</div>`).join('')}

      <h4>Business / Practical Impact</h4>
      <p>${p.impact}</p>

      <h4>Conclusion</h4>
      <p>${p.conclusion}</p>

      <div class="modal__links">
        <a href="${p.github}" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
        ${p.demo ? `<a href="${p.demo}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
      </div>
    `;

    modalOverlay.classList.add('is-open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modalClose.focus(); // move focus into modal for keyboard/screen-reader users
    document.body.style.overflow = 'hidden'; // lock background scroll while modal is open
  }

  function closeProjectModal() {
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeProjectModal);
  // Clicking the dark overlay (outside the modal box) also closes it
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeProjectModal();
  });
  // Escape key closes the modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeProjectModal();
  });

  /* =======================================================================
     5. STICKY NAV — ACTIVE SECTION HIGHLIGHT + MOBILE HAMBURGER
  ======================================================================= */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  // Toggle the mobile nav panel open/closed
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  // Close mobile nav automatically once a link is tapped (better mobile UX)
  document.querySelectorAll('.mobile-nav .navlink').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight the current section's nav link using IntersectionObserver
  // (more performant than a manual scroll-position calculation)
  const sections = document.querySelectorAll('main section[id], main#home');
  const navLinks = document.querySelectorAll('.navlink');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('is-active', matches);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' }); // triggers when section is roughly centered in viewport

  sections.forEach(section => sectionObserver.observe(section));

  /* =======================================================================
     6. HERO TERMINAL TYPING ANIMATION
     Simulates a realistic data-profiling console log being typed out.
     Respects prefers-reduced-motion by rendering instantly instead.
  ======================================================================= */
  const terminalLines = [
    '>>> df.info()',
    '',
    'RangeIndex: dataset loaded',
    'Checking for missing values...  done',
    'Checking for duplicate rows...  done',
    'Inferring column data types...  done',
    '',
    '>>> analysis.summary()',
    'Status: ready for exploratory analysis',
    'Next step: visualize key trends →'
  ];

  const terminalEl = document.getElementById('terminalTyped');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // No animation: just show the full text immediately
    terminalEl.textContent = terminalLines.join('\n');
  } else {
    // Type character-by-character, line-by-line, for a realistic console feel
    let lineIndex = 0, charIndex = 0;
    let displayed = '';

    function typeNextChar() {
      if (lineIndex >= terminalLines.length) return; // animation complete

      const currentLine = terminalLines[lineIndex];

      if (charIndex < currentLine.length) {
        displayed += currentLine[charIndex];
        charIndex++;
        terminalEl.textContent = displayed;
        setTimeout(typeNextChar, 18); // typing speed per character
      } else {
        // Move to next line
        displayed += '\n';
        lineIndex++;
        charIndex = 0;
        terminalEl.textContent = displayed;
        setTimeout(typeNextChar, 220); // pause between lines
      }
    }

    setTimeout(typeNextChar, 500); // small initial delay before typing starts
  }

  /* =======================================================================
     7. CONTACT FORM — front-end validation only.
     No backend is wired up (per the "no paid APIs / no paid hosting"
     requirement); this shows a clear success message on valid submission.
     To make this functional, connect it to a form service (e.g. Formspree)
     or your own backend endpoint — see the comment near the fetch() stub below.
  ======================================================================= */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // stop native form submission (no backend configured)

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    let isValid = true;

    // Simple required-field + email-format validation
    [nameField, messageField].forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group.classList.add('has-error');
        isValid = false;
      } else {
        group.classList.remove('has-error');
      }
    });

    const emailGroup = emailField.closest('.form-group');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value.trim())) {
      emailGroup.classList.add('has-error');
      isValid = false;
    } else {
      emailGroup.classList.remove('has-error');
    }

    if (!isValid) {
      formStatus.textContent = 'Please fill in all fields with a valid email address.';
      return;
    }

    // ---- OPTIONAL: connect to a real form backend here ----
    // Example using a free service like Formspree:
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { 'Accept': 'application/json' },
    //   body: new FormData(contactForm)
    // });

    formStatus.textContent = `Thanks, ${nameField.value.trim()}! Your message has been noted. (Connect this form to an email service to receive it.)`;
    contactForm.reset();
  });

  /* =======================================================================
     8. FOOTER YEAR — keeps the copyright year current automatically
  ======================================================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

});