using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server;
using ReactWithASP.Server.Data;

namespace MyPortfolio.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StocksController : ControllerBase
    {
        // ▼ 1. "手書きメモ帳(List)" を捨てて、"DBへの接続機能" を持つ変数を置く
        private readonly ApplicationDbContext _context;

        // ▼ 2. コンストラクタ（このクラスが作られる時に呼ばれる場所）
        // アプリ起動時に、自動的に DB接続機能(context) が渡されます（依存性注入）
        public StocksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ▼ GET: データを取得する
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stock>>> Get()
        {
            // DBから全件取得してリストにする
            // "await" は「DBからデータが届くまで待つよ」という意味
            return await _context.Stocks.ToListAsync();
        }

        // ▼ POST: データを登録する
        [HttpPost]
        public async Task<IActionResult> Post(Stock stock)
        {
            // 1. DBに「追加予約」をする
            _context.Stocks.Add(stock);

            // 2. 「保存ボタン」を押す（ここで初めてSQLが発行されて保存される）
            await _context.SaveChangesAsync();

            // 3. 保存された最新のデータを返す
            return CreatedAtAction(nameof(Get), new { id = stock.Id }, stock);
        }
    }
}