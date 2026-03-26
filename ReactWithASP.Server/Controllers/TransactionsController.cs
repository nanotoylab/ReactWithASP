using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Model;

namespace ReactWithASP.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransactionsController : ControllerBase
    {
        // ▼ 1. "手書きメモ帳(List)" を捨てて、"DBへの接続機能" を持つ変数を置く
        private readonly ApplicationDbContext _context;

        // ▼ 2. コンストラクタ（このクラスが作られる時に呼ばれる場所）
        // アプリ起動時に、自動的に DB接続機能(context) が渡されます（依存性注入）
        public TransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ▼ GET: データを取得する
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> Get()
        {
            // DBから全件取得してリストにする
            // "await" は「DBからデータが届くまで待つよ」という意味
            return await _context.Transactions.ToListAsync();
        }
    }
}