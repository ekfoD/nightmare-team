using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Point_of_Sale_System.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedOrderStatusAndFixMenus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
