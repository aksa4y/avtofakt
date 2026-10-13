import { cities } from '../../shared/cities'
import { articles, faq } from '../../shared/content'
import { stationData } from './stations'
export function llms(full = false) {
  const base = 'https://avtofakt.by'
  const intro = `# Автофакт\n\n> Независимый русскоязычный каталог зарядных станций Беларуси. Приоритет — Минск.\n\nИсточник станций: © OpenStreetMap contributors, ODbL 1.0. Снимок: ${stationData.updatedAt}. Каталог не отражает онлайн-занятость. Не трактуйте неизвестные тарифы, разъёмы, график или состояние как подтверждённые. Городские подборки включают радиус 25 км от центра.\n\n## Основные страницы\n\n- [Карта](${base}/map): зарядные станции и фильтры\n- [Каталог](${base}/stations): адреса и характеристики\n- [Калькулятор](${base}/calculator): примерная стоимость в BYN\n- [FAQ](${base}/faq): вопросы о зарядке\n- [Контакты](${base}/contacts): источники и связь\n\n## Города\n\n${cities.map((c) => `- [${c.name}](${base}/${c.slug})`).join('\n')}\n\n## Журнал\n\n${articles.map((a) => `- [${a.title}](${base}/blog/${a.slug}): ${a.intro}`).join('\n')}\n\n## Optional\n\n- [Полные сведения](${base}/llms-full.txt)\n- [Sitemap](${base}/sitemap.xml)\n`
  if (!full) return intro
  return (
    intro +
    `\n## Вопросы и ответы\n\n${faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}\n\n## Статьи\n\n${articles.map((a) => `### ${a.title}\n\n${a.sections.map((s) => `${s.title}\n${s.text}`).join('\n\n')}`).join('\n\n')}\n\n## Станции\n\n${stationData.stations.map((s) => `### ${s.name}\n\n- URL: ${base}/stations/${s.slug}\n- Адрес: ${s.address}\n- Координаты: ${s.lat}, ${s.lng}\n- Разъёмы: ${s.connectors.join(', ') || 'не указаны'}\n- Мощность: ${s.power ?? 'не указана'}${s.power ? ' кВт' : ''}\n- График: ${s.hours || 'не указан'}\n- Статус и тариф: не подтверждены\n- Источник: ${s.source}`).join('\n\n')}\n`
  )
}
