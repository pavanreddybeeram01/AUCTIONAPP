import { Link } from 'react-router-dom';

export default function Home() {
  const faqs = [
    {
      question: 'How do I participate in an auction?',
      answer: 'Create an account, browse available auctions, and place your bids.',
    },
    {
      question: 'How are sellers verified?',
      answer: 'Our admin team verifies seller identities and item authenticity before approval.',
    },
    {
      question: 'What happens if I win an auction?',
      answer: "You'll receive a notification and can complete payment securely through the platform.",
    },
    {
      question: 'Are payments secure?',
      answer: 'Yes, all payments are processed securely through trusted payment gateways.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
          <h1 className="text-2xl font-bold text-gray-900">HeritageBid</h1>

          <div className="hidden gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#home" className="transition hover:text-gray-900">Home</a>
            <a href="#about" className="transition hover:text-gray-900">About</a>
            <a href="#faq" className="transition hover:text-gray-900">FAQ</a>
            <a href="#contact" className="transition hover:text-gray-900">Contact</a>
          </div>

          <div className="flex gap-3">
            <Link to="/login" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section id="home" className="bg-gray-900 px-6 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Trusted auctions</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Discover rare pieces and timeless collectibles.
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-300">
            Buy, sell, and bid on curated antiques, vintage watches, paintings, and historical artifacts from trusted sellers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100">
              Explore Auctions
            </Link>
            <Link to="/login" className="rounded-xl border border-gray-600 px-6 py-3 font-semibold text-white transition hover:bg-gray-800">
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 sm:text-4xl">About HeritageBid</h2>
          <p className="mx-auto max-w-4xl text-lg leading-8 text-gray-600">
            HeritageBid brings collectors, enthusiasts, and sellers together through secure, transparent auctions. Our mission is to make rare and meaningful items easier to discover, bid on, and preserve for the next owner.
          </p>
        </div>
      </section>

      <section id="faq" className="bg-gray-50 px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-10 text-3xl font-bold text-gray-900 sm:text-4xl">Contact Us</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">support@heritagebid.com</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Location</h3>
              <p className="text-gray-600">Hyderabad, India</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 px-6 py-10 text-center text-white sm:px-8 lg:px-10">
        <h2 className="mb-4 text-2xl font-bold">HeritageBid</h2>
        <p className="mb-6 text-gray-400">Preserving history through trusted auctions.</p>
        <div className="mb-6 flex justify-center gap-6 text-sm text-gray-400">
          <a href="#about" className="transition hover:text-white">About</a>
          <a href="#faq" className="transition hover:text-white">FAQ</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </div>
        <p className="text-sm text-gray-500">© 2026 HeritageBid. All Rights Reserved.</p>
      </footer>
    </div>
  );
}