// src/components/homeNavbar.tsx
"use client";

import React, { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import '../app/home.css';
import Image from 'next/image';

interface HomeNavbarProps {
  searchTerm: string;
  setSearchTerm: (e: ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  username: string;
  onAddClick?: () => void; 
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({
  searchTerm,
  setSearchTerm,
  handleLogout,
  onAddClick,
}) => {
  const router = useRouter();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Image
          src="/favicon-panda.ico"
          alt="Logo"
          width={32}
          height={32}
          className="navbar-logo"
        />
        <h1>Project Coulson: Data Dictionary</h1>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search terminology..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="search-input"
        />
      </div>

      <div className="navbar-right">
        <button onClick={onAddClick} className="btn btn-primary">
          Add New
        </button>
        <button onClick={() => router.push('/ticketing')} className="btn btn-primary">
          Ticketing
        </button>
        <button onClick={() => router.push('/contributors')} className="btn btn-primary">
          Contributors
        </button>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
    </header>
  );
};

export default HomeNavbar;