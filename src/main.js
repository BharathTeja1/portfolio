import './style.css';

let appData = null;

// Routing State
const navigate = (hash) => {
  const sections = ['home', 'career', 'stories', 'contact'];
  const target = hash.replace('#', '') || 'home';

  if (!sections.includes(target) && !target.startsWith('story-')) {
    window.location.hash = 'home';
    return;
  }

  // Update Nav Links
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    // Highlight correct nav even if deep linked to a story
    if (a.getAttribute('href') === `#${target}` || (target.startsWith('story-') && a.getAttribute('href') === '#stories')) {
      a.classList.add('active');
    }
  });

  renderApp(target);
  window.scrollTo(0, 0);
};

// Render Functions
const renderHome = () => `
  <div class="section-view active" id="view-home">
    <div class="hero">
      <div class="hero-content">
        <h1>Hi, I'm <br/><span class="highlight">${appData.personal.name}</span></h1>
        <p>${appData.personal.bio}</p>
        <div class="social-links" style="flex-direction: row">
           <a href="#contact" style="border: 1px solid var(--primary-color); color: var(--primary-color);">Get in Touch ↗</a>
        </div>
      </div>
      <div>
        <img src="${appData.personal.avatar}" alt="Avatar" class="avatar-img" />
      </div>
    </div>
  </div>
`;

const renderCareer = () => `
  <div class="section-view active" id="view-career">
    <h2 style="font-size: clamp(32px, 4vw, 48px); margin-bottom: 20px;">Professional Career</h2>
    <div class="grid" style="margin-bottom: 80px;">
      ${appData.career.map(job => `
        <div class="card">
          <h3>${job.role}</h3>
          <span class="meta">${job.company} | ${job.duration}</span>
          <p style="color: #a0a0a5;">${job.description}</p>
        </div>
      `).join('')}
    </div>
    
    <h2 style="font-size: clamp(32px, 4vw, 48px); margin-bottom: 20px;">Featured Projects</h2>
    <div class="grid">
      ${appData.projects.map(proj => `
        <div class="card">
          <h3>${proj.title}</h3>
          <span class="meta">${proj.technologies.join(' / ')}</span>
          <p style="color: #a0a0a5; margin-bottom: 20px;">${proj.description}</p>
          <a href="${proj.link}" target="_blank" style="color: #00ffcc; text-decoration: none; font-weight: 600;">View Project ↗</a>
        </div>
      `).join('')}
    </div>
  </div>
`;

const renderStoriesList = () => `
  <div class="section-view active" id="view-stories">
    <h2 style="font-size: clamp(32px, 4vw, 48px); margin-bottom: 40px;">Stories & Musings</h2>
    <div>
      ${appData.stories.map(story => `
        <div class="story-item">
          <h2 onclick="window.location.hash='story-${story.id}'">${story.title}</h2>
          <div class="story-meta">${story.date}</div>
          <p style="color: #a0a0a5; max-width: 800px; font-size: 18px;">${story.excerpt}</p>
        </div>
      `).join('')}
    </div>
  </div>
`;

const renderStoryDetail = (id) => {
  const story = appData.stories.find(s => s.id === id);
  if (!story) return renderStoriesList();

  return `
    <div class="section-view active" id="view-story-detail">
      <a href="#stories" style="color: #00ffcc; text-decoration: none; margin-bottom: 30px; display: inline-block; font-weight: 600;">← Back to Stories</a>
      <h1 style="font-size: clamp(36px, 5vw, 56px); margin-bottom: 15px; line-height: 1.2;">${story.title}</h1>
      <div class="story-meta" style="margin-bottom: 40px; font-size: 16px; color: var(--primary-color);">${story.date}</div>
      <div style="font-size: 18px; line-height: 1.8; color: #d0d0d5; max-width: 800px;">
        ${story.content}
      </div>
    </div>
  `;
};

const renderContact = () => `
  <div class="section-view active" id="view-contact">
    <h2 style="font-size: clamp(32px, 4vw, 48px); margin-bottom: 20px;">Let's Connect</h2>
    <p style="color: #a0a0a5; margin-bottom: 40px; max-width: 600px; font-size: 18px;">
      I'm currently open for new opportunities. Whether you have a question or just want to collaborate on something cool, drop me a message.
    </p>
    <div class="social-links">
      <a href="mailto:${appData.contact.email}">Email me ↗</a>
      <a href="${appData.contact.github}" target="_blank">GitHub ↗</a>
      <a href="${appData.contact.linkedin}" target="_blank">LinkedIn ↗</a>
      <a href="${appData.contact.twitter}" target="_blank">Twitter ↗</a>
    </div>
  </div>
`;

const renderApp = (route) => {
  const appContainer = document.getElementById('app');
  let content = '';

  if (route === 'home') content = renderHome();
  else if (route === 'career') content = renderCareer();
  else if (route === 'stories') content = renderStoriesList();
  else if (route === 'contact') content = renderContact();
  else if (route.startsWith('story-')) content = renderStoryDetail(route.split('story-')[1]);

  appContainer.innerHTML = content;
};

// Initialization
const init = async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data.json`);
    appData = await res.json();

    // Listen to hash changes
    window.addEventListener('hashchange', () => navigate(window.location.hash));

    // Initial Route
    navigate(window.location.hash || '#home');
  } catch (error) {
    document.getElementById('app').innerHTML = '<h2 style="color: #ff3366;">Failed to load portfolio configuration from data.json.</h2>';
    console.error(error);
  }
};

init();
