const SectionRepo = require('../repositories/SectionRepo');

class SectionService {
  async getAllSections() {
    return await SectionRepo.getAll();
  }

  async getSectionById(id) {
    return await SectionRepo.findById(id);
  }

  async getSectionsByBook(bookId) {
    return await SectionRepo.findByBook(bookId);
  }

  async syncSection(data) {
    // 1. Validate ID
    if (!data.Section_ID) {
      throw new Error("Section_ID is required for manual entry");
    }

    // 2. SAFETY CHECK: Numeric parsing for Section_Order
    // This prevents the "Cast to Number failed for value NaN" error
    const parsedOrder = parseInt(data.Section_Order, 10);
    
    if (isNaN(parsedOrder)) {
      data.Section_Order = 0; // Default to 0 if the input was empty or invalid text
    } else {
      data.Section_Order = parsedOrder;
    }

    // 3. Upsert to DB
    return await SectionRepo.upsert(data);
  }

  async removeSection(id) {
    return await SectionRepo.delete(id);
  }
}

module.exports = new SectionService();