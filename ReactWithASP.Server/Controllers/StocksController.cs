using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Model;

namespace ReactWithASP.Server.Controllers
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
            return await _context.Stocks
                .Include(s => s.Transactions)
                .ToListAsync();
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

        // ▼ DELETE: データを削除する
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // 1. 指定されたIDの株をデータベースから探す
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null)
            {
                return NotFound(); // 見つからなければ 404 Not Found を返す
            }

            // 2. データベースに「削除予約」をする
            _context.Stocks.Remove(stock);

            // 3. 「保存ボタン」を押す（ここで実際にDELETEのSQLが発行される）
            await _context.SaveChangesAsync();

            return NoContent(); // 成功したけど返すデータは特にないよ、という意味の 204 NoContent を返す
        }

        // ▼ PUT: データを更新する
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Stock updatedStock)
        {
            // 1. まずデータベースから、更新したい古いデータを探し出す
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null)
            {
                return NotFound();
            }

            // 2. 古いデータを、Reactから送られてきた新しいデータで上書きする
            stock.Code = updatedStock.Code;
            stock.Name = updatedStock.Name;
            stock.Price = updatedStock.Price;
            stock.Quantity = updatedStock.Quantity;

            // 3. データベースに変更を保存する
            await _context.SaveChangesAsync();

            return NoContent(); // 成功（返すデータは特にない）
        }
    }
}