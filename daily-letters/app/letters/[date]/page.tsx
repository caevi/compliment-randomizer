import { headers } from "next/headers";

export const dynamic = "force-dynamic";


async function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
export default async function LetterPage(props: { params: Promise<{ date: string }> }) {
  const { date } = await props.params;

  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/letters/${encodeURIComponent(date)}`, {
    cache: "no-store",
  });

  if (res.status === 403) {
    return (
      <main className="rom-wrap rom-fade">
        <div className="rom-header">
          <div>
            <h1 className="rom-title">{date}</h1>
            <p className="rom-sub">This one unlocks on that day.</p>
          </div>
          <div className="rom-pill">🔒 locked</div>
        </div>

        <section className="rom-card">
          <div className="rom-lock">
            <div className="rom-heart">🤍</div>
            <p className="rom-sub" style={{ maxWidth: 420 }}>
              Not yet. Come back on <b>{date}</b>.
            </p>
            <a className="rom-btn" href="/letters">← back</a>
          </div>
        </section>
      </main>
    );
  }

  if (!res.ok) {
    return (
      <main className="rom-wrap rom-fade">
        <div className="rom-header">
          <div>
            <h1 className="rom-title">{date}</h1>
            <p className="rom-sub">We couldn’t find this letter.</p>
          </div>
          <div className="rom-pill">missing</div>
        </div>

        <section className="rom-card">
          <div className="rom-card-inner">
            <p className="rom-sub" style={{ margin: 0 }}>
              If you expected it to be here, it might not be created yet.
            </p>
            <a className="rom-btn" href="/letters">← back</a>
          </div>
        </section>
      </main>
    );
  }

  const data = await res.json();

  return (
    <main className="rom-wrap rom-fade">
      <div className="rom-header">
        <div>
          <h1 className="rom-title">{data.date}</h1>
          <p className="rom-sub">Just for you.</p>
        </div>
        <div className="rom-pill">💌</div>
      </div>

      <section className="rom-card">
        <div className="rom-card-inner">
          <div className="rom-letter">{data.content}</div>
          <a className="rom-btn" href="/letters">← back</a>
        </div>
      </section>
    </main>
  );
}
