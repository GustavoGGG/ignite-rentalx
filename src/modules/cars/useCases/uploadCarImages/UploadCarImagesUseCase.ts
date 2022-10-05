import { ICarsImagesRepository } from "@modules/cars/repositories/protocols/ICarsImagesRepository";
import { inject, injectable } from "tsyringe";
import { deleteFile } from "@utils/file"
import { IStorageProvider } from "@shared/container/providers/StorageProvider/protocols/IStorageProvider";

interface IRequest {
  car_id: string;
  images_name: string[]
}

const PATH_CARS = 'cars'
@injectable()
class UploadCarImagesUseCase {

  constructor(
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {

  }
  async execute({ car_id, images_name }: IRequest): Promise<void> {
    images_name.map(async (image) => {
      // if (image) {
      //   await deleteFile(`./tmp/cars/${image}`)
      // }
      await this.carsImagesRepository.create({ car_id, image_name: image });
      await this.storageProvider.save(image, PATH_CARS);
    })
  }

}

export { UploadCarImagesUseCase }