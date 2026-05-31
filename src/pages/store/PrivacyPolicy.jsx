export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: May 28, 2026</p>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-gray-700">
            Welcome to <strong>AgarbattiKart</strong>. Your privacy is important to us. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you visit our website or use our services.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We may collect the following information from users:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping/Billing address</li>
              <li>Payment information</li>
              <li>Device and browser information</li>
              <li>Website usage data through cookies and analytics tools</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We only collect information that is necessary to provide better services and improve user experience.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">The information collected may be used for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Processing orders and payments</li>
              <li>Customer support and communication</li>
              <li>Improving our website and services</li>
              <li>Sending updates, offers, or promotional content</li>
              <li>Preventing fraud and maintaining website security</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>We do not sell, rent, or trade your personal information to third parties.</strong>
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">3. Data Protection & Security</h2>
            <p className="text-gray-700 mb-4">
              At AgarbattiKart, we take data security seriously. We use industry-standard security measures to keep your personal information safe and protected from unauthorized access, misuse, loss, or disclosure.
            </p>
            <p className="text-gray-700">
              Our website uses secure technologies and encrypted connections wherever required to ensure your information remains protected.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">4. Cookies Policy</h2>
            <p className="text-gray-700 mb-4">
              Our website may use cookies to enhance user experience, analyze website traffic, and improve our services.
            </p>
            <p className="text-gray-700">
              Users can choose to disable cookies through their browser settings, although some website features may not function properly.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700">
              We may use trusted third-party services such as payment gateways, analytics providers, and delivery partners. These third parties are only provided with the information necessary to perform their services securely.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">6. User Rights</h2>
            <p className="text-gray-700 mb-4">Users have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access their personal data</li>
              <li>Request correction of incorrect information</li>
              <li>Request deletion of their data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To make any request regarding your data, please contact us using the details below.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700">
              Our website and services are not intended for children under the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We reserve the right to update or modify this Privacy Policy at any time. Any changes will be updated on this page with the revised date.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
              <p>
                <strong>AgarbattiKart</strong>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:abhi90982@gmail.com" className="text-primary-600 hover:underline">
                  abhi90982@gmail.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a href="http://www.agarbattikart.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  www.agarbattikart.com
                </a>
              </p>
            </div>
          </section>

          {/* Closing */}
          <section className="border-t pt-8">
            <p className="text-gray-700 text-center italic">
              By using our website, you agree to the terms of this Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
