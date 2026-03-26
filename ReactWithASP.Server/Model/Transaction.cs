using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace ReactWithASP.Server.Model
{
    public class Transaction
    {
        public int Id { get; set; }

        public int StockId { get; set; }

        [JsonIgnore]
        public Stock? Stock { get; set; }

        public required string Type { get; set; }

        public int Quantity { get; set; }

        [Precision(18, 2)]
        public decimal Price { get; set; }

        public DateTime TransactionDate { get; set; }
    }
}
