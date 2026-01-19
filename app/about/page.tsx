export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        About
      </h1>

      <p className="max-w-2xl text-white/70">
        Smart Table is a small web application focused on working with tabular
        data. It demonstrates sorting, grouping, and collapsing rows in a clear
        and user-friendly way.
      </p>

      <p className="max-w-2xl text-white/70">
        The project is built with modern frontend tools and emphasizes clean UI,
        predictable behavior, and simple data interactions.
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-white">Tech stack</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
          <li>Next.js (App Router)</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Supabase (authentication & database)</li>
        </ul>
      </div>

      <p className="text-sm text-white/50">
        Created by: <span className="text-white/70">Your name</span>
      </p>
    </div>
  );
}
