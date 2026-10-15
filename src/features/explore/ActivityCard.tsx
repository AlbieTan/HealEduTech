import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Topic } from '../../demo/catalogue';
import './activity-card.css';

export function ActivityCard({ topic }: { topic: Topic }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const activityId = `${topic}-activity`;

  return <article data-scroll-stack-card className={`topic-card topic-${topic}`}>
    <div className="topic-card__media" aria-hidden="true">
      <picture>
        <source srcSet={`/images/activities/${topic}-800.webp 800w, /images/activities/${topic}-1600.webp 1600w, /images/activities/${topic}-2400.webp 2400w`} sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 1208px) calc(100vw - 48px), 1160px" type="image/webp" />
        <img src={`/images/activities/${topic}-1600.webp`} width="1600" height="1067" alt="" loading="lazy" decoding="async" />
      </picture>
    </div>
    <div className="topic-card__content">
      <span className="eyebrow">{t(`topics.${topic}`)}</span>
      <h2>{t(`activities.${topic}.title`)}</h2>
      <p>{t(`activities.${topic}.body`)}</p>
      <button type="button" className="secondary" aria-expanded={open} aria-controls={activityId} onClick={() => setOpen(!open)}>{t(open ? 'close' : 'tryActivity')}<span aria-hidden="true">+</span></button>
    </div>
    <div className="activity-reveal" data-open={open} aria-hidden={!open} inert={!open}>
      <div className="activity-reveal__clip">
        <div className="activity-detail activity-detail--steps" id={activityId} role="region" aria-label={t(`activities.${topic}.title`)}>
          <h3>{t('activityMaterials')}</h3>
          <p>{t(`activities.${topic}.materials`)}</p>
          <h3>{t('startHere')}</h3>
          <ol>{(t(`activities.${topic}.steps`, { returnObjects: true }) as string[]).map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}</ol>
          <h3>{t('activityReflect')}</h3>
          <p>{t(`activities.${topic}.reflection`)}</p>
          <div className="activity-detail__links">
            <Link className="activity-next-link" to={`/community?topic=${topic}`}>{t('togetherJourney.exploreAction')} →</Link>
            <Link className="activity-next-link" to={`/library?topic=${topic}`}>{t('activityRelatedBooks', { topic: t(`topics.${topic}`) })} →</Link>
          </div>
        </div>
      </div>
    </div>
  </article>;
}
