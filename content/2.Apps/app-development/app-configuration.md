---
title: App Configuration
seo:
  title: App Configuration | Laioutr
---

##

Laioutr uses Nuxt's regular mechanisms for configuration-data. However with Laioutr projects being configured through the `laioutrrc.json` file instead of a `nuxt.config.ts` file, there are some differences:

1. Each app can be configured in the Studio. When deploying or testing your project locally, this configuration is stored in the `laioutrrc.json` file.
2. This configuration is passed to the app's `module.ts` file based on the app's package name. Therefore it is necessary that each Laioutr app uses its package name (e.g. `@laioutr-app/ui`) as the `configKey` in its module.ts file.

Having a look at the `laioutrrc.json` file, will show you the current configuration for all apps in your project. Each app has a `config` object that contains the configuration.

## Example

A simple example is the configuration for the Laioutr UI app.

```json [laioutrrc.json]
{
  "apps": [
    {
      "name": "@laioutr-app/ui",
      "version": "1.23.4",
      "config": {
        "theme": "sunny"
      }
    }
  ]
}
```

The contents of the `config` object are passed to the app's module.ts file. Then, in the `module.ts` file, the configuration is accessed like this:

```ts [module.ts]
import packageJson from '../package.json';

// Module config input data
export interface ModuleOptions {
  theme?: string;
}

// Config data that will be available at runtime
export interface RuntimeConfigModulePublic {
  theme: string;
}

const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: packageJson.name,
    // ^ configKey must match name of the package, e.g. @laioutr-app/ui, so laioutr can pass it properly
    ...
  },
  defaults: {
    theme: 'classic'
  },
  async setup(options, nuxt) {
    console.log('configured theme', options.theme);
    // ^ Prints 'sunny' with given laioutrrc.json

    nuxt.options.runtimeConfig.public[packageJson.name] = {
      theme: options.theme
    };
    // ^ Stores configured theme in the public runtime-config so it's actually usable by vue-components
  }
});
```

When using the [app-starter](https://github.com/laioutr/app-starter) template, the `module.ts` file already provides the basic code for this.

Later, this runtime configuration is then accessed like this:

```vue [component.vue]
<script setup lang="ts">
const config = useRuntimeConfig().public['@laioutr-app/ui'];
</script>

<template>
  <div>{{ config.theme }}</div>
</template>
```

## Further reading

The Nuxt documentation itself is a great resource for more information about the configuration process. Here are some pointers for a deep dive into Nuxt Module configuration:

> Nuxt builds and bundles project using Node.js but also has a runtime side.
> While both areas can be extended, that runtime context is isolated from build-time. Therefore, they are not supposed to share state, code, or context other than runtime configuration!

– [How Nuxt Works? Runtime Context vs. Build Context](https://nuxt.com/docs/3.x/guide/going-further/internals#runtime-context-vs-build-context)

> Your runtime config will be serialized before being passed to Nitro. This means that anything that cannot be serialized and then deserialized (such as functions, Sets, Maps, and so on), should not be set in your nuxt.config.
>
> - On client-side, only keys in runtimeConfig.public and runtimeConfig.app (which is used by Nuxt internally) are available, and the object is both writable and reactive.
> - On server-side, the entire runtime config is available, but it is read-only to avoid context sharing.

– [Runtime Configuration](https://nuxt.com/docs/3.x/guide/going-further/runtime-config)
