import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const pointsByStep = [0, 1, 3, 6] as const;
const stageByStep = [0, 0, 1, 2] as const;
const actions = ['try', 'compare', 'explain'] as const;

export function TogetherGrowthDemo() {
  const { t } = useTranslation();
  const [completedSteps, setCompletedSteps] = useState(0);
  const points = pointsByStep[completedSteps];
  const stage = stageByStep[completedSteps];

  return <div className="growth-demo" aria-labelledby="growth-demo-title">
    <div className="growth-demo__heading">
      <span className="eyebrow">{t('togetherGrowth.kicker')}</span>
      <h3 id="growth-demo-title">{t('togetherGrowth.title')}</h3>
      <p>{t('togetherGrowth.intro')}</p>
    </div>
    <div className="growth-demo__avatar" role="img" aria-label={t(`togetherGrowth.stage.${stage}.alt`)}
      style={{ backgroundPosition: `${stage * 50}% center`, transform: `scale(${completedSteps === 0 ? .84 : completedSteps === 1 ? .94 : 1})` }} />
    <div className="growth-demo__status" aria-live="polite">
      <strong>{t(`togetherGrowth.stage.${stage}.name`)}</strong>
      <span>{t('togetherGrowth.points', { points })}</span>
    </div>
    <progress value={points} max={6} aria-label={t('togetherGrowth.progress')} />
    <div className="growth-demo__actions">
      {actions.map((action, index) => <button key={action} type="button" disabled={completedSteps !== index}
        onClick={() => setCompletedSteps(index + 1)}>
        <span>{t(`togetherGrowth.action.${action}`)}</span>
        <small>{completedSteps > index ? t('togetherGrowth.done') : t(`togetherGrowth.reward.${action}`)}</small>
      </button>)}
    </div>
    <div className="growth-demo__footer">
      <p>{t('togetherGrowth.disclaimer')}</p>
      <button type="button" onClick={() => setCompletedSteps(0)} disabled={completedSteps === 0}>{t('togetherGrowth.reset')}</button>
    </div>
  </div>;
}
