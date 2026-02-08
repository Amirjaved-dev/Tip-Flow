"use client";

import { useEffect, useRef, useState } from "react";

export default function TestLandingPage() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="landing-page">
      <style jsx global>{`
        .landing-page {
          --lp-black: #09090b;
          --lp-dark-900: #0a0a0a;
          --lp-dark-800: #141414;
          --lp-dark-700: #1a1a1a;
          --lp-dark-600: #262626;
          --lp-white: #fafafa;
          --lp-gray-100: #f5f5f5;
          --lp-gray-300: #d4d4d4;
          --lp-gray-400: #a3a3a3;
          --lp-gray-500: #737373;
          --lp-accent: #6366f1;
          --lp-accent-light: #818cf8;
          font-family:
            "Outfit",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
          background: var(--lp-dark-900);
          color: var(--lp-white);
          overflow-x: hidden;
        }

        /* Animations */
        @keyframes lpFadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lpGlow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes lpPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .lp-animate {
          opacity: 0;
        }

        .lp-animate.visible {
          animation: lpFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Navigation */
        .lp-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.25rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .lp-logo {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--lp-white);
        }

        .lp-logo span {
          color: var(--lp-accent);
        }

        .lp-nav-btn {
          padding: 0.75rem 1.75rem;
          background: var(--lp-white);
          color: var(--lp-black);
          border: none;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lp-nav-btn:hover {
          background: var(--lp-accent);
          color: var(--lp-white);
          transform: translateY(-2px);
          box-shadow: 0 10px 40px -10px rgba(99, 102, 241, 0.5);
        }

        /* Hero Section */
        .lp-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 8rem 2rem 6rem;
          position: relative;
        }

        .lp-hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .lp-hero-orb {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          filter: blur(120px);
          animation: lpGlow 5s ease-in-out infinite;
        }

        .lp-hero-orb-1 {
          top: -300px;
          right: -200px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), transparent);
        }

        .lp-hero-orb-2 {
          bottom: -300px;
          left: -200px;
          background: linear-gradient(45deg, rgba(139, 92, 246, 0.2), transparent);
          animation-delay: 2.5s;
        }

        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--lp-accent-light);
          margin-bottom: 2.5rem;
        }

        .lp-hero-badge-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: lpPulse 2s ease-in-out infinite;
        }

        .lp-hero-title {
          font-size: clamp(3rem, 10vw, 6.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin-bottom: 1.75rem;
          max-width: 950px;
        }

        .lp-hero-title-gradient {
          background: linear-gradient(135deg, var(--lp-accent-light), #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          color: var(--lp-gray-400);
          max-width: 620px;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        .lp-hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .lp-btn-primary {
          padding: 1rem 2.5rem;
          background: var(--lp-accent);
          color: var(--lp-white);
          border: none;
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lp-btn-primary:hover {
          background: var(--lp-accent-light);
          transform: translateY(-3px);
          box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.5);
        }

        .lp-btn-secondary {
          padding: 1rem 2.5rem;
          background: transparent;
          color: var(--lp-white);
          border: 1px solid var(--lp-dark-600);
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lp-btn-secondary:hover {
          border-color: var(--lp-gray-500);
          background: rgba(255, 255, 255, 0.03);
        }

        /* Stats Bar */
        .lp-stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
          padding: 4rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .lp-stat {
          text-align: center;
        }

        .lp-stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--lp-white), var(--lp-gray-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lp-stat-label {
          font-size: 0.875rem;
          color: var(--lp-gray-500);
          margin-top: 0.25rem;
        }

        /* Features Section */
        .lp-features {
          padding: 8rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .lp-section-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--lp-accent-light);
          margin-bottom: 1rem;
        }

        .lp-section-title {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
          max-width: 700px;
        }

        .lp-section-desc {
          font-size: 1.125rem;
          color: var(--lp-gray-400);
          max-width: 550px;
          line-height: 1.7;
          margin-bottom: 4rem;
        }

        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .lp-feature-card {
          padding: 2.5rem;
          background: var(--lp-dark-800);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .lp-feature-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--lp-accent), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .lp-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
        }

        .lp-feature-card:hover::before {
          opacity: 1;
        }

        .lp-feature-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, var(--lp-dark-700), var(--lp-dark-600));
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--lp-accent-light);
        }

        .lp-feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .lp-feature-desc {
          color: var(--lp-gray-400);
          line-height: 1.7;
          font-size: 0.9375rem;
        }

        /* How It Works */
        .lp-how-it-works {
          padding: 8rem 2rem;
          background: var(--lp-dark-800);
        }

        .lp-how-it-works-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .lp-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
          margin-top: 4rem;
        }

        .lp-step {
          text-align: center;
          position: relative;
        }

        .lp-step-number {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--lp-accent), #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 1.5rem;
          position: relative;
          z-index: 1;
          box-shadow: 0 10px 40px -10px rgba(99, 102, 241, 0.4);
        }

        .lp-step-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }

        .lp-step-desc {
          color: var(--lp-gray-400);
          line-height: 1.7;
          max-width: 280px;
          margin: 0 auto;
        }

        /* Vision Section */
        .lp-vision {
          padding: 10rem 2rem;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }

        .lp-vision-quote {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: -0.02em;
          margin-bottom: 2rem;
          font-style: italic;
        }

        .lp-vision-quote span {
          color: var(--lp-accent-light);
        }

        .lp-vision-text {
          font-size: 1.125rem;
          color: var(--lp-gray-400);
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        }

        /* CTA Section */
        .lp-cta {
          padding: 8rem 2rem;
          background: linear-gradient(180deg, var(--lp-dark-900), var(--lp-dark-800));
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .lp-cta::before {
          content: "";
          position: absolute;
          top: -400px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 900px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 60%);
          pointer-events: none;
        }

        .lp-cta-title {
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          position: relative;
        }

        .lp-cta-desc {
          font-size: 1.125rem;
          color: var(--lp-gray-400);
          margin-bottom: 2.5rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
        }

        /* Footer */
        .lp-footer {
          padding: 3rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: var(--lp-dark-900);
        }

        .lp-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .lp-footer-logo {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .lp-footer-logo span {
          color: var(--lp-accent);
        }

        .lp-footer-links {
          display: flex;
          gap: 2.5rem;
        }

        .lp-footer-link {
          color: var(--lp-gray-500);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }

        .lp-footer-link:hover {
          color: var(--lp-white);
        }

        .lp-footer-copy {
          color: var(--lp-gray-500);
          font-size: 0.8rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .lp-nav {
            padding: 1rem 1.5rem;
          }

          .lp-hero {
            padding: 7rem 1.5rem 4rem;
          }

          .lp-stats {
            flex-direction: column;
            gap: 2rem;
          }

          .lp-features,
          .lp-how-it-works-inner,
          .lp-vision {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .lp-footer-inner {
            flex-direction: column;
            text-align: center;
          }

          .lp-footer-links {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="lp-nav">
        <div className="lp-logo">
          Tip<span>Flow</span>
        </div>
        <button className="lp-nav-btn">Launch App</button>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero" id="hero" ref={setRef("hero")}>
        <div className="lp-hero-bg">
          <div className="lp-hero-orb lp-hero-orb-1"></div>
          <div className="lp-hero-orb lp-hero-orb-2"></div>
        </div>

        <div className={`lp-animate ${isVisible["hero"] ? "visible" : ""}`}>
          <div className="lp-hero-badge">
            <span className="lp-hero-badge-dot"></span>
            Powered by State Channels
          </div>
        </div>

        <h1
          className={`lp-hero-title lp-animate ${isVisible["hero"] ? "visible" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          Streaming Value <br />
          <span className="lp-hero-title-gradient">Gasless. Instant.</span>
        </h1>

        <p
          className={`lp-hero-subtitle lp-animate ${isVisible["hero"] ? "visible" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          TipFlow enables frictionless micro-tipping for content creators. Lock your budget once, tip unlimited times—no
          gas fees, no wallet popups, just seamless value transfer.
        </p>

        <div
          className={`lp-hero-cta lp-animate ${isVisible["hero"] ? "visible" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <button className="lp-btn-primary">
            Start a Session
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button className="lp-btn-secondary">Read the Docs</button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="lp-stats" id="stats" ref={setRef("stats")}>
        <div className={`lp-stat lp-animate ${isVisible["stats"] ? "visible" : ""}`}>
          <div className="lp-stat-value">$0</div>
          <div className="lp-stat-label">Gas per tip</div>
        </div>
        <div className={`lp-stat lp-animate ${isVisible["stats"] ? "visible" : ""}`} style={{ animationDelay: "0.1s" }}>
          <div className="lp-stat-value">100%</div>
          <div className="lp-stat-label">To creators</div>
        </div>
        <div className={`lp-stat lp-animate ${isVisible["stats"] ? "visible" : ""}`} style={{ animationDelay: "0.2s" }}>
          <div className="lp-stat-value">Instant</div>
          <div className="lp-stat-label">Transaction speed</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="lp-features" id="features" ref={setRef("features")}>
        <span className={`lp-section-label lp-animate ${isVisible["features"] ? "visible" : ""}`}>
          The TipFlow Advantage
        </span>
        <h2 className={`lp-section-title lp-animate ${isVisible["features"] ? "visible" : ""}`}>
          Web2 speed with Web3 ownership
        </h2>
        <p className={`lp-section-desc lp-animate ${isVisible["features"] ? "visible" : ""}`}>
          State channel architecture eliminates gas costs for individual tips while maintaining full self-custody and
          on-chain settlement.
        </p>

        <div className="lp-features-grid">
          <div
            className={`lp-feature-card lp-animate ${isVisible["features"] ? "visible" : ""}`}
            style={{ animationDelay: "0.1s" }}
          >
            <div className="lp-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="lp-feature-title">Off-Chain Speed</h3>
            <p className="lp-feature-desc">
              Tips happen instantly in your browser. No waiting for block confirmations, no MetaMask popups interrupting
              your flow.
            </p>
          </div>

          <div
            className={`lp-feature-card lp-animate ${isVisible["features"] ? "visible" : ""}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="lp-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="lp-feature-title">Non-Custodial</h3>
            <p className="lp-feature-desc">
              Your funds stay locked in a smart contract—not our servers. Only you control when to settle or abort your
              session.
            </p>
          </div>

          <div
            className={`lp-feature-card lp-animate ${isVisible["features"] ? "visible" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="lp-feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3 className="lp-feature-title">Zero Platform Fees</h3>
            <p className="lp-feature-desc">
              Creators receive 100% of every tip. We believe in direct value transfer—only network gas applies at
              settlement.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="lp-how-it-works" id="how" ref={setRef("how")}>
        <div className="lp-how-it-works-inner">
          <span className={`lp-section-label lp-animate ${isVisible["how"] ? "visible" : ""}`}>How It Works</span>
          <h2 className={`lp-section-title lp-animate ${isVisible["how"] ? "visible" : ""}`}>
            One on-chain transaction. Unlimited tips.
          </h2>

          <div className="lp-steps">
            <div
              className={`lp-step lp-animate ${isVisible["how"] ? "visible" : ""}`}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="lp-step-number">1</div>
              <h3 className="lp-step-title">Create a Session</h3>
              <p className="lp-step-desc">
                Approve and deposit USDC into the TipFlow contract. Your funds are locked and ready for tipping.
              </p>
            </div>

            <div
              className={`lp-step lp-animate ${isVisible["how"] ? "visible" : ""}`}
              style={{ animationDelay: "0.2s" }}
            >
              <div className="lp-step-number">2</div>
              <h3 className="lp-step-title">Tip Freely</h3>
              <p className="lp-step-desc">
                Send tips to any creator instantly. Each tip updates your local ledger—no blockchain transaction
                required.
              </p>
            </div>

            <div
              className={`lp-step lp-animate ${isVisible["how"] ? "visible" : ""}`}
              style={{ animationDelay: "0.3s" }}
            >
              <div className="lp-step-number">3</div>
              <h3 className="lp-step-title">Settle On-Chain</h3>
              <p className="lp-step-desc">
                When ready, settle your session. One transaction distributes all tips and returns unspent funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="lp-vision" id="vision" ref={setRef("vision")}>
        <p className={`lp-vision-quote lp-animate ${isVisible["vision"] ? "visible" : ""}`}>
          &ldquo;A payment experience that feels as instant as <span>Web2</span>, but maintains the self-custody and
          transparency of <span>Web3</span>.&rdquo;
        </p>
        <p
          className={`lp-vision-text lp-animate ${isVisible["vision"] ? "visible" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          TipFlow solves the fundamental tension in blockchain payments: the need for security and decentralization
          versus the desire for instant, frictionless transactions. Using state channel technology, we deliver both.
        </p>
      </section>

      {/* CTA Section */}
      <section className="lp-cta" id="cta" ref={setRef("cta")}>
        <h2 className={`lp-cta-title lp-animate ${isVisible["cta"] ? "visible" : ""}`}>Ready to stream value?</h2>
        <p className={`lp-cta-desc lp-animate ${isVisible["cta"] ? "visible" : ""}`}>
          Join creators and supporters who are redefining how micro-payments work on the blockchain.
        </p>
        <button className={`lp-btn-primary lp-animate ${isVisible["cta"] ? "visible" : ""}`}>
          Launch Application
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-logo">
            Tip<span>Flow</span>
          </div>
          <div className="lp-footer-links">
            <a href="#" className="lp-footer-link">
              Documentation
            </a>
            <a href="#" className="lp-footer-link">
              GitHub
            </a>
            <a href="#" className="lp-footer-link">
              Twitter
            </a>
          </div>
          <div className="lp-footer-copy">Built on Ethereum. Open source.</div>
        </div>
      </footer>
    </div>
  );
}
