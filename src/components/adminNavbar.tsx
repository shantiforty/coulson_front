// src/components/adminNavbar.tsx
"use client";

import React, { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import '../app/home.css';
import Image from 'next/image';

interface AdminNavbarProps {
  searchTerm: string;
  setSearchTerm: (e: ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  username: string;
  onAddClick?: () => void; 
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  searchTerm,
  setSearchTerm,
  handleLogout,
  onAddClick,
}) => {
  const router = useRouter();

  return (
    <header className="navbaradmin">
      <div className="navbar-left">
        <Image
          src="/favicon-panda.ico"
          alt="Logo"
          width={42}
          height={32}
          className="navbar-logo"
        />
        <h1>ADMIN VIEW</h1>
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
        {/* Replaced welcome message with buttons */}
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

export default AdminNavbar;