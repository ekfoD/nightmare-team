using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Point_of_Sale_System.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedOnDeleteCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentReceipts_Payments_PaymentId",
                table: "AppointmentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Employees_EmployeeId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MenuServices_MenuServiceId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Organizations_OrganizationId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_DiscountReceipts_AppointmentReceipts_ReceiptId",
                table: "DiscountReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Discounts_Organizations_OrganizationId",
                table: "Discounts");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeOrganization_Employees_EmployeesId",
                table: "EmployeeOrganization");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeOrganization_Organizations_OrganizationsId",
                table: "EmployeeOrganization");

            migrationBuilder.DropForeignKey(
                name: "FK_Giftcards_Organizations_OrganizationId",
                table: "Giftcards");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_Organizations_OrganizationId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Discounts_DiscountId",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Taxes_TaxId",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServices_Discounts_DiscountId",
                table: "MenuServices");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServices_Organizations_OrganizationId",
                table: "MenuServices");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServiceTax_MenuServices_MenuServicesId",
                table: "MenuServiceTax");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServiceTax_Taxes_TaxesId",
                table: "MenuServiceTax");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_MenuItems_MenuItemId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_OrderItems_ParentOrderItemId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_OrderId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Variations_VariationId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Discounts_DiscountId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Organizations_OrganizationId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Giftcards_GiftcardId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Orders_OrderId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Organizations_OrganizationId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Taxes_Organizations_OrganizationId",
                table: "Taxes");

            migrationBuilder.DropForeignKey(
                name: "FK_TaxReceipts_AppointmentReceipts_ReceiptId",
                table: "TaxReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Variations_MenuItems_MenuItemId",
                table: "Variations");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentReceipts_Payments_PaymentId",
                table: "AppointmentReceipts",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Employees_EmployeeId",
                table: "Appointments",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MenuServices_MenuServiceId",
                table: "Appointments",
                column: "MenuServiceId",
                principalTable: "MenuServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Organizations_OrganizationId",
                table: "Appointments",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountReceipts_AppointmentReceipts_ReceiptId",
                table: "DiscountReceipts",
                column: "ReceiptId",
                principalTable: "AppointmentReceipts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Discounts_Organizations_OrganizationId",
                table: "Discounts",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeOrganization_Employees_EmployeesId",
                table: "EmployeeOrganization",
                column: "EmployeesId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeOrganization_Organizations_OrganizationsId",
                table: "EmployeeOrganization",
                column: "OrganizationsId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Giftcards_Organizations_OrganizationId",
                table: "Giftcards",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_Organizations_OrganizationId",
                table: "InventoryItems",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Discounts_DiscountId",
                table: "MenuItems",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Taxes_TaxId",
                table: "MenuItems",
                column: "TaxId",
                principalTable: "Taxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServices_Discounts_DiscountId",
                table: "MenuServices",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServices_Organizations_OrganizationId",
                table: "MenuServices",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServiceTax_MenuServices_MenuServicesId",
                table: "MenuServiceTax",
                column: "MenuServicesId",
                principalTable: "MenuServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServiceTax_Taxes_TaxesId",
                table: "MenuServiceTax",
                column: "TaxesId",
                principalTable: "Taxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_MenuItems_MenuItemId",
                table: "OrderItems",
                column: "MenuItemId",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_OrderItems_ParentOrderItemId",
                table: "OrderItems",
                column: "ParentOrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_OrderId",
                table: "OrderItems",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Variations_VariationId",
                table: "OrderItems",
                column: "VariationId",
                principalTable: "Variations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Discounts_DiscountId",
                table: "Orders",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Organizations_OrganizationId",
                table: "Orders",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Giftcards_GiftcardId",
                table: "Payments",
                column: "GiftcardId",
                principalTable: "Giftcards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Orders_OrderId",
                table: "Payments",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Organizations_OrganizationId",
                table: "Payments",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Taxes_Organizations_OrganizationId",
                table: "Taxes",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaxReceipts_AppointmentReceipts_ReceiptId",
                table: "TaxReceipts",
                column: "ReceiptId",
                principalTable: "AppointmentReceipts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Variations_MenuItems_MenuItemId",
                table: "Variations",
                column: "MenuItemId",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentReceipts_Payments_PaymentId",
                table: "AppointmentReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Employees_EmployeeId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MenuServices_MenuServiceId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Organizations_OrganizationId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_DiscountReceipts_AppointmentReceipts_ReceiptId",
                table: "DiscountReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Discounts_Organizations_OrganizationId",
                table: "Discounts");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeOrganization_Employees_EmployeesId",
                table: "EmployeeOrganization");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeOrganization_Organizations_OrganizationsId",
                table: "EmployeeOrganization");

            migrationBuilder.DropForeignKey(
                name: "FK_Giftcards_Organizations_OrganizationId",
                table: "Giftcards");

            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_Organizations_OrganizationId",
                table: "InventoryItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Discounts_DiscountId",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Taxes_TaxId",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServices_Discounts_DiscountId",
                table: "MenuServices");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServices_Organizations_OrganizationId",
                table: "MenuServices");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServiceTax_MenuServices_MenuServicesId",
                table: "MenuServiceTax");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuServiceTax_Taxes_TaxesId",
                table: "MenuServiceTax");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_MenuItems_MenuItemId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_OrderItems_ParentOrderItemId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_OrderId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Variations_VariationId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Discounts_DiscountId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Organizations_OrganizationId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Giftcards_GiftcardId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Orders_OrderId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Organizations_OrganizationId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Taxes_Organizations_OrganizationId",
                table: "Taxes");

            migrationBuilder.DropForeignKey(
                name: "FK_TaxReceipts_AppointmentReceipts_ReceiptId",
                table: "TaxReceipts");

            migrationBuilder.DropForeignKey(
                name: "FK_Variations_MenuItems_MenuItemId",
                table: "Variations");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentReceipts_Payments_PaymentId",
                table: "AppointmentReceipts",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Employees_EmployeeId",
                table: "Appointments",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MenuServices_MenuServiceId",
                table: "Appointments",
                column: "MenuServiceId",
                principalTable: "MenuServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Organizations_OrganizationId",
                table: "Appointments",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountReceipts_AppointmentReceipts_ReceiptId",
                table: "DiscountReceipts",
                column: "ReceiptId",
                principalTable: "AppointmentReceipts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Discounts_Organizations_OrganizationId",
                table: "Discounts",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeOrganization_Employees_EmployeesId",
                table: "EmployeeOrganization",
                column: "EmployeesId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeOrganization_Organizations_OrganizationsId",
                table: "EmployeeOrganization",
                column: "OrganizationsId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Giftcards_Organizations_OrganizationId",
                table: "Giftcards",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_Organizations_OrganizationId",
                table: "InventoryItems",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Discounts_DiscountId",
                table: "MenuItems",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Organizations_OrganizationId",
                table: "MenuItems",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Taxes_TaxId",
                table: "MenuItems",
                column: "TaxId",
                principalTable: "Taxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServices_Discounts_DiscountId",
                table: "MenuServices",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServices_Organizations_OrganizationId",
                table: "MenuServices",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServiceTax_MenuServices_MenuServicesId",
                table: "MenuServiceTax",
                column: "MenuServicesId",
                principalTable: "MenuServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuServiceTax_Taxes_TaxesId",
                table: "MenuServiceTax",
                column: "TaxesId",
                principalTable: "Taxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_MenuItems_MenuItemId",
                table: "OrderItems",
                column: "MenuItemId",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_OrderItems_ParentOrderItemId",
                table: "OrderItems",
                column: "ParentOrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_OrderId",
                table: "OrderItems",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Variations_VariationId",
                table: "OrderItems",
                column: "VariationId",
                principalTable: "Variations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Discounts_DiscountId",
                table: "Orders",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Organizations_OrganizationId",
                table: "Orders",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Appointments_AppointmentId",
                table: "Payments",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Giftcards_GiftcardId",
                table: "Payments",
                column: "GiftcardId",
                principalTable: "Giftcards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Orders_OrderId",
                table: "Payments",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Organizations_OrganizationId",
                table: "Payments",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Taxes_Organizations_OrganizationId",
                table: "Taxes",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TaxReceipts_AppointmentReceipts_ReceiptId",
                table: "TaxReceipts",
                column: "ReceiptId",
                principalTable: "AppointmentReceipts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Variations_MenuItems_MenuItemId",
                table: "Variations",
                column: "MenuItemId",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
