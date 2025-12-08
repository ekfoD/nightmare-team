using Point_of_Sale_System.Server.DTOs;
using Point_of_Sale_System.Server.Models;
namespace Point_of_Sale_System.Server.Mappers
{
    public static class AppointmentMapper
    {
        public static Schedule ToModel(CreateAppointmentDto dto, Employee employee)
        {
            return new Schedule
            {
                Employee = employee,
                EmployeeId = employee.Id,

                Date = dto.Date,
                StartTime = dto.StartTime,

                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,

                Service = dto.Service,
                ExtraInfo = dto.ExtraInfo
            };
        }

        public static AppointmentDto ToDto(Schedule s)
        {
            return new AppointmentDto
            {
                Id = s.Id,
                EmployeeId = s.EmployeeId,

                Date = s.Date,
                StartTime = s.StartTime,

                CustomerName = s.CustomerName,
                CustomerPhone = s.CustomerPhone,

                Service = s.Service,
                ExtraInfo = s.ExtraInfo
            };
        }
    }
}