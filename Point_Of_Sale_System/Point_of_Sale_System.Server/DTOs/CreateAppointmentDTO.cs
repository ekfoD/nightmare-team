namespace Point_of_Sale_System.Server.DTOs;
public class CreateAppointmentDto
{
    public Guid WorkerId { get; set; }
    public string Date { get; set; }
    public string Time { get; set; }
    public string Service { get; set; }
    public string ExtraInfo { get; set; }
}
