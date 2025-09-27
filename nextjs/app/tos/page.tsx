import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this service, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on our
            website for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p>
            The materials on our website are provided on an 'as is' basis. We make no warranties,
            expressed or implied, and hereby disclaim and negate all other warranties including
            without limitation, implied warranties or conditions of merchantability, fitness for
            a particular purpose, or non-infringement of intellectual property or other violation
            of rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p>
            In no event shall we or our suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption)
            arising out of the use or inability to use the materials on our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on our website could include technical, typographical, or
            photographic errors. We do not warrant that any of the materials on its website are
            accurate, complete, or current.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
          <p>
            We have not reviewed all of the sites linked to its website and are not responsible
            for the contents of any such linked site. The inclusion of any link does not imply
            endorsement by us of the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
          <p>
            We may revise these terms of service for its website at any time without notice.
            By using this website you are agreeing to be bound by the then current version of
            these terms of service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the
            laws and you irrevocably submit to the exclusive jurisdiction of the courts in that
            state or location.
          </p>
        </section>
      </div>
    </div>
  );
}