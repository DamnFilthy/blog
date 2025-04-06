---
title: 'Nuxt super loading optimization '
description: 'Nuxt super optimization with nuxt lazy components'
pubDate: 'Apr 06 2025'
heroImage: '/images/nuxt.avif'
time: '4 min'
---

# Unreal Optimization in Nuxt

![nuxt](/images/nuxt.avif)

Let's first discuss the concept of super optimization using **Nuxt Lazy Components**.

Lazy loading is good, but what if we load the entire component (js, css) and its data at the moment it appears on the screen? This will give us super optimization.

1. Make the component lazy and invisible on the page
2. At the moment it appears on the screen, load all the necessary data from the server - js, css, icons, and the data itself for rendering the component.
3. Tracking the component happens only once until its first appearance on the screen.

[Full code](https://gist.github.com/DamnFilthy/198aebd40d68ae93823cac9f0355f429)

### Invisible Wrapper

Create a wrapper component **AppInvisible.vue** where the logic for tracking visibility, requesting data for the component, etc., will be implemented.

**IMPORTANT**: We will track whether the user is a bot or a human. For bots, we will load the component immediately (for indexing, so the page loads with full content), and for humans, we will load it dynamically.

```vue
<template>
    <div ref="target" :style="minHeightStyle">
        <slot v-if="shown" />
    </div>
</template>
```

### Handling Bots
```vue
<script setup lang="ts">
const { isCrawler } = useDevice();

/**
 * If its a bot, immediately display the element along with the data.
 */
if (isCrawler) showAndFetch();
<script>
```

### Everything We Need Comes from Props
```vue
<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        callback?: () => void;
        rootMargin?: string;
        minHeight?: number | string;
    }>(),
    {
        rootMargin: "0 0 100px 0",
        minHeight: 200
    }
);
</script>
```

### Import from VueUse
```vue
<script setup lang="ts">
     import { useElementVisibility } from "@vueuse/core";
</script>
```


### Base setup for height and target visibility
```vue
<script setup lang="ts">
/**
 * Logic for tracking component visibility.
 */
const target = ref(null);
const shown = ref(false);

let targetIsVisible: null | Ref<boolean, boolean> = useElementVisibility(target, {
    rootMargin: props.rootMargin
});

/**
 * Minimum height to avoid Cumulative Layout Shift (CLS).
 */
const minHeightStyle = computed(() =>
    shown.value ? "min-height: 0px": `min-height: ${props.minHeight}px`
);
</script>
```

### Okay, Now the Main watcher
```vue
<script setup lang="ts">
/**
 * When the element appears in the viewport,
 * show it and stop toggling visibility.
 */
watch(
    () => targetIsVisible?.value,
    async (isShown) => {
        if (isShown) {
            showAndFetch();

            /**
             * Reset tracking.
             */
            target.value = null;
            targetIsVisible = null;
        }
    }
);
</script>
```

### Implementing Data Loading
```vue
<script setup lang="ts">
/**
 * Fetch data and display the component.
 */
async function showAndFetch() {
    if (props.callback) {
        await props.callback();
    }

    shown.value = true;
}
</script>
```

### Usage on the Page
```vue
<app-invisible :callback="fetchData">
     <LazyModulesListDataComponent
        v-if="myStore.hasData"
        :items="myStore.fetchedData"
       />
</app-invisible>
```

[Full code](https://gist.github.com/DamnFilthy/198aebd40d68ae93823cac9f0355f429)

### Conclusion

Thanks to this implementation, the component does not exist in the application or on the page at the time of loading. Only when it appears on the screen will the component (js, css) be fetched from the server, rendered, and receive data that can be asynchronously requested using a callback.