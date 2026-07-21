<script setup lang="ts">
interface CockpitMcpWorkflowStep {
  phase: string;
  title: string;
  description: string;
  tools?: string[];
}

withDefaults(
  defineProps<{
    prompt: string;
    steps: CockpitMcpWorkflowStep[];
    handoff?: string;
    review: string;
  }>(),
  {
    handoff: "The edit enters Cockpit's shared Studio document.",
  }
);
</script>

<template>
  <figure class="cockpit-mcp-workflow">
    <figcaption class="cockpit-mcp-workflow__prompt">
      <span class="cockpit-mcp-workflow__eyebrow">Example prompt</span>
      <blockquote>{{ prompt }}</blockquote>
    </figcaption>

    <ol class="cockpit-mcp-workflow__trace" aria-label="Laioutr MCP activity">
      <li v-for="(step, index) in steps" :key="`${step.phase}-${index}`" class="cockpit-mcp-workflow__step">
        <div class="cockpit-mcp-workflow__phase">{{ step.phase }}</div>
        <div class="cockpit-mcp-workflow__activity">
          <div class="cockpit-mcp-workflow__title">
            <span class="cockpit-mcp-workflow__status" aria-hidden="true" />
            {{ step.title }}
          </div>
          <p>{{ step.description }}</p>
          <div v-if="step.tools?.length" class="cockpit-mcp-workflow__tools" aria-label="Tools used">
            <code v-for="tool in step.tools" :key="tool">{{ tool }}</code>
          </div>
        </div>
      </li>
    </ol>

    <div class="cockpit-mcp-workflow__handoff">
      <span aria-hidden="true" />
      <strong>{{ handoff }}</strong>
      <span aria-hidden="true" />
    </div>

    <div class="cockpit-mcp-workflow__review">
      <UIcon name="i-lucide-user-check" aria-hidden="true" />
      <div>
        <strong>Human review</strong>
        <p>{{ review }}</p>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.cockpit-mcp-workflow {
  margin-block: 1.5rem;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  background: var(--ui-bg);
}

.cockpit-mcp-workflow__prompt {
  padding: 1rem 1.125rem;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}

.cockpit-mcp-workflow__eyebrow,
.cockpit-mcp-workflow__phase {
  color: var(--ui-text-dimmed);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cockpit-mcp-workflow__prompt blockquote {
  margin: 0.5rem 0 0;
  padding: 0;
  border: 0;
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
  font-style: normal;
  line-height: 1.6;
}

.cockpit-mcp-workflow__trace {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cockpit-mcp-workflow__step {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  border-top: 1px solid var(--ui-border-muted);
}

.cockpit-mcp-workflow__step:first-child {
  border-top: 0;
}

.cockpit-mcp-workflow__phase {
  padding: 1rem;
  background: var(--ui-bg-muted);
}

.cockpit-mcp-workflow__activity {
  min-width: 0;
  padding: 0.875rem 1rem;
}

.cockpit-mcp-workflow__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
  font-weight: 700;
}

.cockpit-mcp-workflow__status {
  width: 0.4375rem;
  height: 0.4375rem;
  flex: none;
  border-radius: 9999px;
  background: var(--ui-primary);
}

.cockpit-mcp-workflow__activity p,
.cockpit-mcp-workflow__review p {
  margin: 0.375rem 0 0;
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
  line-height: 1.55;
}

.cockpit-mcp-workflow__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.625rem;
}

.cockpit-mcp-workflow__tools code {
  max-width: 100%;
  overflow: hidden;
  padding: 0.1875rem 0.4375rem;
  border: 1px solid var(--ui-border-muted);
  border-radius: 0.25rem;
  color: var(--ui-text-muted);
  background: var(--ui-bg-muted);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.6875rem;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cockpit-mcp-workflow__handoff {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem 0.75rem;
  color: var(--ui-primary);
  font-size: 0.75rem;
  text-align: center;
}

.cockpit-mcp-workflow__handoff span {
  height: 1px;
  flex: 1;
  background: color-mix(in srgb, var(--ui-primary) 35%, transparent);
}

.cockpit-mcp-workflow__review {
  display: flex;
  gap: 0.75rem;
  margin: 0 1rem 1rem;
  padding: 0.875rem;
  border: 1px dashed var(--ui-border-accented);
  border-radius: 0.5rem;
}

.cockpit-mcp-workflow__review > svg {
  width: 1rem;
  height: 1rem;
  flex: none;
  margin-top: 0.125rem;
  color: var(--ui-primary);
}

.cockpit-mcp-workflow__review strong {
  color: var(--ui-text-highlighted);
  font-size: 0.8125rem;
}

@media (max-width: 40rem) {
  .cockpit-mcp-workflow__step {
    grid-template-columns: 1fr;
  }

  .cockpit-mcp-workflow__phase {
    padding: 0.75rem 1rem 0;
    background: var(--ui-bg);
  }

  .cockpit-mcp-workflow__activity {
    padding-top: 0.5rem;
  }
}
</style>
