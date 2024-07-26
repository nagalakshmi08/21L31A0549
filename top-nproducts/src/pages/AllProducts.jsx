import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    company: 'AMZ',
    category: 'Laptop',
    minPrice: 1,
    maxPrice: 10000,
    top: 10,
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${filters.company}/categories/${filters.category}/products`, {
          params: {
            top: filters.top,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-sky-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">Top Products</h1>
      <div className="flex flex-col justify-center md:justify-around mb-4">
        <label className="flex flex-col items-center">
          Company:
          <select name="company" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="AMZ">AMZ</option>
            <option value="FLP">FLP</option>
            <option value="SNP">SNP</option>
            <option value="HYN">HYN</option>
            <option value="AZO">AZO</option>
          </select>
        </label>
        <label className="flex flex-col items-center">
          Category:
          <select name="category" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="TV">TV</option>
            <option value="Earphone">Earphone</option>
            {/* Add more categories as needed */}
          </select>
        </label>
        <label className="flex flex-col items-center">
          Min Price:
          <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} className="p-2 border rounded" />
        </label>
        <label className="flex flex-col items-center">
          Max Price:
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="p-2 border rounded" />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.productId} className="bg-white p-4 rounded shadow-md flex flex-col">
            <h2 className="text-xl font-bold text-sky-800">{product.productName}</h2>
            <div className='flex flex-col'>
            <p>Price: ${product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}%</p>
            <p>Availability: {product.availability}</p>
            </div>
            <a href={`/product/${product.productId}`} className="text-sky-600 underline">View Details</a>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="p-2 bg-sky-600 text-white rounded">Previous</button>
        <button onClick={() => setPage((prev) => prev + 1)} className="p-2 bg-sky-600 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default AllProducts;
