// src/components/Table.tsx
import React, { useState, useEffect } from 'react';
import { DataTable, DataTableExpandedRows, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './Table.css';

interface UserData {
  id: string;
  firstName: string;
  surname: string;
  gender: string;
  skills: string;
  address: string;
  country: string;
  mobileno: string;
  email: string;
}

const Table: React.FC = () => {
  const [products, setProducts] = useState<UserData[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | undefined>(undefined);
  const navigate = useNavigate();

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('userFormData');
    if (stored) {
      const arr = JSON.parse(stored).filter((item: UserData) => item.id && String(item.id).trim());
      setProducts(arr);
    }
  }, []);

  // Save changes after row edit
  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const updatedProducts = [...products];
    const editedRow = e.newData as UserData;
    updatedProducts[e.index] = editedRow;
    setProducts(updatedProducts);
    localStorage.setItem('userFormData', JSON.stringify(updatedProducts));
  };

  // Delete row
  const handleDelete = (_: any, idx: number) => {
    const updated = products.filter((_, i) => i !== idx);
    setProducts(updated);
    localStorage.setItem('userFormData', JSON.stringify(updated));
  };

  // Header for row group
  const headerTemplate = (row: UserData): React.ReactNode => (
    <span className="ml-2 font-bold">Group: {row.id}</span>
  );

  // Footer for row group
  const footerTemplate = (row: UserData): React.ReactNode => {
    const count = products.filter((p) => p.id === row.id).length;
    return (
      <td colSpan={10} className="p-2">
        <div className="text-right font-bold">Total in Group: {count}</div>
      </td>
    );
  };

  // Inline editable input
  const textEditor = (options: ColumnEditorOptions): React.ReactNode => (
    <InputText value={options.value} onChange={(e) => options.editorCallback?.(e.target.value)} />
  );

  // Navigate to add new form
  const addNewData = () => {
    navigate('../');
  };

  return (
    <>
      <div className="bg-white d-flex justify-content-end">
        <Button label="Add New Data" severity="success" raised className="mr-1" onClick={addNewData} />
      </div>

      <div className="card">
        <DataTable
          value={products}
          editMode="row"
          dataKey="id"
          rowGroupMode="subheader"
          groupRowsBy="id"
          sortMode="single"
          sortField="id"
          sortOrder={1}
          stripedRows
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30]}
          onRowEditComplete={onRowEditComplete}
          expandableRowGroups
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
          rowGroupHeaderTemplate={headerTemplate}
          rowGroupFooterTemplate={footerTemplate}
        >
          {/* Dynamic Columns */}
          {[
            'id',
            'firstName',
            'surname',
            'gender',
            'skills',
            'address',
            'country',
            'mobileno',
            'email',
          ].map((field) => (
            <Column
              key={field}
              field={field}
              header={field.charAt(0).toUpperCase() + field.slice(1)}
              editor={(options) => textEditor(options)}
              sortable
              style={{ width: field === 'email' ? '20%' : '10%' }}
            />
          ))}

          {/* Row Editor */}
          <Column rowEditor headerStyle={{ width: '8rem' }} bodyStyle={{ textAlign: 'center' }} />

          {/* Delete Icon */}
          <Column
            body={(_, opts) => (
              <i className="pi pi-trash cursor-pointer" onClick={() => handleDelete(_, opts.rowIndex)} />
            )}
            headerStyle={{ width: '4rem', textAlign: 'center' }}
          />
        </DataTable>
      </div>
    </>
  );
};

export default Table;
