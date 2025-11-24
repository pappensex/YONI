import prisma from "../lib/db";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>YONI App – Übersicht</h1>
      {products.length === 0 ? (
        <p>Noch keine Produkte angelegt.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {products.map((p) => (
            <li
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "0.5rem"
              }}
            >
              <h2 style={{ margin: 0, marginBottom: "0.5rem" }}>{p.name}</h2>
              {p.description && (
                <p style={{ margin: 0, marginBottom: "0.5rem" }}>{p.description}</p>
              )}
              <p style={{ margin: 0, fontWeight: 600 }}>
                Preis: {(p.priceCents / 100).toFixed(2)} €
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}