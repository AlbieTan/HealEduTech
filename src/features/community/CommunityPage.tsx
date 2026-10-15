import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProjectFeedbackPrototype } from './ProjectFeedbackPrototype';
import './community.css';
export function CommunityPage() {
  const { t } = useTranslation();
  return <>
    <div className="page-heading">
      <div>
        <span className="eyebrow">{t('community')}</span>
        <h1>{t('communityTitle')}</h1>
        <p>{t('communityBody')}</p>
      </div>
    </div>
    <section className="together-concept" aria-labelledby="together-concept-title">
      <div className="together-concept__copy">
        <span className="eyebrow">{t('togetherConcept.kicker')}</span>
        <h2 id="together-concept-title">{t('togetherConcept.title')}</h2>
        <p>{t('togetherConcept.body')}</p>
        <ol className="together-concept__steps">
          <li><strong>{t('togetherConcept.explore')}</strong><span>{t('togetherConcept.exploreBody')}</span></li>
          <li><strong>{t('togetherConcept.make')}</strong><span>{t('togetherConcept.makeBody')}</span></li>
          <li><strong>{t('togetherConcept.share')}</strong><span>{t('togetherConcept.shareBody')}</span></li>
        </ol>
        <Link className="primary" to="/explore">{t('togetherConcept.action')} →</Link>
        <p className="together-concept__note">{t('togetherConcept.note')}</p>
      </div>
      <div className="together-concept__art">
        <img src="/images/together/forest-explorer-concept.png" alt={t('togetherConcept.avatarAlt')} width="512" height="512" />
        <span>{t('togetherConcept.artLabel')}</span>
      </div>
    </section>
    <div className="showcase-grid">{(['garden', 'bridge'] as const).map(key => <article className={`showcase-card showcase-card--${key}`} key={key}>
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
    </article>)}</div>
    <section className="community-next-step" aria-labelledby="community-next-step-title">
      <h2 id="community-next-step-title">{t('communityNextStep.title')}</h2>
      <p>{t('communityNextStep.body')}</p>
      <Link className="secondary" to="/explore">{t('communityNextStep.action')} →</Link>
    </section>
    <ProjectFeedbackPrototype />
    <aside className="future-panel">
      <span className="future-label">{t('later')}</span>
      <div>
        <h2>{t('sharingLater')}</h2>
        <p>{t('sharingBody')}</p>
      </div>
    </aside>
  </>;
}
