<template>
  <div class="landing">
    <header class="landing-header">
      <div class="container header-inner">
        <h1 class="logo">KAN<span class="accent">BANEON</span></h1>
        <nav>
          <a href="#features">Features</a>
          <a href="#jira">Jira-like</a>
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
          <router-link to="/login"><a-button size="large">Log in</a-button></router-link>
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
          <li>✓ Organizations → Teams → Projects</li>
          <li>✓ Backlog ranking &amp; sprint planning</li>
          <li>✓ Issue search &amp; filters</li>
          <li>✓ Epic linking</li>
          <li>✓ Team &amp; org-scoped boards</li>
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
  background: linear-gradient(160deg, #1a237e 0%, #0d1b4a 40%, #42b883 100%);
  color: #fff;
}

.container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

.landing-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(13, 27, 74, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo { font-size: 1.4rem; font-weight: 800; margin: 0; }
.accent { color: #42b883; }

nav { display: flex; align-items: center; gap: 20px; }
nav a { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 0.95rem; }
nav a:hover { color: #fff; }
.nav-cta {
  background: #42b883;
  color: #0d1b4a !important;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
}

.hero { padding: 80px 0 60px; text-align: center; }
.badge {
  display: inline-block;
  border: 1px solid rgba(66,184,131,0.5);
  color: #90caf9;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  margin-bottom: 20px;
}
.hero h2 { font-size: clamp(2rem, 5vw, 3rem); line-height: 1.15; margin-bottom: 20px; }
.lead { max-width: 600px; margin: 0 auto 32px; color: rgba(255,255,255,0.8); font-size: 1.1rem; }
.hero-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 48px; }
.hero-columns {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0.7;
  font-size: 0.8rem;
}
.hero-columns span {
  background: rgba(255,255,255,0.1);
  padding: 8px 14px;
  border-radius: 6px;
}

.features { padding: 60px 0; background: rgba(0,0,0,0.2); }
.features h3 { text-align: center; margin-bottom: 36px; font-weight: 500; color: rgba(255,255,255,0.9); }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.grid article {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 24px;
}
.grid h4 { color: #42b883; margin-bottom: 10px; }
.grid p { color: rgba(255,255,255,0.75); font-size: 0.95rem; margin: 0; }
.grid code { color: #90caf9; }

.compare { padding: 60px 0; text-align: center; }
.compare h3 { margin-bottom: 24px; }
.compare ul { list-style: none; padding: 0; display: inline-block; text-align: left; }
.compare li { padding: 8px 0; color: rgba(255,255,255,0.9); }

.cta { padding: 60px 0; text-align: center; }
.cta h3 { margin-bottom: 20px; }

.landing-footer {
  padding: 32px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
}
.landing-footer a { color: #90caf9; }
</style>
