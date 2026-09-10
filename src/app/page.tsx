import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">GreenBridge</h1>

            <p className="text-sm text-text-secondary">
              Fresh vegetables. Local sellers. Fair trade.
            </p>
          </div>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </header>

        <section className="mt-12 grid flex-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary">
              Fresh Marketplace
            </span>

            <h2 className="mt-5 max-w-xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
              Fresh vegetables directly from local sellers
            </h2>

            <p className="mt-5 max-w-lg text-lg leading-8 text-text-secondary">
              Discover farmers and vegetable sellers near you, compare
              today&apos;s stock, negotiate when available, and buy with
              confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="min-h-12 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover">
                Discover Sellers
              </button>

              <button className="min-h-12 rounded-lg border border-border bg-surface px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-light">
                Become a Seller
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm font-medium text-text-secondary">
              Today&apos;s example
            </p>

            <div className="mt-5 space-y-4">
              <article className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Tomato</h3>

                    <p className="mt-1 text-sm text-text-secondary">
                      8 kg available
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-text-primary">₹50</p>

                    <p className="text-sm text-text-muted">per kg</p>
                  </div>
                </div>

                <span className="mt-4 inline-flex rounded-full bg-accent-light px-3 py-1 text-sm font-medium text-warning">
                  Fixed price
                </span>
              </article>

              <article className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Potato</h3>

                    <p className="mt-1 text-sm text-text-secondary">
                      100 kg available
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-text-primary">₹20</p>

                    <p className="text-sm text-text-muted">per kg</p>
                  </div>
                </div>

                <span className="mt-4 inline-flex rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary">
                  Negotiable
                </span>
              </article>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
