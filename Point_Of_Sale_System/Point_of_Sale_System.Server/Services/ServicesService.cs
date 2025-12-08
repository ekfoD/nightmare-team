

namespace Point_of_Sale_System.Server.Services
{
    public class ServicesService : IServicesService
    {
        private readonly AppDbContext _context;

        public ServicesService(AppDbContext context)
        {
            _context = context;
        }

        public Task<List<ServiceType>> GetAllAsync()
        {
            return _context.ServiceTypes.AsNoTracking().ToListAsync();
        }
    }

}