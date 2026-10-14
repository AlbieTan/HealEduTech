import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { books as demoBooks, type DemoBook, type Topic } from '../../demo/catalogue';
import { CatalogueBookCard } from '../../components/ui/BookCard';
import { listBooks, type CatalogueBook } from '../library/catalogue';
import { libraryTranslations } from '../library/libraryTranslations';
import { supabase } from '../../lib/supabase';
import { homeCopy, type HomeLanguage } from './homeCopy';
import { useScrollStack } from '../../components/ui/ScrollStack';
import './home.css';

const topics: Topic[] = ['nature', 'stories', 'science'];

function DemoFeaturedCard({ book, language }: { book: DemoBook; language: HomeLanguage }) {
  return (
    <article className="home-demo-book">
      <Link to={`/library?topic=${book.topic}`} className="home-demo-book__link">
        <div className={`home-demo-cover ${book.color}`} aria-hidden="true">
          <span>EVG · {language === 'vi' ? 'sách ví dụ' : 'example book'}</span>
          <strong>{book.title[language]}</strong>
          <b>{book.symbol}</b>
        </div>
        <span className="home-book-meta">{homeCopy[language].topics[book.topic]} · {book.minutes} {language === 'vi' ? 'phút' : 'min'}</span>
        <span className="home-book-title">{book.title[language]}</span>
        <span className="home-text-link">{language === 'vi' ? 'Xem chủ đề' : 'Browse topic'} <span aria-hidden="true">↗</span></span>
      </Link>
    </article>
  );
}

