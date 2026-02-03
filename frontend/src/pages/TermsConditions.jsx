import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import "./TermsConditions.css";

const TermsConditions = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="legal-page terms-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <BookOpen size={48} className="legal-icon" />
          <h1>Terms & Conditions</h1>
          <p className="last-updated">Last updated: February 3, 2026</p>
        </div>

        {/* Content */}
        <div className="legal-content">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using the AAZ International website and services
              ("Services"), you accept and agree to be bound by and abide by the
              terms and condition of this agreement.
            </p>
            <p>
              If you do not agree to abide by the above, please do not use this
              service. AAZ International reserves the right to make changes to
              these Terms and Conditions at any time without notice.
            </p>
          </section>

          <section>
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the
              materials (information or software) on AAZ International's website
              for personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or for any public
                display
              </li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transfer the materials to another person or "mirror" the
                materials on any other server
              </li>
              <li>Violate any applicable laws or regulations</li>
              <li>
                Engage in any conduct that restricts or inhibits anyone's use or
                enjoyment of the website
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Disclaimer</h2>
            <p>
              The materials on AAZ International's website are provided on an
              'as is' basis. AAZ International makes no warranties, expressed or
              implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section>
            <h2>4. Limitations</h2>
            <p>
              In no event shall AAZ International or its suppliers be liable for
              any damages (including, without limitation, damages for loss of
              data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on AAZ International's
              website, even if AAZ International or an authorized representative
              has been notified orally or in writing of the possibility of such
              damage.
            </p>
          </section>

          <section>
            <h2>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on AAZ International's website could
              include technical, typographical, or photographic errors. AAZ
              International does not warrant that any of the materials on its
              website are accurate, complete, or current. AAZ International may
              make changes to the materials contained on its website at any time
              without notice.
            </p>
          </section>

          <section>
            <h2>6. Links</h2>
            <p>
              AAZ International has not reviewed all of the sites linked to its
              website and is not responsible for the contents of any such linked
              site. The inclusion of any link does not imply endorsement by AAZ
              International of the site. Use of any such linked website is at
              the user's own risk.
            </p>
          </section>

          <section>
            <h2>7. Modifications</h2>
            <p>
              AAZ International may revise these Terms and Conditions for its
              website at any time without notice. By using this website, you are
              agreeing to be bound by the then current version of these Terms
              and Conditions.
            </p>
          </section>

          <section>
            <h2>8. Governing Law</h2>
            <p>
              These Terms and Conditions and all related policies are governed
              by and construed in accordance with the laws of Pakistan, and you
              irrevocably submit to the exclusive jurisdiction of the courts in
              that location.
            </p>
          </section>

          <section>
            <h2>9. User Accounts & Responsibilities</h2>
            <p>If you register for an account with AAZ International:</p>
            <ul>
              <li>
                You are responsible for maintaining the confidentiality of your
                account information
              </li>
              <li>
                You are responsible for all activities conducted through your
                account
              </li>
              <li>You agree to provide accurate and complete information</li>
              <li>
                You may not use another person's account without permission
              </li>
              <li>
                AAZ International reserves the right to terminate accounts that
                violate these Terms
              </li>
            </ul>
          </section>

          <section>
            <h2>10. Product Information</h2>
            <p>
              AAZ International strives to provide accurate product information,
              pricing, and availability. However:
            </p>
            <ul>
              <li>
                Product descriptions are provided for informational purposes
              </li>
              <li>Prices are subject to change without notice</li>
              <li>Stock availability may vary</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>
                All products must comply with local import/export regulations
              </li>
            </ul>
          </section>

          <section>
            <h2>11. Ordering & Payment</h2>
            <ul>
              <li>
                All orders are subject to acceptance and confirmation by AAZ
                International
              </li>
              <li>
                Orders are placed in Pakistan Standard Time (PKT) timezone
              </li>
              <li>Payment must be received before order processing</li>
              <li>
                Bank transfer requires proof submission and admin verification
              </li>
              <li>Users cannot approve their own payment proofs</li>
              <li>
                Fraudulent payment submissions may result in account termination
              </li>
            </ul>
          </section>

          <section>
            <h2>12. Shipping & Delivery</h2>
            <ul>
              <li>Delivery timelines are estimates and not guaranteed</li>
              <li>Risk of loss transfers to buyer upon delivery</li>
              <li>
                Damage claims must be reported within 48 hours of delivery
              </li>
              <li>
                International orders require compliance with import regulations
              </li>
            </ul>
          </section>

          <section>
            <h2>13. Returns & Refunds</h2>
            <p>
              Medical equipment is typically non-returnable due to sterilization
              and regulatory requirements. Returns may be considered on a
              case-by-case basis within 7 days of delivery. Refunds are
              processed to the original payment method.
            </p>
          </section>

          <section>
            <h2>14. Limitation of Liability</h2>
            <p>
              AAZ International's total liability shall not exceed the total
              amount paid by the user in the preceding 12 months. Some
              jurisdictions do not allow limitation of liability, so this
              limitation may not apply to you.
            </p>
          </section>

          <section>
            <h2>15. Contact Information</h2>
            <p>For questions regarding these Terms & Conditions:</p>
            <ul>
              <li>
                <strong>Email:</strong> support@aazinternational.com
              </li>
              <li>
                <strong>WhatsApp:</strong> +92 300 1234567
              </li>
              <li>
                <strong>Website:</strong> www.aazinternational.com
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
