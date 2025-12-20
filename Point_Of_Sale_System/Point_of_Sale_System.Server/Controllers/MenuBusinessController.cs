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
        [HttpGet("{businessId}/GetMenuItems")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems([FromRoute] Guid businessId)
        {
            var menuItems = await _menuRepository.GetMenuItemsAsync(businessId);
            return Ok(menuItems);
        }

        // Get a specific menu item
        [HttpGet("{id}/GetMenuItem")]
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
        [HttpPost("PostMenuItem")]
        public async Task<ActionResult<MenuItem>> PostMenuItem([FromBody] MenuItem menuItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _menuRepository.AddMenuItemAsync(menuItem);

            return Ok(menuItem);
        }

        // Update a menu item
        [HttpPut("PutMenuItem")]
        public async Task<IActionResult> PutMenuItem([FromBody] MenuItem menuItem)
        {
            try
            {
                await _menuRepository.UpdateMenuItemAsync(menuItem);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _menuRepository.MenuItemExistsAsync(menuItem.Id))
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
        [HttpDelete("{id}/DeleteMenuItem")]
        public async Task<IActionResult> DeleteMenuItem(Guid id)
        {
            var exists = await _menuRepository.MenuItemExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            //var variationsExist = await _variationRepository.GetVariationsAsync(id);
            //if (variationsExist.Count() != 0)
            //    return BadRequest("Variations still exist.");

            await _menuRepository.DeleteMenuItemAsync(id);

            return NoContent();
        }

        // ==========================================
        // Variation CRUD
        // ==========================================

        // Get all variations for a specific menu item
        [HttpGet("{menuItemId}/GetVariations")]
        public async Task<ActionResult<IEnumerable<Variation>>> GetVariations(Guid menuItemId)
        {
            var variations = await _variationRepository.GetVariationsAsync(menuItemId);
            return Ok(variations);
        }

        // Get a specific variation
        [HttpGet("{id}/GetVariation")]
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
        [HttpPost("PostVariations")]
        public async Task<ActionResult<Variation>> PostVariation(Variation variation)
        {
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _variationRepository.AddVariationAsync(variation);

            return CreatedAtAction(nameof(GetVariation), new { id = variation.Id }, variation);
        }

        // Update a variation
        [HttpPut("PutVariations")]
        public async Task<IActionResult> PutVariation(Variation variation)
        {
            try
            {
                await _variationRepository.UpdateVariationAsync(variation);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _variationRepository.VariationExistsAsync(variation.Id))
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
        [HttpDelete("{id}/DeleteVariation")]
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
