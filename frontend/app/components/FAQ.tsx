import React from 'react';

export default function FAQ() {
  const dummyFAQs = Array(6).fill("");

  return (
    <section id="faq" className="py-12 px-6 md:px-12 bg-gray-100 border-t border-gray-400 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-black font-bold text-4xl mb-16">FAQ</h2>
        
        <div className="text-left w-full space-y-4">
          {dummyFAQs.map((_, i) => (
            <details key={i} className="group border border-black bg-white p-4">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-black outline-none">
                <span className="pr-6 font-mono">Question {i+1}?</span>
                <span className="text-xl">+</span>
              </summary>
              <div className="mt-4 border-t border-gray-300 pt-4">
                <p className="font-mono text-sm text-gray-700 bg-gray-50 p-2 border border-gray-200">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
