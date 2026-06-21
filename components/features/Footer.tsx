import Link from "next/link";

const FOOTER_LINKS = {
  Explore: [
    ["Companies", "/companies"],
    ["Salaries", "/salaries"],
    ["Reviews", "/reviews"],
    ["Interviews", "/interviews"],
    ["Jobs", "/jobs"],
  ],
  Tools: [
    ["Salary Calculator", "/tools/salary-calculator"],
    ["Hike Calculator", "/tools/hike-calculator"],
    ["Equity Calculator", "/tools/equity-calculator"],
    ["Offer Comparison", "/tools/offer-comparison"],
  ],
  Community: [
    ["Discussions", "/community"],
    ["Workplace Index", "/workplace-index"],
    ["Add Salary", "/salaries"],
    ["Compare Companies", "/compare"],
  ],
  Company: [
    ["About", "#"],
    ["Blog", "#"],
    ["Privacy Policy", "#"],
    ["Terms of Use", "#"],
  ],
};

const TRUST_BADGES = [
  { label: "Verified Data", desc: "All salary entries go through a confidence-scoring pipeline" },
  { label: "Anonymous First", desc: "Zero PII collected. Contributor identity is never stored" },
  { label: "India Focused", desc: "Built specifically for India's tech job market" },
];

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.857L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#222222] text-[#717171] mt-16">
      {/* Trust badges strip */}
      <div className="border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid sm:grid-cols-3 gap-4">
          {TRUST_BADGES.map(({ label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2f2f2f] flex items-center justify-center shrink-0">
                <span className="text-[#FF5A5F] text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-lg font-bold text-[#FF5A5F]">Talent</span>
              <span className="text-lg font-bold text-white">Dash</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">Career intelligence for India&apos;s tech professionals. Real data, real decisions.</p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { href: "#", icon: <XIcon />, label: "X (Twitter)" },
                { href: "#", icon: <LinkedInIcon />, label: "LinkedIn" },
                { href: "#", icon: <GithubIcon />, label: "GitHub" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-[#2f2f2f] flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-3">{section}</h4>
              <ul className="space-y-2 text-sm">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#333333] pt-6 flex flex-col gap-3">
          <p className="text-xs">© 2025 TalentDash. All rights reserved. Built for India&apos;s tech community.</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A05] animate-pulse" />
              Data updated hourly
            </span>
            <span className="text-[#555]">Data sourced from verified contributors. Always verify before negotiating.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
