<template>
  <div class="landing docs-page">
    <header class="landing-header">
      <div class="container header-inner">
        <router-link to="/" class="logo-link"><h1 class="logo">KAN<span class="accent">BANEON</span></h1></router-link>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/login">Log in</router-link>
          <router-link to="/signup" class="nav-cta">Sign up</router-link>
        </nav>
      </div>
    </header>

    <main class="container docs-main">
      <h2>Documentation</h2>
      <p class="lead">Vue 3 + Konva kanban — lightweight Jira alternative. Live at <a href="https://kanbaneon.vercel.app">kanbaneon.vercel.app</a>.</p>

      <section>
        <h3>Quick start</h3>
        <ol class="steps">
          <li><router-link to="/signup">Create an account</router-link></li>
          <li>Create a board (Jira columns template)</li>
          <li>Add issues — drag across Backlog → To Do → In Progress → Done</li>
          <li>Optional: create an <strong>Organization</strong> → teams → org projects</li>
        </ol>
      </section>

      <section>
        <h3>Core concepts</h3>
        <table class="doc-table">
          <thead><tr><th>Concept</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>Board</td><td>Konva canvas with columns; personal or team-scoped</td></tr>
            <tr><td>Issue</td><td>Story, task, bug, or epic — <code>KAN-42</code> style keys</td></tr>
            <tr><td>Backlog</td><td>Ranked list; assign issues to sprints</td></tr>
            <tr><td>Sprint</td><td>Time-boxed iteration; start → active board</td></tr>
            <tr><td>Organization</td><td>Top-level workspace for teams and projects</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h3>Routes</h3>
        <pre class="code">/boards              — your boards
/boards/:id            — canvas board
/teams, /teams/:id     — teams
/organizations         — org workspaces
/backlog, /sprints     — planning views</pre>
      </section>

      <section>
        <h3>API</h3>
        <p>
          Backend: <a href="https://github.com/m3yevn/kanbaneon-api">kanbaneon-api</a> (Hapi.js + MongoDB).
          See <code>kanbaneon-api/SLICES.md</code> for endpoints.
        </p>
      </section>

      <section>
        <h3>Roadmap</h3>
        <ul class="roadmap">
          <li class="done">Backlog, sprints, epics, search</li>
          <li class="done">Organizations &amp; teams</li>
          <li>Epic board rollup view</li>
          <li>Board settings &amp; permissions</li>
          <li>Shareable issue deep links</li>
        </ul>
      </section>
    </main>

    <footer class="landing-footer">
      <div class="container">
        <router-link to="/">← Back to home</router-link>
      </div>
    </footer>
  </div>
</template>

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
.nav-cta {
  background: #42b883;
  color: #0d1b4a !important;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
}
.landing-footer {
  padding: 32px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
}
.landing-footer a { color: #90caf9; }
.docs-page { min-height: 100vh; }
.logo-link { text-decoration: none; color: inherit; }
.docs-main { padding: 48px 24px 80px; max-width: 720px; }
.docs-main h2 { font-size: 2rem; margin-bottom: 12px; }
.docs-main h3 { color: #42b883; margin: 32px 0 12px; font-size: 1.15rem; }
.docs-main p, .docs-main li { color: rgba(255,255,255,0.8); line-height: 1.7; }
.docs-main a { color: #90caf9; }
.lead { margin-bottom: 24px; }
.steps { margin-left: 20px; }
.steps li { margin-bottom: 8px; }
.doc-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
.doc-table th, .doc-table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.12); }
.doc-table th { color: rgba(255,255,255,0.5); font-weight: 500; }
.doc-table code { color: #90caf9; }
.code {
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  padding: 16px;
  font-size: 0.85rem;
  overflow-x: auto;
  color: rgba(255,255,255,0.9);
}
.roadmap { list-style: none; padding: 0; }
.roadmap li { padding: 8px 0 8px 24px; position: relative; }
.roadmap li::before { content: "○"; position: absolute; left: 0; color: rgba(255,255,255,0.4); }
.roadmap li.done::before { content: "✓"; color: #42b883; }
</style>
