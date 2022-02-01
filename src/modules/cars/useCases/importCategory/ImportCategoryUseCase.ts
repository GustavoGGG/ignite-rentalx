import { parse as csvParse } from "csv-parse";
import fs from "fs";
import { ICategoriesRepository } from "../../repositories/protocols/ICategoriesRepository";

interface IRequest {
  file: Express.Multer.File;
}

interface IImportCategory {
  name: string;
  description: string;
}
class ImportCategoryUseCase {

  constructor(private categoriesRepository: ICategoriesRepository) { }

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const categories: IImportCategory[] = []

      const parseFile = csvParse()

      stream.pipe(parseFile)
      parseFile.on("data", async (line) => {
        const [name, description] = line
        categories.push({ name, description })
      })
        .on("end", () => {
          fs.promises.unlink(file.path)
          resolve(categories)
        })
        .on("error", (err) => {
          reject(err)
        })

    })
  }
  async execute({ file }: IRequest): Promise<void> {
    const categories = await this.loadCategories(file);
    categories.map(category => {
      const { name } = category
      const categoryExists = this.categoriesRepository.findByName(name)
      if (!categoryExists) {
        this.categoriesRepository.create(category)
      }
    })
  }
}

export { ImportCategoryUseCase }