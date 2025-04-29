import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LaboratoriosList = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [form, setForm] = useState({ laboratorio: '', direccion: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLaboratorios();
  }, []);

  const fetchLaboratorios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/laboratorios');
      setLaboratorios(res.data);
    } catch (error) {
      console.error('Error fetching laboratorios:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.laboratorio || !form.direccion) {
      alert('Por favor, completa todos los campos');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/laboratorios/${editingId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/laboratorios', form);
      }
      setForm({ laboratorio: '', direccion: '' });
      setEditingId(null);
      fetchLaboratorios();
    } catch (error) {
      console.error('Error saving laboratorio:', error);
    }
  };

  const handleEdit = (lab) => {
    setForm({ laboratorio: lab.laboratorio, direccion: lab.direccion });
    setEditingId(lab.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este laboratorio?')) {
      try {
        await axios.delete(`http://localhost:5000/api/laboratorios/${id}`);
        fetchLaboratorios();
      } catch (error) {
        console.error('Error deleting laboratorio:', error);
      }
    }
  };

  return (
    <div>
      <h2>Laboratorios</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="laboratorio"
          placeholder="Nombre del laboratorio"
          value={form.laboratorio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
        {editingId && <button type="button" onClick={() => { setForm({ laboratorio: '', direccion: '' }); setEditingId(null); }}>Cancelar</button>}
      </form>
      <ul>
        {laboratorios.map((lab) => (
          <li key={lab.id}>
            {lab.laboratorio} - {lab.direccion}{' '}
            <button onClick={() => handleEdit(lab)}>Editar</button>{' '}
            <button onClick={() => handleDelete(lab.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LaboratoriosList;
