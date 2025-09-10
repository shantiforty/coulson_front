"use client";

import React, { useEffect, useState } from "react";
import "../contributor.css";
import { useRouter } from "next/navigation";
import { getContributors } from "../../services/api";
import Image from "next/image";

interface Contributor {
  id: number;
  name: string; 
  role: string;
  contribution: string;
  profile_image_url?: string;
}

const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    getContributors()
      .then((res) => {
        setContributors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching contributors:", err);
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading contributors...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="contributors-page">
      <h1 className="contributors-title">Project Contributors</h1>
      <button className="back-button" onClick={() => router.push("/home")}>
        Back to Home
      </button>
      <div className="contributors-layout">
        <div className="contributors-grid">
          {contributors.map((person) => (
            <div key={person.id} className="contributor-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.profile_image_url || '/default-avatar.png'}
                    alt={person.name}
                    className="contributor-avatar"
                  />

                </div>
                <div className="flip-card-back">
                  <h2 className="contributor-name">{person.name}</h2>
                  <p className="contributor-role">{person.role}</p>
                  <p className="contributor-description">{person.contribution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="devside">
          <h2>Project Coulson : Data Dictionary</h2>
          <p><strong>Tech Stack</strong></p>
          <ul>
            <li>React JS</li>
            <li>Express + Node.js</li>
            <li>SQL</li>
            <li>RESTful API</li>
          </ul>
          <p><strong>Developers/Supports</strong></p>
          <ul>
            {/* // eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src="/panda.jpg"
              alt="PANDA2025"
              width={80}
              height={80}
              className="devLogo"
            />

            <li>Jayson Jay Jadraque/Lance Samson - Fullstack Developer</li>
            <li>Michael Alindao – Backend Support</li>
            <li>Cristian Busa – UI/UX Support</li>
            <li>Sean Dimabogte – Network / System Support </li>
          </ul>
          <p><strong>©redits : Projects & Analytics 2025</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Contributors;