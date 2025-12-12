using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using Point_of_Sale_System.Server.Enums;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;


namespace Point_of_Sale_System.Server.Repositories
{
    public static class FakeDataSeeder
    {
        public static void Seed()
        {
            // The SAME ID your React frontend uses
            var fixedOrgId = Guid.Parse("8bbb7afb-d664-492a-bcd2-d29953ab924e");

            // -----------------------------
            //  ORGANIZATION
            // -----------------------------
            var org = new Organization
            {
                Id = fixedOrgId,
                Name = "Beauty Studio One",
                Address = "123 Main St",
                EmailAddress = "studio@example.com",
                PhoneNumber = "+37060000001",
                Plan = PlanEnum.service,
                Currency = CurrencyEnum.euro,
                Status = StatusEnum.active,
                Employees = new List<Employee>(),
                Appointments = new List<Appointment>(),
                Payments = new List<Payment>(),
                Orders = new List<Order>(),
                InventoryItems = new List<InventoryItem>(),
                MenuItems = new List<MenuItem>(),
                MenuServices = new List<MenuService>()
            };
            OrganizationRepository._organizations.Add(org);


            // -----------------------------
            //  EMPLOYEES
            // -----------------------------
            var emp1 = new Employee
            {
                Id = Guid.NewGuid(),
                Username = "Laura",
                AccessFlag = 1,
                Status = StatusEnum.active,
                Organizations = new List<Organization> { org },
                PasswordHash = "HASH",
                PasswordSalt = "SALT"
            };

            var emp2 = new Employee
            {
                Id = Guid.NewGuid(),
                Username = "Monika",
                AccessFlag = 1,
                Status = StatusEnum.active,
                Organizations = new List<Organization> { org },
                PasswordHash = "HASH",
                PasswordSalt = "SALT"
            };

            EmployeeRepository._employees.Add(emp1);
            EmployeeRepository._employees.Add(emp2);

            org.Employees.Add(emp1);
            org.Employees.Add(emp2);


            // -----------------------------
            // MENU SERVICES
            // -----------------------------
            var browService = new MenuService
            {
                Id = Guid.NewGuid(),
                Name = "Brow Shaping",
                Duration = 30,
                Price = 25,
                Description = "Professional eyebrow shaping service",
                OrganizationId = org.Id,
                Organization = org
            };

            var lashService = new MenuService
            {
                Id = Guid.NewGuid(),
                Name = "Lash Lift",
                Duration = 60,
                Price = 45,
                Description = "Enhance your natural lashes with a lash lift",
                OrganizationId = org.Id,
                Organization = org
            };

            MenuServiceRepository._services.Add(browService);
            MenuServiceRepository._services.Add(lashService);

            org.MenuServices.Add(browService);
            org.MenuServices.Add(lashService);


            // -----------------------------
            // APPOINTMENTS
            // -----------------------------
            var appt1 = new Appointment
            {
                Id = Guid.NewGuid(),
                OrganizationId = org.Id,
                EmployeeId = emp1.Id,
                MenuServiceId = browService.Id,

                StartTime = new DateTime(2025, 12, 11, 10, 0, 0),
                EndTime = new DateTime(2025, 12, 11, 10, 30, 0),
                CustomerName = "Greta",
                CustomerPhone = "+37060012345",
                ExtraInfo = "First time visit",

                Organization = org,
                Employee = emp1,
                MenuService = browService
            };

            var appt2 = new Appointment
            {
                Id = Guid.NewGuid(),
                OrganizationId = org.Id,
                EmployeeId = emp2.Id,
                MenuServiceId = lashService.Id,

                StartTime = new DateTime(2025, 12, 11, 11, 0, 0),
                EndTime = new DateTime(2025, 12, 11, 12, 0, 0),
                CustomerName = "Rita",
                CustomerPhone = "+37060054321",
                ExtraInfo = "",

                Organization = org,
                Employee = emp2,
                MenuService = lashService
            };

            AppointmentRepository._appointments.Add(appt1);
            AppointmentRepository._appointments.Add(appt2);

            org.Appointments.Add(appt1);
            org.Appointments.Add(appt2);
        }
    }
}