function TopicStory({ copy }: { copy: typeof homeCopy[HomeLanguage] }) {
  const { stackRef, itemRefs: chapterRefs } = useScrollStack<HTMLElement>();

  return (
    <div className="home-stack" ref={stackRef} aria-label={copy.topicsTitle}>
      {topics.map((topic, index) => (
        <section
          key={topic}
          ref={element => { chapterRefs.current[index] = element; }}
          className={`home-stack__chapter home-stack__chapter--${topic}`}
          aria-labelledby={`home-stack-${topic}-title`}
        >
          <div data-scroll-stack-card className={`home-stack__card home-stack__card--${topic}`}>
            <div className="home-stack__content">
              <div className="home-stack__eyebrow">
                <span>{String(index + 1).padStart(2, '0')} / 03</span>
                <span>{copy.kicker}</span>
              </div>
              <h3 id={`home-stack-${topic}-title`}>{copy.topics[topic]}</h3>
              <p>{copy.topicDescription[topic]}</p>
              <Link to={`/library?topic=${topic}`} className="home-stack__link">
                {copy.topicAction} <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="home-stack__media" aria-hidden="true">
              <picture>
                <source srcSet={`/images/home/${topic}-800.webp 800w, /images/home/${topic}-1600.webp 1600w, /images/home/${topic}-2400.webp 2400w`} sizes="(max-width: 560px) calc(100vw - 32px), (max-width: 1208px) calc(100vw - 48px), 1160px" type="image/webp" />
                <img src={`/images/home/${topic}-1600.webp`} width="1600" height={topic === 'science' ? '1600' : '1067'} alt="" loading="lazy" decoding="async" />
              </picture>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export function HomePage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const language: HomeLanguage = i18n.language === 'vi' ? 'vi' : 'en';
  const copy = homeCopy[language];
  const [result, setResult] = useState<{ books: CatalogueBook[]; loading: boolean; failed: boolean }>({ books: [], loading: Boolean(supabase), failed: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    const controller = new AbortController();
    void listBooks(0, controller.signal).then(data => {
      if (!controller.signal.aborted) setResult({ books: data.books.slice(0, 4), loading: false, failed: false });
    }).catch(() => {
      if (!controller.signal.aborted) setResult({ books: [], loading: false, failed: true });
    });
    return () => controller.abort();
  }, [attempt]);

  const availability = libraryTranslations[language];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="home-eyebrow">{copy.kicker}</span>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
          <form className="home-search" role="search" onSubmit={event => {
            event.preventDefault();
            const query = search.trim();
            navigate(query ? `/library?${new URLSearchParams({ q: query })}` : '/library');
          }}>
            <label className="evg-sr-only" htmlFor="home-book-search">{copy.searchLabel}</label>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
            <input id="home-book-search" type="search" value={search} onChange={event => setSearch(event.target.value)} maxLength={100} placeholder={copy.searchPlaceholder} />
            <button type="submit" className="home-button home-button--primary">{copy.searchAction}</button>
          </form>
          <div className="home-actions">
            <Link to="/library">{copy.browse} <span aria-hidden="true">→</span></Link>
            <Link to="/explore">{copy.tryActivity} <span aria-hidden="true">→</span></Link>
            <Link to="/start">{copy.guide}</Link>
          </div>
        </div>
        <div className="home-hero__art" aria-hidden="true">
          <img src="/images/home/library-bro-storyset.svg" width="750" height="500" alt="" fetchPriority="high" decoding="async" />
        </div>
      </section>

      <section className="home-section home-topics" aria-labelledby="home-topics-title">
        <div className="home-section-heading"><div><span className="home-eyebrow">{copy.topicsKicker}</span><h2 id="home-topics-title">{copy.topicsTitle}</h2></div><Link to="/library">{copy.allTopics} <span aria-hidden="true">→</span></Link></div>
        <p className="home-story-intro">{copy.storyIntro}</p>
        <TopicStory copy={copy} />
      </section>

      <section className="home-section home-shelf" aria-labelledby="home-featured-title">
        <div className="home-section-heading"><div><span className="home-eyebrow">{supabase ? copy.featuredKicker : copy.demoLabel}</span><h2 id="home-featured-title">{copy.featuredTitle}</h2>{!supabase && <p className="home-section-note">{copy.demoBody}</p>}</div><Link to="/library">{copy.featuredAll} <span aria-hidden="true">→</span></Link></div>
        {supabase && result.loading && <p className="home-status" role="status">{copy.loading}</p>}
        {supabase && result.failed && <div className="home-status home-status--error" role="alert"><p>{copy.loadError}</p><button type="button" className="home-button home-button--secondary" onClick={() => { setResult({ books: [], loading: true, failed: false }); setAttempt(value => value + 1); }}>{copy.retry}</button></div>}
        {supabase && !result.loading && !result.failed && result.books.length === 0 && <div className="home-status"><h3>{copy.emptyTitle}</h3><p>{copy.emptyBody}</p><Link className="home-button home-button--secondary" to="/library">{copy.openLibrary}</Link></div>}
        {supabase && result.books.length > 0 && <div className="home-book-grid">{result.books.map(book => <CatalogueBookCard key={book.id} book={book} availabilityLabel={book.available_copies === undefined ? availability.availabilityUnknown : availability.availableLabel(book.available_copies)} />)}</div>}
        {!supabase && <div className="home-book-grid">{demoBooks.slice(0, 4).map(book => <DemoFeaturedCard key={book.id} book={book} language={language} />)}</div>}
      </section>
    </div>
  );
}

export function QuickGuidePage() {
  const { i18n } = useTranslation();
  const language: HomeLanguage = i18n.language === 'vi' ? 'vi' : 'en';
  const copy = homeCopy[language];
  return <section className="home-guide">
    <span className="home-eyebrow">{language === 'vi' ? 'Hướng dẫn nhanh' : 'Quick guide'}</span>
    <h1>{language === 'vi' ? 'Bắt đầu bằng một câu hỏi nhỏ' : 'Start with a small question'}</h1>
    <p>{language === 'vi' ? 'Chọn một chủ đề rồi xem sách theo cách của em. Không cần tài khoản để xem sách.' : 'Pick a topic, then browse at your own pace. You do not need an account to browse.'}</p>
    <div className="home-guide-topics">{topics.map(topic => <Link key={topic} to={`/library?topic=${topic}`}><span className={`home-topic-dot home-topic-dot--${topic}`} aria-hidden="true" />{copy.topics[topic]}</Link>)}</div>
    <Link className="home-guide-skip" to="/library">{language === 'vi' ? 'Bỏ qua hướng dẫn' : 'Skip guide'} →</Link>
    <p className="home-guide-note">{language === 'vi' ? 'Muốn lưu sách và ghi chú riêng? ' : 'Want to save books and private notes? '}<Link to="/sign-in">{language === 'vi' ? 'Đăng nhập hoặc tạo tài khoản' : 'Sign in or create an account'}</Link>{language === 'vi' ? '. Em cần hộp thư email. Đăng xuất khi dùng xong thiết bị chung.' : '. You will need an email inbox. Sign out when you finish on a shared device.'}</p>
  </section>;
}

export default HomePage;
