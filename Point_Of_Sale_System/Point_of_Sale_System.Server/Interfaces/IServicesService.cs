namespace Point_of_Sale_System.Server.Interfaces
{
    public interface IServicesService
    {
        Task<List<ServiceType>> GetAllAsync();
    }
}
