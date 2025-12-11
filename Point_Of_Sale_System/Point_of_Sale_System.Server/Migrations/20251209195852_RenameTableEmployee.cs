using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Point_of_Sale_System.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameTableEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Emploees_EmploeeId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Emploees_EmploeeId",
                table: "Schedules");

            migrationBuilder.DropTable(
                name: "EmploeeOrganization");

            migrationBuilder.DropTable(
                name: "Emploees");

            migrationBuilder.RenameColumn(
                name: "EmploeeId",
                table: "Schedules",
                newName: "EmployeeId");

            migrationBuilder.RenameIndex(
                name: "IX_Schedules_EmploeeId",
                table: "Schedules",
                newName: "IX_Schedules_EmployeeId");

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordSalt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AccessFlag = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeOrganization",
                columns: table => new
                {
                    EmployeesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrganizationsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeOrganization", x => new { x.EmployeesId, x.OrganizationsId });
                    table.ForeignKey(
                        name: "FK_EmployeeOrganization_Employees_EmployeesId",
                        column: x => x.EmployeesId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EmployeeOrganization_Organizations_OrganizationsId",
                        column: x => x.OrganizationsId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeOrganization_OrganizationsId",
                table: "EmployeeOrganization",
                column: "OrganizationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Employees_EmploeeId",
                table: "Appointments",
                column: "EmploeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Employees_EmployeeId",
                table: "Schedules",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Employees_EmploeeId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Employees_EmployeeId",
                table: "Schedules");

            migrationBuilder.DropTable(
                name: "EmployeeOrganization");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.RenameColumn(
                name: "EmployeeId",
                table: "Schedules",
                newName: "EmploeeId");

            migrationBuilder.RenameIndex(
                name: "IX_Schedules_EmployeeId",
                table: "Schedules",
                newName: "IX_Schedules_EmploeeId");

            migrationBuilder.CreateTable(
                name: "Emploees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AccessFlag = table.Column<int>(type: "int", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordSalt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emploees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmploeeOrganization",
                columns: table => new
                {
                    EmploeesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrganizationsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmploeeOrganization", x => new { x.EmploeesId, x.OrganizationsId });
                    table.ForeignKey(
                        name: "FK_EmploeeOrganization_Emploees_EmploeesId",
                        column: x => x.EmploeesId,
                        principalTable: "Emploees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EmploeeOrganization_Organizations_OrganizationsId",
                        column: x => x.OrganizationsId,
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmploeeOrganization_OrganizationsId",
                table: "EmploeeOrganization",
                column: "OrganizationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Emploees_EmploeeId",
                table: "Appointments",
                column: "EmploeeId",
                principalTable: "Emploees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Emploees_EmploeeId",
                table: "Schedules",
                column: "EmploeeId",
                principalTable: "Emploees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
