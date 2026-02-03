import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import React, { useState } from 'react';
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  subContent?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  title,
  content,
  subContent,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">{content}</p>
        {subContent && (
          <p className="text-gray-600 leading-relaxed mt-1">
            {subContent}
          </p>
        )}
      </div>
    </div>
  );
};

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-sky-300 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Get in <span className="text-white">Touch</span>
          </h1>
          <p className="mt-4 text-blue-900 max-w-2xl mx-auto">
            Have questions about child health? We're here to help you
            navigate your parenting journey with reliable information
            and support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Contact Information
            </h2>

            <ContactCard
              icon={<Mail size={24} />}
              title="Email Us"
              content="contact@konnyoeung.com"
              subContent="support@konnyoeung.com"
            />

            <ContactCard
              icon={<Phone size={24} />}
              title="Call Us"
              content="+855 23 XXX XXX"
              subContent="Monday - Friday: 8:00 AM - 5:00 PM"
            />

            <ContactCard
              icon={<MapPin size={24} />}
              title="Visit Us"
              content="Street XXX, Sangkat XXX"
              subContent="Khan Chamkarmon, Phnom Penh, Kingdom of Cambodia"
            />

            <ContactCard
              icon={<Clock size={24} />}
              title="Office Hours"
              content="Monday - Friday: 8:00 AM - 5:00 PM"
              subContent="Saturday: 9:00 AM - 1:00 PM | Sunday: Closed"
            />
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky-400 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky-400 focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky-400 focus:outline-none"
                  placeholder="+855 XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky-400 focus:outline-none"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky-400 focus:outline-none resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold py-4 rounded-lg transition-all ${isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-lg hover:-translate-y-0.5'
                  }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>


    </div>
  );
};

export default ContactUsPage;
