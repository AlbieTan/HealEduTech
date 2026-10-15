import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import type { Topic } from '../../demo/catalogue';
import { ProjectFeedbackPrototype } from './ProjectFeedbackPrototype';
import { TogetherGrowthDemo } from './TogetherGrowthDemo';
import './community.css';
export function CommunityPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const requestedTopic = searchParams.get('topic');
  const topic: Topic = requestedTopic === 'stories' || requestedTopic === 'science' ? requestedTopic : 'nature';
  const topics: Topic[] = ['nature', 'stories', 'science'];
  return <>
    <div className="page-heading together-heading">
      <div>
        <span className="eyebrow">{t('togetherJourney.kicker')}</span>
        <h1>{t('togetherJourney.title')}</h1>
        <p>{t('togetherJourney.intro')}</p>
      </div>
    </div>
    <nav className="together-jump" aria-label={t('togetherJourney.pageNav')}>
      <a href="#challenge">{t('togetherJourney.nav.challenge')}</a>
      <a href="#journey">{t('togetherJourney.nav.journey')}</a>
      <a href="#projects">{t('togetherJourney.nav.projects')}</a>
      <a href="#showcase">{t('togetherJourney.nav.showcase')}</a>
    </nav>
    <section className="together-pick" id="challenge" aria-labelledby="together-pick-title">
      <div className="together-pick__heading"><div><span className="eyebrow">01 · {t('togetherJourney.pickKicker')}</span><h2 id="together-pick-title">{t('togetherJourney.pickTitle')}</h2></div><Link to="/explore">{t('togetherJourney.backExplore')} ↗</Link></div>
      <div className="together-topic-list">{topics.map(item => <Link key={item} to={`/community?topic=${item}`} className={item === topic ? 'is-selected' : ''} aria-current={item === topic ? 'true' : undefined}>{t(`topics.${item}`)}</Link>)}</div>
      <div className={`together-challenge together-challenge--${topic}`}>
        <div className="together-challenge__copy">
          <span className="eyebrow">{t('togetherJourney.sampleChallenge')}</span>
          <h3>{t(`togetherJourney.challenges.${topic}.title`)}</h3>
          <p>{t(`togetherJourney.challenges.${topic}.body`)}</p>
          <ol><li>{t(`togetherJourney.challenges.${topic}.try`)}</li><li>{t(`togetherJourney.challenges.${topic}.compare`)}</li><li>{t(`togetherJourney.challenges.${topic}.explain`)}</li></ol>
          <Link to={`/library?topic=${topic}`}>{t('togetherJourney.findBook')} →</Link>
        </div>
        <img src={`/images/activities/${topic}-800.webp`} alt="" loading="lazy" />
      </div>
    </section>
    <section className="together-journey" id="journey" aria-labelledby="together-journey-title">
      <div className="together-journey__copy"><span className="eyebrow">02 · {t('togetherJourney.journeyKicker')}</span><h2 id="together-journey-title">{t('togetherJourney.journeyTitle')}</h2><p>{t('togetherJourney.journeyBody')}</p><div className="together-journey__steps"><span>{t('togetherJourney.steps.try')}</span><span>{t('togetherJourney.steps.compare')}</span><span>{t('togetherJourney.steps.explain')}</span></div><p className="together-journey__note">{t('togetherJourney.journeyNote')}</p></div>
      <TogetherGrowthDemo key={topic} />
    </section>
    <section className="together-projects" id="projects" aria-labelledby="together-projects-title"><span className="eyebrow">03 · {t('togetherJourney.projectKicker')}</span><h2 id="together-projects-title">{t('togetherJourney.projectTitle')}</h2><p>{t('togetherJourney.projectBody')}</p><ProjectFeedbackPrototype /></section>
    <section className="together-showcase" id="showcase" aria-labelledby="together-showcase-title"><span className="eyebrow">04 · {t('togetherJourney.showcaseKicker')}</span><h2 id="together-showcase-title">{t('togetherJourney.showcaseTitle')}</h2><p>{t('togetherJourney.showcaseBody')}</p><div className="showcase-grid">{(['garden', 'bridge'] as const).map(key => <article className={`showcase-card showcase-card--${key}`} key={key}>
      <div className="showcase-art" aria-hidden="true">
        <picture>
          <source srcSet={`/images/community/${key}-800.webp 800w, /images/community/${key}-1600.webp 1600w, /images/community/${key}-2400.webp 2400w`} sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 1208px) calc(100vw - 48px), 1160px" type="image/webp" />
          <img src={`/images/community/${key}-1600.webp`} width="1600" height="1067" alt="" loading="lazy" decoding="async" />
        </picture>
        <span>{t('sampleProject')}</span>
      </div>
      <div className="showcase-copy">
        <span className="eyebrow">{t('exampleOnly')}</span>
        <h2>{t(`showcases.${key}.title`)}</h2>
        <p>{t(`showcases.${key}.body`)}</p>
        <span className="muted">{t('fictionalWork')}</span>
      </div>
    </article>)}</div></section>
    <aside className="future-panel">
      <span className="future-label">{t('later')}</span>
      <div>
        <h2>{t('sharingLater')}</h2>
        <p>{t('sharingBody')}</p>
      </div>
    </aside>
  </>;
}
