type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

interface PlaygroundFrontmatter {
  name: string;
  base: string;
  defaultStory: string;
}

export function injectPlaygroundSection(
  body: { value: MinimarkNode[] },
  playground: PlaygroundFrontmatter | undefined,
): void {
  if (!playground) return;
  const { name, base, defaultStory } = playground;
  const storyUrl = `https://storybook.laioutr.cloud/?path=/story/${base}--${defaultStory}`;

  body.value.unshift(
    ['h2', { id: 'playground' }, 'Playground'],
    [
      'p',
      {},
      `An interactive playground for ${name} is embedded above. Open the canonical story on Storybook: `,
      ['a', { href: storyUrl }, storyUrl],
    ],
  );
}
