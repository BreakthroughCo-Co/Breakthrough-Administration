import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
        <h2 className="text-2xl font-black text-white">404 - Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested page or endpoint could not be found.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-all shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
