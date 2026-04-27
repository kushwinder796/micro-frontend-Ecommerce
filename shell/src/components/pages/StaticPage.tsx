import { useNavigate } from "react-router-dom";


interface Props {
  slug: string;
}
const pages: Record<string, {
  title: string;
  subtitle: string;
  sections: { heading: string; body: string }[];
}> = {
  features: {
    title: "Platform Features",
    subtitle: "Everything you need to build a world-class e-commerce experience.",
    sections: [
      { heading: "AI-Powered Search", body: "Our intelligent search engine understands natural language queries, suggests products based on browsing history, and learns from user behaviour to surface the most relevant results instantly." },
      { heading: "Secure Payments", body: "Integrated with Stripe, PayPal, and UPI. Every transaction is encrypted end-to-end with PCI-DSS Level 1 compliance. Instant refunds and automated dispute resolution included." },
      { heading: "Real-Time Chat Support", body: "Built on SignalR WebSockets, our live chat connects customers with support agents in milliseconds. AI triage routes tickets automatically and suggests answers from your knowledge base." },
      { heading: "Micro-Frontend Architecture", body: "Each section of the platform is an independently deployable micro-frontend. Teams can ship features without coordination overhead, and the shell orchestrates everything seamlessly." },
      { heading: "Analytics Dashboard", body: "Real-time revenue, order, and user metrics. Drill down by category, region, or time period. Export reports as CSV or PDF with one click." },
      { heading: "Inventory Management", body: "Track stock levels across multiple warehouses. Automated low-stock alerts, bulk import via CSV, and supplier integrations keep your catalogue always up to date." },
    ],
  },
  pricing: {
    title: "Simple, Transparent Pricing",
    subtitle: "No hidden fees. No surprises. Scale as you grow.",
    sections: [
      { heading: "Starter — Free", body: "Up to 50 products, 100 orders/month, community support, and access to all core features. Perfect for individuals and small side projects getting started." },
      { heading: "Growth — ₹2,999/month", body: "Unlimited products, 5,000 orders/month, priority email support, advanced analytics, custom domain, and AI-powered search. Ideal for growing businesses." },
      { heading: "Pro — ₹7,999/month", body: "Everything in Growth plus dedicated account manager, SLA-backed uptime, multi-warehouse inventory, white-label branding, and API access with 1M calls/month." },
      { heading: "Enterprise — Custom", body: "Tailored pricing for large organisations. Includes on-premise deployment options, custom integrations, 24/7 phone support, and a dedicated engineering liaison." },
      { heading: "All Plans Include", body: "SSL certificate, automatic backups, GDPR compliance tools, mobile-optimised storefront, and free onboarding session with our customer success team." },
    ],
  },
  "best-sellers": {
    title: "Best Sellers",
    subtitle: "The products your customers love most, ranked by sales volume.",
    sections: [
      { heading: "Electronics", body: "iPhone 15 Pro, Samsung Galaxy S24, Dell XPS Laptop, Sony WH-1000XM5 Headphones, and Apple Watch Series 9 consistently top our electronics charts month after month." },
      { heading: "Fashion", body: "Men's Casual T-Shirts, Women's Ethnic Kurtas, Denim Jackets, and Sneakers from top brands drive the highest repeat purchase rates in the fashion category." },
      { heading: "Home & Kitchen", body: "Instant Pot Pressure Cookers, Philips Air Fryers, and ergonomic office chairs are perennial favourites among home improvement shoppers." },
      { heading: "Beauty & Personal Care", body: "Skincare bundles, premium hair care sets, and grooming kits from trusted brands see the highest average order values across the platform." },
    ],
  },
  categories: {
    title: "Product Categories",
    subtitle: "Browse our full catalogue organised by category.",
    sections: [
      { heading: "Electronics", body: "Smartphones, laptops, tablets, audio equipment, cameras, smart home devices, and accessories from all major brands." },
      { heading: "Fashion", body: "Men's and women's clothing, footwear, accessories, ethnic wear, sportswear, and seasonal collections." },
      { heading: "Home & Kitchen", body: "Furniture, cookware, appliances, décor, bedding, storage solutions, and garden essentials." },
      { heading: "Beauty & Personal Care", body: "Skincare, haircare, fragrances, grooming, wellness supplements, and professional salon products." },
      { heading: "Sports & Outdoors", body: "Fitness equipment, cycling gear, camping supplies, team sports, yoga, and adventure accessories." },
      { heading: "Books & Stationery", body: "Fiction, non-fiction, academic textbooks, art supplies, planners, and premium writing instruments." },
    ],
  },
  "about-us": {
    title: "About ECommerce",
    subtitle: "Building the future of online retail, one micro-frontend at a time.",
    sections: [
      { heading: "Our Story", body: "Founded in 2022 by Dronaa Software LLP, ECommerce was born from a simple frustration: existing platforms were monolithic, slow to evolve, and impossible to customise at scale. We set out to build something different." },
      { heading: "Our Mission", body: "To democratise world-class e-commerce infrastructure. We believe every business — from a solo artisan to a Fortune 500 retailer — deserves a platform that is fast, reliable, and genuinely delightful to use." },
      { heading: "Our Technology", body: "We pioneered micro-frontend architecture for e-commerce. Each feature is an independently deployable module, enabling teams to ship without coordination overhead and users to experience zero-downtime updates." },
      { heading: "Our Team", body: "A distributed team of 20+ engineers, designers, and product managers across India, Europe, and North America. We are remote-first, async-friendly, and deeply committed to open-source." },
      { heading: "Our Values", body: "Transparency, craftsmanship, customer obsession, and continuous learning. We publish our engineering blog weekly and open-source our internal tooling wherever possible." },
    ],
  },
  careers: {
    title: "Careers at ECommerce",
    subtitle: "Join a team building the next generation of commerce infrastructure.",
    sections: [
      { heading: "Why Join Us?", body: "Competitive salaries benchmarked at the 75th percentile, fully remote work, flexible hours, generous equity, and a learning budget of ₹1,00,000 per year per employee." },
      { heading: "Open Roles — Engineering", body: "Senior Frontend Engineer (React/TypeScript), Backend Engineer (.NET / C#), DevOps Engineer (Kubernetes / AWS), and Data Engineer (Python / Spark). All roles are remote-friendly." },
      { heading: "Open Roles — Product & Design", body: "Senior Product Manager, UX Researcher, and Product Designer. We value systems thinking, deep customer empathy, and a bias for shipping." },
      { heading: "Our Hiring Process", body: "1. Application review (3 days). 2. Async take-home challenge (paid). 3. Two technical interviews. 4. Culture conversation with the founding team. Total time: under 3 weeks." },
      { heading: "Benefits", body: "Health insurance for you and your family, 30 days paid leave, home office stipend, team retreats twice a year, and access to our internal AI tools and research previews." },
    ],
  },
  partners: {
    title: "Partner Programme",
    subtitle: "Grow your business by building on top of ECommerce.",
    sections: [
      { heading: "Technology Partners", body: "Integrate your SaaS product with our platform and reach 10,000+ merchants. We offer co-marketing, joint webinars, and a dedicated partner success manager." },
      { heading: "Agency Partners", body: "Certified implementation agencies receive priority support, deal registration, revenue sharing, and access to our partner portal with sales collateral and training materials." },
      { heading: "Referral Programme", body: "Earn 20% recurring commission for every merchant you refer who activates a paid plan. Payouts are monthly with no cap on earnings." },
      { heading: "How to Apply", body: "Fill out the partner application form on our website. Our partnerships team reviews applications within 5 business days and schedules an onboarding call for approved partners." },
    ],
  },
  "help-center": {
    title: "Help Center",
    subtitle: "Find answers to the most common questions about our platform.",
    sections: [
      { heading: "Getting Started", body: "Create your account, set up your store, add your first product, and configure payment methods — all in under 30 minutes with our guided onboarding wizard." },
      { heading: "Managing Orders", body: "View, filter, and export orders from the Orders dashboard. Update order status, print shipping labels, and trigger automated customer notifications with one click." },
      { heading: "Payment Issues", body: "If a payment fails, check that your Stripe/PayPal credentials are correctly configured in Settings → Payments. For disputed transactions, use the Disputes tab to respond within 7 days." },
      { heading: "Account & Billing", body: "Update your billing details, download invoices, and manage your subscription from Settings → Billing. Downgrades take effect at the end of the current billing cycle." },
      { heading: "Technical Support", body: "For platform bugs or API issues, open a ticket via the Support tab. Pro and Enterprise customers receive a response within 4 hours; Starter customers within 48 hours." },
    ],
  },
  "contact-us": {
    title: "Contact Us",
    subtitle: "We'd love to hear from you. Reach out any time.",
    sections: [
      { heading: "General Enquiries", body: "Email us at hello@ecommerce.in for general questions about the platform, partnerships, or press enquiries. We respond within one business day." },
      { heading: "Technical Support", body: "Existing customers can open a support ticket directly from their dashboard. For urgent production issues, Pro and Enterprise customers can call our 24/7 hotline." },
      { heading: "Sales", body: "Interested in our Growth or Pro plans? Email sales@ecommerce.in or book a 30-minute demo call with our sales team. We'll tailor a solution to your needs." },
      { heading: "Office Address", body: "Dronaa Software LLP, 4th Floor, Tech Park, Sector 75, S.A.S, Chandigarh, India. Visitors by appointment only." },
      { heading: "Social Media", body: "Follow us on Twitter @ECommerceHQ for product updates, LinkedIn for company news, and Instagram for behind-the-scenes content from our team." },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    subtitle: "Hassle-free returns within 30 days of delivery.",
    sections: [
      { heading: "Return Policy", body: "Most items can be returned within 30 days of delivery in their original condition and packaging. Electronics must be returned within 15 days. Perishables and personalised items are non-returnable." },
      { heading: "How to Initiate a Return", body: "Go to My Orders → select the order → click Return Item. Choose a reason, select pickup or drop-off, and we'll arrange collection within 2 business days." },
      { heading: "Refund Timeline", body: "Once we receive and inspect the returned item, refunds are processed within 3–5 business days to your original payment method. UPI refunds are typically instant." },
      { heading: "Damaged or Wrong Items", body: "If you received a damaged or incorrect item, contact us within 48 hours of delivery with photos. We'll arrange an immediate replacement or full refund at no cost to you." },
      { heading: "Exchange Policy", body: "Exchanges are available for size or colour variants of the same product, subject to stock availability. Initiate an exchange the same way as a return and select 'Exchange' instead." },
    ],
  },
  "order-status": {
    title: "Order Status",
    subtitle: "Track your order from placement to delivery.",
    sections: [
      { heading: "Order Confirmed", body: "You'll receive an email confirmation within minutes of placing your order. This means payment was successful and your order is in our system." },
      { heading: "Processing", body: "Our warehouse team is picking, packing, and quality-checking your items. This typically takes 1–2 business days for standard orders." },
      { heading: "Shipped", body: "Your order has been handed to the courier. You'll receive a tracking number via email and SMS. Use it on the courier's website for real-time location updates." },
      { heading: "Out for Delivery", body: "Your package is with the delivery agent and will arrive today. Ensure someone is available at the delivery address or provide delivery instructions in advance." },
      { heading: "Delivered", body: "Your order has been delivered. If you haven't received it, check with neighbours or building security first, then contact us within 48 hours." },
    ],
  },
  "shipping-info": {
    title: "Shipping Information",
    subtitle: "Fast, reliable delivery across India and internationally.",
    sections: [
      { heading: "Standard Delivery", body: "Free on all orders above ₹499. Delivered within 5–7 business days. Available across 27,000+ pin codes in India." },
      { heading: "Express Delivery", body: "₹99 flat fee. Delivered within 1–2 business days in metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune). Order before 2 PM for same-day dispatch." },
      { heading: "International Shipping", body: "We ship to 40+ countries. Delivery takes 7–14 business days. Customs duties and import taxes are the responsibility of the recipient." },
      { heading: "Tracking Your Shipment", body: "All orders include a tracking number sent via email and SMS. Track in real time on our website or directly on the courier's portal." },
      { heading: "Packaging", body: "We use eco-friendly, recyclable packaging. Fragile items are double-boxed with protective foam. Electronics are shipped in anti-static packaging." },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    subtitle: "Last updated: January 2025. We take your privacy seriously.",
    sections: [
      { heading: "Data We Collect", body: "We collect information you provide directly (name, email, address, payment details), data generated by your use of the platform (browsing history, purchase history, device information), and data from third-party integrations you authorise." },
      { heading: "How We Use Your Data", body: "To process orders, personalise your experience, send transactional emails, improve our platform, detect fraud, and comply with legal obligations. We never sell your personal data to third parties." },
      { heading: "Data Sharing", body: "We share data with payment processors (Stripe, PayPal), logistics partners, and cloud infrastructure providers (AWS) strictly as necessary to deliver our services. All partners are bound by data processing agreements." },
      { heading: "Your Rights", body: "Under GDPR and India's DPDP Act, you have the right to access, correct, delete, and port your data. Submit requests via Settings → Privacy or email privacy@ecommerce.in." },
      { heading: "Cookies", body: "We use essential cookies for authentication and session management, analytics cookies (opt-out available), and marketing cookies (opt-in only). Manage preferences via the cookie banner or Settings → Privacy." },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    subtitle: "Last updated: January 2025. Please read carefully before using our platform.",
    sections: [
      { heading: "Acceptance of Terms", body: "By accessing or using ECommerce, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform." },
      { heading: "User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorised access." },
      { heading: "Prohibited Activities", body: "You may not use the platform for illegal activities, to distribute malware, to scrape data without permission, to impersonate others, or to engage in fraudulent transactions." },
      { heading: "Intellectual Property", body: "All platform content, trademarks, and software are owned by Dronaa Software LLP. You may not reproduce, distribute, or create derivative works without written permission." },
      { heading: "Limitation of Liability", body: "To the maximum extent permitted by law, ECommerce shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform." },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    subtitle: "How we use cookies to improve your experience.",
    sections: [
      { heading: "What Are Cookies?", body: "Cookies are small text files stored on your device by your browser. They help websites remember your preferences, keep you logged in, and understand how you use the site." },
      { heading: "Essential Cookies", body: "Required for the platform to function. These include authentication tokens, session identifiers, and security cookies. They cannot be disabled without breaking core functionality." },
      { heading: "Analytics Cookies", body: "Help us understand how visitors interact with the platform. We use anonymised data to improve page performance and user flows. You can opt out via Settings → Privacy." },
      { heading: "Marketing Cookies", body: "Used to show you relevant advertisements on third-party platforms. These are opt-in only and require your explicit consent before being set." },
      { heading: "Managing Cookies", body: "You can manage cookie preferences at any time via the cookie banner, Settings → Privacy, or your browser's built-in cookie controls. Clearing cookies will log you out of the platform." },
    ],
  },
  licenses: {
    title: "Licenses",
    subtitle: "Open-source software and third-party licenses used in our platform.",
    sections: [
      { heading: "Open Source Libraries", body: "ECommerce is built on React (MIT), .NET (MIT), Tailwind CSS (MIT), Zustand (MIT), React Router (MIT), Axios (MIT), and SignalR (Apache 2.0). Full license texts are available in our GitHub repository." },
      { heading: "Fonts", body: "We use DM Sans (SIL Open Font License 1.1) and Inter (SIL Open Font License 1.1) served via Google Fonts. No additional licensing is required for end users." },
      { heading: "Icons & Illustrations", body: "Icons are from Heroicons (MIT) and React Icons (MIT). Product placeholder illustrations are original works owned by Dronaa Software LLP." },
      { heading: "Third-Party Services", body: "Stripe (proprietary), Leaflet (BSD 2-Clause), React Leaflet (BSD 2-Clause), and Stripe.js (Stripe Terms of Service). Usage of these services is subject to their respective terms." },
      { heading: "Platform License", body: "The ECommerce platform source code is proprietary and owned by Dronaa Software LLP. Unauthorised copying, modification, or distribution is prohibited." },
    ],
  },
};



const StaticPage = ({ slug }: Props) => {
  const navigate = useNavigate();
  const page = pages[slug];

  if (!page) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ fontSize: 48 }}>🔍</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Page not found</h1>
        <button onClick={() => navigate("/")} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#06b6d4,#3b82f6)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px 80px" }}>
      <button
        onClick={() => navigate(-1)}
           style={{
            padding: "12px 38px", borderRadius: 12, margin:"10px 0", border: "none",
            background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
            color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", textAlign: "center",
          }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.1 }}>
          {page.title}
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
          {page.subtitle}
        </p>
        {/* Divider */}
        <div style={{ height: 2, background: "linear-gradient(90deg,#06b6d4,#8b5cf6,transparent)", borderRadius: 2, marginTop: 24 }} />
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {page.sections.map((section, i) => (
          <div
            key={i}
            style={{
              padding: "24px 28px",
              borderRadius: 16,
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(6,182,212,0.4)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-color)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#fff", marginTop: 2,
              }}>
                {i + 1}
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
                  {section.heading}
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>
                  {section.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 56, padding: "32px", borderRadius: 20,
        background: "linear-gradient(135deg,rgba(6,182,212,0.08),rgba(139,92,246,0.08))",
        border: "1px solid rgba(6,182,212,0.2)",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
          Still have questions?
        </p>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 20px" }}>
          Our support team is available 24/7 to help you.
        </p>
        <button
          onClick={() => navigate("/contact-us")}
          style={{
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          Contact Support →
        </button>
      </div>
    </div>
  );
};

export default StaticPage;
