import React, { useState } from "react";
import './Contact.css';
import Navbar from "./Navbar";
const Contact_us = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");

    const formData = new FormData(event.target);
    formData.append("access_key", "ab7b136d-8463-4b4d-a941-2afad0571b06");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully ✅");
      event.target.reset();
    } else {
      console.error("Error:", data);
      setResult("Error ❌");
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
    <form onSubmit={onSubmit}>
      <h1 className="title">Contact us</h1>
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message....." required></textarea>
      <button type="submit">Submit Form</button>
      <span>{result}</span>
    </form>
    </div>
  );
};

export default Contact_us;
