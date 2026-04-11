const { ThemeRepo, TagRepo } = require('../repositories/TaxonomyRepo');

class TaxonomyService {
  async getFullTaxonomy() {
    const [themes, tags] = await Promise.all([
      ThemeRepo.getAll(),
      TagRepo.getAll()
    ]);
    return { themes, tags };
  }

  async getEntryById(id, type) {
    try {
      // Safety check: ensure type is exactly 'theme' or 'tag'
      const Repo = (type === 'theme') ? ThemeRepo : TagRepo;
      
      if (!Repo) throw new Error("Invalid taxonomy type provided");

      const doc = await Repo.findById(id); 
      if (!doc) throw new Error(`${type} not found with ID: ${id}`);
      
      return doc;
    } catch (error) {
      console.error(`Database Error in getEntryById:`, error.message);
      throw error; // This sends the message to the Controller's catch block
    }
  }

  async syncTaxonomy(data, type) {
    if (type === 'theme') {
      if (!data.Theme_ID) throw new Error("Theme_ID is required");
      return await ThemeRepo.upsert(data);
    } else {
      if (!data.Tag_ID) throw new Error("Tag_ID is required");
      return await TagRepo.upsert(data);
    }
  }

  async removeEntry(id, type) {
    return type === 'theme' ? await ThemeRepo.delete(id) : await TagRepo.delete(id);
  }
}

module.exports = new TaxonomyService();