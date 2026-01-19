import Link from "next/link";

export default function HomePage() {
  return (
    <div className="hero">
      <section className="card heroCard">
        <div className="heroTop">
          <h1 className="h1">Smart Table</h1>
          <p className="lead">
            Minimalna aplikacja do pracy z tabelami: generowanie struktury
            (header/body/footer), sortowanie (rosnąco/malejąco/reset) i zwijanie
            grup wierszy (collapse).
          </p>

          <div className="actions">
            <Link className="btn btn-primary" href="/components">
              Przejdź do tabeli
            </Link>
            <Link className="btn" href="/about">
              O projekcie
            </Link>
          </div>
        </div>

        <div className="grid">
          <div className="feature">
            <div className="pill">Sortowanie</div>
            <p className="muted">
              Rosnąco, malejąco oraz powrót do naturalnego porządku.
            </p>
          </div>

          <div className="feature">
            <div className="pill">Collapse</div>
            <p className="muted">
              Ukrywanie zaznaczonych wierszy i jeden przycisk do odkrycia całej
              grupy.
            </p>
          </div>

          <div className="feature">
            <div className="pill">Auth + Backend</div>
            <p className="muted">
              Logowanie oraz zapis przykładowych danych w usłudze backend.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
