export default function ProfileBoard({ profile }) {
  return (
    <article className="profile-board">
      <div className="board-head">
        <p className="kicker">Full-stack Developer</p>
        <h2>{profile.name}</h2>
        <p className="lead">{profile.tagline}</p>
      </div>

      <div className="board-grid">
        <section>
          <h3>Tentang Saya</h3>
          <p>{profile.about}</p>
        </section>

        <section>
          <h3>Stack Utama</h3>
          <ul className="chip-list">
            {(profile.stack || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Kekuatan Utama</h3>
          <ul className="strength-list">
            {(profile.strengths || []).map((item) => (
              <li key={item.title}>
                <strong>{item.title}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
