<template>
  <section class="legal-page">
    <router-link to="/" class="back">← Back to home</router-link>
    <article class="legal-content">
      <h1>Terms &amp; Conditions</h1>
      <p class="meta">Effective: June 2026 · Kanbaneon</p>

      <h2>Service</h2>
      <p>
        Kanbaneon provides kanban boards, backlog management, sprints, and team collaboration at
        <a href="https://kanbaneon.vercel.app">kanbaneon.vercel.app</a>.
      </p>

      <h2>Accounts</h2>
      <p>You are responsible for your credentials and activity under your account. Notify us of unauthorized use promptly.</p>

      <h2>Acceptable use</h2>
      <ul>
        <li>No harassment, illegal content, or abuse of the platform</li>
        <li>No attempts to disrupt or scrape the service without permission</li>
        <li>Respect intellectual property of others</li>
      </ul>

      <h2>Your content</h2>
      <p>You retain ownership of boards and issues you create. You grant us the rights needed to host and display your content.</p>

      <h2>Disclaimer</h2>
      <p>The service is provided &ldquo;as is&rdquo; without warranties. We are not liable for indirect or consequential damages to the extent permitted by law.</p>

      <h2>Changes</h2>
      <p>We may update these terms. Continued use after changes constitutes acceptance. Material changes will be noted on this page.</p>

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
}

.legal-content a {
  color: var(--kb-accent);
}
</style>
