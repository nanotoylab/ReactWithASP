namespace ReactWithASP.Server
{
    public class StockItem
    {
        public int Id { get; set; }
        public string Name { get; set; }   // 銘柄名
        public int Code { get; set; }      // 証券コード
        public int Quantity { get; set; }  // 保有数
        public decimal Price { get; set; } // 平均取得単価

        // 取得額合計（単価×数）
        public decimal TotalAmount => Price * Quantity;
    }
}