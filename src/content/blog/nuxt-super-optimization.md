---
title: 'Nuxt супер оптимизация загрузки'
description: 'Nuxt супер оптимизация загрузки с помощью ленивых компонентов'
pubDate: 'Apr 06 2025'
heroImage: '/images/nuxt.avif'
time: '4 мин'
---

# Нереальная оптимизация в Nuxt

![nuxt](/images/nuxt.avif)

Давайте сперва обговорим концепцию супер оптимизация с помощью **Nuxt Lazy Components**

Динамическая подгрузка это хорошо, но что если мы сделаем подрузку всего компонента (js, css) и данные для него в момент его появления на экране? Это нам и даст супер оптимизацию

1. Делаем компонент ленивым и невидимым на странице
2. В момент его появления на экране подгружаем с сервера все необходимые данные - js, css, иконки и сами данные для отображения компонента
3. Слежка за компонентом происходит один раз до его первого появления на экране

[Полный код доступен по ссылке](https://gist.github.com/DamnFilthy/198aebd40d68ae93823cac9f0355f429)

### Invisible обертка

Создаем компонент-обертку **AppInvisible.vue** в ней будет реализована логика отслеживания видимости, запрос данных для компонента и тд.

**ВАЖНО** Мы будем отслеживать пользователя бот это или человек, для бота будем грузить компонент сразу (для индексации, чтобы страница грузилась с полным контеном), для человека будем грузить динамически.

```vue
<template>
    <div ref="target" :style="minHeightStyle">
        <slot v-if="shown" />
    </div>
</template>
```

### Разберемся с ботом


```vue
<script setup lang="ts">
const { isCrawler } = useDevice();

/**
 * Если это бот то сразу отобразить элемент вместе с данными
 */
if (isCrawler) showAndFetch();
</script>
```

### Все необходимое берем из пропсов
```vue
<script setup>
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

### Импорт утили из vueuse/core
```vue
<script setup lang="ts">
import { useElementVisibility } from "@vueuse/core";
<script>
```

### Базовая настройка
```vue
<script setup lang="ts">
/**
 * Логика слежения за видимостью компонента
 */
const target = ref(null);
const shown = ref(false);

let targetIsVisible: null | Ref<boolean, boolean> = useElementVisibility(target, {
    rootMargin: props.rootMargin
});

/**
 * Минимальная высота для избегания Cumulative Layout Shift (CLS)
 */
const minHeightStyle = computed(() =>
    shown.value ? "min-height: 0px": `min-height: ${props.minHeight}px`
);
</script>
```

### Окей теперь основная логика
```vue
<script setup lang="ts">
/**
 * При появлении элемента в поле видимости
 * показать его и больше не переключать видимость
 */
watch(
    () => targetIsVisible?.value,
    async (isShown) => {
        if (isShown) {
            showAndFetch();

            /**
             * Сбросить отслеживание
             */
            target.value = null;
            targetIsVisible = null;
        }
    }
);
</script>
```

### Реализуем подгрузку данных
```vue
<script setup lang="ts">
/**
 * Получить данные и отобразить компонент
 */
async function showAndFetch() {
    if (props.callback) {
        await props.callback();
    }

    shown.value = true;
}
</script>
```

### Применение на странице
```vue
<app-invisible :callback="fetchData">
     <LazyModulesListDataComponent
        v-if="myStore.hasData"
        :items="myStore.fetchedData"
       />
</app-invisible>
```

[Полный код доступен по ссылке](https://gist.github.com/DamnFilthy/198aebd40d68ae93823cac9f0355f429)

### Заключение

Благодаря данной реализации компонента не существует в приложении и на странице в момент загрзки, только при поялвении на экране будет получен с сервера компонент (js,css) отрисуется и получит данные которые асинхронно могут быть запрошены с помощью колбэка.