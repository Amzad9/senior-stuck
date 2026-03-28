export default function MainNav() {
  const linkClass = 'text-black font-bold hover:text-amber-800 transition-colors';

  const items = [
    { href: '/', label: 'Home' },
    { href: '/product', label: 'Product' },
    { href: '/enough-is-enough', label: 'Enough is Enough' },
    { href: '/implementation-masters-program', label: 'Implementation Masters Program' },
    { href: '/freelancer-detector-kit', label: 'Freelancer Detector Kit' },
  ] as const;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full border-b border-black/20 bg-white shadow-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:px-8 md:py-5">
          <nav className="w-full" aria-label="Main">
            <ul className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="h-24 sm:h-20 shrink-0" aria-hidden />
    </>
  );
}
