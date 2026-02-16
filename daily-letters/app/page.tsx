export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="rom-wrap rom-fade">
      <div className="rom-header">
        <div>
          <h1 className="rom-title">Hi Loraine</h1>
          <p className="rom-sub">
            You clicked on the website... This is where I will put my journal entries daily. I will constantly be updating this website so keep checking in my love. 
          </p>
        </div>
        <div className="rom-pill">🤍</div>
      </div>

      <section className="rom-card">
        <div className="rom-card-inner" style={{ padding: 22 }}>
          <p className="rom-sub" style={{ marginTop: 0 }}>
            If you’re here, it means I still care even if we are not talking right now. I want you to remember that I'm serious about waiting for you. I dont mean that to pressure you or overwhelm you in anyway. But I will be here. I love you Lor, I always will. Stay locked in. I am proud of you always. 
          </p>

          <a
            href="/letters"
            style={{
              display: "inline-block",
              marginTop: 10,
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid rgba(255,180,210,0.45)",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
              fontWeight: 600,
            }}
          >
            Open today’s letter →
          </a>

          <p className="rom-sub" style={{ marginTop: 16, marginBottom: 0 }}>
            Take all the time you need.
          </p>
        </div>
      </section>
    </main>
  );
}
