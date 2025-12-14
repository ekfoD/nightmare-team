namespace Point_of_Sale_System.Server.DTOs
{
    public class PagedResponseDTO<T>
    {
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public List<T> Items { get; set; } = new();
    }
}
