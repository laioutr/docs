import { describe, expect, it } from 'vitest';
import { entityComponentImportPath } from '../../shared/utils/reflected-meta';

describe('entityComponentImportPath', () => {
  it('converts entity names to kebab-case export paths', () => {
    expect(entityComponentImportPath('ProductVariant')).toBe('@laioutr-core/canonical-types/entity/product-variant');
  });

  it.each([
    ['MenuItem', 'menuItem'],
    ['CostCenter', 'costCenter'],
  ])('preserves the published camel-case export for %s', (entity, exportPath) => {
    expect(entityComponentImportPath(entity)).toBe(`@laioutr-core/canonical-types/entity/${exportPath}`);
  });
});
