<template>
  <div class="docs-landing">
    <!-- Hero -->
    <section class="dl-hero">
      <div class="dl-hero-bg" aria-hidden="true">
        <div class="dl-hero-gradient" />
        <div class="dl-hero-dots" />
      </div>

      <div class="dl-hero-content">
        <p class="dl-hero-eyebrow">Laioutr Documentation</p>
        <h1 class="dl-hero-title">
          Build and manage<br />
          <span class="dl-hero-accent">composable frontends</span>
        </h1>
        <div class="dl-hero-desc">
          <slot name="description">
            From the UI library and visual builder to hosting and AI — everything you need to create performant, scalable eCommerce
            storefronts.
          </slot>
        </div>
        <div class="dl-hero-actions">
          <UButton to="/getting-started/" size="xl" color="primary" trailing-icon="i-lucide-arrow-right"> Get started </UButton>
          <UButton to="https://github.com/laioutr" target="_blank" size="xl" color="neutral" variant="outline" icon="i-simple-icons-github">
            GitHub
          </UButton>
        </div>
        <div class="dl-hero-llms">
          <a href="/llms.txt" class="dl-llms-link">llms.txt</a>
        </div>
      </div>
    </section>

    <!-- Cards slot (rendered from markdown) -->
    <section class="dl-cards">
      <UContainer>
        <slot />
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
.docs-landing {
  --brand-purple: #4313d3;
  --brand-light: #afb8ff;
  --brand-deep: #3900bf;
}

/* ─── Hero ─── */
.dl-hero {
  position: relative;
  overflow: hidden;
  padding: 5rem 1.5rem 4rem;
}

@media (min-width: 768px) {
  .dl-hero {
    padding: 6rem 2rem 5rem;
  }
}

.dl-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.dl-hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 15% 110%, rgba(67, 19, 211, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 80% at 85% -10%, rgba(175, 184, 255, 0.1) 0%, transparent 60%);
}

:global(.dark) .dl-hero-gradient {
  background:
    radial-gradient(ellipse 80% 60% at 15% 110%, rgba(67, 19, 211, 0.22) 0%, transparent 70%),
    radial-gradient(ellipse 50% 80% at 85% -10%, rgba(175, 184, 255, 0.08) 0%, transparent 60%);
}

.dl-hero-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(67, 19, 211, 0.12) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 80%);
}

:global(.dark) .dl-hero-dots {
  background-image: radial-gradient(rgba(175, 184, 255, 0.08) 1px, transparent 1px);
}

.dl-hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 44rem;
  margin: 0 auto;
}

.dl-hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-purple);
  margin-bottom: 1.25rem;
}

:global(.dark) .dl-hero-eyebrow {
  color: var(--brand-light);
}

.dl-hero-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.035em;
  color: var(--ui-text-highlighted);
  margin: 0 0 1.5rem;
}

.dl-hero-accent {
  background: linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-light) 50%, var(--brand-deep) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 6s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.dl-hero-desc {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--ui-text-muted);
  max-width: 42rem;
  margin: 0 auto 2.25rem;
}

.dl-hero-desc :deep(p) {
  margin: 0;
}

.dl-hero-desc :deep(p + p) {
  margin-top: 0.75rem;
}

.dl-hero-actions {
  display: flex;
  gap: 0.875rem;
  justify-content: center;
  flex-wrap: wrap;
}

.dl-hero-llms {
  margin-top: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
}

.dl-llms-link {
  font-size: 0.6875rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--ui-text-dimmed);
  text-decoration: none;
  transition: color 0.15s ease;
}

.dl-llms-link:hover {
  color: var(--ui-text-muted);
}

.dl-llms-sep {
  font-size: 0.625rem;
  color: var(--ui-text-dimmed);
  opacity: 0.5;
}

/* ─── Cards section ─── */
.dl-cards {
  padding: 2rem 0 3rem;
}

.dl-cards :deep(h2) {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-dimmed);
  margin: 2rem 0 1rem;
}

.dl-cards :deep(.card-group) {
  grid-template-columns: repeat(4, 1fr) !important;
}

@media (max-width: 1024px) {
  .dl-cards :deep(.card-group) {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 640px) {
  .dl-cards :deep(.card-group) {
    grid-template-columns: 1fr !important;
  }
}
</style>
