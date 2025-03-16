"use client";

import { useState } from "react";

export default function Privacy() {
  const [showEmail, setShowEmail] = useState(false);
  const email = "joel.yourstone+purpleconprivacy@gmail.com";

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-2xl font-bold mb-4">
          Privacy Policy for Purplecon
        </h1>

        <p className="text-sm mb-6">Last Updated: 16th March 2025</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p className="mb-4">
            Welcome to Purplecon, an invitation-only board game convention. This
            Privacy Policy explains how we collect, use, and protect your
            personal information when you use our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Required Information: First name, last name, email address, and
              password for account creation.
            </li>
            <li>
              Optional Information: Profile picture (captured via camera or
              selected from your device), push notification preferences.
            </li>
            <li>
              We do not collect sensitive information like location or
              microphone data.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To create and maintain your user account.</li>
            <li>
              To manage RSVPs for the convention and provide convention-related
              updates and information.
            </li>
            <li>
              To send you push notifications about important event news or
              schedule changes (if you opt in).
            </li>
            <li>
              To enhance your user experience and support any technical or
              customer service issues.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Data Sharing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We do not share or sell your personal data to third parties.
            </li>
            <li>
              We may disclose information only if required by law or necessary
              to protect our rights.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Data Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We take appropriate measures to protect your data from
              unauthorized access or disclosure.
            </li>
            <li>
              However, no method of electronic transmission or storage is
              entirely secure, and we cannot guarantee absolute security.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Children&apos;s Privacy
          </h2>
          <p className="mb-4">
            Purplecon is intended for adult attendees only. We do not knowingly
            collect personal information from children. If you believe a child
            has provided us with personal data, please contact us so we can
            remove it.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. Any changes
            will be posted in the app or on our website along with the revised
            policy&apos;s effective date.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="mb-4">
            For questions or concerns about this Privacy Policy, please contact
            us at{" "}
            <a
              href={showEmail ? `mailto:${email}` : "#"}
              onClick={() => setShowEmail(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              {showEmail ? email : "Click to reveal email"}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
