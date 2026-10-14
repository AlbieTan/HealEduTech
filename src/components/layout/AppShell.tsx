import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { useAccount } from '../../features/auth/context';
import { libraryTranslations } from '../../features/library/libraryTranslations';
import './app-shell.css';

export function AppShell() {
  const { t, i18n } = useTranslation();
  const { user, accessStatus, staffRole } = useAccount();
  const copy = libraryTranslations[i18n.language === 'vi' ? 'vi' : 'en'];
  const { pathname } = useLocation();
  const isVietnamese = i18n.language === 'vi';
  const isStaffArea = /^\/(staff|admin)(\/|$)/.test(pathname);
  const canOpenDesk = Boolean(user && accessStatus === 'ready' && (staffRole === 'librarian' || staffRole === 'administrator'));
  const [mobileNavPath, setMobileNavPath] = useState<string | null>(null);
  const [navigationPath, setNavigationPath] = useState(pathname);
  // Clear the disclosure before rendering a different route, including
  // keyboard navigation from content and returning through browser history.
  if (navigationPath !== pathname) {
    setNavigationPath(pathname);
    setMobileNavPath(null);
  }
  const mobileNavOpen = mobileNavPath === pathname;
  const primaryNavRef = useRef<HTMLElement | null>(null);
  const activePillRef = useRef<HTMLSpanElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.getElementById('main-content')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    const nav = primaryNavRef.current;
    const pill = activePillRef.current;
    if (!nav || !pill) return;
    let frame = 0;

    const updatePill = () => {
      frame = 0;
      if (window.innerWidth <= 760) {
        nav.classList.remove('has-active-pill');
        pill.style.opacity = '0';
        return;
      }
      const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!active) {
        nav.classList.remove('has-active-pill');
        pill.style.opacity = '0';
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      pill.style.width = `${activeRect.width}px`;
      pill.style.height = `${activeRect.height}px`;
      pill.style.transform = `translate3d(${activeRect.left - navRect.left}px, ${activeRect.top - navRect.top}px, 0)`;
      pill.style.opacity = '1';
      nav.classList.add('has-active-pill');
    };
    const schedulePillUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePill);
    };
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(schedulePillUpdate) : null;

    resizeObserver?.observe(nav);
    nav.querySelectorAll('a').forEach(anchor => resizeObserver?.observe(anchor));
    window.addEventListener('resize', schedulePillUpdate);
    schedulePillUpdate();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', schedulePillUpdate);
      nav.classList.remove('has-active-pill');
    };
  }, [pathname, isVietnamese, mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !primaryNavRef.current?.contains(target) && !mobileMenuButtonRef.current?.contains(target)) {
        setMobileNavPath(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileNavPath(null);
      mobileMenuButtonRef.current?.focus();
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const closeOnHistoryNavigation = () => setMobileNavPath(null);
    const syncViewportNavigation = () => {
      const focused = document.activeElement;
      const nav = primaryNavRef.current;
      if (mobileQuery.matches && nav && window.getComputedStyle(nav).display === 'none' && focused instanceof HTMLElement && nav.contains(focused)) {
        mobileMenuButtonRef.current?.focus();
      }
      if (!mobileQuery.matches) {
        if (focused === mobileMenuButtonRef.current) {
          (nav?.querySelector<HTMLElement>('a[aria-current="page"]') ?? nav?.querySelector<HTMLElement>('a'))?.focus();
        }
        setMobileNavPath(null);
      }
    };
    window.addEventListener('popstate', closeOnHistoryNavigation);
    window.addEventListener('resize', syncViewportNavigation);
    mobileQuery.addEventListener?.('change', syncViewportNavigation);
    return () => {
      window.removeEventListener('popstate', closeOnHistoryNavigation);
      window.removeEventListener('resize', syncViewportNavigation);
      mobileQuery.removeEventListener?.('change', syncViewportNavigation);
    };
  }, []);

  const closeMobileNavFromLink = () => {
    if (mobileNavOpen) document.getElementById('main-content')?.focus({ preventScroll: true });
    setMobileNavPath(null);
  };

  const toggleMobileNav = () => {
    if (mobileNavOpen) {
      setMobileNavPath(null);
      mobileMenuButtonRef.current?.focus();
      return;
    }
    setMobileNavPath(pathname);
    window.requestAnimationFrame(() => primaryNavRef.current?.querySelector<HTMLElement>('a')?.focus());
  };

  return (
    <div className="evg-shell">
      <a className="evg-skip-link" href="#main-content">{t('skip')}</a>
      <header className={`evg-header ${canOpenDesk ? 'has-staff-action' : ''}`}>
        <NavLink className="evg-brand" to="/" aria-label="EVG Learn & Grow">
          <span className="evg-brand-name">EVG</span>
        </NavLink>
        <nav id="evg-primary-nav" ref={primaryNavRef} className={`evg-primary-nav ${mobileNavOpen ? 'is-mobile-open' : ''}`} aria-label={t('navigation')}>
          <span ref={activePillRef} className="evg-primary-nav__pill" aria-hidden="true" />
          <NavLink end to="/" onClick={closeMobileNavFromLink}>{isVietnamese ? 'Trang chủ' : 'Home'}</NavLink>
          <NavLink to="/library" onClick={closeMobileNavFromLink}>{t('library')}</NavLink>
          <NavLink to="/learning" onClick={closeMobileNavFromLink}>{isVietnamese ? 'Sách của em' : 'My reading'}</NavLink>
          <NavLink to="/explore" onClick={closeMobileNavFromLink}>{t('explore')}</NavLink>
          <NavLink to="/community" onClick={closeMobileNavFromLink}>{t('community')}</NavLink>
        </nav>
        <div className="evg-header-actions">
          {canOpenDesk && <NavLink className="evg-desk-link" to="/staff">{t('access.openDesk')}</NavLink>}
          <NavLink className="evg-account-link" to={user ? '/account' : '/sign-in'}>{user ? copy.account : copy.signIn}</NavLink>
          <div className="evg-language">
            <button
              type="button"
              className="evg-language-toggle"
              role="switch"
              aria-checked={isVietnamese}
              aria-label="Tiếng Việt / Vietnamese"
              onClick={() => void i18n.changeLanguage(isVietnamese ? 'en' : 'vi')}
            >
              <span className="evg-language-option">EN</span>
              <span className="evg-language-option">VI</span>
            </button>
          </div>
          <button
            ref={mobileMenuButtonRef}
            type="button"
            className="evg-mobile-menu-toggle"
            aria-controls="evg-primary-nav"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? (isVietnamese ? 'Đóng menu' : 'Close menu') : (isVietnamese ? 'Mở menu' : 'Open menu')}
            onClick={toggleMobileNav}
          >
            <span aria-hidden="true" className={`evg-mobile-menu-icon ${mobileNavOpen ? 'is-open' : ''}`} />
            <span className="evg-sr-only">{mobileNavOpen ? (isVietnamese ? 'Đóng menu' : 'Close menu') : (isVietnamese ? 'Mở menu' : 'Open menu')}</span>
          </button>
        </div>
      </header>

      {isStaffArea && user && accessStatus === 'ready' && staffRole && (
        <nav className="evg-staff-nav" aria-label={t('access.navigation')}>
          <span className="evg-staff-label">{t('access.staffArea')}</span>
          <NavLink end to="/staff">{t('access.openDesk')}</NavLink>
          <NavLink to="/staff/catalogue">{t('access.catalogue')}</NavLink>
          <NavLink to="/staff/circulation">{t('access.circulation')}</NavLink>
          <NavLink to="/staff/training">{t('staffTraining.nav')}</NavLink>
          {staffRole === 'administrator' && <NavLink to="/admin/settings">{t('access.administration')}</NavLink>}
        </nav>
      )}

      {!supabase && <div className="evg-demo-banner" role="status">
        <span className="evg-demo-dot" aria-hidden="true" />
        <span>{t('demo')}</span>
      </div>}

      <main className="evg-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="evg-footer">
        <span lang="en">EVG · Learn &amp; grow</span>
        {pathname === '/' && <a href="https://storyset.com/people" lang="en">People illustrations by Storyset</a>}
        <nav aria-label={isVietnamese ? 'Liên kết bổ sung' : 'More links'}>
          <NavLink to="/explore">{t('explore')}</NavLink>
          <NavLink to="/community">{t('community')}</NavLink>
        </nav>
        <span>{t('footer')}</span>
      </footer>
    </div>
  );
}
