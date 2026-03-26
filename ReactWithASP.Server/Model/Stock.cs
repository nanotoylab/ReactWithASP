namespace ReactWithASP.Server.Model
{
    public class Stock
    {
        public int Id { get; set; } // DBには必ずIDが必要です！

        public string Code { get; set; } = string.Empty; // コード (例: 7203)

        public string Name { get; set; } = string.Empty;   // 銘柄名

        public decimal Price { get; set; }    // 株価 (金額は decimal が適しています)

        public int Quantity { get; set; }     // 保有数

        // C#で計算プロパティを作る場合（DBには保存されませんが便利です）
        public decimal TotalAmount => Price * Quantity;

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
