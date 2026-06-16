<template>
  <div class="auth-shell">
    <aside class="auth-brand" aria-hidden="true">
      <div class="auth-brand-inner">
        <p class="auth-eyebrow">Kanban · Sprints · Teams</p>
        <h1>
          <span class="kan">KAN</span><span class="ban">BANEON</span>
        </h1>
        <p class="auth-tagline">
          Plan work on a canvas board, run sprints, and ship with your team — one workspace.
        </p>
        <ul class="auth-points">
          <li>Drag-and-drop boards with Jira-style issues</li>
          <li>Backlog, sprints, epics, and search</li>
          <li>Teams &amp; organizations built in</li>
        </ul>
      </div>
    </aside>
    <main class="auth-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-shell {
  display: flex;
  min-height: 100vh;
  background: var(--kb-bg);
}

.auth-brand {
  flex: 1;
  display: none;
  background: linear-gradient(145deg, #f7fee7 0%, #ecfccb 40%, #ffffff 100%);
  border-right: 1px solid var(--kb-border);
  padding: 48px;
}

@media (min-width: 900px) {
  .auth-brand {
    display: flex;
    align-items: center;
  }
}

.auth-brand-inner {
  max-width: 400px;
}

.auth-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--kb-accent-dim);
  margin-bottom: 12px;
}

.auth-brand h1 {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0 0 16px;
}

.kan {
  color: var(--kb-accent);
}

.ban {
  color: var(--kb-violet);
}

.auth-tagline {
  color: var(--kb-muted);
  line-height: 1.55;
  margin-bottom: 24px;
}

.auth-points {
  margin: 0;
  padding-left: 1.1rem;
  color: var(--kb-text);
  line-height: 1.7;
  font-size: 0.9rem;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-width: 0;
}
</style>
