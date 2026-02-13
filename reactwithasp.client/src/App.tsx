import { useEffect, useState } from 'react';
import './App.css';
import { type StockItem } from '../src/interface/StockItem';


function App() {
    // 株データを保存する「箱」を用意
    const [stocks, setStocks] = useState<StockItem[]>();

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
            <p>サーバー(C#)から取得した保有株リストです。</p>
            {contents}
        </div>
    );

    // サーバーからデータを取ってくる関数
    async function populateStockData() {
        // C#で作った 'stock' という住所にアクセス
        const response = await fetch('stock');
        const data = await response.json();
        setStocks(data);
    }
}

export default App;