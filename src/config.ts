export const SITE = {
    title: 'Мой сайт',
    description: 'Многоязычный сайт на Astro',
    defaultLocale: 'ru',
    url: import.meta.env.PROD 
      ? 'https://ваш-сайт.com' 
      : 'http://localhost:3000',
  };