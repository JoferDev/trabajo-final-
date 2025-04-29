import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import './ListStyles.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', { withCredentials: true });
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true });
        fetchProducts();
      } catch (err) {
        setError('Error al eliminar producto');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="table-container">
      <h2 className="list-header">Lista de Productos</h2>
      {error && <p className="error-message">{error}</p>}
      {!showForm && <button className="btn" onClick={() => setShowForm(true)}>Agregar Producto</button>}
      {showForm && (
        <ProductForm product={editingProduct} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}
      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Existencia</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.codproducto}>
            <td>{p.codigo}</td>
            <td>{p.descripcion}</td>
            <td>{p.precio}</td>
            <td>{p.existencia}</td>
            <td>
              <button className="btn" onClick={() => handleEdit(p)}>Editar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(p.codproducto)}>Eliminar</button>
            </td>
          </tr>
        ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsList;
