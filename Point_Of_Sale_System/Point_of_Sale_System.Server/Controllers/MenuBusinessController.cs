using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Point_of_Sale_System.Server.Interfaces;
using Point_of_Sale_System.Server.Models.Entities.MenuBased;

namespace Point_of_Sale_System.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuBusinessController : ControllerBase
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IVariationRepository _variationRepository;

        public MenuBusinessController(IMenuRepository menuRepository, IVariationRepository variationRepository)
        {
            _menuRepository = menuRepository;
            _variationRepository = variationRepository;
        }

        // ==========================================
        // MenuItem CRUD
        // ==========================================

        // Get all menu items for a specific business
        [HttpGet("MenuItems/{businessId}")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems(Guid businessId)
        {
            var menuItems = await _menuRepository.GetMenuItemsAsync(businessId);
            return Ok(menuItems);
        }

        // Get a specific menu item
        [HttpGet("MenuItems/{id}")]
        public async Task<ActionResult<MenuItem>> GetMenuItem(Guid id)
        {
            var menuItem = await _menuRepository.GetMenuItemAsync(id);

            if (menuItem == null)
            {
                return NotFound();
            }

            return menuItem;
        }

        // Create a new menu item
        [HttpPost("MenuItems/{businessId}")]
        public async Task<ActionResult<MenuItem>> PostMenuItem(Guid businessId, MenuItem menuItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _menuRepository.AddMenuItemAsync(menuItem);

            return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.Id }, menuItem);
        }

        // Update a menu item
        [HttpPut("MenuItems/{id}")]
        public async Task<IActionResult> PutMenuItem(Guid id, MenuItem menuItem)
        {
            if (id != menuItem.Id)
            {
                return BadRequest();
            }

            try
            {
                await _menuRepository.UpdateMenuItemAsync(menuItem);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _menuRepository.MenuItemExistsAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Delete a menu item
        [HttpDelete("MenuItems/{id}")]
        public async Task<IActionResult> DeleteMenuItem(Guid id)
        {
            var exists = await _menuRepository.MenuItemExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            await _menuRepository.DeleteMenuItemAsync(id);

            return NoContent();
        }

        // ==========================================
        // Variation CRUD
        // ==========================================

        // Get all variations for a specific menu item
        [HttpGet("Variations/{menuItemId}")]
        public async Task<ActionResult<IEnumerable<Variation>>> GetVariations(Guid menuItemId)
        {
            var variations = await _variationRepository.GetVariationsAsync(menuItemId);
            return Ok(variations);
        }

        // Get a specific variation
        [HttpGet("Variations/{id}")]
        public async Task<ActionResult<Variation>> GetVariation(Guid id)
        {
            var variation = await _variationRepository.GetVariationAsync(id);

            if (variation == null)
            {
                return NotFound();
            }

            return variation;
        }

        // Create a new variation
        [HttpPost("Variations/{menuItemId}")]
        public async Task<ActionResult<Variation>> PostVariation(Guid menuItemId, Variation variation)
        {
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _variationRepository.AddVariationAsync(variation);

            return CreatedAtAction(nameof(GetVariation), new { id = variation.Id }, variation);
        }

        // Update a variation
        [HttpPut("Variations/{id}")]
        public async Task<IActionResult> PutVariation(Guid id, Variation variation)
        {
            if (id != variation.Id)
            {
                return BadRequest();
            }

            try
            {
                await _variationRepository.UpdateVariationAsync(variation);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _variationRepository.VariationExistsAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Delete a variation
        [HttpDelete("Variations/{id}")]
        public async Task<IActionResult> DeleteVariation(Guid id)
        {
            var exists = await _variationRepository.VariationExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            await _variationRepository.DeleteVariationAsync(id);

            return NoContent();
        }
    }
}
