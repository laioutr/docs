<script lang="ts" setup>
import { hash } from 'ohash';

import type { JSONSchema } from '@laioutr-core/core-types/common';
import { exampleFromSchema } from '../lib/json-schema/exampleFromSchema';
import { nullOrEmpty } from '../lib/json-schema/nullOrEmpty';
import { MDCCached, ProseCodeGroup, ProsePre } from '#components';

const props = defineProps<{
  token: string;
  exportName: string;
  importPackage: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
}>();

const lastSegment = computed(() => props.token.split('/').at(-1) ?? '');
const isQuery = computed(() => lastSegment.value.startsWith('get-'));
const composableName = computed(() => (isQuery.value ? 'useQueryAction' : 'useMutationAction'));

const exampleInput = computed(() => {
  if (nullOrEmpty(props.inputSchema)) return undefined;
  return exampleFromSchema(props.inputSchema);
});

const exampleOutput = computed(() => {
  if (nullOrEmpty(props.outputSchema)) return undefined;
  return exampleFromSchema(props.outputSchema);
});

const handlerCode = computed(() => {
  const lines: string[] = [];
  lines.push(`import { ${props.exportName} } from '${props.importPackage}';`);
  lines.push('');

  const hasInput = exampleInput.value && typeof exampleInput.value === 'object' && Object.keys(exampleInput.value as object).length > 0;
  const hasOutput = exampleOutput.value && typeof exampleOutput.value === 'object' && Object.keys(exampleOutput.value as object).length > 0;

  const destructured = hasInput ? '{ input }' : '{ clientEnv }';

  lines.push(`export default defineOrchestr.actionHandler(${props.exportName}, async (${destructured}) => {`);

  if (hasInput) {
    lines.push('  // input is fully typed from the action token');
    lines.push(`  console.log(input);`);
  }

  if (hasOutput) {
    lines.push(`  return ${JSON.stringify(exampleOutput.value, null, 2).split('\n').join('\n  ')};`);
  } else {
    lines.push('  // ...');
  }

  lines.push('});');
  return lines.join('\n');
});

const curlCode = computed(() => {
  const body = exampleInput.value ? JSON.stringify({ input: exampleInput.value }, null, 2) : '{}';
  return [
    `curl -X POST http://localhost:3000/api/orchestr/action/${props.token} \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '${body}'`,
  ].join('\n');
});

const vueCode = computed(() => {
  const lines: string[] = [];
  lines.push(`import { ${props.exportName} } from '${props.importPackage}';`);
  lines.push('');

  if (isQuery.value) {
    if (exampleInput.value && typeof exampleInput.value === 'object' && Object.keys(exampleInput.value as object).length > 0) {
      lines.push(`const { data, status } = ${composableName.value}(${props.exportName}, {`);
      lines.push(`  input: ${JSON.stringify(exampleInput.value, null, 2).split('\n').join('\n  ')},`);
      lines.push('});');
    } else {
      lines.push(`const { data, status } = ${composableName.value}(${props.exportName});`);
    }
  } else {
    lines.push(`const { mutate, status } = ${composableName.value}(${props.exportName});`);
    if (exampleInput.value && typeof exampleInput.value === 'object' && Object.keys(exampleInput.value as object).length > 0) {
      lines.push('');
      lines.push(`await mutate(${JSON.stringify(exampleInput.value, null, 2)});`);
    } else {
      lines.push('');
      lines.push('await mutate();');
    }
  }

  return lines.join('\n');
});

const mdcValue = computed(() =>
  ['::code-group\n', '```typescript [Vue]', vueCode.value, '```\n', '```typescript [action-handler.ts]', handlerCode.value, '```\n', '```bash [cURL]', curlCode.value, '```', '::'].join('\n')
);

const cacheKey = computed(() => `usage-${hash(mdcValue.value).slice(0, 10)}`);

const mdcComponents = {
  'prose-pre': ProsePre,
  'prose-code-group': ProseCodeGroup,
  ProsePre,
  ProseCodeGroup,
  pre: ProsePre,
  'code-group': ProseCodeGroup,
};
</script>

<template>
  <MDCCached :cache-key="cacheKey" :value="mdcValue" :components="mdcComponents" />
</template>
