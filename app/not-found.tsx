import { brand } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="page">
      <div className="wrap narrow">
        <h1>Page not found</h1>
        <p>This page does not exist.</p>
        <p>
          <a className="btn btn-primary" href="/">Go to {brand.name}</a>
        </p>
      </div>
    </main>
  );
}
