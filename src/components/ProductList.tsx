import React from 'react';
import type { IProduct } from '../types/type';

interface ProductListProps {
    products: IProduct[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    onPrevPage: () => void;
    onNextPage: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    loading,
    error,
    page,
    totalPages,
    onPrevPage,
    onNextPage,
}) => {
    return (
        <div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <>
                    <table className="w-full border-collapse bg-white shadow rounded text-center">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Product Name</th>
                                <th className="border p-2">Stock On Hand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="border p-2">{product.productName}</td>
                                    <td className="border p-2">{product.stockOnHand}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={onPrevPage}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                            disabled={page === 1 || loading}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            onClick={onNextPage}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                            disabled={page === totalPages || loading}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductList;