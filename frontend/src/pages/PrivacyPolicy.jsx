import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="legal-page privacy-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <Shield size={48} className="legal-icon" />
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: February 3, 2026</p>
        </div>

        {/* Content */}
        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              AAZ International ("we," "us," "our," or "Company") is committed
              to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website and use our medical equipment procurement
              services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree
              with our policies and practices, please do not use our Services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide Directly</h3>
            <ul>
              <li>
                <strong>Account Registration:</strong> Name, email, phone,
                organization details, address
              </li>
              <li>
                <strong>Orders & Purchases:</strong> Product selections,
                delivery address, payment information
              </li>
              <li>
                <strong>Payment Proof:</strong> Bank transfer receipts,
                transaction IDs, payment documentation
              </li>
              <li>
                <strong>Communications:</strong> Messages, inquiries, support
                requests
              </li>
              <li>
                <strong>Payment Processing:</strong> Payment method details
                (processed securely via Stripe)
              </li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li>IP address and device identifiers</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on site</li>
              <li>Referral source</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul>
              <li>Processing and fulfilling orders</li>
              <li>Verifying payment proofs and managing bank transfers</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>
                Sending transactional emails (order confirmations, shipping
                updates)
              </li>
              <li>Improving our website and services</li>
              <li>Preventing fraud and securing our platform</li>
              <li>Complying with legal obligations</li>
              <li>Marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              AAZ International implements industry-standard security measures
              to protect your personal information:
            </p>
            <ul>
              <li>SSL/TLS encryption for data in transit</li>
              <li>Password hashing using bcrypt (10+ salt rounds)</li>
              <li>Role-based access control for admin functions</li>
              <li>Payment data handled via PCI-DSS compliant Stripe</li>
              <li>Regular security audits and updates</li>
              <li>Secure payment proof storage</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100%
              secure. We cannot guarantee absolute security of your information.
            </p>
          </section>

          <section>
            <h2>5. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information. We may
              share information only in these cases:
            </p>
            <ul>
              <li>
                <strong>Payment Processors:</strong> Stripe (for secure payment
                processing)
              </li>
              <li>
                <strong>Email Service Providers:</strong> For transactional
                emails
              </li>
              <li>
                <strong>Legal Compliance:</strong> When required by law or court
                order
              </li>
              <li>
                <strong>Service Providers:</strong> Third parties that help us
                operate our business
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>
              Our website uses cookies and similar technologies to enhance user
              experience. You can control cookie preferences through your
              browser settings. Disabling cookies may limit certain website
              functionality.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise these rights, contact us at:
              privacy@aazinternational.com
            </p>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>
              We retain personal information only as long as necessary to
              fulfill the purposes outlined in this policy or as required by
              law. Order records and payment proofs are retained for 7 years for
              accounting and compliance purposes.
            </p>
          </section>

          <section>
            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for their privacy practices. Please review their
              privacy policies before providing information.
            </p>
          </section>

          <section>
            <h2>10. Policy Updates</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of material changes via email or prominent website notification.
              Your continued use of our Services constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>For privacy concerns or inquiries:</p>
            <ul>
              <li>
                <strong>Email:</strong> privacy@aazinternational.com
              </li>
              <li>
                <strong>Website:</strong> www.aazinternational.com
              </li>
              <li>
                <strong>WhatsApp:</strong> +92 300 1234567
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
