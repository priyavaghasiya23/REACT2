import React, { useEffect, useState } from 'react';

export default function Products() {
    const [data, setData] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('http://localhost:3007/productJson')
            .then((res) => res.json())
            .then((fetchData) => {
                setData(fetchData);
                setSorted(fetchData);
            });
    }, []);

    const handleSort = (order) => {
        const sortedProducts = [...data].sort((a, b) => {
            return order === 'lowToHigh' ? a.price - b.price : b.price - a.price;
        });
        setSorted(sortedProducts);
    };

    const filteredProducts = sorted.filter((el) =>
        el.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>🛍 Products</h1>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleSort('lowToHigh')}>Price: Low to High</button>
                <button onClick={() => handleSort('highToLow')} style={{ marginLeft: '10px' }}>
                    Price: High to Low
                </button>
            </div>

            {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((el) => (
                    <div key={el.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                        <p><strong>ID:</strong> {el.id}</p>
                        <p><strong>Title:</strong> {el.title}</p>
                        <p><strong>Price:</strong> ${el.price}</p>
                        <p><strong>Description:</strong> {el.description}</p>
                        <p><strong>Category:</strong> {el.category}</p>
                    </div>
                ))
            ) : (
                <p>No products found 🔍</p>
            )}
        </div>
    );
}