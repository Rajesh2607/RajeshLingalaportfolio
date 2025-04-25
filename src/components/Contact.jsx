import emailjs from 'emailjs-com';
import { useRef } from 'react';
import { Send } from 'lucide-react';

const ContactSection = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_k3a4wvj',       // Replace with your EmailJS Service ID
      'template_xtbfekn',      // Replace with your EmailJS Template ID
      form.current,
      '0aPQCkeqkbL9-6ft_'        // Replace with your EmailJS Public Key
    ).then(
      (result) => {
        alert('Message sent successfully!');
        form.current.reset();
      },
      (error) => {
        alert('Failed to send the message, please try again.');
        console.error(error.text);
      }
    );
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a192f] text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Contact Me
          </span>
        </h2>
        <form ref={form} onSubmit={sendEmail} className="grid gap-6 bg-[#112240] p-8 rounded-2xl shadow-2xl border border-white/10">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="p-3 rounded-md bg-[#0a192f] text-white border border-gray-600 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="p-3 rounded-md bg-[#0a192f] text-white border border-gray-600 focus:outline-none"
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            required
            className="p-3 rounded-md bg-[#0a192f] text-white border border-gray-600 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#17c0f8] hover:bg-[#1cb5e0] text-[#0a192f] font-semibold py-3 px-6 rounded-full transition-all duration-300"
          >
            <Send size={20} />
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;