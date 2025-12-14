using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Point_of_Sale_System.Server.Migrations
{
    /// <inheritdoc />
    public partial class TaxToTaxes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuServices_Taxes_TaxId",
                table: "MenuServices");

            migrationBuilder.DropIndex(
                name: "IX_MenuServices_TaxId",
                table: "MenuServices");

            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "MenuServices");

            migrationBuilder.CreateTable(
                name: "MenuServiceTax",
                columns: table => new
                {
                    MenuServicesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaxesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuServiceTax", x => new { x.MenuServicesId, x.TaxesId });
                    table.ForeignKey(
                        name: "FK_MenuServiceTax_MenuServices_MenuServicesId",
                        column: x => x.MenuServicesId,
                        principalTable: "MenuServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MenuServiceTax_Taxes_TaxesId",
                        column: x => x.TaxesId,
                        principalTable: "Taxes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuServiceTax_TaxesId",
                table: "MenuServiceTax",
                column: "TaxesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuServiceTax");

            migrationBuilder.AddColumn<Guid>(
                name: "TaxId",
                table: "MenuServices",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_MenuServices_TaxId",
                table: "MenuServices",
                column: "TaxId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServices_Taxes_TaxId",
                table: "MenuServices",
                column: "TaxId",
                principalTable: "Taxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
