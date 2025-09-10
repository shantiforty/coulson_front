"use client";

import React, { useState } from "react";
import { createTicket } from "../../services/api";
import "../ticketing.css";
import { useRouter } from 'next/navigation';



const Ticketing: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    urgency: "Low",
    description: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('ticket created');
    try {
      await createTicket(form);
      setMessage('Ticket submitted successfully!');
      setForm({ name: '', email: '', department: '', urgency: '', description: '' });
    } catch (error: unknown) {
      console.error(error);
      setMessage('Failed to submit ticket. Please try again.');
    }
  };

  return (
    <div className="ticketing-page">
      <h1 className="ticketing-title">Submit a Ticket</h1>
      {message && <p className="message">{message}</p>}
      <button className="back-btn" onClick={() => router.push("/home")}>
        Back to Home
      </button>

      <form onSubmit={handleSubmit} className="ticket-form">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />


        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <label htmlFor="urgency">Urgency:</label>
        <select
          id="urgency"
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <label htmlFor="description">Brief Description:</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-button">
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default Ticketing;