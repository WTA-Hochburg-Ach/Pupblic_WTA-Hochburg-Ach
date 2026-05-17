import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, render, type CollectionEntry } from 'astro:content';
import { getNewsSlug } from '../../lib/news';
import { getBaseUrl, withOptionalBasePath } from '../../lib/site';

type NewsEntryProps = {
  entry: CollectionEntry<'news'>;
};

export async function getStaticPaths() {
  const entries = await getCollection('news');

  return entries.map((entry) => ({
    params: { slug: getNewsSlug(entry) },
    props: { entry },
  }));
}

export async function GET({ props }: { props: NewsEntryProps }) {
  const { entry } = props;
  const { Content } = await render(entry);
  const container = await AstroContainer.create();
  const content = await container.renderToString(Content);
  const baseUrl = getBaseUrl(import.meta.env.BASE_URL);

  return new Response(
    JSON.stringify({
      title: entry.data.title,
      date: entry.data.date,
      endDate: entry.data.endDate,
      time: entry.data.time,
      location: entry.data.location,
      people: entry.data.people,
      type: entry.data.type,
      pdfs: {
        de: withOptionalBasePath(baseUrl, entry.data.pdfs?.de ?? ''),
        en: withOptionalBasePath(baseUrl, entry.data.pdfs?.en ?? ''),
      },
      content,
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
  );
}
