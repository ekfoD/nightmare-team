using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Point_of_Sale_System.Server.Migrations
{
    /// <inheritdoc />
    public partial class GiftcardsToApptReceipts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentReceipts_Payments_PaymentId",
                table: "AppointmentReceipts");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentReceipts_PaymentId",
                table: "AppointmentReceipts");

            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "AppointmentReceipts");

            migrationBuilder.AddColumn<string>(
                name: "Giftcards",
                table: "AppointmentReceipts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Giftcards",
                table: "AppointmentReceipts");

            migrationBuilder.AddColumn<Guid>(
                name: "PaymentId",
                table: "AppointmentReceipts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

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
    }
}
