import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <form className="max-w-md">
        <input type="text" placeholder="Name" className="block w-full p-2 mb-2 border rounded" />
        <input type="email" placeholder="Email" className="block w-full p-2 mb-2 border rounded" />
        <textarea placeholder="Message" className="block w-full p-2 mb-2 border rounded"></textarea>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default ContactPage;