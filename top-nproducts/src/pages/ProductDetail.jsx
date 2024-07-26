import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://20.244.56.144/test/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="bg-sky-100 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">{product.productName}</h1>
      <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto flex flex-col">
        <p><strong>Company:</strong> {product.company}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Rating:</strong> {product.rating}</p>
        <p><strong>Discount:</strong> {product.discount}%</p>
        <p><strong>Availability:</strong> {product.availability}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
