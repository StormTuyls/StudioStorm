import { useState } from 'react';
import type { FormEvent } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Contact</h1>
        <p className="text-gray-600">
          Interesse in sportfotografie voor jouw team of evenement? Neem contact op!
        </p>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Bedankt voor je bericht! We nemen snel contact met je op.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Naam
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Onderwerp
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Bericht
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition font-medium"
        >
          Verstuur
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-light text-gray-900 mb-4">Volg Ons</h2>
        <div className="space-y-2 text-gray-600">
          <p>Email: <a href="mailto:info@studiostorm.nl" className="text-blue-600 hover:text-blue-800">info@studiostorm.nl</a></p>
          <p>Instagram: <a href="https://instagram.com/studiostorm.sports" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">@studiostorm.sports</a></p>
        </div>
      </div>
    </div>
  );
}
