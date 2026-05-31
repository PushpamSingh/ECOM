export default function ReturnRefundPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink mb-2">
            Return & Refund Policy
          </h1>
          <p className="text-gray-600">Last Updated: May 28, 2026</p>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-gray-700">
            At <strong>Avis Industries</strong>, customer satisfaction is
            our priority. If you are not completely satisfied with your
            purchase, we are here to help.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              1. Return Eligibility
            </h2>

            <p className="text-gray-700 mb-4">
              We accept returns for products that are:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Unused</li>
              <li>Unopened</li>
              <li>In their original packaging</li>
              <li>In the same condition as received</li>
            </ul>

            <p className="text-gray-700 mt-4">
              Items must be returned within{" "}
              <strong>7 days of delivery</strong> to be eligible for a
              refund or replacement.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              2. Non-Returnable Items
            </h2>

            <p className="text-gray-700 mb-4">
              The following items may not be eligible for return:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Used or damaged products</li>
              <li>Products without original packaging</li>
              <li>Items returned after the return period</li>
              <li>Customized or special-order products</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              3. Refund Process
            </h2>

            <p className="text-gray-700 mb-4">
              Once we receive and inspect the returned item, we will notify
              you regarding the approval or rejection of your refund.
            </p>

            <p className="text-gray-700 mb-4">
              If approved:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                Refunds will be processed to the original payment method
              </li>
              <li>
                The refund may take{" "}
                <strong>5–10 business days</strong> to reflect,
                depending on your bank or payment provider
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              4. Replacement Policy
            </h2>

            <p className="text-gray-700 mb-4">
              If you receive a damaged, defective, or incorrect product,
              we will offer a replacement or refund after verification.
            </p>

            <p className="text-gray-700">
              Customers are requested to share clear{" "}
              <strong>photos/videos</strong> of the product for
              verification purposes.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              5. Return Shipping
            </h2>

            <p className="text-gray-700 mb-4">
              Customers may be responsible for{" "}
              <strong>return shipping charges</strong> unless the item
              received is damaged or incorrect.
            </p>

            <p className="text-gray-700">
              Shipping charges are{" "}
              <strong>non-refundable</strong> unless otherwise stated.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              6. Cancellation Policy
            </h2>

            <p className="text-gray-700">
              Orders can only be cancelled{" "}
              <strong>before dispatch</strong>. Once the order has been
              shipped, cancellation requests may not be accepted.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">
              7. Contact Us
            </h2>

            <p className="text-gray-700 mb-4">
              For return, refund, or replacement requests, please contact us:
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
              We value your trust and strive to provide the best service
              possible. Thank you for choosing Avis Industries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}