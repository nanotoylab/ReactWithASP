using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReactWithASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameSymbolToCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Symbol",
                table: "Stocks",
                newName: "Code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Code",
                table: "Stocks",
                newName: "Symbol");
        }
    }
}
