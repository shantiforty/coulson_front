"use client";

import React from 'react';
import { TerminologyItem, } from '../type'; 
import '../app/home.css';
import '../app/edit.css';


interface TerminologyListProps {
  data: TerminologyItem[];
  handleDelete: (id: number) => void;
  showActions: boolean;
  handleEdit?: (item: TerminologyItem) => void; 
}


const TerminologyList: React.FC<TerminologyListProps> = ({ data, handleDelete, showActions, handleEdit }) => {


  return (
    <main>
      <ul className="terminology-list">
        {data.map(item => (
          <li key={item.GroupingsID} className="terminology-item">
            <div className="terminology-title">
              {item.Terminology}{' '}
              <span className="text-sm text-gray-500">({item.Acronym})</span>
            </div>
            <p className="terminology-description">{item.Description}</p>

            {showActions && (
              <div className="terminology-actions">
                <button onClick={()=> handleEdit && handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.GroupingsID)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default TerminologyList;