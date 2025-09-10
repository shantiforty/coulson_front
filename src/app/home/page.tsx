"use client";

import React, { useEffect, useState, ChangeEvent } from 'react';
import { getTerminologies, deleteTerminology, updateTerminology, createTerminology } from '../../services/api';
import AdminNavbar from '../../components/adminNavbar';
import HomeNavbar from '../../components/homeNavbar';
import TerminologyList from '../../components/terminologyList';
import { useRouter } from 'next/navigation';
import { TerminologyItem } from '../../type';
import '../home.css';
import { createPortal } from 'react-dom';

const Home: React.FC = () => {
  const [data, setData] = useState<TerminologyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [roleFlag, setRoleFlag] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const terminologiesPerPage = 10;

  // edit State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TerminologyItem | null>(null);
  const [form, setForm] = useState<Omit<TerminologyItem, 'GroupingsID'>>({
    Acronym: '',
    Terminology: '',
    Description: '',
  });

  // add modal state
  const [isAddmodalOpen, setIsAddModalOpen] = useState(false);
  const [newform, setNewForm] = useState({
    Acronym: '',
    Terminology: '',
    Description: '',
  });

  const handleNewChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewForm({ ...newform, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new terminology:", newform);

    try {
      await createTerminology(newform);
      console.log("Terminology added successfully!");

      setIsAddModalOpen(false);
      setNewForm({ Acronym: '', Terminology: '', Description: '' });
      fetchData();
    } catch (error) {
      console.error("Failed to add terminology:", error);
    }
  };

const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    const res = await getTerminologies();
    const items: TerminologyItem[] = res.data;
    setData(
      items.map((item) => ({
        GroupingsID: item.GroupingsID ?? 0,
        Terminology: item.Terminology,
        Acronym: item.Acronym ?? null,
        Description: item.Description ?? "",
      }))
    );
  } catch (error) {
    console.error("Fetch error:", error);
    setError("Failed to fetch data.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const role = localStorage.getItem('roleFlag');

    setUsername(storedUsername);
    setPassword(storedPassword);
    setRoleFlag(role ? parseInt(role, 10) : null);

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('roleFlag');
    localStorage.removeItem('password');
    router.push('/login');
  };

  const handleDelete = async (id: number) => {
  try {
    if (roleFlag !== 1) {
      console.error("You do not have permission to delete this item.");
      return;
    }

    if (username && password) {
      await deleteTerminology(id);
    } else {
      console.error("Missing credentials for this action.");
      return;
    }

    console.log("Item deleted successfully!");
    fetchData();
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { status: number; statusText: string } };
      if (err.response?.status === 403) {
        console.error("You do not have permission to perform this action.");
      } else if (err.response?.status === 404) {
        console.error("Item not found");
      } else {
        console.error(`Error: ${err.response?.statusText}`);
      }
    } else {
      console.error("An unexpected error occurred", error);
    }
  }
};


  const handleEdit = (item: TerminologyItem) => {
    setEditingItem(item);
    setForm(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await updateTerminology(String(editingItem.GroupingsID), {
        ...form,
        Acronym: form.Acronym ?? ''
      });
      console.log('Terminology updated successfully!');
      handleCloseModal();
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Failed to update terminology:', error);
      console.error('Failed to update terminology. Check your permissions.');
    }
  };

  const filteredData = data.filter(item =>
    (item.Terminology || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.Acronym || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTerminology = currentPage * terminologiesPerPage;
  const indexOfFirstTerminology = indexOfLastTerminology - terminologiesPerPage;
  const currentTerminologies = filteredData.slice(indexOfFirstTerminology, indexOfLastTerminology);

  const totalPages = Math.ceil(filteredData.length / terminologiesPerPage);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const isAdmin = roleFlag === 1;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="home-container">
        {isAdmin ? (
          <AdminNavbar
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            handleLogout={handleLogout}
            username={username || ''}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        ) : (
          <HomeNavbar
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            handleLogout={handleLogout}
            username={username || ''}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        )}
        <div className="main-content">
          <TerminologyList
            data={currentTerminologies}
            handleDelete={handleDelete}
            showActions={isAdmin}
            handleEdit={handleEdit}
          />
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen &&
        createPortal(
          <div className="modal-backdrop">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
              <form onSubmit={handleSubmit} className="edit-form">
                <h2 className="form-title">Edit Terminology</h2>
                <label>
                  Acronym:
                  <input
                    type="text"
                    name="Acronym"
                    value={form.Acronym || ''}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
                <label>
                  Terminology:
                  <input
                    type="text"
                    name="Terminology"
                    value={form.Terminology}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="Description"
                    value={form.Description}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </label>
                <div className="form-buttons">
                  <button type="submit" className="form-button primary-button">Update</button>
                  <button type="button" onClick={handleCloseModal}
                    className="form-button secondary-button">Cancel</button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {isAddmodalOpen && createPortal(
        <div className="modal-backdrop">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <form onSubmit={handleAddSubmit} className="edit-form">
              <h2 className="form-title">Add New Terminology</h2>
              <label>
                Acronym:
                <input
                  type="text"
                  name="Acronym"
                  value={newform.Acronym}
                  onChange={handleNewChange}
                  className="form-input"
                />
              </label>
              <label>
                Terminology:
                <input
                  type="text"
                  name="Terminology"
                  value={newform.Terminology}
                  onChange={handleNewChange}
                  required
                  className="form-input"
                />
              </label>
              <label>
                Description:
                <textarea
                  name="Description"
                  value={newform.Description}
                  onChange={handleNewChange}
                  className="form-textarea"
                />
              </label>
              <div className="form-buttons">
                <button type="submit" className="form-button primary-button">Add</button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} 
                className="form-button secondary-button">Cancel</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </>
  );
};

export default Home;

