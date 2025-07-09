import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import ProductList from './components/ProductList';
import { type IProduct, type ApiError } from './types/type';

const App: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [sort, setSort] = useState<string>('');

  const itemsPerPage = 20;

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ data: IProduct[]; total: number }>(
        `http://localhost:5000/api/products?page=${page}&limit=${itemsPerPage}&sort=${sort}`
      );
      setProducts(response.data.data);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError({
        message: axiosError.response?.data.error || 'Failed to fetch products',
        status: axiosError.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, sort]);

  // Generate products
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/products/generate');
      setPage(1);
      await fetchProducts();
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError({
        message: axiosError.response?.data.error || 'Failed to generate products',
        status: axiosError.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  // Sort by Product_Name ascending
  const handleSortByName = () => {
    setSort('productName:asc');
    setPage(1);
  };

  // Sort by Stock_On_Hand descending
  const handleSortByStock = () => {
    setSort('stockOnHand:desc');
    setPage(1);
  };

  // Reduce stock by 2
  const handleReduceStock = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch('http://localhost:5000/api/products/reduce');
      await fetchProducts();
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError({
        message: axiosError.response?.data.error || 'Failed to reduce stock',
        status: axiosError.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  // Increase stock for even-numbered products
  const handleIncreaseEven = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch('http://localhost:5000/api/products/increase-even');
      await fetchProducts();
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError({
        message: axiosError.response?.data.error || 'Failed to increase stock for even-numbered products',
        status: axiosError.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Product Management</h1>
        <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
          <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            Generate 50 Products
          </button>
          <button
            onClick={handleSortByName}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            disabled={loading}
          >
            Sort by Name (Asc)
          </button>
          <button
            onClick={handleSortByStock}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            disabled={loading}
          >
            Sort by Stock (Desc)
          </button>
          <button
            onClick={handleReduceStock}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-yellow-300"
            disabled={loading}
          >
            Reduce Stock by 2
          </button>
          <button
            onClick={handleIncreaseEven}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-purple-300"
            disabled={loading}
          >
            Increase Even Stock by 2
          </button>
        </div>
        <ProductList
          products={products}
          loading={loading}
          error={error ? error.message : null}
          page={page}
          totalPages={totalPages}
          onPrevPage={() => page > 1 && setPage(page - 1)}
          onNextPage={() => page < totalPages && setPage(page + 1)}
        />
      </div>
    </div>
  );
};

export default App;