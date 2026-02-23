import { useEffect, useState } from 'react';
import './App.css';
import { type StockItem } from '../src/interface/StockItem';
import * as React from 'react';


function App() {
    // 株データを保存する「箱」を用意
    const [stocks, setStocks] = useState<StockItem[]>();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number | ''>('');

    const resetForm = () => {
        setCode('');
        setName('');
        setPrice('');
        setQuantity('');
    }

    // 画面が表示されたら1回だけ実行される処理
    useEffect(() => {
        populateStockData();
    }, []);

    // 表（テーブル）の中身を作る部分
    const contents = stocks === undefined
        ? <p><em>Loading... データを取得中...</em></p>
         
        :<table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>銘柄名</th>
                    <th>コード</th>
                    <th>保有数</th>
                    <th>平均取得単価</th>
                    <th>取得額合計</th>
                </tr>
            </thead>
            <tbody>
                {stocks.map(stock => (
                    <tr key={stock.id}>
                        <td>{stock.name}</td>
                        <td>{stock.code}</td>
                        <td>{stock.quantity} 株</td>
                        <td>{stock.price.toLocaleString()} 円</td>
                        <td>{stock.totalAmount.toLocaleString()} 円</td>
                    </tr>
                ))}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tabelLabel">資産管理</h1>
            <p>サーバーから取得した保有株リスト</p>
            <form onSubmit={handleAddStock} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <input type="text" placeholder="コード (例: 8267)" value={code} onChange={e => setCode(e.target.value)} required />
                <input type="text" placeholder="銘柄名 (例: イオン)" value={name} onChange={e => setName(e.target.value)} required />
                <input type="number" placeholder="取得単価" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} required />
                <input type="number" placeholder="保有数" value={quantity} onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} required />
                <button type="submit">追加する</button>
            </form>
            {contents}
        </div>
    );

    // サーバーからデータを取ってくる関数
    async function populateStockData() {
        // C#で作った 'stock' という住所にアクセス
        const response = await fetch('stocks');
        const data = await response.json();
        setStocks(data);
    }


    async function handleAddStock(e: React.FormEvent) {
        e.preventDefault(); // ボタンを押したときの画面のチカッ（リロード）を防ぐ

        const newStock = {
            code: code,
            name: name,
            price: Number(price),
            quantity: Number(quantity)
        };

        const response = await fetch('stocks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStock)
        })

        if (response.ok) {
            populateStockData();
            resetForm();
        } else {
            alert('登録に失敗しました。');
        }
    }
}

export default App;