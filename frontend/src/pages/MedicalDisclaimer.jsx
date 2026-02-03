import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import "./MedicalDisclaimer.css";

const MedicalDisclaimer = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="legal-page disclaimer-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header warning">
          <AlertCircle size={48} className="legal-icon" />
          <h1>Medical Disclaimer</h1>
          <p className="last-updated">Last updated: February 3, 2026</p>
        </div>

        {/* Content */}
        <div className="legal-content">
          <section className="warning-box">
            <h3>⚠️ IMPORTANT NOTICE</h3>
            <p>
              This website and all products offered by AAZ International are
              intended for professional medical use only. Please read this
              disclaimer carefully before using any information or purchasing
              any products.
            </p>
          </section>

          <section>
            <h2>1. No Medical Advice</h2>
            <p>
              AAZ International does not provide medical advice, diagnosis,
              treatment, or recommendations. All information on this website is
              provided for informational and educational purposes only, not as
              medical advice.
            </p>
            <p>
              Any information provided regarding medical equipment, products, or
              treatments should not be considered a substitute for professional
              medical advice from a qualified healthcare provider. Always
              consult with a licensed healthcare professional before using any
              medical equipment or implementing any treatment.
            </p>
          </section>

          <section>
            <h2>2. Professional Use Only</h2>
            <p>
              All medical equipment, devices, and supplies offered on this
              website are intended for use by qualified healthcare professionals
              and medical institutions only. Users must:
            </p>
            <ul>
              <li>Hold appropriate medical licenses and certifications</li>
              <li>
                Have proper training and credentials for equipment operation
              </li>
              <li>Follow all manufacturer instructions and guidelines</li>
              <li>Comply with local medical regulations and standards</li>
              <li>
                Obtain appropriate approvals from medical boards and regulatory
                authorities
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Product Information & Specifications</h2>
            <p>
              While AAZ International strives to provide accurate product
              information:
            </p>
            <ul>
              <li>
                Product descriptions are provided for informational purposes
              </li>
              <li>Specifications may be subject to change by manufacturers</li>
              <li>
                Users are responsible for verifying all specifications and
                certifications
              </li>
              <li>Always consult manufacturer documentation and guidelines</li>
              <li>Regulatory compliance is the responsibility of the buyer</li>
            </ul>
          </section>

          <section>
            <h2>4. Safety & Proper Use</h2>
            <p>
              Improper use of medical equipment can result in serious injury or
              death. Users acknowledge that:
            </p>
            <ul>
              <li>
                Medical equipment must be used only as directed by manufacturers
              </li>
              <li>Proper training and certification are required before use</li>
              <li>
                Equipment must be maintained according to manufacturer
                specifications
              </li>
              <li>
                Regular safety checks and sterilization protocols must be
                followed
              </li>
              <li>
                Users assume full responsibility for proper use and patient
                safety
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Regulatory Compliance</h2>
            <p>
              All AAZ International products are certified with international
              standards (ISO, CE, FDA where applicable). However:
            </p>
            <ul>
              <li>
                Buyers are responsible for ensuring compliance with local
                regulations
              </li>
              <li>
                Import/export restrictions may apply in some jurisdictions
              </li>
              <li>
                Certifications valid in one country may not apply to another
              </li>
              <li>
                Medical professionals must verify local requirements before
                purchasing
              </li>
              <li>
                AAZ International is not responsible for regulatory violations
                by buyers
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Liability Limitations</h2>
            <p>AAZ International shall not be liable for:</p>
            <ul>
              <li>Patient injuries resulting from improper equipment use</li>
              <li>
                Medical outcomes or complications arising from product use
              </li>
              <li>
                Failure to comply with manufacturer guidelines or regulatory
                requirements
              </li>
              <li>Improper installation, maintenance, or sterilization</li>
              <li>Use of equipment by unqualified personnel</li>
              <li>Negligence on the part of healthcare providers</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2>7. Quality & Warranty</h2>
            <p>
              All products are supplied with manufacturer warranties. AAZ
              International:
            </p>
            <ul>
              <li>Supplies products in working condition as described</li>
              <li>Cannot guarantee fitness for any particular medical use</li>
              <li>Recommends professional inspection before clinical use</li>
              <li>Provides warranty support through manufacturer channels</li>
              <li>
                Is not responsible for manufacturing defects beyond warranty
                period
              </li>
            </ul>
          </section>

          <section>
            <h2>8. Sterilization & Safety</h2>
            <p>For reusable medical instruments and devices:</p>
            <ul>
              <li>Proper sterilization must be performed before each use</li>
              <li>Follow manufacturer sterilization protocols exactly</li>
              <li>
                Use approved sterilization methods (autoclave, chemical, etc.)
              </li>
              <li>Maintain sterilization records for compliance</li>
              <li>Users are responsible for ensuring proper sterilization</li>
            </ul>
          </section>

          <section>
            <h2>9. Expiration & Shelf Life</h2>
            <p>
              Products with expiration dates should not be used after the
              expiration date. Users must:
            </p>
            <ul>
              <li>Check expiration dates upon receipt</li>
              <li>Store products according to manufacturer specifications</li>
              <li>Implement first-in-first-out inventory rotation</li>
              <li>Verify shelf life before clinical use</li>
            </ul>
          </section>

          <section>
            <h2>10. Adverse Events & Incident Reporting</h2>
            <p>If you experience any adverse events or safety concerns:</p>
            <ul>
              <li>Contact the manufacturer immediately</li>
              <li>Report to relevant medical device regulatory authorities</li>
              <li>Notify AAZ International of serious incidents</li>
              <li>Maintain detailed incident documentation</li>
              <li>Comply with local incident reporting requirements</li>
            </ul>
          </section>

          <section>
            <h2>11. No Endorsements</h2>
            <p>
              AAZ International does not endorse any particular medical
              protocols, treatments, or clinical practices. Medical
              professionals must make clinical decisions based on:
            </p>
            <ul>
              <li>Current medical evidence and best practices</li>
              <li>Patient-specific considerations</li>
              <li>Institutional protocols and guidelines</li>
              <li>Professional judgment and experience</li>
            </ul>
          </section>

          <section>
            <h2>12. Disclaimer of Warranties</h2>
            <p>
              AAZ International provides all products and information "AS IS"
              without warranties of any kind, express or implied, including but
              not limited to:
            </p>
            <ul>
              <li>Warranty of merchantability</li>
              <li>Warranty of fitness for a particular purpose</li>
              <li>Warranty of non-infringement</li>
              <li>Warranty of safety or suitability for medical use</li>
            </ul>
          </section>

          <section>
            <h2>13. Changes to Disclaimer</h2>
            <p>
              This disclaimer may be updated at any time without notice.
              Continued use of this website constitutes acceptance of changes.
            </p>
          </section>

          <section>
            <h2>14. Questions & Concerns</h2>
            <p>For medical, safety, or compliance questions:</p>
            <ul>
              <li>
                <strong>Email:</strong> medical@aazinternational.com
              </li>
              <li>
                <strong>Phone:</strong> +92 300 1234567
              </li>
              <li>
                <strong>Website:</strong> www.aazinternational.com
              </li>
            </ul>
            <p>
              <strong>For adverse events or safety concerns:</strong> Contact
              the product manufacturer and relevant regulatory authorities
              immediately.
            </p>
          </section>

          <section className="warning-box">
            <h3>
              By using AAZ International services, you acknowledge that you have
              read, understood, and agree to this Medical Disclaimer.
            </h3>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
