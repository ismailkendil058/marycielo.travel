const Footer = () => (
  <footer className="bg-foreground text-cream/70 section-padding py-12">
    <div className="max-w-6xl mx-auto text-center">
      <h3 className="font-display text-2xl text-cream tracking-[0.2em] mb-2">
        marycielo.travel
      </h3>
      <p className="font-arabic text-sm mb-6" dir="rtl">وكالة سفر في الجزائر</p>
      <p className="font-body text-xs tracking-wider uppercase">
        © {new Date().getFullYear()} marycielo.travel — Algérie
      </p>
    </div>
  </footer>
);

export default Footer;
