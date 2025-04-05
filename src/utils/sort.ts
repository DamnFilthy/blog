import { compareDesc, isSameYear } from 'date-fns';

export function sortPosts<T extends { data: { pubDate: Date } }>(posts: T[]): T[] {
    return posts.sort((a, b) => compareDesc(a.data.pubDate, b.data.pubDate));
}