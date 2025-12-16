using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Point_of_Sale_System.Server.Migrations
{
    /// <inheritdoc />
    public partial class ReceiptFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentReceipts_Payments_OrganizationId",
                table: "AppointmentReceipts");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentReceipts_OrganizationId",
                table: "AppointmentReceipts");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentReceipts_PaymentId",
                table: "AppointmentReceipts",
                column: "PaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentReceipts_Payments_PaymentId",
                table: "AppointmentReceipts",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentReceipts_Payments_PaymentId",
                table: "AppointmentReceipts");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentReceipts_PaymentId",
                table: "AppointmentReceipts");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentReceipts_OrganizationId",
                table: "AppointmentReceipts",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentReceipts_Payments_OrganizationId",
                table: "AppointmentReceipts",
                column: "OrganizationId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
