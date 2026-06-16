<template>
  <div class="landing">
    <header class="landing-header">
      <div class="container header-inner">
        <h1 class="logo">KAN<span class="accent">BANEON</span></h1>
        <nav>
          <a href="#features">Features</a>
          <a href="#jira">Jira-like</a>
          <router-link to="/docs">Docs</router-link>
          <router-link to="/login">Log in</router-link>
          <router-link to="/signup" class="nav-cta">Sign up free</router-link>
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="container hero-inner">
        <p class="badge">Lightweight Jira alternative</p>
        <h2>Project management.<br /><span class="accent">Canvas-powered.</span></h2>
        <p class="lead">
          Organizations, teams, sprints, backlog ranking, and issue keys —
          on a Konva canvas board that feels alive. Built for builders who want
          Jira clarity without Jira weight.
        </p>
        <div class="hero-actions">
          <router-link to="/signup"><a-button type="primary" size="large">Get started</a-button></router-link>
          <router-link to="/login"><a-button size="large" ghost>Log in</a-button></router-link>
        </div>
        <div class="hero-columns">
          <span>Backlog</span>
          <span>To Do</span>
          <span>In Progress</span>
          <span>In Review</span>
          <span>Done</span>
        </div>
      </div>
    </section>

    <section id="features" class="features">
      <div class="container">
        <h3>Clarity over complexity. For every team.</h3>
        <div class="grid">
          <article>
            <h4>Organizations</h4>
            <p>Jira-style workspaces — group teams and projects under one company account with project keys.</p>
          </article>
          <article>
            <h4>Sprints &amp; backlog</h4>
            <p>Rank your backlog, plan sprints, assign issues, and start iterations — just like Jira.</p>
          </article>
          <article>
            <h4>Issue tracking</h4>
            <p>Story, task, bug, epic types. Priorities. Issue keys like <code>KAN-42</code>. Comments on every card.</p>
          </article>
          <article>
            <h4>Canvas boards</h4>
            <p>Drag issues across columns on a GPU-accelerated Konva canvas — not another boring grid.</p>
          </article>
        </div>
      </div>
    </section>

    <section id="jira" class="compare">
      <div class="container">
        <h3>Jira workflows, fraction of the overhead</h3>
        <ul>
          <li>Organizations → Teams → Projects</li>
          <li>Backlog ranking &amp; sprint planning</li>
          <li>Issue search &amp; filters</li>
          <li>Epic linking &amp; rollup board</li>
          <li>Shareable issue deep links</li>
        </ul>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h3>Ready to ship?</h3>
        <router-link to="/signup"><a-button type="primary" size="large">Create free account</a-button></router-link>
      </div>
    </section>

    <footer class="landing-footer">
      <div class="container">
        <p>
          Built by
          <a href="https://kevinmoemyintmyat.vercel.app" target="_blank" rel="noopener">Kevin Moe Myint Myat</a>
        </p>
        <p>
          <router-link to="/privacy-policy">Privacy</router-link>
          ·
          <router-link to="/docs">Docs</router-link>
          ·
          <router-link to="/terms-and-conditions">Terms</router-link>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.landing {
  min-height: 100vh;
  color: var(--kb-text);
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}

.landing-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--kb-surface-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--kb-border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
}

.accent {
  color: var(--kb-accent);
}

nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

nav a {
  color: var(--kb-muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--kb-text);
}

.nav-cta {
  background: linear-gradient(135deg, #a3e635, var(--kb-accent));
  color: #1a2e05 !important;
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 700;
}

.nav-cta:hover {
  opacity: 0.92;
  color: #1a2e05 !important;
}

.hero {
  padding: 96px 0 72px;
  text-align: center;
}

.badge {
  display: inline-block;
  border: 1px solid var(--kb-border-strong);
  background: var(--kb-accent-soft);
  color: var(--kb-accent);
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 24px;
  letter-spacing: 0.02em;
}

.hero h2 {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  line-height: 1.1;
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.lead {
  max-width: 560px;
  margin: 0 auto 36px;
  color: var(--kb-muted);
  font-size: 1.1rem;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 56px;
}

.hero-columns {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-columns span {
  background: var(--kb-surface-2);
  border: 1px solid var(--kb-border);
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--kb-muted);
}

.features {
  padding: 72px 0;
  border-top: 1px solid var(--kb-border);
}

.features h3 {
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
  color: var(--kb-text);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.grid article {
  background: var(--kb-surface-glass);
  border: 1px solid var(--kb-border);
  border-radius: var(--kb-radius-lg);
  padding: 28px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.grid article:hover {
  border-color: var(--kb-border-strong);
  box-shadow: var(--kb-shadow-glow);
}

.grid h4 {
  color: var(--kb-accent);
  margin-bottom: 10px;
  font-size: 1rem;
}

.grid p {
  color: var(--kb-muted);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

.grid code {
  color: var(--kb-violet);
  font-size: 0.9em;
}

.compare {
  padding: 72px 0;
  text-align: center;
}

.compare h3 {
  margin-bottom: 28px;
  font-weight: 600;
}

.compare ul {
  list-style: none;
  padding: 0;
  display: inline-block;
  text-align: left;
}

.compare li {
  padding: 10px 0;
  color: var(--kb-muted);
  font-size: 1rem;
}

.compare li::before {
  content: "→ ";
  color: var(--kb-accent);
  font-weight: 600;
}

.cta {
  padding: 72px 0;
  text-align: center;
  border-top: 1px solid var(--kb-border);
}

.cta h3 {
  margin-bottom: 24px;
  font-weight: 600;
}

.landing-footer {
  padding: 40px 0;
  border-top: 1px solid var(--kb-border);
  text-align: center;
  font-size: 0.9rem;
  color: var(--kb-muted);
}

.landing-footer a {
  color: var(--kb-accent);
}
</style>
