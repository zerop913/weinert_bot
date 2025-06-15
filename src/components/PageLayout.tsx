import Navigation from "./Navigation";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      <main className="pt-20 relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 border-t border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Weinert • Digital Artist •{" "}
              <a
                href="https://t.me/weinertt"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
              >
                @weinertt
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
