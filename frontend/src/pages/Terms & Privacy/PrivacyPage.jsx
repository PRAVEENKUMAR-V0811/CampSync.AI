// PrivacyPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const lastUpdated = "September 22, 2025";
const contactEmail = "info@campsync.ai"; // replace with your contact

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-10 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: {lastUpdated}</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-700">
            CampusConnect.AI respects your privacy. This Privacy Policy explains what information we collect, how we
            use it, and the choices you have. By using the Platform, you consent to the practices described here.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p className="text-gray-700">
            <strong>Account Information:</strong> name, email, role (student or alumni), profile picture (if provided).
          </p>
          <p className="text-gray-700 mt-2">
            <strong>User Content:</strong> interview experiences, uploaded question papers, comments, and any other
            materials you submit.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Usage Data:</strong> device and browser information, IP address, pages visited, and feature usage
            collected through logs and analytics.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Provide and maintain the Platform and its features.</li>
            <li>Personalize recommendations, dashboards, and mock interview prompts.</li>
            <li>Analyze aggregate trends to improve service quality and perform research.</li>
            <li>Communicate with you about your account and important updates.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. AI Processing &amp; Third-Party Services</h2>
          <p className="text-gray-700">
            Some features (e.g., Mock Interview Bot, auto-tagging) may process text using third-party AI services or
            internal ML models. Text submitted to such features may be transmitted to those services for processing.
            We take steps to minimize personal data in such requests and to comply with privacy best practices.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Data Sharing &amp; Disclosure</h2>
          <p className="text-gray-700">
            We do not sell personal data. We may share aggregated or anonymized analytics publicly. We may disclose
            information when required by law, to protect rights, or to comply with legal processes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
          <p className="text-gray-700">
            We retain personal information as long as needed to provide the Platform and comply with legal obligations.
            You may request deletion of your account and associated personal data; some copies may remain in backups or
            logs for a limited time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Security</h2>
          <p className="text-gray-700">
            We take reasonable administrative and technical measures to protect personal data. However, no system is
            completely secure. Do not share sensitive personal information in public uploads.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
          <p className="text-gray-700">
            You can access, correct, or request deletion of your personal data. To make such requests, contact us at{" "}
            <a href={`mailto:${contactEmail}`} className="text-indigo-600">{contactEmail}</a>. We will respond within
            a reasonable timeframe.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Children's Privacy</h2>
          <p className="text-gray-700">
            The Platform is not intended for users under the age of 13. If we discover information from a child under 13,
            we will take steps to delete it. If you believe we have collected such information, contact us.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may modify this Privacy Policy. We will post updates on this page with a revised "Last updated" date.
            Continued use after changes indicates acceptance.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-gray-700">
            Questions or requests regarding privacy can be sent to{" "}
            <a href={`mailto:${contactEmail}`} className="text-indigo-600">{contactEmail}</a>.
          </p>
        </section>
      </div>
          <div className="mt-8 flex justify-center">
              <Link
                  to="/"
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
              >
                  Back to Home
              </Link>
          </div>
    </div>
  );
}
