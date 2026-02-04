using Microsoft.AspNetCore.Mvc;

namespace ReactWithASP.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StockController : ControllerBase
    {
        private readonly ILogger<StockController> _logger;

        public StockController(ILogger<StockController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<StockItem> Get()
        {
            _logger.LogInformation("読み込み開始");

            // 「資産データベース（仮）」
            return new List<StockItem>
            {
                new StockItem { Id = 1, Code = 1111, Name = "株A", Quantity = 800, Price = 980 },
                new StockItem { Id = 2, Code = 2222, Name = "株B", Quantity = 100, Price = 1600 },
                new StockItem { Id = 3, Code = 3333, Name = "株C", Quantity = 100, Price = 2000 },
                new StockItem { Id = 4, Code = 4444, Name = "株D", Quantity = 100, Price = 1200 },
                new StockItem { Id = 5, Code = 5555, Name = "株E", Quantity = 100, Price = 1300 },
                new StockItem { Id = 6, Code = 6666, Name = "株F", Quantity = 0, Price = 0 }
            };
        }
    }
}