import AnnouncementBar from './AnnouncementBar';
import SiteNav from './SiteNav';

/**
 * One pinned block holding the announcement bar and the nav, so dismissing the bar
 * reflows the header as a unit and the nav's transparent-over-hero state keeps working.
 *
 * Inner pages clear this with PageHeader's top padding (9rem), which has room for the
 * bar and the nav together.
 */
export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <AnnouncementBar />
      <SiteNav />
    </header>
  );
}
