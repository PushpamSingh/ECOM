export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink mb-2">
            Terms & Conditions
          </h1>
          <p className="text-gray-600">Last Updated: May 28, 2026</p>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-gray-700">
            Welcome to <strong>Avis Industries</strong>. By purchasing
            products from us, you agree to the following Terms &
            Conditions. Please read them carefully before placing an order.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              1. Payment Terms
            </h2>
            <p className="text-gray-700 mb-4">
              All orders for raw materials shall require{" "}
              <strong>100% advance payment</strong> before processing and
              dispatch.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                Orders will only be confirmed after successful receipt of
                payment.
              </li>
              <li>
                Processing and dispatch will begin only after payment
                verification.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              2. Transportation & Delivery
            </h2>
            <p className="text-gray-700 mb-4">
              All goods shall be transported through{" "}
              <strong>land transport services</strong> unless otherwise agreed.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                Delivery timelines may vary depending on transport
                availability and destination.
              </li>
              <li>
                Delays due to transport issues, weather, or unforeseen
                circumstances are beyond our control.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              3. E-Way Bill
            </h2>
            <p className="text-gray-700">
              For invoices above <strong>₹49,000</strong>, an{" "}
              <strong>E-Way Bill</strong> will be provided free of cost as
              per applicable GST regulations.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              4. GST Benefits
            </h2>
            <p className="text-gray-700">
              Customers providing valid <strong>GST registration details</strong>{" "}
              and supporting proof shall be eligible to claim GST input
              credits as per Government rules and regulations.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              5. Transit Damage Responsibility
            </h2>
            <p className="text-gray-700 mb-4">
              Any damage, leakage, shortage, or loss occurring during transit
              shall be the sole responsibility of the{" "}
              <strong>transport carrier</strong>.
            </p>
            <p className="text-gray-700">
              <strong>Avis Industries</strong> shall not be held liable for
              damages occurring after dispatch of goods.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              6. Handling of Inflamable or Chemical Articles
            </h2>
            <p className="text-gray-700 mb-4">
              Inflamable articles, chemical compounds, or hazardous materials
              must be handled, stored, and used carefully by the customer.
            </p>
            <p className="text-gray-700">
              <strong>Avis Industries</strong> shall not be responsible for
              any mishandling, accidents, damages, or legal issues arising
              from improper handling or storage of such products.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              7. Jurisdiction
            </h2>
            <p className="text-gray-700">
              Any disputes, legal matters, or claims arising out of
              transactions with <strong>Avis Industries</strong> shall be
              subject to the jurisdiction of{" "}
              <strong>Kolkata District Court</strong> and/or{" "}
              <strong>Kolkata High Court</strong> only.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              8. Modification of Terms
            </h2>
            <p className="text-gray-700">
              <strong>Avis Industries</strong> reserves the right to modify
              or update these Terms & Conditions at any time without prior
              notice.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              9. Contact Information
            </h2>

            <p className="text-gray-700 mb-4">
              If you have any questions regarding these Terms & Conditions,
              please contact us:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
              <p>
                <strong>Avis Industries</strong>
              </p>

              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:abhi90982@gmail.com"
                  className="text-primary-600 hover:underline"
                >
                  abhi90982@gmail.com
                </a>
              </p>

              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://www.agarbattikart.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  www.agarbattikart.com
                </a>
              </p>
            </div>
          </section>

          {/* Closing */}
          <section className="border-t pt-8">
            <p className="text-gray-700 text-center italic">
              By placing an order with Avis Industries, the customer
              acknowledges and agrees to all the above Terms &
              Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}