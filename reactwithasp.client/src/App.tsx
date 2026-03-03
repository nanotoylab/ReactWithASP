import { useEffect, useState } from 'react';
import './App.css';
import { type StockItem } from '../src/interface/StockItem';
import * as React from 'react';
import {
    Container, Typography, Box, Paper, TextField, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function App() {
    // 株データを保存する「箱」を用意
    const [stocks, setStocks] = useState<StockItem[]>();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [editingId, setEditingId] = useState<number | null>(null);

    // サーバーからデータを取ってくる関数
    async function populateStockData() {
        // C#で作った 'stock' という住所にアクセス
        const response = await fetch('stocks');
        const data = await response.json();
        setStocks(data);
    }

    // 画面が表示されたら1回だけ実行される処理
    useEffect(() => {
        populateStockData();
    }, []);

    const resetForm = () => {
        setCode('');
        setName('');
        setPrice('');
        setQuantity('');
        setEditingId(null);
    }

    const handleEditClick = (stock: StockItem) => {
        setCode(stock.code);
        setName(stock.name);
        setPrice(stock.price);
        setQuantity(stock.quantity);
        setEditingId(stock.id);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // ボタンを押したときの画面のチカッ（リロード）を防ぐ

        const stockData = {
            code: code,
            name: name,
            price: Number(price),
            quantity: Number(quantity)
        };

        if (editingId) {
            // ==========================================
            // ▼ 更新（PUT）モード
            // ==========================================
            const response = await fetch(`stocks/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // idを含めた完全なデータにして送る
                body: JSON.stringify({ id: editingId, ...stockData })
            });

            if (response.ok) {
                populateStockData();
                resetForm(); // 更新が終わったらフォームを空にして新規登録モードに戻す
            } else {
                alert('更新に失敗しました。');
            }
        } else {
            // ==========================================
            // ▼ 新規登録（POST）モード（今までの処理と同じ）
            // ==========================================
            const response = await fetch('stocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stockData)
            });

            if (response.ok) {
                populateStockData();
                resetForm();
            } else {
                alert('登録に失敗しました。');
            }
        }
    }


    // ▼ 引数を id (数値) から targetStock (Stockオブジェクト全体) に変更
    async function handleDeleteStock(targetStock: StockItem) {
        // オブジェクト全体を受け取ったので、name を使って親切なメッセージにできる！
        if (!window.confirm(`本当に「${targetStock.name}」を削除しますか？`)) {
            return;
        }

        // C#のサーバーに送るときは、今まで通り id だけを取り出してURLにくっつける
        const response = await fetch(`stocks/${targetStock.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            populateStockData();
        } else {
            alert('削除に失敗しました。');
        }
    }

    const summary = {
        stockCount: stocks?.length || 0,
        totalInvestment: (stocks || []).reduce((sum, stock) => sum + (stock.price * stock.quantity), 0)
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                資産管理ダッシュボード
            </Typography>

            {/* ▼ 1. ダッシュボード部分 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Paper sx={{ p: 3, flex: 1, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">保有銘柄数</Typography>
                    <Typography variant="h3" color="primary">{summary.stockCount} <Typography component="span" variant="h6">銘柄</Typography></Typography>
                </Paper>
                <Paper sx={{ p: 3, flex: 1, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight="bold">合計取得額</Typography>
                    <Typography variant="h3" color="primary">{summary?.totalInvestment?.toLocaleString()} <Typography component="span" variant="h6">円</Typography></Typography>
                </Paper>
            </Box>

            {/* ▼ 2. 入力・編集フォーム部分 */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }} elevation={2}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    {editingId !== null ? '✏️ 銘柄を編集' : '➕ 新しい銘柄を登録'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField label="コード (例: 8267)" value={code} onChange={e => setCode(e.target.value)} required size="small" />
                    <TextField label="銘柄名 (例: イオン)" value={name} onChange={e => setName(e.target.value)} required size="small" />
                    <TextField label="取得単価" type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} required size="small" />
                    <TextField label="保有数" type="number" value={quantity} onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} required size="small" />

                    <Button variant="contained" color={editingId !== null ? "success" : "primary"} type="submit" sx={{ height: '40px' }}>
                        {editingId !== null ? '更新する' : '追加する'}
                    </Button>

                    {editingId !== null && (
                        <Button variant="outlined" color="inherit" onClick={resetForm} sx={{ height: '40px' }}>
                            キャンセル
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* ▼ 3. テーブル（一覧）部分 */}
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>銘柄名</strong></TableCell>
                            <TableCell><strong>コード</strong></TableCell>
                            <TableCell align="right"><strong>保有数</strong></TableCell>
                            <TableCell align="right"><strong>平均取得単価</strong></TableCell>
                            <TableCell align="right"><strong>取得額合計</strong></TableCell>
                            <TableCell align="center"><strong>操作</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks?.map(stock => (
                            <TableRow key={stock.id} hover>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell>{stock.code}</TableCell>
                                <TableCell align="right">{stock.quantity} 株</TableCell>
                                <TableCell align="right">{stock.price.toLocaleString()} 円</TableCell>
                                <TableCell align="right">{(stock.price * stock.quantity).toLocaleString()} 円</TableCell>
                                <TableCell align="center">
                                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(stock)} sx={{ mr: 1 }}>
                                        編集
                                    </Button>
                                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteStock(stock)}>
                                        削除
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default App;