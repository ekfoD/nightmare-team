using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Models.Entities.Business;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;
using Point_of_Sale_System.Server.Models.Entities.OrdersAndPayments;
using Point_of_Sale_System.Server.Models.Entities.ServiceBased;
using System;

namespace Point_of_Sale_System.Server.Models.Data
{
    public class PoSDbContext : DbContext
    {
        public PoSDbContext(DbContextOptions<PoSDbContext> options)
        : base(options)
        {
        }

        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<SuperAdmin> SuperAdmins { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Giftcard> Giftcards { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Tax> Taxes { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }    
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Variation> Variations { get; set; }
        public DbSet<MenuService> MenuServices { get; set; }
        public DbSet<AppointmentReceipt> AppointmentReceipts { get; set; }
        public DbSet<TaxReceipt> TaxReceipts { get; set; }
        public DbSet<DiscountReceipt> DiscountReceipts { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}
