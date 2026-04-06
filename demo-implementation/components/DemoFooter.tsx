export function DemoFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <p>
        地図: ©{" "}
        <a
          className="text-orange-600 underline hover:no-underline dark:text-orange-400"
          href="https://www.openstreetmap.org/copyright"
          rel="noreferrer"
          target="_blank"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </p>
    </footer>
  );
}
