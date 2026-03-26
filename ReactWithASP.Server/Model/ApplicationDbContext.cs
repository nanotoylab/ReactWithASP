using Microsoft.EntityFrameworkCore;

namespace ReactWithASP.Server.Model
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Stock> Stocks { get; set; }

        public DbSet<Transaction> Transactions { get; set; }
    }
}
