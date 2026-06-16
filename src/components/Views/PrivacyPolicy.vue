<template>
  <section class="legal-page">
    <router-link to="/" class="back">← Back to home</router-link>
    <article class="legal-content">
      <h1>Privacy Policy</h1>
      <p class="meta">Effective: June 2026 · Kanbaneon</p>

      <h2>Who we are</h2>
      <p>
        Kanbaneon (<a href="https://kanbaneon.vercel.app">kanbaneon.vercel.app</a>) is operated by Kevin Moe Myint Myat.
        This policy explains what we collect and your choices.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account data</strong> — email, username, password (hashed), profile details</li>
        <li><strong>Workspace data</strong> — boards, issues, teams, organizations you create</li>
        <li><strong>Technical logs</strong> — IP, browser type, request logs for security (via hosting)</li>
      </ul>

      <h2>How we use data</h2>
      <p>We use your data to provide the service, secure accounts, and improve reliability. We do not sell personal data.</p>

      <h2>Processors</h2>
      <ul>
        <li>Vercel — hosting</li>
        <li>MongoDB Atlas — database (API deployment)</li>
      </ul>

      <h2>Retention &amp; deletion</h2>
      <p>
        Account data is kept while your account is active. Request deletion at
        <a href="mailto:hello@kanbaneon.app">hello@kanbaneon.app</a> or see
        <router-link to="/data-deletion-instructions">data deletion instructions</router-link>.
      </p>

      <h2>Your rights</h2>
      <p>You may request access, correction, or deletion of your personal data by emailing <a href="mailto:hello@kanbaneon.app">hello@kanbaneon.app</a>.</p>

      <h2>Contact</h2>
      <p><a href="mailto:hello@kanbaneon.app">hello@kanbaneon.app</a></p>
    </article>
  </section>
</template>

<style scoped>
.legal-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.back {
  color: var(--kb-accent);
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 24px;
}

.legal-content h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.meta {
  color: var(--kb-muted);
  margin-bottom: 32px;
}

.legal-content h2 {
  font-size: 1.15rem;
  margin-top: 28px;
  margin-bottom: 8px;
}

.legal-content p,
.legal-content li {
  line-height: 1.65;
  color: var(--kb-text);
}

.legal-content a {
  color: var(--kb-accent);
}
</style>
